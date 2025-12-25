import React from 'react';

import useXFSMStore from '../stores/useXFSMStore';
import type { FSMContext } from '../types/fsm.d';

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

  // Debug: log snapshot structure on first mount
  React.useEffect(() => {
    const snapshot = botStates['bot-0'];
    if (snapshot) {
      console.log('🔍 FSMVisualization - Snapshot structure:', {
        hasValue: 'value' in snapshot,
        hasContext: 'context' in snapshot,
        hasStatus: 'status' in snapshot,
        keys: Object.keys(snapshot),
        snapshot,
      });
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
        ...prev.slice(0, 9),
      ];
      return newLog;
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
            <tr>
              <td>Position:</td>
              <td style={styles.statValue} colSpan={2}>
                ({ctx?.vehicle?.position?.x?.toFixed(1) || 0}, {ctx?.vehicle?.position?.z?.toFixed(1) || 0})
              </td>
            </tr>
          </tbody>
        </table>
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
              <td>Position:</td>
              <td style={styles.statValue}>
                ({ctx?.droneFleet?.drones?.explorer?.position?.x?.toFixed(1) || 0},{' '}
                {ctx?.droneFleet?.drones?.explorer?.position?.z?.toFixed(1) || 0})
              </td>
            </tr>
            <tr>
              <td>Active:</td>
              <td style={styles.statValue}>{ctx?.droneFleet?.drones?.explorer?.isActive ? '✅' : '❌'}</td>
            </tr>
          </tbody>
        </table>
      </section>

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
          <span style={getFlowStyle('initializing', currentState)}>INIT</span>
          <span style={styles.arrow}>→</span>
          <span style={getFlowStyle('evaluating', currentState)}>EVAL</span>
          <span style={styles.arrow}>→</span>
          <span style={getFlowStyle('exploring', currentState)}>EXPLORE</span>
          <span style={styles.arrow}>→</span>
          <span style={getFlowStyle('collecting', currentState)}>COLLECT</span>
          <span style={styles.arrow}>→</span>
          <span style={getFlowStyle('maintaining', currentState)}>MAINTAIN</span>
          <span style={styles.arrow}>→</span>
          <span style={getFlowStyle('evaluating', currentState)}>EVAL</span>
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
              <td>Exploration Count:</td>
              <td style={styles.statValue}>{ctx?.explorationCount || 0}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* EVENT LOG */}
      <section style={styles.section}>
        <h3>📜 Event Log (Last 10)</h3>
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
};
