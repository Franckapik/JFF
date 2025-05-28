import React, { useMemo } from 'react';
import useBotStore from '../../../stores/useBotStore';

/**
 * Composant pour l'onglet Actions du debugger
 */
const ActionsTab = React.memo(() => {
  try {
    // Utiliser useMemo pour éviter les re-calculs inutiles
    const currentBotIndex = useBotStore((state) => state.currentBotIndex);
    const botStates = useBotStore((state) => state.botStates);
    const actionHistory = useBotStore((state) => state.actionHistory);
    
    // Mettre en cache le résultat de getActionQueue pour éviter la boucle infinie
    const actionQueue = useMemo(() => {
      try {
        return useBotStore.getState().getActionQueue?.() || [];
      } catch (error) {
        console.warn('Error getting action queue:', error);
        return [];
      }
    }, [currentBotIndex, botStates]); // Dépendances pour recalculer si nécessaire

    const currentBotState = useMemo(() => {
      return botStates?.[currentBotIndex] || {};
    }, [botStates, currentBotIndex]);

    return (
      <div className="actions-tab">
        <div className="section">
          <h4>Queue d'Actions ({actionQueue?.length || 0})</h4>
          <div className="action-list">
            {actionQueue && actionQueue.length > 0 ? (
              actionQueue.map((action, index) => (
                <div key={index} className={`action-item ${action.status}`}>
                  <div className="action-header">
                    <span className="action-type">{action.type}</span>
                    <span className="action-priority">P{action.priority}</span>
                    <span className="action-status">{action.status}</span>
                  </div>
                  {action.params && Object.keys(action.params).length > 0 && (
                    <div className="action-params">
                      {Object.entries(action.params).map(([key, value]) => (
                        <span key={key} className="param">
                          {key}: {JSON.stringify(value)}
                        </span>
                      ))}
                    </div>
                  )}
                  {action.result && (
                    <div className="action-result">
                      Résultat: {JSON.stringify(action.result)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-actions">Aucune action en queue</div>
            )}
          </div>
        </div>

        <div className="section">
          <h4>État du Bot</h4>
          <div className="bot-state-info">
            <div>Bot Index: {currentBotIndex}</div>
            <div>Bot État: {currentBotState.botState || 'inconnu'}</div>
            <div>Actions en queue: {actionQueue?.length || 0}</div>
          </div>
        </div>

        <div className="section">
          <h4>Historique d'Actions ({actionHistory?.length || 0})</h4>
          <div className="action-list history">
            {actionHistory && actionHistory.length > 0 ? (
              actionHistory.slice(-10).reverse().map((action, index) => (
                <div key={index} className={`action-item history ${action.status}`}>
                  <div className="action-header">
                    <span className="action-type">{action.type}</span>
                    <span className="action-status">{action.status}</span>
                    <span className="action-time">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {action.result && (
                    <div className="action-result">
                      {JSON.stringify(action.result)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-actions">Aucun historique</div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.warn('BotStore not ready:', error);
    return <div>Chargement du debugger...</div>;
  }
});

ActionsTab.displayName = 'ActionsTab';

export default ActionsTab;
