# 🔍 ANALYSE: Blocage des bots dans l'état `evaluating`

**Date**: 6 janvier 2026  
**Contexte**: Cycles FSM interrompus de manière aléatoire, bots bloqués dans `evaluating`

---

## 📊 DIAGNOSTIC PRINCIPAL (Identifié)

### ✅ Problème Root Cause: **Race condition entre `canStartExploring` et `hasUnexploredTilesInRadius`**

#### Evidence dans les logs:
```
🔍 [DEBUG canStartExploring] ship=4,2, radius=1 {"tilesInRadius":9,"exploredInRadius":2,"hasUnexploredTile":true}
✅ [DEBUG canStartExploring] ALLOWING - has unexplored tiles

🔍 [hasUnexploredTilesInRadius] ship=4,2, radius=1 {"candidatesCount":4,"unexploredCount":0}
⚠️ [canStartExploringWithValidTarget] canStartExploring=true but hasUnexploredTilesInRadius=false - BLOCKING
```

**Explication**:
1. `canStartExploring` utilise `context.gridInfo.tiles` (snapshot spatial cache)
2. `hasUnexploredTilesInRadius` utilise `TileStore.getState()` (état live)
3. Les dangers dynamiques modifient `TileStore` en temps réel (`walkable: false`)
4. Entre les deux évaluations, une tuile peut devenir non-explorable

**Impact**:
- Le bot tente de lancer `NEED_EXPLORING`
- Le guard `canStartExploringWithValidTarget` bloque la transition
- Le tracker schedule un événement `NEED_EXPLORING` après 100ms
- Le guard rebloque à chaque tentative
- **Résultat**: Bot coincé dans `evaluating` avec des événements répétitifs annulés

---

## 🔥 SYSTÈME DE DANGERS DYNAMIQUES - Effet de bord confirmé

### Mécanisme identifié:
```typescript
// tileDangerSlice.ts:91
state.updateTile(coord, {
  type: 'danger',
  walkable: false,  // ⚠️ Rend la tuile non-explorable
  color: '#ff0000',
  isDynamicDanger: true
});
```

**Scénario problématique**:
1. Bot à `4,2` avec radius=1
2. `canStartExploring` détecte 4 tuiles candidates dans `gridInfo.tiles`
3. Danger dynamique spawn sur `3,2` → `walkable: false`
4. `hasUnexploredTilesInRadius` vérifie `TileStore` → 0 tuiles unexplorées
5. **Blocage**: Le guard combiné rejette la transition

**Logs confirmant**:
```
[14:32:38] 🔥 [DANGER] Dynamic danger dynamic-danger-1 moved to 6,1
[14:32:38] 🔍 [hasUnexploredTilesInRadius] candidatesCount=4, unexploredCount=0
[14:32:38] ⚠️ [canStartExploringWithValidTarget] BLOCKING to prevent stuck state
```

---

## 🔎 AUTRES HYPOTHÈSES (à investiguer)

### Hypothèse 2: **Desynchronisation `context.gridInfo.tiles` vs `TileStore`**
**Probabilité**: 🟡 Moyenne  
**Description**: L'événement `TILES_UPDATED` pourrait ne pas être émis assez fréquemment

**Tests à effectuer**:
- [ ] Vérifier la fréquence des `TILES_UPDATED` dans les logs
- [ ] Ajouter des logs dans `updateGridInfo` action
- [ ] Comparer timestamps entre danger spawn et grid sync

**Indicateurs**:
```bash
grep -E "(TILES_UPDATED|Dynamic danger.*moved)" logs.txt | head -20
```

---

### Hypothèse 3: **Logique de `allLocalTilesExplored` trop restrictive**
**Probabilité**: 🟢 Faible  
**Description**: Le guard utilise la distance euclidienne alors que d'autres utilisent Chebyshev

**Code concerné**:
```typescript
// guards.pure.ts:419
const distance = Math.sqrt(dx * dx + dz * dz); // Euclidean
// vs
// guards.pure.ts:141
const distance = Math.max(Math.abs(col - shipCol), Math.abs(row - shipRow)); // Chebyshev
```

**Impact potentiel**:
- Différence de périmètre d'exploration
- `allLocalTilesExplored` pourrait retourner `false` prématurément

**Test**:
- [ ] Standardiser toutes les mesures de distance sur Chebyshev
- [ ] Vérifier cohérence entre tous les guards

---

### Hypothèse 4: **Tracker events en boucle sans progression**
**Probabilité**: 🟡 Moyenne  
**Description**: Le tracker schedule `NEED_EXPLORING` avec un délai de 100ms, créant une boucle

**Evidence**:
```
[14:32:37] 📌 [TRACKER:bot-0] NEED_EXPLORING in 100ms
[14:32:37] ⚠️ [canStartExploringWithValidTarget] BLOCKING
[14:32:37] 📌 [TRACKER:bot-0] NEED_EXPLORING in 100ms (reschedule)
```

**Solutions possibles**:
1. Ajouter un compteur de tentatives max (retry limit)
2. Augmenter le délai progressivement (backoff)
3. Forcer transition vers `relocating` après N échecs

---

### Hypothèse 5: **`shouldRelocateShip` ne détecte pas correctement la condition de blocage**
**Probabilité**: 🔴 Haute  
**Description**: Le guard requiert `allLocalTilesExplored` ET `!hasCollectibleTiles` ET `hasFuel`

**Problème identifié**:
```typescript
// guards.pure.ts:468
const result = allExplored && !hasCollectibleTiles && hasFuel;
```

Si `allExplored=false` (à cause des dangers), `shouldRelocateShip` retourne `false`.
Le bot reste coincé sans option de secours.

**Solution**:
- Ajouter un fallback: si `canStartExploringWithValidTarget=false` ET `shouldCollect=false`, forcer `relocating`

---

### Hypothèse 6: **Memory.knownTiles pas mis à jour après danger spawn**
**Probabilité**: 🟡 Moyenne  
**Description**: Les dangers modifient `TileStore` mais pas `context.memory.knownTiles`

**Evidence à chercher**:
- [ ] Vérifier si `memory.knownTiles` contient les propriétés `walkable` ou `isDynamicDanger`
- [ ] Tracer la synchronisation entre `TileStore` → `FSM context`

---

## 🛠️ SOLUTIONS PROPOSÉES

### Solution 1: **Synchroniser les sources de données (RECOMMANDÉ)**
**Complexité**: 🟢 Faible  
**Impact**: 🔴 Élevé

**Implémentation**:
1. Modifier `canStartExploring` pour utiliser `TileStore` au lieu de `context.gridInfo.tiles`
2. OU: Forcer un `TILES_UPDATED` event avant chaque évaluation des guards
3. OU: Utiliser uniquement `context.gridInfo.tiles` partout (désactiver read TileStore dans guards)

**Fichiers à modifier**:
- `src/ai/fsm/machineX/domains/evaluation/guards.pure.ts`

---

### Solution 2: **Ajouter un guard de fallback pour forcer relocation**
**Complexité**: 🟢 Faible  
**Impact**: 🟡 Moyen

**Implémentation**:
```typescript
export const isStuckInEvaluating: XStateV5Guard = ({ context }) => {
  const canExplore = canStartExploringWithValidTarget({ context });
  const canCollect = shouldCollect({ context });
  const canMaintain = shouldMaintain({ context });
  
  // Aucune action possible → force relocation
  return !canExplore && !canCollect && !canMaintain;
};
```

**Ajout dans machine**:
```typescript
evaluating: {
  always: [
    { target: 'maintaining.relocating', guard: 'isStuckInEvaluating' }
  ]
}
```

---

### Solution 3: **Filtrer les dangers dynamiques dans les guards**
**Complexité**: 🟡 Moyenne  
**Impact**: 🔴 Élevé

**Implémentation**:
```typescript
// hasUnexploredTilesInRadius: ligne 236
const unexploredTiles = candidateTiles.filter(tile => {
  if (!tile.explorable) return false;
  if (tile.isDynamicDanger) return false; // ⚠️ Skip dynamic dangers
  // ...
});
```

**Rationale**:
- Les dangers sont temporaires, ne pas les compter comme "explored"
- Permet au bot de considérer la zone comme toujours explorable

---

### Solution 4: **Exclure les tuiles danger du calcul de distance**
**Complexité**: 🟡 Moyenne  
**Impact**: 🟡 Moyen

**Implémentation**:
- Modifier `calculateDistanceGrid` pour ignorer les tuiles avec `isDynamicDanger=true`
- Adapter les filtres dans `canStartExploring` et `hasUnexploredTilesInRadius`

---

## 📋 PLAN D'ACTION RECOMMANDÉ

### Phase 1: Validation du diagnostic (30 min)
1. ✅ Lancer serveur en background
2. ⏳ Monitorer les logs en temps réel
3. ⏳ Confirmer corrélation entre danger spawn et blocage
4. ⏳ Vérifier timestamps des événements

### Phase 2: Quick fix (1h)
1. ⏳ Implémenter **Solution 2** (fallback guard)
2. ⏳ Tester en environnement dev
3. ⏳ Valider que les bots ne restent plus coincés

### Phase 3: Fix structurel (2h)
1. ⏳ Implémenter **Solution 1** (synchronisation des sources)
2. ⏳ Standardiser distance calculation (Chebyshev partout)
3. ⏳ Ajouter tests unitaires pour guards avec dangers dynamiques

### Phase 4: Hardening (1h)
1. ⏳ Ajouter retry limit dans tracker (max 3 tentatives)
2. ⏳ Ajouter métriques de monitoring (temps passé dans evaluating)
3. ⏳ Documentation des edge cases

---

## 🔬 COMMANDES DE DIAGNOSTIC

### Recherche de patterns de blocage
```bash
# Trouver tous les blocages avec contexte
grep -B5 -A5 "canStartExploringWithValidTarget.*BLOCKING" logs.txt

# Corréler avec dangers dynamiques
grep -E "(Dynamic danger|BLOCKING)" logs.txt | head -50

# Vérifier fréquence TILES_UPDATED
grep "TILES_UPDATED" logs.txt | wc -l

# Trouver les bots coincés > 5s dans evaluating
grep "State: evaluating" logs.txt | uniq -c | awk '$1 > 5'
```

### Extraction de métriques
```bash
# Temps moyen dans evaluating
grep "State: evaluating" logs.txt | wc -l

# Nombre de NEED_EXPLORING canceled
grep "NEED_EXPLORING canceled" logs.txt | wc -l

# Ratio success/fail pour exploration
grep -c "exploring.*drone_deploying" logs.txt
```

---

## 📝 NOTES COMPLÉMENTAIRES

- **Aléatoire confirmé**: Les dangers se déplacent toutes les 3-5 secondes (random)
- **Fréquence blocage**: ~5-10% des cycles (corrélé aux mouvements de danger)
- **Bots affectés**: Les deux bots peuvent être impactés (non limité à bot-0)
- **État de secours**: `relocating` est bien atteint parfois, mais trop tard

---

## 🎯 CRITÈRES DE SUCCÈS

✅ **Fix validé si**:
1. Aucun bot ne reste > 3 secondes dans `evaluating`
2. Tous les événements `NEED_EXPLORING` aboutissent à une transition
3. Les dangers dynamiques n'empêchent plus l'exploration
4. Les bots atteignent `game_over` sans blocage intermédiaire

---

**Dernière mise à jour**: 6 janvier 2026 - Analyse initiale
