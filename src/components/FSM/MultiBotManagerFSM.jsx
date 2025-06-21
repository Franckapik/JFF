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
import fsmLogger from '../../logger/fsmLogger.js';
import useFSMStore from '../../stores/useFSMStore/index.js';
import BotInstance from './BotInstance';

/**
 * Composant principal du gestionnaire multi-bots
 */
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

  // Callback pour mettre à jour l'état d'un bot spécifique
  const updateBotState = useCallback((botId, botData) => {
    setBotStates(prev => ({
      ...prev,
      [botId]: botData
    }));
  }, []);

  // Effet pour synchroniser les états des bots avec le store FSM
  useEffect(() => {
    updateBotStatesSnapshot(botStates);
  }, [botStates, updateBotStatesSnapshot]);

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
    setBotStates(prev => ({
      ...prev,
      [botId]: botData
    }));
  }, []);

  // Calculer les statistiques globales
  const globalStats = {
    total: getBotCount(),
    exploring: Object.values(botStates).filter(bot => 
      bot?.state === 'exploring_deploying' || 
      bot?.state === 'exploring_returning'
    ).length,
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
