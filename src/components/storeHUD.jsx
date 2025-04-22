import React, { useEffect, useState } from "react";
import { useTileStore } from "../store/useTileStore"; // Use named import for useTileStore
import "../styles/App.css"; // Correct path to App.css

const StoreHUD = () => {
  const state = useTileStore();
  const [visible, setVisible] = useState(false);

  // Toggle via touche "H"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "h") {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        className="hud-toggle-button"
      >
        {visible ? "Cacher HUD (H)" : "Afficher HUD (H)"}
      </button>

      {visible && (
        <div className="store-hud">
          <strong>État du Store :</strong>
          <ul>
            {Object.entries(state).map(([key, value]) => (
              <li key={key} className="store-hud-item">
                <span className="store-hud-key">{key}:</span>
                <div className="store-hud-value">
                  {typeof value === "object" ? (
                    <ul className="store-hud-sublist">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <li key={subKey}>
                          <span className="store-hud-subkey">{subKey}:</span>{" "}
                          {JSON.stringify(subValue)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    JSON.stringify(value)
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default StoreHUD;
