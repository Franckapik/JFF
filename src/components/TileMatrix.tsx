import React from 'react';

import { useTileStore } from '../stores/useTileStore';
import useXFSMStore from '../stores/useXFSMStore';
import type { GridCoordinate } from '../types/coordinates.d';

/**
 * Composant minimaliste: matrice de points représentant les tuiles
 * - Tuile vide: noir
 * - Tuile explorée: bleu
 * - Tuile collectée: violet
 * - Ship: vert
 * - Drone: orange
 */
export default function TileMatrix() {
  const tiles = useTileStore((state) => state.tiles);
  const actor = useXFSMStore((state) => state.getActor('bot-0'));
  const [shipCoord, setShipCoord] = React.useState<GridCoordinate | null>(null);
  const [baseCoord, setBaseCoord] = React.useState<GridCoordinate | null>(null);
  const [droneCoords, setDroneCoords] = React.useState<GridCoordinate[]>([]);

  // Mettre à jour les positions du ship et drones à chaque changement d'état
  React.useEffect(() => {
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      
      // Position du ship (GridCoordinate directement)
      if (ctx.vehicle?.coord) {
        setShipCoord(ctx.vehicle.coord);
      }

      // Position de la base (tuile de départ)
      if (ctx.vehicle?.baseCoord) {
        setBaseCoord(ctx.vehicle.baseCoord);
      }

      // Positions des drones (objet avec clés: explorer, combat, special)
      if (ctx.droneFleet?.drones) {
        const coords: GridCoordinate[] = [];
        const droneTypes = ['explorer', 'combat', 'special'] as const;
        
        for (const type of droneTypes) {
          const drone = ctx.droneFleet.drones[type];
          if (drone?.coord) {
            // ✅ Utiliser GridCoordinate directement (plus de conversion nécessaire)
            // Format: "explorer|3,3" pour afficher le type de drone
            coords.push(`${type}|${drone.coord}` as any);
          }
        }
        
        setDroneCoords(coords);
      }
    });

    return () => subscription.unsubscribe();
  }, [actor]);

  // Debug: afficher les stats
  React.useEffect(() => {
    const sortedTiles = Object.entries(tiles);
    const explored = sortedTiles.filter(([, tile]) => tile.explored).length;
    const collected = sortedTiles.filter(([, tile]) => tile.collected).length;
    console.log('🗺️ [TileMatrix] Tiles stats:', {
      total: sortedTiles.length,
      explored,
      collected,
      samples: sortedTiles.slice(0, 3).map(([coord, tile]) => ({
        coord,
        explored: tile.explored,
        collected: tile.collected
      }))
    });
  }, [tiles]);

  // Parser les coordonnées pour trier les tuiles
  const sortedTiles = Object.entries(tiles).sort(([aCoord], [bCoord]) => {
    const [aq, ar] = aCoord.split(',').map(Number);
    const [bq, br] = bCoord.split(',').map(Number);
    return aq === bq ? ar - br : aq - bq;
  });

  // Déterminer les dimensions de la grille
  const coords = sortedTiles.map(([c]) => {
    const [q, r] = c.split(',').map(Number);
    return { q, r };
  });
  const minQ = Math.min(...coords.map(c => c.q));
  const maxQ = Math.max(...coords.map(c => c.q));
  const minR = Math.min(...coords.map(c => c.r));
  const maxR = Math.max(...coords.map(c => c.r));
  const width = maxQ - minQ + 1;
  const height = maxR - minR + 1;

  // Créer une grille indexée pour accès rapide
  const coordIndex = new Map(sortedTiles);

  // Déterminer la couleur d'un point
  const getColor = (coord: GridCoordinate): string => {
    if (coord === shipCoord) return '#22c55e'; // vert
    // ✅ Vérifier si c'est un drone (format: "type|coord" ou "coord")
    const isDrone = droneCoords.some(droneEntry => {
      const parts = String(droneEntry).split('|');
      const droneCoord = parts.length > 1 ? parts[1] : parts[0];
      return droneCoord === coord;
    });
    if (isDrone) return '#f97316'; // orange
    const tile = coordIndex.get(coord);
    if (tile?.type === 'fuel') return '#f32ad1ff'; // rose vif pour carburant
    if (tile?.type === 'repair') return '#bd259cff'; // magenta pour réparation
    if (tile?.type === 'danger') return '#ef4444'; // rouge pour danger
    if (tile?.collected) return '#8b5cf6'; // violet
    if (tile?.explored) return '#3b82f6'; // bleu
    return 'transparent'; // transparent par défaut
  };

  // ✅ Extraire le type de drone pour un affichage texte
  const getDroneLabel = (coord: GridCoordinate): string | null => {
    for (const droneEntry of droneCoords) {
      const parts = String(droneEntry).split('|');
      if (parts.length > 1 && parts[1] === coord) {
        const droneType = parts[0];
        if (droneType === 'explorer') return 'e';
        if (droneType === 'combat') return 'c';
        if (droneType === 'special') return 's';
      }
    }
    return null;
  };

  // Convertir les coordonnées q,r en format simple (A1, B2, ...)
  const getSimpleLabel = (q: number, r: number): string => {
    const colLetter = String.fromCharCode(65 + (q - minQ)); // A, B, C, ...
    const rowNum = (r - minR) + 1; // 1, 2, 3, ...
    return `${colLetter}${rowNum}`;
  };

  return (
    <section style={styles.section}>
      <h3>🗺️ Tile Matrix</h3>
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${width}, 1fr)` }}>
        {Array.from({ length: height }).map((_, rIdx) => (
          Array.from({ length: width }).map((_, qIdx) => {
            const q = minQ + qIdx;
            const r = minR + rIdx;
            const coord = `${q},${r}` as GridCoordinate;
            const color = getColor(coord);
            const label = getSimpleLabel(q, r);
            const isBase = coord === baseCoord;
            const droneLabel = getDroneLabel(coord); // ✅ Obtenir le label du drone
            const isDroneHere = droneLabel !== null;
            return (
              <div key={coord} style={styles.cellContainer} title={`${label} (${coord})`}>
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: color,
                    borderColor: color === 'transparent' ? '#000' : 'transparent',
                    borderWidth: color === 'transparent' ? '1px' : '0px',
                    outline: isBase ? '2px solid #000' : 'none',
                    position: 'relative',
                  }}
                >
                  {/* ✅ Afficher le label du drone (e, c, s) centré sur le rond */}
                  {isDroneHere && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        color: '#000',
                        textShadow: '0 0 2px white',
                        pointerEvents: 'none',
                      }}
                    >
                      {droneLabel}
                    </div>
                  )}
                </div>
                <div style={styles.label}>{label}</div>
              </div>
            );
          })
        ))}
      </div>
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: 'transparent', border: '2px solid #000' }} />
          <span>Départ</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#3b82f6' }} />
          <span>Explorée</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#8b5cf6' }} />
          <span>Collectée</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#22c55e' }} />
          <span>Ship</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#f97316' }} />
          <span>Drone (e/c/s)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#f32ad1ff' }} />
          <span>⛽ Carburant</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#bd259cff' }} />
          <span>🔧 Réparation</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#ef4444' }} />
          <span>⚠️ Danger</span>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #2196f3',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gap: '3px',
    marginBottom: '12ptransparent',
    borderRadius: '4px',
    maxWidth: '400px',
  } as React.CSSProperties,
  cellContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  } as React.CSSProperties,
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1px solid',
  } as React.CSSProperties,
  label: {
    fontSize: '8px',
    fontWeight: 'bold',
    color: '#666',
    minHeight: '10px',
    lineHeight: '10px',
  } as React.CSSProperties,
  legend: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    fontSize: '11px',
  } as React.CSSProperties,
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  } as React.CSSProperties,
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  } as React.CSSProperties,
};

