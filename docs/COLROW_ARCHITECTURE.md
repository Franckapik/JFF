/**
 * ============================================================================
 * COLROW COORDINATE SYSTEM - ARCHITECTURE ANALYSIS & IMPLEMENTATION GUIDE
 * ============================================================================
 * 
 * This document outlines how to make ColRowCoordinate a primary type in the
 * project, complementing or potentially replacing GridCoordinate.
 */

// ============================================================================
// CURRENT COORDINATE SYSTEM ARCHITECTURE
// ============================================================================

/*
 * The project currently uses 3 main coordinate systems:
 * 
 * 1. WorldPosition {x, y, z}
 *    - 3D space in Three.js world
 *    - Used for rendering, animations, physics
 *    - Continuous values (floats)
 *    - Converted via: gridToWorld() / worldToGrid()
 * 
 * 2. GridCoordinate "q,r" (string)
 *    - Internal hex grid system
 *    - Discrete positions on the game grid
 *    - Used throughout FSM, pathfinding, tile operations
 *    - Format: "0,3", "-1,5", etc.
 * 
 * 3. ColRowCoordinate "A1" (NEW - proposed)
 *    - Human-readable format
 *    - UI display, user input, game board references
 *    - Column-based (A, B, C, ... AA, AB, ...)
 *    - Row-based (1, 2, 3, ...)
 */

// ============================================================================
// STRATEGY 1: COLROW AS DISPLAY/INPUT LAYER (RECOMMENDED - Lowest Risk)
// ============================================================================

/*
 * KEEP GridCoordinate as the internal format throughout FSM, stores, and logic.
 * USE ColRowCoordinate only for:
 * - UI display (TileMatrix, debug panels, etc.)
 * - User input (if you add input forms)
 * - Logging and debugging
 * 
 * IMPLEMENTATION:
 * - In React components: Display ColRow labels computed from GridCoordinate
 * - In UI handlers: Parse user ColRow input → convert to GridCoordinate
 * - In stores: Keep internal state as GridCoordinate
 * - In FSM: Keep all logic using GridCoordinate
 * 
 * PROS:
 * ✅ Minimal changes to existing code
 * ✅ No risk of breaking internal logic
 * ✅ Cleaner separation: logic vs presentation
 * ✅ Easy to debug (GridCoordinate is more explicit)
 * 
 * CONS:
 * ❌ Constant conversion overhead in UI components
 * ❌ Grid bounds must be passed to conversion functions
 * 
 * REQUIRED CHANGES:
 * - TileMatrix already uses getColRowLabel() for display ✓
 * - Add colRowToGrid() calls in any user input handlers
 * - Export converters from core/spatial/index.ts
 */

// ============================================================================
// STRATEGY 2: COLROW AS PRIMARY WITH DUAL FORMAT SUPPORT (Moderate Risk)
// ============================================================================

/*
 * Make ColRowCoordinate the primary format in types, stores, and FSM.
 * Convert GridCoordinate ↔ ColRowCoordinate at boundaries.
 * 
 * IMPLEMENTATION:
 * - Change types: GridCoordinate → ColRowCoordinate (or use a union)
 * - Update stores: Handle both formats internally
 * - Update FSM: Use ColRow throughout (or add conversion helpers)
 * - Update pathfinding: Work with ColRow format
 * 
 * PROS:
 * ✅ More readable code (A1 vs 0,3)
 * ✅ Better for user-facing operations
 * ✅ Easier to debug visually
 * 
 * CONS:
 * ❌ Massive refactoring required
 * ❌ Risk of breaking entire FSM logic
 * ❌ Conversion overhead throughout codebase
 * ❌ Harder to work with hex math (q,r is better for hexagonal geometry)
 * 
 * REQUIRED CHANGES:
 * - Update types/coordinates.d.ts (change primary type definitions)
 * - Refactor all tile store methods
 * - Update all FSM domain actions
 * - Update pathfinding algorithms
 * - Update all guard functions
 * - Update all action context assignments
 * - Update context initialization
 * - Update all tests
 * 
 * ESTIMATED EFFORT: 3-5 days for complete refactoring
 */

// ============================================================================
// STRATEGY 3: HYBRID APPROACH (RECOMMENDED FOR FUTURE - Medium Risk)
// ============================================================================

/*
 * Use a union type internally that supports both formats.
 * Gradually migrate components to use ColRow.
 * 
 * IMPLEMENTATION:
 * - Create type: CoordinateFormat = GridCoordinate | ColRowCoordinate
 * - Add intelligent conversion layer in stores
 * - Update components incrementally
 * 
 * PROS:
 * ✅ No breaking changes to existing code
 * ✅ Gradual migration path
 * ✅ Best of both worlds
 * 
 * CONS:
 * ❌ Requires careful type guards
 * ❌ More complex implementation
 * ❌ Runtime format detection needed
 * 
 * REQUIRED CHANGES:
 * - Add union type: CoordinateFormat
 * - Add type guards: isGridCoordinate(), isColRowCoordinate()
 * - Update store methods to accept both formats
 * - Add smart routing based on format
 * - Update UI components as needed
 */

// ============================================================================
// RECOMMENDED IMPLEMENTATION ROADMAP
// ============================================================================

/*
 * PHASE 1 (NOW - 1-2 hours): ✓ Display Layer Integration
 * - ColRowCoordinate type defined
 * - Conversion functions created
 * - TileMatrix updated to show labels
 * - Export functions from core/spatial/index.ts
 * 
 * PHASE 2 (Optional - 3-4 hours): Display Enhancement
 * - Add ColRow labels to other debug panels
 * - Add ColRow input support (if needed)
 * - Add ColRow logging to FSM
 * - Create utility hooks for ColRow display
 * 
 * PHASE 3 (Optional - 2-3 days): Hybrid Approach
 * - Create CoordinateFormat union type
 * - Add type guards and smart conversion
 * - Update stores to support both formats
 * - Migrate components incrementally
 * 
 * PHASE 4 (Future - Full Migration): Complete Replacement
 * - Only consider if ColRow proves significantly better
 * - Requires extensive testing
 * - Must be done carefully to avoid breaking FSM
 */

// ============================================================================
// IMMEDIATE NEXT STEPS
// ============================================================================

/*
 * TO USE COLROW IN THE PROJECT NOW:
 * 
 * 1. Export converters from core/spatial/index.ts:
 *    export { gridToColRow, colRowToGrid, getColRowLabel } from './colRowCoordinate';
 * 
 * 2. In TileMatrix (already done):
 *    const label = getColRowLabel(q, r, minQ, minR);
 * 
 * 3. In other components:
 *    import { getColRowLabel } from '../core/spatial';
 *    const colRowLabel = getColRowLabel(q, r, minQ, minR);
 * 
 * 4. For user input:
 *    import { colRowToGrid } from '../core/spatial';
 *    const gridCoord = colRowToGrid(userInput, bounds);
 * 
 * 5. For logging:
 *    import { gridToColRow } from '../core/spatial';
 *    console.log(`Exploring ${gridToColRow(coord, bounds)}`);
 */

// ============================================================================
// TYPE DEFINITION EXAMPLES
// ============================================================================

// CURRENT (GridCoordinate only):
type OldCoordinateSystem = {
  coord: string; // "0,3"
  tiles: Record<string, TileData>; // indexed by GridCoordinate
};

// STRATEGY 1 (Display layer - RECOMMENDED NOW):
type DisplayLayer = {
  coord: string; // "0,3" (GridCoordinate internally)
  displayLabel: string; // "A1" (ColRowCoordinate for UI)
};

// STRATEGY 3 (Hybrid - for future):
type HybridCoordinate = 
  | { type: 'grid'; value: GridCoordinate }
  | { type: 'colRow'; value: ColRowCoordinate };

type HybridSystem = {
  coord: HybridCoordinate;
  tiles: Record<string, TileData>; // needs conversion layer
};

// ============================================================================
// CONVERSION LAYER IMPLEMENTATION (for Hybrid Approach)
// ============================================================================

/*
export class CoordinateConverter {
  constructor(private bounds: GridBounds) {}
  
  toColRow(gridCoord: GridCoordinate): ColRowCoordinate {
    return gridToColRow(gridCoord, this.bounds);
  }
  
  toGrid(colRow: ColRowCoordinate): GridCoordinate {
    return colRowToGrid(colRow, this.bounds);
  }
  
  isSameLocation(
    coord1: GridCoordinate | ColRowCoordinate,
    coord2: GridCoordinate | ColRowCoordinate
  ): boolean {
    const grid1 = isColRowCoordinate(coord1) ? this.toGrid(coord1) : coord1;
    const grid2 = isColRowCoordinate(coord2) ? this.toGrid(coord2) : coord2;
    return grid1 === grid2;
  }
}

// Usage in stores:
const converter = new CoordinateConverter(bounds);
const tileData = getTile(converter.toGrid(userInputColRow));
*/

// ============================================================================
// TESTING CONSIDERATIONS
// ============================================================================

/*
 * Key test cases for ColRow integration:
 * 
 * 1. Conversion accuracy:
 *    - gridToColRow(GridCoordinate, bounds) → ColRowCoordinate
 *    - colRowToGrid(ColRowCoordinate, bounds) → GridCoordinate (inverse)
 *    - Round-trip: coord → colRow → coord should be identical
 * 
 * 2. Boundary handling:
 *    - Coordinates at grid edges (A1, AA1, etc.)
 *    - Out-of-bounds detection
 *    - Large grids (>26 columns → AA, AB, AC, ...)
 * 
 * 3. UI integration:
 *    - Labels display correctly on TileMatrix
 *    - Labels update when grid changes
 *    - Hover tooltips show both formats
 * 
 * 4. User input (if added):
 *    - Parse various ColRow inputs
 *    - Case-insensitive handling
 *    - Invalid input rejection
 */
