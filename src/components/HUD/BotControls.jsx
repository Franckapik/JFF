import React, { useState } from 'react';
import useBotStore from '../../stores/useBotStore';
import usePlayerStore from '../../stores/playerStore';
import { useTileStore } from '../../stores/useNewTileStore';
import { BOT_PLAYER_ID, getBotMainVehicleId } from '../../ai/constants/playerConstants';

const BotControls = () => {
  // États locaux pour les contrôles avancés
  const [showDetails, setShowDetails] = useState(false);
  
  // Récupération de l'état et des fonctions du store
  const {
    botState,
    isRunning,
    actionQueue,
    toggleBotProcessing,
    changeState,
    addAction,
    initializeBot,
    BOT_STATES,
    PRIORITY,
    _test
  } = useBotStore();
  
  // Récupérer des informations supplémentaires en utilisant les constantes
  const botVehicleId = getBotMainVehicleId(); // Obtenir l'ID du véhicule bot dynamiquement
  const botVehicle = usePlayerStore(state => state.players?.[BOT_PLAYER_ID]?.vehicles?.[botVehicleId]);
  const botMemory = usePlayerStore(state => state.players?.[BOT_PLAYER_ID]?.memory || {});
  
  // Fonction pour ajouter une action manuelle avec une priorité donnée
  const handleAddAction = (actionType, priority) => {
    addAction(actionType, priority);
  };
  
  // Fonction pour forcer une transition d'état
  const forceStateChange = (newState) => {
    changeState(newState);
  };
  
  // Fonction pour réinitialiser complètement le bot
  const handleReset = () => {
    _test.resetState();
  };
  
  // Fonction pour initialiser le bot
  const handleInitialize = () => {
    initializeBot();
  };
  
  return (
    <div className="bot-controls" style={{ maxHeight: '90vh', overflow: 'auto', padding: '15px' }}>
      <h3>Bot Controls (FSM)</h3>
      
      {/* Section d'état et contrôles principaux */}
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
        padding: '10px', 
        borderRadius: '5px',
        marginBottom: '15px'
      }}>
        <div className="bot-controls-info">
          <p>
            Current State: <strong style={{ 
              color: botState === 'idle' ? '#4CAF50' : 
                     botState === 'exploring' ? '#2196F3' : 
                     botState === 'collecting' ? '#FFC107' : '#9C27B0' 
            }}>
              {botState.toUpperCase()}
            </strong>
          </p>
          <p>
            Running: <strong style={{ color: isRunning ? '#4CAF50' : '#F44336' }}>
              {isRunning ? "Yes" : "No"}
            </strong>
          </p>
          {botVehicle && (
            <>
              <p>Fuel: <strong>{botVehicle.fuel}</strong>/100</p>
              <p>Position: <strong>{botVehicle.coord || "Unknown"}</strong></p>
              <p>Resources: <strong>
                F:{botVehicle.resources?.food || 0} | 
                D:{botVehicle.resources?.debris || 0} | 
                S:{botVehicle.resources?.special || 0}
              </strong></p>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={toggleBotProcessing}
            style={{ 
              backgroundColor: isRunning ? '#F44336' : '#4CAF50', 
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            {isRunning ? "Stop Bot" : "Start Bot"}
          </button>
          
          <button
            onClick={handleReset}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Reset Bot
          </button>
          
          <button
            onClick={handleInitialize}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Initialize
          </button>
        </div>
      </div>

      {/* Section de contrôle des états */}
      <div style={{ 
        backgroundColor: 'rgba(33, 150, 243, 0.1)', 
        padding: '10px', 
        borderRadius: '5px',
        marginBottom: '15px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Force State Transition</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {Object.values(BOT_STATES).map(state => (
            <button
              key={state}
              onClick={() => forceStateChange(state)}
              style={{
                backgroundColor: botState === state ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                color: botState === state ? '#000' : '#333',
                border: botState === state ? '2px solid #333' : '1px solid #999',
                padding: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: botState === state ? 'bold' : 'normal'
              }}
            >
              {state.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Section de test des actions */}
      <div style={{ 
        backgroundColor: 'rgba(76, 175, 80, 0.1)', 
        padding: '10px', 
        borderRadius: '5px',
        marginBottom: '15px' 
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Test Actions</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <h5 style={{ margin: '5px 0', fontSize: '14px' }}>IDLE Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
            <button onClick={() => handleAddAction('evaluateIdle', PRIORITY.HIGH)}
              style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Evaluate Conditions (HIGH)
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <h5 style={{ margin: '5px 0', fontSize: '14px' }}>EXPLORING Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
            <button onClick={() => handleAddAction('exploreDrone', PRIORITY.MEDIUM)} 
              style={{ padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Explore with Drone (MEDIUM)
            </button>
            <button onClick={() => handleAddAction('moveToRandomTile', PRIORITY.LOW)}
              style={{ padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Move to Random Tile (LOW)
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <h5 style={{ margin: '5px 0', fontSize: '14px' }}>COLLECTING Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
            <button onClick={() => handleAddAction('moveToResource', PRIORITY.MEDIUM)} 
              style={{ padding: '8px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Move To Resource (MEDIUM)
            </button>
            <button onClick={() => handleAddAction('collectResource', PRIORITY.HIGH)} 
              style={{ padding: '8px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Collect Resource (HIGH)
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <h5 style={{ margin: '5px 0', fontSize: '14px' }}>RETURNING Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
            <button onClick={() => handleAddAction('returnToBase', PRIORITY.HIGH)} 
              style={{ padding: '8px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Return to Base (HIGH)
            </button>
            <button onClick={() => handleAddAction('refuelAtBase', PRIORITY.HIGH)} 
              style={{ padding: '8px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Refuel at Base (HIGH)
            </button>
          </div>
        </div>
        
        <div>
          <h5 style={{ margin: '5px 0', fontSize: '14px' }}>TEST Actions</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '5px' }}>
            <button onClick={() => handleAddAction('testQueue', PRIORITY.URGENT)} 
              style={{ padding: '8px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Test Queue Action (URGENT)
            </button>
          </div>
        </div>
      </div>
      
      {/* File d'actions actuelle */}
      <div style={{ 
        backgroundColor: 'rgba(156, 39, 176, 0.1)', 
        padding: '10px', 
        borderRadius: '5px' 
      }}>
        <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Action Queue ({actionQueue.length})</span>
          <button onClick={() => setShowDetails(!showDetails)} style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#9C27B0'
          }}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </h4>
        
        {actionQueue.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#666', fontSize: '14px' }}>Queue is empty</p>
        ) : (
          <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
            {actionQueue.map((action, index) => (
              <li key={index} style={{ 
                marginBottom: '5px',
                padding: '8px', 
                backgroundColor: action.status === 'in_progress' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                borderLeft: `4px solid ${
                  action.priority === 4 ? '#FF5722' : 
                  action.priority === 3 ? '#9C27B0' : 
                  action.priority === 2 ? '#2196F3' : '#4CAF50'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{action.type}</strong>
                  <span style={{ 
                    fontSize: '12px',
                    backgroundColor: action.status === 'pending' ? '#FFC107' : 
                                    action.status === 'in_progress' ? '#2196F3' : 
                                    action.status === 'completed' ? '#4CAF50' : '#F44336',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {action.status.toUpperCase()}
                  </span>
                </div>
                
                {showDetails && (
                  <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    <div>Priority: {['LOW', 'MEDIUM', 'HIGH', 'URGENT'][action.priority - 1]}</div>
                    <div>Added: {new Date(action.timestamp).toLocaleTimeString()}</div>
                    {Object.keys(action.params || {}).length > 0 && (
                      <div>Params: {JSON.stringify(action.params)}</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Section d'information éducative et d'aide */}
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
        padding: '10px', 
        borderRadius: '5px',
        marginTop: '15px',
        fontSize: '12px'
      }}>
        <h5 style={{ margin: '0 0 8px 0' }}>FSM Information</h5>
        <p style={{ margin: '0 0 5px 0' }}><strong>États</strong>: Définissent le comportement général du bot</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Actions</strong>: Tâches spécifiques exécutées par priorité</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Priorités</strong>: URGENT (4) > HIGH (3) > MEDIUM (2) > LOW (1)</p>
        <p style={{ margin: '0 0 5px 0' }}><strong>Cycle de vie</strong>: ÉTAT → ACTIONS → IDLE → Évaluation → Nouvel ÉTAT</p>
      </div>
    </div>
  );
};

export default BotControls;
