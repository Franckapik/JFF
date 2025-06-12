/**
 * ============================================================================
 * MOVEMENT GUARDS - Guards primitifs pour la gestion du mouvement
 * ============================================================================
 * 
 * Guards de base pour la gestion du mouvement et des véhicules.
 * Ces guards sont réutilisables et constituent la base logique métier.
 * 
 * 🚀 GUARDS PRIMITIFS - Logique métier pure
 * 📍 Localisation: guards/core/ (au lieu de actions/)
 * 🎯 Réutilisables par les guards FSM composés
 */

// ============================================================================
// CONSTANTES MOUVEMENT
// ============================================================================

export const MOVEMENT_CONSTANTS = {
  MIN_HEALTH: 10,           // Santé minimale pour opérer
  CRITICAL_HEALTH: 25,      // Santé critique
  NORMAL_HEALTH: 50,        // Santé normale
  MAX_HEALTH: 100,          // Santé maximale
  MIN_SPEED: 0.1,           // Vitesse minimale
  TARGET_TOLERANCE: 0.5     // Tolérance pour atteindre une cible
};

// ============================================================================
// GUARDS PRIMITIFS MOUVEMENT
// ============================================================================

/**
 * Vérifie si le véhicule a une cible valide
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si cible valide
 */
const hasValidTarget = (context, event) => {
  const target = context?.vehicle?.targetPosition || context?.targetPosition;
  return target && 
         typeof target.x === 'number' && 
         typeof target.y === 'number';
};

/**
 * Vérifie si le véhicule peut se déplacer vers une position
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si peut se déplacer
 */
const canMoveTo = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const hasTarget = hasValidTarget(context, event);
  const isOperational = isVehicleOperational(context, event);
  const hasEnoughFuel = (vehicle.fuel || 0) > 5; // Minimum de carburant
  
  return hasTarget && isOperational && hasEnoughFuel;
};

/**
 * Vérifie si le mouvement est terminé
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si mouvement terminé
 */
const isMovementComplete = (context, event) => {
  const vehicle = context?.vehicle;
  const target = vehicle?.targetPosition || context?.targetPosition;
  const position = vehicle?.position;
  
  if (!position || !target) return false;
  
  const distance = Math.sqrt(
    Math.pow(target.x - position.x, 2) + 
    Math.pow(target.y - position.y, 2)
  );
  
  return distance <= MOVEMENT_CONSTANTS.TARGET_TOLERANCE;
};

/**
 * Vérifie si le véhicule est en état critique
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si véhicule critique
 */
const isVehicleCritical = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return true;
  
  const health = vehicle.health || 0;
  const fuel = vehicle.fuel || 0;
  
  return health <= MOVEMENT_CONSTANTS.CRITICAL_HEALTH || fuel <= 5;
};

/**
 * Vérifie si le véhicule est opérationnel
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si véhicule opérationnel
 */
const isVehicleOperational = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const health = vehicle.health || 0;
  const speed = vehicle.speed || 0;
  
  return health >= MOVEMENT_CONSTANTS.MIN_HEALTH && 
         speed >= MOVEMENT_CONSTANTS.MIN_SPEED;
};

/**
 * Vérifie si le véhicule a assez de carburant
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si assez de carburant
 */
const hasEnoughFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel > 10; // Seuil minimum pour opérations
};

/**
 * Vérifie si le véhicule est actif
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si véhicule actif
 */
const isVehicleActive = (context, event) => {
  const vehicle = context?.vehicle;
  return vehicle && vehicle.status === 'active';
};

/**
 * Vérifie si le véhicule est endommagé
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si véhicule endommagé
 */
const isVehicleDamaged = (context, event) => {
  const health = context?.vehicle?.health || 0;
  return health < MOVEMENT_CONSTANTS.NORMAL_HEALTH;
};

/**
 * Vérifie si le véhicule peut être utilisé
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si véhicule utilisable
 */
const canUseVehicle = (context, event) => {
  return isVehicleOperational(context, event) && 
         !isVehicleCritical(context, event);
};

/**
 * Vérifie si le véhicule a un bouclier
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si a un bouclier
 */
const hasShield = (context, event) => {
  return context?.vehicle?.shield > 0;
};

// ============================================================================
// EXPORT DES GUARDS PRIMITIFS
// ============================================================================

export const movementGuards = {
  hasValidTarget,
  canMoveTo,
  isMovementComplete,
  isVehicleCritical,
  isVehicleOperational,
  hasEnoughFuel,
  isVehicleActive,
  isVehicleDamaged,
  canUseVehicle,
  hasShield
};

export default movementGuards;
