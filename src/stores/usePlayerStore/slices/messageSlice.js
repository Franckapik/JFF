/**
 * ============================================================================
 * MESSAGE SLICE - Gestion du système de messagerie des joueurs
 * ============================================================================
 * 
 * Ce slice gère le système de messages/notifications pour chaque joueur :
 * - Ajout de nouveaux messages au journal du joueur
 * - Gestion de l'état de lecture des messages
 * - Système de notifications en temps réel
 * - Historique complet des communications
 * 
 * Chaque joueur possède sa propre file de messages indépendante avec
 * suivi de l'état de lecture pour l'interface utilisateur.
 * 
 * @author Votre nom
 * @version 1.0.0
 */

import fsmLogger from '../../../logger/fsmLogger';
import { markAllMessagesAsRead } from '../utils';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createMessageSlice = (set) => {
  return {
    
    // ========================================================================
    // GESTION DES MESSAGES - AJOUT ET CREATION
    // ========================================================================
    
    /**
     * Ajoute un nouveau message au journal du joueur
     * 
     * Enregistre un message dans la file de messages du joueur spécifié.
     * Les messages sont ajoutés en fin de liste pour maintenir l'ordre
     * chronologique. Chaque message devrait contenir au minimum un contenu
     * et un timestamp pour le suivi.
     * 
     * @param {string} playerId - ID unique du joueur destinataire
     * @param {Object} message - Objet message à ajouter au journal
     * @param {string} message.content - Contenu textuel du message
     * @param {number} message.timestamp - Horodatage de création (timestamp Unix)
     * @param {string} [message.type] - Type de message ('info', 'warning', 'error', etc.)
     * @param {boolean} [message.isRead] - État de lecture (défaut: false)
     * 
     * @example 
     * addPlayerMessage('player-1', {
     *   content: 'Ressource découverte!',
     *   timestamp: Date.now(),
     *   type: 'success',
     *   isRead: false
     * })
     */
    addPlayerMessage: (playerId, message) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          fsmLogger.player(`Player with ID '${playerId}' does not exist.`, null, playerId);
          return state; // Retourne l'état actuel sans modifications
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: [...player.messages, message], // Ajout en fin de liste
            },
          },
        };
      });
    },

    // ========================================================================
    // GESTION DE L'ETAT DE LECTURE
    // ========================================================================

    /**
     * Marque tous les messages d'un joueur comme lus
     * 
     * Met à jour l'état de lecture de tous les messages du joueur
     * en passant la propriété 'isRead' à true. Utilisé typiquement
     * quand le joueur ouvre son interface de messages ou consulte
     * son journal d'activité.
     * 
     * Cette action est irréversible et affecte tous les messages
     * existants dans la file du joueur.
     * 
     * @param {string} playerId - ID unique du joueur
     * 
     * @example markMessagesAsRead('player-1') // Tous les messages deviennent lus
     */
    markMessagesAsRead: (playerId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          fsmLogger.player(`Player with ID '${playerId}' does not exist.`, null, playerId);
          return state; // Retourne l'état actuel sans modifications
        }

        // Transformation de tous les messages pour les marquer comme lus
        const updatedMessages = markAllMessagesAsRead(player.messages);

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              messages: updatedMessages,
            },
          },
        };
      });
    },
  };
};

// ============================================================================
// EXPORT
// ============================================================================

export default createMessageSlice;