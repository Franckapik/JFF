import React, { useState, useMemo, useEffect } from 'react';
import { useXFSM } from '../../hooks/useXFSM';
import { machine as fsmBotMachine } from '../../ai/fsm/machine/machine.xstate';

/**
 * Panneau de simulation XState dynamique qui s'adapte automatiquement à la machine
 * Extrait automatiquement les événements, guards et actions de la machine existante
 */
const XStateSimulationPanel = ({ botId = 'bot-0' }) => {
  const { fsmState, context, send, addBot } = useXFSM(botId);

  // Extraction dynamique COMPLÈTE des éléments de la machine XState
  const machineConfig = useMemo(() => {
    const machine = fsmBotMachine;
    
    // Extraire tous les événements depuis les transitions (récursif pour tous les sous-états)
    const extractEventsFromStates = (states, events = new Set()) => {
      Object.values(states).forEach(state => {
        // Événements au niveau de l'état
        if (state.on) {
          Object.keys(state.on).forEach(event => events.add(event));
        }
        // Récursion dans les sous-états
        if (state.states) {
          extractEventsFromStates(state.states, events);
        }
      });
      return events;
    };

    // Extraire tous les guards depuis les transitions (récursif)
    const extractGuardsFromStates = (states, guards = new Set()) => {
      Object.values(states).forEach(state => {
        if (state.on) {
          Object.values(state.on).forEach(transition => {
            if (Array.isArray(transition)) {
              transition.forEach(t => {
                if (t.guard) guards.add(t.guard);
                if (t.cond) guards.add(t.cond); // Support legacy cond
              });
            } else if (transition) {
              if (transition.guard) guards.add(transition.guard);
              if (transition.cond) guards.add(transition.cond); // Support legacy cond
            }
          });
        }
        if (state.states) {
          extractGuardsFromStates(state.states, guards);
        }
      });
      return guards;
    };

    // Extraire toutes les actions depuis les transitions et les états (récursif)
    const extractActionsFromStates = (states, actions = new Set()) => {
      Object.values(states).forEach(state => {
        // Actions d'entrée et de sortie
        if (state.entry) {
          if (Array.isArray(state.entry)) {
            state.entry.forEach(action => actions.add(action));
          } else {
            actions.add(state.entry);
          }
        }
        if (state.exit) {
          if (Array.isArray(state.exit)) {
            state.exit.forEach(action => actions.add(action));
          } else {
            actions.add(state.exit);
          }
        }
        
        // Actions des transitions
        if (state.on) {
          Object.values(state.on).forEach(transition => {
            if (Array.isArray(transition)) {
              transition.forEach(t => {
                if (t.actions) {
                  if (Array.isArray(t.actions)) {
                    t.actions.forEach(action => actions.add(action));
                  } else {
                    actions.add(t.actions);
                  }
                }
              });
            } else if (transition && transition.actions) {
              if (Array.isArray(transition.actions)) {
                transition.actions.forEach(action => actions.add(action));
              } else {
                actions.add(transition.actions);
              }
            }
          });
        }
        
        // Récursion dans les sous-états
        if (state.states) {
          extractActionsFromStates(state.states, actions);
        }
      });
      return actions;
    };

    // Extraire tous les états et sous-états (récursif)
    const extractAllStates = (states, prefix = '', allStates = new Set()) => {
      Object.keys(states).forEach(stateName => {
        const fullStateName = prefix ? `${prefix}.${stateName}` : stateName;
        allStates.add(fullStateName);
        
        if (states[stateName].states) {
          extractAllStates(states[stateName].states, fullStateName, allStates);
        }
      });
      return allStates;
    };

    // Extraction complète
    const events = Array.from(extractEventsFromStates(machine.config.states));
    const extractedGuards = Array.from(extractGuardsFromStates(machine.config.states));
    const extractedActions = Array.from(extractActionsFromStates(machine.config.states));
    const allStates = Array.from(extractAllStates(machine.config.states));

    // Combiner avec les guards et actions des implementations
    const implementationGuards = Object.keys(machine.implementations?.guards || {});
    const implementationActions = Object.keys(machine.implementations?.actions || {});

    const allGuards = [...new Set([...extractedGuards, ...implementationGuards])];
    const allActions = [...new Set([...extractedActions, ...implementationActions])];

    return {
      events: events.sort(),
      guards: allGuards.filter(g => g).sort(),
      actions: allActions.filter(a => a).sort(),
      states: allStates.sort()
    };
  }, []);

  // Contexte simulé pour les tests (adapté à la nouvelle machine)
  const [simulatedContext, setSimulatedContext] = useState({
    energy: 10,
    cargo: 1,
    needsMaintenance: false,
  });

  // Fonction pour envoyer des événements avec contexte simulé
  const sendEventWithContext = (eventType, payload = {}) => {
    // Log l'envoi d'événement pour debug
    if (window && window.fsmLogger) {
      window.fsmLogger.event && window.fsmLogger.event(`[XStateSimulationPanel] sendEventWithContext: ${eventType}`, { ...simulatedContext });
    } else if (typeof console !== 'undefined') {
      console.log('[XStateSimulationPanel] sendEventWithContext:', eventType, simulatedContext);
    }
    send({ type: eventType, ...simulatedContext, ...payload });
  };

  // Helpers pour sliders/checkbox
  const updateSimulatedValue = (key, value) => {
    setSimulatedContext(prev => ({ ...prev, [key]: value }));
  };

  const getCurrentState = () => {
    if (typeof fsmState.value === 'string') {
      return fsmState.value;
    }
    if (typeof fsmState.value === 'object') {
      const mainState = Object.keys(fsmState.value)[0];
      const subState = fsmState.value[mainState];
      return `${mainState}.${subState}`;
    }
    return JSON.stringify(fsmState.value);
  };

  // Affichage et forçage des guards (liés au contexte simulé)
  const [forcedGuards, setForcedGuards] = useState(() => {
    const initialGuards = {};
    machineConfig.guards.forEach(guardName => {
      initialGuards[guardName] = false;
    });
    return initialGuards;
  });

  // Synchroniser les guards avec le contexte simulé
  useEffect(() => {
    setForcedGuards({
      shouldExplore: simulatedContext.energy > 0,
      shouldCollect: simulatedContext.cargo > 0,
      shouldMaintain: simulatedContext.needsMaintenance === true
    });
  }, [simulatedContext]);

  return (
    <div 
      className="xstate-simulation-panel"
      style={{ 
        position: 'fixed', 
        top: 20, 
        right: 20, 
        background: 'rgba(0,0,0,0.9)', 
        color: 'white', 
        padding: 20, 
        borderRadius: 8,
        width: 350,
        maxHeight: '90vh',
        overflow: 'auto',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '12px'
      }}
    >
      <h3>🎮 XState Simulation Panel</h3>
      
      {/* État actuel */}
      <div style={{ marginBottom: 15, padding: 10, background: 'rgba(0,100,0,0.3)' }}>
        <strong>État actuel:</strong> {getCurrentState()}
        <br />
        <strong>Bot ID:</strong> {botId}
      </div>

      {/* Contrôle du contexte simulé */}
      <div style={{ marginBottom: 15 }}>
        <h4>⚙️ Contexte Simulé</h4>
        <div style={{ fontSize: '10px' }}>
          <div>
            Energy: 
            <input 
              type="range" 
              min="0" 
              max="20" 
              value={simulatedContext.energy}
              onChange={(e) => updateSimulatedValue('energy', parseInt(e.target.value))}
            />
            {simulatedContext.energy}
          </div>
          <div>
            Cargo: 
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={simulatedContext.cargo}
              onChange={(e) => updateSimulatedValue('cargo', parseInt(e.target.value))}
            />
            {simulatedContext.cargo}
          </div>
          <div>
            <label>
              <input 
                type="checkbox" 
                checked={simulatedContext.needsMaintenance}
                onChange={(e) => updateSimulatedValue('needsMaintenance', e.target.checked)}
              />
              Needs Maintenance
            </label>
          </div>
        </div>
      </div>

      {/* Boutons d'événements dynamiques */}
      <div style={{ marginBottom: 15 }}>
        <h4>📡 Événements FSM ({machineConfig.events.length})</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, fontSize: '10px' }}>
          {machineConfig.events.map(eventType => (
            <button 
              key={eventType}
              onClick={() => sendEventWithContext(eventType)}
              title={`Envoyer l'événement ${eventType}`}
            >
              {eventType}
            </button>
          ))}
        </div>
      </div>

      {/* Actions de gestion des bots */}
      <div style={{ marginBottom: 15 }}>
        <h4>🤖 Gestion Bots</h4>
        <button 
          onClick={() => addBot('bot-1')}
          style={{ marginRight: 5, fontSize: '10px' }}
        >
          Add Bot-1
        </button>
        <button 
          onClick={() => addBot('bot-2')}
          style={{ fontSize: '10px' }}
        >
          Add Bot-2
        </button>
      </div>

      {/* Contrôle des Guards */}
      <div style={{ marginBottom: 15 }}>
        <h4>🛡️ Guards ({machineConfig.guards.length})</h4>
        {machineConfig.guards.length > 0 ? (
          Object.entries(forcedGuards).map(([guardName, isActive]) => (
            <div key={guardName} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
              <span title={guardName}>{guardName}:</span>
              <span style={{ color: isActive ? '#4CAF50' : '#f44336', fontWeight: 'bold' }}>{isActive ? 'TRUE' : 'FALSE'}</span>
            </div>
          ))
        ) : (
          <div style={{ opacity: 0.6, fontSize: '10px' }}>Aucun guard détecté</div>
        )}
      </div>

      {/* Informations de debug */}
      <div style={{ fontSize: '10px', opacity: 0.7 }}>
        <h4>🔍 Machine Info</h4>
        
        {/* Actions disponibles */}
        <div style={{ marginBottom: 10 }}>
          <strong>Actions ({machineConfig.actions.length}):</strong>
          <div style={{ fontSize: '9px', maxHeight: 60, overflow: 'auto', background: 'rgba(255,255,255,0.1)', padding: 5, borderRadius: 3 }}>
            {machineConfig.actions.length > 0 ? 
              machineConfig.actions.join(', ') : 
              'Aucune action détectée'
            }
          </div>
        </div>

        {/* États disponibles */}
        <div style={{ marginBottom: 10 }}>
          <strong>États ({machineConfig.states.length}):</strong>
          <div style={{ fontSize: '9px', maxHeight: 60, overflow: 'auto', background: 'rgba(255,255,255,0.1)', padding: 5, borderRadius: 3 }}>
            {machineConfig.states.join(', ')}
          </div>
        </div>

        {/* Contexte actuel */}
        <div>
          <strong>Contexte FSM:</strong>
          <pre style={{ fontSize: '8px', maxHeight: 80, overflow: 'auto', background: 'rgba(255,255,255,0.1)', padding: 5, borderRadius: 3 }}>
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      </div>

      {/* Styles globaux pour le panneau */}
      <style>{`
        .xstate-simulation-panel button {
          background: #2196F3;
          color: white;
          border: none;
          padding: 4px 8px;
          margin: 2px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 10px;
        }
        .xstate-simulation-panel button:hover {
          background: #1976D2;
        }
        .xstate-simulation-panel input[type="range"] {
          width: 60px;
          margin: 0 5px;
        }
        .xstate-simulation-panel input[type="checkbox"] {
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default XStateSimulationPanel;
