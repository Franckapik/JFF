import React, { useState, useMemo, useEffect } from 'react';
import { useXFSM } from '../../hooks/useXFSM';
import { machineX, allGuards as importedAllGuards, guardsByCategory } from '../../ai/fsm/machineX';
import { createMachineContext } from '../../ai/fsm/machine/context/initialContext';

/**
 * Panneau de simulation XState dynamique qui s'adapte automatiquement à la machine
 * Extrait automatiquement les événements, guards et actions de la machine existante
 */
const XStateSimulationPanel = ({ botId = 'bot-0' }) => {
  const [error, setError] = useState(null);
  
  // Protection contre les erreurs de synchronisation Zustand/React
  let fsmState, context, send, addBot;
  try {
    const hookResult = useXFSM(botId);
    fsmState = hookResult.fsmState;
    context = hookResult.context;
    send = hookResult.send;
    addBot = hookResult.addBot;
    
    // Réinitialiser l'erreur si le hook fonctionne maintenant
    if (error) setError(null);
  } catch (err) {
    console.error('[XStateSimulationPanel] Error with useXFSM hook:', err);
    setError(err);
    // Valeurs par défaut en cas d'erreur
    fsmState = { value: 'error', context: {} };
    context = {};
    send = () => console.warn('Send function not available due to error');
    addBot = () => console.warn('AddBot function not available due to error');
  }
  
  // Afficher l'erreur si elle persiste
  if (error) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid #ff0000' }}>
        <h3>Hook Error</h3>
        <p>There was an error with the state management. This usually resolves after hot reload.</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  // Extraction dynamique des guards de la machineX
  const allGuards = useMemo(() => {
    // On prend tous les guards exportés (fonctions)
    return importedAllGuards || {};
  }, []);

  // Extraction dynamique COMPLÈTE des éléments de la machine XState
  const machineConfig = useMemo(() => {
    const machine = machineX;
    
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

  // Initialisation du contexte simulé avec la vraie structure
  const getInitialSimContext = () => {
    // On clone le contexte initial pour éviter les effets de bord
    const base = createMachineContext('sim-bot', 'auto');
    // On ne garde que les propriétés utiles à la simulation
    return {
      entityId: base.entityId,
      entityType: base.entityType,
      vehicle: {
        fuel: base.vehicle.fuel,
        damage: base.vehicle.damage,
        currentSpeed: base.vehicle.currentSpeed,
        resources: { ...base.vehicle.resources }
      },
      needsMaintenance: false // à adapter selon vos guards
    };
  };
  const [simulatedContext, setSimulatedContext] = useState(getInitialSimContext());

  // État pour les guards simulés (mode auto/forcé)
  // { guardName: { mode: 'auto'|'forced', value: boolean } }
  const [guardOverrides, setGuardOverrides] = useState({});

  // Fonction pour changer le mode d'un guard
  const setGuardMode = (guardName, mode) => {
    setGuardOverrides(prev => ({
      ...prev,
      [guardName]: {
        ...prev[guardName],
        mode
      }
    }));
  };
  // Fonction pour forcer la valeur d'un guard
  const setGuardForcedValue = (guardName, value) => {
    setGuardOverrides(prev => ({
      ...prev,
      [guardName]: {
        ...prev[guardName],
        value,
        mode: 'forced'
      }
    }));
  };

  // Fonction d'évaluation réelle d'un guard
  const evaluateGuard = (guardName) => {
    const guardFn = allGuards[guardName];
    if (typeof guardFn === 'function') {
      try {
        // On simule un event vide ou minimal
        return !!guardFn(simulatedContext, {});
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  // État pour les guards forcés
  const [forcedGuards, setForcedGuards] = useState({
    shouldExplore: true,
    shouldCollect: true,
    shouldMaintain: false
  });

  // Fonction pour mettre à jour les valeurs du contexte simulé
  const updateSimulatedValue = (path, value) => {
    setSimulatedContext(prev => {
      const newContext = { ...prev };
      if (path.startsWith('vehicle.resources.')) {
        const resKey = path.split('.')[2];
        newContext.vehicle = { ...newContext.vehicle, resources: { ...newContext.vehicle.resources, [resKey]: value } };
      } else if (path.startsWith('vehicle.')) {
        const key = path.split('.')[1];
        newContext.vehicle = { ...newContext.vehicle, [key]: value };
      } else {
        newContext[path] = value;
      }
      return newContext;
    });
  };

  // Effet pour logger le contexte au chargement
  useEffect(() => {
    console.log('[XStateSimulationPanel] Mounted for', botId);
    console.log('[XStateSimulationPanel] Initial context:', context);
    console.log('[XStateSimulationPanel] Context properties:', Object.keys(context).length);
  }, []);

  // Effet pour logger les changements de contexte
  useEffect(() => {
    console.log('[XStateSimulationPanel] Context updated for', botId);
    console.log('[XStateSimulationPanel] Context properties:', Object.keys(context).length);
  }, [context, botId]);

  // Affichage des métriques de contexte
  const contextMetrics = useMemo(() => {
    const keys = Object.keys(context);
    const hasEntityId = Boolean(context?.entityId);
    const hasVehicle = Boolean(context?.vehicle);
    const hasMemory = Boolean(context?.memory);
    
    return {
      count: keys.length,
      keysList: keys.slice(0, 5).join(', ') + (keys.length > 5 ? '...' : ''),
      hasEntityId,
      hasVehicle,
      hasMemory,
    };
  }, [context]);

  // Fonction pour envoyer des événements avec contexte simulé
  const sendEventWithContext = (eventType, payload = {}) => {
    // Log l'envoi d'événement pour debug
    console.log('[XStateSimulationPanel] sendEventWithContext:', eventType, { 
      simulatedContext,
      contextSize: Object.keys(context).length,
      hasEntityId: context?.entityId ? true : false 
    });
    
    // Envoyer l'événement avec les données simulées et la charge utile
    const eventData = { 
      type: eventType, 
      ...simulatedContext, 
      ...payload 
    };
    
    if (window && window.fsmLogger) {
      window.fsmLogger.event(`[XStateSimulationPanel] sendEventWithContext: ${eventType}`, eventData);
    } 
    
    send(eventData);
  };

  // Debug helper to check context
  const checkContext = () => {
    const contextSnapshot = {
      context,
      contextPropsCount: Object.keys(context).length,
      simulatedContext,
      botId,
      fsmState,
      hasEntityId: context?.entityId ? true : false,
      snapshotKeysList: Object.keys(fsmState || {}).join(', ')
    };

    console.log("CONTEXTE COMPLET:", contextSnapshot);

    // Essayons de débugger pourquoi le contexte semble vide
    alert(`Contexte:\n- Props: ${contextMetrics.count}\n- EntityId: ${context?.entityId || "manquant"}\n- Entity Type: ${context?.entityType || "manquant"}\n- Keys: ${contextMetrics.keysList}`);
  };

  // Reset context function - creates a fresh context using the initialContext helper
  const resetContext = () => {
    const freshContext = createMachineContext(botId, 'auto');
    console.log('[XStateSimulationPanel] Resetting context with fresh data:', freshContext);
    send({ type: 'RESET_CONTEXT', ...freshContext });
  };
  
  // Helper function to get the current state in string format
  const getCurrentState = () => {
    if (!fsmState) return 'undefined';
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

  // Debug mode - forcer certains états/valeurs
  const [debugMode, setDebugMode] = useState(false);
  const [forcedState, setForcedState] = useState('');

  // Forcer un état spécifique (pour tests)
  const forceState = (state) => {
    setForcedState(state);
    send({ type: 'FORCE_STATE', state });
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <button onClick={checkContext} 
            style={{ background: '#ff9800', color: 'black', fontSize: '8px' }}>
            Debug Context
          </button>
          <button onClick={resetContext} 
            style={{ background: '#e91e63', color: 'white', fontSize: '8px' }}>
            Reset Context
          </button>
        </div>
      </div>

      {/* Info Contexte */}
      <div style={{ marginBottom: 15, padding: 5, background: 'rgba(0,0,100,0.3)', fontSize: '9px' }}>
        <strong>Context Info:</strong> {contextMetrics.count} properties
        <br />
        <span style={{ color: contextMetrics.hasEntityId ? '#4CAF50' : '#f44336' }}>
          {contextMetrics.hasEntityId ? '✓' : '✗'} EntityId
        </span>
        {' | '}
        <span style={{ color: contextMetrics.hasVehicle ? '#4CAF50' : '#f44336' }}>
          {contextMetrics.hasVehicle ? '✓' : '✗'} Vehicle
        </span>
        {' | '}
        <span style={{ color: contextMetrics.hasMemory ? '#4CAF50' : '#f44336' }}>
          {contextMetrics.hasMemory ? '✓' : '✗'} Memory
        </span>
      </div>

      {/* Contrôle du contexte simulé */}
      <div style={{ marginBottom: 15 }}>
        <h4>⚙️ Contexte Simulé</h4>
        <div style={{ fontSize: '10px' }}>
          <div>
            Fuel:
            <input
              type="range"
              min="0"
              max="100"
              value={simulatedContext.vehicle.fuel}
              onChange={e => updateSimulatedValue('vehicle.fuel', parseInt(e.target.value))}
            />
            {simulatedContext.vehicle.fuel}
          </div>
          <div>
            Damage:
            <input
              type="range"
              min="0"
              max="100"
              value={simulatedContext.vehicle.damage}
              onChange={e => updateSimulatedValue('vehicle.damage', parseInt(e.target.value))}
            />
            {simulatedContext.vehicle.damage}
          </div>
          <div>
            Speed:
            <input
              type="range"
              min="0"
              max="10"
              value={simulatedContext.vehicle.currentSpeed}
              onChange={e => updateSimulatedValue('vehicle.currentSpeed', parseFloat(e.target.value))}
            />
            {simulatedContext.vehicle.currentSpeed}
          </div>
          <div>
            <strong>Ressources:</strong>
            <div style={{ marginLeft: 10 }}>
              <span>Food: </span>
              <input
                type="number"
                min="0"
                max="999"
                value={simulatedContext.vehicle.resources.food}
                onChange={e => updateSimulatedValue('vehicle.resources.food', parseInt(e.target.value))}
                style={{ width: 40 }}
              />
              <span> Debris: </span>
              <input
                type="number"
                min="0"
                max="9999"
                value={simulatedContext.vehicle.resources.debris}
                onChange={e => updateSimulatedValue('vehicle.resources.debris', parseInt(e.target.value))}
                style={{ width: 50 }}
              />
              <span> Special: </span>
              <input
                type="number"
                min="0"
                max="99"
                value={simulatedContext.vehicle.resources.special}
                onChange={e => updateSimulatedValue('vehicle.resources.special', parseInt(e.target.value))}
                style={{ width: 30 }}
              />
            </div>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={simulatedContext.needsMaintenance}
                onChange={e => updateSimulatedValue('needsMaintenance', e.target.checked)}
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
        <h4>🛡️ Guards par catégorie</h4>
        {Object.entries(guardsByCategory).map(([category, guardsObj]) => (
          <div key={category} style={{ marginBottom: 8, borderLeft: '3px solid #2196F3', paddingLeft: 8 }}>
            <strong style={{ textTransform: 'capitalize', color: '#2196F3' }}>{category}</strong>
            {Object.keys(guardsObj).length > 0 ? (
              Object.keys(guardsObj).map((guardName) => {
                const override = guardOverrides[guardName] || { mode: 'auto', value: false };
                const isAuto = override.mode !== 'forced';
                const realValue = evaluateGuard(guardName);
                const displayValue = isAuto ? realValue : override.value;
                return (
                  <div key={guardName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '3px 0' }}>
                    <span title={guardName}>{guardName}:</span>
                    <span style={{ color: displayValue ? '#4CAF50' : '#f44336', fontWeight: 'bold', marginRight: 8 }}>{displayValue ? 'TRUE' : 'FALSE'}</span>
                    <label style={{ fontSize: '10px', marginRight: 4 }}>
                      <input
                        type="checkbox"
                        checked={!isAuto}
                        onChange={e => setGuardMode(guardName, e.target.checked ? 'forced' : 'auto')}
                      />
                      Forcer
                    </label>
                    {!isAuto && (
                      <button
                        style={{ fontSize: '10px', background: displayValue ? '#4CAF50' : '#f44336', color: 'white', border: 'none', borderRadius: 3, padding: '2px 6px', marginLeft: 2 }}
                        onClick={() => setGuardForcedValue(guardName, !displayValue)}
                      >
                        {displayValue ? 'TRUE' : 'FALSE'}
                      </button>
                    )}
                    {isAuto && <span style={{ fontSize: '9px', color: '#888', marginLeft: 4 }}>(auto)</span>}
                  </div>
                );
              })
            ) : (
              <div style={{ opacity: 0.6, fontSize: '10px' }}>Aucun guard</div>
            )}
          </div>
        ))}
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
