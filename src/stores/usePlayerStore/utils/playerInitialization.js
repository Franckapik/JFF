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
import { 
  getHumanPlayerId, 
  getBotId
} from '../../../ai/constants/playerConstants';
import fsmLogger from '../../../utils/fsmLogger';

/**
 * Génère la liste initiale des joueurs (humains et bots)
 * @returns {Object} Dictionnaire des joueurs indexés par leur ID
 */
export const generateInitialPlayers = () => {
  const { playerCount, botCount } = useGameStore.getState();
  const players = {};

  fsmLogger.player(`Starting player generation: ${playerCount} human players, ${botCount} bots`, {
    playerCount,
    botCount
  });

  // Créer le joueur humain principal
  players[getHumanPlayerId(1)] = createPlayer(getHumanPlayerId(1));
  fsmLogger.player(`Created human player: ${getHumanPlayerId(1)}`);

  // Créer les bots
  for (let i = 0; i < botCount; i++) {
    const botId = getBotId(i);
    players[botId] = createPlayer(botId);
    fsmLogger.player(`Created bot player: ${botId}`);
  }

  fsmLogger.player(`Player generation completed. Total players: ${Object.keys(players).length}`, {
    playerIds: Object.keys(players)
  });

  return players;
};
