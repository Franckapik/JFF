# Migration des Types vers le Dossier Centralisé `/types`

## 📋 Résumé des Changements

### ✅ **Nouveaux Fichiers Créés**
- `src/types/tracker.ts` - Types centralisés pour les trackers XState/FSM

### 🔄 **Fichiers Modifiés**

#### Types Centralisés
- `src/types/index.ts` - Ajout des exports pour les types de tracker
- `src/types/vehicle.ts` - Utilisation des types centralisés (`DroneType`, `DroneVisualState`)

#### Trackers
- `src/ai/fsm/hooks/trackers/types.ts` - Conversion en réexports depuis `/types`
- `src/ai/fsm/hooks/trackers/drone/droneTrackerEngine.ts` - Gestion de la conversion d'états
- `src/stores/useTileStore/slices/tilePathSlice.ts` - Typage strict avec `DroneFSMState`

## 🎯 **Types Créés et Centralisés**

### Types d'Entités
```typescript
export type DroneType = 'explorer' | 'combat' | 'special';
export type ShipType = 'ship' | 'main-ship';
export type DroneVisualState = 'docked' | 'deploying' | 'exploring' | 'returning' | 'failed';
export type DroneFSMState = 'drone_deploying' | 'drone_scanning' | 'drone_returning';
```

### Fonctions de Callback
```typescript
export type XStateSend = (event: any) => void;
export type CanSendEventFn = (eventType: string) => boolean;
export type MarkEventSentFn = (eventType: string, timeout?: number) => void;
export type GridToHexCoordFn = (coord: TileCoordinate) => WorldPosition;
export type WorldToGridFn = (position: WorldPosition) => TileCoordinate;
```

### Paramètres des Trackers
```typescript
export interface BaseTrackerParams { /* ... */ }
export interface DroneTrackerParams extends BaseTrackerParams { /* ... */ }
export interface ShipTrackerParams extends BaseTrackerParams { /* ... */ }
```

## 🔧 **Distinction des États**

### Problème Résolu
- **`DroneVisualState`** - États pour l'affichage visuel R3F (`'docked'`, `'deploying'`, `'exploring'`, `'returning'`, `'failed'`)
- **`DroneFSMState`** - États pour la logique FSM (`'drone_deploying'`, `'drone_scanning'`, `'drone_returning'`)

### Conversion Automatique
Le `droneTrackerEngine` convertit automatiquement les états visuels vers les états FSM :
```typescript
'deploying' → 'drone_deploying'
'exploring' → 'drone_scanning'  
'returning' → 'drone_returning'
```

## ✨ **Avantages de la Centralisation**

1. **Types Unifiés** - Un seul endroit pour tous les types du projet
2. **Réutilisabilité** - Types partagés entre trackers, stores et composants
3. **Type Safety** - Typage strict pour `drone.state` et fonctions de distance
4. **Maintenance** - Modifications centralisées et répercutées automatiquement
5. **Documentation** - Types auto-documentés et IntelliSense amélioré

## 📖 **Usage Recommandé**

```typescript
// Import depuis le dossier centralisé
import type { DroneType, DroneFSMState, XStateSend } from '../../../types';

// Ou depuis l'index général
import type { DroneTrackerParams, ShipTrackerParams } from '../../../types/index';
```

La migration maintient la **compatibilité complète** avec l'API existante tout en centralisant les types pour une meilleure maintenance.
