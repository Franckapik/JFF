/**
 * ============================================================================
 * FSM HUD FIXED - Version corrigée du HUD unifié pour éviter les boucles infinies
 * ============================================================================
 * 
 * Cette version utilise uniquement le hook useFSM() minimal et évite tous
 * les sélecteurs Zustand qui causent des boucles infinies.
 * 
 * @version 1.0.0
 */

import React, { useState, useCallback } from 'react';
import { useFSM } from '../../hooks/useFSM';
import fsmLogger from '../../logger/fsmLogger.js';

/**
 * Version simplifiée et sûre du FSMHUD
 */
const FSMHUDFixed = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Utiliser uniquement le hook useFSM minimal qui est stable
  const { 
    botCount, 
    addBot: addBotToStore, 
    removeBot: removeBotFromStore 
  } = useFSM();

  fsmLogger.info('[FSMHUDFixed] HUD FSM fixé initialisé');

  // Gestion des bots - versions simplifiées et sûres
  const handleAddBot = useCallback(() => {
    try {
      const newBotId = `bot-${Date.now()}`;
      fsmLogger.info(`[FSMHUDFixed] Ajout du bot: ${newBotId}`);
      addBotToStore(newBotId);
    } catch (error) {
      fsmLogger.error('[FSMHUDFixed] Erreur lors de l\'ajout du bot:', error);
    }
  }, [addBotToStore]);

  const handleRemoveBot = useCallback(() => {
    try {
      // Pour simplifier, on supprime toujours le dernier bot créé
      if (botCount > 1) {
        fsmLogger.info('[FSMHUDFixed] Suppression d\'un bot');
        removeBotFromStore(); // Le store gère lequel supprimer
      }
    } catch (error) {
      fsmLogger.error('[FSMHUDFixed] Erreur lors de la suppression du bot:', error);
    }
  }, [botCount, removeBotFromStore]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Styles simples et sûrs
  const containerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    zIndex: 1000,
    minWidth: '200px',
    maxWidth: '400px'
  };

  const headerStyle = {
    borderBottom: '1px solid #444',
    paddingBottom: '8px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    backgroundColor: '#333',
    color: 'white',
    border: '1px solid #555',
    padding: '4px 8px',
    margin: '2px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#666',
    cursor: 'not-allowed',
    opacity: 0.6
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <strong>🤖 FSM HUD (Fixed)</strong>
        <button style={buttonStyle} onClick={toggleExpanded}>
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div>
          {/* Informations de base */}
          <div style={{ marginBottom: '10px' }}>
            <div>Bots actifs: <strong>{botCount}</strong></div>
          </div>

          {/* Contrôles des bots */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '5px' }}>Gestion des bots:</div>
            <button 
              style={buttonStyle}
              onClick={handleAddBot}
            >
              + Ajouter Bot
            </button>
            <button 
              style={botCount <= 1 ? disabledButtonStyle : buttonStyle}
              onClick={handleRemoveBot}
              disabled={botCount <= 1}
            >
              − Supprimer Bot
            </button>
          </div>

          {/* Informations sur la version */}
          <div style={{ 
            fontSize: '10px', 
            color: '#888',
            borderTop: '1px solid #444',
            paddingTop: '8px',
            marginTop: '10px'
          }}>
            Version corrigée - Store XState + Zustand
          </div>
        </div>
      )}
    </div>
  );
};

export default FSMHUDFixed;
