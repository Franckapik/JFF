import React from 'react';

import { getColRowLabel } from '../core/spatial/colRowCoordinate';
import { useTileStore } from '../stores/useTileStore';
import type { GridCoordinate, WorldPosition } from '../types/coordinates.d';

interface PositionDisplayProps {
  title: string;
  worldPosition: WorldPosition | undefined;
  gridCoord: GridCoordinate | undefined;
}

/**
 * Composant pour afficher une position dans tous les formats disponibles:
 * - WorldPosition: {x, y, z}
 * - GridCoordinate: "q,r"
 * - ColRowCoordinate: "A1", "B2", etc.
 */
export default function PositionDisplay({ title, worldPosition, gridCoord }: PositionDisplayProps) {
  const tiles = useTileStore((state) => state.tiles);

  // Calculer les bounds de la grille
  const bounds = React.useMemo(() => {
    const coords = Object.keys(tiles);
    if (coords.length === 0) return null;

    const qValues = coords.map((c) => parseInt(c.split(',')[0], 10));
    const rValues = coords.map((c) => parseInt(c.split(',')[1], 10));

    return {
      minQ: Math.min(...qValues),
      maxQ: Math.max(...qValues),
      minR: Math.min(...rValues),
      maxR: Math.max(...rValues),
    };
  }, [tiles]);

  // Calculer le format ColRow
  let colRowLabel: string | null = null;
  if (gridCoord && bounds) {
    try {
      const [qStr, rStr] = gridCoord.split(',');
      const q = parseInt(qStr, 10);
      const r = parseInt(rStr, 10);
      colRowLabel = getColRowLabel(q, r, bounds.minQ, bounds.minR);
    } catch {
      // Ignore conversion errors
    }
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '4px',
      border: '1px solid #e0e0e0',
      fontSize: '12px',
      fontFamily: 'monospace',
    } as React.CSSProperties,
    title: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '4px',
    } as React.CSSProperties,
    format: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '4px',
      borderBottom: '1px solid #f0f0f0',
    } as React.CSSProperties,
    label: {
      color: '#666',
      fontWeight: 'bold',
      minWidth: '80px',
    } as React.CSSProperties,
    value: {
      color: '#2196f3',
      fontWeight: 'bold',
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>📍 {title}</div>

      {/* WorldPosition */}
      {worldPosition && (
        <div style={styles.format}>
          <span style={styles.label}>World:</span>
          <span style={styles.value}>
            x={worldPosition.x.toFixed(2)}, y={worldPosition.y.toFixed(2)}, z={worldPosition.z.toFixed(2)}
          </span>
        </div>
      )}

      {/* GridCoordinate */}
      {gridCoord && (
        <div style={styles.format}>
          <span style={styles.label}>Grid:</span>
          <span style={styles.value}>{gridCoord}</span>
        </div>
      )}

      {/* ColRowCoordinate */}
      {colRowLabel && (
        <div style={styles.format}>
          <span style={styles.label}>ColRow:</span>
          <span style={styles.value}>{colRowLabel}</span>
        </div>
      )}
    </div>
  );
}
