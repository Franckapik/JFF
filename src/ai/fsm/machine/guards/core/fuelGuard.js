/**
 * ============================================================================
 * FUEL GUARDS - Guards primitifs pour la gestion du carburant
 * ============================================================================
 * 
 * Guards de base pour la gestion du carburant, extraits depuis les actions.
 * Ces guards sont réutilisables et constituent la base logique métier.
 * 
 * 🔥 GUARDS PRIMITIFS - Logique métier pure
 * 📍 Localisation: guards/core/ (au lieu de actions/)
 * 🎯 Réutilisables par les guards FSM composés
 */

import { FUEL_THRESHOLDS } from '../../constants/constants.js';

// ============================================================================
// GUARDS PRIMITIFS CARBURANT
// ============================================================================

/**
 * Vérifie si le niveau de carburant est bas
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si le carburant est bas
 */
const isLowFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.LOW;
};

/**
 * Vérifie si le niveau de carburant est critique
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si le carburant est critique
 */
const isCriticalFuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel <= FUEL_THRESHOLDS.CRITICAL;
};

/**
 * Vérifie si le véhicule a assez de carburant pour une distance donnée
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {number} distance - Distance à parcourir (optionnel)
 * @returns {boolean} True si assez de carburant
 */
const hasEnoughFuelForDistance = (context, event, distance = 10) => {
  const fuel = context?.vehicle?.fuel || 0;
  const fuelConsumptionRate = context?.vehicle?.fuelConsumptionRate || 1;
  const requiredFuel = distance * fuelConsumptionRate;
  
  return fuel >= requiredFuel;
};

/**
 * Vérifie si le véhicule peut consommer du carburant
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @param {number} amount - Quantité à consommer (optionnel)
 * @returns {boolean} True si peut consommer
 */
const canConsumeFuel = (context, event, amount = 1) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= amount;
};

/**
 * Vérifie si le véhicule peut faire le plein
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si peut faire le plein
 */
const canRefuel = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  // Peut faire le plein si pas déjà plein et à la base
  return fuel < FUEL_THRESHOLDS.FULL;
};

/**
 * Vérifie si le réservoir est plein
 * @param {Object} context - Contexte FSM
 * @param {Object} event - Événement FSM
 * @returns {boolean} True si le réservoir est plein
 */
const isFullTank = (context, event) => {
  const fuel = context?.vehicle?.fuel || 0;
  return fuel >= FUEL_THRESHOLDS.FULL;
};

// ============================================================================
// EXPORT DES GUARDS PRIMITIFS
// ============================================================================

export const fuelGuards = {
  isLowFuel,
  isCriticalFuel,
  hasEnoughFuelForDistance,
  canConsumeFuel,
  canRefuel,
  isFullTank
};

export default fuelGuards;
