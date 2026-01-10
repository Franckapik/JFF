/**
 * ==========================================================================
 * SHARED FSM VISUALIZATION - Version SharedWorker de FSMVisualization
 * ==========================================================================
 * 
 * ✅ Phase 5 Migration: Worker 100% autonome - Visualisation complète
 * 
 * Ce composant affiche toutes les informations FSM depuis le SharedWorker
 * autonome (aucune dépendance store React dans le worker).
 * 
 * Sections:
 * - Current State: États FSM actuels des bots
 * - Starting Conditions: Analyse de fairness (spawn, resources, terrain)
 * - Drone Status: État des 3 types de drones
 * - Tile Matrix: Grille hexagonale interactive
 * - Cycle Statistics: Métriques exploration/collecte
 * - FSM Cycle Flow: Diagramme visuel des états
 * - Context Memory: Snapshot du contexte FSM
 * - Event Log: Historique des transitions
 * 
 * Données:
 * - FSM State: useSharedWorkerStore (botStates, updateCounter, instanceId)
 * - Tiles/Fairness: useTileStore (local copy pour UI uniquement)
 * 
 * @see docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md
 * @see docs/FSM_ARCHITECTURE_DIAGRAM.md
 */

import React from 'react';

import { UIProvider, useUI } from '../contexts/UIContext';
import { gridToWorld } from '../core/spatial';
import { validateMapFairness } from '../core/spatial/fairness';
import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';
import type { GridCoordinate } from '../types/coordinates';
import type { FairnessRuleResult } from '../types/fairness';
import type { FSMContext } from '../types/fsm.d';
import type { TileMap } from '../types/tile';

import BotSelector from './BotSelector';
import TileMatrixLayout from './TileMatrixLayout';

// =========================================================================
// POSITION DISPLAY COMPONENT (inline, replacing deleted PositionDisplay.tsx)
// =========================================================================
function PositionDisplay({
  title,
  worldPosition,
  gridCoord,
}: {
  title: string;
  worldPosition?: { x: number; y: number; z: number };
  gridCoord?: GridCoordinate | null;
}) {
  return (
    <div style={{ fontSize: '11px', color: '#666' }}>
      <strong>{title}:</strong> {gridCoord || 'N/A'}
      {worldPosition && ` (${worldPosition.x.toFixed(1)}, ${worldPosition.y.toFixed(1)}, ${worldPosition.z.toFixed(1)})`}
    </div>
  );
}

// ============================================================
// STARTING CONDITIONS SECTION - FAIRNESS ANALYSIS
// ============================================================

function StartingConditionsSection() {
  const botStates = useSharedWorkerStore((s) => s.botStates);
  
  // Gather tiles and spawns from bot contexts
  const bot0Context = botStates['bot-0']?.context as FSMContext | undefined;
  const bot1Context = botStates['bot-1']?.context as FSMContext | undefined;
  
  const tileMap = (bot0Context?.gridInfo?.tiles || bot1Context?.gridInfo?.tiles || {}) as TileMap;
  const radius = bot0Context?.gridInfo?.radius || 3;
  
  // Find spawn tiles (type === 'depart')
  const spawns: GridCoordinate[] = Object.values(tileMap)
    .filter((tile) => tile && tile.type === 'depart')
    .map((tile) => tile!.position.coord);
  
  // No fairness analysis if not enough data
  if (spawns.length < 2 || Object.keys(tileMap).length === 0) {
    return (
      <section style={styles.section}>
        <h3 style={{ margin: 0 }}>🎯 Starting Conditions - Fairness Analysis</h3>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          Waiting for game initialization... (Need {2 - spawns.length} more spawn{spawns.length === 1 ? '' : 's'})
        </p>
      </section>
    );
  }
  
  // Calculate fairness
  const fairnessResult = validateMapFairness(tileMap, spawns, radius);
  
  const calculateFairnessScore = (): { score: number; stars: number } => {
    let totalMargin = 0;
    let ruleCount = 0;

    const spawnRule = fairnessResult.rules.find(r => r.rule === 'spawnDistance');
    if (spawnRule && spawnRule.status === 'PASS') {
      const margin = ((spawnRule.value - spawnRule.threshold) / spawnRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const resourceRule = fairnessResult.rules.find(r => r.rule === 'resourceBalance');
    if (resourceRule && resourceRule.status === 'PASS') {
      const margin = ((resourceRule.threshold - resourceRule.value) / resourceRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const terrainRule = fairnessResult.rules.find(r => r.rule === 'terrainFairness');
    if (terrainRule && terrainRule.status === 'PASS') {
      const margin = ((terrainRule.threshold - terrainRule.value) / terrainRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const fuelRule = fairnessResult.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.status === 'PASS' && fuelRule.value !== 999) {
      const margin = ((fuelRule.threshold - fuelRule.value) / fuelRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const repairRule = fairnessResult.rules.find(r => r.rule === 'repairAccess');
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
  const passedRules = fairnessResult.rules.filter(r => r.status === 'PASS').length;
  const totalRules = fairnessResult.rules.length;

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
    
    if (rule.rule === 'resourceBalance' || rule.rule === 'terrainFairness') {
      return `${rule.value.toFixed(1)}%`;
    }
    
    if (rule.rule === 'fuelAccess' || rule.rule === 'repairAccess') {
      return `${rule.value} tile${rule.value !== 1 ? 's' : ''}`;
    }
    
    return `${rule.value.toFixed(1)} tile${rule.value !== 1 ? 's' : ''}`;
  };

  const getThresholdWithUnit = (rule: FairnessRuleResult): string => {
    if (rule.rule === 'resourceBalance' || rule.rule === 'terrainFairness') {
      return `${rule.threshold}%`;
    }
    
    if (rule.rule === 'fuelAccess' || rule.rule === 'repairAccess') {
      return `${rule.threshold} tile${rule.threshold !== 1 ? 's' : ''}`;
    }
    
    return `${rule.threshold.toFixed(1)} tile${rule.threshold !== 1 ? 's' : ''}`;
  };

  // Determine which bot is favored
  const calculateBotFavor = (): { favoredBot: string; advantage: string; reason: string } => {
    let bot0Score = 0;
    let bot1Score = 0;
    const reasons: string[] = [];

    const resourceRule = fairnessResult.rules.find(r => r.rule === 'resourceBalance');
    if (resourceRule && resourceRule.details && resourceRule.status === 'PASS') {
      const match = resourceRule.details.match(/Resources:\s*(\d+)\s*vs\s*(\d+)/);
      if (match) {
        const res0 = parseInt(match[1], 10);
        const res1 = parseInt(match[2], 10);
        if (res0 > res1) {
          bot0Score++;
          reasons.push('More resources');
        } else if (res1 > res0) {
          bot1Score++;
          reasons.push('More resources');
        }
      }
    }

    const fuelRule = fairnessResult.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.details && fuelRule.value !== 999 && fuelRule.status === 'PASS') {
      const match = fuelRule.details.match(/fuel distances:\s*(\d+)\s*tiles\s*vs\s*(\d+)\s*tiles/);
      if (match) {
        const fuel0 = parseInt(match[1], 10);
        const fuel1 = parseInt(match[2], 10);
        if (fuel0 < fuel1) {
          bot0Score++;
          reasons.push('Closer fuel');
        } else if (fuel1 < fuel0) {
          bot1Score++;
          reasons.push('Closer fuel');
        }
      }
    }

    const repairRule = fairnessResult.rules.find(r => r.rule === 'repairAccess');
    if (repairRule && repairRule.details && repairRule.value !== 999 && repairRule.status === 'PASS') {
      const match = repairRule.details.match(/repair distances:\s*(\d+)\s*tiles\s*vs\s*(\d+)\s*tiles/);
      if (match) {
        const repair0 = parseInt(match[1], 10);
        const repair1 = parseInt(match[2], 10);
        if (repair0 < repair1) {
          bot0Score++;
          reasons.push('Closer repair');
        } else if (repair1 < repair0) {
          bot1Score++;
          reasons.push('Closer repair');
        }
      }
    }

    const terrainRule = fairnessResult.rules.find(r => r.rule === 'terrainFairness');
    if (terrainRule && terrainRule.details && terrainRule.status === 'PASS') {
      const match = terrainRule.details.match(/Terrain walkable:\s*([\d.]+)%\s*vs\s*([\d.]+)%/);
      if (match) {
        const terrain0 = parseFloat(match[1]);
        const terrain1 = parseFloat(match[2]);
        if (terrain0 > terrain1) {
          bot0Score++;
          reasons.push('Better terrain');
        } else if (terrain1 > terrain0) {
          bot1Score++;
          reasons.push('Better terrain');
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
          <div style={{ fontSize: '20px' }}>
            {'⭐'.repeat(stars)}
          </div>
          <div style={{
            backgroundColor: fairnessScore >= 75 ? '#4CAF50' : fairnessScore >= 50 ? '#FFC107' : '#F44336',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {fairnessScore}/100
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {fairnessResult.rules.map((rule: FairnessRuleResult, index: number) => (
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
              <h4 style={{ margin: 0, fontSize: '13px', color: '#333' }}>
                {getRuleIcon(rule.rule)} {getRuleLabel(rule.rule)}
              </h4>
              <span style={{
                fontSize: '9px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '8px',
                backgroundColor: getStatusColor(rule),
                color: 'white'
              }}>
                {getStatusLabel(rule)}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
              <strong>Value:</strong> {getValueWithUnit(rule)}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
              <strong>Threshold:</strong> {getThresholdWithUnit(rule)}
            </div>
            {rule.details && (
              <div style={{ fontSize: '10px', color: '#999', marginTop: '6px', fontStyle: 'italic' }}>
                {rule.details}
              </div>
            )}
          </div>
        ))}

        {/* Bot Favor Card */}
        <div 
          style={{
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: '#f5f5f5',
            borderLeft: `4px solid ${botFavor.favoredBot.includes('Balanced') ? '#4CAF50' : '#FF9800'}`
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#333' }}>
            ⚖️ Starting Advantage
          </h4>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: '#333' }}>
            {botFavor.favoredBot}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
            <strong>Advantage:</strong> {botFavor.advantage}
          </div>
          <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
            {botFavor.reason}
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '12px', 
        padding: '10px', 
        backgroundColor: fairnessResult.valid ? '#e8f5e9' : '#ffebee',
        borderRadius: '4px',
        border: `1px solid ${fairnessResult.valid ? '#4CAF50' : '#F44336'}`,
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          {fairnessResult.valid ? '✅ All fairness rules passed' : '❌ Some fairness rules failed'}
        </span>
        <span style={{ fontWeight: 'bold', color: fairnessResult.valid ? '#4CAF50' : '#F44336' }}>
          {passedRules}/{totalRules} rules passed
        </span>
      </div>
    </section>
  );
}

// =========================================================================
// SYNC HEADER COMPONENT (from SharedView)
// =========================================================================

function SyncHeader() {
  const instanceId = useSharedWorkerStore((s) => s.instanceId);
  const updateCounter = useSharedWorkerStore((s) => s.updateCounter);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const isInitialized = useSharedWorkerStore((s) => s.isInitialized);
  const lastUpdateTimestamp = useSharedWorkerStore((s) => s.lastUpdateTimestamp);
  const resetGame = useSharedWorkerStore((s) => s.resetGame);
  
  const timeSinceUpdate = lastUpdateTimestamp 
    ? Math.round((Date.now() - lastUpdateTimestamp) / 1000) 
    : null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '12px 20px',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderBottom: '2px solid #0f3460'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#9333ea', // Purple pour vue2
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          <span>📺</span>
          <span>VUE2</span>
        </div>
        
        {/* ✅ MOVED TO FRONT: Reset Game Button - Most Important Action */}
        <button
          onClick={() => resetGame()}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            opacity: isConnected ? 1 : 0.5,
            pointerEvents: isConnected ? 'auto' : 'none',
            boxShadow: isConnected ? '0 4px 12px rgba(249, 115, 22, 0.4)' : 'none',
            transform: isConnected ? 'scale(1)' : 'scale(0.95)'
          }}
          onMouseOver={(e) => {
            if (isConnected) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ea580c';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.6)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f97316';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = isConnected ? '0 4px 12px rgba(249, 115, 22, 0.4)' : 'none';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
          title="Reset the game - Generates new map with different spawn fairness"
        >
          <span style={{ fontSize: '16px' }}>🔄</span>
          <span>Reset Game</span>
        </button>
        
        {/* ✅ Phase 5: Worker Autonomy Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#059669',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          <span>✅</span>
          <span>Worker Autonome</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isConnected ? '#166534' : '#991b1b',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>

          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#22c55e' : '#ef4444',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        {isInitialized && (
          <div style={{
            backgroundColor: '#1e40af',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            🎮 Game Running
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            INSTANCE ID
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            backgroundColor: '#374151',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            {instanceId || '---'}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            UPDATES
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fbbf24',
            backgroundColor: '#374151',
            padding: '2px 12px',
            borderRadius: '6px',
            minWidth: '60px'
          }}>
            {updateCounter}
          </div>
        </div>
        
        {timeSinceUpdate !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
              LAST UPDATE
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              {timeSinceUpdate}s ago
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// TYPE GUARDS
// =========================================================================
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
 * 
 * ✅ Phase 5: Récupère l'état depuis SharedWorker (worker autonome)
 * Plus de dépendance à useXFSMStore local - tout vient du worker.
 */
function SingleBotCycleFlow({ botId, compact = false }: { botId: 'bot-0' | 'bot-1'; compact?: boolean }) {
  // ✅ Phase 5: SharedWorker autonome - single source of truth
  const botStates = useSharedWorkerStore((state) => state.botStates);
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
 * Shared FSM Visualization - Version SharedWorker de FSMVisualization
 * Component interne avec la visualisation FSM
 */
function SharedFSMVisualizationContent() {
  // 🔄 CHANGEMENT: Récupération depuis SharedWorker
  const botStates = useSharedWorkerStore((state) => state.botStates);
  const activeBots = useSharedWorkerStore((state) => state.activeBots);
  const isConnected = useSharedWorkerStore((state) => state.isConnected);
  const instanceId = useSharedWorkerStore((state) => state.instanceId);
  const updateCounter = useSharedWorkerStore((state) => state.updateCounter);
  
  const { selectedView } = useUI();

  // Helper pour convertir GridCoordinate en WorldPosition pour l'affichage
  const coordToWorldPos = React.useCallback((coord: GridCoordinate | null | undefined, spacing = 1.2) => {
    if (!coord) return undefined;
    return gridToWorld(coord, { spacing, defaultY: 0.5 });
  }, []);

  // États pour le log des transitions
  const [eventLog, setEventLog] = React.useState<Array<{ time: string; event: string; state: string }>>([]);
  
  // Statistiques d'exploration depuis le FSM context
  const cycleStats = React.useMemo(() => {
    let totalTiles = 0;
    let exploredTiles = 0;
    let collectedTiles = 0;
    let collectedButNotExplored = 0;
    
    // Récupérer les tuiles depuis le premier bot actif
    const firstActiveBotId = activeBots?.[0];
    if (firstActiveBotId && botStates[firstActiveBotId]?.context?.gridInfo?.tiles) {
      const tiles = botStates[firstActiveBotId].context.gridInfo.tiles;
      Object.values(tiles).forEach((tile) => {
        totalTiles++;
        if (tile.explored === true) exploredTiles++;
        if (tile.collected === true) {
          collectedTiles++;
          if (tile.explored !== true) collectedButNotExplored++;
        }
      });
    }
    
    return {
      tilesExplored: exploredTiles,
      resourcesCollected: collectedTiles,
      totalTiles,
      collectedButNotExplored,
      explorationRate: totalTiles > 0 ? ((exploredTiles / totalTiles) * 100).toFixed(1) : '0.0',
      hasIssue: collectedButNotExplored > 0
    };
  }, [botStates, activeBots]);
  
  const [stateVisitCounts, setStateVisitCounts] = React.useState<Record<string, number>>({
    // Main states
    initializing: 0,
    evaluating: 0,
    exploring: 0,
    collecting: 0,
    maintaining: 0,
    game_over: 0,
    
    // Exploration substates
    drone_deploying: 0,
    drone_scanning: 0,
    drone_returning: 0,
    drone_docked: 0,
    drone_destroyed: 0, // 🆕 DRONE DESTRUCTION: Drone hit danger tile
    
    // Collection substates
    ship_moving_to_tile: 0,
    ship_collecting: 0,
    ship_returning: 0,
    
    // Maintenance substates
    depositing: 0,
    refueling: 0,
    repairing: 0,
    relocating: 0, // 🆕 RELOCATION: Ship blocked by explored tiles
    purchasing_drone: 0, // 🆕 DRONE PURCHASE: Replacing destroyed drone
  });
  
  const [lastDroneDestroyed, setLastDroneDestroyed] = React.useState<{ type: string; time: string } | null>(null);

  // Debug: log essential state info on change
  React.useEffect(() => {
    const botsToLog = selectedView === 'both' ? ['bot-0', 'bot-1'] : [selectedView];
    botsToLog.forEach(botId => {
      const snapshot = botStates[botId];
      if (snapshot && isValidSnapshot(snapshot)) {
        const state = typeof snapshot.value === 'string' ? snapshot.value : JSON.stringify(snapshot.value);
        // eslint-disable-next-line no-console
        console.log(`🔄 [SharedFSM:${botId}] State: ${state} | Status: ${snapshot.status}`);
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
            updated[state] = (updated[state] || 0) + 1;
          }
        }
        return updated;
      });

      // Détecter si un drone a été détruit
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = botSnapshot.context as any;
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

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>🔴 SharedWorker Not Connected</h2>
          <BotSelector />
        </div>
        <p>Connecting to SharedWorker...</p>
        <p style={{ fontSize: '11px', color: '#999' }}>Instance: {instanceId || 'N/A'}</p>
      </div>
    );
  }

  if (!hasActiveBot) {
    return (
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>🔴 FSM Not Running</h2>
          <BotSelector />
        </div>
        <p>Waiting for bots to start...</p>
        <p style={{ fontSize: '11px', color: '#999' }}>Instance: {instanceId} | Updates: {updateCounter}</p>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = context as any;

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
      {/* Header simple avec BotSelector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px'
      }}>
        <h1 style={{ margin: 0 }}>🤖 FSM Cycle Visualization</h1>
        <BotSelector />
      </div>

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
                <li>Drone Cost: {ctx.droneFleet?.drones?.explorer?.purchaseCost || 0} credits</li>
                <li>Current Credits: {ctx.credits || 0}</li>
                <li>Can Purchase: {(ctx.credits || 0) >= (ctx.droneFleet?.drones?.explorer?.purchaseCost || 0) ? '✅ Yes' : '❌ No'}</li>
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
              const snapshot = botStates[botId];
              if (!snapshot || !isValidSnapshot(snapshot)) return null;
              const val = snapshot.value;
              const state = typeof val === 'string' ? val : JSON.stringify(val);
              return (
                <div
                  key={botId}
                  style={{
                    padding: '12px',
                    backgroundColor: getStateColor(state),
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '4px' }}>{botId}</div>
                  {state}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div
              style={{
                padding: '12px',
                backgroundColor: getStateColor(currentState),
                color: 'white',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {currentState}
            </div>
            {botSnapshot && isValidSnapshot(botSnapshot) && (
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Status: {botSnapshot.status}</p>
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
          {/* Explorer Drone */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#4caf50' }}>Explorer 🔍</h4>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Status:</strong> {ctx?.droneFleet?.drones?.explorer?.isDeployed ? (
                ctx?.droneFleet?.drones?.explorer?.isDestroyed ? '💥 Destroyed' : '✈️ Deployed'
              ) : '🏠 Docked'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Battery:</strong> {ctx?.droneFleet?.drones?.explorer?.battery?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Durability:</strong> {ctx?.droneFleet?.drones?.explorer?.durability?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Max Range:</strong> {ctx?.droneFleet?.drones?.explorer?.maxRange || 0} tiles
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Purchase Cost:</strong> {ctx?.droneFleet?.drones?.explorer?.purchaseCost || 0} credits
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Destroyed:</strong> {ctx?.droneFleet?.drones?.explorer?.isDestroyed ? '🔥 YES' : '✅ NO'}
            </p>
            <PositionDisplay
              title="Position"
              worldPosition={coordToWorldPos(ctx?.droneFleet?.drones?.explorer?.coord, ctx?.gridInfo?.spacing)}
              gridCoord={ctx?.droneFleet?.drones?.explorer?.coord}
            />
          </div>

          {/* Combat Drone */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#f44336' }}>Combat ⚔️</h4>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Status:</strong> {ctx?.droneFleet?.drones?.combat?.isDeployed ? '✈️ Deployed' : '🏠 Docked'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Battery:</strong> {ctx?.droneFleet?.drones?.combat?.battery?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Durability:</strong> {ctx?.droneFleet?.drones?.combat?.durability?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Max Range:</strong> {ctx?.droneFleet?.drones?.combat?.maxRange || 0} tiles
            </p>
            <PositionDisplay
              title="Position"
              worldPosition={coordToWorldPos(ctx?.droneFleet?.drones?.combat?.coord, ctx?.gridInfo?.spacing)}
              gridCoord={ctx?.droneFleet?.drones?.combat?.coord}
            />
          </div>

          {/* Special Drone */}
          <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', backgroundColor: '#f5f5f5' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#9c27b0' }}>Special ⭐</h4>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Status:</strong> {ctx?.droneFleet?.drones?.special?.isDeployed ? '✈️ Deployed' : '🏠 Docked'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Battery:</strong> {ctx?.droneFleet?.drones?.special?.battery?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Durability:</strong> {ctx?.droneFleet?.drones?.special?.durability?.toFixed(1) || 0}%
            </p>
            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              <strong>Max Range:</strong> {ctx?.droneFleet?.drones?.special?.maxRange || 0} tiles
            </p>
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
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Tiles Explored</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {cycleStats.tilesExplored} / {cycleStats.totalTiles}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Exploration Rate</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {cycleStats.explorationRate}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Resources Collected</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {cycleStats.resourcesCollected}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Current Credits</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.credits || 0}
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
        <div style={{ ...styles.cycleFlow, marginTop: '12px', overflow: 'auto' }}>
          {/* Initializing */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('initializing', currentState)}>
              🚀 INIT
            </div>
            {currentState.includes('initializing') && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: (ctx?.shipPosition !== null && ctx?.shipPosition !== undefined) ? '#c8e6c9' : '#ffcccc',
                  color: (ctx?.shipPosition !== null && ctx?.shipPosition !== undefined) ? '#2e7d32' : '#c62828',
                }}>
                  {(ctx?.shipPosition !== null && ctx?.shipPosition !== undefined) ? '✅' : '⏳'} Ship
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: (ctx?.droneFleet?.drones?.explorer?.coord) ? '#c8e6c9' : '#ffcccc',
                  color: (ctx?.droneFleet?.drones?.explorer?.coord) ? '#2e7d32' : '#c62828',
                }}>
                  {(ctx?.droneFleet?.drones?.explorer?.coord) ? '✅' : '⏳'} Drone
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: (ctx?.basePosition) ? '#c8e6c9' : '#ffcccc',
                  color: (ctx?.basePosition) ? '#2e7d32' : '#c62828',
                }}>
                  {(ctx?.basePosition) ? '✅' : '⏳'} Base
                </div>
              </div>
            )}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Evaluating */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('evaluating', currentState)}>
              🤔 EVAL
            </div>
            {currentState.includes('evaluating') && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  border: '1px solid #90caf9'
                }}>
                  📊 Credits: {ctx?.credits || 0}
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#f3e5f5',
                  color: '#6a1b9a',
                  border: '1px solid #ce93d8'
                }}>
                  ⛽ Fuel: {ctx?.fuel?.toFixed(0) || 0}%
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                  border: '1px solid #ffb74d'
                }}>
                  💪 Health: {ctx?.health?.toFixed(0) || 0}%
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#f1f8e9',
                  color: '#33691e',
                  border: '1px solid #aed581'
                }}>
                  🔍 Radius: {ctx?.gridInfo?.radius || 1}
                </div>
              </div>
            )}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Exploring (with drone substates including drone_destroyed) */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('exploring', currentState)}>
              🔍 EXPLORE
            </div>
            {renderSubstates(currentState, [
              { key: 'drone_deploying', label: '🚁 Deploy' },
              { key: 'drone_scanning', label: '📡 Scan' },
              { key: 'drone_returning', label: '🔙 Return' },
              { key: 'drone_docked', label: '⚓ Docked' },
              { key: 'drone_destroyed', label: '💥 Destroyed' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Collecting (with ship substates) */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('collecting', currentState)}>
              📦 COLLECT
            </div>
            {renderSubstates(currentState, [
              { key: 'ship_moving_to_tile', label: '🚢 Moving' },
              { key: 'ship_collecting', label: '📦 Collecting' },
              { key: 'ship_returning', label: '🔙 Return' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Maintaining (with maintenance substates including relocating and purchasing_drone) */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('maintaining', currentState)}>
              🛠️ MAINTAIN
            </div>
            {renderSubstates(currentState, [
              { key: 'depositing', label: '📤 Deposit' },
              { key: 'refueling', label: '⛽ Refuel' },
              { key: 'repairing', label: '🔧 Repair' },
              { key: 'relocating', label: '🔄 Relocate' },
              { key: 'purchasing_drone', label: '🛒 Buy Drone' }
            ], stateVisitCounts)}
          </div>

          <span style={styles.arrow}>→</span>

          {/* Game Over (final state with summary) */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('game_over', currentState)}>
              🏁 GAME OVER
            </div>
            {currentState.includes('game_over') && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#e8f5e9',
                  color: '#1b5e20',
                }}>
                  🎯 Explored: {cycleStats.tilesExplored}/{cycleStats.totalTiles}
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                }}>
                  📦 Collected: {cycleStats.resourcesCollected}
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#f3e5f5',
                  color: '#4a148c',
                }}>
                  💰 Final Score: {ctx?.credits || 0}
                </div>
                <div style={{
                  padding: '3px 6px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  backgroundColor: '#c8e6c9',
                  color: '#1b5e20',
                }}>
                  ✨ Radius: {ctx?.gridInfo?.radius || 1}/3
                </div>
              </div>
            )}
          </div>

          <span style={styles.arrow}>↻</span>

          {/* Back to Evaluating (loop) */}
          <div style={styles.stateBlock}>
            <div style={getFlowStyle('evaluating', currentState)}>
              🔄 EVAL
            </div>
          </div>
        </div>
        
        {/* State Hierarchy Legend */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f0f7ff',
          borderRadius: '6px',
          border: '1px solid #90caf9',
          fontSize: '12px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>📋 States Hierarchy</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
            <div>
              <strong>Main States:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                <li>🚀 INITIALIZING - Boot sequence</li>
                <li>🤔 EVALUATING - Decision logic</li>
                <li>🔍 EXPLORING - Drone deployment</li>
                <li>📦 COLLECTING - Resource gathering</li>
                <li>🛠️ MAINTAINING - Refuel/repair/deposit</li>
                <li>🏁 GAME OVER - Final state</li>
              </ul>
            </div>
            <div>
              <strong>Key Substates:</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                <li>🚁 DRONE: Deploy → Scan → Return → Docked</li>
                <li>💥 DRONE DESTROYED - Hit danger tile</li>
                <li>🚢 SHIP: Moving → Collecting → Returning</li>
                <li>🔄 RELOCATING - Expand exploration radius</li>
                <li>🛒 PURCHASING DRONE - Replace destroyed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXT SNAPSHOT */}
      <section style={styles.section}>
        <h3>🔍 Context Memory</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Ship Position (Grid)</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.shipPosition ? `(${ctx.shipPosition.col}, ${ctx.shipPosition.row})` : 'N/A'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Ship Position (World)</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.shipPosition ? (() => {
                  const world = coordToWorldPos(ctx.shipPosition, ctx?.gridInfo?.spacing);
                  return world ? `(${world.x.toFixed(1)}, ${world.y.toFixed(1)}, ${world.z.toFixed(1)})` : 'N/A';
                })() : 'N/A'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Credits</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.credits || 0}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Ship Fuel</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.fuel?.toFixed(1) || 0}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Ship Health</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.health?.toFixed(1) || 0}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Target Tile</td>
              <td style={{ ...styles.statValue, padding: '8px', borderBottom: '1px solid #eee' }}>
                {ctx?.targetTile ? `(${ctx.targetTile.col}, ${ctx.targetTile.row})` : 'None'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* STATE VISIT STATISTICS */}
      <section style={styles.section}>
        <h3>📊 State Visit Counters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {/* Main States */}
          <div style={{ borderRadius: '6px', padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', color: '#333' }}>🏛️ Main States</div>
            {['initializing', 'evaluating', 'exploring', 'collecting', 'maintaining', 'game_over'].map(state => (
              <div key={state} style={{ fontSize: '11px', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>{state}:</span>
                <strong style={{ color: stateVisitCounts[state] > 0 ? '#ff9800' : '#999' }}>
                  {stateVisitCounts[state] || 0}
                </strong>
              </div>
            ))}
          </div>

          {/* Exploration Substates */}
          <div style={{ borderRadius: '6px', padding: '10px', backgroundColor: '#e8f5e9', border: '1px solid #81c784' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', color: '#2e7d32' }}>🚁 Exploration</div>
            {['drone_deploying', 'drone_scanning', 'drone_returning', 'drone_docked', 'drone_destroyed'].map(state => (
              <div key={state} style={{ fontSize: '11px', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>{state}:</span>
                <strong style={{ color: stateVisitCounts[state] > 0 ? '#4caf50' : '#999' }}>
                  {stateVisitCounts[state] || 0}
                </strong>
              </div>
            ))}
          </div>

          {/* Collection Substates */}
          <div style={{ borderRadius: '6px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #ef5350' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', color: '#c62828' }}>📦 Collection</div>
            {['ship_moving_to_tile', 'ship_collecting', 'ship_returning'].map(state => (
              <div key={state} style={{ fontSize: '11px', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>{state}:</span>
                <strong style={{ color: stateVisitCounts[state] > 0 ? '#f44336' : '#999' }}>
                  {stateVisitCounts[state] || 0}
                </strong>
              </div>
            ))}
          </div>

          {/* Maintenance Substates */}
          <div style={{ borderRadius: '6px', padding: '10px', backgroundColor: '#f3e5f5', border: '1px solid #9c27b0' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', color: '#6a1b9a' }}>🛠️ Maintenance</div>
            {['depositing', 'refueling', 'repairing', 'relocating', 'purchasing_drone'].map(state => (
              <div key={state} style={{ fontSize: '11px', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>{state}:</span>
                <strong style={{ color: stateVisitCounts[state] > 0 ? '#9c27b0' : '#999' }}>
                  {stateVisitCounts[state] || 0}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT LOG */}
      <section style={styles.section}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ margin: 0 }}>📜 Event Log (Last 20)</h3>
          <button
            onClick={() => {
              const logText = eventLog.map(e => `[${e.time}] ${e.event}: ${e.state}`).join('\n');
              navigator.clipboard.writeText(logText).then(
                () => {
                  // eslint-disable-next-line no-console
                  console.log('✅ Logs copied to clipboard');
                  alert('Logs copied to clipboard!');
                },
                (err) => {
                  // eslint-disable-next-line no-console
                  console.error('❌ Failed to copy logs:', err);
                }
              );
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
            <p style={{ color: '#999', margin: 0 }}>No events yet...</p>
          ) : (
            eventLog.map((e, i) => (
              <div key={i} style={{ marginBottom: '4px', fontFamily: 'monospace' }}>
                <span style={{ color: '#999' }}>[{e.time}]</span> <strong>{e.event}</strong>: {e.state}
              </div>
            ))
          )}
        </div>
      </section>

      {/* DEBUG INFO */}
      <section style={styles.section}>
        <h3>🐛 Debug Info</h3>
        <p style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>
          Active Bots: {activeBots.join(', ')} | Snapshot Status: {botSnapshot?.status || 'N/A'} | Context Size: {JSON.stringify(ctx).length} bytes
        </p>
        <p style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>
          SharedWorker Instance: {instanceId} | Update Counter: {updateCounter}
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

// =========================================================================
// MAIN COMPONENT WITH CONNECTION MANAGEMENT
// =========================================================================

/**
 * Main component that handles SharedWorker connection and displays FSM visualization
 * 
 * Note: AppRouter handles the initial connection and game initialization.
 * This component only ensures connection and polls for state updates.
 */
export default function SharedFSMVisualization() {
  const connect = useSharedWorkerStore((s) => s.connect);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const requestState = useSharedWorkerStore((s) => s.requestState);
  
  // Ensure connection (AppRouter should already be connected, but this is a safety net)
  React.useEffect(() => {
    if (!isConnected) {
      // eslint-disable-next-line no-console
      console.log('🔌 [VUE2] Ensuring SharedWorker connection...');
      connect();
    }
  }, [connect, isConnected]);
  
  // Poll for state updates periodically (backup mechanism)
  React.useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      requestState();
    }, 5000); // Every 5 seconds as backup
    
    return () => clearInterval(interval);
  }, [isConnected, requestState]);
  
  return (
    <UIProvider>
      <div style={{ paddingTop: '80px' }}>
        <SyncHeader />
        <SharedFSMVisualizationContent />
        
        {/* CSS for pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </UIProvider>
  );
}
