/**
 * Slice pour la configuration du nombre de joueurs
 * Gère le nombre de joueurs humains et de bots
 */
import fsmLogger from '../../../logger/fsmLogger';

const createPlayerCountSlice = (set) => ({
  // Configuration des joueurs
  playerCount: 1, // Nombre de joueurs humains
  botCount: 1,    // Nombre de bots
  
  // Action pour mettre à jour le nombre de joueurs
  setPlayerCount: (count) => {
    // Assurer que le nombre de joueurs est valide (minimum 1)
    const validCount = Math.max(1, count);
    
    fsmLogger.game(`Player count updated`, { 
      requested: count, 
      actual: validCount,
      type: 'human_players'
    });
    
    set({ 
      playerCount: validCount,
      // Mise à jour du nombre de bots si nécessaire
      // Vous pouvez ajouter une logique additionnelle ici si vous souhaitez maintenir
      // une relation entre playerCount et botCount
    });
  },
  
  // Action pour mettre à jour le nombre de bots
  setBotCount: (count) => {
    // Assurer que le nombre de bots est valide (minimum 0)
    const validCount = Math.max(0, count);
    
    fsmLogger.game(`Bot count updated`, { 
      requested: count, 
      actual: validCount,
      type: 'bot_players'
    });
    
    set({ botCount: validCount });
  },
});

export default createPlayerCountSlice;