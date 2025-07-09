# Améliorations du typage des composants R3F

## Résumé des modifications

### 1. **Fleet.tsx**
- ✅ Ajout du type `FSMContext` pour le typage du context
- ✅ Correction du typage du botState avec cast approprié
- ✅ Amélioration de la création d'un DroneState complet
- ✅ Gestion des cas où le context est undefined

### 2. **Scene.tsx**
- ✅ Ajout des imports de types appropriés
- ✅ Utilisation directe des types de store (GameStore, XFSMStore)
- ✅ Suppression des `as any` pour GameStore et XFSMStore
- ⚠️ TileStore garde `as any` temporairement (nécessite refactoring des slices)

### 3. **Tile.tsx**
- ✅ Utilisation directe des types de store pour GameStore et XFSMStore
- ⚠️ TileStore garde `as any` temporairement

### 4. **Vehicles/DroneMesh.tsx**
- ✅ Mise à jour de l'interface `DroneMeshProps` avec botId, context, droneType
- ✅ Utilisation correcte du type `DroneVisualState` ('scanning' au lieu de 'exploring')
- ✅ Correction des paramètres non utilisés avec préfixe `_`

### 5. **Vehicles/ShipMesh.tsx**
- ✅ Ajout du paramètre `botId` à l'interface `ShipMeshProps`
- ✅ Utilisation du type `FSMContext` pour le context

### 6. **Messagerie (conversion JSX → TSX)**
- ✅ **MessageModal.tsx** : Conversion complète avec types `PlayerMessage`
- ✅ **MessageSelector.tsx** : Conversion avec interfaces appropriées
- ✅ Suppression des anciens fichiers `.jsx`

### 7. **Types R3F**
- ✅ Mise à jour des interfaces `DroneMeshProps` et `ShipMeshProps`
- ✅ Ajout des propriétés optionnelles manquantes (botId, context, droneType)

## États du typage par store

### ✅ Stores bien typés
- **useGameStore** : Utilise `GameStoreType` ✅
- **useXFSMStore** : Utilise `XFSMStoreType` ✅
- **usePlayerStore** : Utilise `PlayerStoreType` ✅

### ⚠️ Stores partiellement typés
- **useTileStore** : Slices incompatibles avec `TileStoreType` 
  - Nécessite refactoring des slices pour correspondre exactement à l'interface
  - Garde `as any` temporairement

## Prochaines étapes recommandées

1. **Refactoring TileStore** : Aligner les types des slices avec `TileStoreType`
2. **Validation des types** : Vérifier que tous les types FSM sont cohérents
3. **Tests de typage** : Ajouter des tests pour valider le typage
4. **Documentation** : Mettre à jour la documentation des interfaces

## Avantages obtenus

- **Sécurité de type** : Détection des erreurs à la compilation
- **IntelliSense** : Meilleure autocomplétion dans l'IDE
- **Maintenabilité** : Code plus lisible et maintenable
- **Consistance** : Utilisation cohérente des types dans tous les composants
- **Évolutivité** : Facilite l'ajout de nouvelles fonctionnalités
