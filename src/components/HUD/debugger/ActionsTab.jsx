import React from 'react';

/**
 * Composant legacy pour l'onglet Actions du debugger
 * Maintenant remplacé par FSMDebugPanel
 */
const ActionsTab = React.memo(() => {
  return (
    <div className="actions-tab">
      <div className="section">
        <h4>Actions Debug (Legacy)</h4>
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>🔧 Ce composant legacy a été remplacé</p>
          <p>Utilisez le <strong>FSM Debug Panel</strong> pour déboguer les actions des bots FSM</p>
          <p>Basculez vers le système FSM pour accéder aux nouveaux outils de debug</p>
        </div>
      </div>
    </div>
  );
});

ActionsTab.displayName = 'ActionsTab';

export default ActionsTab;
