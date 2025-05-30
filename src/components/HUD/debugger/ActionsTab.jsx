
import React from 'react';

/**
 * Composant pour l'onglet Actions du debugger (FSM)
 * Affiche la queue d'actions et l'historique des actions FSM
 */
const ActionsTab = React.memo(({ 
  actionQueue = [], 
  storeActionHistory = [], 
  getActionStatusColor 
}) => {
  
  // Fonction par défaut pour les couleurs si non fournie
  const defaultGetActionStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA726';
      case 'running': return '#42A5F5';
      case 'completed': return '#66BB6A';
      case 'failed': return '#EF5350';
      default: return '#9E9E9E';
    }
  };

  const statusColorFn = getActionStatusColor || defaultGetActionStatusColor;

  return (
    <div className="debugger-tab-content">
      {/* Queue d'actions */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">File d'attente des actions</h3>
        {actionQueue.length > 0 ? (
          <div className="debugger-actions-queue">
            {actionQueue.map((action, index) => (
              <div key={action.id || index} className="debugger-action-item">
                <div className="debugger-action-header">
                  <span className="debugger-action-type">{action.type}</span>
                  <span 
                    className="debugger-action-status"
                    style={{ color: statusColorFn(action.status) }}
                  >
                    {action.status}
                  </span>
                </div>
                <div className="debugger-action-details">
                  {action.target && (
                    <span className="debugger-action-target">
                      Cible: {action.target}
                    </span>
                  )}
                  {action.area && (
                    <span className="debugger-action-area">
                      Zone: {action.area}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="debugger-empty-message">
            Aucune action en cours
          </div>
        )}
      </div>

      {/* Historique des actions */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">Historique des actions</h3>
        {storeActionHistory.length > 0 ? (
          <div className="debugger-actions-history">
            {storeActionHistory.slice(-10).reverse().map((action, index) => (
              <div key={action.id || index} className="debugger-action-item debugger-action-history-item">
                <div className="debugger-action-header">
                  <span className="debugger-action-type">{action.type}</span>
                  <span 
                    className="debugger-action-status"
                    style={{ color: statusColorFn(action.status) }}
                  >
                    {action.status}
                  </span>
                </div>
                <div className="debugger-action-timestamp">
                  {action.timestamp ? new Date(action.timestamp).toLocaleTimeString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="debugger-empty-message">
            Aucun historique disponible
          </div>
        )}
      </div>

      {/* Informations système FSM */}
      <div className="debugger-section">
        <h3 className="debugger-section-title">Système FSM</h3>
        <div className="debugger-fsm-info">
          <div className="debugger-data-item">
            <span className="debugger-label">Actions en queue:</span>
            <span className="debugger-value">{actionQueue.length}</span>
          </div>
          <div className="debugger-data-item">
            <span className="debugger-label">Actions dans l'historique:</span>
            <span className="debugger-value">{storeActionHistory.length}</span>
          </div>
          <div className="debugger-system-status">
            <span className="debugger-label">État système:</span>
            <span className="debugger-value debugger-value-active">FSM Actif</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ActionsTab.displayName = 'ActionsTab';

export default ActionsTab;
