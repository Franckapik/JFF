/**
 * ============================================================================
 * MESSAGE UTILITIES
 * ============================================================================
 * 
 * Utilitaires pour la gestion des messages des joueurs :
 * - Création de messages standardisés
 * - Manipulation des états de lecture
 * - Filtres et transformations
 * 
 * @author Votre nom
 * @version 1.0.0
 */

// ============================================================================
// CREATION ET MANIPULATION DE MESSAGES
// ============================================================================

/**
 * Crée un message standardisé avec horodatage et ID unique
 * @param {string} content - Contenu du message
 * @param {string} type - Type de message ('info', 'warning', 'error', 'success')
 * @returns {Object} Message standardisé
 */
export const createStandardMessage = (content, type = 'info') => {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    content,
    timestamp: Date.now(),
    type,
    isRead: false
  };
};

/**
 * Marque tous les messages comme lus
 * @param {Array} messages - Liste des messages
 * @returns {Array} Messages avec statut de lecture mis à jour
 */
export const markAllMessagesAsRead = (messages) => {
  return messages.map(message => ({
    ...message,
    isRead: true
  }));
};

/**
 * Filtre les messages par type
 * @param {Array} messages - Liste des messages
 * @param {string} type - Type à filtrer
 * @returns {Array} Messages filtrés par type
 */
export const filterMessagesByType = (messages, type) => {
  return messages.filter(message => message.type === type);
};

/**
 * Filtre les messages non lus
 * @param {Array} messages - Liste des messages
 * @returns {Array} Messages non lus uniquement
 */
export const getUnreadMessages = (messages) => {
  return messages.filter(message => !message.isRead);
};

/**
 * Compte les messages par type
 * @param {Array} messages - Liste des messages
 * @returns {Object} Compteurs par type de message
 */
export const countMessagesByType = (messages) => {
  return messages.reduce((counts, message) => {
    counts[message.type] = (counts[message.type] || 0) + 1;
    return counts;
  }, {});
};

/**
 * Récupère les messages récents (dernières 24h)
 * @param {Array} messages - Liste des messages
 * @param {number} hoursBack - Nombre d'heures à remonter (défaut: 24)
 * @returns {Array} Messages récents
 */
export const getRecentMessages = (messages, hoursBack = 24) => {
  const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
  return messages.filter(message => message.timestamp >= cutoffTime);
};
