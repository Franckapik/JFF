# Migration TypeScript des Trackers XState/FSM

## 📋 Vue d'ensemble

Cette migration convertit tous les fichiers JavaScript du dossier `trackers` en TypeScript avec un typage strict, en utilisant les types existants du projet et les constantes unifiées.

## 🔄 Fichiers Convertis

### Trackers Principaux
- ✅ `drone/useXFSMDroneTracker.js` → `drone/useXFSMDroneTracker.ts`
- ✅ `ship/useXFSMShipTracker.js` → `ship/useXFSMShipTracker.ts`

### Engines de Traitement
- ✅ `drone/droneTrackerEngine.js` → `drone/droneTrackerEngine.ts`
- ✅ `ship/shipTrackerEngine.js` → `ship/shipTrackerEngine.ts`

### Handlers Drones
- ✅ `drone/handlers/index.js` → `drone/handlers/index.ts`
- ✅ `drone/handlers/initializationHandler.js` → `drone/handlers/initializationHandler.ts`
- ✅ `drone/handlers/deployingHandler.js` → `drone/handlers/deployingHandler.ts`
- ✅ `drone/handlers/scanningHandler.js` → `drone/handlers/scanningHandler.ts`
- ✅ `drone/handlers/returningHandler.js` → `drone/handlers/returningHandler.ts`

### Handlers Ships
- ✅ `ship/handlers/index.js` → `ship/handlers/index.ts`
- ✅ `ship/handlers/initializationHandler.js` → `ship/handlers/initializationHandler.ts`
- ✅ `ship/handlers/positionUpdateHandler.js` → `ship/handlers/positionUpdateHandler.ts`

## 🆕 Nouveaux Fichiers

### Types
- ✅ `types.ts` - Types spécifiques aux trackers
- ✅ `index.ts` - Point d'entrée unifié

## 📝 Types Utilisés

### Types Importés depuis `/types`
- `WorldPosition` - Position 3D Three.js
- `TileCoordinate` - Coordonnée de tuile {x,z}
- `FSMContext` - Contexte de la machine à états

### Types Spécifiques aux Trackers
- `DroneType` - 'explorer' | 'combat' | 'special'
- `ShipType` - 'ship' | 'main-ship'
- `XStateSend` - Fonction d'envoi d'événements XState
- `DroneTrackerParams` - Paramètres pour les trackers de drones
- `ShipTrackerParams` - Paramètres pour les trackers de ships

## 🔧 Modifications aux Constantes

### Ajouts dans `constants.js`
```javascript
POSITION_TRACKER_CONFIG.THRESHOLDS.MIN_MOVEMENT = 0.1
POSITION_TRACKER_CONFIG.TIMINGS.MOVEMENT_RESET = 300
```

## 🎯 Points d'Entrée

### Import Principal
```typescript
import { 
  useXFSMDroneTracker, 
  useXFSMShipTracker,
  DroneType, 
  ShipType 
} from './ai/fsm/hooks/trackers';
```

### Usage Typé
```typescript
// Drone tracker
const updateDronePosition = useXFSMDroneTracker(
  context: FSMContext,
  send: XStateSend,
  botId: string,
  droneType: DroneType
);

// Ship tracker  
const updateShipPosition = useXFSMShipTracker(
  context: FSMContext,
  send: XStateSend,
  botId: string,
  shipType: ShipType
);
```

## ✨ Avantages de la Migration

1. **Type Safety** - Détection d'erreurs à la compilation
2. **IntelliSense** - Autocomplétion améliorée 
3. **Documentation** - Types auto-documentés
4. **Maintenance** - Refactorisation sécurisée
5. **Compatibilité** - Usage des types existants du projet

## 🔄 Compatibilité

- ✅ Utilise les types existants de `/types`
- ✅ Compatible avec les constantes unifiées
- ✅ Préserve toute la logique existante
- ✅ Aucun changement d'API publique
