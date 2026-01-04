import React from 'react';

import CollectedTilesList from './CollectedTilesList';
import ShipStatus from './ShipStatus';
import TileMatrix from './TileMatrix';

/**
 * Layout en 2 colonnes :
 * - Gauche : TileMatrix + ShipStatus (empilés)
 * - Droite : Liste des tuiles collectées
 */
export default function TileMatrixLayout() {
  return (
    <div style={styles.container}>
      {/* Colonne 1: TileMatrix + ShipStatus */}
      <div style={styles.leftColumn}>
        <TileMatrix />
        <div style={{ marginTop: '20px' }}>
          <ShipStatus />
        </div>
      </div>

      {/* Colonne 2: Liste des tuiles collectées */}
      <div style={styles.rightColumn}>
        <CollectedTilesList />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginTop: '20px',
    alignItems: 'start',
  } as React.CSSProperties,
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '20px',
  } as React.CSSProperties,
};
