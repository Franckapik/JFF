/**
 * ============================================================================
 * MEMORY UTILITIES
 * ============================================================================
 * 
 * Utilitaires pour la gestion de la mémoire des joueurs :
 * - Vérifications de doublons
 * - Création d'objets mémoire standardisés
 * - Manipulation des données de mémoire
 * 
 * @author Votre nom
 * @version 1.0.0
 */

// ============================================================================
// VERIFICATION DE DOUBLONS
// ============================================================================

/**
 * Vérifie si une ressource existe déjà dans la mémoire
 * @param {Array} knownResources - Liste des ressources connues
 * @param {string} resourceCoord - Coordonnées de la ressource
 * @returns {boolean} True si la ressource est déjà connue
 */
export const isResourceAlreadyKnown = (knownResources, resourceCoord) => {
  return knownResources.some(r => r.coord === resourceCoord);
};

/**
 * Vérifie si un danger existe déjà dans la mémoire
 * @param {Array} knownDangers - Liste des dangers connus
 * @param {string} dangerCoord - Coordonnées du danger
 * @returns {boolean} True si le danger est déjà connu
 */
export const isDangerAlreadyKnown = (knownDangers, dangerCoord) => {
  return knownDangers.some(d => d.coord === dangerCoord);
};

// ============================================================================
// CREATION D'OBJETS MEMOIRE
// ============================================================================

/**
 * Crée un objet ressource standardisé pour la mémoire
 * @param {Object} resource - Données de base de la ressource
 * @returns {Object} Ressource standardisée avec métadonnées
 */
export const createMemoryResource = (resource) => {
  return {
    coord: resource.coord,
    discoveredAt: Date.now(),
    type: resource.type || 'unknown',
    ...resource
  };
};

/**
 * Crée un objet danger standardisé pour la mémoire
 * @param {Object} danger - Données de base du danger
 * @returns {Object} Danger standardisé avec métadonnées
 */
export const createMemoryDanger = (danger) => {
  return {
    coord: danger.coord,
    discoveredAt: Date.now(),
    severity: danger.severity || 'medium',
    ...danger
  };
};

// ============================================================================
// MANIPULATION DE DONNEES MEMOIRE
// ============================================================================

/**
 * Filtre les ressources par type
 * @param {Array} knownResources - Liste des ressources connues
 * @param {string} type - Type de ressource à filtrer
 * @returns {Array} Ressources du type spécifié
 */
export const filterResourcesByType = (knownResources, type) => {
  return knownResources.filter(resource => resource.type === type);
};

/**
 * Filtre les dangers par niveau de sévérité
 * @param {Array} knownDangers - Liste des dangers connus
 * @param {string} severity - Niveau de sévérité ('low', 'medium', 'high')
 * @returns {Array} Dangers du niveau spécifié
 */
export const filterDangersBySeverity = (knownDangers, severity) => {
  return knownDangers.filter(danger => danger.severity === severity);
};

/**
 * Récupère les découvertes récentes (dernières heures)
 * @param {Array} items - Liste d'éléments avec propriété discoveredAt
 * @param {number} hoursBack - Nombre d'heures à remonter
 * @returns {Array} Éléments découverts récemment
 */
export const getRecentDiscoveries = (items, hoursBack = 1) => {
  const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
  return items.filter(item => item.discoveredAt >= cutoffTime);
};

/**
 * Compte le nombre total d'éléments dans la mémoire
 * @param {Object} memory - Objet mémoire du joueur
 * @returns {Object} Compteurs de tous les types d'éléments
 */
export const getMemoryCounts = (memory) => {
  return {
    resources: memory.knownResources?.length || 0,
    dangers: memory.knownDangers?.length || 0,
    explorations: memory.explorationCount || 0
  };
};
