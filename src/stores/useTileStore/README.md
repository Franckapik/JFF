# useTileStore - Architecture en Slices

Ce dossier contient la refactorisation du `useTileStore` organisé en slices selon les responsabilités fonctionnelles.

## Structure

```
useTileStore/
├── index.js                    # Store principal combinant tous les slices
└── slices/
    ├── tileBaseSlice.js        # Gestion de base des tuiles
    ├── tileSearchSlice.js      # Recherche et sélection de tuiles
    ├── tileResourceSlice.js    # Gestion des ressources
    ├── tileExplorationSlice.js # Exploration des tuiles
    └── tileCalculationSlice.js # Calculs et analyses
```

## Slices et leurs responsabilités

### 1. tileBaseSlice.js
**Responsabilités :** Gestion de base des tuiles
- État initial (tiles, radius, spacing, hoveredTile)
- Actions CRUD basiques (setTiles, getTile, updateTile, clearTiles)
- Gestion du hover (updateHoveredTile)
- Initialisation des tuiles (initializeTiles)
- Récupération des voisins (getNeighbors)

### 2. tileSearchSlice.js
**Responsabilités :** Recherche et sélection de tuiles
- Recherche de tuiles walkables dans un rayon (getWalkableTilesInRadius)
- Sélection aléatoire de tuiles walkables (selectRandomWalkableTile)
- Filtrage par critères (explored, danger, walkable)

### 3. tileResourceSlice.js
**Responsabilités :** Gestion des ressources des tuiles
- Marquage des tuiles comme collectées (markTileAsCollected)
- Déduction des ressources (deductTileResources)
- Reset des ressources (resetTileResources)
- Analyse des ressources à proximité (analyzeResourcesNearPosition)

### 4. tileExplorationSlice.js
**Responsabilités :** Gestion de l'exploration
- Marquage des tuiles comme explorées (markTileAsExplored)
- Suivi du statut d'exploration

### 5. tileCalculationSlice.js
**Responsabilités :** Calculs et analyses spatiales
- Calcul de distance entre tuiles (calculateDistance)
- Support du pathfinding et distance euclidienne
- Analyses spatiales complexes

## Migration depuis l'ancien useTileStore

L'ancien fichier `useTileStore.js` a été remplacé par un simple export qui redirige vers la nouvelle structure, garantissant la compatibilité avec les imports existants :

```javascript
export { useTileStore } from './useTileStore/index.js';
```

## Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque slice a une responsabilité claire
2. **Maintenabilité** : Plus facile de modifier ou étendre une fonctionnalité spécifique
3. **Testabilité** : Chaque slice peut être testée indépendamment
4. **Réutilisabilité** : Les slices peuvent être réutilisés dans d'autres contextes
5. **Lisibilité** : Le code est mieux organisé et plus facile à comprendre
6. **Compatibilité** : Aucun changement requis dans le code existant

## Usage

Aucun changement n'est requis dans le code existant. Les imports continuent de fonctionner :

```javascript
import { useTileStore } from '../stores/useTileStore';
// ou
import { useTileStore } from '../stores/useTileStore.js';
```

Toutes les méthodes restent accessibles de la même manière :

```javascript
const { tiles, getTile, markTileAsCollected, calculateDistance } = useTileStore();
```
