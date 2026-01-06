# Architecture FSM vs Stores - Règles et Responsabilités

**Date de création** : 6 janvier 2026  
**Session** : Consolidation FSM - Élimination race conditions

---

## 📋 Résumé des corrections apportées

### Bugs résolus
1. **Blocage dans `evaluating`** : Race condition entre `canStartExploring` et `hasUnexploredTilesInRadius`
2. **Double collecte** : Re-sélection de tuile vidée corrigée via `hasMoreCollectibleTiles`
3. **Blocage `ship_moving_to_tile`** : Transition fallback vers `evaluating` si pas de cible
4. **Incohérence métrique distance** : Alignement sur Chebyshev (`calculateDistanceGrid`)

### Améliorations architecturales
- Unification des guards d'exploration (source unique de vérité)
- Ajout guard fallback `isStuckInEvaluating` (filet de sécurité)
- Harmonisation distance tracker ↔ guards

---

## 🎯 Responsabilités : FSM Context vs Zustand Stores

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSABILITÉS                              │
├─────────────────────────────────────────────────────────────────┤
│ FSM Context (context.*)                                         │
│  ├── vehicle.*          → État du véhicule (fuel, damage, pos)  │
│  ├── droneFleet.*       → État des drones                       │
│  ├── memory.knownTiles  → Historique d'exploration du bot       │
│  ├── memory.stats       → Statistiques du cycle courant         │
│  ├── config.*           → Paramètres de jeu                     │
│  └── gridInfo.spacing/radius → Paramètres statiques de la grille│
├─────────────────────────────────────────────────────────────────┤
│ Zustand Stores                                                  │
│  ├── TileStore          → État live des tuiles (walkable, etc)  │
│  ├── GameStore          → État global du jeu (radius, score)    │
│  └── PlayerStore        → Position joueur                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Règles d'architecture

### Règle 1 : Source de vérité pour les décisions

| Type de décision | Source recommandée | Raison |
|------------------|-------------------|--------|
| **Exploration (tuiles disponibles)** | `TileStore` + `context.memory.knownTiles` | État live + historique bot |
| **Collection (ressources)** | `context.memory.knownTiles` | Historique fiable des scans |
| **Distance/Position** | `context.gridInfo.spacing` | Paramètre statique du monde |
| **Rayon d'exploration** | `GameStore.getExplorationRadius()` | Valeur partagée multi-bot |

### Règle 2 : Guards doivent rester purs

❌ **INTERDIT** dans les guards purs :
```typescript
// ❌ MAUVAIS
export const badGuard: XStateV5Guard = ({ context }) => {
  const tiles = useTileStore.getState().tiles; // ❌ Appel store direct
  return Object.keys(tiles).length > 0;
};
```

✅ **AUTORISÉ** :
```typescript
// ✅ BON - Via helper qui encapsule l'accès store
export const goodGuard: XStateV5Guard = ({ context }) => {
  return hasUnexploredTilesInRadius({ context });
  // hasUnexploredTilesInRadius lit TileStore en interne (encapsulation)
};
```

### Règle 3 : Nommage des guards

| Type | Pattern | Exemple |
|------|---------|---------|
| **Guard pur** (contexte seul) | `should*`, `can*`, `is*`, `has*`, `needs*` | `shouldExplore`, `canCollect` |
| **Guard store-aware** (lit store) | `*WithStore`, `*FromStore` | `hasUnexploredTilesInRadius` |

---

## 🔧 Règle ESLint proposée

Ajout dans `eslint.config.js` ou fichier dédié :

```javascript
{
  "rules": {
    // Interdire appels stores dans guards purs
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.property.name=/use.*Store/] > MemberExpression[property.name='getState']",
        "message": "Les guards purs ne doivent pas appeler useTileStore.getState() ou useGameStore.getState(). Utilisez context.* ou des helpers encapsulés."
      }
    ]
  }
}
```

**Exceptions documentées** :
- `hasUnexploredTilesInRadius` : Lit `TileStore` pour garantir cohérence avec `assignDroneDeployingContext`

---

## 🚀 Migration recommandée : Supprimer `gridInfo.tiles`

### Problème actuel
`context.gridInfo.tiles` est un snapshot qui peut devenir obsolète quand les dangers dynamiques se déplacent.

### Plan de migration

#### Phase 1 (Actuelle) ✅
- Unifier guards pour utiliser `TileStore` + `memory.knownTiles`
- Garder `gridInfo.tiles` temporairement pour compatibilité

#### Phase 2 (Recommandée)
1. **Supprimer** `gridInfo.tiles` du contexte FSM
2. **Garder** uniquement :
   ```typescript
   gridInfo: {
     spacing: number;
     radius: number;
   }
   ```
3. **Migrer** tous les accès vers `TileStore` via helpers

#### Bénéfices
- ✅ Une seule source de vérité
- ✅ Pas de désynchronisation possible
- ✅ Réduction mémoire du contexte FSM

---

## 📊 Matrice : Où lire quoi ?

| Donnée | FSM Context | TileStore | GameStore | PlayerStore |
|--------|-------------|-----------|-----------|-------------|
| Position ship | ✅ `vehicle.coord` | | | |
| Position drone | ✅ `droneFleet.drones.explorer.coord` | | | |
| Tuile explorée ? | ✅ `memory.knownTiles[].explored` | ⚠️ Peut diverger | | |
| Tuile walkable ? | | ✅ `tiles[coord].walkable` | | |
| Danger présent ? | | ✅ `tiles[coord].type === 'danger'` | | |
| Radius exploration | | | ✅ `getExplorationRadius()` | |
| Spacing grille | ✅ `gridInfo.spacing` | | | |
| Position joueur | | | | ✅ `position` |

---

## 🎓 Exemples pédagogiques

### Exemple 1 : Guard exploration unifié

**AVANT** (race condition) :
```typescript
// Guard 1 : lit context.gridInfo.tiles
export const canStartExploring = ({ context }) => {
  const tiles = context.gridInfo?.tiles || {};
  // ... check tiles in radius from snapshot
};

// Guard 2 : lit TileStore (état live)
export const hasUnexploredTilesInRadius = ({ context }) => {
  const tiles = useTileStore.getState().tiles; // État live
  // ... check tiles in radius from live state
};
```

**APRÈS** (source unique) :
```typescript
export const canStartExploring = ({ context }) => {
  // Délègue à hasUnexploredTilesInRadius (source unique)
  return hasUnexploredTilesInRadius({ context });
};
```

### Exemple 2 : Fallback guard

```typescript
// Filet de sécurité quand aucune action n'est possible
export const isStuckInEvaluating = ({ context }) => {
  const canExplore = canStartExploring({ context });
  const canCollect = shouldCollect({ context });
  const needsMaintenance = shouldMaintain({ context });
  
  return !canExplore && !canCollect && !needsMaintenance;
};
```

Usage dans la machine :
```typescript
evaluating: {
  // Transition automatique si bloqué
  always: {
    target: 'maintaining.relocating',
    guard: 'isStuckInEvaluating'
  },
  // ... autres transitions
}
```

---

## 📝 Checklist pour nouveaux guards

Avant de créer un nouveau guard, vérifiez :

- [ ] Le guard est-il pur ? (pas d'effet de bord)
- [ ] Utilise-t-il `context.*` uniquement ou a-t-il besoin du store ?
- [ ] Si store requis, y a-t-il un helper existant ?
- [ ] Le nom suit-il la convention (`should*`, `can*`, etc.) ?
- [ ] Est-il testable en isolation (Node.js) ?
- [ ] La doc explique-t-elle quelle source de données il lit ?

---

## 🔍 Références

- [guards.pure.ts](../src/ai/fsm/machineX/domains/evaluation/guards.pure.ts) : Guards d'évaluation unifiés
- [machine.pure.v5.ts](../src/ai/fsm/machineX/machine.pure.v5.ts) : Machine FSM avec transitions fallback
- [edge-cases.feature](./bot-spec/scenarios/edge-cases.feature) : Scénarios de tests
- [ANALYSE_BLOCAGE_EVALUATING.md](../ANALYSE_BLOCAGE_EVALUATING.md) : Diagnostic initial

---

**Dernière mise à jour** : 6 janvier 2026  
**Auteur** : GitHub Copilot (Claude Sonnet 4.5)
