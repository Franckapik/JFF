/**
 * ============================================================================
 * MULTI-BOT MANAGER FSM - Version FSM avec React-Robot
 * ============================================================================
 * 
 * Gestionnaire multi-bots utilisant la nouvelle architecture FSM.
 * Connecté aux vrais bots avec useBotMachine.
 * 
 * Features:
 * - Gestion de plusieurs bots en parallèle avec FSM RÉELS
 * - Interface de contrôle simple
 * - Debug panel intégré
 * - Mode autonome/manuel
 * - Création/suppression dynamique de bots
 * 
 * @version 2.0.0 - REAL BOTS
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useBotMachine } from '../../ai/fsm/hooks/useBotMachine';
import fsmLogger from '../../logger/fsmLogger.js';
import useFSMStore from '../../stores/useFSMStore/index.js';

/**
 * Composant de gestion individuelle d'un bot avec useBotMachine
 */
const BotInstance = ({ botId, isManagerRunning, showDebug, onBotStateChange }) => {
  const {
    entity,
    vehicle,
    state,
    actions,
    helpers,
    autoEvents
  } = useBotMachine(botId);

  // Mémoriser les valeurs qui changent souvent
  const isAutonomous = helpers.isAutonomous();
  const isMoving = helpers.isMoving();
  const fuel = vehicle?.fuel || 0;
  const resources = vehicle?.resources || { food: 0, debris: 0, special: 0 };

  // Mémoriser l'objet de données du bot pour éviter les re-renders inutiles
  const botData = useMemo(() => ({
    state,
    isAutonomous,
    isMoving,
    fuel,
    resources
  }), [state, isAutonomous, isMoving, fuel, resources?.food, resources?.debris, resources?.special]);

  // Notifier le manager des changements d'état (avec dépendances stables)
  useEffect(() => {
    onBotStateChange?.(botId, botData);
  }, [botData, onBotStateChange, botId]);

  // Démarrer/arrêter selon l'état du manager
  useEffect(() => {
    if (isManagerRunning && isAutonomous) {
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
  }, [isManagerRunning, isAutonomous, state, botId]); // Dépendances simplifiées

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

const MultiBotManagerFSM = () => {
  // ========================================================================
  // REMPLACEMENT: Utiliser le store Zustand au lieu de l'état local
  // ========================================================================
  
  // Récupérer l'état et les actions du store FSM
  const {
    activeBots: botIds,
    isSystemRunning: isRunning,
    addBot: addBotToStore,
    removeBot: removeBotFromStore,
    startSystem,
    stopSystem,
    toggleSystem,
    getBotCount,
    updateBotStatesSnapshot
  } = useFSMStore();

  // État local uniquement pour l'affichage du debug et les statistiques des bots
  const [showDebug, setShowDebug] = useState(false);
  const [botStates, setBotStates] = useState({});

  // ========================================================================
  // HANDLERS SIMPLIFIÉS - Déléguer au store
  // ========================================================================
  
  const handleToggleRunning = useCallback(() => {
    toggleSystem();
  }, [toggleSystem]);

  const handleAddBot = useCallback(() => {
    addBotToStore();
  }, [addBotToStore]);

  const handleRemoveBot = useCallback(() => {
    removeBotFromStore();
  }, [removeBotFromStore]);

  const handleStartAllExploration = useCallback(() => {
    // Cette fonction peut rester locale car elle agit sur les bots individuels
    fsmLogger.info('Démarrage de l\'exploration pour tous les bots', { botIds });
    // TODO: Implémenter le démarrage d'exploration pour tous les bots
  }, [botIds]);

  // Callback pour recevoir les mises à jour d'état des bots
  const handleBotStateChange = useCallback((botId, botData) => {
    setBotStates(prev => {
      const newStates = {
        ...prev,
        [botId]: botData
      };
      
      // Mettre à jour le store avec les états des bots
      updateBotStatesSnapshot(newStates);
      
      return newStates;
    });
  }, [updateBotStatesSnapshot]);

  // Calculer les statistiques globales
  const globalStats = {
    total: getBotCount(),
    exploring: Object.values(botStates).filter(bot => bot?.state === 'EXPLORING').length,
    collecting: Object.values(botStates).filter(bot => bot?.state === 'COLLECTING').length,
    returning: Object.values(botStates).filter(bot => bot?.state === 'RETURNING').length,
    idle: Object.values(botStates).filter(bot => bot?.state === 'IDLE').length
  };

  // Démarrage automatique
  useEffect(() => {
    fsmLogger.info("[MultiBotManagerFSM] FSM Bot Manager initialized with REAL bots using useBotMachine");
    startSystem();
  }, [startSystem]);

  // Style du conteneur principal
  const containerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '320px',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#fff',
    zIndex: 1000
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    padding: '5px 0',
    borderBottom: '1px solid #444'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '5px',
    marginBottom: '10px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '4px 8px',
    fontSize: '11px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#444',
    color: '#fff'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#0a7c0a'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#4CAF50' }}>
          🤖 FSM Bot Manager
        </h3>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          v2.0.0 REAL
        </div>
      </div>

      {/* Controls globaux */}
      <div style={controlsStyle}>
        <button 
          style={isRunning ? activeButtonStyle : buttonStyle}
          onClick={handleToggleRunning}
        >
          {isRunning ? '⏸️ Stop' : '▶️ Start'}
        </button>
        <button 
          style={buttonStyle}
          onClick={handleAddBot}
          disabled={getBotCount() >= 4}
        >
          ➕ Bot
        </button>
        <button 
          style={buttonStyle}
          onClick={handleRemoveBot}
          disabled={getBotCount() <= 1}
        >
          ➖ Bot
        </button>
        <button 
          style={showDebug ? activeButtonStyle : buttonStyle}
          onClick={() => setShowDebug(!showDebug)}
        >
          🔍 Debug
        </button>
        <button 
          style={buttonStyle}
          onClick={handleStartAllExploration}
          disabled={!isRunning}
        >
          🚀 Explore All
        </button>
      </div>

      {/* Status global avec vraies statistiques */}
      <div style={{ 
        marginBottom: '10px', 
        padding: '5px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '3px' 
      }}>
        <div><strong>Status:</strong> {isRunning ? '🟢 RUNNING' : '🔴 STOPPED'}</div>
        <div><strong>Bots actifs:</strong> {getBotCount()}</div>
        <div style={{ fontSize: '10px', marginTop: '3px' }}>
          <span style={{ color: '#4CAF50' }}>🔍 Exploring: {globalStats.exploring}</span> | 
          <span style={{ color: '#FF9800' }}> 📦 Collecting: {globalStats.collecting}</span> | 
          <span style={{ color: '#2196F3' }}> 🏠 Returning: {globalStats.returning}</span> | 
          <span style={{ color: '#666' }}> ⏸️ Idle: {globalStats.idle}</span>
        </div>
        </div>

      {/* Liste des BotInstances RÉELS utilisant useBotMachine */}
      {botIds.map(botId => (
        <BotInstance
          key={botId}
          botId={botId}
          isManagerRunning={isRunning}
          showDebug={showDebug}
          onBotStateChange={handleBotStateChange}
        />
      ))}

      {/* Debug global */}
      {showDebug && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '3px',
          fontSize: '10px'
        }}>
          <strong>Debug Info:</strong>
          <div>Bot IDs: {botIds.join(', ')}</div>
          <div>Manager status: {isRunning ? 'Active' : 'Inactive'}</div>
          <div>Bot states loaded: {Object.keys(botStates).length}</div>
          <div>Render time: {new Date().toLocaleTimeString()}</div>
          
          {/* États détaillés des bots */}
          <details style={{ marginTop: '5px' }}>
            <summary style={{ cursor: 'pointer' }}>Bot Details</summary>
            {Object.entries(botStates).map(([botId, data]) => (
              <div key={botId} style={{ marginLeft: '10px', fontSize: '9px' }}>
                <strong>{botId}:</strong> {data?.state} | 
                Fuel: {data?.fuel}% | 
                Auto: {data?.isAutonomous ? 'Y' : 'N'} | 
                Moving: {data?.isMoving ? 'Y' : 'N'}
              </div>
            ))}
          </details>
        </div>
      )}
    </div>
  );
};

export default MultiBotManagerFSM;
