# FSM Guards

This directory contains modular guard functions for the FSM system, organized by functional category.

**Status**: ✅ **REFACTORED** - Guards primitifs extraits des actions vers guards/core/

## 🏗️ **NOUVELLE ARCHITECTURE CLEAN**

```
guards/
├── core/                           # 🆕 Guards primitifs (logique métier)
│   ├── fuel.js                     # Guards carburant (extraits des actions)
│   ├── movement.js                 # Guards mouvement (extraits des actions)
│   ├── resources.js                # Guards ressources (extraits des actions)
│   ├── exploration.js              # Guards exploration (extraits des actions)
│   └── index.js                    # Export consolidé
├── safety.js                       # Guards FSM composés (importe core/)
├── efficiency.js                   # Guards FSM composés (importe core/)
├── discovery.js                    # Guards FSM composés (importe core/)
├── base.js                         # Guards FSM composés (importe core/)
└── index.js                        # Export FSM final
```

**🎯 Avantages de la nouvelle structure:**
- ✅ **Séparation claire**: Guards primitifs (core/) vs Guards composés FSM
- ✅ **Plus d'imports depuis actions/**: Architecture clean
- ✅ **Réutilisabilité**: Guards primitifs utilisables ailleurs
- ✅ **Imports locaux**: `./core/fuel.js` au lieu de `../actions/core/fuelActions.js`

## Structure and Usage Status

- **safety.js** ✅ **HEAVILY USED**: Critical safety conditions (fuel levels, vehicle health)
- **efficiency.js** ✅ **ACTIVELY USED**: Resource optimization (capacity, priorities)  
- **discovery.js** ✅ **CORE FUNCTIONALITY**: Exploration and pathfinding logic
- **base.js** ⚠️ **PARTIALLY PROBLEMATIC**: Base operations (location, docking, maintenance)
- **index.js**: Combined exports for easy access

## Guards by Usage Status

### ✅ Heavily Used Guards (Keep)

#### Safety Guards (safetyGuard.js)
```javascript
// ✅ Critical for emergency transitions
needsEmergencyReturn: () => // Used in EVALUATING → EXPLORING_RETURNING
isCriticalFuel: () => // Emergency fuel detection
needsToReturnToBase: () => // Safety return logic
```

#### Discovery Guards (discoveryGuard.js)  
```javascript
// ✅ Core exploration functionality
hasUnexploredAreas: () => // Main exploration trigger
canStartExploration: () => // Exploration validation
isExplorationComplete: () => // Completion detection
```

#### Efficiency Guards (efficiencyGuard.js)
```javascript
// ✅ Resource management optimization
shouldReturnForEfficiency: () => // Return optimization
isAtMaxCapacity: () => // Capacity checks
shouldCollectMore: () => // Collection decisions
```

### ⚠️ Problematic Guards (Need Investigation)

#### Base Guards (base.js)
```javascript
// ⚠️ PROBLEMATIC - isAtBase may not work correctly
isAtBase: () => // Used in BASE_REACHED transition - NEVER SUCCEEDS
canRefuel: () => // Refuel capability check
needsRefueling: () => // Refuel requirement check
```

**Problem**: The `isAtBase` guard appears to never return true, causing bots to get stuck in `exploring_returning` state.

### ❌ Unused Guards (Consider Commenting Out)

#### Resource Collection Guards
```javascript
// ❌ UNUSED - Resource collection not implemented
// canCollectResource: resourceGuards.canCollectResource,
// hasCapacityFor: resourceGuards.hasCapacityFor,
// canDepositResources: resourceGuards.canDepositResources,
```

## Usage Examples

### ✅ Working Guard Usage

```javascript
import { safetyGuards, discoveryGuards } from '../guards/indexGuard.js';

// ✅ This works - heavily used in practice
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING,
  guard((context, event) => {
    return discoveryGuards.hasUnexploredAreas(context, event) &&
           !safetyGuards.needsEmergencyReturn(context, event);
  }),
  reduce(...)
)
```

### ⚠️ Problematic Guard Usage

```javascript
import { baseGuards } from '../guards/indexGuard.js';

// ⚠️ This transition never succeeds - bot gets stuck
transition(MOVEMENT_EVENT_TYPES.BASE_REACHED, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => baseGuards.isAtBase(context, event)), // ❌ Always false
  reduce(...)
)
```

### ❌ Avoid These Guards

```javascript
// ❌ Don't use - resource collection not implemented
import { efficiencyGuards } from '../guards/indexGuard.js';

transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED, BOT_STATES.EVALUATING,
  guard((context, event) => efficiencyGuards.canCollectResource(context, event)), // Never called
  reduce(...)
)
```

## Implementation

Guards reuse existing guard functions from the shared actions system:
- `shared/actions/core/movement.js` - Movement and vehicle guards
- `shared/actions/core/fuel.js` - Fuel management guards  
- `shared/actions/core/resources.js` - Resource and inventory guards
- `shared/actions/core/exploration.js` - Exploration and discovery guards

## Identified Issues and Fixes

### 🔴 Critical Issue: isAtBase Guard

**Problem**: The `isAtBase` guard in `base.js` never returns true, causing:
- Bots stuck in `exploring_returning` state
- `BASE_REACHED` transitions never succeed
- Incomplete exploration cycles

**Current Implementation**:
```javascript
isAtBase: (context, event) => {
  // Check if current position matches base position
  const { vehicle } = context;
  // ❌ Position comparison logic appears faulty
}
```

**Recommended Investigation**:
1. Debug position comparison logic
2. Check coordinate system consistency  
3. Add tolerance for position matching
4. Implement timeout fallback

**Temporary Solution**:
```javascript
// Add timeout-based fallback in exploring.js
transition(SYSTEM_EVENT_TYPES.EXPLORATION_TIMEOUT, BOT_STATES.IDLE_AT_BASE,
  guard((context, event) => {
    const timeInState = Date.now() - (context.lastStateChange || 0);
    return timeInState > 30000; // 30 second timeout
  }),
  reduce(...)
)
```

## Guard Testing Recommendations

### ✅ Test These Guards (Core Functionality)
```javascript
// Test exploration guards
expect(discoveryGuards.hasUnexploredAreas(mockContext, mockEvent)).toBe(true);

// Test safety guards  
expect(safetyGuards.needsEmergencyReturn(criticalContext, mockEvent)).toBe(true);

// Test efficiency guards
expect(efficiencyGuards.shouldReturnForEfficiency(fullContext, mockEvent)).toBe(true);
```

### ⚠️ Debug These Guards (Problematic)
```javascript
// Debug base detection
console.log('Vehicle position:', context.vehicle.position);
console.log('Base position:', context.basePosition);
console.log('isAtBase result:', baseGuards.isAtBase(context, event));
```

### ❌ Don't Test These Guards (Unused)
```javascript
// Skip testing unused resource guards
// canCollectResource, hasCapacityFor, canDepositResources
```

## Guard Performance Analysis

### High-Performance Guards (Called Frequently)
- `hasUnexploredAreas` - Called on every evaluation
- `needsEmergencyReturn` - Called on every transition
- `shouldReturnForEfficiency` - Called during optimization

### Low-Performance Guards (Rarely Called)
- `isAtBase` - Should be called but fails
- `canRefuel` - Called only at base
- `needsRefueling` - Conditional fuel checks

## Best Practices

1. **Keep guards pure** - No side effects, deterministic results
2. **Use detailed logging** - Especially for problematic guards like `isAtBase`
3. **Add context validation** - Check for required properties before logic
4. **Implement timeouts** - For guards that might never succeed
5. **Test edge cases** - Empty contexts, missing properties, boundary conditions

## Migration Notes

When cleaning up unused guards:

1. **Comment out unused guards** instead of deleting (for future reference)
2. **Update guard collections** in index.js
3. **Remove unused imports** from state files
4. **Update tests** to focus on used guards only
5. **Document guard status** for future developers
