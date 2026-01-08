import React from 'react';

import useBotSelectionStore from '../stores/useBotSelectionStore';
import useXFSMStore from '../stores/useXFSMStore';
import type { GridCoordinate } from '../types/coordinates.d';

type RouteData = {
  currentPath: GridCoordinate[];
  pathIndex: number;
  shipCoord: GridCoordinate | null;
};

/**
 * Convertir les coordonnées q,r en format simple (A1, B2, ...)
 */
function getSimpleCoordLabel(coord: GridCoordinate): string {
  const [q, r] = coord.split(',').map(Number);
  const colLetter = String.fromCharCode(65 + q); // A, B, C, ...
  const rowNum = r + 1; // 1, 2, 3, ...
  return `${colLetter}${rowNum}`;
}

function SingleBotRoute({ botId }: { botId: 'bot-0' | 'bot-1' }) {
  const getActor = useXFSMStore((state) => state.getActor);
  const [routeData, setRouteData] = React.useState<RouteData & {
    isMovingToStation?: boolean;
    stationType?: 'fuel' | 'repair';
    targetTileType?: string;
  }>({
    currentPath: [],
    pathIndex: 0,
    shipCoord: null,
  });

  React.useEffect(() => {
    const actor = getActor(botId);
    if (!actor) return;

    const subscription = actor.subscribe((snapshot) => {
      const ctx = snapshot.context;
      setRouteData({
        currentPath: ctx.vehicle?.currentPath || [],
        pathIndex: ctx.vehicle?.pathIndex ?? 0,
        shipCoord: ctx.vehicle?.coord || null,
        isMovingToStation: ctx.vehicle?.isMovingToStation,
        stationType: ctx.vehicle?.stationType,
        targetTileType: ctx.vehicle?.targetVehicleTile?.type,
      });
    });

    return () => subscription.unsubscribe();
  }, [getActor, botId]);

  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';

  if (routeData.currentPath.length === 0) {
    return null;
  }

  // 🆕 Déterminer le type de destination pour afficher un label
  const destinationEmoji = routeData.isMovingToStation
    ? routeData.stationType === 'fuel' ? '⛽' : '🔧'
    : routeData.targetTileType === 'resource' ? '📦'
    : routeData.targetTileType === 'danger' ? '⚠️'
    : '🎯';

  return (
    <div style={styles.routeItem}>
      <div style={styles.routeHeader}>
        <span style={{ ...styles.routeTitle, color: borderColor }}>
          {botId === 'bot-0' ? '🛣️ Bot-0' : '🛣️ Bot-1'}
        </span>
        <span style={{ ...styles.progressLabel, color: routeData.isMovingToStation ? '#ff6b00' : '#666' }}>
          {routeData.pathIndex + 1}/{routeData.currentPath.length} {destinationEmoji}
        </span>
      </div>
      
      <div style={styles.routePath}>
        {routeData.currentPath.map((coord, idx) => {
          const simpleLabel = getSimpleCoordLabel(coord);
          const isCurrent = idx === routeData.pathIndex;
          const isVisited = idx < routeData.pathIndex;
          const isTarget = idx === routeData.currentPath.length - 1;
          
          return (
            <React.Fragment key={`${botId}-${idx}`}>
              {isCurrent && (
                <span style={{ ...styles.pathCoord, backgroundColor: borderColor, color: '#fff' }}>
                  {simpleLabel}
                </span>
              )}
              {!isCurrent && isTarget && (
                // 🆕 STATION SUPPORT: Marquer la destination avec couleur orange si station
                <span style={{ 
                  ...styles.pathCoord, 
                  opacity: isVisited ? 0.5 : 1, 
                  color: '#333',
                  backgroundColor: routeData.isMovingToStation ? '#fff3e0' : 'transparent',
                  border: routeData.isMovingToStation ? '2px solid #ff6b00' : 'none'
                }}>
                  {destinationEmoji} {simpleLabel}
                </span>
              )}
              {!isCurrent && !isTarget && (
                <span style={{ ...styles.pathCoord, opacity: isVisited ? 0.5 : 1, color: '#333' }}>
                  {simpleLabel}
                </span>
              )}
              {idx < routeData.currentPath.length - 1 && (
                <span style={styles.pathSeparator}>-</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Composant RouteDisplay: affiche les itinéraires en format horizontal simple
 * Format: A1 - A2 - B2 (actuelle surlignée)
 */
export default function RouteDisplay() {
  const selectedView = useBotSelectionStore((state) => state.selectedView);

  const showBot0 = selectedView === 'both' || selectedView === 'bot-0';
  const showBot1 = selectedView === 'both' || selectedView === 'bot-1';

  return (
    <section style={styles.section}>
      <h3 style={styles.sectionTitle}>🛣️ Itinéraires</h3>
      
      {showBot0 && <SingleBotRoute botId="bot-0" />}
      {showBot1 && <SingleBotRoute botId="bot-1" />}

      {(!showBot0 && !showBot1) && (
        <p style={styles.emptyText}>Aucun itinéraire actuellement</p>
      )}
    </section>
  );
}

const styles = {
  section: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  sectionTitle: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1f2937',
  } as React.CSSProperties,
  routeItem: {
    marginBottom: '8px',
  } as React.CSSProperties,
  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  } as React.CSSProperties,
  routeTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  progressLabel: {
    fontSize: '10px',
    color: '#999',
    fontWeight: 'bold',
  } as React.CSSProperties,
  routePath: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  } as React.CSSProperties,
  pathCoord: {
    padding: '4px 8px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  pathSeparator: {
    color: '#ccc',
    fontWeight: 'bold',
  } as React.CSSProperties,
  emptyText: {
    margin: 0,
    color: '#999',
    fontSize: '11px',
    fontStyle: 'italic',
  } as React.CSSProperties,
};
