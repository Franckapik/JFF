import React from 'react';

import { gridToWorld } from '../core/spatial';
import { useTileStore } from '../stores/useTileStore';
import useXFSMStore from '../stores/useXFSMStore';
import type { GridCoordinate } from '../types/coordinates';
import type { FSMContext } from '../types/fsm.d';
import PositionDisplay from './PositionDisplay';
import TileMatrixLayout from './TileMatrixLayout';

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

  // Helper pour convertir GridCoordinate en WorldPosition pour l'affichage
  const coordToWorldPos = React.useCallback((coord: GridCoordinate | null | undefined, spacing = 1.2) => {
    if (!coord) return undefined;
    return gridToWorld(coord, { spacing, defaultY: 0.5 });
  }, []);

  // États pour le log des transitions
  const [eventLog, setEventLog] = React.useState<Array<{ time: string; event: string; state: string }>>([]);
  
  // Statistiques d'exploration unifiées depuis le TileStore (source de vérité unique)
  const tiles = useTileStore((state) => state.tiles);
  const cycleStats = React.useMemo(() => {
    let totalTiles = 0;
    let exploredTiles = 0;
    let collectedTiles = 0;
    let collectedButNotExplored = 0;
    
    Object.values(tiles).forEach((tile) => {
      totalTiles++;
      if (tile.explored === true) exploredTiles++;
      if (tile.collected === true) {
        collectedTiles++;
        if (tile.explored !== true) collectedButNotExplored++;
      }
    });
    
    return {
      tilesExplored: exploredTiles,
      resourcesCollected: collectedTiles,
      totalTiles,
      collectedButNotExplored,
      explorationRate: totalTiles > 0 ? ((exploredTiles / totalTiles) * 100).toFixed(1) : '0.0',
      hasIssue: collectedButNotExplored > 0
    };
  }, [tiles]);
  const [stateVisitCounts, setStateVisitCounts] = React.useState<Record<string, number>>({
    initializing: 0,
    evaluating: 0,
    exploring: 0,
    drone_deploying: 0,
    drone_scanning: 0,
    drone_returning: 0,
    drone_docked: 0,
    drone_destroyed: 0,
    collecting: 0,
    ship_moving_to_tile: 0,
    ship_collecting: 0,
    ship_returning: 0,
    maintaining: 0,
    refueling: 0,
    repairing: 0,
    depositing: 0,
  });
  const [lastDroneDestroyed, setLastDroneDestroyed] = React.useState<{ type: string; time: string } | null>(null);

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
        'initializing', 'evaluating', 'exploring', 'drone_deploying', 'drone_scanning', 'drone_returning', 'drone_docked', 'drone_destroyed',
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

    // Mettre à jour les stats depuis le contexte FSM
    const ctx = botSnapshot.context;
    if (ctx) {
      // Note: cycleStats est maintenant calculé depuis le TileStore, pas besoin de setCycleStats
      // Détecter si un drone a été détruit
      if (currentState.includes('drone_destroyed')) {
        const explorerDestroyed = ctx.droneFleet?.drones?.explorer?.isDestroyed;
        if (explorerDestroyed) {
          setLastDroneDestroyed({
            type: 'explorer',
            time: new Date().toLocaleTimeString()
          });
        }
      }
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

      {/* DRONE DESTRUCTION ALERT */}
      {lastDroneDestroyed && (
        <section style={{ ...styles.section, backgroundColor: '#ffebee', borderLeft: '4px solid #ff6b6b' }}>
          <h3 style={{ color: '#ff6b6b', margin: '0 0 8px 0' }}>💥 Drone Destroyed!</h3>
          <p style={{ margin: '0' }}>
            <strong>{lastDroneDestroyed.type}</strong> drone was destroyed at <strong>{lastDroneDestroyed.time}</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
            Destroyed by danger tile - No information collected
          </p>
        </section>
      )}

      {/* CURRENT STATE */}
      <section style={styles.section}>
        <h2 style={{ color: getStateColor(currentState) }}>
          📊 Current State: <code style={{ color: getStateColor(currentState) }}>{currentState}</code>
        </h2>
        <p>Status: {botSnapshot.status}</p>
      </section>

      {/* DRONE STATUS */}
      <section style={styles.section}>
        <h3>🚁 Drone Status (All Types)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* EXPLORER DRONE */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#2196f3' }}>🛰️ Explorer</h4>
            <table style={{ width: '100%', fontSize: '12px', marginBottom: '8px' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>State:</td>
                  <td>{ctx?.droneFleet?.drones?.explorer?.visualState || 'uninitialized'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Status:</td>
                  <td style={{ color: ctx?.droneFleet?.drones?.explorer?.isDestroyed ? '#ff6b6b' : '#4caf50' }}>
                    {ctx?.droneFleet?.drones?.explorer?.isDestroyed ? '💥 Destroyed' : ctx?.droneFleet?.drones?.explorer?.isActive ? '✅ Active' : '❌ Inactive'}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Deployed:</td>
                  <td>{ctx?.droneFleet?.stats?.explorerDeployed || 0}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Destroyed:</td>
                  <td style={{ color: '#ff6b6b' }}>{ctx?.droneFleet?.stats?.explorerDestroyed || 0}</td>
                </tr>
              </tbody>
            </table>
            <PositionDisplay
              title="Position"
              worldPosition={coordToWorldPos(ctx?.droneFleet?.drones?.explorer?.coord, ctx?.gridInfo?.spacing)}
              gridCoord={ctx?.droneFleet?.drones?.explorer?.coord}
            />
          </div>

          {/* COMBAT DRONE */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#f44336' }}>🎯 Combat</h4>
            <table style={{ width: '100%', fontSize: '12px', marginBottom: '8px' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>State:</td>
                  <td>{ctx?.droneFleet?.drones?.combat?.visualState || 'uninitialized'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Status:</td>
                  <td style={{ color: ctx?.droneFleet?.drones?.combat?.isDestroyed ? '#ff6b6b' : '#4caf50' }}>
                    {ctx?.droneFleet?.drones?.combat?.isDestroyed ? '💥 Destroyed' : ctx?.droneFleet?.drones?.combat?.isActive ? '✅ Active' : '❌ Inactive'}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Deployed:</td>
                  <td>{ctx?.droneFleet?.stats?.combatDeployed || 0}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Destroyed:</td>
                  <td style={{ color: '#ff6b6b' }}>{ctx?.droneFleet?.stats?.combatDestroyed || 0}</td>
                </tr>
              </tbody>
            </table>
            <PositionDisplay
              title="Position"
              worldPosition={coordToWorldPos(ctx?.droneFleet?.drones?.combat?.coord, ctx?.gridInfo?.spacing)}
              gridCoord={ctx?.droneFleet?.drones?.combat?.coord}
            />
          </div>

          {/* SPECIAL DRONE */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#9c27b0' }}>✨ Special</h4>
            <table style={{ width: '100%', fontSize: '12px', marginBottom: '8px' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>State:</td>
                  <td>{ctx?.droneFleet?.drones?.special?.visualState || 'uninitialized'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Status:</td>
                  <td style={{ color: ctx?.droneFleet?.drones?.special?.isDestroyed ? '#ff6b6b' : '#4caf50' }}>
                    {ctx?.droneFleet?.drones?.special?.isDestroyed ? '💥 Destroyed' : ctx?.droneFleet?.drones?.special?.isActive ? '✅ Active' : '❌ Inactive'}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Deployed:</td>
                  <td>{ctx?.droneFleet?.stats?.specialDeployed || 0}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', paddingRight: '8px' }}>Destroyed:</td>
                  <td style={{ color: '#ff6b6b' }}>{ctx?.droneFleet?.stats?.specialDestroyed || 0}</td>
                </tr>
              </tbody>
            </table>
            <PositionDisplay
              title="Position"
              worldPosition={coordToWorldPos(ctx?.droneFleet?.drones?.special?.coord, ctx?.gridInfo?.spacing)}
              gridCoord={ctx?.droneFleet?.drones?.special?.coord}
            />
          </div>
        </div>
      </section>

      {/* TILE MATRIX LAYOUT (3 colonnes: Matrix, Ship Status, Collected Tiles) */}
      <TileMatrixLayout />

      {/* CYCLE STATISTICS */}
      <section style={styles.section}>
        <h3>📈 Cycle Statistics</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td>✅ Tiles Explored (by drones):</td>
              <td style={styles.statValue}>{cycleStats.tilesExplored} / {cycleStats.totalTiles}</td>
            </tr>
            <tr>
              <td>📦 Resources Collected:</td>
              <td style={styles.statValue}>{cycleStats.resourcesCollected}</td>
            </tr>
            <tr>
              <td>📊 Exploration Rate:</td>
              <td style={styles.statValue}>{cycleStats.explorationRate}%</td>
            </tr>
            <tr style={{ color: cycleStats.hasIssue ? '#FF5252' : '#4CAF50', fontWeight: 'bold' }}>
              <td>{cycleStats.hasIssue ? '❌' : '✓'} Unexplored Collected:</td>
              <td style={{...styles.statValue, color: cycleStats.hasIssue ? '#FF5252' : '#4CAF50'}}>
                {cycleStats.collectedButNotExplored}
                {cycleStats.hasIssue && ' ⚠️'}
              </td>
            </tr>
          </tbody>
        </table>
        {cycleStats.hasIssue && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: 'rgba(255, 82, 82, 0.2)',
            borderRadius: '4px',
            border: '1px solid #FF5252',
            fontSize: '13px'
          }}>
            ⚠️ Warning: {cycleStats.collectedButNotExplored} tile(s) collected without drone exploration!
          </div>
        )}
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
              { key: 'drone_docked', label: '⚓ Docked' },
              { key: 'drone_destroyed', label: '💥 Destroyed' }
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
