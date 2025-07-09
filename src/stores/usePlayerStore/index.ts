/**
 * Store pour la gestion des joueurs et leurs messages
 */
import { create } from 'zustand';

import type { PlayerStoreType } from '../../types/stores.d';

/**
 * Store Zustand pour la gestion des joueurs
 */
const usePlayerStore = create<PlayerStoreType>((set, get) => ({
  players: {},
  
  // Ajouter un nouveau joueur
  addPlayer: (playerId: string) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          id: playerId,
          messages: [],
        },
      },
    }));
  },
  
  // Ajouter un message à un joueur
  addMessage: (playerId: string, message) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          messages: [
            ...(state.players[playerId]?.messages || []),
            { ...message, isRead: false },
          ],
        },
      },
    }));
  },
  
  // Marquer tous les messages comme lus
  markMessagesAsRead: (playerId: string) => {
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          messages: state.players[playerId]?.messages.map(msg => ({
            ...msg,
            isRead: true,
          })) || [],
        },
      },
    }));
  },
  
  // Marquer un message spécifique comme lu
  markMessageAsRead: (messageIndex: number) => {
    // Pour le moment, on assume que c'est pour 'player-1'
    const playerId = 'player-1';
    set((state) => ({
      players: {
        ...state.players,
        [playerId]: {
          ...state.players[playerId],
          messages: state.players[playerId]?.messages.map((msg, index) => 
            index === messageIndex ? { ...msg, isRead: true } : msg
          ) || [],
        },
      },
    }));
  },
  
  // Obtenir un joueur par ID
  getPlayer: (playerId: string) => {
    return get().players[playerId];
  },
  
  // Obtenir les messages d'un joueur
  getPlayerMessages: (playerId: string) => {
    return get().players[playerId]?.messages || [];
  },
}));

export default usePlayerStore;
