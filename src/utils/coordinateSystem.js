// A centralized coordinate transformation system
import { Vector3 } from "three";

// Validation functions
export const isValidGridCoord = (coord) => {
  if (typeof coord !== 'string') return false;
  return /^(-?\d+,-?\d+|[A-Z]\d+)$/.test(coord);
};

export const isValidWorldPosition = (position) => {
  if (!position || typeof position !== 'object') return false;
  return (
    typeof position.x === 'number' &&
    typeof position.y === 'number' &&
    typeof position.z === 'number' &&
    !isNaN(position.x) &&
    !isNaN(position.y) &&
    !isNaN(position.z)
  );
};

// Convert letter-number format to x,z format (e.g., "B5" to "1,5")
export const hexToGridCoord = (hexCoord) => {
  if (!hexCoord || typeof hexCoord !== 'string') return null;
  const match = hexCoord.match(/^([A-Z])(\d+)$/);
  if (!match) return hexCoord; // Return as-is if it's already in x,z format
  
  const [_, letter, number] = match;
  const x = letter.charCodeAt(0) - 65; // A=0, B=1, etc.
  const z = parseInt(number);
  return `${x},${z}`;
};

// Convert x,z format to letter-number format (e.g., "1,5" to "B5")
export const gridToHexCoord = (gridCoord) => {
  if (!gridCoord || typeof gridCoord !== 'string') return null;
  const match = gridCoord.match(/^(-?\d+),(-?\d+)$/);
  if (!match) return gridCoord; // Return as-is if it's already in hex format
  
  const [_, x, z] = match;
  const letter = String.fromCharCode(65 + parseInt(x));
  return `${letter}${z}`;
};

// Grid coordinate to world position
export const gridToWorld = (coord) => {
  if (!coord) return null;
  // Convert hex format to grid format if necessary
  const gridCoord = hexToGridCoord(coord);
  if (!gridCoord) {
    console.error('Invalid grid coordinate:', coord);
    return null;
  }
  const [x, z] = gridCoord.split(',').map(Number);
  return {
    x: x,
    y: 0, // We keep y constant for the game plane
    z: z
  };
};

// World position to grid coordinate
export const worldToGrid = (position) => {
  if (!position) return null;
  if (!isValidWorldPosition(position)) {
    console.error('Invalid world position:', position);
    return null;
  }
  // Round to handle floating point imprecision
  return `${Math.round(position.x)},${Math.round(position.z)}`;
};

// Create a Vector3 from world position
export const toVector3 = (position) => {
  if (!position) return null;
  if (!isValidWorldPosition(position)) {
    console.error('Invalid world position for Vector3:', position);
    return null;
  }
  return new Vector3(position.x, position.y, position.z);
};

// Convert Vector3 to world position object
export const fromVector3 = (vector3) => {
  if (!vector3) return null;
  if (!(vector3 instanceof Vector3)) {
    console.error('Invalid Vector3:', vector3);
    return null;
  }
  return {
    x: vector3.x,
    y: vector3.y,
    z: vector3.z
  };
};

// Check if a vehicle has reached a target coordinate within a threshold
export const hasReachedTarget = (currentPos, targetCoord, threshold = 0.1) => {
  if (!currentPos || !targetCoord) return false;
  if (!isValidWorldPosition(currentPos) || !isValidGridCoord(targetCoord)) {
    console.error('Invalid positions for target check:', { currentPos, targetCoord });
    return false;
  }
  
  const targetPos = gridToWorld(targetCoord);
  const dx = Math.abs(currentPos.x - targetPos.x);
  const dz = Math.abs(currentPos.z - targetPos.z);
  
  return dx <= threshold && dz <= threshold;
};
