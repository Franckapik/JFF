# FSM Reducers

This directory contains centralized reducer functions for the FSM system.

**Status**: Well-designed and extensively used - one of the best parts of the FSM architecture.

## Structure and Usage Status

- **context.js** ✅ **EXCELLENT USAGE**: Contains all context update reducers organized by category
- **index.js**: Combined exports for easy access

### Reducer Categories by Usage

#### ✅ Heavily Used Categories
- **state** ✅ **CORE**: State transition preparation - Used in every transition
- **movement** ✅ **ACTIVE**: Position and navigation updates - Used in exploration flow
- **exploration** ✅ **ESSENTIAL**: Discovery and mapping operations - Core functionality

#### ⚠️ Moderately Used Categories  
- **emergency** ⚠️ **AVAILABLE**: Critical situation handling - Available when needed
- **manual** ⚠️ **AVAILABLE**: Manual override controls - Used for debugging/testing

#### ❌ Unused Categories (Consider Commenting)
- **resource** ❌ **UNUSED**: Collection and inventory management - Not implemented
- **fuel** ❌ **UNUSED**: Fuel consumption and refueling - Not implemented  
- **base** ❌ **PARTIALLY USED**: Base operations and maintenance - Limited use

## Reducer Usage Analysis

### ✅ Extensively Used Reducers

#### State Reducers (state.*)
```javascript
// ✅ Used in every state transition
contextReducers.state.prepareEvaluating(context, { reason: 'auto_exploration' })
contextReducers.state.prepareExploring(context, { reason: 'has_unexplored' })
contextReducers.state.prepareIdleAtBase(context, { reason: 'at_base' })
contextReducers.state.prepareReturning(context, { reason: 'emergency' })
```

#### Movement Reducers (movement.*)
```javascript
// ✅ Used in exploration flow
contextReducers.movement.startMovement(context, { targetTile: {...} })
contextReducers.movement.updatePosition(context, { position: {...} })
```

#### Exploration Reducers (exploration.*)
```javascript
// ✅ Core exploration functionality
contextReducers.exploration.updateExplorationStatus(context, {...})
contextReducers.exploration.recordDiscovery(context, {...})
```

### ❌ Unused Reducers (Consider Commenting)

#### Resource Reducers (resource.*) - UNUSED
```javascript
// ❌ Collection flow not implemented
// contextReducers.resource.updateInventory(context, event)
// contextReducers.resource.collectResource(context, event)
// contextReducers.resource.depositResources(context, event)
```

#### Fuel Reducers (fuel.*) - UNUSED
```javascript
// ❌ Fuel management not implemented
// contextReducers.fuel.refuel(context, { amount: 100 })
// contextReducers.fuel.consumeFuel(context, { amount: 10 })
```

## Usage Examples

### ✅ Excellent Usage Pattern (Current Implementation)

```javascript
import { contextReducers } from '../reducers/context.js';

// ✅ Perfect chaining of reducers
transition(SYSTEM_EVENT_TYPES.EVALUATION_COMPLETE, BOT_STATES.EXPLORING_DEPLOYING,
  guard((context, event) => discoveryGuards.hasUnexploredAreas(context, event)),
  reduce((context, event) => {
    // 1. Prepare exploration state
    const explorationContext = contextReducers.state.prepareExploring(context, {
      reason: 'auto_exploration',
      timestamp: Date.now()
    });
    
    // 2. Deploy drone immediately
    return fsmDroneFleetActions.deployDroneWithPosition(explorationContext, event);
  })
)
```

### ✅ Clean State Preparation Pattern

```javascript
// ✅ Consistent state preparation across all states
const preparedContext = contextReducers.state.prepareIdleAtBase(context, {
  reason: 'at_base'
});
```

## Usage

Import reducers in state files:

```javascript
import { contextReducers } from '../reducers/context.js';

// Then use in transitions
transition('EVENT',
  TARGET_STATE,
  guardFunction,
  reduce((context, event) => {
    // Chain multiple reducers
    const updatedContext = contextReducers.fuel.refuel(context, {
      amount: 100
    });
    
    return contextReducers.state.prepareEvaluating(updatedContext, {
      reason: 'refueled'
    });
  })
)
```

## Implementation

Reducers are pure functions following the pattern `(context, event) => updatedContext`.

They reuse existing action functions from:
- `shared/actions/core/movement.js`
- `shared/actions/core/fuel.js`
- `shared/actions/core/resources.js`
- `shared/actions/core/exploration.js`

### ❌ Avoid These Patterns (Unused Features)

```javascript
// ❌ Don't use - resource collection not implemented
transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED, BOT_STATES.EVALUATING,
  guard(...),
  reduce((context, event) => {
    return contextReducers.resource.updateInventory(context, event); // Never called
  })
)

// ❌ Don't use - fuel management not implemented  
const refueledContext = contextReducers.fuel.refuel(context, {
  amount: 100 // This logic isn't connected to anything
});
```

## Implementation Quality Assessment

### ✅ Excellent Design Principles

1. **Pure Functions**: All reducers are pure, no side effects
2. **Composable**: Easy to chain multiple reducers
3. **Consistent Interface**: `(context, event) => updatedContext` pattern
4. **Well-Organized**: Logical categorization by domain
5. **Reusable**: Built on top of existing action functions

### ✅ Best Practices Demonstrated

```javascript
// ✅ Excellent pattern - used throughout the codebase
reduce((context, event) => {
  // 1. Use specific reducer for domain logic
  const updatedContext = contextReducers.movement.startMovement(context, {
    targetTile: { coord: event.targetCoord }
  });
  
  // 2. Add FSM-specific context updates
  return {
    ...updatedContext,
    movementStatus: 'en_route',
    currentAction: 'moving_to_base'
  };
})
```

## Reducer Performance Analysis

### High-Performance Reducers (Called Frequently)
- `state.prepareEvaluating` - Called after every major transition
- `state.prepareExploring` - Called for all exploration starts
- `movement.updatePosition` - Called during movement tracking

### Medium-Performance Reducers
- `exploration.updateExplorationStatus` - Called during exploration phases
- `emergency.triggerEmergency` - Called when emergencies detected

### Low-Performance Reducers (Rarely Called)
- `base.prepareIdleAtBase` - Only when bot reaches base (problematic)
- `manual.recordManualCommand` - Only for manual overrides

### Unused Reducers (0% Usage)
- All `resource.*` reducers
- All `fuel.*` reducers  
- Most `base.*` reducers

## Migration Recommendations

### Keep (Core Functionality)
```javascript
// ✅ Keep all state preparation reducers
export const stateReducers = {
  prepareEvaluating,
  prepareExploring, 
  prepareIdleAtBase,
  prepareReturning
};

// ✅ Keep movement reducers
export const movementReducers = {
  startMovement,
  updatePosition,
  completeMovement
};

// ✅ Keep exploration reducers
export const explorationReducers = {
  updateExplorationStatus,
  recordDiscovery,
  completeExploration
};
```

### Comment Out (Unused)
```javascript
// ❌ Comment out unused resource reducers
// export const resourceReducers = {
//   updateInventory,
//   collectResource,
//   depositResources
// };

// ❌ Comment out unused fuel reducers  
// export const fuelReducers = {
//   refuel,
//   consumeFuel,
//   checkFuelLevel
// };
```

## Testing Recommendations

### ✅ Test These Reducers (Core)
```javascript
describe('State Reducers', () => {
  test('prepareEvaluating sets correct context', () => {
    const result = contextReducers.state.prepareEvaluating(mockContext, {
      reason: 'test'
    });
    expect(result.currentAction).toBe('evaluating');
    expect(result.lastStateChange).toBeDefined();
  });
});
```

### ⚠️ Test Edge Cases
```javascript
describe('Movement Reducers', () => {
  test('handles missing position gracefully', () => {
    const contextWithoutPosition = { ...mockContext, vehicle: {} };
    const result = contextReducers.movement.updatePosition(contextWithoutPosition, event);
    expect(result).toBeDefined();
  });
});
```

### ❌ Skip Testing Unused Reducers
```javascript
// Don't test resource or fuel reducers since they're not used
```

## Conclusion

The FSM reducer system is **exceptionally well-designed** and represents one of the strongest parts of the architecture. The main recommendations are:

1. **Keep the current design** - It's working excellently
2. **Comment out unused categories** - Clean up resource/fuel reducers  
3. **Expand the used categories** - Add more exploration and movement reducers as needed
4. **Use as a model** - Apply this pattern to other parts of the system

The reducer architecture demonstrates excellent functional programming principles and should be considered a reference implementation for other system components.
