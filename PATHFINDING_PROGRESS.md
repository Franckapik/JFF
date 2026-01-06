# 🚀 Ship Pathfinding Implementation Progress

## Objective
Implement tile-based pathfinding for ship movement using BFS. The ship will traverse intermediate tiles instead of teleporting directly to targets.

## Decisions Made
- **Danger tiles**: Option B - Apply damage per tile traversal (not avoided in pathfinding)
- **Fuel consumption**: Consume all fuel upfront when path starts (forward only, not return)
- **Visualization**: Path displayed in TileMatrix component

## Implementation Steps

| Step | Description | Status |
|------|-------------|--------|
| 1 | Extend VehicleState with path properties | ✅ |
| 2 | Update collection actions to use findPath() | ✅ |
| 3 | Add SHIP_REACHES_WAYPOINT event | ✅ |
| 4 | Create waypoint progression action | ✅ |
| 5 | Update FSM machine transitions | ✅ |
| 6 | Update tracker for path-based timing | ✅ |
| 7 | Add path visualization in TileMatrix | ✅ |
| 8 | Remove obsolete pathfinding code | ⚠️ Kept (store slice still integrated) |
| 9 | TypeScript verification | ✅ |
| 10 | Add pathfinding for return to base | ✅ |

## Architecture

```
Ship Movement Flow (FORWARD):
┌─────────────────────────────────────────────────────────────┐
│ assignShipMovingToTileContext                               │
│  ├─ Call findPath(currentCoord, targetCoord, tiles)         │
│  ├─ Store path in context.vehicle.currentPath               │
│  ├─ Calculate fuel = path.length * FUEL_PER_TILE            │
│  └─ Set pathIndex = 0                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ ship_moving_to_tile state                                   │
│  ├─ Tracker schedules SHIP_REACHES_WAYPOINT for each step   │
│  ├─ On SHIP_REACHES_WAYPOINT:                               │
│  │   ├─ Increment pathIndex                                 │
│  │   ├─ Update vehicle.coord to current waypoint            │
│  │   ├─ Apply danger damage if on danger tile               │
│  │   └─ If pathIndex < path.length: schedule next waypoint  │
│  └─ On final waypoint: emit SHIP_REACHES_TILE               │
└─────────────────────────────────────────────────────────────┘

Ship Return Flow (NEW):
┌─────────────────────────────────────────────────────────────┐
│ assignShipReturningContext                                  │
│  ├─ Call findPath(currentCoord, baseCoord, tiles)           │
│  ├─ Store path in context.vehicle.currentPath               │
│  ├─ No fuel consumption for return (ship always returns)    │
│  └─ Set pathIndex = 0                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ ship_returning state                                        │
│  ├─ Tracker schedules waypoint events for each step         │
│  ├─ On SHIP_REACHES_WAYPOINT:                               │
│  │   ├─ Increment pathIndex                                 │
│  │   ├─ Update vehicle.coord to current waypoint            │
│  │   ├─ Apply danger damage if on danger tile               │
│  │   └─ If pathIndex < path.length: schedule next waypoint  │
│  └─ On final waypoint: emit SHIP_REACHES_BASE               │
└─────────────────────────────────────────────────────────────┘
```

## Files Modified
- `src/types/vehicle.d.ts` - VehicleState path properties (currentPath, pathIndex)
- `src/types/events.d.ts` - SHIP_REACHES_WAYPOINT event
- `src/ai/fsm/machineX/events.pure.v5.ts` - SHIP_REACHES_WAYPOINT event type
- `src/ai/fsm/machineX/domains/collection/actions.assign.ts` - Path calculation with findPath()
- `src/ai/fsm/machineX/domains/collection/guards.pure.ts` - hasMoreWaypoints, isAtFinalWaypoint guards
- `src/ai/fsm/machineX/machine.pure.v5.ts` - FSM transitions for SHIP_REACHES_WAYPOINT
- `src/ai/fsm/machineX/shared/simulatedTrackerCore.ts` - Path-based timing with waypoint events
- `src/ai/fsm/machineX/context/initialContext.ts` - Initialize path properties
- `src/components/TileMatrix.tsx` - Path visualization with colored borders

## Key Changes

### Fuel Calculation (NEW)
```typescript
// OLD: Direct distance-based
const distance = calculateDistanceGrid(shipCoord, targetGridCoord);
const fuelConsumption = Math.max(1, Math.floor(distance * 1.5));

// NEW: Path-based (tiles traversed)
const path = findPath(shipCoord, targetGridCoord, tiles);
const pathSteps = Math.max(0, path.length - 1);
const FUEL_PER_TILE = 2;
const fuelConsumption = Math.max(1, pathSteps * FUEL_PER_TILE);
```

### Danger Damage (Option B)
- Damage applied per tile traversal in `assignShipNextWaypointContext`
- Each danger tile adds +10% damage
- Ship can traverse multiple danger tiles if path goes through them

### Path Visualization
- Dashed border: Future waypoints (not yet visited)
- Solid border: Visited waypoints
- Green: Bot-0 path
- Blue: Bot-1 path

## Notes
- Drone movement is NOT affected by pathfinding (flies directly)
- Hex grid neighbors already calculated at tile generation
- BFS findPath() already exists in `src/core/spatial/pathfinding.ts`
- Legacy tilePathSlice kept in store for backward compatibility
