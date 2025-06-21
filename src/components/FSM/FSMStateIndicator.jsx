/**
 * ============================================================================
 * FSM STATE INDICATOR - Indicateurs visuels 3D pour les états FSM
 * ============================================================================
 * 
 * Composant Three.js pour afficher des indicateurs visuels des états FSM
 * directement dans la scène 3D.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { useBotMachine } from "../../ai/fsm/hooks/useBotMachine.js";

/**
 * Indicateur d'état FSM affiché au-dessus d'un bot
 */
const FSMStateIndicator = ({ 
  botId, 
  position = [0, 1, 0],
  showDetails = false 
}) => {
  const {
    state,
    isAutonomous,
    isMoving
  } = useBotMachine(botId);

  // Couleurs selon l'état
  const getStateColor = (stateName) => {
    const colors = {
      'IDLE': '#ffd700',
      'EXPLORING': '#87ceeb', 
      'COLLECTING': '#90ee90',
      'RETURNING': '#ffa500'
    };
    return colors[stateName] || '#ddd';
  };

  // Émojis selon l'état
  const getStateEmoji = (stateName) => {
    const emojis = {
      'IDLE': '⏸️',
      'EXPLORING': '🔍',
      'COLLECTING': '📦',
      'RETURNING': '🏠'
    };
    return emojis[stateName] || '❓';
  };

  const indicatorStyle = {
    padding: '4px 8px',
    backgroundColor: getStateColor(state),
    color: '#000',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    border: '2px solid #000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const detailsStyle = {
    marginTop: '4px',
    padding: '2px 6px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '10px',
    fontFamily: 'monospace'
  };

  return (
    <Html
      position={position}
      center
      distanceFactor={15}
      sprite
    >
      <div style={indicatorStyle}>
        <span>{getStateEmoji(state)}</span>
        <span>{state}</span>
        {isMoving && <span>🏃</span>}
        {!isAutonomous && <span>🎮</span>}
      </div>
      
      {showDetails && (
        <div style={detailsStyle}>
          <div>Bot: {botId}</div>
          <div>Mode: {isAutonomous ? 'Auto' : 'Manuel'}</div>
        </div>
      )}
    </Html>
  );
};

/**
 * Composant pour afficher plusieurs indicateurs FSM
 */
const MultiFSMStateIndicator = ({ 
  bots = [],
  showDetails = false 
}) => {
  return (
    <>
      {bots.map((bot, index) => (
        <FSMStateIndicator
          key={bot.id}
          botId={bot.id}
          position={bot.position || [index * 2, 1, 0]}
          showDetails={showDetails}
        />
      ))}
    </>
  );
};

export default FSMStateIndicator;
export { MultiFSMStateIndicator };
