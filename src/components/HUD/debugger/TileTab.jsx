import React from 'react';
import ResourceBar from './ResourceBar';
import { HUMAN_PLAYER_ID } from '../../../ai/constants/playerConstants';

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
      value: hoveredTile.collected ? "Collectée" : "Disponible"
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
 * Composant pour les distances depuis la tuile
 */
const TileDistances = ({ 
  playerVehicle, 
  botVehicle, 
  hoveredTileCoord, 
  hoveredTile, 
  calculateDistance, 
  currentBotIndex 
}) => {
  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Distances</h3>
      
      {playerVehicle?.coord && hoveredTileCoord && (
        <div className="debugger-data-item">
          <span className="debugger-label">Distance joueur:</span>
          <span className="debugger-value">
            {calculateDistance(playerVehicle.coord, hoveredTileCoord, true, true)} tuiles
          </span>
        </div>
      )}
      
      {botVehicle?.coord && hoveredTileCoord && (
        <div className="debugger-data-item">
          <span className="debugger-label">Distance Bot {currentBotIndex + 1}:</span>
          <span className="debugger-value">
            {calculateDistance(botVehicle.coord, hoveredTileCoord, true, true)} tuiles
          </span>
        </div>
      )}
      
      {hoveredTile.explored && hoveredTile.exploredBy && (
        <div className="debugger-data-item">
          <span className="debugger-label">Explorée par:</span>
          <span className="debugger-value">
            {hoveredTile.exploredBy === HUMAN_PLAYER_ID 
              ? "Joueur" 
              : `Bot ${parseInt(hoveredTile.exploredBy?.replace("bot", "")) + 1}`}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Composant principal pour l'onglet Tuile
 */
const TileTab = ({ 
  hoveredTile, 
  hoveredTileCoord, 
  playerVehicle, 
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
        playerVehicle={playerVehicle}
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
