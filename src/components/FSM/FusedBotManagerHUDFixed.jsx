import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useFSM } from '../../hooks/useFSM';
import fsmLogger from '../../logger/fsmLogger.js';

// Styles (conservés tels quels)
const hudStyles = {
  container: {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    minWidth: '320px',
    zIndex: 1000,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  },
  
  // ... (tous les autres styles conservés)
  header: {
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  },
  
  title: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: '0 0 5px 0',
  },
  
  subtitle: {
    fontSize: '10px',
    color: '#888',
    margin: 0,
  },
  
  section: {
    marginBottom: '12px',
    padding: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#2196F3',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  controls: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  
  button: {
    padding: '4px 8px',
    backgroundColor: '#333',
    border: '1px solid #555',
    borderRadius: '3px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '10px',
    transition: 'all 0.2s',
  },
  
  buttonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  
  buttonDanger: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4px',
    fontSize: '10px',
  },
  
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '2px 0',
  },
  
  statLabel: {
    color: '#bbb',
  },
  
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  botList: {
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  botItem: {
    padding: '4px 6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '9px',
  },
  
  botHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  
  botId: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  
  botState: {
    color: '#2196F3',
    fontSize: '8px',
  },
  
  botDetails: {
    color: '#888',
    fontSize: '8px',
    lineHeight: '1.2',
  },
  
  expandedInfo: {
    marginTop: '4px',
    padding: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '2px',
    fontSize: '8px',
  },
  
  errorText: {
    color: '#f44336',
    fontSize: '10px',
    fontStyle: 'italic',
  },
  
  successText: {
    color: '#4CAF50',
    fontSize: '10px',
  },
  
  debugSection: {
    backgroundColor: 'rgba(33, 33, 33, 0.9)',
    border: '1px solid #444',
  },
  
  logEntry: {
    fontSize: '8px',
    color: '#ccc',
    padding: '2px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  
  logTime: {
    color: '#888',
    marginRight: '4px',
  },
  
  logLevel: {
    fontWeight: 'bold',
    marginRight: '4px',
  },
  
  logMessage: {
    color: '#fff',
  }
};

/**
 * Version corrigée du FusedBotManagerHUD qui évite les problèmes de boucles infinies
 * en utilisant le hook useFSM stable au lieu de sélecteurs Zustand directs.
 */
const FusedBotManagerHUDFixed = () => {
  fsmLogger.info('[FusedBotManagerHUDFixed] Rendering component');
  
  // État local pour le debug et les statistiques
  const [botStates, setBotStates] = useState({});
  const [debugMode, setDebugMode] = useState(false);
  const [expandedBots, setExpandedBots] = useState(new Set());

  // Hook FSM stable (remplace tous les sélecteurs Zustand problématiques)
  const {
    botIds = [],
    isSystemRunning = false,
    addBot,
    removeBot,
    startSystem,
    stopSystem,
    toggleSystem,
    getBotCount,
    updateBotStatesSnapshot
  } = useFSM();

  // Statistiques dérivées de manière stable
  const stats = useMemo(() => {
    const activeBots = botIds.length;
    const totalStates = Object.keys(botStates).length;
    
    return {
      activeBots,
      totalStates,
      systemStatus: isSystemRunning ? 'Running' : 'Stopped',
      memoryUsage: `${totalStates * 0.1}MB` // Estimation
    };
  }, [botIds.length, Object.keys(botStates).length, isSystemRunning]);

  // Callback pour mettre à jour l'état d'un bot spécifique (avec deep equality)
  const updateBotState = useCallback((botId, botData) => {
    setBotStates(prev => {
      const prevData = prev[botId];
      // Deep equality simple (JSON.stringify)
      if (prevData && JSON.stringify(prevData) === JSON.stringify(botData)) {
        return prev; // Pas de changement réel
      }
      return {
        ...prev,
        [botId]: botData
      };
    });
  }, []);

  // Effet pour synchroniser les états des bots avec le store FSM
  // IMPORTANT: Ne pas utiliser useCallback([]) ici
  useEffect(() => {
    if (updateBotStatesSnapshot) {
      updateBotStatesSnapshot(botStates);
    }
  }, [botStates, updateBotStatesSnapshot]);

  // Handlers pour les contrôles (sans useCallback([]))
  const handleToggleRunning = useCallback(() => {
    fsmLogger.info('[FusedBotManagerHUDFixed] Toggle system', { isSystemRunning });
    if (toggleSystem) {
      toggleSystem();
    }
  }, [toggleSystem, isSystemRunning]);

  const handleAddBot = useCallback(() => {
    fsmLogger.info('[FusedBotManagerHUDFixed] Add bot', { currentCount: botIds.length });
    if (addBot) {
      addBot();
    }
  }, [addBot, botIds.length]);

  const handleRemoveBot = useCallback(() => {
    fsmLogger.info('[FusedBotManagerHUDFixed] Remove bot', { currentCount: botIds.length });
    if (removeBot) {
      removeBot();
    }
  }, [removeBot, botIds.length]);

  const toggleBotExpansion = useCallback((botId) => {
    setExpandedBots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(botId)) {
        newSet.delete(botId);
      } else {
        newSet.add(botId);
      }
      return newSet;
    });
  }, []);

  const toggleDebugMode = useCallback(() => {
    setDebugMode(prev => !prev);
  }, []);

  // Rendu principal
  return (
    <div style={hudStyles.container}>
      <div style={hudStyles.header}>
        <h3 style={hudStyles.title}>🤖 Fused Bot Manager (Fixed)</h3>
        <p style={hudStyles.subtitle}>Stable FSM Control Panel</p>
      </div>

      {/* Contrôles système */}
      <div style={hudStyles.section}>
        <div style={hudStyles.sectionTitle}>System Controls</div>
        <div style={hudStyles.controls}>
          <button
            style={{
              ...hudStyles.button,
              ...(isSystemRunning ? hudStyles.buttonActive : {})
            }}
            onClick={handleToggleRunning}
          >
            {isSystemRunning ? '⏸️ Stop' : '▶️ Start'}
          </button>
          <button
            style={hudStyles.button}
            onClick={handleAddBot}
          >
            ➕ Add Bot
          </button>
          <button
            style={{
              ...hudStyles.button,
              ...(botIds.length > 0 ? hudStyles.buttonDanger : {})
            }}
            onClick={handleRemoveBot}
            disabled={botIds.length === 0}
          >
            ➖ Remove Bot
          </button>
          <button
            style={{
              ...hudStyles.button,
              ...(debugMode ? hudStyles.buttonActive : {})
            }}
            onClick={toggleDebugMode}
          >
            🐛 Debug
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={hudStyles.section}>
        <div style={hudStyles.sectionTitle}>Statistics</div>
        <div style={hudStyles.stats}>
          <div style={hudStyles.statItem}>
            <span style={hudStyles.statLabel}>Active Bots:</span>
            <span style={hudStyles.statValue}>{stats.activeBots}</span>
          </div>
          <div style={hudStyles.statItem}>
            <span style={hudStyles.statLabel}>System:</span>
            <span style={hudStyles.statValue}>{stats.systemStatus}</span>
          </div>
          <div style={hudStyles.statItem}>
            <span style={hudStyles.statLabel}>States:</span>
            <span style={hudStyles.statValue}>{stats.totalStates}</span>
          </div>
          <div style={hudStyles.statItem}>
            <span style={hudStyles.statLabel}>Memory:</span>
            <span style={hudStyles.statValue}>{stats.memoryUsage}</span>
          </div>
        </div>
      </div>

      {/* Liste des bots */}
      <div style={hudStyles.section}>
        <div style={hudStyles.sectionTitle}>Bot States ({botIds.length})</div>
        <div style={hudStyles.botList}>
          {botIds.length === 0 ? (
            <div style={hudStyles.errorText}>No active bots</div>
          ) : (
            botIds.map(botId => {
              const botData = botStates[botId];
              const isExpanded = expandedBots.has(botId);
              
              return (
                <div key={botId} style={hudStyles.botItem}>
                  <div 
                    style={hudStyles.botHeader}
                    onClick={() => toggleBotExpansion(botId)}
                  >
                    <span style={hudStyles.botId}>{botId}</span>
                    <span style={hudStyles.botState}>
                      {botData?.state || 'Unknown'}
                    </span>
                  </div>
                  
                  {isExpanded && botData && (
                    <div style={hudStyles.expandedInfo}>
                      <div>Position: {JSON.stringify(botData.position || {})}</div>
                      <div>Resources: {JSON.stringify(botData.resources || {})}</div>
                      <div>Last Update: {botData.lastUpdate || 'Never'}</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Panneau de debug */}
      {debugMode && (
        <div style={{...hudStyles.section, ...hudStyles.debugSection}}>
          <div style={hudStyles.sectionTitle}>Debug Information</div>
          <div style={hudStyles.logEntry}>
            <span style={hudStyles.logTime}>{new Date().toLocaleTimeString()}</span>
            <span style={hudStyles.logLevel}>INFO</span>
            <span style={hudStyles.logMessage}>
              Component rendered with {botIds.length} bots, system {isSystemRunning ? 'running' : 'stopped'}
            </span>
          </div>
          <div style={hudStyles.logEntry}>
            <span style={hudStyles.logTime}>{new Date().toLocaleTimeString()}</span>
            <span style={hudStyles.logLevel}>DEBUG</span>
            <span style={hudStyles.logMessage}>
              useFSM hook providing stable API without infinite loops
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FusedBotManagerHUDFixed;
