# FSM Architecture Refactoring: Modular Guards & Centralized Reducers

## Architecture Overview

The Finite State Machine (FSM) implementation has been refactored to improve maintainability, reusability, and separation of concerns. The new architecture follows these core principles:

1. **Modular Guards**: Reusable condition functions organized by domain/purpose
2. **Centralized Reducers**: Consistent state update functions by category
3. **Standardized Transitions**: Clean state transitions with clear intent
4. **Core Action Reuse**: Leveraging existing action functions from shared modules

## Directory Structure

```
src/ai/fsm/machine/
├── guards/             # Modular guard functions
│   ├── safety.js       # Safety-related guards (fuel, health)
│   ├── efficiency.js   # Resource optimization guards
│   ├── discovery.js    # Exploration and pathfinding guards
│   ├── base.js         # Base operations guards
│   └── index.js        # Combined exports
│
├── reducers/           # Centralized state reducers
│   ├── context.js      # All context update reducers
│   └── index.js        # Combined exports
│
└── states/             # FSM state definitions
    ├── evaluating.js   # Decision-making state
    ├── exploring.js    # Exploration state
    ├── collecting.js   # Resource collection state
    ├── returning.js    # Return to base state
    ├── idleAtBase.js   # Base maintenance state
    └── index.js        # State exports and constants
```

## Modular Guards System

Guards are organized into functional categories for better organization and reuse:

### 1. Safety Guards (`safety.js`)
Critical safety conditions that must be checked first:
- Fuel levels (low, critical)
- Vehicle health and damage
- Emergency situations

### 2. Efficiency Guards (`efficiency.js`)
Resource optimization and efficiency checks:
- Inventory capacity
- Resource prioritization
- Path optimization

### 3. Discovery Guards (`discovery.js`) 
Exploration and pathfinding logic:
- Area exploration status
- New resource detection
- Mapping conditions

### 4. Base Guards (`base.js`)
Base operations and maintenance:
- Base proximity detection
- Refueling conditions
- Maintenance requirements

Guards are imported and used in state transitions:

```javascript
import { safetyGuards, efficiencyGuards } from '../guards/index.js';

// In transition:
transition('EVENT_NAME',
  TARGET_STATE,
  (context, event) => safetyGuards.needsEmergencyReturn(context, event),
  reduce(...)
)
```

## Centralized Reducer System

Reducers are pure functions that update the FSM context consistently:

### Categories:
- **State**: Transitions between states
- **Movement**: Position and navigation updates
- **Resources**: Collection and inventory management
- **Fuel**: Consumption and refueling
- **Exploration**: Discovery and mapping
- **Emergency**: Critical situation handling
- **Base**: Base maintenance operations

Each reducer follows the pattern:
```javascript
(context, event) => updatedContext
```

Example usage in transitions:
```javascript
transition('EVENT_NAME',
  TARGET_STATE,
  guardFunction,
  reduce((context, event) => {
    // Use multiple reducers in sequence
    const updatedContext = contextReducers.fuel.refuel(context, event);
    return contextReducers.state.prepareEvaluating(updatedContext, {
      reason: 'refueled'
    });
  })
)
```

## Benefits of the New Architecture

1. **Maintainability**: Changes to logic are isolated to specific files
2. **Reusability**: Guard and reducer functions can be reused across states
3. **Consistency**: State updates follow standardized patterns
4. **Testability**: Pure functions are easier to test
5. **Readability**: Clear separation between conditions and actions
6. **Extensibility**: New guards and reducers can be added without changing existing code

## Implementation Notes

- Guards reuse existing functions from `shared/actions/core/` files
- Reducers chain together to create complex state transformations
- All state transitions now use these modular components
- Debug information is preserved throughout the system

## Future Improvements

- Add comprehensive unit tests for guards and reducers
- Create visual FSM diagram generator
- Add runtime validation for context structure
- Improve debug logging for state transitions
