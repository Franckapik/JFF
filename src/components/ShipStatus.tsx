import React from 'react';

import { gridToWorld } from '../core/spatial';
import useXFSMStore from '../stores/useXFSMStore';
import type { GridCoordinate } from '../types/coordinates.d';
import type { FSMContext } from '../types/fsm.d';

import PositionDisplay from './PositionDisplay';

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
 * Composant affichant le statut du vaisseau (fuel, damage, resources)
 * Extrait de FSMVisualization pour réutilisation
 */
export default function ShipStatus() {
  const botStates = useXFSMStore((state) => state.botStates);
  
  // Helper pour convertir GridCoordinate en WorldPosition
  const coordToWorldPos = React.useCallback((coord: GridCoordinate | null | undefined, spacing = 1.2) => {
    if (!coord) return undefined;
    return gridToWorld(coord, { spacing, defaultY: 0.5 });
  }, []);

  const botSnapshot = botStates['bot-0'];
  if (!botSnapshot || !isValidSnapshot(botSnapshot)) {
    return (
      <section style={styles.section}>
        <h3>🚢 Ship Status</h3>
        <p style={{ color: '#999', fontStyle: 'italic' }}>FSM not running...</p>
      </section>
    );
  }

  const ctx = botSnapshot.context;

  return (
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
        worldPosition={coordToWorldPos(ctx?.vehicle?.coord, ctx?.gridInfo?.spacing)}
        gridCoord={ctx?.vehicle?.coord}
      />
    </section>
  );
}

// Helper pour rendre une barre de progression
function renderBar(ratio: number): React.JSX.Element {
  const percentage = Math.round(ratio * 100);
  const color = ratio > 0.6 ? '#4caf50' : ratio > 0.3 ? '#ff9800' : '#f44336';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '100px', 
        height: '12px', 
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
      <span style={{ fontSize: '11px', fontWeight: 'bold', color }}>{percentage}%</span>
    </div>
  );
}

const styles = {
  section: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #22c55e',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '100%',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '12px',
    fontSize: '13px',
  } as React.CSSProperties,
  statValue: {
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: '12px',
  } as React.CSSProperties,
};
