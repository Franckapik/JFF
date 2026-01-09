import React from 'react';

import { gridToWorld } from '../core/spatial';
import { useBotStates } from '../hooks/useBotState.ts';
import useBotSelectionStore from '../stores/useBotSelectionStore';
import type { GridCoordinate } from '../types/coordinates.d';
import type { FSMContext } from '../types/fsm.d';

import PositionDisplay from './PositionDisplay';

/**
 * ✅ Phase 4 Migration: Now uses useBotStates hook (auto-switches between worker/xfsm)
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

// Helper pour rendre une barre de progression compacte
function renderBar(ratio: number, compact = false): React.JSX.Element {
  const percentage = Math.round(ratio * 100);
  const color = ratio > 0.6 ? '#4caf50' : ratio > 0.3 ? '#ff9800' : '#f44336';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '4px' : '8px' }}>
      <div style={{ 
        width: compact ? '60px' : '100px', 
        height: compact ? '8px' : '12px', 
        backgroundColor: '#e0e0e0', 
        borderRadius: '6px', 
        overflow: 'hidden' 
      }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: '100%', 
          backgroundColor: color, 
          transition: 'width 0.3s ease' 
        }} />
      </div>
      <span style={{ fontSize: compact ? '9px' : '11px', fontWeight: 'bold', color }}>{percentage}%</span>
    </div>
  );
}

// Composant interne pour afficher un seul bot
function SingleBotStatus({ 
  botId, 
  compact = false,
  borderColor = '#22c55e'
}: { 
  botId: 'bot-0' | 'bot-1'; 
  compact?: boolean;
  borderColor?: string;
}) {
  // ✅ Phase 4: Use unified hook instead of useXFSMStore directly
  const botStates = useBotStates();
  
  const coordToWorldPos = React.useCallback((coord: GridCoordinate | null | undefined, spacing = 1.2) => {
    if (!coord) return undefined;
    return gridToWorld(coord, { spacing, defaultY: 0.5 });
  }, []);

  const botSnapshot = botStates[botId];
  if (!botSnapshot || !isValidSnapshot(botSnapshot)) {
    return (
      <div style={{ ...styles.singleBot, borderLeftColor: borderColor }}>
        <h4 style={styles.botTitle}>{botId === 'bot-0' ? '🚢 Bot-0' : '🚢 Bot-1'}</h4>
        <p style={{ color: '#999', fontStyle: 'italic', fontSize: '11px' }}>Not running...</p>
      </div>
    );
  }

  const ctx = botSnapshot.context;
  const labelStyle = compact ? styles.labelCompact : styles.label;
  const valueStyle = compact ? styles.valueCompact : styles.value;

  // 🆕 Détecter le type de destination
  const isMovingToStation = ctx?.vehicle?.isMovingToStation === true;
  const stationType = ctx?.vehicle?.stationType;
  const destinationLabel = isMovingToStation 
    ? `${stationType === 'fuel' ? '⛽' : '🔧'} ${stationType?.toUpperCase()} STATION`
    : ctx?.vehicle?.targetVehicleTile?.type === 'resource'
    ? '📦 RESOURCE'
    : ctx?.vehicle?.targetVehicleTile?.type === 'danger'
    ? '⚠️ DANGER'
    : 'N/A';

  return (
    <div style={{ ...styles.singleBot, borderLeftColor: borderColor }}>
      <h4 style={styles.botTitle}>{botId === 'bot-0' ? '🚢 Bot-0' : '🚢 Bot-1'}</h4>
      <div style={styles.statsGrid}>
        <span style={labelStyle}>Fuel:</span>
        <span style={valueStyle}>{ctx?.vehicle?.fuel || 0}</span>
        {renderBar((ctx?.vehicle?.fuel || 0) / 100, compact)}
        
        <span style={labelStyle}>Damage:</span>
        <span style={valueStyle}>{ctx?.vehicle?.damage || 0}</span>
        {renderBar((ctx?.vehicle?.damage || 0) / 100, compact)}
        
        <span style={labelStyle}>Resources:</span>
        <span style={valueStyle}>{ctx?.vehicle?.resources?.total || 0}</span>
        {renderBar((ctx?.vehicle?.resources?.total || 0) / (ctx?.vehicle?.maxCapacity?.total || 1000), compact)}
        
        {/* 🆕 STATION SUPPORT: Afficher le type de destination */}
        <span style={labelStyle}>Target:</span>
        <span style={{ ...valueStyle, color: isMovingToStation ? '#ff6b00' : '#666' }}>
          {destinationLabel}
        </span>
      </div>
      <PositionDisplay
        title="Position"
        worldPosition={coordToWorldPos(ctx?.vehicle?.coord, ctx?.gridInfo?.spacing)}
        gridCoord={ctx?.vehicle?.coord}
      />
    </div>
  );
}

/**
 * Composant affichant le statut du vaisseau (fuel, damage, resources)
 * Supporte l'affichage multi-bots selon selectedView
 */
export default function ShipStatus() {
  const selectedView = useBotSelectionStore((state) => state.selectedView);
  
  // Mode "both": afficher les deux bots côte à côte
  if (selectedView === 'both') {
    return (
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🚢 Ship Status</h3>
        <div style={styles.dualContainer}>
          <SingleBotStatus botId="bot-0" compact borderColor="#22c55e" />
          <SingleBotStatus botId="bot-1" compact borderColor="#3b82f6" />
        </div>
      </section>
    );
  }
  
  // Mode single bot
  const botId = selectedView as 'bot-0' | 'bot-1';
  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';
  
  return (
    <section style={{ ...styles.section, borderLeftColor: borderColor }}>
      <h3 style={styles.sectionTitle}>🚢 Ship Status</h3>
      <SingleBotStatus botId={botId} borderColor={borderColor} />
    </section>
  );
}

const styles = {
  section: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #22c55e',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
  } as React.CSSProperties,
  dualContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  } as React.CSSProperties,
  singleBot: {
    padding: '8px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
    borderLeft: '3px solid',
  } as React.CSSProperties,
  botTitle: {
    margin: '0 0 8px 0',
    fontSize: '12px',
    fontWeight: 600,
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr',
    gap: '4px 8px',
    alignItems: 'center',
    marginBottom: '8px',
  } as React.CSSProperties,
  label: {
    fontSize: '12px',
    color: '#666',
  } as React.CSSProperties,
  labelCompact: {
    fontSize: '10px',
    color: '#666',
  } as React.CSSProperties,
  value: {
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'right',
  } as React.CSSProperties,
  valueCompact: {
    fontSize: '10px',
    fontWeight: 'bold',
    textAlign: 'right',
  } as React.CSSProperties,
};
