import React from 'react';
import VehicleList from './VehicleList';
import ShipResources from './ShipResources';
import ResourceBar from './ResourceBar';

/**
 * Composant pour l'affichage du score total du joueur
 */
const PlayerScore = ({ playerData }) => {
  const scoreResources = [
    {
      name: 'Food',
      value: playerData?.score?.resources?.food || 0,
      max: 100,
      color: "#8BC34A"
    },
    {
      name: 'Debris',
      value: playerData?.score?.resources?.debris || 0,
      max: 200,
      color: "#2196F3"
    },
    {
      name: 'Special',
      value: playerData?.score?.resources?.special || 0,
      max: 10,
      color: "#9C27B0"
    }
  ];

  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Score total</h3>
      
      {scoreResources.map((resource, index) => (
        <div key={index} className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">{resource.name}:</span>
            <span className="debugger-resource-value">
              {resource.value}
            </span>
          </div>
          <ResourceBar 
            value={resource.value} 
            max={resource.max}
            color={resource.color}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Composant pour l'affichage des données du vaisseau du joueur
 */
const PlayerShipData = ({ playerVehicle }) => {
  const shipData = [
    {
      label: 'Position',
      value: playerVehicle?.coord || "Inconnue"
    },
    {
      label: 'En mouvement',
      value: playerVehicle?.isMoving ? "Oui" : "Non",
      className: playerVehicle?.isMoving ? 'debugger-value-active' : 'debugger-value-inactive'
    },
    {
      label: 'À capacité max',
      value: playerVehicle?.isAtCapacity ? "Oui" : "Non",
      className: playerVehicle?.isAtCapacity ? 'debugger-value-warning' : 'debugger-value-ok'
    },
    {
      label: 'Santé',
      value: `${playerVehicle?.health || 100}/100`,
      className: (playerVehicle?.health || 100) < 50 ? 'debugger-value-warning' : 'debugger-value-ok'
    }
  ];

  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Données du vaisseau</h3>
      <div className="debugger-ship-data">
        {shipData.map((data, index) => (
          <div key={index} className="debugger-data-item">
            <span className="debugger-label">{data.label}:</span>
            <span className={`debugger-value ${data.className || ''}`}>
              {data.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Composant principal pour l'onglet Joueur
 */
const PlayerTab = ({ playerVehicle, playerData, isVehicleActive }) => {
  if (!playerVehicle || !playerData) {
    return <div className="debugger-empty-message">Données du joueur non disponibles</div>;
  }

  return (
    <div className="debugger-tab-content">
      <div className="debugger-section">
        <h3 className="debugger-section-title">État du joueur</h3>
        <div className="debugger-state-current">
          <span className="debugger-label">Joueur:</span>
          <span className="debugger-value debugger-highlight">Humain (Player 1)</span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">En jeu:</span>
          <span className="debugger-value debugger-value-active">
            Oui
          </span>
        </div>
        <div className="debugger-state-running">
          <span className="debugger-label">Score:</span>
          <span className="debugger-value debugger-highlight">
            {playerData?.score?.total || 0} points
          </span>
        </div>
      </div>

      <VehicleList 
        playerId="player-1" 
        isVehicleActive={isVehicleActive} 
      />

      <PlayerShipData playerVehicle={playerVehicle} />

      <ShipResources vehicle={playerVehicle} />

      <PlayerScore playerData={playerData} />
    </div>
  );
};

export default PlayerTab;
