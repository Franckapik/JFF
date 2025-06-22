import React, { useState, useEffect } from 'react';
import { useTileStore } from '../../stores/useTileStore';

/**
 * ===================================================================
 * TILE STORE MONITOR - HUD de diagnostic
 * ===================================================================
 * 
 * Composant de débogage pour surveiller l'état du TileStore en temps réel.
 * Affiche :
 * - Nombre total de tuiles
 * - Tuiles explorées, collectées
 * - Détails d'une tuile sélectionnée
 * - Log des changements d'état
 */
const TileStoreMonitor = ({ isVisible = true, position = 'top-right' }) => {
  const [selectedCoord, setSelectedCoord] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Sélecteurs du TileStore
  const tiles = useTileStore((state) => state.tiles);
  const hoveredTile = useTileStore((state) => state.hoveredTile);
  
  // Force refresh pour déclencher le re-render
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRefreshCount(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);
  
  // Auto-sélection de la tuile survolée
  useEffect(() => {
    if (hoveredTile) {
      setSelectedCoord(hoveredTile);
    }
  }, [hoveredTile]);
  
  // Calculs des statistiques
  const stats = React.useMemo(() => {
    const allTiles = Object.values(tiles);
    return {
      total: allTiles.length,
      explored: allTiles.filter(tile => tile.explored === true).length,
      collected: allTiles.filter(tile => tile.collected === true).length,
      withResources: allTiles.filter(tile => tile.resourcePercentage > 0).length,
      depart: allTiles.filter(tile => tile.type === 'depart').length,
    };
  }, [tiles, refreshCount]);
  
  // Tuile sélectionnée
  const selectedTile = selectedCoord ? tiles[selectedCoord] : null;
  
  // Styles du HUD
  const getPositionStyles = () => {
    const base = {
      position: 'fixed',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: 'min(350px, 90vw)', // Responsive max width
      minWidth: '280px',
      border: '1px solid #333',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
      overflow: 'hidden',
    };
    
    switch (position) {
      case 'top-left':
        return { ...base, top: '10px', left: '10px' };
      case 'top-right':
        return { ...base, top: '10px', right: '10px' };
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' };
      case 'bottom-right':
        return { ...base, bottom: '10px', right: '10px' };
      default:
        return { ...base, top: '10px', right: '10px' };
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div style={getPositionStyles()}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #555', paddingBottom: '8px', marginBottom: '8px' }}>
        <strong>🗺️ TileStore Monitor</strong>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          style={{
            marginLeft: '10px',
            padding: '2px 6px',
            fontSize: '10px',
            backgroundColor: autoRefresh ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          {autoRefresh ? '⏸️ Pause' : '▶️ Auto'}
        </button>
      </div>
      
      {/* Statistiques globales */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: '#87CEEB', fontWeight: 'bold', marginBottom: '4px' }}>
          📊 Statistiques Globales
        </div>
        <div>Total: {stats.total} tuiles</div>
        <div style={{ color: '#00ff88' }}>✅ Explorées: {stats.explored}</div>
        <div style={{ color: '#ff6b6b' }}>📦 Collectées: {stats.collected}</div>
        <div style={{ color: '#ff9933' }}>💎 Avec ressources: {stats.withResources}</div>
        <div style={{ color: '#9966ff' }}>🏠 Bases: {stats.depart}</div>
        
        {/* Statistiques de collecte additionnelles */}
        <div style={{ marginTop: '4px', fontSize: '10px', color: '#ccc' }}>
          {(() => {
            const recentlyCollected = Object.values(tiles).filter(tile => 
              tile.lastCollectedTimestamp && 
              Date.now() - tile.lastCollectedTimestamp < 30000 // 30 secondes
            );
            const totalResourcesCollected = Object.values(tiles).reduce((total, tile) => 
              total + (tile.totalResourcesCollected || 0), 0
            );
            return (
              <>
                <div>⏰ Collectées récemment: {recentlyCollected.length}</div>
                <div>💰 Ressources totales collectées: {totalResourcesCollected}</div>
              </>
            );
          })()}
        </div>
      </div>
      
      {/* Sélecteur de tuile */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: '#87CEEB', fontWeight: 'bold', marginBottom: '4px' }}>
          🎯 Tuile Sélectionnée
        </div>
        <input
          type="text"
          placeholder="ex: 2,3"
          value={selectedCoord || ''}
          onChange={(e) => setSelectedCoord(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '3px',
            fontSize: '11px',
            boxSizing: 'border-box',
            minWidth: 0,
          }}
        />
        {hoveredTile && (
          <div style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>
            🖱️ Survol: {hoveredTile}
          </div>
        )}
      </div>
      
      {/* Détails de la tuile sélectionnée */}
      {selectedTile ? (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#87CEEB', fontWeight: 'bold', marginBottom: '4px' }}>
            📋 Détails de {selectedCoord}
          </div>
          <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
            <div>Type: {selectedTile.type || 'normal'}</div>
            <div>Position: x={selectedTile.position?.x}, z={selectedTile.position?.z}</div>
            <div style={{ color: selectedTile.explored ? '#00ff88' : '#ccc' }}>
              Explorée: {selectedTile.explored ? '✅ OUI' : '❌ NON'}
            </div>
            <div style={{ color: selectedTile.collected ? '#ff6b6b' : '#ccc' }}>
              Collectée: {selectedTile.collected ? '✅ OUI' : '❌ NON'}
            </div>
            <div>Ressources: {selectedTile.resourcePercentage || 0}%</div>
            {selectedTile.lastCollectedTimestamp && (
              <div style={{ color: '#00ffff' }}>
                Dernière collecte: {new Date(selectedTile.lastCollectedTimestamp).toLocaleTimeString()}
              </div>
            )}
            {selectedTile.totalResourcesCollected > 0 && (
              <div style={{ color: '#ffd700' }}>
                Total collecté: {selectedTile.totalResourcesCollected} ressources
              </div>
            )}
            {selectedTile.resources && (
              <div style={{ marginLeft: '10px', fontSize: '9px' }}>
                Food: {selectedTile.resources.food || 0} | 
                Debris: {selectedTile.resources.debris || 0} | 
                Special: {selectedTile.resources.special || 0}
              </div>
            )}
            {selectedTile.playerId && (
              <div>Joueur: {selectedTile.playerId}</div>
            )}
          </div>
        </div>
      ) : selectedCoord ? (
        <div style={{ color: '#ff6b6b', fontSize: '10px' }}>
          ❌ Tuile "{selectedCoord}" introuvable
        </div>
      ) : null}
      
      {/* Actions rapides */}
      <div>
        <div style={{ color: '#87CEEB', fontWeight: 'bold', marginBottom: '4px' }}>
          ⚡ Actions Rapides
        </div>
        <div style={{ fontSize: '10px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          <button
            onClick={() => {
              const explored = Object.entries(tiles)
                .filter(([coord, tile]) => tile.explored === true)
                .map(([coord]) => coord);
              console.log('🗺️ Tuiles explorées:', explored);
            }}
            style={{
              padding: '3px 6px',
              fontSize: '9px',
              backgroundColor: '#00ff88',
              color: 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: '70px',
            }}
          >
            Log Explorées
          </button>
          <button
            onClick={() => {
              console.log('🗺️ État complet TileStore:', tiles);
            }}
            style={{
              padding: '3px 6px',
              fontSize: '9px',
              backgroundColor: '#87CEEB',
              color: 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: '70px',
            }}
          >
            Log Complet
          </button>
          <button
            onClick={() => {
              // Test: marquer la tuile 0,0 comme explorée
              const testCoord = '0,0';
              const markTileAsExplored = useTileStore.getState().markTileAsExplored;
              markTileAsExplored(testCoord);
              console.log(`🧪 Test: Tuile ${testCoord} marquée comme explorée`);
            }}
            style={{
              padding: '3px 6px',
              fontSize: '9px',
              backgroundColor: '#FFD700',
              color: 'black',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              flex: '1 1 auto',
              minWidth: '70px',
            }}
          >
            Test 0,0
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileStoreMonitor;
