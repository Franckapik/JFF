import React, { useEffect, useMemo } from 'react';
import { useBotMachineFixed } from '../../ai/fsm/hooks/useBotMachineFixed';
import fsmLogger from '../../logger/fsmLogger.js';

const BotInstance = ({ botId, isManagerRunning, showDebug, onBotStateChange }) => {
  const {
    entity,
    vehicle,
    state,
    actions,
    autoEvents,
    isMoving
  } = useBotMachineFixed(botId);

  // Mémoriser les valeurs qui changent souvent
  const fuel = vehicle?.fuel || 0;
  const resources = vehicle?.resources || { food: 0, debris: 0, special: 0 };

  // Mémoriser l'objet de données du bot pour éviter les re-renders inutiles
  const botData = useMemo(() => ({
    state,
    isMoving,
    fuel,
    resources
  }), [state, isMoving, fuel, resources?.food, resources?.debris, resources?.special]);

  // Notifier le manager des changements d'état (avec dépendances stables)
  useEffect(() => {
    onBotStateChange?.(botId, botData);
  }, [botData, onBotStateChange, botId]);

  // Démarrer/arrêter selon l'état du manager
  useEffect(() => {
    if (isManagerRunning) {
      autoEvents.start();
      // Démarrer l'exploration après 2 secondes
      const timer = setTimeout(() => {
        if (state === 'IDLE') {
          fsmLogger.info(`[BotInstance] ${botId}: Starting exploration`);
          actions.startExploration();
        }
      }, 2000 + Math.random() * 1000); // Décalage aléatoire
      return () => clearTimeout(timer);
    } else {
      autoEvents.stop();
    }
  }, [isManagerRunning, state, botId]);

  const instanceStyle = {
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: '#333',
    borderRadius: '4px',
    border: `2px solid ${state === 'IDLE' ? '#666' : 
                         state === 'EXPLORING' ? '#4CAF50' :
                         state === 'COLLECTING' ? '#FF9800' :
                         state === 'RETURNING' ? '#2196F3' : '#666'}`
  };

  const buttonStyle = {
    padding: '2px 6px',
    fontSize: '9px',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    backgroundColor: '#444',
    color: '#fff'
  };

  return (
    <div style={instanceStyle}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '5px'
      }}>
        <strong style={{ color: '#4CAF50' }}>
          🤖 {botId}
        </strong>
        <span style={{ 
          fontSize: '10px', 
          padding: '2px 6px', 
          backgroundColor: state === 'IDLE' ? '#666' : 
                           state === 'EXPLORING' ? '#4CAF50' :
                           state === 'COLLECTING' ? '#FF9800' :
                           state === 'RETURNING' ? '#2196F3' : '#666',
          borderRadius: '3px',
          color: '#fff'
        }}>
          {state}
        </span>
      </div>

      <div style={{ fontSize: '10px', opacity: 0.8 }}>
        <div>⚡ Fuel: {vehicle?.fuel || 100}%</div>
        <div>📦 Resources: {Object.values(vehicle?.resources || {}).reduce((a, b) => a + b, 0)}</div>
        <div>🎯 Target: {entity?.currentTarget || 'None'}</div>
      </div>

      {showDebug && (
        <div style={{ 
          marginTop: '5px', 
          padding: '4px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '2px',
          fontSize: '9px'
        }}>
          <div>Last Action: {entity?.lastAction || 'None'}</div>
          <div>Moving: {isMoving ? 'YES' : 'NO'}</div>
          <div>Auto Events: {autoEvents.isActive ? 'ACTIVE' : 'INACTIVE'}</div>
          <div>Context ID: {entity?.id}</div>
        </div>
      )}

      {/* Contrôle d'exploration */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginTop: '5px' 
      }}>
        <button 
          style={{ 
            ...buttonStyle, 
            backgroundColor: state === 'EXPLORING' ? '#4CAF50' : '#444'
          }}
          onClick={() => {
            fsmLogger.info(`[BotInstance] Manual exploration trigger for ${botId}`);
            actions.startExploration();
          }}
          disabled={!isManagerRunning}
        >
          🔍 Explore
        </button>
      </div>
    </div>
  );
};

export default BotInstance;
