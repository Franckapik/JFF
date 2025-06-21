/**
 * =========================================================================
 * TILE COORDINATE SLICE - Gestion centralisée des systèmes de coordonnées
 * =========================================================================
 * 
 * Ce slice gère tous les aspects liés aux coordonnées des tuiles :
 * - Validation des coordonnées (grille et monde)
 * - Conversion entre formats (hex, grille, monde)
 * - Opérations sur les Vector3
 * - Calculs de distance et de cibles
 * 
 * Fonctionnalités migrées depuis utils/coordinateSystem.js :
 * - isValidGridCoord, isValidWorldPosition
 * - hexToGridCoord, gridToHexCoord
 * - gridToWorld, worldToGrid
 * - toVector3, fromVector3
 * - hasReachedTarget
 */

import { Vector3 } from "three";

// =========================================================================
// SLICE FACTORY - COORDINATE UTILITIES
// =========================================================================

const createTileCoordinateSlice = (set, get) => ({
  // =========================================================================
  // VALIDATION FUNCTIONS
  // =========================================================================
  
  /**
   * Valide une coordonnée de grille
   * @param {string} coord - Coordonnée au format "x,z"
   * @returns {boolean} - True si valide
   */
  isValidGridCoord: (coord) => {
    if (coord === null || coord === undefined) return false;
    if (typeof coord !== 'string') return false;
    return /^-?\d+,-?\d+$/.test(coord);
  },

  /**
   * Valide une position mondiale
   * @param {Object} position - Position avec propriétés x, y, z
   * @returns {boolean} - True si valide
   */
  isValidWorldPosition: (position) => {
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
  },

  // =========================================================================
  // COORDINATE CONVERSION FUNCTIONS
  // =========================================================================

  /**
   * Convertit format lettre-numéro vers format x,z (ex: "B5" vers "1,5")
   * @param {string} hexCoord - Coordonnée hex (ex: "B5")
   * @returns {string|null} - Coordonnée grille ou null si invalide
   */
  hexToGridCoord: (hexCoord) => {
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
  },

  /**
   * Convertit format x,z vers format lettre-numéro (ex: "1,5" vers "B5")
   * @param {string} gridCoord - Coordonnée grille (ex: "1,5")
   * @returns {string|null} - Coordonnée hex ou null si invalide
   */
  gridToHexCoord: (gridCoord) => {
    
    if (gridCoord === null) return null;
    if (gridCoord === undefined) return undefined;
    if (gridCoord === '') return '';
    if (typeof gridCoord !== 'string') return null;
    
    // Check if already in hex format (letter followed by number)
    if (gridCoord.match(/^[A-Za-z]\d+$/i)) return gridCoord;
    
    // Handle both 2D (x,z) and 3D (x,y,z) formats
    const match2D = gridCoord.match(/^(-?\d+),(-?\d+)$/);
    const match3D = gridCoord.match(/^(-?\d+),(-?\d+),(-?\d+)$/);
    
    let x, z;
    
    if (match3D) {
      // 3D format: x,y,z - extract x and z (ignore y)
      x = match3D[1];
      z = match3D[3];
    } else if (match2D) {
      // 2D format: x,z
      x = match2D[1];
      z = match2D[2];
    } else {
      return gridCoord; // Return as-is if it doesn't match expected format
    }
    
    const xNum = parseInt(x);
    const zNum = parseInt(z);
    
    // Use the same encoding system as tileGenerationSlice
    // Assuming radius = 3 (default value from tileBaseSlice)
    const radius = 3;
    
    // Convert grid coordinates to hex coordinates using the same encoding
    // In the hex system: q corresponds to x, r corresponds to z
    const q = xNum;
    const r = zNum;
    
    // Check if coordinates are within valid range
    if (q < -radius || q > radius || r < -radius || r > radius) {
      // Coordinate out of range, return as-is (likely needs different handling)
      return gridCoord;
    }
    
    // Encode using the same formula as encodeHexCoord in tileGenerationSlice
    const letter = String.fromCharCode(65 + q + radius); // 65 = 'A'
    const encodedCoord = `${letter}${r + radius}`;
    
    return encodedCoord;
  },

  // =========================================================================
  // WORLD-GRID COORDINATE CONVERSION
  // =========================================================================

  /**
   * Convertit coordonnées de grille vers position mondiale
   * @param {string} gridCoord - Coordonnée grille (ex: "1,5")
   * @returns {Object|null} - Position {x, y, z} ou null si invalide
   */
  gridToWorld: (gridCoord) => {
    const { isValidGridCoord, hexToGridCoord } = get();
    
    if (!gridCoord) return null;
    
    // Normaliser en coordonnée de grille si nécessaire
    const normalizedCoord = hexToGridCoord(gridCoord);
    if (!isValidGridCoord(normalizedCoord)) return null;
    
    const [x, z] = normalizedCoord.split(',').map(Number);
    
    // Utiliser les mêmes constantes que generateBaseHexGrid pour la cohérence
    const hexSize = 1.7;
    const sqrt3 = Math.sqrt(3);
    const spacing = 0.1; // Utilise l'espacement par défaut du store
    
    // Convertir les coordonnées de grille en coordonnées hexagonales q,r
    // puis en position mondiale en utilisant la même formule que generateBaseHexGrid
    const q = x;
    const r = z;
    
    const worldX = (q + r / 2) * (hexSize + spacing);
    const worldZ = r * (sqrt3 / 2) * (hexSize + spacing);
    
    return {
      x: worldX,
      y: 0, // Position Y par défaut
      z: worldZ
    };
  },

  /**
   * Convertit position mondiale vers coordonnées de grille
   * @param {Object} worldPosition - Position {x, y, z}
   * @returns {string|null} - Coordonnée grille ou null si invalide
   */
  worldToGrid: (worldPosition) => {
    const { isValidWorldPosition } = get();
    
    if (!isValidWorldPosition(worldPosition)) return null;
    
    // Utiliser les mêmes constantes que generateBaseHexGrid
    const hexSize = 1.7;
    const sqrt3 = Math.sqrt(3);
    const spacing = 0.1;
    
    const { x, z } = worldPosition;
    
    // Formules inverses pour convertir position mondiale en coordonnées hexagonales q,r
    // Inversement de:
    // worldX = (q + r / 2) * (hexSize + spacing)
    // worldZ = r * (sqrt3 / 2) * (hexSize + spacing)
    
    const scale = hexSize + spacing;
    const r = Math.round(z / ((sqrt3 / 2) * scale));
    const q = Math.round((x / scale) - (r / 2));
    
    return `${q},${r}`;
  },

  // =========================================================================
  // VECTOR3 OPERATIONS
  // =========================================================================

  /**
   * Crée un Vector3 depuis une position mondiale
   * @param {Object} position - Position avec x, y, z
   * @returns {Vector3|null} - Vector3 ou null
   */
  toVector3: (position) => {
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
  },

  /**
   * Convertit Vector3 vers objet position mondiale
   * @param {Vector3} vector3 - Instance Vector3
   * @returns {Object|null} - Position {x, y, z} ou null
   */
  fromVector3: (vector3) => {
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
  },

  // =========================================================================
  // TARGET AND DISTANCE CALCULATIONS
  // =========================================================================

  /**
   * Vérifie si un véhicule a atteint sa cible
   * @param {Object} currentPos - Position actuelle
   * @param {string} targetCoord - Coordonnée cible
   * @param {number} threshold - Seuil de distance (défaut: 0.15)
   * @returns {boolean} - True si la cible est atteinte
   */
  hasReachedTarget: (currentPos, targetCoord, threshold = 0.15) => {
    const { isValidWorldPosition, isValidGridCoord, gridToWorld } = get();
    
    if (!currentPos || !targetCoord) return false;
    if (!isValidWorldPosition(currentPos) || !isValidGridCoord(targetCoord)) {
      return false;
    }
    
    const targetPos = gridToWorld(targetCoord);
    const dx = Math.abs(currentPos.x - targetPos.x);
    const dz = Math.abs(currentPos.z - targetPos.z);
    
    return dx <= threshold && dz <= threshold;
  },

  // =========================================================================
  // UTILITY METHODS FOR COORDINATE OPERATIONS
  // =========================================================================

  /**
   * Normalise une coordonnée (s'assure qu'elle est dans le bon format)
   * @param {string} coord - Coordonnée à normaliser
   * @returns {string|null} - Coordonnée normalisée
   */
  normalizeCoordinate: (coord) => {
    const { hexToGridCoord, isValidGridCoord } = get();
    
    if (!coord) return null;
    
    const gridCoord = hexToGridCoord(coord);
    return isValidGridCoord(gridCoord) ? gridCoord : null;
  }
});

export default createTileCoordinateSlice;
