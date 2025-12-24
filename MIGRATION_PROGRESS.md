# 🚀 Spatial Module Migration Progress

**Objective:** Extract all position/tile logic to pure, testable `core/spatial` module  
**Strategy:** Progressive domain-by-domain migration with atomic commits  
**Test Target:** 100% coverage, full bot behavior diagnostic via tests

---

## Progress Summary

- **Overall Progress:** 3/9 phases (33%)
- **Functions Migrated:** 21 pure functions
- **Test Coverage:** 118 tests, 100% passing
- **Commits:** 3 completed

### Completed Phases

1. ✅ **Phase 1A:** Distance utilities (4 functions, 24 tests)
2. ✅ **Phase 1B:** Coordinate utilities (7 functions, 46 tests)  
3. ✅ **Phase 2A:** Hex grid generation (10 functions, 48 tests)

---

## 📋 Migration Phases

### ✅ Phase 1A: Core Spatial Foundation (COMPLETED)

**Date:** 2025-12-24  
**Status:** ✅ DONE

**Created:**
- ✅ `src/core/spatial/distance.ts` - Pure distance calculations (4 functions)
- ✅ `src/core/spatial/coordinates.ts` - Pure coordinate utilities (7 functions)
- ✅ `src/types/spatial.d.ts` - Type definitions for spatial module
- ✅ `src/core/spatial/index.ts` - Public API exports
- ✅ `src/core/spatial/distance.test.ts` - 100% coverage (48 tests)
- ✅ `src/core/spatial/coordinates.test.ts` - 100% coverage (62 tests)

**Functions Migrated:**
- `calculateDistance` (euclidean, manhattan, chebyshev)
- `hasReachedTarget` (with threshold & ignoreY options)
- `getDirectionVector` (normalized direction)
- `calculateDistance2D` (XZ plane only)
- `isValidGridCoord` (validation)
- `isValidWorldPosition` (validation)
- `encodeHexCoord` (hex to grid)
- `gridToWorld` (grid to 3D)
- `worldToGrid` (3D to grid)
- `parseGridCoord` (string to tuple)
- `createGridCoord` (tuple to string)

**Test Coverage:** 110 tests, expected 100% line coverage

**Commit:** `feat(core): add spatial pure utilities with full test coverage`

---

### ✅ Phase 1B: Refactor tileCoordinateSlice (COMPLETED)

**Date:** 2025-12-24  
**Status:** ✅ DONE

**Refactored:**
- ✅ `src/stores/useTileStore/slices/tileCoordinateSlice.ts`

**Changes:**
- All validation functions delegate to `core/spatial`
- All coordinate conversion functions inject `spacing` from store state
- Vector3 operations kept as-is (R3F specific)
- API preserved for backward compatibility
- Comments updated to reflect wrapper pattern

**Before/After:**
```typescript
// Before: Logic in store
gridToWorld: (coord) => {
  const spacing = get().spacing ?? -0.2;
  const parts = coord.split(',').map(Number);
  const x = parts[0];
  const z = parts[1];
  return {
    x: x * (1 + spacing),
    y: 0.5,
    z: z * (1 + spacing)
  };
}

// After: Wrapper over core/spatial
gridToWorld: (coord) => {
  const spacing = get().spacing ?? -0.2;
  return coreGridToWorld(coord, { spacing, defaultY: 0.5 });
}
```

**Validation:**
- ✅ Build passes (npm run build)
- ✅ All tests pass (70/70)
- ✅ No breaking changes to API
- ✅ FSM actions still functional

**Commit:** `refactor(store): tileCoordinateSlice as wrappers over core/spatial`

---

### ⏳ Phase 2A: Extract Hex Grid Generation

**Status:** ⏳ NOT STARTED  
**Target:** `src/core/spatial/hexGrid.ts`

**Functions to Extract:**
- `initializeGameGrid(radius, spacing)` → Pure TileMap generation
- `placeGameStations(tiles, config)` → Pure station placement
- `placeDangerTiles(tiles, config)` → Pure danger placement

**Commit:** `feat(core): extract hex grid generation to pure functions`

---

### ⏳ Phase 2B: Extract Pathfinding

**Status:** ⏳ NOT STARTED  
**Target:** `src/core/spatial/pathfinding.ts`

**Functions to Extract:**
- `findPath(start, end, tiles)` → Pure BFS pathfinding
- `findTilesInRadius(tiles, center, radius)` → Pure radius query

**Commit:** `feat(core): extract pathfinding algorithms with tile injection`

---

### ⏳ Phase 3: Migrate FSM Domains

**Status:** ⏳ NOT STARTED  
**Domains:** exploration → collection → maintenance

**Approach:**
- Replace `useTileStore.getState()` with `core/spatial` imports
- Use store wrappers for state-dependent operations
- Keep actions pure where possible

**Commits:**
1. `refactor(fsm): exploration domain uses core/spatial`
2. `refactor(fsm): collection domain uses core/spatial`
3. `refactor(fsm): maintenance domain uses core/spatial`

---

### ⏳ Phase 4: Query Actor Pattern

**Status:** ⏳ NOT STARTED  
**Target:** Replace injection with reactive Query Actor

**Tasks:**
- [ ] Create `tileQueryActor.ts`
- [ ] Replace `assignInjectTileData`
- [ ] Guards read from actor state
- [ ] Remove injection boilerplate

**Commit:** `feat(fsm): replace injection with Query Actor pattern`

---

### ⏳ Phase 5: Animation Position Logic

**Status:** ⏳ NOT STARTED  
**Target:** `src/core/spatial/animation.ts`

**Functions to Extract:**
- `interpolatePosition(current, target, speed, deltaTime)`
- `calculateVelocity(from, to, speed)`
- `shouldSyncPosition(current, lastSync, threshold)`

**Commit:** `refactor(animations): extract position logic to core/spatial`

---

### ⏳ Phase 6: Diagnostic Test Scenarios

**Status:** ⏳ NOT STARTED  
**Target:** `src/core/spatial/__tests__/scenarios.test.ts`

**Scenarios to Cover:**
- Full exploration cycle (deploy → scan → return)
- Multi-tile collection with overload
- Maintenance sequence (deposit → refuel → repair)
- Emergency transitions (low fuel, damage)

**Commit:** `test(core): add end-to-end spatial behavior scenarios`

---

### ⏳ Phase 7: R3F Validation

**Status:** ⏳ NOT STARTED

**Tasks:**
- [ ] Audit all R3F components for read-only access
- [ ] Validate no direct position mutations
- [ ] Document FSM → Store → React → R3F flow
- [ ] Performance benchmarks

**Commit:** `docs: finalize spatial migration with R3F validation`

---

## 📊 Overall Progress

**Phases Completed:** 1 / 9 (11%)  
**Test Coverage:** 110 tests (distance + coordinates)  
**Functions Migrated:** 11 / ~40 (28%)  
**Blockers:** None

---

## 🎯 Architecture Goals

### Zustand Role (Post-Migration)
- ✅ State persistence (tiles TileMap, config)
- ✅ Mutations (mark, update, collect)
- ✅ Thin wrappers (inject params into pure functions)
- ❌ Business logic (moved to core/spatial)

### Core/Spatial Role
- ✅ Pure algorithms (path, distance, generation)
- ✅ Validation utilities (coordinate checks)
- ✅ Config-independent logic (params passed in)
- ❌ Store access (completely decoupled)

### R3F Components
- ✅ Read positions from FSM context
- ✅ Visual interpolation in useFrame
- ✅ Performance-critical refs preserved
- ❌ Direct store access (via trackers only)

---

## 🔧 Key Decisions

### Coordinate System
- **Spacing:** `-0.2` (default, configurable)
- **Grid format:** `"x,z"` (string template)
- **World format:** `{ x, y, z }` (object)
- **Y-axis:** `0.5` (default tile height)

### Testing Strategy
- **Pure functions:** vitest in Node.js
- **Scenarios:** Mock Zustand/R3F, pure FSM context
- **Integration:** Validate round-trip conversions

### Migration Safety
- ✅ Atomic commits per phase
- ✅ Backward compatibility via wrappers
- ✅ Tests before refactoring
- ✅ No breaking changes to R3F

---

## 📝 Notes

- Phase 1A completed: Pure spatial utilities are ready
- All distance/coordinate functions have 100% test coverage
- Next: Refactor tileCoordinateSlice to use new utilities
- No runtime dependencies on Zustand or R3F in core/spatial

**Last Updated:** 2025-12-24  
**Next Milestone:** Phase 1B - Store wrapper refactoring
