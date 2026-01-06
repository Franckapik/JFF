# 🎯 FIX: Gameplay des tuiles danger

## Règles de gameplay clarifiées ✅

Les tuiles danger ont les propriétés suivantes :
- **walkable: true** → Le ship peut passer dessus (prend +10% dégâts)
- **explorable: true** → Le drone peut les explorer (est détruit)
- **collectable: false** → Pas de ressources à collecter

## Problème initial identifié

Les tuiles danger étaient générées avec `walkable: false`, ce qui empêchait le ship de les traverser (gameplay incorrect).

## Solution appliquée ✅

### 1. Modifié la génération des tuiles danger

#### Dans `src/core/spatial/hexGrid.ts` (L315-325):
```typescript
newTileMap[tile.position.coord] = {
  ...tile,
  type: 'danger' as TileType,
  color: 'red',
  walkable: true,      // ✅ Ship can pass (takes damage)
  explorable: true,    // ✅ Drone can explore (gets destroyed)
  collectable: false,  // ❌ No resources to collect
  hasResources: false,
  resources: { food: 0, debris: 0, special: 0, total: 0 },
};
```

#### Dans `src/stores/useTileStore/slices/tileGenerationSlice.ts` (L267-274):
```typescript
const updatedTile: Tile = {
  ...tile,
  type: 'danger' as TileType,
  color: "red",
  walkable: true,      // ✅ Ship can pass (takes damage)
  explorable: true,    // ✅ Drone can explore (gets destroyed)
  collectable: false,  // ❌ No resources to collect
  hasResources: false,
  resources: { food: 0, debris: 0, special: 0, total: 0 }
};
```

#### Dans `src/stores/useTileStore/slices/tileDangerSlice.ts`:
**spawnDynamicDanger** (L91):
```typescript
state.updateTile(coord, {
  type: 'danger',
  walkable: true,      // ✅ Ship can pass (takes damage)
  explorable: true,    // ✅ Drone can explore (gets destroyed)
  collectable: false,  // ❌ No resources to collect
  color: '#ff0000',
  isDynamicDanger: true,
  dangerId: id,
});
```

**moveDynamicDanger** (L168):
```typescript
state.updateTile(newCoord, {
  type: 'danger',
  walkable: true,      // ✅ Ship can pass (takes damage)
  explorable: true,    // ✅ Drone can explore (gets destroyed)
  collectable: false,  // ❌ No resources to collect
  color: '#ff0000',
  isDynamicDanger: true,
  dangerId,
});
```

### 2. Mis à jour les scénarios BDD

**Fichier**: `docs/bot-spec/scenarios/danger-tiles.feature`

Ajout et clarification des scénarios :
- Propriétés de tuile danger (inclut walkable: true)
- Ship peut traverser une tuile danger (avec dégâts)
- Drone peut explorer une tuile danger (et est détruit)
- Ship ne peut pas collecter une tuile danger (collectable: false)

### 3. Vérification du code FSM

✅ **Guards vérifiés:**
- `shouldDestroyDroneOnDanger` : Vérifie si targetDroneTile.type === 'danger'
- `shouldApplyDangerDamage` : Vérifie si targetVehicleTile.type === 'danger'
- `canCollectTile` : Vérifie tile.collectable (exclut les dangers)

✅ **Machine FSM:**
- État `exploring.drone_destroyed` : Activé quand drone scanne danger
- État `maintaining.purchasing_drone` : Proposé après destruction drone
- Transition `collecting.ship_moving_to_tile → ship_collecting` : Applique dégâts si danger

## Impact des changements

| Aspect | Avant | Après |
|--------|-------|-------|
| Ship traverse danger | ❌ Bloqué (walkable:false) | ✅ Passe (+10% dégâts) |
| Drone explore danger | ✅ Possible | ✅ Possible (détruit) |
| Collecte sur danger | ❌ Impossible | ❌ Impossible (inchangé) |
| **Gameplay** | ❌ Incohérent | ✅ Cohérent |

## Comportement attendu maintenant

1. **Génération**: ~10% des tuiles sont des dangers (statiques + dynamiques)
2. **Ship sur danger**: 
   - Peut traverser la tuile
   - Subit +10% de dégâts (cumulatif)
   - Continue sa route
3. **Drone sur danger**:
   - Peut explorer la tuile (explorable=true)
   - Est détruit instantanément lors du scan
   - FSM → `drone_destroyed` → `evaluating` → `purchasing_drone`
4. **Collection**: Les dangers ne peuvent pas être collectés (collectable=false)

## Validations ✅

- ✅ **TypeScript compilation**: 0 erreurs
- ✅ **Build production**: Réussi
- ✅ **Scénarios BDD**: Mis à jour et cohérents
- ✅ **Guards FSM**: Vérifiés et corrects
- ✅ **Génération de tuiles**: Cohérente dans tous les emplacements

