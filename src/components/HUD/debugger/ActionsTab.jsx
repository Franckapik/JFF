import React from 'react';

/**
 * Composant pour l'onglet Actions du debugger
 */
const ActionsTab = React.memo(({ 
  actionQueue, 
  storeActionHistory, 
  ACTION_STATUS, 
  getActionStatusColor 
}) => {
  return (
    <div className="debugger-tab-content">
      <div className="debugger-section">
        <h3 className="debugger-section-title">File d'actions ({actionQueue.length})</h3>
        {actionQueue.length === 0 ? (
          <div className="debugger-empty-message">Aucune action en attente</div>
        ) : (
          <div className="debugger-actions-list">
            {actionQueue.map((action, index) => (
              <div 
                key={index} 
                className="debugger-action-item"
                style={{ borderLeftColor: getActionStatusColor(action.status, ACTION_STATUS) }}
              >
                <div className="debugger-action-type">
                  <span className="debugger-label">Type:</span>
                  <span className="debugger-value">{action.type}</span>
                </div>
                <div className="debugger-action-priority">
                  <span className="debugger-label">Priorité:</span>
                  <span className="debugger-value">{action.priority}</span>
                </div>
                <div className="debugger-action-status">
                  <span className="debugger-label">Statut:</span>
                  <span className="debugger-value" style={{ color: getActionStatusColor(action.status, ACTION_STATUS) }}>
                    {action.status}
                  </span>
                </div>
                {action.status === ACTION_STATUS.IN_PROGRESS && (
                  <div className="debugger-action-time">
                    En cours depuis {((Date.now() - action.timestamp)/1000).toFixed(1)}s
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="debugger-section">
        <h3 className="debugger-section-title">Historique des actions ({storeActionHistory.length})</h3>
        {storeActionHistory.length === 0 ? (
          <div className="debugger-empty-message">Aucune action complétée</div>
        ) : (
          <div className="debugger-history-list">
            {storeActionHistory.map((action, index) => (
              <div 
                key={index} 
                className={`debugger-history-item ${action.status === ACTION_STATUS.COMPLETED ? 'debugger-history-completed' : 'debugger-history-failed'}`}
              >
                <div className="debugger-history-header">
                  <span className="debugger-history-type">{action.type}</span>
                  <span className="debugger-history-time">
                    {new Date(action.completedAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="debugger-history-details">
                  <span className="debugger-history-priority">Priorité: {action.priority}</span>
                  <span className="debugger-history-status" style={{ color: getActionStatusColor(action.status, ACTION_STATUS) }}>
                    Status: {action.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ActionsTab;
