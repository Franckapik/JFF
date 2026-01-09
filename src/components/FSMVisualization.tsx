import React from 'react';

import { gridToWorld } from '../core/spatial';
import { useBotStates, useActiveBots } from '../hooks/useBotState.ts';
import useBotSelectionStore from '../stores/useBotSelectionStore';
import { useTileStore } from '../stores/useTileStore';
import type { FairnessRuleResult, FairnessValidationResult } from '../stores/useTileStore/slices/tileFairnessSlice.ts';
import type { GridCoordinate } from '../types/coordinates';
import type { FSMContext } from '../types/fsm.d';

import BotSelector from './BotSelector';
import PositionDisplay from './PositionDisplay';
import TileMatrixLayout from './TileMatrixLayout';

/**
 * ✅ Phase 5 Migration: Uses useBotStates + useActiveBots hooks
 * No more direct useXFSMStore dependency
 */

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
 * Composant compact affichant le cycle FSM pour un seul bot
 */
function SingleBotCycleFlow({ botId, compact = false }: { botId: 'bot-0' | 'bot-1'; compact?: boolean }) {
  // ✅ Phase 4: Use unified hook
  const botStates = useBotStates();
  const botSnapshot = botStates[botId];
  
  const value = botSnapshot && isValidSnapshot(botSnapshot) ? botSnapshot.value : 'unknown';
  const currentState = typeof value === 'string' ? value : JSON.stringify(value);
  
  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';
  
  const getStateInfo = (state: string) => {
    if (state.includes('game_over')) return { label: 'GAME OVER', color: '#d32f2f', emoji: '🏁' };
    if (state.includes('initializing')) return { label: 'INIT', color: '#ff9800', emoji: '🚀' };
    if (state.includes('drone_deploying')) return { label: 'DEPLOY', color: '#4caf50', emoji: '🚁' };
    if (state.includes('drone_scanning')) return { label: 'SCAN', color: '#4caf50', emoji: '📡' };
    if (state.includes('drone_returning')) return { label: 'RETURN', color: '#4caf50', emoji: '🔙' };
    if (state.includes('drone_docked')) return { label: 'DOCKED', color: '#4caf50', emoji: '⚓' };
    if (state.includes('drone_destroyed')) return { label: 'DESTROYED', color: '#f44336', emoji: '💥' };
    if (state.includes('exploring')) return { label: 'EXPLORE', color: '#4caf50', emoji: '🔍' };
    if (state.includes('evaluating')) return { label: 'EVAL', color: '#2196f3', emoji: '🤔' };
    if (state.includes('ship_moving')) return { label: 'MOVING', color: '#f44336', emoji: '🚢' };
    if (state.includes('ship_collecting')) return { label: 'COLLECT', color: '#f44336', emoji: '📦' };
    if (state.includes('ship_returning')) return { label: 'RETURN', color: '#f44336', emoji: '🔙' };
    if (state.includes('collecting')) return { label: 'COLLECT', color: '#f44336', emoji: '📦' };
    if (state.includes('refueling')) return { label: 'REFUEL', color: '#9c27b0', emoji: '⛽' };
    if (state.includes('repairing')) return { label: 'REPAIR', color: '#9c27b0', emoji: '🔧' };
    if (state.includes('depositing')) return { label: 'DEPOSIT', color: '#9c27b0', emoji: '📤' };
    if (state.includes('relocating')) return { label: 'RELOCATE', color: '#e91e63', emoji: '🔄' };
    if (state.includes('purchasing_drone')) return { label: 'BUY DRONE', color: '#ff6b6b', emoji: '🛒' };
    if (state.includes('maintaining')) return { label: 'MAINTAIN', color: '#9c27b0', emoji: '🛠️' };
    return { label: 'UNKNOWN', color: '#757575', emoji: '❓' };
  };
  
  const stateInfo = getStateInfo(currentState);
  
  return (
    <div style={{
      padding: compact ? '8px' : '12px',
      backgroundColor: '#fafafa',
      borderRadius: '6px',
      borderLeft: `3px solid ${borderColor}`,
      flex: 1,
    }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: compact ? '11px' : '12px', color: borderColor }}>
        {botId === 'bot-0' ? '🤖 Bot-0' : '🤖 Bot-1'}
      </h4>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        backgroundColor: stateInfo.color,
        color: 'white',
        borderRadius: '4px',
        fontSize: compact ? '11px' : '13px',
        fontWeight: 'bold',
      }}>
        <span>{stateInfo.emoji}</span>
        <span>{stateInfo.label}</span>
      </div>
      <div style={{ marginTop: '4px', fontSize: '9px', color: '#666', wordBreak: 'break-all' }}>
        {currentState.length > 30 ? currentState.substring(0, 30) + '...' : currentState}
      </div>
    </div>
  );
}

/**
 * FSM Visualization - Affichage ultra-basique du cycle XState
 * 
 * ✅ Phase 5 Migration: Uses unified hooks (useBotStates + useActiveBots)
 */
export default function FSMVisualization() {
  // ✅ Phase 5: Use unified hooks for all FSM data
  const botStates = useBotStates();
  const activeBots = useActiveBots();
  const selectedView = useBotSelectionStore((state) => state.selectedView);

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
    relocating: 0,
    purchasing_drone: 0, // 🆕 DRONE DESTRUCTION
    game_over: 0, // 🆕 PHASE 2
  });
  const [lastDroneDestroyed, setLastDroneDestroyed] = React.useState<{ type: string; time: string } | null>(null);

  // Debug: log essential state info on change
  React.useEffect(() => {
    // Log pour tous les bots actifs selon selectedView
    const botsToLog = selectedView === 'both' ? ['bot-0', 'bot-1'] : [selectedView];
    botsToLog.forEach(botId => {
      const snapshot = botStates[botId];
      if (snapshot && isValidSnapshot(snapshot)) {
        const state = typeof snapshot.value === 'string' ? snapshot.value : JSON.stringify(snapshot.value);
        console.log(`🔄 [FSM:${botId}] State: ${state} | Status: ${snapshot.status}`);
      }
    });
  }, [botStates, selectedView]);

  // Écouter les changements d'état des bots sélectionnés
  React.useEffect(() => {
    const botsToTrack = selectedView === 'both' ? ['bot-0', 'bot-1'] : [selectedView];
    
    botsToTrack.forEach(botId => {
      const botSnapshot = botStates[botId];
      if (!botSnapshot || !isValidSnapshot(botSnapshot)) return;

      const value = botSnapshot.value;
      const currentState = typeof value === 'string' ? value : JSON.stringify(value);

      // Ajouter au log des événements
      setEventLog((prev) => {
        const newLog = [
          {
            time: new Date().toLocaleTimeString(),
            event: `[${botId}] STATE_CHANGE`,
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
          'maintaining', 'refueling', 'repairing', 'depositing', 'relocating', 'purchasing_drone', 'game_over'
        ];
        const updated = { ...prev };
        for (const state of allStates) {
          if (currentState.includes(state)) {
            updated[state] = prev[state] + 1;
          }
        }
        return updated;
      });

      // Détecter si un drone a été détruit
      const ctx = botSnapshot.context;
      if (ctx && currentState.includes('drone_destroyed')) {
        const explorerDestroyed = ctx.droneFleet?.drones?.explorer?.isDestroyed;
        if (explorerDestroyed) {
          setLastDroneDestroyed({
            type: `explorer (${botId})`,
            time: new Date().toLocaleTimeString()
          });
        }
      }
    });
  }, [botStates, selectedView]);

  // Déterminer quel(s) bot(s) afficher
  const botsToDisplay = selectedView === 'both' ? ['bot-0', 'bot-1'] as const : [selectedView] as const;
  
  // Vérifier si au moins un bot est actif
  const hasActiveBot = botsToDisplay.some(botId => {
    const snapshot = botStates[botId];
    return snapshot && isValidSnapshot(snapshot);
  });

  if (!hasActiveBot) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>🔴 FSM Not Running</h2>
          <BotSelector />
        </div>
        <p>Waiting for bots to start...</p>
      </div>
    );
  }

  // Pour le mode "both", on affiche les deux bots côte à côte
  // Pour le mode single, on affiche le bot sélectionné
  const primaryBotId = selectedView === 'both' ? 'bot-0' : selectedView;
  const botSnapshot = botStates[primaryBotId];
  
  const value = botSnapshot && isValidSnapshot(botSnapshot) ? botSnapshot.value : 'unknown';
  const context = botSnapshot && isValidSnapshot(botSnapshot) ? botSnapshot.context : null;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>🤖 FSM Cycle Visualization</h1>
        <BotSelector />
      </div>
      <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>Connected to XState via Zustand • Mode: {selectedView}</p>

      {/* DRONE DESTRUCTION ALERT */}
      {lastDroneDestroyed && (
        <section style={{ ...styles.section, backgroundColor: '#ffebee', borderLeft: '4px solid #ff6b6b' }}>
          <h3 style={{ color: '#ff6b6b', margin: '0 0 8px 0' }}>💥 Drone Destroyed!</h3>
          <p style={{ margin: '0' }}>
            <strong>{lastDroneDestroyed.type}</strong> drone was destroyed at <strong>{lastDroneDestroyed.time}</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
            🔥 Destroyed by danger tile - No information collected
          </p>
          {ctx && (
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
              <p style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>
                💰 Purchase Info:
              </p>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11px' }}>
                <li>Cost: 50 resources (current: {ctx.score?.resources?.total || 0})</li>
                <li>If insufficient: +20% damage penalty (current: {ctx.vehicle?.damage || 0}%)</li>
                <li>State: {currentState.includes('purchasing_drone') ? '🛒 Purchasing...' : '⏳ Waiting for purchase'}</li>
              </ul>
            </div>
          )}
        </section>
      )}

      {/* CURRENT STATE */}
      <section style={styles.section}>
        <h3>📊 Current State</h3>
        {selectedView === 'both' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(['bot-0', 'bot-1'] as const).map(botId => {
              const snap = botStates[botId];
              if (!snap || !isValidSnapshot(snap)) return (
                <div key={botId} style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px', borderLeft: `3px solid ${botId === 'bot-0' ? '#22c55e' : '#3b82f6'}` }}>
                  <h4 style={{ margin: '0 0 5px 0', color: botId === 'bot-0' ? '#22c55e' : '#3b82f6' }}>{botId}</h4>
                  <p style={{ margin: 0, color: '#999' }}>Not running</p>
                </div>
              );
              const st = typeof snap.value === 'string' ? snap.value : JSON.stringify(snap.value);
              return (
                <div key={botId} style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px', borderLeft: `3px solid ${botId === 'bot-0' ? '#22c55e' : '#3b82f6'}` }}>
                  <h4 style={{ margin: '0 0 5px 0', color: botId === 'bot-0' ? '#22c55e' : '#3b82f6' }}>{botId}</h4>
                  <code style={{ color: getStateColor(st), fontSize: '11px' }}>{st}</code>
                  <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#666' }}>Status: {snap.status}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <h2 style={{ color: getStateColor(currentState) }}>
              <code style={{ color: getStateColor(currentState) }}>{currentState}</code>
            </h2>
            {botSnapshot && isValidSnapshot(botSnapshot) && (
              <p>Status: {botSnapshot.status}</p>
            )}
          </>
        )}
      </section>

      {/* STARTING CONDITIONS - FAIRNESS ANALYSIS */}
      <StartingConditionsSection />

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
                {ctx?.droneFleet?.drones?.explorer?.isDestroyed && (
                  <tr style={{ backgroundColor: '#ffebee' }}>
                    <td colSpan={2} style={{ padding: '4px', fontSize: '10px', fontWeight: 'bold', color: '#ff6b6b' }}>
                      ⚠️ DESTROYED - Needs Replacement
                    </td>
                  </tr>
                )}
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

      {/* STATE MACHINE CYCLE - Dual Bot View */}
      <section style={styles.section}>
        <h3>🔄 FSM Cycle Flow</h3>
        {selectedView === 'both' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <SingleBotCycleFlow botId="bot-0" compact />
            <SingleBotCycleFlow botId="bot-1" compact />
          </div>
        ) : (
          <SingleBotCycleFlow botId={selectedView as 'bot-0' | 'bot-1'} />
        )}
        
        {/* Detailed Flow (toujours basé sur primaryBot pour la vue détaillée) */}
        <div style={{ ...styles.cycleFlow, marginTop: '12px' }}>
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
              { key: 'relocating', label: '� Relocate' },
              { key: 'refueling', label: '⛽ Refuel' },
              { key: 'repairing', label: '🔧 Repair' },
              { key: 'depositing', label: '📤 Deposit' },
              { key: 'purchasing_drone', label: '🛒 Buy Drone' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Game Over - PHASE 2 */}
          <div style={styles.stateBlock}>
            <span style={getFlowStyle('game_over', currentState)}>
              🏁 GAME OVER{stateVisitCounts.game_over > 0 && <span style={styles.badge}>{stateVisitCounts.game_over}</span>}
            </span>
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
              <td>🎯 Exploration Radius:</td>
              <td style={{ ...styles.statValue, color: '#e91e63', fontWeight: 'bold' }}>
                {ctx?.config?.exploringRadius ?? 1} / 3
              </td>
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
          Active Bots: {activeBots.join(', ')} | Snapshot Status: {isValidSnapshot(botSnapshot) ? botSnapshot.status : 'N/A'} | Context Size:{' '}
          {JSON.stringify(ctx).length} bytes
        </p>
      </section>
    </div>
  );
}

// ============================================================
// STARTING CONDITIONS SECTION
// ============================================================

function StartingConditionsSection() {
  const fairnessData = useTileStore((state) => state.lastFairnessValidation);

  if (!fairnessData) {
    return null;
  }

  const result = fairnessData as FairnessValidationResult;

  const calculateFairnessScore = (): { score: number; stars: number } => {
    let totalMargin = 0;
    let ruleCount = 0;

    const spawnRule = result.rules.find(r => r.rule === 'spawnDistance');
    if (spawnRule && spawnRule.status === 'PASS') {
      const margin = ((spawnRule.value - spawnRule.threshold) / spawnRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const resourceRule = result.rules.find(r => r.rule === 'resourceBalance');
    if (resourceRule && resourceRule.status === 'PASS') {
      const margin = ((resourceRule.threshold - resourceRule.value) / resourceRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const terrainRule = result.rules.find(r => r.rule === 'terrainFairness');
    if (terrainRule && terrainRule.status === 'PASS') {
      const margin = ((terrainRule.threshold - terrainRule.value) / terrainRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const fuelRule = result.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.status === 'PASS' && fuelRule.value !== 999) {
      const margin = ((fuelRule.threshold - fuelRule.value) / fuelRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const repairRule = result.rules.find(r => r.rule === 'repairAccess');
    if (repairRule && repairRule.status === 'PASS' && repairRule.value !== 999) {
      const margin = ((repairRule.threshold - repairRule.value) / repairRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const avgMargin = ruleCount > 0 ? totalMargin / ruleCount : 0;
    const score = Math.round(50 + (avgMargin / 2));
    const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 45 ? 2 : 1;

    return { score: Math.min(score, 100), stars };
  };

  const { score: fairnessScore, stars } = calculateFairnessScore();
  const passedRules = result.rules.filter(r => r.status === 'PASS').length;
  const totalRules = result.rules.length;

  const getRuleIcon = (rule: string) => {
    if (rule === 'spawnDistance') return '📏';
    if (rule === 'resourceBalance') return '💰';
    if (rule === 'fuelAccess') return '⛽';
    if (rule === 'repairAccess') return '🔧';
    if (rule === 'terrainFairness') return '🌍';
    return '📋';
  };

  const getRuleLabel = (rule: string) => {
    if (rule === 'spawnDistance') return 'Spawn Distance';
    if (rule === 'resourceBalance') return 'Resource Balance';
    if (rule === 'fuelAccess') return 'Fuel Access';
    if (rule === 'repairAccess') return 'Repair Access';
    if (rule === 'terrainFairness') return 'Terrain Fairness';
    return rule;
  };

  const getStatusColor = (ruleResult: FairnessRuleResult) => {
    if (ruleResult.value === 999) return '#F44336';
    if (ruleResult.status !== 'PASS') return '#F44336';
    
    const threshold = ruleResult.threshold;
    const value = ruleResult.value;
    
    if (ruleResult.rule === 'spawnDistance') {
      const margin = ((value - threshold) / threshold) * 100;
      return margin >= 50 ? '#4CAF50' : margin >= 25 ? '#FFC107' : '#FF9800';
    }
    
    const margin = ((threshold - value) / threshold) * 100;
    return margin >= 50 ? '#4CAF50' : margin >= 25 ? '#FFC107' : '#FF9800';
  };

  const getStatusLabel = (ruleResult: FairnessRuleResult) => {
    if (ruleResult.value === 999) return 'NOT PLACED';
    if (ruleResult.status !== 'PASS') return 'FAIL';
    
    const threshold = ruleResult.threshold;
    const value = ruleResult.value;
    
    if (ruleResult.rule === 'spawnDistance') {
      const margin = ((value - threshold) / threshold) * 100;
      return margin >= 50 ? 'EXCELLENT' : margin >= 25 ? 'GOOD' : 'TIGHT';
    }
    
    const margin = ((threshold - value) / threshold) * 100;
    return margin >= 50 ? 'EXCELLENT' : margin >= 25 ? 'GOOD' : 'TIGHT';
  };

  const getValueWithUnit = (rule: FairnessRuleResult): string => {
    if (rule.value === 999) return 'N/A';
    
    // ResourceBalance and TerrainFairness are already percentages
    if (rule.rule === 'resourceBalance' || rule.rule === 'terrainFairness') {
      return `${rule.value.toFixed(1)}%`;
    }
    
    // Station access (fuelAccess, repairAccess) are in tiles
    if (rule.rule === 'fuelAccess' || rule.rule === 'repairAccess') {
      return `${rule.value} tile${rule.value !== 1 ? 's' : ''}`;
    }
    
    // Spawn distance is in tiles
    return `${rule.value.toFixed(1)} tile${rule.value !== 1 ? 's' : ''}`;
  };

  const getThresholdWithUnit = (rule: FairnessRuleResult): string => {
    // ResourceBalance and TerrainFairness are already percentages
    if (rule.rule === 'resourceBalance' || rule.rule === 'terrainFairness') {
      return `${rule.threshold}%`;
    }
    
    // Station access (fuelAccess, repairAccess) are in tiles
    if (rule.rule === 'fuelAccess' || rule.rule === 'repairAccess') {
      return `${rule.threshold} tile${rule.threshold !== 1 ? 's' : ''}`;
    }
    
    // Spawn distance is in tiles
    return `${rule.threshold.toFixed(1)} tile${rule.threshold !== 1 ? 's' : ''}`;
  };

  // Determine which bot is favored by the starting conditions
  const calculateBotFavor = (): { favoredBot: string; advantage: string; reason: string } => {
    let bot0Score = 0;
    let bot1Score = 0;
    const reasons: string[] = [];

    // Resource Balance: Parse "Resources: 150 vs 200 (25% diff)"
    const resourceRule = result.rules.find(r => r.rule === 'resourceBalance');
    if (resourceRule && resourceRule.details && resourceRule.status === 'PASS') {
      // Extract numbers: "Resources: 150 vs 200 ..."
      const match = resourceRule.details.match(/Resources:\s*(\d+)\s*vs\s*(\d+)/);
      if (match) {
        const res0 = parseInt(match[1], 10);
        const res1 = parseInt(match[2], 10);
        if (res0 > res1) {
          bot0Score += 20;
          reasons.push(`Bot-0 has more resources (${res0} vs ${res1})`);
        } else if (res1 > res0) {
          bot1Score += 20;
          reasons.push(`Bot-1 has more resources (${res1} vs ${res0})`);
        }
      }
    }

    // Fuel Access: Parse "fuel distances: 2 tiles vs 3 tiles (max distance: 3, min: 2)"
    const fuelRule = result.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.details && fuelRule.value !== 999 && fuelRule.status === 'PASS') {
      const match = fuelRule.details.match(/fuel distances:\s*(\d+)\s*tiles\s*vs\s*(\d+)\s*tiles/);
      if (match) {
        const fuel0 = parseInt(match[1], 10);
        const fuel1 = parseInt(match[2], 10);
        if (fuel0 < fuel1) {
          bot0Score += 15;
          reasons.push(`Bot-0 is closer to fuel (${fuel0} vs ${fuel1} tiles)`);
        } else if (fuel1 < fuel0) {
          bot1Score += 15;
          reasons.push(`Bot-1 is closer to fuel (${fuel1} vs ${fuel0} tiles)`);
        }
      }
    }

    // Repair Access: Parse "repair distances: 2 tiles vs 4 tiles ..."
    const repairRule = result.rules.find(r => r.rule === 'repairAccess');
    if (repairRule && repairRule.details && repairRule.value !== 999 && repairRule.status === 'PASS') {
      const match = repairRule.details.match(/repair distances:\s*(\d+)\s*tiles\s*vs\s*(\d+)\s*tiles/);
      if (match) {
        const repair0 = parseInt(match[1], 10);
        const repair1 = parseInt(match[2], 10);
        if (repair0 < repair1) {
          bot0Score += 15;
          reasons.push(`Bot-0 is closer to repair (${repair0} vs ${repair1} tiles)`);
        } else if (repair1 < repair0) {
          bot1Score += 15;
          reasons.push(`Bot-1 is closer to repair (${repair1} vs ${repair0} tiles)`);
        }
      }
    }

    // Terrain Fairness: Parse "Terrain walkable: 65% vs 55% (10% diff)"
    const terrainRule = result.rules.find(r => r.rule === 'terrainFairness');
    if (terrainRule && terrainRule.details && terrainRule.status === 'PASS') {
      const match = terrainRule.details.match(/Terrain walkable:\s*([\d.]+)%\s*vs\s*([\d.]+)%/);
      if (match) {
        const terrain0 = parseFloat(match[1]);
        const terrain1 = parseFloat(match[2]);
        if (terrain0 > terrain1) {
          bot0Score += 20;
          reasons.push(`Bot-0 has more walkable terrain (${terrain0.toFixed(1)}% vs ${terrain1.toFixed(1)}%)`);
        } else if (terrain1 > terrain0) {
          bot1Score += 20;
          reasons.push(`Bot-1 has more walkable terrain (${terrain1.toFixed(1)}% vs ${terrain0.toFixed(1)}%)`);
        }
      }
    }

    if (bot0Score > bot1Score) {
      return {
        favoredBot: '🤖 Bot-0',
        advantage: `+${bot0Score - bot1Score} points`,
        reason: reasons.length > 0 ? reasons.join(' • ') : 'Better starting conditions'
      };
    } else if (bot1Score > bot0Score) {
      return {
        favoredBot: '🤖 Bot-1',
        advantage: `+${bot1Score - bot0Score} points`,
        reason: reasons.length > 0 ? reasons.join(' • ') : 'Better starting conditions'
      };
    } else {
      return {
        favoredBot: '⚖️ Perfectly Balanced',
        advantage: 'No advantage',
        reason: 'Both bots have equivalent starting conditions'
      };
    }
  };

  const botFavor = calculateBotFavor();

  return (
    <section style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>🎯 Starting Conditions - Fairness Analysis</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Seed: <strong>{result.seed}</strong> | Attempt: <strong>{result.attempt}/10</strong>
          </div>
          <div style={{ 
            padding: '4px 12px', 
            backgroundColor: fairnessScore >= 75 ? '#e8f5e9' : fairnessScore >= 50 ? '#fff3e0' : '#ffebee',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: fairnessScore >= 75 ? '#4CAF50' : fairnessScore >= 50 ? '#FF9800' : '#F44336'
          }}>
            {fairnessScore}/100 {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {result.rules.map((rule: FairnessRuleResult, index: number) => (
          <div 
            key={index}
            style={{
              border: '1px solid #ddd',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#f5f5f5',
              borderLeft: `4px solid ${getStatusColor(rule)}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>{getRuleIcon(rule.rule)}</span>
                <strong style={{ fontSize: '13px' }}>{getRuleLabel(rule.rule)}</strong>
              </div>
              <span 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  backgroundColor: getStatusColor(rule),
                  color: 'white'
                }}
              >
                {getStatusLabel(rule)}
              </span>
            </div>

            <table style={{ width: '100%', fontSize: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: '8px', color: '#666' }}>
                    {rule.rule === 'fuelAccess' || rule.rule === 'repairAccess' ? 'Difference:' : 'Value:'}
                  </td>
                  <td style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {getValueWithUnit(rule)}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '8px', color: '#666' }}>Threshold:</td>
                  <td style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {rule.rule === 'spawnDistance' ? '≥' : '≤'} {getThresholdWithUnit(rule)}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '8px', color: '#666' }}>Details:</td>
                  <td style={{ fontSize: '11px', color: '#888' }}>{rule.details}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* 6th Card: Bot Favorability Analysis */}
        <div 
          style={{
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: '#f5f5f5',
            borderLeft: `4px solid ${botFavor.favoredBot.includes('Balanced') ? '#4CAF50' : '#FF9800'}`
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px' }}>⚔️</span>
              <strong style={{ fontSize: '13px' }}>Advantage Analysis</strong>
            </div>
            <span 
              style={{ 
                fontSize: '10px', 
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '3px',
                backgroundColor: botFavor.favoredBot.includes('Balanced') ? '#4CAF50' : '#FF9800',
                color: 'white'
              }}
            >
              {botFavor.favoredBot.includes('Balanced') ? 'FAIR' : 'FAVORED'}
            </span>
          </div>

          <table style={{ width: '100%', fontSize: '12px' }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: '8px', color: '#666' }}>Favored Bot:</td>
                <td style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {botFavor.favoredBot}
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: '8px', color: '#666' }}>Advantage:</td>
                <td style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {botFavor.advantage}
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: '8px', color: '#666' }}>Reason:</td>
                <td style={{ fontSize: '11px', color: '#888' }}>{botFavor.reason}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        marginTop: '12px', 
        padding: '10px', 
        backgroundColor: result.valid ? '#e8f5e9' : '#ffebee',
        borderRadius: '4px',
        border: `1px solid ${result.valid ? '#4CAF50' : '#F44336'}`,
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          {result.valid ? '✅ All fairness rules satisfied!' : '⚠️ Some rules need attention'}
          {!result.valid && result.issues.length > 0 && ` - ${result.issues.join(', ')}`}
        </span>
        <span style={{ fontWeight: 'bold', color: result.valid ? '#4CAF50' : '#F44336' }}>
          {passedRules}/{totalRules} rules passed
        </span>
      </div>
    </section>
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
