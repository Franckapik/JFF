import React, { useState, useCallback, useMemo } from 'react';
import { useFSM } from '../../hooks/useFSM';
import fsmLogger from '../../logger/fsmLogger.js';

/**
 * Version corrigée du CentralFSMHud qui évite les problèmes de boucles infinies
 * en utilisant uniquement le hook useFSM stable au lieu de sélecteurs Zustand directs.
 */
const CentralFSMHudFixed = () => {
  fsmLogger.info('[CentralFSMHudFixed] Rendering component');
  
  const [selectedBot, setSelectedBot] = useState('bot-0');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Hook FSM stable pour le bot sélectionné
  const {
    fsmState,
    send,
    botIds = ['bot-0'], // Fallback par défaut
    addBot,
    removeBot
  } = useFSM(selectedBot);
  
  // Valeurs sécurisées dérivées de manière stable
  const safeData = useMemo(() => {
    const safeFsmState = fsmState || { value: 'N/A', context: {} };
    const safeAllBots = Array.isArray(botIds) ? botIds : ['bot-0'];
    const safeSend = typeof send === 'function' ? send : () => {};
    const safeAddBot = typeof addBot === 'function' ? addBot : () => {};
    const safeRemoveBot = typeof removeBot === 'function' ? removeBot : () => {};
    
    return {
      fsmState: safeFsmState,
      allBots: safeAllBots,
      send: safeSend,
      addBot: safeAddBot,
      removeBot: safeRemoveBot
    };
  }, [fsmState, botIds, send, addBot, removeBot]);
  
  // Fonction pour ajouter un nouveau bot
  const handleAddBot = useCallback(() => {
    const newBotId = `bot-${Date.now().toString().slice(-4)}`;
    fsmLogger.info('[CentralFSMHudFixed] Adding new bot', { newBotId });
    safeData.addBot(newBotId);
    setSelectedBot(newBotId);
  }, [safeData.addBot]);
  
  // Fonction pour supprimer le bot sélectionné
  const handleRemoveBot = useCallback(() => {
    if (safeData.allBots.length > 1) {
      fsmLogger.info('[CentralFSMHudFixed] Removing bot', { selectedBot });
      safeData.removeBot(selectedBot);
      // Sélectionner le premier bot restant
      const remainingBots = safeData.allBots.filter(id => id !== selectedBot);
      if (remainingBots.length > 0) {
        setSelectedBot(remainingBots[0]);
      }
    }
  }, [safeData.removeBot, safeData.allBots, selectedBot]);
  
  // Fonction pour envoyer un événement
  const handleSendEvent = useCallback((eventType, payload = {}) => {
    fsmLogger.info('[CentralFSMHudFixed] Sending event', { eventType, payload, selectedBot });
    safeData.send({ type: eventType, ...payload });
  }, [safeData.send, selectedBot]);
  
  // Fonction pour changer de bot sélectionné
  const handleBotSelection = useCallback((botId) => {
    fsmLogger.info('[CentralFSMHudFixed] Bot selection changed', { oldBot: selectedBot, newBot: botId });
    setSelectedBot(botId);
  }, [selectedBot]);
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Styles simplifiés
  const styles = {
    container: {
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      padding: '12px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '11px',
      minWidth: '280px',
      maxWidth: '350px',
      zIndex: 1000,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '6px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    },
    title: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#4CAF50',
      margin: 0,
    },
    expandButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '12px',
    },
    section: {
      marginBottom: '8px',
      padding: '6px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '3px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    sectionTitle: {
      fontSize: '10px',
      fontWeight: 'bold',
      marginBottom: '4px',
      color: '#2196F3',
      textTransform: 'uppercase',
    },
    select: {
      width: '100%',
      padding: '3px',
      backgroundColor: '#333',
      border: '1px solid #555',
      borderRadius: '3px',
      color: 'white',
      fontSize: '10px',
    },
    button: {
      padding: '3px 6px',
      margin: '2px',
      backgroundColor: '#333',
      border: '1px solid #555',
      borderRadius: '3px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '9px',
    },
    stateDisplay: {
      backgroundColor: '#1a1a1a',
      padding: '6px',
      borderRadius: '3px',
      marginTop: '4px',
      fontSize: '9px',
    },
    currentState: {
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    contextInfo: {
      color: '#888',
      marginTop: '2px',
      maxHeight: '60px',
      overflow: 'auto',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🎛️ Central FSM (Fixed)</h3>
        <button style={styles.expandButton} onClick={toggleExpanded}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {/* Sélection du bot */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Bot Selection</div>
        <select 
          style={styles.select}
          value={selectedBot}
          onChange={(e) => handleBotSelection(e.target.value)}
        >
          {safeData.allBots.map(botId => (
            <option key={botId} value={botId}>
              {botId}
            </option>
          ))}
        </select>
        
        <div style={{ marginTop: '4px' }}>
          <button style={styles.button} onClick={handleAddBot}>
            ➕ Add Bot
          </button>
          <button 
            style={styles.button} 
            onClick={handleRemoveBot}
            disabled={safeData.allBots.length <= 1}
          >
            ➖ Remove
          </button>
        </div>
      </div>

      {/* État actuel */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Current State</div>
        <div style={styles.stateDisplay}>
          <div style={styles.currentState}>
            State: {safeData.fsmState.value}
          </div>
          {isExpanded && (
            <div style={styles.contextInfo}>
              Context: {JSON.stringify(safeData.fsmState.context, null, 1)}
            </div>
          )}
        </div>
      </div>

      {/* Contrôles d'événements */}
      {isExpanded && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Event Controls</div>
          <button 
            style={styles.button} 
            onClick={() => handleSendEvent('START_EXPLORATION')}
          >
            🚁 Start Exploration
          </button>
          <button 
            style={styles.button} 
            onClick={() => handleSendEvent('START_COLLECTION')}
          >
            💎 Start Collection
          </button>
          <button 
            style={styles.button} 
            onClick={() => handleSendEvent('RETURN_TO_BASE')}
          >
            🏠 Return to Base
          </button>
          <button 
            style={styles.button} 
            onClick={() => handleSendEvent('EMERGENCY_STOP')}
          >
            🚨 Emergency Stop
          </button>
        </div>
      )}

      {/* Info système */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>System Info</div>
        <div style={{ fontSize: '9px', color: '#888' }}>
          <div>Active Bots: {safeData.allBots.length}</div>
          <div>Selected: {selectedBot}</div>
          <div>Stable Hook: ✅ useFSM</div>
        </div>
      </div>
    </div>
  );
};

export default CentralFSMHudFixed;
