import React from 'react';

import useXFSMStore from '../stores/useXFSMStore';
import type { FSMContext } from '../types/fsm.d';
import PositionDisplay from './PositionDisplay';
import TileMatrix from './TileMatrix';

/**
 * Type guard pour vérifier si un snapshot est un XState snapshot valide
 */
function isValidSnapshot(snapshot: unknown): snapshot is {
  value: string | object;
  context: FSMContext;
  status: string;
} {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'value' in snapshot &&
    'context' in snapshot &&
    'status' in snapshot
  );
}

/**
 * FSM Visualization - Affichage ultra-basique du cycle XState
 * 
 * Connecté à Zustand (useXFSMStore) qui écoute les snapshots XState
 * Affiche l'état FSM et contexte en temps réel
 */
export default function FSMVisualization() {
  const botStates = useXFSMStore((state) => state.botStates);
  const activeBots = useXFSMStore((state) => state.activeBots);

  // États pour le log des transitions
  const [eventLog, setEventLog] = React.useState<Array<{ time: string; event: string; state: string }>>([]);
  const [cycleStats, setCycleStats] = React.useState({
    tilesExplored: 0,
    resourcesCollected: 0,
    repairsCompleted: 0,
    refuelsCompleted: 0,
  });
  const [stateVisitCounts, setStateVisitCounts] = React.useState<Record<string, number>>({
    initializing: 0,
    evaluating: 0,
    exploring: 0,
    drone_deploying: 0,
    drone_scanning: 0,
    drone_returning: 0,
    drone_docked: 0,
    collecting: 0,
    ship_moving_to_tile: 0,
    ship_collecting: 0,
    ship_returning: 0,
    maintaining: 0,
    refueling: 0,
    repairing: 0,
    depositing: 0,
  });

  // Debug: log essential state info on change
  React.useEffect(() => {
    const snapshot = botStates['bot-0'];
    if (snapshot && isValidSnapshot(snapshot)) {
      const state = typeof snapshot.value === 'string' ? snapshot.value : JSON.stringify(snapshot.value);
      console.log(`🔄 [FSM] State: ${state} | Status: ${snapshot.status}`);
    }
  }, [botStates]);

  // Écouter les changements d'état du bot principal
  React.useEffect(() => {
    const botSnapshot = botStates['bot-0'];
    if (!botSnapshot || !isValidSnapshot(botSnapshot)) return;

    const value = botSnapshot.value;

    const currentState = typeof value === 'string' ? value : JSON.stringify(value);

    // Ajouter au log des événements
    setEventLog((prev) => {
      const newLog = [
        {
          time: new Date().toLocaleTimeString(),
          event: 'STATE_CHANGE',
          state: currentState,
        },
        ...prev.slice(0, 19),
      ];
      return newLog;
    });

    // Incrémenter le compteur de visite pour le state principal et les substates
    setStateVisitCounts((prev) => {
      const allStates = [
        'initializing', 'evaluating', 'exploring', 'drone_deploying', 'drone_scanning', 'drone_returning', 'drone_docked',
        'collecting', 'ship_moving_to_tile', 'ship_collecting', 'ship_returning',
        'maintaining', 'refueling', 'repairing', 'depositing'
      ];
      const updated = { ...prev };
      for (const state of allStates) {
        if (currentState.includes(state)) {
          updated[state] = prev[state] + 1;
        }
      }
      return updated;
    });

    // Mettre à jour les stats
    const ctx = botSnapshot.context;
    if (ctx) {
      setCycleStats({
        tilesExplored: ctx.memory?.stats?.tilesExplored || 0,
        resourcesCollected: ctx.vehicle?.resources?.total || 0,
        repairsCompleted: 0,
        refuelsCompleted: 0,
      });
    }
  }, [botStates]);

  const botSnapshot = botStates['bot-0'];
  if (!botSnapshot || !isValidSnapshot(botSnapshot)) {
    return (
      <div style={styles.container}>
        <h2>🔴 FSM Not Running</h2>
        <p>Waiting for bot-0 to start...</p>
      </div>
    );
  }

  const value = botSnapshot.value;
  const context = botSnapshot.context;

  const currentState = typeof value === 'string' ? value : JSON.stringify(value);

  const ctx = context;

  const getStateColor = (state: string) => {
    if (state.includes('initializing')) return '#ff9800';
    if (state.includes('evaluating')) return '#2196f3';
    if (state.includes('exploring')) return '#4caf50';
    if (state.includes('collecting')) return '#f44336';
    if (state.includes('maintaining')) return '#9c27b0';
    return '#757575';
  };

  return (
    <div style={styles.container}>
      <h1>🤖 FSM Cycle Visualization</h1>
      <p style={{ color: '#999', fontSize: '12px' }}>Connected to XState via Zustand • Real-time updates from bot-0</p>

      {/* CURRENT STATE */}
      <section style={styles.section}>
        <h2 style={{ color: getStateColor(currentState) }}>
          📊 Current State: <code style={{ color: getStateColor(currentState) }}>{currentState}</code>
        </h2>
        <p>Status: {botSnapshot.status}</p>
      </section>

      {/* SHIP STATUS */}
      <section style={styles.section}>
        <h3>🚢 Ship Status</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>Fuel:</td>
              <td style={styles.statValue}>{ctx?.vehicle?.fuel || 0}/100</td>
              <td>{renderBar((ctx?.vehicle?.fuel || 0) / 100)}</td>
            </tr>
            <tr>
              <td>Damage:</td>
              <td style={styles.statValue}>{ctx?.vehicle?.damage || 0}</td>
              <td>{renderBar((ctx?.vehicle?.damage || 0) / 100)}</td>
            </tr>
            <tr>
              <td>Resources:</td>
              <td style={styles.statValue}>
                {ctx?.vehicle?.resources?.total || 0}/{ctx?.vehicle?.maxCapacity?.total || 1000}
              </td>
              <td>{renderBar((ctx?.vehicle?.resources?.total || 0) / (ctx?.vehicle?.maxCapacity?.total || 1000))}</td>
            </tr>
          </tbody>
        </table>
        <PositionDisplay
          title="Ship Position"
          worldPosition={ctx?.vehicle?.position}
          gridCoord={ctx?.vehicle?.position?.coord}
        />
      </section>

      {/* DRONE STATUS */}
      <section style={styles.section}>
        <h3>🚁 Drone Status</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>Type:</td>
              <td style={styles.statValue}>explorer</td>
            </tr>
            <tr>
              <td>Visual State:</td>
              <td style={styles.statValue}>{ctx?.droneFleet?.drones?.explorer?.visualState || 'uninitialized'}</td>
            </tr>
            <tr>
              <td>Active:</td>
              <td style={styles.statValue}>{ctx?.droneFleet?.drones?.explorer?.isActive ? '✅' : '❌'}</td>
            </tr>
          </tbody>
        </table>
        <PositionDisplay
          title="Drone Position"
          worldPosition={ctx?.droneFleet?.drones?.explorer?.position}
          gridCoord={undefined}
        />
      </section>

      {/* TILE MATRIX */}
      <TileMatrix />

      {/* CYCLE STATISTICS */}
      <section style={styles.section}>
        <h3>📈 Cycle Statistics</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>🗺️ Tiles Explored:</td>
              <td style={styles.statValue}>{cycleStats.tilesExplored}</td>
            </tr>
            <tr>
              <td>📦 Resources Collected:</td>
              <td style={styles.statValue}>{cycleStats.resourcesCollected}</td>
            </tr>
            <tr>
              <td>🔧 Repairs Completed:</td>
              <td style={styles.statValue}>{cycleStats.repairsCompleted}</td>
            </tr>
            <tr>
              <td>⛽ Refuels Completed:</td>
              <td style={styles.statValue}>{cycleStats.refuelsCompleted}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* STATE MACHINE CYCLE */}
      <section style={styles.section}>
        <h3>🔄 FSM Cycle Flow</h3>
        <div style={styles.cycleFlow}>
          {/* Initializing */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('initializing', currentState)}>
              INIT{stateVisitCounts.initializing > 0 && <span style={styles.badge}>{stateVisitCounts.initializing}</span>}
            </span>
          </div>

          <span style={styles.arrow}>→</span>

          {/* Evaluating */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('evaluating', currentState)}>
              EVAL{stateVisitCounts.evaluating > 0 && <span style={styles.badge}>{stateVisitCounts.evaluating}</span>}
            </span>
          </div>

          <span style={styles.arrow}>→</span>

          {/* Exploring with substates */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('exploring', currentState)}>
              EXPLORE{stateVisitCounts.exploring > 0 && <span style={styles.badge}>{stateVisitCounts.exploring}</span>}
            </span>
            {renderSubstates(currentState, [
              { key: 'drone_deploying', label: '🚁 Deploying' },
              { key: 'drone_scanning', label: '📡 Scanning' },
              { key: 'drone_returning', label: '🔙 Returning' },
              { key: 'drone_docked', label: '⚓ Docked' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Collecting with substates */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('collecting', currentState)}>
              COLLECT{stateVisitCounts.collecting > 0 && <span style={styles.badge}>{stateVisitCounts.collecting}</span>}
            </span>
            {renderSubstates(currentState, [
              { key: 'ship_moving_to_tile', label: '🚢 Moving' },
              { key: 'ship_collecting', label: '📦 Collecting' },
              { key: 'ship_returning', label: '🔙 Returning' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Maintaining with substates */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('maintaining', currentState)}>
              MAINTAIN{stateVisitCounts.maintaining > 0 && <span style={styles.badge}>{stateVisitCounts.maintaining}</span>}
            </span>
            {renderSubstates(currentState, [
              { key: 'refueling', label: '⛽ Refuel' },
              { key: 'repairing', label: '🔧 Repair' },
              { key: 'depositing', label: '📤 Deposit' }
            ], stateVisitCounts)}
          </div>
        </div>
      </section>

      {/* CONTEXT SNAPSHOT */}
      <section style={styles.section}>
        <h3>🔍 Context Memory</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>Entity ID:</td>
              <td style={styles.statValue}>{ctx?.entityId || 'N/A'}</td>
            </tr>
            <tr>
              <td>FSM State:</td>
              <td style={styles.statValue}>{ctx?.fsmState || 'N/A'}</td>
            </tr>
            <tr>
              <td>Last Action:</td>
              <td style={styles.statValue}>{ctx?.lastAction || 'N/A'}</td>
            </tr>
            <tr>
              <td>Known Tiles:</td>
              <td style={styles.statValue}>{ctx?.memory?.knownTiles?.length || 0}</td>
            </tr>
            <tr>
              <td>Tiles Explored in Cycle:</td>
              <td style={styles.statValue}>{ctx?.memory?.stats?.tilesExploredInCycle || 0}</td>
            </tr>
            <tr>
              <td>Total Tiles Explored:</td>
              <td style={styles.statValue}>{ctx?.memory?.stats?.tilesExplored || 0}</td>
            </tr>
            <tr>
              <td>Exploration Count:</td>
              <td style={styles.statValue}>{ctx?.explorationCount || 0}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* EVENT LOG */}
      <section style={styles.section}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ margin: 0 }}>📜 Event Log (Last 20)</h3>
          <button
            onClick={() => {
              const logsText = eventLog.map(log => `${log.time} → ${log.state}`).join('\n');
              navigator.clipboard.writeText(logsText).then(() => {
                // Feedback visuel temporaire
                const button = event.target as HTMLButtonElement;
                const originalText = button.innerHTML;
                button.innerHTML = '✅';
                setTimeout(() => { button.innerHTML = originalText; }, 1000);
              });
            }}
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666'
            }}
            title="Copy logs to clipboard"
          >
            📋
          </button>
        </div>
        <div style={styles.eventLog}>
          {eventLog.length === 0 ? (
            <p style={{ color: '#999' }}>Waiting for state changes...</p>
          ) : (
            <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px' }}>
              {eventLog.map((log, i) => (
                <li key={i} style={{ color: '#666', marginBottom: '4px' }}>
                  <span style={{ color: '#999' }}>{log.time}</span> → <code>{log.state}</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* DEBUG INFO */}
      <section style={styles.section}>
        <h3>🐛 Debug Info</h3>
        <p style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>
          Active Bots: {activeBots.join(', ')} | Snapshot Status: {botSnapshot.status} | Context Size:{' '}
          {JSON.stringify(ctx).length} bytes
        </p>
      </section>
    </div>
  );
}

// ============================================================
// UTILITIES
// ============================================================

function renderBar(percentage: number) {
  const filled = Math.round(percentage * 10);
  const empty = 10 - filled;
  return (
    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
      [{Array(filled).fill('█').join('')}
      {Array(empty).fill('░').join('')}] {Math.round(percentage * 100)}%
    </span>
  );
}

function getFlowStyle(stateKey: string, currentState: string) {
  const isActive = currentState.includes(stateKey);
  return {
    display: 'inline-block',
    padding: '4px 8px',
    margin: '0 4px',
    borderRadius: '4px',
    backgroundColor: isActive ? '#4caf50' : '#f5f5f5',
    color: isActive ? 'white' : '#666',
    fontWeight: isActive ? 'bold' : 'normal',
    fontSize: '12px',
    border: isActive ? '2px solid #45a049' : '1px solid #ddd',
  } as React.CSSProperties;
}

/**
 * Render substates in a hierarchical display below parent state
 */
function renderSubstates(
  currentState: string, 
  substates: Array<{ key: string; label: string }>,
  visitCounts?: Record<string, number>
): React.ReactNode {
  return (
    <div style={styles.substatesContainer}>
      {substates.map((substate) => {
        const isActive = currentState.includes(substate.key);
        const count = visitCounts?.[substate.key] || 0;
        return (
          <div
            key={substate.key}
            style={{
              ...styles.substate,
              backgroundColor: isActive ? '#2196f3' : '#e3f2fd',
              color: isActive ? 'white' : '#666',
              fontWeight: isActive ? 'bold' : 'normal',
              border: isActive ? '2px solid #1976d2' : '1px solid #90caf9',
              position: 'relative' as const,
            }}
          >
            {substate.label}
            {count > 0 && (
              <span style={styles.substateBadge}>{count}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
    color: '#333',
  } as React.CSSProperties,

  section: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #2196f3',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },

  eventLog: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    maxHeight: '150px',
    overflowY: 'auto' as const,
  } as React.CSSProperties,

  cycleFlow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: '10px 0',
  } as React.CSSProperties,

  stateBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  substatesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
    padding: '8px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    minWidth: '120px',
  } as React.CSSProperties,

  substate: {
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '10px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  arrow: {
    color: '#ccc',
    fontWeight: 'bold',
    margin: '0 4px',
  } as React.CSSProperties,

  statValue: {
    fontWeight: 'bold',
    color: '#2196f3',
    fontFamily: 'monospace',
  } as React.CSSProperties,

  badge: {
    display: 'inline-block',
    marginLeft: '4px',
    padding: '1px 6px',
    fontSize: '10px',
    fontWeight: 'bold',
    backgroundColor: '#ff9800',
    color: 'white',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  } as React.CSSProperties,

  substateBadge: {
    display: 'inline-block',
    marginLeft: '4px',
    padding: '1px 5px',
    fontSize: '8px',
    fontWeight: 'bold',
    backgroundColor: '#ff9800',
    color: 'white',
    borderRadius: '8px',
    minWidth: '14px',
    textAlign: 'center',
  } as React.CSSProperties,
};
