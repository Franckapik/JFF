/**
 * ============================================================================
 * SYSTEM TOGGLE - Bascule entre ancien et nouveau système FSM
 * ============================================================================
 * 
 * Composant pour tester et comparer l'ancien système avec le nouveau FSM.
 * Permet un basculement en temps réel pour validation.
 * 
 * @version 1.0.0
 */

import React, { useState } from 'react';

const SystemToggle = ({ 
  onSystemChange,
  currentSystem = 'legacy',
  position = 'top-center'
}) => {
  const [selectedSystem, setSelectedSystem] = useState(currentSystem);

  const handleSystemChange = (system) => {
    setSelectedSystem(system);
    if (onSystemChange) {
      onSystemChange(system);
    }
  };

  // Style du conteneur selon la position
  const getContainerStyle = () => {
    const baseStyle = {
      position: 'fixed',
      zIndex: 1200,
      backgroundColor: '#2a2a2a',
      border: '2px solid #FF9800',
      borderRadius: '8px',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#fff'
    };

    switch (position) {
      case 'top-center':
        return {
          ...baseStyle,
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)'
        };
      case 'top-left':
        return {
          ...baseStyle,
          top: '10px',
          left: '10px'
        };
      case 'top-right':
        return {
          ...baseStyle,
          top: '10px',
          right: '10px'
        };
      default:
        return {
          ...baseStyle,
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)'
        };
    }
  };

  const buttonStyle = {
    padding: '6px 12px',
    margin: '0 5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#FF9800',
    color: '#000'
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#444',
    color: '#fff'
  };

  const systems = [
    { id: 'legacy', label: '🔧 Ancien Système', description: 'BotStore + MultiBotManager' },
    { id: 'fsm', label: '🤖 Nouveau FSM', description: 'React-Robot + useBotMachine' }
  ];

  return (
    <div style={getContainerStyle()}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '8px'
      }}>
        <span style={{ color: '#FF9800', fontWeight: 'bold' }}>
          ⚡ SYSTÈME ACTIF:
        </span>
        <span style={{ 
          padding: '2px 6px', 
          backgroundColor: '#FF9800', 
          color: '#000', 
          borderRadius: '3px',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {systems.find(s => s.id === selectedSystem)?.label}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {systems.map(system => (
          <button
            key={system.id}
            style={selectedSystem === system.id ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleSystemChange(system.id)}
            title={system.description}
          >
            {system.label}
          </button>
        ))}
      </div>

      <div style={{ 
        fontSize: '10px', 
        opacity: 0.7, 
        marginTop: '5px', 
        textAlign: 'center' 
      }}>
        {systems.find(s => s.id === selectedSystem)?.description}
      </div>
    </div>
  );
};

export default SystemToggle;
