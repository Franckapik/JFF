import React from 'react';
import { useFSM } from '../../hooks/useFSM';
import { useFSMStore } from '../../stores/useFSMStoreXState';

/**
 * Formate la valeur d'état FSM pour l'affichage
 * Gère les états composés de XState v5
 */
function formatFSMStateValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    // XState v5 peut retourner un objet imbriqué ou un tableau d'états parallèles
    if (Array.isArray(value)) {
      return value.map(formatFSMStateValue).join(' | ');
    }
    // Pour les objets imbriqués (états composés)
    const flatten = (obj, path = []) => {
      if (typeof obj === 'string') return [...path, obj].join('.');
      if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj)
          .map(([k, v]) => flatten(v, [...path, k]))
          .join(' | ');
      }
      return String(obj);
    };
    return flatten(value);
  }
  return String(value);
}

/**
 * HUD centralisé pour la machine FSM
 * Affiche l'état courant et permet d'envoyer des événements
 */
export default function CentralFSMHud() {
  console.log('[CentralFSMHud] render');
  const [selectedBot, setSelectedBot] = React.useState('main');
  
  // Hook simplifié - seulement fsmState et send
  const { fsmState, send } = useFSM(selectedBot) || {};
  
  // Fonctions directes du store - séparées pour éviter les boucles
  const allBots = useFSMStore(React.useCallback((state) => Object.keys(state.botStates || {}), []));
  const addBotFn = useFSMStore(React.useCallback((state) => state.addBot, []));
  const removeBotFn = useFSMStore(React.useCallback((state) => state.removeBot, []));
  
  // Valeurs sécurisées
  const safeFsmState = fsmState || { value: 'N/A', context: {} };
  const safeAllBots = Array.isArray(allBots) ? allBots : ['main'];
  const safeSend = typeof send === 'function' ? send : () => {};
  const safeAddBot = typeof addBotFn === 'function' ? addBotFn : () => {};
  const safeRemoveBot = typeof removeBotFn === 'function' ? removeBotFn : () => {};
  
  // Fonction pour ajouter un nouveau bot
  const handleAddBot = () => {
    const newBotId = `bot-${Date.now().toString().slice(-4)}`;
    safeAddBot(newBotId);
    setSelectedBot(newBotId);
  };
  
  // Fonction pour supprimer le bot sélectionné
  const handleRemoveBot = () => {
    if (selectedBot !== 'main') {
      safeRemoveBot(selectedBot);
      setSelectedBot('main');
    }
  };
  
  // Liste des événements actifs dans la machine
  const events = [
    { type: 'EVALUATION_COMPLETE', label: 'Évaluation complète', color: '#4444ff' },
    { type: 'EMERGENCY_DETECTED', label: 'Urgence détectée', color: '#ff4444' },
    { type: 'BASE_REACHED', label: 'Base atteinte', color: '#44aa44' },
    { type: 'TILE_EXPLORED', label: 'Tuile explorée', color: '#44aaff' },
    { type: 'RESOURCE_COLLECTED', label: 'Ressource collectée', color: '#ffaa44' },
    { type: 'TILE_COLLECTED', label: 'Tuile collectée', color: '#aa44ff' },
    { type: 'INVENTORY_FULL', label: 'Inventaire plein', color: '#ff44aa' },
    { type: 'REFUEL_COMPLETE', label: 'Ravitaillement terminé', color: '#44ffaa' },
    { type: 'UNLOAD_COMPLETE', label: 'Déchargement terminé', color: '#aaff44' },
    { type: 'REPAIR_COMPLETE', label: 'Réparation terminée', color: '#ffaaaa' },
    { type: 'MAINTENANCE_COMPLETE', label: 'Maintenance terminée', color: '#aaffaa' },
    { type: 'IDLE_TIMEOUT', label: 'Timeout d\'inactivité', color: '#aaaaff' }
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      background: 'rgba(30,30,40,0.95)',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: 10,
      boxShadow: '0 2px 12px #0008',
      zIndex: 2000,
      fontFamily: 'monospace',
      maxWidth: 300,
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div style={{fontWeight: 'bold', marginBottom: 8, borderBottom: '1px solid #aaa', paddingBottom: 4}}>
        FSM Central HUD
      </div>
      
      {/* Sélecteur de bot */}
      <div style={{marginBottom: 12}}>
        <div style={{marginBottom: 4, color: '#aaa'}}>Bot sélectionné:</div>
        <select 
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: 4
          }}
        >
          {safeAllBots.map(botId => (
            <option key={botId} value={botId}>
              {botId}
            </option>
          ))}
        </select>
        <div style={{display: 'flex', gap: '8px', marginTop: 8}}>
          <button 
            onClick={handleAddBot}
            style={{
              flex: 1,
              padding: '4px 8px',
              backgroundColor: '#225522',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            + Ajouter bot
          </button>
          <button 
            onClick={handleRemoveBot}
            disabled={selectedBot === 'main'}
            style={{
              flex: 1,
              padding: '4px 8px',
              backgroundColor: selectedBot === 'main' ? '#333' : '#552222',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: selectedBot === 'main' ? 'not-allowed' : 'pointer',
              opacity: selectedBot === 'main' ? 0.6 : 1
            }}
          >
            - Supprimer
          </button>
        </div>
      </div>
      
      <div style={{margin: '12px 0'}}>
        <div style={{marginBottom: 4, color: '#aaa'}}>État courant:</div>
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 8px',
          borderRadius: 4,
          fontWeight: 'bold',
          wordBreak: 'break-word'
        }}>
          {formatFSMStateValue(safeFsmState.value)}
        </div>
      </div>
      
      <div style={{marginTop: 16, marginBottom: 8, borderBottom: '1px solid #aaa', paddingBottom: 4}}>
        Événements disponibles:
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '8px',
        marginTop: 12
      }}>
        {events.map((event) => (
          <button
            key={event.type}
            style={{
              padding: '8px 12px',
              borderRadius: 5,
              border: 'none',
              background: event.color,
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.9em',
              fontWeight: 'bold',
            }}
            onClick={() => safeSend({ type: event.type })}
          >
            {event.label}
          </button>
        ))}
      </div>
    </div>
  );
}
