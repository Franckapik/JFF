import React, { useEffect, useState } from 'react';
import { useTileStore } from '../store/useTileStore'; // Use named import for useTileStore

const StoreHUD = () => {
  const state = useTileStore();
  const [visible, setVisible] = useState(false);

  // Toggle via touche "H"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'h') {
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setVisible(v => !v)}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '6px 10px',
          borderRadius: '6px',
          background: '#222',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        {visible ? 'Cacher HUD (H)' : 'Afficher HUD (H)'}
      </button>

      {visible && (
        <div
          style={{
            position: 'fixed',
            top: 50,
            right: 10,
            zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            color: '#0f0',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '80vh',
            overflowY: 'auto',
            maxWidth: '300px',
          }}
        >
          <strong style={{ color: '#fff' }}>État du Store :</strong>
          <ul style={{ padding: 0, margin: '8px 0', listStyle: 'none' }}>
            {Object.entries(state).map(([key, value]) => (
              <li key={key} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#0ff' }}>{key}:</span>{' '}
                {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default StoreHUD;
