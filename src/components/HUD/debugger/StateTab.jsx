import React from 'react';
import VehicleList from './VehicleList';

/**
 * Composant pour l'onglet État du debugger
 */
const StateTab = React.memo(({ 
  botState, 
  isRunning, 
  BOT_STATES, 
  activeBotId, 
  formatStateName,
  isVehicleActive 
}) => {
  return (
    <div className="debugger-tab-content">
      <div className="debugger-section">
        <h3 className="debugger-section-title">État actuel</h3>
        <div className="debugger-state-current">
          <span className="debugger-label">État:</span>
          <span className="debugger-value debugger-highlight">{formatStateName(botState)}</span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">Bot actif:</span>
          <span className={`debugger-value ${isRunning ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
            {isRunning ? 'Oui' : 'Non'}
          </span>
        </div>
      </div>

      <div className="debugger-section">
        <h3 className="debugger-section-title">États disponibles</h3>
        <div className="debugger-states-list">
          {Object.values(BOT_STATES).map(state => (
            <div 
              key={state} 
              className={`debugger-state-item ${state === botState ? 'debugger-state-active' : ''}`}
            >
              {formatStateName(state)}
            </div>
          ))}
        </div>
      </div>

      <VehicleList 
        playerId={activeBotId} 
        isVehicleActive={isVehicleActive} 
      />
    </div>
  );
});

export default StateTab;
