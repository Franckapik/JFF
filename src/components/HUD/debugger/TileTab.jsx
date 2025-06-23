import React from 'react';
import ResourceBar from './ResourceBar';
import { getTileCollectionStateLabel } from '../../../stores/useTileStore/slices/tileResourceSlice';

/**
 * Composant pour les informations de base d'une tuile
 */
const TileInfo = ({ hoveredTile, hoveredTileCoord }) => {
  const tileData = [
    {
      label: 'Coordonnées',
      value: hoveredTileCoord
    },
    {
      label: 'Type',
      value: hoveredTile.type || "Standard"
    },
    {
      label: 'Status',
      value: getTileCollectionStateLabel(hoveredTile)
    },
    {
      label: 'Explorée',
      value: hoveredTile.explored ? "Oui" : "Non"
    }
  ];

  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Informations sur la tuile</h3>
      
      <div className="debugger-tile-info">
        {tileData.map((data, index) => (
          <div key={index} className="debugger-data-item">
            <span className="debugger-label">{data.label}:</span>
            <span className="debugger-value">{data.value}</span>
          </div>
        ))}
        
        {hoveredTile.walkable === false && (
          <div className="debugger-warning-message">
            <span>Attention: Tuile non praticable!</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Composant pour les ressources d'une tuile
 */
const TileResources = ({ hoveredTile, getTileResourceBarStyle }) => {
  if (!hoveredTile.resources) {
    return null;
  }

  const resources = [
    {
      name: 'Food',
      value: hoveredTile.resources.food || 0
    },
    {
      name: 'Debris',
      value: hoveredTile.resources.debris || 0
    },
    {
      name: 'Special',
      value: hoveredTile.resources.special || 0
    }
  ];

  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Ressources</h3>
      
      {resources.map((resource, index) => (
        <div key={index} className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">{resource.name}:</span>
            <span className="debugger-resource-value">
              {resource.value}
            </span>
          </div>
          <ResourceBar 
            value={resource.value} 
            max={10}
            color={getTileResourceBarStyle(resource.value).backgroundColor}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Composant pour les propriétés spéciales d'une tuile
 */
const TileSpecialProperties = ({ hoveredTile }) => {
  if (!hoveredTile.type) {
    return null;
  }

  const getSpecialContent = () => {
    switch (hoveredTile.type) {
      case 'station':
        return (
          <div className="debugger-tile-station">
            <p>
              <strong>Station</strong> - Permet de ravitailler et réparer les vaisseaux
            </p>
          </div>
        );
      case 'danger':
        return (
          <div className="debugger-tile-danger">
            <p>
              <strong>Zone Dangereuse</strong> - Les vaisseaux peuvent subir des dommages dans cette zone
            </p>
          </div>
        );
      case 'base':
      case 'depart':
        return (
          <div className="debugger-tile-base">
            <p>
              <strong>Base</strong> - Revenez ici pour déposer vos ressources
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`debugger-section debugger-tile-special debugger-tile-type-${hoveredTile.type}`}>
      <h3 className="debugger-section-title">Propriétés spéciales</h3>
      {getSpecialContent()}
    </div>
  );
};

/**
 * Composant pour les distances depuis la tuile (Bot-only)
 */
const TileDistances = ({ 
  botVehicle, 
  hoveredTileCoord, 
  hoveredTile, 
  calculateDistance, 
  currentBotIndex 
}) => {
  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Distances</h3>
      
      {botVehicle?.coord && hoveredTileCoord && (
        <div className="debugger-data-item">
          <span className="debugger-label">Distance Bot {currentBotIndex + 1}:</span>
          <span className="debugger-value">
            {calculateDistance(botVehicle.coord, hoveredTileCoord, true, true)} tuiles
          </span>
        </div>
      )}
      
      {botVehicle?.position && hoveredTile?.position && (
        <div className="debugger-data-item">
          <span className="debugger-label">Distance euclidienne:</span>
          <span className="debugger-value">
            {Math.sqrt(
              Math.pow(botVehicle.position.x - hoveredTile.position.x, 2) + 
              Math.pow(botVehicle.position.z - hoveredTile.position.z, 2)
            ).toFixed(2)} unités
          </span>
        </div>
      )}
      
      {hoveredTile.explored && hoveredTile.exploredBy && (
        <div className="debugger-data-item">
          <span className="debugger-label">Explorée par:</span>
          <span className="debugger-value">
            {hoveredTile.exploredBy === "player-1" 
              ? "Joueur (Legacy)" 
              : `Bot ${parseInt(hoveredTile.exploredBy?.replace("bot-", "")) + 1}`}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Composant principal pour l'onglet Tuile (Bot-only)
 */
const TileTab = ({ 
  hoveredTile, 
  hoveredTileCoord, 
  botVehicle, 
  calculateDistance, 
  currentBotIndex, 
  getTileResourceBarStyle 
}) => {
  if (!hoveredTile) {
    return (
      <div className="debugger-empty-message">
        <p>Aucune tuile survolée.</p>
        <p>Passez votre souris sur une tuile pour voir ses détails.</p>
      </div>
    );
  }

  return (
    <div className="debugger-tab-content">
      <TileInfo 
        hoveredTile={hoveredTile}
        hoveredTileCoord={hoveredTileCoord}
      />

      <TileResources 
        hoveredTile={hoveredTile}
        getTileResourceBarStyle={getTileResourceBarStyle}
      />

      <TileSpecialProperties hoveredTile={hoveredTile} />

      <TileDistances 
        botVehicle={botVehicle}
        hoveredTileCoord={hoveredTileCoord}
        hoveredTile={hoveredTile}
        calculateDistance={calculateDistance}
        currentBotIndex={currentBotIndex}
      />
    </div>
  );
};

export default TileTab;
