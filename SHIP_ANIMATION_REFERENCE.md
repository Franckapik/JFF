# 🚢 RÉFÉRENCE TECHNIQUE - ANIMATION DU VAISSEAU

## 📋 Vue d'ensemble

Ce document présente l'architecture technique pour l'implémentation d'un système d'animation complet pour le vaisseau dans le projet React Three Fiber + XState v5. L'animation du vaisseau doit gérer le déplacement tuile par tuile avec calcul de chemin BFS, en coordination avec la machine d'état FSM et les trackers de position.

## 🏗️ Architecture générale

### Composants principaux

1. **Hook d'animation** : `useShipAnimation.ts`
   - Gestion du déplacement avec `useFrame` de R3F
   - Interpolation de position entre tuiles
   - Synchronisation avec la machine d'état FSM

2. **Tracker de position** : `useShipTracker.ts` (existant)
   - Détection d'arrivée sur tuile cible
   - Envoi d'événements à la machine FSM
   - Gestion des différents sous-états de collecting

3. **Store de tiles** : `tilePathSlice.ts` + `tileCoordinateSlice.ts`
   - Calcul de chemin BFS entre tuiles
   - Conversion coordonnées Grid ↔ World
   - Validation des tuiles navigables

4. **Machine FSM** : États de collecting
   - `collecting_ship_moving_to_tile`
   - `collecting_ship_collecting`
   - `collecting_ship_returning`

## 🎯 Spécifications techniques du vaisseau

### Différences avec le drone

| Aspect | Drone | Vaisseau |
|--------|--------|----------|
| **Position de référence** | Relative au vaisseau (Fleet) | Position absolue dans le monde |
| **Déplacement** | Direct vers tuile cible | Tuile par tuile via chemin BFS |
| **Calcul de chemin** | Ligne droite | Algorithme BFS avec tuiles walkable |
| **Base de départ** | Position du vaisseau | Position de base fixe |
| **Gestion d'état** | Simple (deploying/scanning/returning) | Complexe (sous-états de collecting) |

### Types et interfaces requis

```typescript
// À ajouter dans types/r3f.d.ts
export interface ShipAnimationProps {
  context: FSMContext | null;
  updateVisualPosition: (position: WorldPosition) => void;
  shipType?: 'ship' | 'main-ship';
  isActive?: boolean;
  isMoving?: boolean;
}

export interface ShipAnimationReturn {
  shipRef: MutableRefObject<THREE.Mesh | undefined>;
  shipState: string;
  currentPath: WorldPosition[];
  pathIndex: number;
}
```

## 🗺️ Système de navigation

### Calcul de chemin BFS

**Inspiration depuis `tilePathSlice.ts` :**

```typescript
// Fonction existante à utiliser comme base
findPath: (startCoord: GridCoordinate, targetCoord: GridCoordinate, tiles?: TileMap): GridCoordinate[]

// Logique BFS inspirée de selectTargetTileInRadiusForDrone
const queue: { coord: GridCoordinate; distance: number }[] = [
  { coord: currentTile.coord, distance: 0 }
];

while (queue.length > 0) {
  const { coord, distance } = queue.shift()!;
  // Ajouter les voisins walkable à la queue
  if (tile.neighbors) {
    for (const neighborCoord of tile.neighbors) {
      if (!visited.has(neighborCoord) && tilesMap[neighborCoord]?.walkable) {
        queue.push({ coord: neighborCoord, distance: distance + 1 });
      }
    }
  }
}
```

### Conversion de coordonnées

**Utilisation de `tileCoordinateSlice.ts` :**

```typescript
// Conversion Grid → World pour le chemin
const worldPath = gridPath.map(gridCoord => {
  const tile = tilesMap[gridCoord];
  return get().gridToWorld(tile.coord);
});

// Détection d'arrivée sur tuile
const hasReached = get().hasReachedTarget(currentPosition, targetPosition, threshold);
```

## 🎮 Logique d'animation

### Structure du hook `useShipAnimation`

**Inspiration depuis `useDroneAnimation.ts` :**

```typescript
export const useShipAnimation = ({
  context,
  updateVisualPosition,
  shipType = 'main-ship',
  isActive,
  isMoving
}: ShipAnimationProps): ShipAnimationReturn => {
  const shipRef = useRef<THREE.Mesh>(null!);
  const currentWorldPosition = useRef<WorldPosition>({ x: 0, y: 0, z: 0 });
  const currentPath = useRef<WorldPosition[]>([]);
  const pathIndex = useRef<number>(0);
  const animationEnabled = useRef<boolean>(false);

  // Récupération des données du contexte
  const vehicle = context?.vehicle;
  const selectedTile = context?.selectedTileForCollection;
  const shipState = context?.currentState || '';

  // Activation conditionnelle de l'animation
  useEffect(() => {
    const needsAnimation = shouldAnimateShip(shipState, isMoving, isActive);
    animationEnabled.current = needsAnimation;
  }, [shipState, isMoving, isActive]);

  // Calcul du chemin lors du changement de cible
  useEffect(() => {
    if (selectedTile && vehicle?.basePosition) {
      const path = calculateShipPath(vehicle.basePosition, selectedTile.coord);
      currentPath.current = path;
      pathIndex.current = 0;
    }
  }, [selectedTile, vehicle?.basePosition]);

  // Animation frame
  useFrame((state, delta) => {
    if (!animationEnabled.current || !shipRef.current) return;

    // Logique d'interpolation tuile par tuile
    animateShipMovement(delta);
    
    // Mise à jour position tracker
    updateVisualPosition(currentWorldPosition.current);
  });

  return {
    shipRef,
    shipState,
    currentPath: currentPath.current,
    pathIndex: pathIndex.current
  };
};
```

### Animation tuile par tuile

```typescript
const animateShipMovement = (delta: number) => {
  const path = currentPath.current;
  const currentIndex = pathIndex.current;
  
  if (currentIndex >= path.length - 1) {
    // Chemin terminé
    animationEnabled.current = false;
    return;
  }

  const currentTarget = path[currentIndex + 1];
  const speed = getShipSpeed(shipState);
  const lerpFactor = Math.min(1.0, delta * speed);

  // Interpolation vers la prochaine tuile
  currentWorldPosition.current.x = THREE.MathUtils.lerp(
    currentWorldPosition.current.x, 
    currentTarget.x, 
    lerpFactor
  );
  // ... même logique pour y et z

  // Vérifier si la tuile est atteinte
  const distance = calculateDistance(currentWorldPosition.current, currentTarget);
  if (distance < TILE_DETECTION_THRESHOLD) {
    pathIndex.current++;
  }

  // Mettre à jour le mesh
  shipRef.current.position.set(
    currentWorldPosition.current.x,
    currentWorldPosition.current.y,
    currentWorldPosition.current.z
  );
};
```

## 🔄 Intégration avec les trackers

### Mise à jour du tracker existant

**Modification de `useShipTracker.ts` :**

```typescript
// Déplacer SHIP_POSITION_UPDATE vers un initializeHandler
const updatePosition = useCallback((position: WorldPosition) => {
  currentVisualPosition.current = position;
  
  // Envoi conditionnel selon l'état
  if (shouldSendPositionUpdate(context?.currentState)) {
    send({
      type: 'SHIP_POSITION_UPDATE',
      botId,
      shipType,
      position
    });
  }
  
  // Traitement des handlers selon l'état
  processShipStateHandlers(position);
}, [context, send, botId, shipType]);
```

### Handler d'initialisation

```typescript
// Nouveau handler à créer
export const createShipInitializeHandler = ({ botId, shipType, send }: ShipHandlerParams) => {
  return {
    process(basePosition: WorldPosition): void {
      fsmLogger.mouvement(`🚢 [${botId}] Ship initialized at base`, { 
        basePosition,
        shipType
      });
      
      send({
        type: 'SHIP_POSITION_UPDATE',
        botId,
        shipType,
        position: basePosition
      });
    }
  };
};
```

## 🎛️ États et conditions

### Fonction de contrôle d'animation

```typescript
const shouldAnimateShip = (
  shipState: string,
  isMoving: boolean,
  isActive: boolean
): boolean => {
  if (!isActive) return false;
  
  const movementStates = [
    'collecting_ship_moving_to_tile',
    'collecting_ship_returning'
  ];
  
  return movementStates.includes(shipState) && isMoving;
};
```

### Vitesses selon l'état

```typescript
const getShipSpeed = (shipState: string): number => {
  switch (shipState) {
    case 'collecting_ship_moving_to_tile': return 1.0;
    case 'collecting_ship_returning': return 1.2;
    default: return 0.8;
  }
};
```

## 🔧 Fonctions utilitaires requises

### Calcul de chemin pour le vaisseau

```typescript
// À ajouter dans animations/utils/shipPositionUtils.ts
export const calculateShipPath = (
  startPosition: WorldPosition,
  targetCoord: GridCoordinate
): WorldPosition[] => {
  const tileStore = useTileStore.getState();
  
  // Convertir positions en coordonnées de grille
  const startGridCoord = tileStore.worldToGrid(startPosition);
  
  // Calculer le chemin BFS
  const gridPath = tileStore.findPath(startGridCoord, targetCoord);
  
  // Convertir en positions monde
  return gridPath.map(coord => {
    const tile = tileStore.tiles[coord];
    return tileStore.gridToWorld(tile.coord);
  });
};
```

### Détection de fin de chemin

```typescript
export const isPathCompleted = (
  currentPosition: WorldPosition,
  path: WorldPosition[],
  pathIndex: number
): boolean => {
  if (pathIndex >= path.length - 1) return true;
  
  const finalTarget = path[path.length - 1];
  const distance = calculateDistance(currentPosition, finalTarget);
  
  return distance < TILE_DETECTION_THRESHOLD;
};
```

## 📱 Intégration dans les composants

### Modification de ShipMesh.tsx

```typescript
// Import du nouveau hook
import { useShipAnimation } from '../../animations/useShipAnimation';

export const ShipMesh = ({ context, botId, color, ...props }: ShipMeshProps) => {
  // Hook de tracking existant
  const updateShipPosition = useShipTracker({
    context,
    send: context?.send,
    botId,
    shipType: 'main-ship'
  });
  
  // Nouveau hook d'animation
  const { shipRef, shipState } = useShipAnimation({
    context,
    updateVisualPosition: updateShipPosition,
    shipType: 'main-ship',
    isActive: true,
    isMoving: isShipMoving(context?.currentState)
  });

  return (
    <mesh ref={shipRef} {...props}>
      {/* Géométrie du vaisseau */}
    </mesh>
  );
};
```

### Fonction de détection de mouvement

```typescript
const isShipMoving = (currentState?: string): boolean => {
  const movementStates = [
    'collecting_ship_moving_to_tile',
    'collecting_ship_returning'
  ];
  return movementStates.includes(currentState || '');
};
```

## 🚨 Points d'attention

### Gestion de l'initialisation

- **SHIP_POSITION_UPDATE** ne doit être envoyé qu'à l'initialisation via un `initializeHandler`
- Éviter les envois répétés during l'animation pour éviter les boucles

### Performance

- Utiliser `animationEnabled.current` pour activer/désactiver `useFrame` conditionnellement
- Calculer le chemin uniquement lors du changement de cible
- Optimiser les calculs de distance avec des seuils appropriés

### Synchronisation

- S'assurer que le pathIndex est réinitialisé à chaque nouveau chemin
- Coordonner l'arrêt de l'animation avec l'envoi des événements FSM
- Maintenir la cohérence entre position visuelle et position logique

## 📁 Structure de fichiers

```
src/animations/
├── useShipAnimation.ts          # Hook principal (à créer)
├── utils/
│   ├── shipPositionUtils.ts     # Utilitaires position (à créer)
│   └── shipAnimationUtils.ts    # Utilitaires animation (à créer)

src/ai/fsm/hooks/trackers/ship/
├── useShipTracker.ts            # Existant (à modifier)
└── handlers/
    └── initializeHandler.ts     # Nouveau handler (à créer)
```

## 🔗 Dépendances clés

- **BFS Algorithm** : `tilePathSlice.findPath()`
- **Coordinate Conversion** : `tileCoordinateSlice.gridToWorld()` / `worldToGrid()`
- **Distance Calculation** : `tileCoordinateSlice.hasReachedTarget()`
- **FSM States** : `collecting_ship_*` depuis machine.pure.v5.ts
- **Thresholds** : `TILE_DETECTION_THRESHOLD` depuis config/constants

## 🎯 PLAN D'IMPLÉMENTATION - PROMPTS ÉTAPE PAR ÉTAPE

### Étape 1 : Types et interfaces de base
**Prompt :**
```
Ajoute les types TypeScript requis pour l'animation du vaisseau dans le fichier types/r3f.d.ts. 
Crée les interfaces ShipAnimationProps et ShipAnimationReturn selon la spécification du document SHIP_ANIMATION_REFERENCE.md.
Ajoute également le type ShipVisualState avec les valeurs 'moving_to_tile', 'collecting', 'returning', 'docked'.
```

### Étape 2 : Utilitaires de position pour le vaisseau
**Prompt :**
```
Crée le fichier src/animations/utils/shipPositionUtils.ts en s'inspirant de dronePositionUtils.ts.
Implémente les fonctions :
- calculateShipPath: calcul de chemin BFS entre position de base et tuile cible
- getShipSpeed: vitesses selon l'état du vaisseau
- shouldAnimateShip: conditions d'activation de l'animation
- isPathCompleted: détection de fin de chemin
Utilise les stores tilePathSlice et tileCoordinateSlice pour les calculs.
```

### Étape 3 : Utilitaires d'animation visuelle
**Prompt :**
```
Crée le fichier src/animations/utils/shipAnimationUtils.ts pour les animations visuelles du vaisseau.
Implémente des fonctions similaires à droneAnimationUtils.ts mais adaptées au vaisseau :
- applyShipVisualAnimations: rotations, oscillations selon l'état
- calculateShipRotation: orientation selon la direction de déplacement
Ajoute des effets visuels distincts pour chaque état (moving_to_tile, collecting, returning).
```

### Étape 4 : Handler d'initialisation
**Prompt :**
```
Crée le fichier src/ai/fsm/hooks/trackers/ship/handlers/initializeHandler.ts.
Implémente createShipInitializeHandler qui envoie SHIP_POSITION_UPDATE uniquement lors de l'initialisation.
Le handler doit placer le vaisseau à sa position de base et logger l'initialisation.
Ajoute ce handler à l'export dans handlers/index.ts.
```

### Étape 5 : Hook principal d'animation
**Prompt :**
```
Crée le fichier src/animations/useShipAnimation.ts en s'inspirant fortement de useDroneAnimation.ts.
Implémente la logique complète :
- Gestion des refs (shipRef, currentWorldPosition, currentPath, pathIndex)
- useEffect pour l'activation conditionnelle de l'animation
- useEffect pour le calcul de chemin lors du changement de cible
- useFrame pour l'interpolation tuile par tuile
- Intégration avec updateVisualPosition du tracker
La validation se fera visuellement dans le navigateur et via les logs du fsmLogger.
```

### Étape 6 : Modification du tracker existant
**Prompt :**
```
Modifie src/ai/fsm/hooks/trackers/ship/useShipTracker.ts pour intégrer le nouveau initializeHandler.
Déplace l'envoi de SHIP_POSITION_UPDATE vers l'initialisation uniquement.
Ajoute une logique conditionnelle shouldSendPositionUpdate pour éviter les envois répétés pendant l'animation.
Garde la logique existante des handlers pour les différents sous-états.
```

### Étape 7 : Intégration dans ShipMesh
**Prompt :**
```
Modifie src/components/Vehicles/ShipMesh.tsx pour utiliser le nouveau hook useShipAnimation.
Ajoute l'import et l'utilisation du hook en parallèle du tracker existant.
Implémente la fonction isShipMoving pour détecter les états de mouvement.
Assure-toi que la ref du mesh est correctement passée au hook d'animation.
```

### Étape 8 : Test et debugging initial
**Prompt :**
```
Vérifie que l'implémentation compile sans erreurs TypeScript.
Teste dans le navigateur avec les états de collecting du vaisseau.
Analyse les logs du fsmLogger pour vérifier :
- L'initialisation correcte du vaisseau
- Le calcul de chemin BFS
- L'interpolation tuile par tuile
- Les transitions d'état
Corrige les éventuelles erreurs de compilation ou de logique détectées visuellement.
```

### Étape 9 : Optimisation des performances
**Prompt :**
```
Optimise les performances de l'animation du vaisseau :
- Vérifie que useFrame n'est actif que quand nécessaire
- Optimise les calculs de chemin (recalcul uniquement si changement de cible)
- Ajoute des logs de performance pour mesurer l'impact
- Teste avec plusieurs vaisseaux simultanés si applicable
Validation par observation de la fluidité dans le navigateur et analyse des logs.
```

### Étape 10 : Intégration finale et polish
**Prompt :**
```
Finalise l'intégration de l'animation du vaisseau :
- Vérifie la coordination avec les événements FSM (SHIP_REACHES_TILE, etc.)
- Teste tous les scénarios de collecting (moving_to_tile, collecting, returning)
- Ajoute des animations visuelles de polish (trails, particules si souhaité)
- Vérifie que l'animation s'arrête proprement en fin de chemin
- Teste la cohérence entre position visuelle et position logique
Validation finale par test complet dans le navigateur et vérification des logs.
```

## 🔍 Critères de validation pour chaque étape

### Validation visuelle (navigateur)
- ✅ Le vaisseau se déplace de tuile en tuile de manière fluide
- ✅ Le chemin respecte les tuiles walkable (pas de traversée d'obstacles)
- ✅ Les transitions d'état sont visuellement correctes
- ✅ L'animation s'arrête au bon moment (arrivée sur tuile)
- ✅ Pas de saccades ou de téléportations

### Validation par logs (fsmLogger)
- ✅ Messages d'initialisation du vaisseau
- ✅ Calculs de chemin BFS avec coordonnées correctes
- ✅ Événements de position et de distance
- ✅ Transitions d'état FSM (SHIP_REACHES_TILE, etc.)
- ✅ Pas de logs d'erreur ou de warnings

### Validation technique
- ✅ Compilation TypeScript sans erreurs
- ✅ Pas d'erreurs console dans le navigateur
- ✅ Performance fluide (60 FPS maintenu)
- ✅ Cohérence des positions entre animation et logique FSM

---

*Cette référence technique fournit tous les éléments nécessaires pour implémenter un système d'animation robuste et performant pour le vaisseau, en cohérence avec l'architecture existante du projet.*
