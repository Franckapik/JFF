import React from 'react';

import { useBotStates } from '../hooks/useBotState.ts';
import type { Tile } from '../types/tile.d';

/**
 * Indicateur visuel pour détecter les doublons d'exploration
 * Affiche si des tuiles sont collectées sans avoir été explorées par les drones
 */
export const ExplorationIndicator: React.FC = () => {
  const botStates = useBotStates();
  
  // Récupérer les tuiles depuis le premier bot actif
  const tiles = React.useMemo(() => {
    // Prendre les tuiles du premier bot disponible
    const bot0 = botStates['bot-0'];
    if (bot0 && 'context' in bot0) {
      return (bot0.context as any).gridInfo?.tiles || {};
    }
    const bot1 = botStates['bot-1'];
    if (bot1 && 'context' in bot1) {
      return (bot1.context as any).gridInfo?.tiles || {};
    }
    return {};
  }, [botStates]);

  // Analyser les tuiles pour détecter les problèmes
  const stats = React.useMemo(() => {
    let totalTiles = 0;
    let exploredTiles = 0;
    let collectedTiles = 0;
    let collectedButNotExplored = 0;
    
    // Analyser les tuiles du store
    Object.values(tiles).forEach((tile: Tile) => {
      totalTiles++;
      
      if (tile.explored === true) {
        exploredTiles++;
      }
      
      if (tile.collected === true) {
        collectedTiles++;
        
        // Vérifier si collectée sans exploration
        if (tile.explored !== true) {
          collectedButNotExplored++;
        }
      }
    });
    
    return {
      totalTiles,
      exploredTiles,
      collectedTiles,
      collectedButNotExplored,
      explorationRate: totalTiles > 0 ? ((exploredTiles / totalTiles) * 100).toFixed(1) : '0.0'
    };
  }, [tiles]);

  // Déterminer la couleur de l'indicateur
  const getStatusColor = () => {
    if (stats.collectedButNotExplored > 0) {
      return '#FF5252'; // Rouge: problème détecté
    }
    if (stats.collectedTiles > 0 && stats.exploredTiles > 0) {
      return '#4CAF50'; // Vert: tout va bien
    }
    return '#FFC107'; // Jaune: pas encore de collecte
  };

  const statusColor = getStatusColor();
  const hasIssue = stats.collectedButNotExplored > 0;

  return (
    <div style={{
      position: 'fixed',
      top: 130,
      right: 20,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      minWidth: '250px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
      border: hasIssue ? `2px solid ${statusColor}` : 'none'
    }}>
      <h3 style={{ 
        margin: '0 0 10px 0', 
        color: statusColor,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {hasIssue ? '⚠️' : '🔍'} Exploration Status
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Tiles:</span>
          <strong>{stats.totalTiles}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>✅ Explored:</span>
          <strong>{stats.exploredTiles}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>📦 Collected:</span>
          <strong>{stats.collectedTiles}</strong>
        </div>
        
        <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          color: hasIssue ? statusColor : 'inherit',
          fontWeight: hasIssue ? 'bold' : 'normal'
        }}>
          <span>{hasIssue ? '❌' : '✓'} Unexplored Collected:</span>
          <strong>{stats.collectedButNotExplored}</strong>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>📊 Exploration Rate:</span>
          <strong>{stats.explorationRate}%</strong>
        </div>
        
        {hasIssue && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(255, 82, 82, 0.2)',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #FF5252'
          }}>
            ⚠️ Warning: {stats.collectedButNotExplored} tile(s) collected without drone exploration!
          </div>
        )}
        
        {!hasIssue && stats.collectedTiles > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(76, 175, 80, 0.2)',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #4CAF50'
          }}>
            ✓ All collected tiles were properly explored
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationIndicator;
