import React from 'react';

/**
 * Composant pour l'affichage des véhicules d'un joueur (version simplifiée FSM)
 */
const VehicleList = React.memo(({ playerId, isVehicleActive }) => {
  const vehicles = React.useMemo(() => [
    {
      name: 'Vaisseau principal',
      id: `${playerId}-ship`,
      type: 'main'
    },
    {
      name: 'Drone explorateur',
      id: `${playerId}-explorer-drone`,
      type: 'drone'
    },
    {
      name: 'Drone de combat',
      id: `${playerId}-combat-drone`,
      type: 'drone'
    },
    {
      name: 'Drone spécial',
      id: `${playerId}-special-drone`,
      type: 'drone'
    }
  ], [playerId]);

  return (
    <div className="debugger-section">
      <h3 className="debugger-section-title">Véhicules</h3>
      <div className="debugger-vehicles">
        {vehicles.map((vehicle, index) => (
          <div key={index} className="debugger-vehicle-item">
            <span className="debugger-vehicle-name">{vehicle.name}</span>
            <span className="debugger-vehicle-id">{vehicle.id}</span>
            {vehicle.type === 'drone' && (
              <span className={`debugger-vehicle-status ${isVehicleActive(playerId, vehicle.id) ? 'debugger-status-active' : 'debugger-status-inactive'}`}>
                {isVehicleActive(playerId, vehicle.id) ? 'ACTIF' : 'INACTIF'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default VehicleList;
