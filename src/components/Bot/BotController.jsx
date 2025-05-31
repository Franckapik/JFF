/**
 * ============================================================================
 * BOT CONTROLLER - Composant principal utilisant useBotMachine
 * ============================================================================
 * 
 * Composant simple pour contrôler un bot avec la nouvelle architecture FSM.
 * Affiche l'état actuel et fournit des contrôles de base.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { useBotMachineFixed } from "../../ai/fsm/hooks/useBotMachineFixed.js";

/**
 * Contrôleur principal pour un bot autonome
 * @param {Object} props - Props du composant
 * @param {string} props.botId - ID unique du bot
 * @param {boolean} props.showControls - Afficher les contrôles manuels (défaut: true)
 * @param {boolean} props.showDebug - Afficher les infos de debug (défaut: false)
 */
const BotController = ({ 
  botId = 'bot-0',
  showControls = true,
  showDebug = false 
}) => {
  // Hook FSM principal
  const {
    entity,
    vehicle,
    state,
    context,
    actions,
    send,
    // Helpers
    isAutonomous,
    canManualControl,
    isMoving
  } = useBotMachineFixed(botId);

  // Handlers pour les contrôles manuels
  const handleMoveTo = () => {
    // Mouvement simple vers une tuile aléatoire pour test
    const testCoord = `${Math.floor(Math.random() * 10)},${Math.floor(Math.random() * 10)}`;
    actions.moveTo({
      position: { x: Math.random() * 10, y: 0, z: Math.random() * 10 },
      coord: testCoord
    });
  };

  const handleStartExploration = () => {
    actions.startExploration();
  };

  const handleToggleAutonomous = () => {
    actions.toggleAutonomous();
  };

  const handleStop = () => {
    actions.stopMovement();
  };

  // Style simple pour l'affichage
  const containerStyle = {
    padding: '10px',
    margin: '5px',
    border: '1px solid #444',
    borderRadius: '5px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: '12px',
    fontFamily: 'monospace'
  };

  const statusStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '4px 8px',
    margin: '2px',
    fontSize: '11px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#333',
    color: '#fff'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#0a7c0a'
  };

  return (
    <div style={containerStyle}>
      {/* Header avec ID du bot */}
      <h4 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
        🤖 {botId}
      </h4>

      {/* Status principal */}
      <div style={statusStyle}>
        <div>
          <strong>État:</strong> {state}
        </div>
        <div>
          <strong>Mode:</strong> {isAutonomous ? '🔄 AUTO' : '🎮 MANUEL'}
        </div>
        <div>
          <strong>Mouvement:</strong> {isMoving ? '🏃 EN COURS' : '⏸️ ARRÊT'}
        </div>
      </div>

      {/* Infos véhicule */}
      {vehicle && (
        <div style={{ marginBottom: '10px', fontSize: '11px' }}>
          <div><strong>Position:</strong> {vehicle.coord || 'N/A'}</div>
          <div><strong>Carburant:</strong> {vehicle.fuel || 0}/100</div>
          <div><strong>Ressources:</strong> {JSON.stringify(vehicle.resources || {})}</div>
        </div>
      )}

      {/* Contrôles manuels */}
      {showControls && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Contrôles:</strong>
          </div>
          <div>
            <button 
              style={buttonStyle}
              onClick={handleMoveTo}
              disabled={isMoving}
            >
              📍 Mouvement Test
            </button>
            <button 
              style={buttonStyle}
              onClick={handleStartExploration}
              disabled={!canManualControl}
            >
              🔍 Explorer
            </button>
            <button 
              style={isAutonomous ? activeButtonStyle : buttonStyle}
              onClick={handleToggleAutonomous}
            >
              {isAutonomous ? '⏸️ Pause Auto' : '▶️ Start Auto'}
            </button>
            <button 
              style={buttonStyle}
              onClick={handleStop}
            >
              🛑 Stop
            </button>
          </div>
        </div>
      )}

      {/* Debug info */}
      {showDebug && context && (
        <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
          <strong>Debug Context:</strong>
          <pre style={{ fontSize: '9px', margin: '5px 0' }}>
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BotController;
