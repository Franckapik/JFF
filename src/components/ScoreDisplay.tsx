import React from 'react';

import { useBotStates } from '../hooks/useBotState.ts';
import { useUI } from '../contexts/UIContext';

/**
 * ✅ Phase 4 Migration: Now uses useBotStates hook (auto-switches between worker/xfsm)
 */

/**
 * Type guard pour vérifier si un snapshot a un contexte valide
 */
function hasValidContext(snapshot: unknown): snapshot is { context: { score?: { resources?: { food: number; debris: number; special: number; total: number } } } } {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    typeof (snapshot as { context: unknown }).context === 'object'
  );
}

// Composant interne pour un seul bot
function SingleBotScore({ botId, compact = false }: { botId: 'bot-0' | 'bot-1'; compact?: boolean }) {
  // ✅ Phase 4: Use unified hook instead of useXFSMStore directly
  const botStates = useBotStates();
  const botSnapshot = botStates[botId];
  
  let score = { food: 0, debris: 0, special: 0, total: 0 };
  if (hasValidContext(botSnapshot)) {
    score = botSnapshot.context.score?.resources || score;
  }

  const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';

  return (
    <div style={{
      padding: compact ? '8px' : '10px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '6px',
      borderLeft: `3px solid ${borderColor}`,
      flex: 1,
    }}>
      <h4 style={{ margin: '0 0 6px 0', fontSize: compact ? '10px' : '12px', color: borderColor }}>
        {botId === 'bot-0' ? '🏆 Bot-0' : '🏆 Bot-1'}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: compact ? '10px' : '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🍎</span><span style={{ color: '#FFB74D' }}>{score.food}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🔩</span><span style={{ color: '#90A4AE' }}>{score.debris}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>⭐</span><span style={{ color: '#E1BEE7' }}>{score.special}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid #555', paddingTop: '4px', marginTop: '2px' }}>
          <span>Σ</span><span style={{ color: '#4CAF50' }}>{score.total}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to display the current score from the FSM context
 * Supports multi-bot display according to selectedView
 */
export const ScoreDisplay: React.FC = () => {
  const { selectedView } = useUI();

  // Mode "both": afficher les deux bots côte à côte
  if (selectedView === 'both') {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🏆 Score Global</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SingleBotScore botId="bot-0" compact />
          <SingleBotScore botId="bot-1" compact />
        </div>
      </div>
    );
  }

  // Mode single bot
  const botId = selectedView as 'bot-0' | 'bot-1';
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🏆 Score Global</h3>
      <SingleBotScore botId={botId} />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 20,
    right: 20,
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    minWidth: '180px',
    maxWidth: '320px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  } as React.CSSProperties,
  title: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    color: '#4CAF50',
  } as React.CSSProperties,
};

export default ScoreDisplay;