# Migration vers XState v5 avec setup() - Plan de migration

## ✅ **PROGRÈS ACTUEL**

### **Étape 1 : Types XState v5 - TERMINÉE ✅**
- ✅ `/src/types/xstate.types.ts` - Types compatibles XState v5
- ✅ `/src/types/events.d.ts` - Types d'événements étendus
- ✅ Interfaces `XStateActionArgs`, `XStateGuardArgs`, `XStateAction`, `XStateGuard`

### **Étape 2 : Adapters - TERMINÉE ✅**
- ✅ `/src/ai/fsm/machineX/adapters/actionAdapters.ts` - Adapters pour actions
- ✅ `/src/ai/fsm/machineX/adapters/guardAdapters.ts` - Adapters pour guards
- ✅ Fonctions `adaptLegacyAction()`, `createStateAction()`

### **Étape 3 : Machine v5 expérimentale - EN COURS 🚧**
- ✅ `/src/ai/fsm/machineX/machine.xstate.v5.ts` - Machine setup() basique
- ✅ État `exploring` avec sous-états complets
- ✅ Actions adaptées automatiquement
- 🚧 États `collecting` et `maintaining` (structures de base)
- 🚧 Guards adaptés (seulement `shouldExplore` pour l'instant)

### **Étape 4 : Validation - EN COURS 🚧**
- ✅ `/src/ai/fsm/machineX/validation/migrationTests.ts` - Tests de comparaison
- 🚧 Tests d'instanciation et compatibilité événements
- ⏳ Tests de performance et validation complète

## 🚀 **ÉTAT ACTUEL - PRÊT POUR LES PROCHAINES ÉTAPES**

### **Ce qui fonctionne maintenant :**
1. **Machine v5 opérationnelle** avec typage strict des événements
2. **Événements globaux** fonctionnels (`SHIP_POSITION_UPDATE`, etc.)
3. **État `exploring`** complet avec sous-états
4. **Actions automatiquement adaptées** depuis la v4
5. **Coexistence** des versions v4 et v5

### **Prochaines étapes prioritaires :**
1. **Compléter les états** `collecting` et `maintaining`
2. **Adapter tous les guards** depuis `guards.all.ts`
3. **Implémenter les transitions** entre états principaux
4. **Tests de validation** complets
5. **Migration progressive** état par état

### **Structure actuelle :**
```
src/ai/fsm/machineX/
├── machine.xstate.ts          # Machine v4 (production)
├── machine.xstate.v5.ts       # Machine v5 (expérimentale) ✅
├── adapters/
│   ├── actionAdapters.ts       # ✅ Adapters actions
│   └── guardAdapters.ts        # ✅ Adapters guards
├── validation/
│   └── migrationTests.ts       # 🚧 Tests comparaison v4/v5
└── types/
    └── xstate.types.ts         # ✅ Types XState v5
```

---

## 📋 Vue d'ensemble

Cette migration transformera l'architecture XState v4 actuelle vers XState v5 avec un typage strict complet. La migration nécessite une refactorisation profonde des types, actions, guards et de la machine elle-même.

## 🎯 Objectifs

1. **Typage strict complet** : Tous les événements, contexte, actions et guards typés
2. **Validation compile-time** : Erreurs TypeScript pour les événements/actions invalides
3. **Architecture moderne** : Utilisation de `setup()` pour une meilleure organisation
4. **Rétrocompatibilité** : Migration progressive sans casser l'existant

## 🚧 Défis identifiés

### 1. **Incompatibilité des signatures d'actions**
- **Actuel** : `(context: FSMContext, event: Event) => FSMContext`
- **XState v5** : `({ context, event }: ActionArgs) => Partial<FSMContext>`

### 2. **Incompatibilité des signatures de guards**
- **Actuel** : `(context: FSMContext) => boolean`
- **XState v5** : `({ context, event }: GuardArgs) => boolean`

### 3. **Types de contexte stricts**
- XState v5 exige une correspondance exacte entre les types déclarés et utilisés
- `FSMContext` vs `MachineContext` incompatibles

### 4. **Événements typés strictement**
- Tous les événements doivent correspondre au type union `MachineEvents`
- Les événements dans les états doivent être validés

## 📝 Plan de migration en 6 étapes

### **Étape 1 : Préparer les types XState v5**

#### 1.1 Créer `/src/types/xstate.types.ts`
```typescript
import type { FSMContext } from './fsm.d.ts';
import type { MachineEvents } from './events.d.ts';

// Types XState v5 compatibles
export interface XStateActionArgs {
  context: FSMContext;
  event: MachineEvents;
}

export interface XStateGuardArgs {
  context: FSMContext;
  event: MachineEvents;
}

// Types d'actions pour setup()
export type XStateAction = (args: XStateActionArgs) => Partial<FSMContext>;
export type XStateGuard = (args: XStateGuardArgs) => boolean;
```

#### 1.2 Étendre `events.d.ts` avec des types payload précis
```typescript
// Remplacer les `payload?: unknown` par des types précis
export type MachineEvents = 
  | { type: 'SHIP_POSITION_UPDATE'; position: { x: number; z: number } }
  | { type: 'DRONE_POSITION_UPDATE'; droneId: string; position: { x: number; z: number } }
  | { type: 'DRONE_INITIALIZE_REQUEST'; droneType: DroneType }
  // etc...
```

### **Étape 2 : Migrer les actions vers XState v5**

#### 2.1 Créer des adapters d'actions
```typescript
// /src/ai/fsm/machineX/adapters/actionAdapters.ts
import { assign } from 'xstate';
import type { XStateAction } from '../../../types/xstate.types.ts';

export function adaptAction(
  legacyAction: (context: FSMContext, event: any) => FSMContext
): XStateAction {
  return assign(({ context, event }) => {
    return legacyAction(context, event);
  });
}
```

#### 2.2 Migrer progressivement les actions
```typescript
// Avant (actions actuelles)
export const updateShipPosition = (context: FSMContext, event: ShipPositionEvent) => {
  // ...logic
  return updatedContext;
};

// Après (XState v5)
export const updateShipPosition = assign(({ context, event }: XStateActionArgs) => {
  // ...same logic
  return updatedContextPartial;
});
```

### **Étape 3 : Migrer les guards vers XState v5**

#### 3.1 Adapter les guards existants
```typescript
// /src/ai/fsm/machineX/adapters/guardAdapters.ts
export function adaptGuard(
  legacyGuard: (context: FSMContext) => boolean
): XStateGuard {
  return ({ context, event }: XStateGuardArgs) => {
    return legacyGuard(context);
  };
}
```

### **Étape 4 : Créer la machine setup() progressive**

#### 4.1 Créer une machine de transition
```typescript
// /src/ai/fsm/machineX/machine.xstate.v5.ts
import { setup } from 'xstate';

export const machineXV5 = setup({
  types: {
    context: {} as FSMContext,
    events: {} as MachineEvents,
  },
  actions: {
    // Actions migrées progressivement
    ...adaptedActions,
  },
  guards: {
    // Guards migrés progressivement
    ...adaptedGuards,
  },
}).createMachine({
  id: 'machineX',
  initial: 'evaluating',
  context: ({ input }) => createMachineContext(input),
  states: {
    // États migrés progressivement
  },
});
```

### **Étape 5 : Migrer les états avec typage strict**

#### 5.1 Créer des helpers pour les états typés
```typescript
// /src/ai/fsm/machineX/utils/stateHelpers.v5.ts
export function createTypedState<TEvents extends MachineEvents>(config: {
  entry?: string | string[];
  exit?: string | string[];
  on?: Record<TEvents['type'], string>;
  states?: Record<string, any>;
}) {
  return config;
}
```

#### 5.2 Migrer les états un par un
```typescript
// /src/ai/fsm/machineX/states/exploring.state.v5.ts
export const exploringStateV5 = createTypedState({
  entry: ['action_exploring_entry'],
  exit: ['action_exploring_exit'],
  initial: 'drone_deploying',
  states: {
    drone_deploying: {
      entry: ['action_drone_deploying_entry'],
      on: {
        'DRONE_REACHES_TILE': 'drone_scanning'
      }
    }
  }
});
```

### **Étape 6 : Tests et migration finale**

#### 6.1 Tests de validation
- Créer des tests pour valider la compatibilité entre v4 et v5
- Tester tous les événements et transitions

#### 6.2 Migration progressive
- Commencer par les états les plus simples
- Migrer les actions/guards étape par étape
- Maintenir la compatibilité avec le système actuel

## 🔧 Scripts d'automatisation

### Script de migration des actions
```bash
# /scripts/migrate-actions.sh
#!/bin/bash
echo "Migration des actions vers XState v5..."
# Script pour transformer automatiquement les signatures d'actions
```

### Script de validation
```bash
# /scripts/validate-migration.sh
#!/bin/bash
echo "Validation de la migration XState v5..."
npm run type-check
npm run test:xstate
```

## ⚠️ Risques et considérations

### **Risques**
1. **Breaking changes** temporaires pendant la migration
2. **Complexité accrue** du typage TypeScript
3. **Performance** : vérifier l'impact sur les performances

### **Mitigation**
1. **Migration progressive** : garder les deux versions en parallèle
2. **Tests exhaustifs** à chaque étape
3. **Rollback plan** : pouvoir revenir à v4 rapidement

## 📅 Timeline estimée

- **Étape 1-2** : 1-2 jours (types et adapters)
- **Étape 3-4** : 2-3 jours (guards et machine setup)
- **Étape 5** : 3-4 jours (migration des états)
- **Étape 6** : 2-3 jours (tests et finalisation)

**Total estimé : 8-12 jours** pour une migration complète avec tests.

## 🚀 Démarrage immédiat

Veux-tu que je commence par l'**Étape 1** (types XState v5) ou préfères-tu une approche différente ?

## 📂 Structure finale attendue

```
src/ai/fsm/machineX/
├── machine.xstate.ts          # Machine v4 (actuelle)
├── machine.xstate.v5.ts       # Machine v5 (nouvelle)
├── adapters/
│   ├── actionAdapters.ts
│   └── guardAdapters.ts
├── types/
│   └── xstate.types.ts
└── utils/
    └── stateHelpers.v5.ts
```

Cette migration permettra un typage strict complet et une architecture XState moderne tout en maintenant la compatibilité existante.
