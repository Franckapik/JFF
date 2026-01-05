import React from 'react';

import useBotSelectionStore from '../stores/useBotSelectionStore';
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
type BotData = {
  shipCoord: GridCoordinate | null;
  baseCoord: GridCoordinate | null;
  droneCoords: GridCoordinate[];
};

export default function TileMatrix() {
  const tiles = useTileStore((state) => state.tiles);
  const getActor = useXFSMStore((state) => state.getActor);
  const selectedView = useBotSelectionStore((state) => state.selectedView);
  
  // États pour les deux bots
  const [bot0Data, setBot0Data] = React.useState<BotData>({
    shipCoord: null,
    baseCoord: null,
    droneCoords: [],
  });
  const [bot1Data, setBot1Data] = React.useState<BotData>({
    shipCoord: null,
    baseCoord: null,
    droneCoords: [],
  });
  const [exploringRadius, setExploringRadius] = React.useState<number>(2);

  // Mettre à jour les positions de bot-0
  React.useEffect(() => {
    const actor = getActor('bot-0');
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      
      const newData: BotData = {
        shipCoord: ctx.vehicle?.coord || null,
        baseCoord: ctx.vehicle?.baseCoord || null,
        droneCoords: [],
      };

      if (ctx.config?.exploringRadius !== undefined) {
        setExploringRadius(ctx.config.exploringRadius);
      }

      if (ctx.droneFleet?.drones) {
        const coords: GridCoordinate[] = [];
        const droneTypes = ['explorer', 'combat', 'special'] as const;
        
        for (const type of droneTypes) {
          const drone = ctx.droneFleet.drones[type];
          if (drone?.coord) {
            coords.push(`bot-0|${type}|${drone.coord}` as any);
          }
        }
        
        newData.droneCoords = coords;
      }
      
      setBot0Data(newData);
    });

    return () => subscription.unsubscribe();
  }, [getActor]);

  // Mettre à jour les positions de bot-1
  React.useEffect(() => {
    const actor = getActor('bot-1');
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      
      const newData: BotData = {
        shipCoord: ctx.vehicle?.coord || null,
        baseCoord: ctx.vehicle?.baseCoord || null,
        droneCoords: [],
      };

      if (ctx.droneFleet?.drones) {
        const coords: GridCoordinate[] = [];
        const droneTypes = ['explorer', 'combat', 'special'] as const;
        
        for (const type of droneTypes) {
          const drone = ctx.droneFleet.drones[type];
          if (drone?.coord) {
            coords.push(`bot-1|${type}|${drone.coord}` as any);
          }
        }
        
        newData.droneCoords = coords;
      }
      
      setBot1Data(newData);
    });

    return () => subscription.unsubscribe();
  }, [getActor]);

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
  const minR = Math.min(...coords.map(c => c.r));

  // Créer une grille indexée pour accès rapide
  const coordIndex = new Map(sortedTiles);

  /**
   * Calcule si une tuile est dans le rayon d'exploration d'un des ships
   * Filtre selon selectedView
   */
  const isInExplorationRadius = (coord: GridCoordinate): boolean => {
    const checkRadius = (shipCoord: GridCoordinate | null) => {
      if (!shipCoord) return false;
      
      const [shipQ, shipR] = shipCoord.split(',').map(Number);
      const [tileQ, tileR] = coord.split(',').map(Number);
      
      const shipS = -shipQ - shipR;
      const tileS = -tileQ - tileR;
      
      const distance = (Math.abs(shipQ - tileQ) + Math.abs(shipR - tileR) + Math.abs(shipS - tileS)) / 2;
      
      return distance <= exploringRadius;
    };
    
    // Filtrer selon selectedView
    const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
    const showBot1 = selectedView === 'both' || selectedView === 'bot-1';
    
    return (showBot0 && checkRadius(bot0Data.shipCoord)) || (showBot1 && checkRadius(bot1Data.shipCoord));
  };

  // Déterminer la couleur et le label d'un point
  const getColor = (coord: GridCoordinate): string => {
    const inRadius = isInExplorationRadius(coord);
    
    // Filtrer selon selectedView
    const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
    const showBot1 = selectedView === 'both' || selectedView === 'bot-1';
    
    // Ships avec couleurs différentes
    if (showBot0 && coord === bot0Data.shipCoord) return '#22c55e'; // vert pour bot-0
    if (showBot1 && coord === bot1Data.shipCoord) return '#3b82f6'; // bleu pour bot-1
    
    // Drones filtrés selon selectedView
    const allDroneCoords = [
      ...(showBot0 ? bot0Data.droneCoords : []),
      ...(showBot1 ? bot1Data.droneCoords : [])
    ];
    const isDrone = allDroneCoords.some(droneEntry => {
      const parts = String(droneEntry).split('|');
      const droneCoord = parts[parts.length - 1];
      return droneCoord === coord;
    });
    if (isDrone) return '#f97316'; // orange
    
    const tile = coordIndex.get(coord);
    
    // Appliquer l'opacité selon la portée
    if (tile?.type === 'fuel') return inRadius ? '#f32ad1ff' : 'rgba(243, 42, 209, 0.3)';
    if (tile?.type === 'repair') return inRadius ? '#bd259cff' : 'rgba(189, 37, 156, 0.3)';
    if (tile?.type === 'obstacle') return inRadius ? '#000000' : 'rgba(0, 0, 0, 0.3)';
    if (tile?.type === 'danger') return inRadius ? '#ef4444' : 'rgba(239, 68, 68, 0.3)';
    if (tile?.type === 'empty') return inRadius ? '#9ca3af' : 'rgba(156, 163, 175, 0.3)';
    if (tile?.collected) return inRadius ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'; // violet
    if (tile?.explored) return inRadius ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'; // bleu
    
    // Tuiles non explorées
    if (inRadius) return 'rgba(59, 130, 246, 0.5)'; // bleu semi-transparent dans le radius
    
    return 'rgba(200, 200, 200, 0.2)'; // gris très clair hors de portée
  };

  // Récupérer le label pour ship ou drone (filtré selon selectedView)
  const getEntityLabel = (coord: GridCoordinate): string | null => {
    const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
    const showBot1 = selectedView === 'both' || selectedView === 'bot-1';
    
    // Ships
    if (showBot0 && coord === bot0Data.shipCoord) return 'S0';
    if (showBot1 && coord === bot1Data.shipCoord) return 'S1';
    
    // Drones filtrés selon selectedView
    const allDroneCoords = [
      ...(showBot0 ? bot0Data.droneCoords : []),
      ...(showBot1 ? bot1Data.droneCoords : [])
    ];
    for (const droneEntry of allDroneCoords) {
      const parts = String(droneEntry).split('|');
      if (parts.length >= 3) {
        const botId = parts[0]; // bot-0 ou bot-1
        const droneType = parts[1]; // explorer, combat, special
        const droneCoord = parts[2];
        
        if (droneCoord === coord) {
          const botNum = botId.includes('0') ? '0' : '1';
          const typeLabel = droneType[0].toUpperCase(); // E, C, S
          return `D${botNum}${typeLabel}`;
        }
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

  /**
   * Calcule les coordonnées pixel (x, y) pour une tuile hexagonale (q, r)
   * Utilise la géométrie hexagonale axiale flat-top
   * Formules standard: x = size * 3/2 * q, y = size * sqrt(3) * (r + q/2)
   * @pure
   */
  const getHexPosition = (q: number, r: number): { x: number; y: number } => {
    const size = 28; // Taille de l'hexagone en pixels
    // Normaliser les coordonnées par rapport au minimum
    const normalizedQ = q - minQ;
    const normalizedR = r - minR;
    
    // Formules standard pour hexagones flat-top (axial coordinates)
    const x = size * (3 / 2) * normalizedQ;
    const y = size * Math.sqrt(3) * (normalizedR + normalizedQ / 2);
    
    return { x, y };
  };

  // Calculer les dimensions du conteneur hexagonal
  const hexPositions = sortedTiles.map(([coord]) => {
    const [q, r] = coord.split(',').map(Number);
    return getHexPosition(q, r);
  });
  const hexMaxX = Math.max(...hexPositions.map(p => p.x));
  const hexMaxY = Math.max(...hexPositions.map(p => p.y));

  return (
    <section style={styles.section}>
      <h3>🗺️ Tile Matrix (Hexagonal)</h3>
      <div style={{
        ...styles.hexGrid,
        width: `${hexMaxX + 100}px`,
        height: `${hexMaxY + 100}px`,
      }}>
        {/* Tuiles */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {sortedTiles.map(([coord]) => {
            const [q, r] = coord.split(',').map(Number);
            const { x, y } = getHexPosition(q, r);
            const color = getColor(coord as GridCoordinate);
            const label = getSimpleLabel(q, r);
            const isBase = coord === bot0Data.baseCoord || coord === bot1Data.baseCoord;
            const entityLabel = getEntityLabel(coord as GridCoordinate);
            const hasEntity = entityLabel !== null;
            
            return (
              <div
                key={coord}
                style={{
                  position: 'absolute',
                  left: `${x + 50}px`,
                  top: `${y + 50}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  transition: 'opacity 0.2s ease',
                }}
                title={`${label} (${coord})`}
              >
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: color,
                    borderColor: color.includes('rgba(200') ? '#ddd' : 'transparent',
                    borderWidth: color.includes('rgba(200') ? '1px' : '0px',
                    borderStyle: 'dashed',
                    outline: isBase ? '2px solid #000' : 'none',
                    position: 'relative',
                  }}
                >
                  {/* Afficher le label (S0, S1, D0E, D1E, etc.) */}
                  {hasEntity && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '7px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '0 0 3px #000',
                        pointerEvents: 'none',
                      }}
                    >
                      {entityLabel}
                    </div>
                  )}
                </div>
                <div style={styles.label}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: 'transparent', border: '2px solid #000' }} />
          <span>Départ</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#22c55e' }} />
          <span>Ship Bot-0 (S0) {bot0Data.shipCoord && <span style={styles.counter}>1</span>}</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#3b82f6' }} />
          <span>Ship Bot-1 (S1) {bot1Data.shipCoord && <span style={styles.counter}>1</span>}</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#f97316' }} />
          <span>Drones (D0E, D1E) <span style={styles.counter}>{bot0Data.droneCoords.length + bot1Data.droneCoords.length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#8b5cf6' }} />
          <span>Collectée <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.collected).length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: 'rgba(59, 130, 246, 0.5)' }} />
          <span>Explorable (r={exploringRadius})</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: 'rgba(200, 200, 200, 0.2)', border: '1px dashed #ddd' }} />
          <span>Hors de portée</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#9ca3af' }} />
          <span>Empty <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.type === 'empty').length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#000000' }} />
          <span>Obstacle <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.type === 'obstacle').length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#f32ad1ff' }} />
          <span>⛽ Carburant <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.type === 'fuel').length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#bd259cff' }} />
          <span>🔧 Réparation <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.type === 'repair').length}</span></span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendDot, backgroundColor: '#ef4444' }} />
          <span>⚠️ Danger <span style={styles.counter}>{sortedTiles.filter(([, tile]) => tile.type === 'danger').length}</span></span>
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
  hexGrid: {
    position: 'relative',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fafafa',
    overflow: 'auto',
    maxHeight: '600px',
  } as React.CSSProperties,
  cellContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  } as React.CSSProperties,
  dot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1px solid',
  } as React.CSSProperties,
  label: {
    fontSize: '9px',
    fontWeight: 'bold',
    color: '#666',
    minHeight: '11px',
    lineHeight: '11px',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  legend: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    fontSize: '11px',
    marginTop: '15px',
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
  counter: {
    marginLeft: '4px',
    fontWeight: 'bold',
    color: '#1f2937',
    backgroundColor: '#e5e7eb',
    padding: '1px 5px',
    borderRadius: '3px',
    fontSize: '10px',
  } as React.CSSProperties,
};

