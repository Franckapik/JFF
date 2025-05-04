import React from 'react';
import useBotStore from '../stores/useBotStore';

const BotControls = () => {
  // Récupération de l'état et des fonctions du store
  const botState = useBotStore(state => state.botState);
  const isRunning = useBotStore(state => state.isRunning);
  const actionQueue = useBotStore(state => state.actionQueue);
  const toggleBotProcessing = useBotStore(state => state.toggleBotProcessing);
  const changeState = useBotStore(state => state.changeState);
  const addAction = useBotStore(state => state.addAction);
  const PRIORITY = useBotStore(state => state.PRIORITY);
  
  // Fonction pour ajouter une action manuelle
  const handleAddAction = (actionType, priority) => {
    addAction(actionType, priority);
  };
  
  return (
    <div className="bot-controls">
      <h3>Bot Controls (FSM)</h3>
      
      <div className="bot-controls-info">
        <p>
          Current State: <strong>{botState}</strong>
        </p>
        <p>
          Running: <strong>{isRunning ? "Yes" : "No"}</strong>
        </p>
      </div>
      
      <div className="bot-controls-buttons">
        <button 
          onClick={toggleBotProcessing}
          className={`bot-controls-toggle ${isRunning ? 'running' : ''}`}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </button>
        
        <select 
          value={botState} 
          onChange={(e) => changeState(e.target.value)}
          disabled={!isRunning}
          className="bot-controls-state-select"
        >
          <option value="idle">Idle</option>
          <option value="exploring">Exploring</option>
          <option value="returning">Returning</option>
        </select>
      </div>
      
      {/* Section - Ajout d'actions manuelles */}
      <div className="bot-controls-actions-section">
        <h4>Ajouter des actions</h4>
        <div className="bot-controls-actions-grid">
          <button 
            onClick={() => handleAddAction('move', PRIORITY.LOW)}
            className="bot-action-button bot-action-move-low"
          >
            Mouvement (BASSE)
          </button>
          
          <button 
            onClick={() => handleAddAction('move', PRIORITY.MEDIUM)}
            className="bot-action-button bot-action-move-medium"
          >
            Mouvement (MOYENNE)
          </button>
          
          <button 
            onClick={() => handleAddAction('returnToBase', PRIORITY.HIGH)}
            className="bot-action-button bot-action-return-high"
          >
            Retour Base (HAUTE)
          </button>
          
          <button 
            onClick={() => handleAddAction('refuel', PRIORITY.URGENT)}
            className="bot-action-button bot-action-collect-urgent"
          >
            Ravitailler (URGENT)
          </button>
        </div>
      </div>
      
      {/* Section d'information éducative */}
      <div className="bot-info-section">
        <p><strong>File d'actions prioritaires</strong></p>
        <ul>
          <li>Les actions sont exécutées par ordre de priorité</li>
          <li>À priorité égale, la première ajoutée est exécutée en premier</li>
          <li>Une nouvelle action peut être insérée devant celles de priorité moindre</li>
        </ul>
      </div>
    </div>
  );
};

export default BotControls;
