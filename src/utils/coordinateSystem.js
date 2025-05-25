// A centralized coordinate transformation system
import { Vector3 } from "three";

// Validation functions
export const isValidGridCoord = (coord) => {
  if (coord === null || coord === undefined) return false;
  if (typeof coord !== 'string') return false;
  return /^-?\d+,-?\d+$/.test(coord);
};

export const isValidWorldPosition = (position) => {
  if (!position || typeof position !== 'object' || Array.isArray(position)) return false;
  return (
    'x' in position &&
    'y' in position &&
    'z' in position &&
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
  if (hexCoord === null) return null;
  if (hexCoord === undefined) return undefined;
  if (hexCoord === '') return '';
  if (typeof hexCoord !== 'string') return null;
  
  // Check if it's already in grid format
  if (hexCoord.match(/^-?\d+,-?\d+$/)) return hexCoord;
  
  const match = hexCoord.match(/^([A-Za-z])(\d+)$/i);
  if (!match) return hexCoord; // Return as-is if it doesn't match any format
  
  const [_, letter, number] = match;
  const x = letter.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
  const z = parseInt(number);
  return `${x},${z}`;
};

// Convert x,z format to letter-number format (e.g., "1,5" to "B5")
export const gridToHexCoord = (gridCoord) => {
  if (gridCoord === null) return null;
  if (gridCoord === undefined) return undefined;
  if (gridCoord === '') return '';
  if (typeof gridCoord !== 'string') return null;
  
  // Check if already in hex format (letter followed by number)
  if (gridCoord.match(/^[A-Za-z]\d+$/i)) return gridCoord;
  
  const match = gridCoord.match(/^(-?\d+),(-?\d+)$/);
  if (!match) return gridCoord; // Return as-is if it doesn't match expected format
  
  const [_, x, z] = match;
  const xNum = parseInt(x);
  // Handle negative coordinates appropriately
  if (xNum < 0 || xNum > 25) return gridCoord; // Return as-is for out of range coordinates
  
  const letter = String.fromCharCode(65 + xNum);
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
  
  // Vérifier si le format est valide après conversion (doit être "x,z")
  if (!isValidGridCoord(gridCoord)) {
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
  if (position === null || position === undefined) return null;
  
  // Handle empty object
  if (typeof position === 'object' && Object.keys(position).length === 0) {
    return '0,0';
  }
  
  if (!isValidWorldPosition(position)) {
    console.error('Invalid world position:', position);
    return null;
  }
  // Round to handle floating point imprecision
  return `${Math.round(position.x)},${Math.round(position.z)}`;
};

// Create a Vector3 from world position
export const toVector3 = (position) => {
  if (position === null || position === undefined) return null;
  
  // Handle partial or empty object case
  if (typeof position === 'object') {
    const x = typeof position.x === 'number' ? position.x : 0;
    const y = typeof position.y === 'number' ? position.y : 0;
    const z = typeof position.z === 'number' ? position.z : 0;
    
    return new Vector3(x, y, z);
  }
  
  console.error('Invalid world position for Vector3:', position);
  return null;
};

// Convert Vector3 to world position object
export const fromVector3 = (vector3) => {
  if (vector3 === null || vector3 === undefined) return null;
  
  // Accept any object with x, y, z properties
  if (typeof vector3 === 'object' && 'x' in vector3 && 'y' in vector3 && 'z' in vector3) {
    return {
      x: vector3.x,
      y: vector3.y,
      z: vector3.z
    };
  }
  
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
export const hasReachedTarget = (currentPos, targetCoord, threshold = 0.15) => {
  if (!currentPos || !targetCoord) return false;
  if (!isValidWorldPosition(currentPos) || !isValidGridCoord(targetCoord)) {
    return false;
  }
  
  const targetPos = gridToWorld(targetCoord);
  const dx = Math.abs(currentPos.x - targetPos.x);
  const dz = Math.abs(currentPos.z - targetPos.z);
  
  return dx <= threshold && dz <= threshold;
};
