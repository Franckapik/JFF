/**
 * ============================================================================
 * SUMMARY: DRONE STATE TYPES & CONSTANTS UNIFICATION
 * ============================================================================
 * 
 * Analyse complète des types et constantes utilisés pour les états des drones
 * dans le projet, et proposition d'un modèle unifié basé sur initialContext.
 */

## 📊 TABLEAU RÉCAPITULATIF DES TYPES ET CONSTANTES

### 🎯 **ÉTATS ACTUELS DES DRONES**

| **Contexte**              | **Type/Constante**      | **Valeurs**                                        | **Utilisation**                    |
|---------------------------|--------------------------|---------------------------------------------------|------------------------------------|
| **Trackers FSM**          | `DroneFSMState`         | `'drone_deploying'`, `'drone_scanning'`, `'drone_returning'` | Logique FSM, handlers, store       |
| **Visuels R3F**           | `DroneVisualState`      | `'docked'`, `'deploying'`, `'exploring'`, `'returning'`, `'failed'` | Animation, composants React        |
| **Constantes JS**         | `DRONE_VISUAL_STATES`   | `{ docked: 'docked', deploying: 'deploying', ... }` | initialContext.ts, legacy          |
| **Types centraux**        | `DroneType`             | `'explorer'`, `'combat'`, `'special'`             | Identité des drones                |
| **Animation JS**          | État mixte              | Utilise à la fois FSM et visuels                 | useDroneAnimation.js               |

### 🔄 **CONVERSIONS ACTUELLES**

```typescript
// Dans droneTrackerEngine.ts
const visualToFSMMapping = {
  'deploying': 'drone_deploying',
  'exploring': 'drone_scanning', 
  'returning': 'drone_returning'
} as const;
```

### 📍 **EMPLACEMENTS DES FICHIERS**

#### ✅ **Convertis en TypeScript**
- `/src/types/tracker.ts` - Types centralisés (`DroneVisualState`, `DroneFSMState`)
- `/src/types/vehicle.ts` - Utilise les types centralisés
- `/src/ai/fsm/hooks/trackers/` - Tous les trackers et handlers TypeScript
- `/src/stores/useTileStore/slices/tilePathSlice.ts` - Typage strict

#### ⚠️ **Restent en JavaScript** 
- `/src/animations/useDroneAnimation.js` - ⚠️ Mélange des états FSM et visuels
- `/src/ai/fsm/machineX/config/constants.js` - Constantes legacy (`DRONE_VISUAL_STATES`)
- `/src/ai/fsm/machineX/context/initialContext.ts` - Utilise `DRONE_VISUAL_STATES` JS

---

## 🎯 MODÈLE UNIFIÉ PROPOSÉ

### **1. CENTRALISATION TOTALE DES TYPES**

```typescript
// src/types/drone.ts (NOUVEAU FICHIER UNIFIÉ)
export const DRONE_STATES = {
  // États visuels pour R3F/animations
  VISUAL: {
    DOCKED: 'docked',
    DEPLOYING: 'deploying', 
    EXPLORING: 'exploring',
    RETURNING: 'returning',
    FAILED: 'failed'
  },
  // États FSM pour la logique
  FSM: {
    DEPLOYING: 'drone_deploying',
    SCANNING: 'drone_scanning',
    RETURNING: 'drone_returning'
  }
} as const;

export type DroneVisualState = typeof DRONE_STATES.VISUAL[keyof typeof DRONE_STATES.VISUAL];
export type DroneFSMState = typeof DRONE_STATES.FSM[keyof typeof DRONE_STATES.FSM];

// Mapping de conversion unifié
export const VISUAL_TO_FSM_MAPPING: Record<Exclude<DroneVisualState, 'docked' | 'failed'>, DroneFSMState> = {
  'deploying': DRONE_STATES.FSM.DEPLOYING,
  'exploring': DRONE_STATES.FSM.SCANNING,
  'returning': DRONE_STATES.FSM.RETURNING
} as const;

export const FSM_TO_VISUAL_MAPPING: Record<DroneFSMState, DroneVisualState> = {
  'drone_deploying': DRONE_STATES.VISUAL.DEPLOYING,
  'drone_scanning': DRONE_STATES.VISUAL.EXPLORING,
  'drone_returning': DRONE_STATES.VISUAL.RETURNING
} as const;
```

### **2. MIGRATION DES ANIMATIONS VERS TYPESCRIPT**

```typescript
// src/animations/useDroneAnimation.ts (CONVERTI)
import { DRONE_STATES, DroneVisualState, type DroneFSMState } from '../types/drone';

export const useDroneAnimation = (
  context: FSMContext,
  shipPosition: WorldPosition,
  updateVisualPosition: (pos: WorldPosition) => void,
  droneType: DroneType = 'explorer',
  isActive: boolean = true
) => {
  // Utilisation des constantes unifiées
  const droneState: DroneVisualState = drone.state || DRONE_STATES.VISUAL.DOCKED;
  
  // États de mouvement unifiés
  const isMoving = [
    DRONE_STATES.VISUAL.DEPLOYING,
    DRONE_STATES.VISUAL.EXPLORING, 
    DRONE_STATES.VISUAL.RETURNING
  ].includes(droneState);
}
```

### **3. CONVERSION DES CONSTANTES JS → TS**

```typescript
// src/ai/fsm/machineX/config/constants.ts (NOUVEAU)
import { DRONE_STATES } from '../../../types/drone';

export const DRONE_VISUAL_STATES = DRONE_STATES.VISUAL; // ✅ Référence unifiée
```

### **4. MISE À JOUR D'INITIALCONTEXT**

```typescript
// src/ai/fsm/machineX/context/initialContext.ts
import { DRONE_STATES } from '../../../types/drone';

const createDrone = (type: DroneType): DroneState => ({
  id: `${entityId}-drone-${type}`,
  type,
  state: DRONE_STATES.VISUAL.DOCKED, // ✅ Référence unifiée
  // ...
});
```

---

## 🚀 PLAN DE MIGRATION

### **Phase 1: Création du modèle unifié**
1. ✅ Créer `/src/types/drone.ts` avec toutes les constantes et types
2. ✅ Mettre à jour `/src/types/index.ts` pour exporter le nouveau module
3. ✅ Migrer `/src/types/tracker.ts` pour utiliser les nouveaux types

### **Phase 2: Migration des animations**
1. ✅ Convertir `/src/animations/useDroneAnimation.js` → `.ts`
2. ✅ Convertir autres fichiers d'animation si nécessaire
3. ✅ Utiliser les types unifiés et constantes

### **Phase 3: Migration des constantes**
1. ✅ Convertir `/src/ai/fsm/machineX/config/constants.js` → `.ts`
2. ✅ Remplacer `DRONE_VISUAL_STATES` par référence à `/types/drone`
3. ✅ Mettre à jour `initialContext.ts`

### **Phase 4: Validation et nettoyage**
1. ✅ Vérifier que tous les imports utilisent les types centralisés
2. ✅ Supprimer les anciennes constantes dupliquées
3. ✅ Tests et validation du typage

---

## 🎯 BÉNÉFICES DU MODÈLE UNIFIÉ

### **✅ Avantages**
- **Source unique de vérité**: Tous les états définis dans `/types/drone.ts`
- **Type safety**: TypeScript strict sur tous les états
- **Conversion automatique**: Mappings FSM ↔ Visual intégrés
- **Maintenabilité**: Modifications centralisées
- **Cohérence**: Même nomenclature partout

### **🔧 Fonctions utilitaires unifiées**
```typescript
export function convertVisualToFSM(visual: DroneVisualState): DroneFSMState | null {
  return VISUAL_TO_FSM_MAPPING[visual] || null;
}

export function convertFSMToVisual(fsm: DroneFSMState): DroneVisualState {
  return FSM_TO_VISUAL_MAPPING[fsm];
}
```

### **📊 Résumé de l'impact**
- **Fichiers à migrer**: 4 fichiers (animations + constants)
- **Types unifiés**: 2 types principaux + 1 enum de constantes
- **Suppression de doublons**: ~15 lignes de constantes dupliquées
- **Gain en type safety**: 100% TypeScript sur les états drones

---

Ce modèle unifie complètement la gestion des états des drones et élimine toute duplication tout en conservant la séparation logique FSM/Visual nécessaire au projet.
