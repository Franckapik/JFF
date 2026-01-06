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
  // 🛤️ PATHFINDING: Current path for visualization
  currentPath: GridCoordinate[];
  pathIndex: number;
  // 🛤️ PATHFINDING: Previous paths for history
  previousPaths: GridCoordinate[][];
  // 🛤️ PATHFINDING: History of progression numbers per tile (coordinate -> [numbers])
  tileProgressHistory: Map<GridCoordinate, number[]>;
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
    currentPath: [],
    pathIndex: 0,
    previousPaths: [],
    tileProgressHistory: new Map(),
  });
  const [bot1Data, setBot1Data] = React.useState<BotData>({
    shipCoord: null,
    baseCoord: null,
    droneCoords: [],
    currentPath: [],
    pathIndex: 0,
    previousPaths: [],
    tileProgressHistory: new Map(),
  });
  const [exploringRadius, setExploringRadius] = React.useState<number>(2);

  // Mettre à jour les positions de bot-0
  React.useEffect(() => {
    const actor = getActor('bot-0');
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      
      setBot0Data((prevData) => {
        const newPath = ctx.vehicle?.currentPath || [];
        const newPathIndex = ctx.vehicle?.pathIndex ?? 0;
        
        // Si le chemin a changé, ajouter l'ancien chemin à l'historique
        let previousPaths = prevData.previousPaths;
        if (newPath.length > 0 && 
            (newPath.length !== prevData.currentPath.length || 
             newPath.some((coord, idx) => coord !== prevData.currentPath[idx]))) {
          // Garder seulement les 3 derniers chemins
          previousPaths = [...prevData.previousPaths, prevData.currentPath].slice(-3);
        }
        
        // Mettre à jour l'historique de progression pour chaque tuile
        const tileProgressHistory = new Map(prevData.tileProgressHistory);
        for (let i = 0; i < newPath.length; i++) {
          const coord = newPath[i];
          const currentProgresses = tileProgressHistory.get(coord) || [];
          // Ajouter le numéro de progression si ce n'est pas déjà présent
          if (!currentProgresses.includes(i + 1)) {
            tileProgressHistory.set(coord, [...currentProgresses, i + 1]);
          }
        }
        
        const newData: BotData = {
          shipCoord: ctx.vehicle?.coord || null,
          baseCoord: ctx.vehicle?.baseCoord || null,
          droneCoords: [],
          currentPath: newPath,
          pathIndex: newPathIndex,
          previousPaths,
          tileProgressHistory,
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
        
        return newData;
      });
    });

    return () => subscription.unsubscribe();
  }, [getActor]);

  // Mettre à jour les positions de bot-1
  React.useEffect(() => {
    const actor = getActor('bot-1');
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      
      setBot1Data((prevData) => {
        const newPath = ctx.vehicle?.currentPath || [];
        const newPathIndex = ctx.vehicle?.pathIndex ?? 0;
        
        // Si le chemin a changé, ajouter l'ancien chemin à l'historique
        let previousPaths = prevData.previousPaths;
        if (newPath.length > 0 && 
            (newPath.length !== prevData.currentPath.length || 
             newPath.some((coord, idx) => coord !== prevData.currentPath[idx]))) {
          // Garder seulement les 3 derniers chemins
          previousPaths = [...prevData.previousPaths, prevData.currentPath].slice(-3);
        }
        
        // Mettre à jour l'historique de progression pour chaque tuile
        const tileProgressHistory = new Map(prevData.tileProgressHistory);
        for (let i = 0; i < newPath.length; i++) {
          const coord = newPath[i];
          const currentProgresses = tileProgressHistory.get(coord) || [];
          // Ajouter le numéro de progression si ce n'est pas déjà présent
          if (!currentProgresses.includes(i + 1)) {
            tileProgressHistory.set(coord, [...currentProgresses, i + 1]);
          }
        }
        
        const newData: BotData = {
          shipCoord: ctx.vehicle?.coord || null,
          baseCoord: ctx.vehicle?.baseCoord || null,
          droneCoords: [],
          currentPath: newPath,
          pathIndex: newPathIndex,
          previousPaths,
          tileProgressHistory,
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
        
        return newData;
      });
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

  // Obtenir le type de tuile et sa légende
  const getTileLegend = (coord: GridCoordinate): { icon: string; label: string } => {
    const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
    const showBot1 = selectedView === 'both' || selectedView === 'bot-1';
    
    // 1. Véhicules et entités (priorité absolue)
    if (showBot0 && coord === bot0Data.baseCoord) return { icon: '🏠', label: 'Base/Départ' };
    if (showBot1 && coord === bot1Data.baseCoord) return { icon: '🏠', label: 'Base/Départ' };
    if (showBot0 && coord === bot0Data.shipCoord) return { icon: '🚢', label: 'Ship Bot-0' };
    if (showBot1 && coord === bot1Data.shipCoord) return { icon: '🚢', label: 'Ship Bot-1' };
    
    const allDroneCoords = [
      ...(showBot0 ? bot0Data.droneCoords : []),
      ...(showBot1 ? bot1Data.droneCoords : [])
    ];
    if (allDroneCoords.some(droneEntry => String(droneEntry).split('|')[String(droneEntry).split('|').length - 1] === coord)) {
      return { icon: '🛰️', label: 'Drone' };
    }
    
    const tile = coordIndex.get(coord);
    
    // 2. Types statiques de tuiles spécialisées (priorité sur les états dynamiques)
    if (tile?.type === 'depart') return { icon: '🏠', label: 'Base/Départ' };
    if (tile?.type === 'fuel') return { icon: '⛽', label: 'Carburant' };
    if (tile?.type === 'repair') return { icon: '🔧', label: 'Réparation' };
    if (tile?.type === 'obstacle') return { icon: '⬛', label: 'Obstacle' };
    if (tile?.type === 'danger') return { icon: '⚠️', label: 'Danger' };
    if (tile?.type === 'empty') return { icon: '⬜', label: 'Vide' };
    
    // 3. Tuiles de ressources (type 'resource') - États dynamiques
    if (tile?.type === 'resource') {
      if (tile?.collected) return { icon: '✨', label: 'Collectée' };
      if (tile?.explored) return { icon: '🔍', label: 'Explorée' };
      // Tuile resource non explorée = ressource disponible
      return { icon: '💎', label: 'Ressource' };
    }
    
    // 4. Fallback pour tuiles inconnues (ne devrait jamais arriver)
    return { icon: '❓', label: 'Inconnu' };
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

  // 🛤️ PATHFINDING: Check if a tile is on the current path
  const getPathInfo = (coord: GridCoordinate): { isOnPath: boolean; botId: 'bot-0' | 'bot-1' | null; isVisited: boolean; isFuture: boolean } => {
    const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
    const showBot1 = selectedView === 'both' || selectedView === 'bot-1';
    
    // Check bot-0 path
    if (showBot0 && bot0Data.currentPath.length > 0) {
      const pathIndex = bot0Data.currentPath.indexOf(coord);
      if (pathIndex !== -1) {
        return {
          isOnPath: true,
          botId: 'bot-0',
          isVisited: pathIndex <= bot0Data.pathIndex,
          isFuture: pathIndex > bot0Data.pathIndex,
        };
      }
    }
    
    // Check bot-1 path
    if (showBot1 && bot1Data.currentPath.length > 0) {
      const pathIndex = bot1Data.currentPath.indexOf(coord);
      if (pathIndex !== -1) {
        return {
          isOnPath: true,
          botId: 'bot-1',
          isVisited: pathIndex <= bot1Data.pathIndex,
          isFuture: pathIndex > bot1Data.pathIndex,
        };
      }
    }
    
    return { isOnPath: false, botId: null, isVisited: false, isFuture: false };
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

  /**
   * Generate SVG path lines between waypoints
   * Returns SVG elements for the path visualization with improved styling
   * Includes previous paths with reduced opacity for history
   */
  const renderPathLines = (botData: BotData, botColor: string, botId: string): React.ReactElement[] | null => {
    if (botData.currentPath.length < 2 && botData.previousPaths.length === 0) return null;
    
    const showBot = selectedView === 'both' || selectedView === botId;
    if (!showBot) return null;
    
    const pathLines: React.ReactElement[] = [];
    
    // Afficher les chemins précédents avec faible opacité
    botData.previousPaths.forEach((previousPath, pathHistoryIndex) => {
      for (let i = 0; i < previousPath.length - 1; i++) {
        const fromCoord = previousPath[i];
        const toCoord = previousPath[i + 1];
        
        const [fromQ, fromR] = fromCoord.split(',').map(Number);
        const [toQ, toR] = toCoord.split(',').map(Number);
        
        const fromPos = getHexPosition(fromQ, fromR);
        const toPos = getHexPosition(toQ, toR);
        
        // Opacité décroissante pour l'historique
        const historyOpacity = 0.15 + (pathHistoryIndex * 0.05);
        
        pathLines.push(
          <line
            key={`${botId}-history-${pathHistoryIndex}-${i}`}
            x1={fromPos.x + 50 + 9}
            y1={fromPos.y + 50 + 9}
            x2={toPos.x + 50 + 9}
            y2={toPos.y + 50 + 9}
            stroke={botColor}
            strokeWidth={2}
            strokeOpacity={historyOpacity}
            strokeLinecap="round"
          />
        );
      }
    });
    
    // Afficher le chemin actuel
    if (botData.currentPath.length >= 2) {
      for (let i = 0; i < botData.currentPath.length - 1; i++) {
        const fromCoord = botData.currentPath[i];
        const toCoord = botData.currentPath[i + 1];
        
        const [fromQ, fromR] = fromCoord.split(',').map(Number);
        const [toQ, toR] = toCoord.split(',').map(Number);
        
        const fromPos = getHexPosition(fromQ, fromR);
        const toPos = getHexPosition(toQ, toR);
        
        const isVisited = i < botData.pathIndex;
        const isCurrent = i === botData.pathIndex;
        
        // Ligne arrière-plan pour la lisibilité
        pathLines.push(
          <line
            key={`${botId}-path-bg-${i}`}
            x1={fromPos.x + 50 + 9}
            y1={fromPos.y + 50 + 9}
            x2={toPos.x + 50 + 9}
            y2={toPos.y + 50 + 9}
            stroke="#000"
            strokeWidth={isCurrent ? 6 : 3}
            strokeOpacity={0.2}
            strokeLinecap="round"
          />
        );
        
        // Ligne principale
        pathLines.push(
          <line
            key={`${botId}-path-${i}`}
            x1={fromPos.x + 50 + 9}
            y1={fromPos.y + 50 + 9}
            x2={toPos.x + 50 + 9}
            y2={toPos.y + 50 + 9}
            stroke={botColor}
            strokeWidth={isCurrent ? 4 : 3}
            strokeOpacity={isVisited ? 0.4 : 1}
            strokeDasharray={isVisited ? '0' : '0'}
            strokeLinecap="round"
          />
        );
      }
    }
    
    return pathLines;
  };

  return (
    <section style={styles.section}>
      <h3>🗺️ Tile Matrix (Hexagonal)</h3>
      <div style={{
        ...styles.hexGrid,
        width: `${hexMaxX + 100}px`,
        height: `${hexMaxY + 100}px`,
      }}>
        {/* 🛤️ SVG layer for path lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {renderPathLines(bot0Data, '#22c55e', 'bot-0')}
          {renderPathLines(bot1Data, '#3b82f6', 'bot-1')}
        </svg>
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
            const tile = coordIndex.get(coord);
            const tileLegend = getTileLegend(coord as GridCoordinate);
            
            // 🛤️ PATHFINDING: Check if tile is on current path
            const pathInfo = getPathInfo(coord as GridCoordinate);
            const pathBorderColor = pathInfo.isOnPath 
              ? (pathInfo.botId === 'bot-0' ? '#22c55e' : '#3b82f6')
              : 'transparent';
            const pathBorderWidth = pathInfo.isOnPath ? 3 : 0;
            
            // Calculer les ressources totales de la tuile
            const tileResources = React.useMemo(() => {
              const total = (tile?.resources?.total ?? 0);
              return total;
            }, [tile]);
            
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
              >
                {/* Tooltip personnalisé */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s ease',
                    zIndex: 1000,
                  }}
                  className="tile-tooltip"
                >
                  <div
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      minWidth: '140px',
                    }}
                  >
                    {/* Header avec label et légende */}
                    <div
                      style={{
                        backgroundColor: color.includes('rgba') ? '#f5f5f5' : color,
                        color: color.includes('rgba') ? '#333' : '#fff',
                        padding: '6px 10px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      <div>{label}</div>
                      <div style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.85, marginTop: '2px' }}>
                        {tileLegend.icon} {tileLegend.label}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div style={{ padding: '8px 10px', fontSize: '10px', color: '#666' }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#999' }}>Coord:</span> {coord}
                      </div>
                      {tileResources > 0 && (
                        <div>
                          <span style={{ color: '#999' }}>Ressources:</span> {tileResources}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trigger pour le tooltip */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.parentElement?.querySelector('.tile-tooltip') as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.parentElement?.querySelector('.tile-tooltip') as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '0';
                  }}
                >
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: color,
                    borderColor: color.includes('rgba(200') ? '#ddd' : 'transparent',
                    borderWidth: color.includes('rgba(200') ? '1px' : '0px',
                    borderStyle: 'dashed',
                    outline: isBase ? '2px solid #000' : 
                             pathInfo.isOnPath ? `${pathBorderWidth}px solid ${pathBorderColor}` : 'none',
                    boxShadow: pathInfo.isOnPath ? `0 0 8px ${pathBorderColor}88` : 'none',
                    position: 'relative',
                  }}
                >
                  {/* 🛤️ PATHFINDING: Show path step indicator */}
                  {pathInfo.isOnPath && !hasEntity && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        color: pathBorderColor,
                        textShadow: '0 0 3px #fff',
                        pointerEvents: 'none',
                      }}
                    >
                      {pathInfo.isVisited ? '✓' : '●'}
                    </div>
                  )}
                  
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
                </div>
                
                {/* Label sous la tuile (A1, B2, etc.) avec légère opacité */}
                <div style={{ ...styles.label, opacity: 0.6 }}>
                  {label}
                </div>
              </div>
            );
          })}
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
    backgroundColor: 'transparent',
    overflow: 'auto',
    maxHeight: '90vh',
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

