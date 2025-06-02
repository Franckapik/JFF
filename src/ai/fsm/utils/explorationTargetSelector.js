/**
 * ============================================================================
 * EXPLORATION TARGET SELECTOR - Sélection intelligente de cibles d'exploration
 * ============================================================================
 * 
 * Utilitaire pour sélectionner des zones d'exploration optimales basées sur
 * le contexte FSM du bot (position, historique, ressources, etc.)
 * 
 * @author FSM Integration
 * @version 1.0.0
 */

import fsmLogger from '../../../logger/fsmLogger.js';

// ============================================================================
// CONSTANTES DE CONFIGURATION
// ============================================================================

/**
 * Configuration des zones d'exploration
 */
const EXPLORATION_CONFIG = {
  // Distance minimale/maximale depuis le vaisseau
  MIN_DISTANCE: 5,
  MAX_DISTANCE: 20,
  
  // Hauteur d'exploration (pour les drones volants)
  MIN_HEIGHT: 1,
  MAX_HEIGHT: 4,
  
  // Secteurs d'exploration (pour éviter les répétitions)
  SECTORS: 8, // Divise l'espace en 8 secteurs
  
  // Priorités de sélection
  PRIORITY_WEIGHTS: {
    DISTANCE: 0.3,      // Préférer distances moyennes
    NOVELTY: 0.4,       // Préférer zones non explorées
    RESOURCES: 0.3      // Préférer zones avec potentiel de ressources
  }
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Génère une position aléatoire dans un secteur donné
 * @param {Object} basePosition - Position de base (vaisseau)
 * @param {number} sector - Secteur (0-7)
 * @param {number} distance - Distance depuis la base
 * @returns {Object} Position {x, y, z}
 */
function generateSectorPosition(basePosition, sector, distance) {
  const angleStep = (2 * Math.PI) / EXPLORATION_CONFIG.SECTORS;
  const baseAngle = sector * angleStep;
  
  // Ajouter une variation aléatoire dans le secteur
  const angleVariation = (Math.random() - 0.5) * angleStep * 0.8;
  const finalAngle = baseAngle + angleVariation;
  
  // Ajouter une variation de distance
  const distanceVariation = distance * (0.7 + Math.random() * 0.6); // ±30% variation
  
  return {
    x: basePosition.x + Math.cos(finalAngle) * distanceVariation,
    y: basePosition.y + EXPLORATION_CONFIG.MIN_HEIGHT + 
       Math.random() * (EXPLORATION_CONFIG.MAX_HEIGHT - EXPLORATION_CONFIG.MIN_HEIGHT),
    z: basePosition.z + Math.sin(finalAngle) * distanceVariation
  };
}

/**
 * Calcule le score de nouveauté d'une zone
 * @param {Object} position - Position à évaluer
 * @param {Array} explorationHistory - Historique des explorations
 * @returns {number} Score de nouveauté (0-1)
 */
function calculateNoveltyScore(position, explorationHistory = []) {
  if (!explorationHistory.length) return 1.0;
  
  // Calculer la distance minimum avec les zones déjà explorées
  const minDistance = Math.min(...explorationHistory.map(explored => {
    const dx = position.x - explored.x;
    const dz = position.z - explored.z;
    return Math.sqrt(dx * dx + dz * dz);
  }));
  
  // Plus c'est loin des zones explorées, meilleur c'est
  return Math.min(1.0, minDistance / EXPLORATION_CONFIG.MAX_DISTANCE);
}

/**
 * Calcule le score de distance optimal
 * @param {Object} position - Position à évaluer
 * @param {Object} basePosition - Position de base
 * @returns {number} Score de distance (0-1)
 */
function calculateDistanceScore(position, basePosition) {
  const dx = position.x - basePosition.x;
  const dz = position.z - basePosition.z;
  const distance = Math.sqrt(dx * dx + dz * dz);
  
  // Distance optimale = milieu de la plage
  const optimalDistance = (EXPLORATION_CONFIG.MIN_DISTANCE + EXPLORATION_CONFIG.MAX_DISTANCE) / 2;
  const distanceFromOptimal = Math.abs(distance - optimalDistance);
  const maxDeviation = EXPLORATION_CONFIG.MAX_DISTANCE - optimalDistance;
  
  return Math.max(0, 1 - (distanceFromOptimal / maxDeviation));
}

/**
 * Calcule le score de potentiel de ressources d'une zone
 * @param {Object} position - Position à évaluer
 * @param {Object} context - Contexte FSM complet
 * @returns {number} Score de ressources (0-1)
 */
function calculateResourceScore(position, context) {
  // Pour l'instant, score basique basé sur la distance du centre
  // Peut être étendu avec des données de terrain, historique de découvertes, etc.
  
  const centerDistance = Math.sqrt(position.x * position.x + position.z * position.z);
  
  // Zones moyennement éloignées du centre ont plus de potentiel
  const optimalCenterDistance = 15;
  const distanceFromOptimal = Math.abs(centerDistance - optimalCenterDistance);
  
  return Math.max(0.1, 1 - (distanceFromOptimal / 20));
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

/**
 * Sélectionne la meilleure cible d'exploration basée sur le contexte FSM
 * @param {Object} context - Contexte FSM complet du bot
 * @returns {Object|null} Position de la cible d'exploration ou null si aucune cible appropriée
 */
export function selectExplorationTarget(context) {
  try {
    // Vérifications de base - la position est dans context.vehicle.position
    if (!context?.vehicle?.position) {
      fsmLogger.error('[ExplorationTargetSelector] No valid bot position in context.vehicle.position');
      return null;
    }

    const basePosition = context.vehicle.position;
    const explorationHistory = context.memory?.explorationHistory || [];
    
    fsmLogger.info('[ExplorationTargetSelector] Selecting exploration target', {
      basePosition,
      historyCount: explorationHistory.length
    });

    // Générer des candidats dans tous les secteurs
    const candidates = [];
    const targetDistance = EXPLORATION_CONFIG.MIN_DISTANCE + 
      Math.random() * (EXPLORATION_CONFIG.MAX_DISTANCE - EXPLORATION_CONFIG.MIN_DISTANCE);

    for (let sector = 0; sector < EXPLORATION_CONFIG.SECTORS; sector++) {
      const position = generateSectorPosition(basePosition, sector, targetDistance);
      
      // Calculer les scores pour ce candidat
      const noveltyScore = calculateNoveltyScore(position, explorationHistory);
      const distanceScore = calculateDistanceScore(position, basePosition);
      const resourceScore = calculateResourceScore(position, context);
      
      // Score total pondéré
      const totalScore = 
        noveltyScore * EXPLORATION_CONFIG.PRIORITY_WEIGHTS.NOVELTY +
        distanceScore * EXPLORATION_CONFIG.PRIORITY_WEIGHTS.DISTANCE +
        resourceScore * EXPLORATION_CONFIG.PRIORITY_WEIGHTS.RESOURCES;
      
      candidates.push({
        position,
        score: totalScore,
        details: { noveltyScore, distanceScore, resourceScore }
      });
    }

    // Sélectionner le meilleur candidat
    candidates.sort((a, b) => b.score - a.score);
    const bestCandidate = candidates[0];

    if (bestCandidate && bestCandidate.score > 0.3) { // Seuil minimum de qualité
      fsmLogger.info('[ExplorationTargetSelector] Target selected', {
        position: bestCandidate.position,
        score: bestCandidate.score,
        details: bestCandidate.details
      });
      
      return bestCandidate.position;
    }

    fsmLogger.info('[ExplorationTargetSelector] No suitable exploration target found', {
      bestScore: bestCandidate?.score || 0,
      candidatesCount: candidates.length
    });
    
    return null;

  } catch (error) {
    fsmLogger.error('[ExplorationTargetSelector] Error selecting exploration target', { error });
    return null;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  selectExplorationTarget,
  EXPLORATION_CONFIG
};