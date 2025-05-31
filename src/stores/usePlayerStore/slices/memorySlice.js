/**
 * ============================================================================
 * MEMORY SLICE - Gestion de la mémoire des joueurs
 * ============================================================================
 * 
 * Ce slice gère toute la mémoire persistante des joueurs incluant :
 * - Les ressources découvertes et connues
 * - Les dangers identifiés et mémorisés  
 * - Les statistiques d'exploration
 * - Les mises à jour génériques de mémoire
 * 
 * Chaque joueur possède sa propre mémoire indépendante accessible via son ID.
 * 
 * @author Votre nom
 * @version 1.0.0
 */

import fsmLogger from '../../../logger/fsmLogger';
import { 
  isResourceAlreadyKnown, 
  isDangerAlreadyKnown,
  createMemoryResource,
  createMemoryDanger
} from '../utils';

// ============================================================================
// CREATION DU SLICE
// ============================================================================

const createMemorySlice = (set) => {
  return {
    
    // ========================================================================
    // OPERATIONS GENERIQUES SUR LA MEMOIRE
    // ========================================================================
    
    /**
     * Met à jour la mémoire d'un joueur avec des propriétés arbitraires
     * 
     * Fonction générique permettant de modifier n'importe quelle propriété
     * de la mémoire d'un joueur. Utilise un merge shallow pour préserver
     * les données existantes non modifiées.
     * 
     * @param {string} playerId - ID unique du bot (ex: 'bot-0', 'bot-1')
     * @param {Object} updates - Objet contenant les propriétés à mettre à jour
     * @example updatePlayerMemory('bot-0', { lastVisitedArea: 'forest' })
     */
    updatePlayerMemory: (playerId, updates) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) {
          fsmLogger.player(`Player with ID '${playerId}' does not exist.`, null, playerId);
          return state;
        }

        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                ...updates, // Applique les mises à jour à la mémoire existante
              },
            },
          },
        };
      });
    },

    // ========================================================================
    // GESTION DES RESSOURCES CONNUES
    // ========================================================================
    
    /**
     * Ajoute une nouvelle ressource à la liste des ressources connues
     * 
     * Enregistre une ressource découverte dans la mémoire du joueur.
     * Vérifie automatiquement les doublons basés sur les coordonnées
     * pour éviter les entrées multiples de la même ressource.
     * 
     * @param {string} playerId - ID unique du joueur
     * @param {Object} resource - Objet ressource avec au minimum une propriété 'coord'
     * @param {string} resource.coord - Coordonnées de la ressource (format: "x,y")
     * @example addKnownResource('bot-0', { coord: '10,5', type: 'wood', amount: 50 })
     */
    addKnownResource: (playerId, resource) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        // Vérification anti-doublon basée sur les coordonnées
        const resourceExists = isResourceAlreadyKnown(player.memory.knownResources, resource.coord);
        
        if (resourceExists) return state;
        
        // Créer un objet ressource standardisé
        const standardizedResource = createMemoryResource(resource);
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                knownResources: [...player.memory.knownResources, standardizedResource],
              },
            },
          },
        };
      });
    },

    // ========================================================================
    // GESTION DES DANGERS CONNUS
    // ========================================================================
    
    /**
     * Ajoute un nouveau danger à la liste des dangers connus
     * 
     * Enregistre un danger identifié dans la mémoire du joueur.
     * Applique la même logique anti-doublon que pour les ressources
     * en utilisant les coordonnées comme clé unique.
     * 
     * @param {string} playerId - ID unique du joueur
     * @param {Object} danger - Objet danger avec au minimum une propriété 'coord'
     * @param {string} danger.coord - Coordonnées du danger (format: "x,y")
     * @example addKnownDanger('bot-0', { coord: '15,8', type: 'trap', severity: 'high' })
     */
    addKnownDanger: (playerId, danger) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        // Vérification anti-doublon basée sur les coordonnées
        const dangerExists = isDangerAlreadyKnown(player.memory.knownDangers, danger.coord);
        
        if (dangerExists) return state;
        
        // Créer un objet danger standardisé
        const standardizedDanger = createMemoryDanger(danger);
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                knownDangers: [...player.memory.knownDangers, standardizedDanger],
              },
            },
          },
        };
      });
    },

    // ========================================================================
    // STATISTIQUES D'EXPLORATION
    // ========================================================================
    
    /**
     * Incrémente le compteur global d'exploration du joueur
     * 
     * Met à jour le nombre total d'actions d'exploration effectuées.
     * Utilisé pour le suivi des performances et la progression du joueur.
     * 
     * @param {string} playerId - ID unique du joueur
     * @example incrementExplorationCount('bot-0') // explorationCount: 42 -> 43
     */
    incrementExplorationCount: (playerId) => {
      set((state) => {
        const player = state.players[playerId];
        if (!player) return state;
        
        return {
          players: {
            ...state.players,
            [playerId]: {
              ...player,
              memory: {
                ...player.memory,
                explorationCount: player.memory.explorationCount + 1,
              },
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

export default createMemorySlice;