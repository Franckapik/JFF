/**
 * ============================================================================
 * MULTI-BOT MANAGER FSM - Version FSM avec React-Robot
 * ============================================================================
 * 
 * Gestionnaire multi-bots utilisant la nouvelle architecture FSM.
 * Remplace progressivement MultiBotManager.jsx existant.
 * 
 * Features:
 * - Gestion de plusieurs bots en parallèle avec FSM
 * - Interface de contrôle simple
 * - Debug panel intégré
 * - Mode autonome/manuel
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import BotController from '../Bot/BotController';
import fsmLogger from '../../utils/fsmLogger';

const MultiBotManagerFSM = () => {
  // État local pour la gestion des bots
  const [isRunning, setIsRunning] = useState(false);
  const [activeBotCount, setActiveBotCount] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  
  // Générer la liste des IDs de bots actifs (version simplifiée)
  const botIds = Array.from({ length: activeBotCount }, (_, i) => `bot-${i}`);

  // Démarrage automatique
  useEffect(() => {
    fsmLogger.info("[MultiBotManagerFSM] FSM Bot Manager initialized");
    setIsRunning(true);
  }, []);

  // Style du conteneur principal
  const containerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '300px',
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
    marginBottom: '10px'
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

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    fsmLogger.info(`[MultiBotManagerFSM] Bots ${!isRunning ? 'started' : 'stopped'}`);
  };

  const handleAddBot = () => {
    if (activeBotCount < 4) {
      setActiveBotCount(activeBotCount + 1);
      fsmLogger.info(`[MultiBotManagerFSM] Added bot, total: ${activeBotCount + 1}`);
    }
  };

  const handleRemoveBot = () => {
    if (activeBotCount > 1) {
      setActiveBotCount(activeBotCount - 1);
      fsmLogger.info(`[MultiBotManagerFSM] Removed bot, total: ${activeBotCount - 1}`);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#4CAF50' }}>
          🤖 FSM Bot Manager
        </h3>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          v1.0.0
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
          disabled={activeBotCount >= 4}
        >
          ➕ Bot
        </button>
        <button 
          style={buttonStyle}
          onClick={handleRemoveBot}
          disabled={activeBotCount <= 1}
        >
          ➖ Bot
        </button>
        <button 
          style={showDebug ? activeButtonStyle : buttonStyle}
          onClick={() => setShowDebug(!showDebug)}
        >
          🔍 Debug
        </button>
      </div>

      {/* Status global */}
      <div style={{ 
        marginBottom: '10px', 
        padding: '5px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '3px' 
      }}>
        <div><strong>Status:</strong> {isRunning ? '🟢 RUNNING' : '🔴 STOPPED'}</div>
        <div><strong>Bots actifs:</strong> {activeBotCount}</div>
      </div>

      {/* Liste des BotControllers */}
      {botIds.map(botId => (
        <BotController
          key={botId}
          botId={botId}
          showControls={isRunning}
          showDebug={showDebug}
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
          <div>Manager status: Active</div>
          <div>Render time: {new Date().toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
};

export default MultiBotManagerFSM;
