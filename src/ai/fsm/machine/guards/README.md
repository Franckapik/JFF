# FSM Guards

This directory contains modular guard functions for the FSM system, organized by functional category.

## Structure

- **safety.js**: Critical safety conditions (fuel levels, vehicle health)
- **efficiency.js**: Resource optimization (capacity, priorities)
- **discovery.js**: Exploration and pathfinding logic
- **base.js**: Base operations (location, docking, maintenance)
- **index.js**: Combined exports for easy access

## Usage

Import guards in state files:

```javascript
import { safetyGuards, efficiencyGuards } from '../guards/index.js';

// Then use in transitions
transition('EVENT',
  TARGET_STATE,
  (context, event) => safetyGuards.needsEmergencyReturn(context, event),
  reduce(...)
)
```

## Implementation

Guards reuse existing guard functions from the shared actions system:
- `shared/actions/core/movement.js`
- `shared/actions/core/fuel.js`
- `shared/actions/core/resources.js`
- `shared/actions/core/exploration.js`
