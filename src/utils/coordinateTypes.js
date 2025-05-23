/**
 * @typedef {Object} WorldPosition
 * @property {number} x - X coordinate in world space
 * @property {number} y - Y coordinate in world space (usually 0 for our game plane)
 * @property {number} z - Z coordinate in world space
 */

/**
 * @typedef {string} GridCoordinate - Format: "x,z", where x and z are integers
 */

/**
 * @typedef {Object} VehiclePosition
 * @property {WorldPosition} position - Position in world space
 * @property {GridCoordinate} coord - Position in grid coordinates
 * @property {Object} targetTile - Target tile information
 * @property {WorldPosition} targetTile.position - Target position in world space
 * @property {GridCoordinate} targetTile.coord - Target position in grid coordinates
 */

// Export type references for documentation
export const CoordinateTypes = {
  /** @type {WorldPosition} */
  WorldPosition: null,
  /** @type {GridCoordinate} */
  GridCoordinate: null,
  /** @type {VehiclePosition} */
  VehiclePosition: null
};
