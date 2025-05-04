import React from 'react';
import useSimpleBotStore from '../stores/useSimpleBotStore';

const BotControls = () => {
  // Récupération de l'état et des fonctions du store
  const botState = useSimpleBotStore(state => state.botState);
  const isRunning = useSimpleBotStore(state => state.isRunning);
  const actionQueue = useSimpleBotStore(state => state.actionQueue);
  const toggleBotProcessing = useSimpleBotStore(state => state.toggleBotProcessing);
  const changeState = useSimpleBotStore(state => state.changeState);
  const addAction = useSimpleBotStore(state => state.addAction);
  const PRIORITY = useSimpleBotStore(state => state.PRIORITY);
  
  // Fonction pour ajouter une action manuelle
  const handleAddAction = (actionType, priority) => {
    addAction(actionType, priority);
  };
  
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      padding: '10px', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Bot Controls (FSM)</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '5px 0' }}>
          Current State: <strong>{botState}</strong>
        </p>
        <p style={{ margin: '5px 0' }}>
          Running: <strong>{isRunning ? "Yes" : "No"}</strong>
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={toggleBotProcessing}
          style={{
            backgroundColor: isRunning ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </button>
        
        <select 
          value={botState} 
          onChange={(e) => changeState(e.target.value)}
          disabled={!isRunning}
          style={{
            padding: '5px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="idle">Idle</option>
          <option value="exploring">Exploring</option>
          <option value="returning">Returning</option>
        </select>
      </div>
      
      {/* Section - Ajout d'actions manuelles */}
      <div>
        <h4 style={{ margin: '10px 0', fontSize: '1em' }}>Ajouter des actions</h4>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '5px',
          marginBottom: '10px'
        }}>
          <button 
            onClick={() => handleAddAction('move', PRIORITY.LOW)}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '5px',
              fontSize: '0.8em',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mouvement (BASSE)
          </button>
          
          <button 
            onClick={() => handleAddAction('move', PRIORITY.MEDIUM)}
            style={{
              backgroundColor: '#FFC107',
              color: 'black',
              border: 'none',
              padding: '5px',
              fontSize: '0.8em',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mouvement (MOYENNE)
          </button>
          
          <button 
            onClick={() => handleAddAction('returnToBase', PRIORITY.HIGH)}
            style={{
              backgroundColor: '#FFA500',
              color: 'white',
              border: 'none',
              padding: '5px',
              fontSize: '0.8em',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retour Base (HAUTE)
          </button>
          
          <button 
            onClick={() => handleAddAction('refuel', PRIORITY.URGENT)}
            style={{
              backgroundColor: '#FF0000',
              color: 'white',
              border: 'none',
              padding: '5px',
              fontSize: '0.8em',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ravitailler (URGENT)
          </button>
        </div>
      </div>
      
      {/* Section d'information éducative */}
      <div style={{ 
        marginTop: '15px',
        padding: '8px',
        backgroundColor: '#e9f5f8',
        borderRadius: '4px',
        fontSize: '0.85em',
        color: '#444'
      }}>
        <p style={{ margin: '0 0 5px 0' }}><strong>File d'actions prioritaires</strong></p>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Les actions sont exécutées par ordre de priorité</li>
          <li>À priorité égale, la première ajoutée est exécutée en premier</li>
          <li>Une nouvelle action peut être insérée devant celles de priorité moindre</li>
        </ul>
      </div>
    </div>
  );
};

export default BotControls;
