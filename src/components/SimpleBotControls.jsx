import React from 'react';
import useSimpleBotStore from '../stores/useSimpleBotStore';

const SimpleBotControls = () => {
  // Récupération de l'état et des fonctions du store
  const botState = useSimpleBotStore(state => state.botState);
  const isRunning = useSimpleBotStore(state => state.isRunning);
  const toggleBotProcessing = useSimpleBotStore(state => state.toggleBotProcessing);
  const changeState = useSimpleBotStore(state => state.changeState);
  
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '5px', 
      padding: '10px', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Simple Bot Controls (FSM)</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '5px 0' }}>
          Current State: <strong>{botState}</strong>
        </p>
        <p style={{ margin: '5px 0' }}>
          Running: <strong>{isRunning ? "Yes" : "No"}</strong>
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
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
    </div>
  );
};

export default SimpleBotControls;