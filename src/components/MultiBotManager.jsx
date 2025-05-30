import React from 'react';
import fsmLogger from '../utils/fsmLogger';

/**
 * Composant legacy pour gérer plusieurs bots
 * Maintenant remplacé par MultiBotManagerFSM mais conservé pour compatibilité
 */
const MultiBotManager = () => {
  fsmLogger.info("[MultiBotManager] Legacy component loaded - FSM system handles bot management now");
  
  // Ce composant legacy ne fait plus rien, la gestion des bots se fait via FSM
  return null;
};

export default MultiBotManager;
