import React from 'react';

import { useBotStates } from '../hooks/useBotState.ts';
import { useUI } from '../contexts/UIContext';
import { useTileStore } from '../stores/useTileStore';
import type { GridCoordinate } from '../types/coordinates.d';

/**
 * ✅ Phase 4 Migration: Now uses useBotStates hook (auto-switches between worker/xfsm)
 */

/**
 * Type guard pour vérifier si un snapshot a un contexte valide avec score
 */
function hasValidContext(snapshot: unknown): snapshot is { 
  context: { 
    score?: { 
      resources?: { 
        food: number; 
        debris: number; 
        special: number; 
        total: number;
      } 
    } 
  } 
} {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    typeof (snapshot as { context: unknown }).context === 'object'
  );
}

// Composant interne pour un seul bot
function SingleBotCollected({ 
  botId, 
  compact = false 
}: { 
  botId: 'bot-0' | 'bot-1'; 
  compact?: boolean;
}) {
  const tiles = useTileStore((state) => state.tiles);
  // ✅ Phase 4: Use unified hook instead of useXFSMStore directly
  const botStates = useBotStates();
  const botSnapshot = botStates[botId];

  const scoreFromFSM = React.useMemo(() => {
    let score = { food: 0, debris: 0, special: 0, total: 0 };
    if (hasValidContext(botSnapshot)) {
      score = botSnapshot.context.score?.resources || score;
    }
    return score;
  }, [botSnapshot]);

  // Filtrer les tuiles collectées par ce bot
  const collectedTiles = React.useMemo(() => {
    return Object.entries(tiles)
      .filter(([, tile]) => tile.collected && tile.collectedBy === botId)
      .sort(([coordA], [coordB]) => {
        const [aq, ar] = coordA.split(',').map(Number);
        const [bq, br] = coordB.split(',').map(Number);
        return aq === bq ? ar - br : aq - bq;
      })
      .map(([coord, tile]) => ({
        coord: coord as GridCoordinate,
        type: tile.type || 'unknown',
      }));
  }, [tiles, botId]);

  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';

  return (
    <div style={{ 
      ...styles.singleBot, 
      borderLeftColor: borderColor,
      flex: 1,
    }}>
      <h4 style={{ ...styles.botTitle, color: borderColor }}>
        {botId === 'bot-0' ? '📦 Bot-0' : '📦 Bot-1'} ({collectedTiles.length})
      </h4>
      
      <div style={styles.totalsGridCompact}>
        <span>🍖 {scoreFromFSM.food}</span>
        <span>🗑️ {scoreFromFSM.debris}</span>
        <span>⭐ {scoreFromFSM.special}</span>
        <span style={{ fontWeight: 'bold' }}>Σ {scoreFromFSM.total}</span>
      </div>

      <div style={{ ...styles.listContainer, maxHeight: compact ? '120px' : '200px' }}>
        {collectedTiles.length === 0 ? (
          <p style={{ color: '#999', fontSize: '10px', fontStyle: 'italic' }}>Aucune</p>
        ) : (
          collectedTiles.slice(0, compact ? 5 : 10).map((tile) => (
            <div key={tile.coord} style={styles.tileItemCompact}>
              <span style={styles.tileCoordCompact}>{tile.coord}</span>
              <span style={styles.tileTypeCompact}>{tile.type}</span>
            </div>
          ))
        )}
        {collectedTiles.length > (compact ? 5 : 10) && (
          <div style={{ fontSize: '9px', color: '#999', textAlign: 'center' }}>
            +{collectedTiles.length - (compact ? 5 : 10)} autres...
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant affichant la liste des tuiles collectées
 * Supporte l'affichage multi-bots selon selectedView
 * 
 * IMPORTANT: Tous les hooks doivent être appelés inconditionnellement
 * pour respecter les règles des Hooks React
 * 
 * ✅ Phase 4 Migration: Uses useBotStates hook
 */
export default function CollectedTilesList() {
  const { selectedView } = useUI();
  const tiles = useTileStore((state) => state.tiles);
  // ✅ Phase 4: Use unified hook instead of useXFSMStore directly
  const botStates = useBotStates();

  // Déterminer quel bot afficher en mode single (toujours calculé)
  const singleBotId = (selectedView === 'both' ? 'bot-0' : selectedView) as 'bot-0' | 'bot-1';
  const botSnapshot = botStates[singleBotId];

  // TOUS les hooks doivent être appelés à chaque render, même en mode "both"
  // Extraire le score du contexte FSM (utilisé en mode single)
  const scoreFromFSM = React.useMemo(() => {
    let score = { food: 0, debris: 0, special: 0, total: 0 };
    if (hasValidContext(botSnapshot)) {
      score = botSnapshot.context.score?.resources || score;
    }
    return score;
  }, [botSnapshot]);

  // Filtrer les tuiles collectées par ce bot (utilisé en mode single)
  const collectedTiles = React.useMemo(() => {
    return Object.entries(tiles)
      .filter(([, tile]) => tile.collected && tile.collectedBy === singleBotId)
      .sort(([coordA], [coordB]) => {
        const [aq, ar] = coordA.split(',').map(Number);
        const [bq, br] = coordB.split(',').map(Number);
        return aq === bq ? ar - br : aq - bq;
      })
      .map(([coord, tile]) => ({
        coord: coord as GridCoordinate,
        type: tile.type || 'unknown',
        biome: tile.biome || 'unknown',
        resources: { food: 0, debris: 0, special: 0, total: 0 },
        explored: tile.explored || false,
      }));
  }, [tiles, singleBotId]);

  // Utiliser le score global (qui contient les ressources réellement collectées)
  const totals = React.useMemo(() => {
    return {
      food: scoreFromFSM.food,
      debris: scoreFromFSM.debris,
      special: scoreFromFSM.special,
      total: scoreFromFSM.total,
    };
  }, [scoreFromFSM]);

  // Générer le texte copiable
  const copyableText = React.useMemo(() => {
    const lines = [
      `📦 Tuiles collectées (${collectedTiles.length})`,
      `=====================================`,
      '',
      ...collectedTiles.map((tile) => {
        const explored = tile.explored ? '✓' : '✗';
        return `${tile.coord} [${tile.type}/${tile.biome}] ${explored}`;
      }),
      '',
      `-------------------------------------`,
      `SCORE TOTAL: Food=${totals.food}, Debris=${totals.debris}, Special=${totals.special}, Total=${totals.total}`,
    ];
    return lines.join('\n');
  }, [collectedTiles, totals]);

  // Copier dans le presse-papier
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(copyableText).then(() => {
      alert('📋 Liste copiée dans le presse-papier !');
    });
  }, [copyableText]);

  // ============================================
  // RENDU CONDITIONNEL (après tous les hooks)
  // ============================================

  // Mode "both": afficher les deux bots côte à côte
  if (selectedView === 'both') {
    return (
      <section style={styles.section}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>📦 Tuiles Collectées</h3>
        <div style={styles.dualContainer}>
          <SingleBotCollected botId="bot-0" compact />
          <SingleBotCollected botId="bot-1" compact />
        </div>
      </section>
    );
  }

  // Mode single bot - version complète
  if (collectedTiles.length === 0) {
    return (
      <section style={styles.section}>
        <h3>📦 Tuiles Collectées</h3>
        <p style={{ color: '#999', fontStyle: 'italic' }}>Aucune tuile collectée pour le moment</p>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>📦 Tuiles Collectées ({collectedTiles.length})</h3>
        <button onClick={handleCopy} style={styles.copyButton}>
          📋 Copier
        </button>
      </div>

      {/* Totaux */}
      <div style={styles.totalsGrid}>
        <div style={styles.totalItem}>
          <span style={styles.totalLabel}>🍖 Food:</span>
          <span style={styles.totalValue}>{totals.food}</span>
        </div>
        <div style={styles.totalItem}>
          <span style={styles.totalLabel}>🗑️ Debris:</span>
          <span style={styles.totalValue}>{totals.debris}</span>
        </div>
        <div style={styles.totalItem}>
          <span style={styles.totalLabel}>⭐ Special:</span>
          <span style={styles.totalValue}>{totals.special}</span>
        </div>
        <div style={styles.totalItem}>
          <span style={styles.totalLabel}>📊 Total:</span>
          <span style={styles.totalValue}>{totals.total}</span>
        </div>
      </div>

      {/* Liste scrollable */}
      <div style={styles.listContainer}>
        {collectedTiles.map((tile) => (
          <div key={tile.coord} style={styles.tileItem}>
            <div style={styles.tileHeader}>
              <span style={styles.tileCoord}>{tile.coord}</span>
              <span style={styles.tileExplored}>
                {tile.explored ? '✓ Explorée' : '✗ Non explorée'}
              </span>
            </div>
            <div style={styles.tileInfo}>
              <span style={styles.tileMeta}>
                {tile.type} / {tile.biome}
              </span>
              <span style={{ color: '#999', fontSize: '0.85em', marginLeft: '8px' }}>
                ✅ Collectée
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    borderLeft: '4px solid #8b5cf6',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,
  dualContainer: {
    display: 'flex',
    gap: '10px',
  } as React.CSSProperties,
  singleBot: {
    padding: '8px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
    borderLeft: '3px solid',
  } as React.CSSProperties,
  botTitle: {
    margin: '0 0 6px 0',
    fontSize: '11px',
    fontWeight: 600,
  } as React.CSSProperties,
  totalsGridCompact: {
    display: 'flex',
    gap: '8px',
    fontSize: '9px',
    marginBottom: '6px',
    color: '#666',
  } as React.CSSProperties,
  tileItemCompact: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 6px',
    marginBottom: '2px',
    backgroundColor: '#fff',
    borderRadius: '3px',
    fontSize: '9px',
    border: '1px solid #eee',
  } as React.CSSProperties,
  tileCoordCompact: {
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  tileTypeCompact: {
    color: '#999',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  } as React.CSSProperties,
  copyButton: {
    padding: '6px 12px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  totalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginBottom: '15px',
  } as React.CSSProperties,
  totalItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '12px',
  } as React.CSSProperties,
  totalLabel: {
    fontWeight: 'bold',
    color: '#666',
  } as React.CSSProperties,
  totalValue: {
    fontWeight: 'bold',
    color: '#8b5cf6',
  } as React.CSSProperties,
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: '150px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    padding: '4px',
  } as React.CSSProperties,
  tileItem: {
    padding: '10px',
    marginBottom: '8px',
    backgroundColor: '#fafafa',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  tileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  } as React.CSSProperties,
  tileCoord: {
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#1f2937',
  } as React.CSSProperties,
  tileExplored: {
    fontSize: '10px',
    color: '#6b7280',
  } as React.CSSProperties,
  tileInfo: {
    marginBottom: '6px',
  } as React.CSSProperties,
  tileMeta: {
    fontSize: '11px',
    color: '#9ca3af',
  } as React.CSSProperties,
  tileResources: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  resourceBadge: {
    padding: '2px 6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#374151',
  } as React.CSSProperties,
  resourceTotal: {
    backgroundColor: '#8b5cf6',
    color: 'white',
  } as React.CSSProperties,
};
