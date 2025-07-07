# Types Partagés - React Three Vite Project

Ce dossier contient tous les types TypeScript standardisés du projet, organisés de façon modulaire pour faciliter la maintenance et l'évolutivité.

## 📁 Structure

```
src/types/
├── coordinates.ts    # Types de coordonnées et positions
├── resources.ts      # Types de ressources et éléments de jeu
├── vehicle.ts        # Types de véhicules de base
├── drone.ts          # Types spécifiques aux drones
├── fsm.ts           # Types pour la machine à états finis
├── examples.ts      # Exemples d'utilisation pratique
├── index.ts         # Point d'entrée unifié
└── README.md        # Cette documentation
```

## 🎯 Objectif

Ce système de types vise à :
- **Standardiser** les formats de coordonnées (grid "x,z", tile {x,z}, world {x,y,z})
- **Centraliser** les définitions de types pour éviter la duplication
- **Faciliter** la migration progressive vers TypeScript
- **Améliorer** la robustesse du code avec la validation compile-time
- **Documenter** les interfaces entre les modules

## 📚 Modules de Types

### 🗺️ coordinates.ts
Gère tous les systèmes de coordonnées du projet :
- `GridCoordinate` : Format string "x,z" pour les clés de Map
- `TileCoordinate` : Format objet {x, z} pour la logique
- `WorldPosition` : Format 3D {x, y, z} pour Three.js
- Fonctions de conversion entre tous les formats
- Validateurs de types

### 🎁 resources.ts
Définit les ressources et éléments collectables :
- `ResourceType` : 'food' | 'debris' | 'special'
- `ResourceStats` : Compteurs avec totaux automatiques
- `DiscoverableItem` : Éléments sur la grille
- Fonctions utilitaires de calcul

### 🚗 vehicle.ts
Types de base pour tous les véhicules :
- `BaseVehicle` : Interface commune (position, fuel, cargo, etc.)
- `VehicleConfig` : Configuration générale
- `VehicleStats` : Statistiques de performance
- Fonctions de calcul (distance, temps, pourcentages)

### 🚁 drone.ts
Types spécialisés pour les drones :
- `Drone` : Interface complète étendant BaseVehicle
- `DroneState` : États spécialisés (exploring, collecting, etc.)
- `DroneMission` : Système de missions
- `ExplorationStrategy` : Algorithmes d'exploration
- Fonctions métier spécifiques aux drones

### 🎛️ fsm.ts
Types pour la machine à états finis (XState) :
- `MachineContext` : Contexte global complet
- `FSMEvent` : Structure des événements
- `TileData` : Données des tuiles en mémoire
- `FSMAction` : Actions et transitions
- Fonctions de création et validation

### 📝 examples.ts
Exemples pratiques d'utilisation :
- Création de drones typés
- Conversions de coordonnées
- Gestion des ressources
- Assignment de missions
- Configuration complète du jeu

## 🚀 Usage

### Import Simplifié
```typescript
// Import des types
import type { Drone, GridCoordinate, ResourceStats } from '@/types';

// Import des fonctions utilitaires
import { tileToGrid, createEmptyResourceStats, isDroneAvailable } from '@/types';

// Import de types spécifiques
import type { DroneState, ExplorationStrategy } from '@/types/drone';
```

### Exemples Pratiques

#### Création d'un Drone
```typescript
import type { Drone, TileCoordinate } from '@/types';
import { generateMissionId } from '@/types';

const createDrone = (id: string): Drone => ({
  id,
  type: 'drone',
  position: { x: 0, y: 0.5, z: 0 },
  target: { position: null, coord: null },
  speed: 2.0,
  fuel: 100,
  maxFuel: 100,
  cargo: 0,
  maxCargo: 10,
  state: 'idle',
  lastUpdate: Date.now(),
  mission: null,
  explorationStrategy: 'spiral',
  discoveredTiles: new Set(),
  exploredArea: [],
  lastExplorationTarget: null,
  pathToTarget: [],
  collectedResources: [],
  efficiency: 100,
  autonomyLevel: 80
});
```

#### Conversions de Coordonnées
```typescript
import type { TileCoordinate, GridCoordinate, WorldPosition } from '@/types';
import { tileToGrid, tileToWorld, worldToTile } from '@/types';

const tile: TileCoordinate = { x: 10, z: 15 };
const grid: GridCoordinate = tileToGrid(tile);        // "10,15"
const world: WorldPosition = tileToWorld(tile, 0.5); // {x:10, y:0.5, z:15}
const backToTile = worldToTile(world);               // {x:10, z:15}
```

#### Gestion des Ressources
```typescript
import type { ResourceStats } from '@/types';
import { createEmptyResourceStats, updateResourceStats } from '@/types';

let stats = createEmptyResourceStats(); // {food:0, debris:0, special:0, total:0}
stats = updateResourceStats(stats, 'food', 50);
stats = updateResourceStats(stats, 'debris', 120);
// stats.total est automatiquement calculé
```

#### Type Guards
```typescript
import type { AnyCoordinate } from '@/types';
import { isGridCoordinate, isTileCoordinate, isWorldPosition } from '@/types';

const processCoordinate = (coord: AnyCoordinate) => {
  if (isGridCoordinate(coord)) {
    // coord est typé comme GridCoordinate
    console.log('Grid coordinate:', coord);
  } else if (isTileCoordinate(coord)) {
    // coord est typé comme TileCoordinate
    console.log('Tile coordinate:', coord.x, coord.z);
  } else if (isWorldPosition(coord)) {
    // coord est typé comme WorldPosition
    console.log('World position:', coord.x, coord.y, coord.z);
  }
};
```

## 🔧 Migration Recommandée

### Phase 1 : Import des Types
1. Remplacer les définitions locales par les imports du module `@/types`
2. Utiliser l'alias `type Resources = ResourceStats` pour la compatibilité
3. Tester la compilation TypeScript

### Phase 2 : Adoption des Fonctions Utilitaires
1. Remplacer les conversions manuelles par les fonctions du module
2. Utiliser les validateurs de types
3. Adopter les type guards pour la sécurité

### Phase 3 : Standardisation Complète
1. Migrer tous les fichiers vers les types centralisés
2. Supprimer les définitions redondantes
3. Ajouter des tests pour valider la cohérence

## 🎨 Avantages

### ✅ Cohérence
- Format unique pour chaque type de coordonnée
- Interfaces standardisées pour tous les véhicules
- Validation compile-time des types

### ✅ Maintenabilité
- Modifications centralisées dans un seul endroit
- Documentation intégrée aux types
- Évolution facilitée avec les versions TypeScript

### ✅ Productivité
- Autocomplétion dans l'IDE
- Détection d'erreurs à la compilation
- Refactoring sécurisé

### ✅ Documentation
- Types auto-documentés
- Exemples d'usage inclus
- Guide de migration fourni

## 🧪 Tests et Validation

Pour tester le système de types :

```typescript
import { runTypeSystemDemo } from '@/types/examples';

// Lance une démonstration complète
runTypeSystemDemo();
```

Ce fichier `examples.ts` contient des exemples pratiques pour tous les cas d'usage courants et peut servir de base pour les tests unitaires.

## 🔗 Liens Utiles

- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Guide des Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [XState avec TypeScript](https://xstate.js.org/docs/guides/typescript.html)
- [Three.js Types](https://threejs.org/docs/index.html#manual/en/introduction/Typescript-setup)

---

*Ce système de types fait partie de la migration progressive vers TypeScript et sera enrichi au fur et à mesure des besoins du projet.*
