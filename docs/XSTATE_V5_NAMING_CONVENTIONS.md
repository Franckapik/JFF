# XState V5 Naming Conventions

## Actions de mise à jour du contexte (assign actions)

**Convention obligatoire :** Préfixe `assign` + description de l'action + `Context`

### ✅ Exemples corrects :
```typescript
export const assignDroneDeployingContext = createAction(({ context, event }) => { ... });
export const assignShipPositionContext = createAction(({ context, event }) => { ... });
export const assignCollectingResourcesContext = createAction(({ context, event }) => { ... });
export const assignMaintenanceContext = createAction(({ context, event }) => { ... });
```

### ❌ Exemples incorrects :
```typescript
export const updateContextForDroneDeploying = createAction(...);  // ❌ Pas de préfixe assign
export const droneDeployContext = createAction(...);              // ❌ Pas de préfixe assign
export const setDronePosition = createAction(...);                // ❌ Pas de préfixe assign
```

## Actions d'état (entry/exit actions)

**Convention obligatoire :** Préfixe `on` + état + `Entry`/`Exit`

### ✅ Exemples corrects :
```typescript
export const onDroneDeployingEntry = ({ context }: { context: FSMContext }) => { ... };
export const onEvaluatingExit = ({ context }: { context: FSMContext }) => { ... };
```

## Séparation des responsabilités

- **Actions `assign*`** : Modification du contexte uniquement (transitions)
- **Actions `on*Entry/Exit`** : Effets de bord uniquement (entry/exit)

Cette convention permet à GitHub Copilot de mieux comprendre l'intention du code.
