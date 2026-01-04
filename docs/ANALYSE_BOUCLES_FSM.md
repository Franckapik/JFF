# Analyse des Boucles Infinies FSM - 4 janvier 2026

## Contexte
Observation des logs du FSM pour identifier les scénarios qui causent des boucles infinies ou des comportements étranges.

---

## ✅ BUG #1 : Double Collecte sur Tuile Vidée - **FIXÉ**

### Description
Après une collecte réussie, le FSM retournait immédiatement à `ship_moving_to_tile` avec la MÊME tuile comme cible, puis tentait une 2e collecte qui échouait.

### Logs Caractéristiques
```
📦 [bot-0] Resources transferred from tile:
  "tileCoord": "2,4",
  "tileResourcesAfter": { "total": 0 },
  "tileCollectedFlag": true

📋 [TRACKER] State: {"collecting":"ship_moving_to_tile"}
🚢 [TRACKER] Ship moving
   Target: 2,4                          ← MÊME TUILE !
   Distance: 0.00 units, Travel time: 0ms (already on tile)

⚠️ WARN Target tile has no resources to collect
  "coord": "2,4",
  "resources": { "total": 0 }
```

### Cause Racine
La transition `SHIP_LOAD_RESOURCES` dans `ship_collecting` avait un guard `hasMoreCollectibleTiles` qui retournait `true` car il ne vérifiait pas si la tuile courante était la seule restante.

**Dans XState v5, les guards sont évalués AVANT les actions.** Donc `memory.knownTiles` n'était pas encore synchronisé au moment de l'évaluation du guard.

### ✅ Fix Appliqué (4 janvier 2026)
Modification du guard `hasMoreCollectibleTiles` dans `domains/collection/guards.pure.ts` :
- Le guard exclut maintenant la tuile courante (`vehicle.targetVehicleTile.position.coord`) lors de la recherche de tuiles collectibles
- Cela évite que le guard retourne `true` alors qu'il ne reste que la tuile en cours de vidage

---

## 🔴 BUG #2 : Désynchronisation Mémoire FSM / TileStore

### Description
`memory.knownTiles` contient des ressources qui n'existent pas dans le TileStore.

### Logs Caractéristiques
```
🎯 [bot-0] Targeting explored tile with resources:
  "coord": "2,3",
  "resources": { "total": 1039 }        ← Valeur dans memory.knownTiles

⚠️ WARN Target tile has no resources to collect
  "coord": "2,3",
  "resources": { "total": 0 }           ← Valeur réelle dans TileStore
```

### Cause Racine
Lors de `assignDroneScanningContext`, les ressources sont copiées depuis `context.gridInfo.tiles` (qui est une copie stale) au lieu du TileStore frais.

### Fix Suggéré
1. Dans `assignDroneScanningContext`, lire les ressources depuis `useTileStore.getState().tiles[coord]`
2. Ou synchroniser `context.gridInfo.tiles` avec le TileStore à chaque cycle

---

## 🔴 BUG #3 : Blocage dans ship_moving_to_tile Sans Cible

### Description
Après synchronisation, si aucune tuile alternative n'est trouvée, le FSM reste bloqué dans `ship_moving_to_tile` avec 0 événements planifiés.

### Logs Caractéristiques
```
⚠️ WARN No alternative tiles found after synchronization

📋 [TRACKER] State: {"collecting":"ship_moving_to_tile"}
🚢 [TRACKER] Ship moving
📋 [TRACKER] Scheduling 0 events for: {"collecting":"ship_moving_to_tile"}
🔄 [FSM] State: {"collecting":"ship_moving_to_tile"} | Status: active
                                        ↑ BLOQUÉ !
```

### Cause Racine
La machine ne définit pas de transition de sortie pour `ship_moving_to_tile` quand `targetVehicleTile = null`.

### Fix Suggéré
1. Ajouter une transition `always` dans `ship_moving_to_tile` :
   ```typescript
   always: [
     { target: '#machineXV5Pure.evaluating', guard: 'noMoreCollectibleTiles' }
   ]
   ```
2. Ou modifier le tracker pour envoyer `NO_COLLECTIBLE_TILES` quand aucun événement n'est planifié

---

## 🟡 BUG #4 : Re-exploration de Tuile Déjà Explorée

### Description
Le drone est parfois envoyé vers une tuile qui a déjà été explorée et collectée.

### Logs Caractéristiques
```
🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
  "targetTile": "2,3"                   ← Tuile déjà explorée/collectée

🗺️ [TileMatrix] Tiles stats: {"explored":2,"collected":2}
```

### Cause Potentielle
`assignDroneDeployingContext` ne filtre pas les tuiles déjà dans `memory.knownTiles`.

### Fix Suggéré
1. Filtrer les tuiles candidates : `explored !== true` dans `gridInfo.tiles`
2. Exclure les coordonnées présentes dans `memory.knownTiles`

---

## 🟡 BUG #5 : Tuile de Départ Non Exclue

### Hypothèse
La tuile de départ (3,3, type="depart") pourrait être incluse dans les candidats d'exploration.

### Vérification Nécessaire
Confirmer que `type === "depart"` est bien exclu dans `assignDroneDeployingContext`.

### Fix Suggéré
```typescript
const candidates = Object.values(gridInfo.tiles).filter(tile => 
  tile.type !== 'depart' &&
  !tile.explored &&
  distance(tile.coord, vehicleCoord) <= exploringRadius
);
```

---

## 🔴 BUG #6 : Re-exploration Infinie de la Même Tuile (Nouveau - 4 janvier 2026)

### Description
Le drone explore en boucle infinie la même tuile (ex: `4,2`), avec `explorationCount` qui augmente indéfiniment.

### Logs Caractéristiques
```
📡 [bot-0] Entrée dans l'état DRONE_SCANNING
  "scannedTile": "4,2",
  "explorationCount": 46

📡 [bot-0] Entrée dans l'état DRONE_SCANNING
  "scannedTile": "4,2",
  "explorationCount": 47

📡 [bot-0] Entrée dans l'état DRONE_SCANNING
  "scannedTile": "4,2",
  "explorationCount": 48
```

### Cause Identifiée (2 problèmes)
1. **`assignDroneDeployingContext`** : Ne filtrait pas les tuiles déjà explorées du TileStore frais
2. **`assignDroneScanningContext`** : Ajoutait la tuile à `knownTiles` SANS vérifier les doublons

### ✅ Fix Appliqué (4 janvier 2026)

#### Fix 1: Filtrer les tuiles explorées dans `assignDroneDeployingContext`
```typescript
// Lire les tuiles fraîches du TileStore + memory.knownTiles
const tileStoreState = useTileStore.getState();
const freshTiles = tileStoreState?.tiles || tiles;
const exploredCoords = new Set(
  (context.memory?.knownTiles ?? [])
    .filter(t => t?.explored)
    .map(t => t?.position?.coord)
);

// Filtrer les tuiles explorées
const unexploredTiles = candidateTiles.filter(tile => {
  const freshTile = freshTiles[coord];
  if (freshTile?.explored) return false;
  if (exploredCoords.has(coord)) return false;
  if (tile.type === 'depart') return false;
  return true;
});
```

#### Fix 2: Éviter les doublons dans `assignDroneScanningContext`
```typescript
const isAlreadyKnown = existingKnownTiles.some(
  t => t?.position?.coord === scannedCoord
);

const updatedKnownTiles = isAlreadyKnown
  ? existingKnownTiles.map(t => 
      t?.position?.coord === scannedCoord ? exploredTile : t
    )
  : [...existingKnownTiles, exploredTile];
```

---

## 🔴 BUG #7 : Boucle d'Exploration Persistante Malgré Fix #6 (4 janvier 2026 - 14:07)

### Description
Après application des fixes du bug #6, le drone continue à explorer la même tuile (`4,2`) de façon répétée. L'`explorationCount` augmente (75→82), le `knownTilesCount` augmente également (74→81), mais le TileMatrix montre seulement 6 tuiles explorées sur 37 au total.

### Logs Caractéristiques
```
🔵 INFO [14:06:57] [Evaluating] → NEED_EXPLORING (no collectible tiles or ship at capacity)
🟠 ACTION [14:06:59] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
  "targetTile": "4,2"

🟠 ACTION [14:06:59] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
  "scannedTile": "4,2",
  "explorationCount": 75

🔵 INFO [14:07:01] [Evaluating] Conditions
  "knownTilesCount": 75

🟠 ACTION [14:07:01] 🚁 [bot-0] Entrée dans l'état DRONE_DEPLOYING
  "targetTile": "4,2"  ← ENCORE LA MÊME TUILE !

🟠 ACTION [14:07:02] 📡 [bot-0] Entrée dans l'état DRONE_SCANNING
  "scannedTile": "4,2",
  "explorationCount": 76

[... se répète jusqu'à explorationCount: 82]

🗺️ [TileMatrix] Tiles stats: {"total":37,"explored":6,"collected":4}
```

### Indicateurs Contradictoires
1. `knownTilesCount` augmente (74→81) : la FSM pense ajouter de nouvelles tuiles
2. `explorationCount` augmente (75→82) : le drone scanne à chaque fois
3. TileMatrix reste stable : **seulement 6 tuiles réellement explorées** sur 37
4. Le drone cible toujours `"4,2"` malgré le filtre des tuiles explorées

### Causes Potentielles

#### Hypothèse 1 : Le filtre des tuiles explorées ne fonctionne pas
- Les logs montrent `candidatesCount` mais pas `unexploredCount` dans les logs récents
- Possible que `freshTiles[coord]?.explored` soit `false` même si la tuile a été scannée
- Possible que `exploredCoords` ne contienne pas la tuile 4,2

#### Hypothèse 2 : TileStore pas synchronisé après `assignDroneScanningContext`
- `assignDroneScanningContext` marque `explored: true` dans `memory.knownTiles`
- Mais le TileStore n'est peut-être pas mis à jour immédiatement
- Au prochain cycle, `assignDroneDeployingContext` lit un TileStore stale où 4,2 n'est pas marqué exploré

#### Hypothèse 3 : Rayon d'exploration trop petit
- `exploringRadius: 1` = seulement 6 tuiles autour de (3,3)
- Si ces 6 tuiles sont toutes explorées, le drone devrait s'arrêter mais continue
- Possible que `canStartExploring` retourne true même sans tuile non-explorée disponible

#### Hypothèse 4 : Le navire ne se déplace jamais
- Le navire reste sur (3,3) et explore toujours dans le même rayon de 1
- Une fois les 6 tuiles du rayon explorées, il devrait soit :
  - Passer en collecte si des ressources existent
  - Élargir le rayon d'exploration
  - Se déplacer vers une zone non explorée

### Impact
- Gaspillage de fuel (fuel: 99→92 en 7 cycles inutiles)
- Aucune progression dans l'exploration de la matrice
- 31 tuiles restantes jamais explorées (37 total - 6 explorées)
- Le bot est bloqué en exploration infinie locale

### Fix Proposé

#### ✅ Solution Immédiate : Guard Combiné (IMPLÉMENTÉ)

**Problème identifié** : Incohérence entre `canStartExploring` (guard) et `assignDroneDeployingContext` (action) :
- Le guard lit `context.gridInfo.tiles` (peut être stale)
- L'action lit `useTileStore.getState().tiles` (fresh) + `memory.knownTiles`
- Résultat : le guard autorise la transition mais l'action ne trouve aucune tuile

**Fix appliqué** :
1. Créé nouveau guard `hasUnexploredTilesInRadius` qui lit le TileStore (comme l'action)
2. Créé guard combiné `canStartExploringWithValidTarget` qui vérifie les DEUX conditions
3. Remplacé la transition `NEED_EXPLORING` pour utiliser le guard combiné

**Fichiers modifiés** :
- [domains/evaluation/guards.pure.ts](domains/evaluation/guards.pure.ts) : +80 lignes (nouveaux guards)
- [machine.pure.v5.ts](machine.pure.v5.ts) : Import et utilisation du guard combiné

**Test de validation** :
```
✅ canStartExploring retourne true (tuiles non explorées dans context)
✅ hasUnexploredTilesInRadius retourne true (tuiles non explorées dans TileStore)
→ Transition autorisée, assignDroneDeployingContext réussit

❌ canStartExploring retourne true MAIS hasUnexploredTilesInRadius retourne false
→ Transition BLOQUÉE, FSM reste dans evaluating (évite l'état stuck)
```

**Avantages** :
- Fix immédiat et minimal
- Pas de changement d'architecture
- Garantit la cohérence guard ↔ action
- Empêche le FSM de se bloquer avec targetTile="unknown"

**Limitations** :
- Ne résout pas le problème sous-jacent (navire ne se déplace jamais)
- Seules 6 tuiles sont accessibles avec exploringRadius=1
- 31 tuiles restent non explorées

#### 📊 Observation Post-Fix (4 janvier 2026 - 14:07:18)

**État du système après implémentation du guard combiné :**

```
explorationCount: 82 (cycles d'exploration effectués)
knownTilesCount: 81 (tuiles dans memory.knownTiles)
TileMatrix: {"total": 37, "explored": 6, "collected": 4}
fuel: 92/100
damage: 0
hasCollectibleTiles: false
```

**Tuiles explorées (6/37)** :
- Tuiles autour de la base (3,3) dans un rayon de 1
- Liste exacte non affichée dans les logs, mais correspond au exploringRadius=1
- Environ 6 tuiles accessibles : (2,2), (2,3), (2,4), (3,2), (3,4), (4,2), (4,3)

**Tuiles collectées (4/37)** :
- Score total : 1987 (food: 119, debris: 1866, special: 2)
- Ressources collectées avant la boucle d'exploration

**Tuiles non explorées (31/37)** :
Exemples visibles dans TileMatrix samples :
- 0,3 - explored: false, collected: false
- 0,4 - explored: false, collected: false  
- 0,5 - explored: false, collected: false
- [... 28 autres tuiles hors rayon]

**Comportement observé** :
1. ✅ Le cycle FSM fonctionne : exploring → evaluating → exploring
2. ✅ Pas de blocage avec targetTile="unknown"
3. ✅ Le drone se déploie, scanne, retourne, et se re-déploie
4. ⚠️ **MAIS** : Le drone cible toujours la même tuile : `"targetTile": "4,2"`
5. ⚠️ explorationCount augmente (75→82) mais explored reste à 6
6. ⚠️ Le TileStore ne semble pas marquer la tuile 4,2 comme explorée

**Hypothèses sur la persistance de la boucle** :
1. **Tuile 4,2 pas marquée `explored: true` dans TileStore** après scan
   - `assignDroneScanningContext` ajoute à memory.knownTiles
   - Mais TileStore pas synchronisé ?
   
2. **Le filtre d'unexploredTiles échoue** :
   - `freshTiles[4,2]?.explored` retourne `false` ou `undefined`
   - `exploredCoords.has("4,2")` devrait retourner `true` mais peut-être format incorrect ?

3. **Seule la tuile 4,2 est candidate** :
   - Toutes les autres tuiles du rayon sont correctement marquées explorées
   - Mais 4,2 reste disponible à cause d'un bug de marquage

**Actions pour investigation** :
1. Vérifier que `assignDroneScanningContext` marque bien `explored: true` dans le tile
2. Vérifier que la tuile est bien ajoutée à `memory.knownTiles` avec `explored: true`
3. Ajouter un log dans `hasUnexploredTilesInRadius` pour voir quelles tuiles passent le filtre
4. Vérifier le format des coordonnées dans exploredCoords (string vs GridCoordinate)

**Conclusion partielle** :
Le fix du guard combiné **fonctionne** (pas de blocage), mais révèle un **bug plus profond** : 
- Le système de marquage explored ne fonctionne pas correctement
- La tuile 4,2 n'est jamais vraiment marquée comme explorée
- Ou le filtre ne détecte pas qu'elle l'est

**Prochaine étape recommandée** : Investiguer `assignDroneScanningContext` et le TileStore.

---

#### Solution 1 : Déplacement du Navire pour Exploration Progressive (⭐ RECOMMANDÉ pour v2)
Créer un nouvel état `ship_relocating` pour permettre au navire de se déplacer vers des zones non explorées :

**Architecture :**
```
evaluating 
  ├─→ [guard: hasUnexploredNearby] → exploring (drone cycle actuel)
  └─→ [guard: needsRelocation] → ship_relocating → exploring
```

**Nouveau guard `needsRelocation` :**
- Retourne `true` si toutes les tuiles dans `exploringRadius` sont explorées
- Retourne `true` si aucune tuile non explorée n'est trouvée dans le rayon

**Nouvelle action `assignShipRelocatingContext` :**
- Chercher le centroïde des tuiles non explorées dans `collectingRadius` (rayon plus large)
- Calculer la tuile la plus proche de ce centroïde
- Définir `targetVehicleTile` vers cette position
- Le navire se déplace, puis recommence l'exploration avec un nouveau rayon

**Avantages :**
- Explore toute la matrice progressivement
- Réutilise la logique de déplacement existante
- Pas de modification du rayon d'exploration

**Implémentation :**
1. Ajouter état `ship_relocating` dans la machine XState
2. Ajouter guard `needsRelocation` dans `domains/evaluation/guards.pure.ts`
3. Ajouter action `assignShipRelocatingContext` dans `domains/global/actions.assign.ts`
4. Modifier tracker pour gérer l'état `ship_relocating`

#### Solution 2 : Rayon d'Exploration Dynamique
Augmenter progressivement `exploringRadius` si aucune tuile non explorée n'est trouvée :

```typescript
// Dans assignDroneDeployingContext
let radius = exploringRadius;
while (unexploredTiles.length === 0 && radius <= collectingRadius) {
  radius++;
  candidateTiles = getTilesInRadius(vehicleCoord, radius);
  unexploredTiles = filterUnexplored(candidateTiles);
}
```

**Avantages :**
- Plus simple à implémenter
- Pas de nouvel état FSM

**Inconvénients :**
- Drone peut se retrouver très loin du navire
- Consommation de fuel importante
- Ne résout pas le problème à long terme (rayon max = 3)

#### Solution 3 : Mode "Survey" - Exploration Systématique
Créer un mode d'exploration systématique qui parcourt toute la grille :

**Architecture :**
```typescript
context.exploration.surveyMode = {
  enabled: false,
  targetZones: [
    { center: '0,0', explored: false },
    { center: '3,0', explored: false },
    { center: '6,0', explored: false },
    // ...
  ]
}
```

Quand toutes les tuiles locales sont explorées, activer le survey mode :
1. Diviser la matrice en zones de 3×3 tuiles
2. Le navire visite chaque zone dans l'ordre
3. Dans chaque zone, explorer toutes les tuiles avec le drone

**Avantages :**
- Exploration complète garantie
- Efficace en fuel (déplacements optimisés)

**Inconvénients :**
- Complexe à implémenter
- Nécessite des changements importants au contexte

### Recommandation
**Solution 1 (ship_relocating)** est la meilleure approche :
- Architecture claire et modulaire
- Réutilise les mécanismes existants
- Permet une exploration complète de la matrice
- Facile à tester et débugger

---

## Priorité des Corrections (Mise à jour 4 janvier 2026 - 16:10)

| Bug | Sévérité | Priorité | Status |
|-----|----------|----------|--------|
| #7 Incohérence guard/action | ✅ FIXÉ | - | **Guard combiné implémenté** |
| #7 Boucle exploration persistante | 🟡 Limitée | **2** | **Fix partiel** - reste limité au rayon local |
| #1 Double collecte | ✅ FIXÉ | - | Corrigé |
| #6 Re-exploration infinie | ⚠️ Partiellement | - | Fix insuffisant, voir #7 |
| #3 Blocage ship_moving | 🔴 Critique | 1 | À faire |
| #2 Désynchronisation | 🔴 Haute | 3 | À faire |
| #4 Re-exploration | 🟡 Moyenne | - | Intégré dans #6/#7 |
| #5 Tuile départ | ✅ FIXÉ | - | Intégré dans #6 |

---

## Fichiers à Modifier

1. `/src/ai/fsm/machineX/machine.pure.v5.ts`
   - Ajouter transition `always` dans `ship_moving_to_tile`
   
2. `/src/ai/fsm/machineX/domains/collection/guards.pure.ts`
   - ✅ `hasMoreCollectibleTiles` : exclure la tuile courante (FAIT)
   
3. `/src/ai/fsm/machineX/domains/collection/actions.assign.ts`
   - `assignShipLoadResourcesContext` : synchroniser memory AVANT transition
   
4. `/src/ai/fsm/machineX/domains/exploration/actions.assign.ts`
   - `assignDroneScanningContext` : lire ressources depuis TileStore frais, marquer explored=true
   - `assignDroneDeployingContext` : exclure tuiles déjà explorées + type "depart"

5. `/src/ai/fsm/machineX/hooks/trackers/simulatedTrackerCore.ts`
   - Gérer le cas où 0 événements sont planifiés → envoyer événement de sortie
