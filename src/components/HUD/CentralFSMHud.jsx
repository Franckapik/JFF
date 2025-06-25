import React from 'react';
import { useFSM } from '../../hooks/useFSM';

export default function CentralFSMHud() {
  const { fsmState, send } = useFSM();

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      background: 'rgba(30,30,40,0.95)',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: 10,
      boxShadow: '0 2px 12px #0008',
      zIndex: 2000,
      fontFamily: 'monospace',
      minWidth: 220
    }}>
      <div style={{fontWeight: 'bold', marginBottom: 8}}>FSM Central HUD</div>
      <div>État courant&nbsp;: <b>{String(fsmState?.value)}</b></div>
      <button
        style={{marginTop: 12, padding: '6px 14px', borderRadius: 5, border: 'none', background: '#4444ff', color: '#fff', cursor: 'pointer'}}
        onClick={() => send({ type: 'EVALUATION_COMPLETE' })}
      >
        Envoyer EVALUATION_COMPLETE
      </button>
    </div>
  );
}
