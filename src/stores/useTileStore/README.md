# Migration TypeScript du Tile Store

## Vue d'ensemble

Le tile store a été entièrement migré de JavaScript vers TypeScript, en conservant toutes les fonctionnalités existantes tout en ajoutant une sécurité de types stricte.

## Structure TypeScript

### Types principaux

- **`Tile`** : Interface complète d'une tuile avec toutes ses propriétés
- **`TileMap`** : Dictionnaire de tuiles indexées par coordonnées
- **`GridCoordinate`** : Coordonnée au format "x,z"
- **`WorldPosition`** : Position 3D {x, y, z}
- **`TileType`** : Types de tuiles (depart, fuel, repair, food, debris, special, danger, empty, water)
- **`TileBiome`** : Biomes (grassland, desert, snow, water, rock)

### Slices convertis

1. **tileBaseSlice.ts** - Gestion de base des tuiles
2. **tileResourceSlice.ts** - Gestion des ressources
3. **tilePathSlice.ts** - Pathfinding et calculs de distance
4. **tileMarkSlice.ts** - Marquage d'exploration
5. **tileFilterSlice.ts** - Filtrage et recherche de tuiles
6. **tileCoordinateSlice.ts** - Système de coordonnées
7. **tileGenerationSlice.ts** - Génération de grilles hexagonales

## Fonctionnalités préservées

- ✅ Toutes les fonctions existantes maintenues
- ✅ Logique FSM et compatibilité avec `initialContext.ts`
- ✅ Intégration avec les stores existants
- ✅ Performance optimisée avec types stricts
- ✅ Validation de types à l'exécution et à la compilation

## Types de sécurité ajoutés

- **Type guards** : `isTile()`, `isTileType()`, `isTileBiome()`
- **Validateurs** : `isValidGridCoord()`, `isValidWorldPosition()`
- **Assertions de type** : Utilisation de `as` pour les conversions sécurisées
- **Interfaces strictes** : Tous les paramètres et retours typés

## Import et utilisation

```typescript
import { useTileStore } from './stores/useTileStore/index.ts';
import type { Tile, GridCoordinate, WorldPosition } from './types';

// Utilisation typée
const store = useTileStore();
const tile: Tile | undefined = store.getTile("0,0");
const walkableTiles: Tile[] = store.getWalkableTiles();
```

## Compatibilité FSM

Le store est entièrement compatible avec la logique FSM :
- Types alignés avec `initialContext.ts`
- Support des coordonnées FSM (`GridCoordinate`, `TileCoordinate`)
- Intégration avec les constantes FSM
- Gestion des ressources selon les types `ResourceStats`

## Migration technique

- **Pas de changement d'API** : Toutes les fonctions conservent leur signature
- **Types ajoutés progressivement** : Migration incrémentale sans casser l'existant
- **Validation à l'exécution** : Les type guards assurent la sécurité à l'exécution
- **Performance maintenue** : Aucun overhead de performance introduit

## Test et validation

Un fichier de test `test/validation.ts` valide :
- L'intégrité de tous les slices
- La disponibilité des fonctions
- La validité des types
- L'import/export correct

Pour tester : `import { testTileStore } from './stores/useTileStore/test/validation';`
