import React from "react";
import { useTileStore } from "../stores/useNewTileStore";

const TileHUD = () => {
  // Get the currently hovered tile's coordinate from the store
  const hoveredTileCoord = useTileStore((state) => state.hoveredTile);
  
  // Get the tile data for the hovered tile
  const tiles = useTileStore((state) => state.tiles);
  const hoveredTile = hoveredTileCoord ? tiles[hoveredTileCoord] : null;
  
  // If no tile is being hovered, don't render anything
  if (!hoveredTile) {
    return null;
  }
  
  // Helper function to get a color indicator for resource quantity
  const getResourceBarStyle = (quantity) => {
    let color = "#4CAF50"; // Green by default
    
    if (quantity === 0) color = "#777777"; // Gray if empty
    else if (quantity < 3) color = "#f44336"; // Red if very low
    else if (quantity < 5) color = "#ff9800"; // Orange if somewhat low
    
    return {
      width: `${Math.min(quantity * 10, 100)}%`,
      backgroundColor: color
    };
  };
  
  return (
    <div className="tile-hud">
      <h3>Tile Information</h3>
      
      <div className="tile-hud-section">
        <p>
          <strong>Coordinates:</strong> {hoveredTileCoord}
        </p>
        <p>
          <strong>Type:</strong> {hoveredTile.type || "Standard"}
        </p>
        <p>
          <strong>Status:</strong> {hoveredTile.collected ? "Collected" : "Available"}
        </p>
        <p>
          <strong>Explored:</strong> {hoveredTile.explored ? "Yes" : "No"}
        </p>
        {hoveredTile.walkable === false && (
          <p className="tile-hud-warning">
            <strong>Warning:</strong> Not walkable!
          </p>
        )}
      </div>
      
      {/* Resources Section */}
      {hoveredTile.resources && (
        <div className="tile-hud-section">
          <h4>Resources</h4>
          
          {/* Food Resource */}
          <div className="tile-hud-resource">
            <div className="tile-hud-resource-header">
              <span>Food: {hoveredTile.resources.food || 0}</span>
            </div>
            <div className="tile-hud-resource-container">
              <div 
                className="tile-hud-resource-bar" 
                style={getResourceBarStyle(hoveredTile.resources.food || 0)}
              ></div>
            </div>
          </div>
          
          {/* Debris Resource */}
          <div className="tile-hud-resource">
            <div className="tile-hud-resource-header">
              <span>Debris: {hoveredTile.resources.debris || 0}</span>
            </div>
            <div className="tile-hud-resource-container">
              <div 
                className="tile-hud-resource-bar" 
                style={getResourceBarStyle(hoveredTile.resources.debris || 0)}
              ></div>
            </div>
          </div>
          
          {/* Special Resource */}
          <div className="tile-hud-resource">
            <div className="tile-hud-resource-header">
              <span>Special: {hoveredTile.resources.special || 0}</span>
            </div>
            <div className="tile-hud-resource-container">
              <div 
                className="tile-hud-resource-bar" 
                style={getResourceBarStyle(hoveredTile.resources.special || 0)}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Special Properties Section */}
      {hoveredTile.type === 'station' && (
        <div className="tile-hud-section">
          <p className="tile-hud-station">
            <strong>Station Tile</strong> - Can refuel and repair at this location
          </p>
        </div>
      )}
      
      {hoveredTile.type === 'danger' && (
        <div className="tile-hud-section">
          <p className="tile-hud-danger">
            <strong>Danger Zone</strong> - Ships may be damaged in this area
          </p>
        </div>
      )}
      
      {hoveredTile.type === 'base' && (
        <div className="tile-hud-section">
          <p className="tile-hud-base">
            <strong>Base Tile</strong> - Return here to deposit resources
          </p>
        </div>
      )}
    </div>
  );
};

export default TileHUD;