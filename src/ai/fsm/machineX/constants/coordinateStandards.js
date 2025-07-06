/**
 * ============================================================================
 * STANDARDS DE COORDONNÉES - Définitions unifiées pour tout le projet
 * ============================================================================
 * 
 * Ce fichier définit les standards de format pour tous les systèmes de coordonnées
 * du projet afin d'éliminer les incohérences et erreurs de format.
 * 
 * @author Standardisation Coordonnées Phase 1
 * @version 1.0.0
 */

// ============================================================================
// TYPES DE COORDONNÉES STANDARDISÉS
// ============================================================================

/**
 * @typedef {string} GridCoordinate
 * Format: "x,z" (ex: "5,3", "-2,7", "0,0")
 * - Utilisé comme clé primaire pour toutes les tuiles
 * - Format de stockage dans les Maps et objets
 * - Format d'échange entre composants
 */

/**
 * @typedef {Object} WorldPosition
 * @property {number} x - Position X dans l'espace 3D
 * @property {number} y - Position Y dans l'espace 3D (hauteur)
 * @property {number} z - Position Z dans l'espace 3D
 * 
 * Format: {x: 8.5, y: 0.5, z: 5.1}
 * - Position absolue dans l'espace 3D Three.js
 * - Utilisé pour le rendu et les calculs physiques
 * - Converti depuis/vers GridCoordinate selon besoin
 */

/**
 * @typedef {string} HexCoordinate  
 * Format: "A5", "B3", "C1" (ex: lettre + chiffre)
 * - Format d'affichage hexagonal (optionnel)
 * - Utilisé uniquement pour l'UI et les logs
 * - Converti depuis GridCoordinate pour affichage
 */

// ============================================================================
// FONCTIONS DE VALIDATION STANDARDISÉES
// ============================================================================

/**
 * Valide qu'une coordonnée respecte le format GridCoordinate
 * @param {any} coord - Coordonnée à valider
 * @returns {boolean} - True si format valide "x,z"
 */
export const isValidGridCoordinate = (coord) => {
  if (coord === null || coord === undefined) return false;
  if (typeof coord !== 'string') return false;
  return /^-?\d+,-?\d+$/.test(coord);
};

/**
 * Valide qu'une position respecte le format WorldPosition
 * @param {any} position - Position à valider
 * @returns {boolean} - True si format valide {x, y, z}
 */
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

/**
 * Valide qu'une coordonnée respecte le format HexCoordinate
 * @param {any} coord - Coordonnée hex à valider
 * @returns {boolean} - True si format valide "A5", "B3", etc.
 */
export const isValidHexCoordinate = (coord) => {
  if (coord === null || coord === undefined) return false;
  if (typeof coord !== 'string') return false;
  return /^[A-Za-z]\d+$/.test(coord);
};

// ============================================================================
// FONCTIONS DE CONVERSION SÉCURISÉES
// ============================================================================

/**
 * Convertit un objet {x, z} vers format GridCoordinate "x,z"
 * @param {Object} coordObj - Objet avec propriétés x et z
 * @returns {string|null} - Coordonnée "x,z" ou null si invalide
 */
export const objectToGridCoordinate = (coordObj) => {
  if (!coordObj || typeof coordObj !== 'object') return null;
  if (!('x' in coordObj) || !('z' in coordObj)) return null;
  if (typeof coordObj.x !== 'number' || typeof coordObj.z !== 'number') return null;
  if (isNaN(coordObj.x) || isNaN(coordObj.z)) return null;
  
  return `${coordObj.x},${coordObj.z}`;
};

/**
 * Convertit un format GridCoordinate "x,z" vers objet {x, z}
 * @param {string} gridCoord - Coordonnée "x,z"
 * @returns {Object|null} - Objet {x, z} ou null si invalide
 */
export const gridCoordinateToObject = (gridCoord) => {
  if (!isValidGridCoordinate(gridCoord)) return null;
  
  const [x, z] = gridCoord.split(',').map(Number);
  return { x, z };
};

/**
 * Normalise n'importe quel format vers GridCoordinate standard
 * @param {any} coord - Coordonnée de n'importe quel format
 * @returns {string|null} - Coordonnée "x,z" ou null si impossible
 */
export const normalizeToGridCoordinate = (coord) => {
  // Déjà au bon format
  if (isValidGridCoordinate(coord)) return coord;
  
  // Format objet {x, z}
  if (typeof coord === 'object' && coord !== null) {
    return objectToGridCoordinate(coord);
  }
  
  // Format hex "A5" -> nécessite conversion via tileCoordinateSlice
  if (isValidHexCoordinate(coord)) {
    // Cette conversion doit utiliser le tileCoordinateSlice
    console.warn('Conversion hex vers grid nécessite tileCoordinateSlice.hexToGridCoord()');
    return null;
  }
  
  return null;
};

// ============================================================================
// STRUCTURES DE DONNÉES STANDARDISÉES
// ============================================================================

/**
 * Structure standardisée pour une tuile
 */
export const createStandardTile = (gridCoord, worldPosition, additionalProps = {}) => {
  if (!isValidGridCoordinate(gridCoord)) {
    throw new Error(`Invalid grid coordinate: ${gridCoord}. Expected format "x,z"`);
  }
  
  if (!isValidWorldPosition(worldPosition)) {
    throw new Error(`Invalid world position: ${JSON.stringify(worldPosition)}. Expected {x, y, z}`);
  }
  
  return {
    coord: gridCoord,              // STANDARD: "x,z"
    position: worldPosition,       // STANDARD: {x, y, z}
    ...additionalProps
  };
};

/**
 * Structure standardisée pour la cible d'un véhicule
 */
export const createStandardTarget = (gridCoord = null, worldPosition = null) => {
  if (gridCoord !== null && !isValidGridCoordinate(gridCoord)) {
    throw new Error(`Invalid target grid coordinate: ${gridCoord}. Expected format "x,z" or null`);
  }
  
  if (worldPosition !== null && !isValidWorldPosition(worldPosition)) {
    throw new Error(`Invalid target position: ${JSON.stringify(worldPosition)}. Expected {x, y, z} or null`);
  }
  
  return {
    coord: gridCoord,         // STANDARD: "x,z" ou null
    position: worldPosition   // STANDARD: {x, y, z} ou null
  };
};

// ============================================================================
// CONSTANTES D'ERREUR
// ============================================================================

export const COORDINATE_ERRORS = {
  INVALID_GRID_FORMAT: 'Invalid coordinate format: expected "x,z" string',
  INVALID_WORLD_FORMAT: 'Invalid position format: expected {x, y, z} object',
  INVALID_HEX_FORMAT: 'Invalid hex coordinate format: expected "A5" format',
  MISSING_POSITION: 'Missing position or coord in tile data',
  CONVERSION_FAILED: 'Failed to convert coordinate format'
};

// ============================================================================
// EXPORT
// ============================================================================

export default {
  isValidGridCoordinate,
  isValidWorldPosition,
  isValidHexCoordinate,
  objectToGridCoordinate,
  gridCoordinateToObject,
  normalizeToGridCoordinate,
  createStandardTile,
  createStandardTarget,
  COORDINATE_ERRORS
};
