import React from 'react';
import ResourceBar from './ResourceBar';

/**
 * Composant pour l'affichage des ressources d'un vaisseau
 */
const ShipResources = ({ vehicle, title = "Ressources du vaisseau" }) => {
  if (!vehicle) {
    return <div className="debugger-empty-message">Données du vaisseau non disponibles</div>;
  }

  const resources = [
    {
      name: 'Carburant',
      current: vehicle.fuel || 0,
      max: 100,
      color: vehicle.fuel < 30 ? "#f44336" : vehicle.fuel < 50 ? "#FF9800" : "#4CAF50"
    },
    {
      name: 'Food',
      current: vehicle.resources?.food || 0,
      max: vehicle.maxCapacity?.food || 100,
      color: "#8BC34A"
    },
    {
      name: 'Debris',
      current: vehicle.resources?.debris || 0,
      max: vehicle.maxCapacity?.debris || 1000,
      color: "#2196F3"
    },
    {
      name: 'Special',
      current: vehicle.resources?.special || 0,
      max: vehicle.maxCapacity?.special || 2,
      color: "#9C27B0"
    }
  ];

  return (
    <div className="debugger-ship-resources">
      <h3 className="debugger-section-title">{title}</h3>
      
      {resources.map((resource, index) => (
        <div key={index} className="debugger-resource-item">
          <div className="debugger-resource-header">
            <span className="debugger-resource-name">{resource.name}:</span>
            <span className="debugger-resource-value">
              {resource.current}/{resource.max}
            </span>
          </div>
          <ResourceBar 
            value={resource.current} 
            max={resource.max}
            color={resource.color}
          />
        </div>
      ))}
      
      {vehicle.isAtCapacity !== undefined && (
        <div className="debugger-capacity-status">
          <span className="debugger-label">À capacité max:</span>
          <span className={`debugger-value ${vehicle.isAtCapacity ? 'debugger-value-warning' : 'debugger-value-ok'}`}>
            {vehicle.isAtCapacity ? "Oui" : "Non"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ShipResources;
