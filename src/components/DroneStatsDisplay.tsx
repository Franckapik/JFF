import React from 'react';

import { useBotStates } from '../hooks/useBotState.ts';
import { useUI } from '../contexts/UIContext';
import type { FSMContext } from '../types/fsm.d';

/**
 * ✅ Phase 4 Migration: Now uses useBotStates hook (auto-switches between worker/xfsm)
 */

/**
 * Type guard pour vérifier si un snapshot a un contexte valide
 */
function hasValidContext(snapshot: unknown): snapshot is { context: FSMContext } {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    typeof (snapshot as { context: unknown }).context === 'object'
  );
}

const droneTypes = [
  { key: 'explorer', label: '🛰️ Explorer', emoji: '🛰️' },
  { key: 'combat', label: '🎯 Combat', emoji: '🎯' },
  { key: 'special', label: '✨ Special', emoji: '✨' },
] as const;

// Composant interne pour un seul bot
function SingleDroneStats({ 
  botId, 
  compact = false 
}: { 
  botId: 'bot-0' | 'bot-1'; 
  compact?: boolean;
}) {
  // ✅ Phase 4: Use unified hook instead of useXFSMStore directly
  const botStates = useBotStates();
  const botSnapshot = botStates[botId];

  let droneStats = {
    explorerDeployed: 0,
    explorerDestroyed: 0,
    combatDeployed: 0,
    combatDestroyed: 0,
    specialDeployed: 0,
    specialDestroyed: 0,
  };
  let totalDestroyed = 0;

  if (hasValidContext(botSnapshot)) {
    const ctx = botSnapshot.context;
    droneStats = ctx.droneFleet?.stats || droneStats;
    totalDestroyed = ctx.memory?.stats?.dronesDestroyed || 0;
  }

  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';

  return (
    <div style={{
      padding: compact ? '8px' : '12px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderLeft: `3px solid ${borderColor}`,
      borderRadius: '6px',
      flex: 1,
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: compact ? '11px' : '12px', color: borderColor }}>
        {botId === 'bot-0' ? '🤖 Bot-0' : '🤖 Bot-1'}
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '4px' : '6px' }}>
        {droneTypes.map((drone) => {
          const deployedKey = `${drone.key}Deployed` as keyof typeof droneStats;
          const destroyedKey = `${drone.key}Destroyed` as keyof typeof droneStats;
          const deployed = droneStats[deployedKey] || 0;
          const destroyed = droneStats[destroyedKey] || 0;

          return (
            <div key={drone.key} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: compact ? '9px' : '11px',
              padding: '2px 4px',
              backgroundColor: 'rgba(255, 107, 107, 0.05)',
              borderRadius: '3px',
            }}>
              <span>{drone.emoji}</span>
              <span>📤{deployed}</span>
              <span style={{ color: destroyed > 0 ? '#FF6B6B' : '#4CAF50' }}>
                {destroyed > 0 ? `💥${destroyed}` : '✓'}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '6px',
        paddingTop: '6px',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: compact ? '9px' : '10px',
        fontWeight: 'bold'
      }}>
        <span>Détruits:</span>
        <span style={{ color: totalDestroyed > 0 ? '#FF6B6B' : '#4CAF50' }}>
          {totalDestroyed}
        </span>
      </div>
    </div>
  );
}

/**
 * Composant pour afficher les statistiques des drones
 * Supporte l'affichage multi-bots selon selectedView
 */
export const DroneStatsDisplay: React.FC = () => {
  const { selectedView } = useUI();

  // Mode "both": afficher les deux bots côte à côte
  if (selectedView === 'both') {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🤖 Drone Stats</h3>
        <div style={styles.dualContainer}>
          <SingleDroneStats botId="bot-0" compact />
          <SingleDroneStats botId="bot-1" compact />
        </div>
      </div>
    );
  }

  // Mode single bot
  const botId = selectedView as 'bot-0' | 'bot-1';
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🤖 Drone Stats</h3>
      <SingleDroneStats botId={botId} />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 20,
    left: 20,
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#333',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    minWidth: '200px',
    maxWidth: '350px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    border: '1px solid #e0e0e0',
  } as React.CSSProperties,
  title: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    color: '#FF6B6B',
  } as React.CSSProperties,
  dualContainer: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
};

export default DroneStatsDisplay;
