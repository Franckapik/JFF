/**
 * ============================================================================
 * RESOURCE GUARDS - Guards primitifs pour la gestion des ressources
 * ============================================================================
 * 
 * Guards de base pour la gestion des ressources et de l'inventaire.
 * Ces guards sont réutilisables et constituent la base logique métier.
 * 
 * 📦 GUARDS PRIMITIFS - Logique métier pure
 * 📍 Localisation: guards/core/ (au lieu de actions/)
 * 🎯 Réutilisables par les guards FSM composés
 */

import { RESOURCE_CONSTANTS, MOVEMENT_CONSTANTS, DEFAULT_CAPACITIES, VEHICLE_TYPES } from '../../constants/constants.js';

// ============================================================================
// UTILITAIRES RESSOURCES
// ============================================================================

/**
 * Obtient la capacité maximale du véhicule
 * @param {Object} vehicle - Véhicule  
 * @returns {number} Capacité maximale totale
 */
const getMaxCapacity = (vehicle) => {
  // Utiliser les capacités spécifiques par type de ressource
  const maxCapacity = vehicle?.maxCapacity;
  
  if (maxCapacity && typeof maxCapacity === 'object') {
    // Calculer la capacité totale comme somme des capacités individuelles
    return Object.values(maxCapacity).reduce((total, cap) => total + (cap || 0), 0);
  }
  
  // Fallback avec capacités par défaut du main ship depuis constants.js
  const defaultCapacities = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP] || { food: 200, debris: 1800, special: 3 };
  
  return Object.values(defaultCapacities).reduce((total, cap) => total + cap, 0); // 2003
};

/**
 * Calcule les ressources actuelles totales
 * @param {Object} vehicle - Véhicule
 * @returns {number} Total des ressources
 */
const getTotalResources = (vehicle) => {
  const resources = vehicle?.resources || {};
  return Object.values(resources).reduce((total, amount) => total + (amount || 0), 0);
};

/**
 * Calcule la capacité restante
 * @param {Object} vehicle - Véhicule
 * @returns {number} Capacité restante
 */
const getRemainingCapacity = (vehicle) => {
  const maxCapacity = getMaxCapacity(vehicle);
  const totalResources = getTotalResources(vehicle);
  return Math.max(0, maxCapacity - totalResources);
};

// ============================================================================
// GUARDS PRIMITIFS RESSOURCES
// ============================================================================

/**
 * Vérifie si le véhicule a de la capacité pour une quantité donnée
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {number} amount - Quantité à vérifier (optionnel)
 * @returns {boolean} True si a la capacité
 */
const hasCapacityFor = (context, event, amount = 1) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity >= amount;
};

/**
 * Vérifie si le véhicule est à capacité maximale
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si à capacité maximale
 */
const isAtMaxCapacity = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const remainingCapacity = getRemainingCapacity(vehicle);
  return remainingCapacity <= 0;
};

/**
 * Vérifie si le véhicule peut collecter une ressource
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {string} resourceType - Type de ressource (optionnel)
 * @returns {boolean} True si peut collecter
 */
const canCollectResource = (context, event, resourceType = null) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  // Vérifie la capacité
  if (isAtMaxCapacity(context, event)) return false;
  
  // Vérifie si le véhicule est opérationnel (importé depuis movement si nécessaire)
  const damage = vehicle.damage || 0;
  if (damage >= MOVEMENT_CONSTANTS.MAX_DAMAGE) return false;
  
  return true;
};

/**
 * Vérifie si le véhicule peut déposer des ressources
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si peut déposer
 */
const canDepositResources = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return false;
  
  const totalResources = getTotalResources(vehicle);
  return totalResources > 0;
};

/**
 * Vérifie si le véhicule a un type de ressource spécifique
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {string} resourceType - Type de ressource
 * @returns {boolean} True si a le type de ressource
 */
const hasResourceType = (context, event, resourceType) => {
  const vehicle = context?.vehicle;
  if (!vehicle || !resourceType) return false;
  
  const resources = vehicle.resources || {};
  return (resources[resourceType] || 0) > 0;
};

/**
 * Vérifie si l'inventaire est vide
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si inventaire vide
 */
const isInventoryEmpty = (context, event) => {
  const vehicle = context?.vehicle;
  if (!vehicle) return true;
  
  const totalResources = getTotalResources(vehicle);
  return totalResources === 0;
};

/**
 * Vérifie si le véhicule a suffisamment d'une ressource spécifique
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {string} resourceType - Type de ressource
 * @param {number} amount - Quantité minimale
 * @returns {boolean} True si a suffisamment
 */
const hasEnoughResource = (context, event, resourceType, amount = 1) => {
  const vehicle = context?.vehicle;
  if (!vehicle || !resourceType) return false;
  
  const resources = vehicle.resources || {};
  return (resources[resourceType] || 0) >= amount;
};

/**
 * Vérifie si le véhicule peut transporter plus de ressources
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si peut transporter plus
 */
const canCarryMore = (context, event) => {
  return !isAtMaxCapacity(context, event);
};

// ============================================================================
// EXPORT DES GUARDS PRIMITIFS
// ============================================================================

export const resourceGuards = {
  hasCapacityFor,
  isAtMaxCapacity,
  canCollectResource,
  canDepositResources,
  hasResourceType,
  isInventoryEmpty,
  hasEnoughResource,
  canCarryMore
};

// Utilitaires également exportés
export const resourceUtils = {
  getMaxCapacity,
  getTotalResources,
  getRemainingCapacity
};

export default resourceGuards;
