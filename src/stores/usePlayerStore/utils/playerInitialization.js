/**
 * =========================================================================
 * PLAYER INITIALIZATION UTILITIES
 * =========================================================================
 * 
 * Fonctions utilitaires pour la génération et l'initialisation des joueurs
 * (humains et bots) dans le jeu.
 */

import useGameStore from '../../useGameStore/';
import { createPlayer } from './playerFactory';
import fsmLogger from '../../../logger/fsmLogger';

/**
 * Génère la liste initiale des joueurs (humains et bots)
 * @returns {Object} Dictionnaire des joueurs indexés par leur ID
 */
export const generateInitialPlayers = () => {
  const { botCount } = useGameStore.getState();
  const players = {};

  fsmLogger.player(`Starting bot-only player generation: ${botCount} bots`, {
    botCount
  });

  // Créer uniquement des bots (système bot-only)
  for (let i = 0; i < botCount; i++) {
    const botId = `bot-${i}`;
    players[botId] = createPlayer(botId);
    fsmLogger.player(`Created bot player: ${botId}`);
  }

  fsmLogger.player(`Bot-only player generation completed. Total bots: ${Object.keys(players).length}`, {
    playerIds: Object.keys(players)
  });

  return players;
};
