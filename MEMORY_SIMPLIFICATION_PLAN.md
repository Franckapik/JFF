# 🧠 Plan de Simplification de la Mémoire des Bots

## 📋 Vue d'ensemble

Ce plan vise à simplifier et unifier la gestion de la mémoire des bots en supprimant les doublons et la complexité inutile. Le modèle simplifié suit le gameplay réel :

- **Drone** : Explore et découvre les ressources
- **Vaisseau** : Collecte les ressources des tuiles explorées
- **Workflow** : `Tuile inconnue → EXPLORED (par drone) → COLLECTED (par vaisseau)`

## 🎯 Objectifs

1. Supprimer la notion de "prospected" (inutile)
2. Éliminer les doublons de stockage des données
3. Unifier la mémoire dans une seule structure `knownTiles`
4. Utiliser uniquement les fichiers existants
5. Simplifier les actions et les événements FSM

---

## 📝 PROMPT 1 : Modifier le contexte initial FSM

**Fichier cible** : `/src/ai/fsm/machine/context/initialContext.js`

**Instructions** :
Modifie la section `memory` du contexte initial pour simplifier et unifier la structure :

1. **Remplace** les propriétés existantes redondantes par une structure unifiée
2. **Supprime** : `knownResources`, `explorationCount`, `collectedResources`, `exploredTiles`, `prospectedTiles`
3. **Ajoute** : `knownTiles: new Map()` et `stats` avec compteurs unifiés
4. **Conserve** : `knownDangers`, `stateHistory`, `transitionHistory`

**Nouvelle structure attendue** :
```javascript
memory: {
  knownTiles: new Map(), // Structure unifiée : coord -> TileData
  knownDangers: [], // Conservé
  stats: {
    tilesExplored: 0,
    tilesCollected: 0,
    totalResourcesFound: 0,
    lastExploration: null,
    lastCollection: null
  },
  stateHistory: [BOT_STATES.EVALUATING], // Conservé
  transitionHistory: [] // Conservé
}
```

**Structure TileData** (pour référence) :
```javascript
{
  coord: "1,2",
  explored: true,
  collected: false,
  exploredAt: 1234567890,
  hasResources: true,
  resources: { food: 5, debris: 2, special: 0 },
  collectedAt: null,
  collectedBy: null
}
```

---

## 📝 PROMPT 2 : Simplifier les actions d'exploration des drones

**Fichier cible** : `/src/ai/fsm/machine/actions/core/droneExploringActions.js`

**Instructions** :
Simplifie les actions d'exploration des drones en supprimant la logique de prospection :

1. **Supprime** toutes les actions liées à la prospection : `droneMarkTileProspected`, `droneProspectTile`, etc.
2. **Remplace** par une seule action unifiée : `droneExploresTile`
3. **Cette action doit** :
   - Créer ou mettre à jour une entrée dans `context.memory.knownTiles`
   - Marquer la tuile comme `explored: true`
   - Enregistrer les ressources trouvées
   - Mettre à jour les statistiques dans `context.memory.stats`

**Action attendue** :
```javascript
droneExploresTile: (context, event) => {
  // Logique pour ajouter/mettre à jour dans knownTiles Map
  // Retourner contexte mis à jour avec mémoire unifiée
}
```

**Note** : Garde les exports existants pour la rétrocompatibilité mais fais-les pointer vers la nouvelle action unifiée.

---

## 📝 PROMPT 3 : Ajouter actions de collecte pour les vaisseaux

**Fichier cible** : `/src/ai/fsm/machine/actions/core/shipCollectingActions.js`

**Instructions** :
Ajoute une action pour gérer la collecte des ressources par les vaisseaux :

1. **Ajoute** une nouvelle action : `shipCollectsTile`
2. **Cette action doit** :
   - Vérifier que la tuile est explorée avant collecte
   - Marquer la tuile comme `collected: true`
   - Mettre à jour `collectedAt` et `collectedBy`
   - Incrémenter les statistiques de collecte
3. **Inclure** des fonctions helpers :
   - `getCollectibleTiles(context)` : tuiles explorées non collectées avec ressources
   - `isTileCollectible(context, coord)` : vérifier si une tuile peut être collectée

**Action attendue** :
```javascript
shipCollectsTile: (context, event) => {
  // Vérifier que tuile explorée
  // Marquer comme collectée
  // Mettre à jour stats
  // Retourner contexte mis à jour
}
```

---

## 📝 PROMPT 4 : Nettoyer les états FSM d'exploration

**Fichier cible** : `/src/ai/fsm/machine/states/exploringState.js`

**Instructions** :
Nettoie l'état d'exploration en supprimant toutes les références à la prospection :

1. **Supprime** toutes les transitions liées à `PROSPECTING_COMPLETE`, `droneProspectTile`, etc.
2. **Remplace** par des événements unifiés : `DRONE_EXPLORES_TILE`
3. **Supprime** les propriétés `prospectedTiles` du contexte
4. **Simplifie** les actions pour utiliser `droneExploresTile`
5. **Nettoie** tous les commentaires et références à la prospection

**Changements attendus** :
- Transitions plus simples
- Actions unifiées
- Suppression de la logique de prospection complexe

---

## 📝 PROMPT 5 : Mettre à jour les hooks de tracking

**Fichier cible** : `/src/ai/fsm/hooks/useFSMDroneTracker.js`

**Instructions** :
Simplifie le hook de tracking des drones :

1. **Supprime** tous les appels à `markTileAsProspected`
2. **Garde** uniquement `markTileAsExplored` pour synchroniser avec TileStore
3. **Change** l'événement envoyé de `PROSPECTING_COMPLETE` vers `DRONE_EXPLORES_TILE`
4. **Simplifie** la logique de détection des ressources
5. **Supprime** les timeouts et logiques complexes de prospection

**Changements attendus** :
- Hook plus simple et direct
- Un seul événement : `DRONE_EXPLORES_TILE`
- Synchronisation TileStore simplifiée

---

## 📝 PROMPT 6 : Nettoyer TileStore des références prospection

**Fichier cible** : `/src/stores/useTileStore/slices/tileMarkSlice.js`

**Instructions** :
Supprime la fonction `markTileAsProspected` et nettoie les références :

1. **Supprime** complètement `markTileAsProspected`
2. **Garde** uniquement `markTileAsExplored` et `markTileAsCollected`
3. **Supprime** les propriétés `prospected`, `prospectionResults`, `prospectionTimestamp`
4. **Nettoie** les commentaires faisant référence à la prospection

**Fonctions à conserver** :
- `markTileAsExplored(coord)`
- `markTileAsCollected(coord)`

**Fonctions à supprimer** :
- `markTileAsProspected(coord, resources)`

---

## 📝 PROMPT 7 : Mettre à jour les reducers de contexte

**Fichier cible** : `/src/ai/fsm/machine/reducers/context.js`

**Instructions** :
Ajoute des reducers pour la nouvelle structure de mémoire unifiée :

1. **Ajoute** des helpers pour la gestion des `knownTiles`
2. **Supprime** les anciens reducers liés à `exploredTiles`, `prospectedTiles`
3. **Ajoute** des fonctions utilitaires :
   - `getExploredTiles(context)`
   - `getCollectibleTiles(context)`
   - `isTileKnown(context, coord)`
   - `isTileCollectible(context, coord)`

**Reducers attendus** :
```javascript
// Reducers pour la mémoire unifiée
memoryReducers: {
  markTileExplored,
  markTileCollected,
  // ... autres reducers simplifiés
}
```

---

## 📝 PROMPT 8 : Mettre à jour le debug panel

**Fichier cible** : `/src/components/HUD/debugger/useDebuggerData.js`

**Instructions** :
Mets à jour les données du debugger pour utiliser la nouvelle structure :

1. **Change** `botMemory` pour utiliser `context.memory.knownTiles`
2. **Ajoute** les nouvelles propriétés : `exploredTiles`, `collectibleTiles`
3. **Supprime** les références aux anciennes structures
4. **Mets à jour** les données simulées pour correspondre au nouveau modèle

**Structure attendue** :
```javascript
const botMemory = entity ? {
  knownTiles: Array.from(context.memory.knownTiles.values()),
  stats: context.memory.stats,
  // ... autres propriétés simplifiées
} : null;
```

---

## 📝 PROMPT 9 : Vérification et tests finaux

**Instructions de vérification** :
Une fois tous les prompts précédents exécutés, vérifie que :

1. **Aucune référence** à "prospected", "prospecting", "prospection" ne reste dans le code
2. **La mémoire** utilise uniquement `knownTiles` Map
3. **Les actions** sont simplifiées et unifiées
4. **Le debug panel** affiche correctement les nouvelles données
5. **Les événements FSM** utilisent `DRONE_EXPLORES_TILE` au lieu des anciens événements

**Fichiers à vérifier** :
- Rechercher "prospect" dans tout le projet
- Vérifier que `knownTiles` est utilisé partout
- S'assurer que les anciens arrays sont supprimés
- Tester que le debug panel fonctionne

---

## ✅ Checklist de completion

- [ ] Prompt 1 : Contexte initial modifié
- [ ] Prompt 2 : Actions drone simplifiées
- [ ] Prompt 3 : Actions vaisseau ajoutées
- [ ] Prompt 4 : États FSM nettoyés
- [ ] Prompt 5 : Hooks mis à jour
- [ ] Prompt 6 : TileStore nettoyé
- [ ] Prompt 7 : Reducers mis à jour
- [ ] Prompt 8 : Debug panel mis à jour
- [ ] Prompt 9 : Vérification finale

## 🎯 Résultat attendu

Après exécution de tous les prompts :
- Modèle simplifié : `unknown → explored → collected`
- Une seule source de vérité : `knownTiles` Map
- Actions unifiées et claires
- Suppression complète de la notion de prospection
- Debug panel fonctionnel avec nouvelles données
