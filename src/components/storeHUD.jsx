import React, { useEffect, useState } from 'react';
import { useTileStore } from '../store/useTileStore'; // Use named import for useTileStore
import '../styles/App.css'; // Correct path to App.css

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
        className="hud-toggle-button"
      >
        {visible ? 'Cacher HUD (H)' : 'Afficher HUD (H)'}
      </button>

      {visible && (
        <div className="hud-container">
          <strong>État du Store :</strong>
          <ul>
            {Object.entries(state).map(([key, value]) => (
              <li key={key}>
                <span>{key}:</span> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default StoreHUD;
