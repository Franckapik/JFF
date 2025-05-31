# FSM Reducers

This directory contains centralized reducer functions for the FSM system.

## Structure

- **context.js**: Contains all context update reducers organized by category:
  - `state`: State transition preparation
  - `movement`: Position and navigation updates
  - `resource`: Collection and inventory management
  - `fuel`: Fuel consumption and refueling
  - `exploration`: Discovery and mapping operations
  - `emergency`: Critical situation handling
  - `manual`: Manual override controls
  - `base`: Base operations and maintenance
- **index.js**: Combined exports for easy access

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
