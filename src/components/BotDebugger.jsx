// src/components/BotDebugger.jsx
// Composant de débogage pour visualiser l'état de la FSM du bot
import React, { useState, useEffect } from 'react';
import useSimpleBotStore from '../stores/useBotStore';
import usePlayerStore from '../stores/usePlayerStore';

// Style pour le débogueur
const debuggerStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  maxWidth: '400px',
  maxHeight: '500px',
  overflow: 'auto',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: 1000,
};

const tabStyle = {
  display: 'flex',
  marginBottom: '10px',
};

const tabButtonStyle = (active) => ({
  padding: '5px 10px',
  backgroundColor: active ? '#444' : '#222',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius: '4px',
});

const stateBoxStyle = (isActive) => ({
  padding: '5px 10px',
  backgroundColor: isActive ? '#2a6d2a' : '#333',
  border: '1px solid ' + (isActive ? '#4caf50' : '#555'),
  borderRadius: '4px',
  margin: '5px 0',
});

const actionItemStyle = (completed) => ({
  padding: '5px',
  backgroundColor: completed ? '#2a4d6d' : '#444',
  margin: '3px 0',
  borderRadius: '4px',
});

/**
 * Composant de débogage pour la FSM du bot
 * Affiche l'état actuel, la file d'actions et les dernières actions complétées
 */
const BotDebugger = () => {
  // États pour le débogueur
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('state'); // 'state', 'actions', 'history', 'conditions'
  const [stateHistory, setStateHistory] = useState([]);
  const [conditionLog, setConditionLog] = useState([]);
  
  // Récupération de l'état du bot
  const {
    botState,
    isRunning,
    actionQueue,
    completedActions,
    BOT_STATES
  } = useSimpleBotStore();
  
  // Récupération des données du joueur bot
  const botVehicle = usePlayerStore(state => state.players?.player2?.vehicles?.ship);
  const botMemory = usePlayerStore(state => state.players?.player2?.memory);
  
  // Ajoute un état au historique lors des changements
  useEffect(() => {
    if (botState) {
      setStateHistory(prev => [...prev.slice(-19), { 
        state: botState, 
        timestamp: new Date().toLocaleTimeString(),
        fuel: botVehicle?.fuel,
        resources: botVehicle?.resources
      }]);
    }
  }, [botState, botVehicle]);
  
  // Ajoute un log de condition quand une action d'évaluation est complétée
  useEffect(() => {
    const lastAction = completedActions[completedActions.length - 1];
    if (lastAction?.type === 'evaluateIdle') {
      setConditionLog(prev => [...prev.slice(-9), {
        timestamp: new Date().toLocaleTimeString(),
        nextState: botState,
        conditions: {
          fuel: botVehicle?.fuel,
          atCapacity: botVehicle?.isAtCapacity,
          knownResources: botMemory?.knownResources?.length || 0,
          explorationCount: botMemory?.explorationCount || 0
        }
      }]);
    }
  }, [completedActions, botState, botVehicle, botMemory]);
  
  // Formater le nom d'un état pour l'affichage
  const formatStateName = (state) => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };
  
  // Rendu des différents onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'state':
        return (
          <div>
            <h4>État actuel: <span style={{ color: '#4caf50' }}>{formatStateName(botState)}</span></h4>
            <div>Bot actif: <span style={{ color: isRunning ? '#4caf50' : '#ff5722' }}>{isRunning ? 'Oui' : 'Non'}</span></div>
            
            <h4>États disponibles:</h4>
            {Object.values(BOT_STATES).map(state => (
              <div key={state} style={stateBoxStyle(state === botState)}>
                {formatStateName(state)}
              </div>
            ))}
            
            <h4>Données du véhicule:</h4>
            <div>Carburant: {botVehicle?.fuel || 0}/100</div>
            <div>Ressources: 
              Food: {botVehicle?.resources?.food || 0}, 
              Debris: {botVehicle?.resources?.debris || 0}, 
              Special: {botVehicle?.resources?.special || 0}
            </div>
            <div>À capacité max: {botVehicle?.isAtCapacity ? 'Oui' : 'Non'}</div>
          </div>
        );
        
      case 'actions':
        return (
          <div>
            <h4>File d'actions ({actionQueue.length}):</h4>
            {actionQueue.length === 0 ? (
              <div style={{ padding: '5px', color: '#888' }}>Aucune action en attente</div>
            ) : (
              actionQueue.map((action, index) => (
                <div key={index} style={actionItemStyle(false)}>
                  <div><strong>Type:</strong> {action.type}</div>
                  <div><strong>Priorité:</strong> {action.priority}</div>
                </div>
              ))
            )}
          </div>
        );
      
      case 'history':
        return (
          <div>
            <h4>Historique des états ({stateHistory.length}):</h4>
            {stateHistory.map((item, index) => (
              <div key={index} style={{ 
                padding: '5px', 
                margin: '3px 0',
                backgroundColor: '#333',
                borderLeft: '3px solid #4caf50',
                borderRadius: '2px' 
              }}>
                <div><strong>{item.timestamp}</strong> → {formatStateName(item.state)}</div>
                <div style={{ fontSize: '10px', color: '#aaa' }}>
                  Fuel: {item.fuel}, Resources: {JSON.stringify(item.resources)}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'conditions':
        return (
          <div>
            <h4>Log des évaluations ({conditionLog.length}):</h4>
            {conditionLog.map((log, index) => (
              <div key={index} style={{ 
                padding: '5px', 
                margin: '5px 0',
                backgroundColor: '#333',
                borderLeft: `3px solid #2196f3`,
                borderRadius: '2px' 
              }}>
                <div><strong>{log.timestamp}</strong> → État choisi: {formatStateName(log.nextState)}</div>
                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                  <div>Fuel: <span style={{ color: log.conditions.fuel < 50 ? '#ff5722' : '#4caf50' }}>{log.conditions.fuel}</span></div>
                  <div>À capacité: <span style={{ color: log.conditions.atCapacity ? '#ff5722' : '#4caf50' }}>{log.conditions.atCapacity ? 'Oui' : 'Non'}</span></div>
                  <div>Ressources connues: {log.conditions.knownResources}</div>
                  <div>Explorations: {log.conditions.explorationCount}</div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return <div>Onglet inconnu</div>;
    }
  };
  
  // Gestionnaire d'actions pour le débogueur
  const handleResetHistory = () => {
    setStateHistory([]);
    setConditionLog([]);
  };
  
  return isVisible ? (
    <div style={debuggerStyle}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: 0 }}>Bot FSM Debugger</h3>
        <div>
          <button onClick={handleResetHistory} style={{ 
            padding: '2px 5px',
            backgroundColor: '#555',
            border: 'none',
            color: '#fff',
            marginRight: '5px'
          }}>
            Reset
          </button>
          <button onClick={() => setIsVisible(false)} style={{ 
            padding: '2px 5px',
            backgroundColor: '#555',
            border: 'none',
            color: '#fff'
          }}>
            ×
          </button>
        </div>
      </div>
      
      <div style={tabStyle}>
        <button 
          onClick={() => setActiveTab('state')} 
          style={tabButtonStyle(activeTab === 'state')}
        >
          État
        </button>
        <button 
          onClick={() => setActiveTab('actions')} 
          style={tabButtonStyle(activeTab === 'actions')}
        >
          Actions ({actionQueue.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          style={tabButtonStyle(activeTab === 'history')}
        >
          Historique
        </button>
        <button 
          onClick={() => setActiveTab('conditions')} 
          style={tabButtonStyle(activeTab === 'conditions')}
        >
          Conditions
        </button>
      </div>
      
      {renderTabContent()}
    </div>
  ) : (
    <button 
      onClick={() => setIsVisible(true)} 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Show Debugger
    </button>
  );
};

export default BotDebugger;