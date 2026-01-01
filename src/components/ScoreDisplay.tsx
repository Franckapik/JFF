import React from 'react';

import useXFSMStore from '../stores/useXFSMStore';

/**
 * Type guard pour vérifier si un snapshot a un contexte valide
 */
function hasValidContext(snapshot: unknown): snapshot is { context: { score?: { resources?: { food: number; debris: number; special: number; total: number } } } } {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    typeof (snapshot as any).context === 'object'
  );
}

/**
 * Component to display the current score from the FSM context
 * Shows total score and breakdown by resource type
 */
export const ScoreDisplay: React.FC = () => {
  // Utiliser directement le store Zustand pour récupérer le snapshot
  const botStates = useXFSMStore((state) => state.botStates);
  const botSnapshot = botStates['bot-0'];
  
  // Extraire le score du contexte FSM avec type safety
  let score = { food: 0, debris: 0, special: 0, total: 0 };
  if (hasValidContext(botSnapshot)) {
    score = botSnapshot.context.score?.resources || score;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '14px',
      minWidth: '200px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>🏆 Score Global</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🍎 Food:</span>
          <span style={{ color: '#FFB74D' }}>{score.food}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🔩 Debris:</span>
          <span style={{ color: '#90A4AE' }}>{score.debris}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>⭐ Special:</span>
          <span style={{ color: '#E1BEE7' }}>{score.special}</span>
        </div>
        <hr style={{ margin: '8px 0', border: '1px solid #555' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>📊 Total:</span>
          <span style={{ color: '#4CAF50', fontSize: '16px' }}>{score.total}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;