import React from 'react';
import { useBotMachine } from '../../../ai/fsm/hooks/useBotMachine';
import VehicleList from './VehicleList';

/**
 * Composant pour l'onglet États FSM du debugger
 * Affiche les états des machines d'état des bots
 */
const StateTab = React.memo(({ 
  activeBotId, 
  formatStateName,
  isVehicleActive 
}) => {
  // Hook FSM pour le bot actuel
  const {
    entity,
    vehicle,
    state,
    context,
    actions,
    isAutonomous,
    canManualControl,
    isMoving
  } = useBotMachine(activeBotId);

  // États FSM disponibles
  const fsmStates = ['IDLE', 'EXPLORING', 'COLLECTING', 'RETURNING', 'MANUAL_CONTROL'];
  
  // Événements FSM disponibles
  const fsmEvents = [
    { name: 'explore', label: '🔍 Explorer', enabled: state === 'IDLE' },
    { name: 'collect', label: '📦 Collecter', enabled: state === 'IDLE' },
    { name: 'returnHome', label: '🏠 Retour base', enabled: ['EXPLORING', 'COLLECTING'].includes(state) },
    { name: 'foundResource', label: '💎 Ressource trouvée', enabled: state === 'EXPLORING' },
    { name: 'inventoryFull', label: '📦 Inventaire plein', enabled: state === 'COLLECTING' }
  ];

  return (
    <div className="debugger-tab-content">
      {/* État FSM actuel */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">État FSM Actuel</h3>
        <div className="debugger-state-current">
          <span className="debugger-label">État:</span>
          <span className="debugger-value debugger-highlight">{state}</span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">Mode:</span>
          <span className={`debugger-value ${isAutonomous ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
            {isAutonomous ? 'Autonome' : 'Manuel'}
          </span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">En mouvement:</span>
          <span className={`debugger-value ${isMoving ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
            {isMoving ? 'Oui' : 'Non'}
          </span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">Contrôle manuel possible:</span>
          <span className={`debugger-value ${canManualControl ? 'debugger-value-active' : 'debugger-value-inactive'}`}>
            {canManualControl ? 'Oui' : 'Non'}
          </span>
        </div>
      </div>

      {/* États FSM disponibles */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">États FSM Disponibles</h3>
        <div className="debugger-states-list">
          {fsmStates.map(fsmState => (
            <div 
              key={fsmState} 
              className={`debugger-state-item ${fsmState === state ? 'debugger-state-active' : ''}`}
            >
              {fsmState}
            </div>
          ))}
        </div>
      </div>

      {/* Événements FSM */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">Événements FSM</h3>
        <div className="debugger-events-list">
          {fsmEvents.map(event => (
            <div 
              key={event.name}
              className={`debugger-event-item ${event.enabled ? 'debugger-event-enabled' : 'debugger-event-disabled'}`}
            >
              <span className="debugger-event-label">{event.label}</span>
              <span className="debugger-event-name">({event.name})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contexte de l'entité */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">Contexte de l'Entité</h3>
        <div className="debugger-context">
          <div className="debugger-context-item">
            <span className="debugger-label">ID:</span>
            <span className="debugger-value">{entity?.id || 'N/A'}</span>
          </div>
          <div className="debugger-context-item">
            <span className="debugger-label">Type:</span>
            <span className="debugger-value">{entity?.type || 'N/A'}</span>
          </div>
          <div className="debugger-context-item">
            <span className="debugger-label">Position:</span>
            <span className="debugger-value">
              {vehicle ? `(${vehicle.position?.x?.toFixed(1)}, ${vehicle.position?.z?.toFixed(1)})` : 'N/A'}
            </span>
          </div>
          <div className="debugger-context-item">
            <span className="debugger-label">Destination:</span>
            <span className="debugger-value">
              {entity?.target ? `${entity.target.coord || 'N/A'}` : 'Aucune'}
            </span>
          </div>
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
