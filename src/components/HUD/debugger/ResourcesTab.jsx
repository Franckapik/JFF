import React from 'react';
import ResourceBar from './ResourceBar';
import ShipResources from './ShipResources';

/**
 * Composant pour les sous-onglets des ressources
 */
const ResourceSubTabs = React.memo(({ activeSubTab, setActiveSubTab, botMemory }) => {
  const subTabs = [
    { 
      id: 'resources', 
      label: `Ressources (${botMemory?.knownResources?.length || 0})` 
    },
    { 
      id: 'collected', 
      label: `Collectées (${botMemory?.collectedResources?.length || 0})` 
    },
    { 
      id: 'dangers', 
      label: `Dangers (${botMemory?.knownDangers?.length || 0})` 
    }
  ];

  return (
    <div className="debugger-subtabs">
      {subTabs.map(tab => (
        <button 
          key={tab.id}
          className={`debugger-subtab-button ${activeSubTab === tab.id ? 'debugger-subtab-active' : ''}`}
          onClick={() => setActiveSubTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
});

/**
 * Composant pour l'affichage des ressources connues
 */
const KnownResourcesTable = ({ botMemory, botVehicle, calculateDistance }) => {
  if (!botMemory?.knownResources || botMemory.knownResources.length === 0) {
    return <div className="debugger-empty-message">Aucune ressource découverte</div>;
  }

  return (
    <div className="debugger-table-container">
      <table className="debugger-resources-table">
        <thead>
          <tr>
            <th>Coord</th>
            <th>Distance</th>
            <th>Food</th>
            <th>Debris</th>
            <th>Special</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.knownResources.map((resource, index) => (
            <tr key={index}>
              <td>{resource.coord}</td>
              <td>{calculateDistance(botVehicle?.coord, resource.coord, true, true)}</td>
              <td className={`debugger-resource-value ${resource.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                {resource.resources?.food || 0}
              </td>
              <td className={`debugger-resource-value ${resource.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                {resource.resources?.debris || 0}
              </td>
              <td className={`debugger-resource-value ${resource.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                {resource.resources?.special || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Composant pour l'affichage des ressources collectées
 */
const CollectedResourcesTable = ({ botMemory }) => {
  if (!botMemory?.collectedResources || botMemory.collectedResources.length === 0) {
    return <div className="debugger-empty-message">Aucune ressource collectée</div>;
  }

  return (
    <div className="debugger-table-container">
      <table className="debugger-resources-table">
        <thead>
          <tr>
            <th>Coord</th>
            <th>Food</th>
            <th>Debris</th>
            <th>Special</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.collectedResources.map((resource, index) => (
            <tr key={index}>
              <td>{resource.coord}</td>
              <td className={`debugger-resource-value ${resource.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                {resource.resources?.food || 0}
              </td>
              <td className={`debugger-resource-value ${resource.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                {resource.resources?.debris || 0}
              </td>
              <td className={`debugger-resource-value ${resource.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                {resource.resources?.special || 0}
              </td>
              <td>
                {resource.collectedAt ? new Date(resource.collectedAt).toLocaleTimeString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Composant pour l'affichage des dangers
 */
const DangersTable = ({ botMemory, botVehicle, calculateDistance }) => {
  if (!botMemory?.knownDangers || botMemory.knownDangers.length === 0) {
    return <div className="debugger-empty-message">Aucun danger détecté</div>;
  }

  return (
    <div className="debugger-table-container">
      <table className="debugger-resources-table">
        <thead>
          <tr>
            <th>Coord</th>
            <th>Distance</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.knownDangers.map((danger, index) => (
            <tr key={index}>
              <td>{danger.coord}</td>
              <td>{calculateDistance(botVehicle?.coord, danger.coord, true, true)}</td>
              <td>{danger.type || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Composant principal pour l'onglet Ressources
 */
const ResourcesTab = ({ 
  botVehicle, 
  botMemory, 
  activeSubTab, 
  setActiveSubTab, 
  calculateDistance 
}) => {
  if (!botVehicle || !botMemory) {
    return <div className="debugger-empty-message">Données du bot non disponibles</div>;
  }

  return (
    <div className="debugger-tab-content">
      <ResourceSubTabs 
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        botMemory={botMemory}
      />
      
      <div className="debugger-subtab-content">
        {activeSubTab === 'resources' && (
          <KnownResourcesTable 
            botMemory={botMemory}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
          />
        )}
        {activeSubTab === 'collected' && (
          <CollectedResourcesTable botMemory={botMemory} />
        )}
        {activeSubTab === 'dangers' && (
          <DangersTable 
            botMemory={botMemory}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
          />
        )}
      </div>
      
      <ShipResources vehicle={botVehicle} />
    </div>
  );
};

export default ResourcesTab;
