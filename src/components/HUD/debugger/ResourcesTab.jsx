import React from 'react';
import ResourceBar from './ResourceBar';
import ShipResources from './ShipResources';

/**
 * Composant de résumé des ressources découvertes
 */
const ResourcesSummary = React.memo(({ botMemory }) => {
  // 🔍 DEBUG TEMPORAIRE - Afficher l'état de la mémoire reçue
  console.log("🔍 [DEBUG] ResourcesSummary received botMemory:", {
    hasMemory: Boolean(botMemory),
    hasKnownTiles: Boolean(botMemory?.knownTiles),
    knownTilesLength: botMemory?.knownTiles?.length || 0,
    knownTilesData: botMemory?.knownTiles
  });

  if (!botMemory?.knownTiles || botMemory.knownTiles.length === 0) {
    return (
      <div className="debugger-resources-summary">
        <div className="summary-card">
          <h4>📊 Résumé de l'Exploration</h4>
          <p>Aucune donnée de mémoire disponible</p>
        </div>
      </div>
    );
  }

  // Calculer les totaux depuis knownTiles
  const totals = botMemory.knownTiles.reduce((acc, tile) => {
    if (tile.explored && tile.resources) {
      acc.food += tile.resources.food || 0;
      acc.debris += tile.resources.debris || 0;
      acc.special += tile.resources.special || 0;
      acc.tilesWithResources += (tile.resources.food || tile.resources.debris || tile.resources.special) > 0 ? 1 : 0;
    }
    return acc;
  }, { food: 0, debris: 0, special: 0, tilesWithResources: 0 });

  const stats = botMemory.stats || {};
  const exploredCount = botMemory.exploredTiles?.length || 0;
  const collectibleCount = botMemory.collectibleTiles?.length || 0;
  
  // Indicateur de découverte récente (dernières 30 secondes)
  const recentDiscovery = stats.lastExploration && 
    (Date.now() - stats.lastExploration.timestamp) < 30000;

  return (
    <div className="debugger-resources-summary">
      <div className="summary-grid">
        <div className="summary-card">
          <h4>📍 Exploration {recentDiscovery && <span className="recent-activity">🆕</span>}</h4>
          <div className="stat-row">
            <span>Tuiles explorées:</span>
            <strong>{exploredCount}</strong>
          </div>
          <div className="stat-row">
            <span>Avec ressources:</span>
            <strong className="resource-highlight">{totals.tilesWithResources}</strong>
          </div>
          <div className="stat-row">
            <span>Collectibles:</span>
            <strong className="collectible-highlight">{collectibleCount}</strong>
          </div>
        </div>

        <div className="summary-card">
          <h4>💎 Ressources</h4>
          <div className="resource-totals">
            <div className="resource-item food">
              <span className="resource-icon">🍞</span>
              <span className="resource-label">Food:</span>
              <strong>{totals.food}</strong>
            </div>
            <div className="resource-item debris">
              <span className="resource-icon">🔩</span>
              <span className="resource-label">Debris:</span>
              <strong>{totals.debris}</strong>
            </div>
            <div className="resource-item special">
              <span className="resource-icon">⭐</span>
              <span className="resource-label">Special:</span>
              <strong>{totals.special}</strong>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <h4>⏱️ Actions</h4>
          <div className="stat-row">
            <span>Dernière:</span>
            <small className={recentDiscovery ? 'recent-timestamp' : ''}>
              {stats.lastExploration ? 
                `${new Date(stats.lastExploration.timestamp).toLocaleTimeString().slice(0,5)} (${stats.lastExploration.coord})` : 
                'Aucune'
              }
            </small>
          </div>
          <div className="stat-row">
            <span>Collecte:</span>
            <small>{stats.lastCollection ? new Date(stats.lastCollection.timestamp).toLocaleTimeString().slice(0,5) : 'Aucune'}</small>
          </div>
          <div className="stat-row">
            <span>Mémoire:</span>
            <small>{botMemory.memorySize} entrées</small>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Composant pour les sous-onglets des ressources
 */
const ResourceSubTabs = React.memo(({ activeSubTab, setActiveSubTab, botMemory }) => {
  const subTabs = [
    { 
      id: 'tiles', 
      label: `Tuiles (${botMemory?.knownTiles?.length || 0})` 
    },
    { 
      id: 'explored', 
      label: `Explorées (${botMemory?.exploredTiles?.length || 0})` 
    },
    { 
      id: 'collectible', 
      label: `Collectibles (${botMemory?.collectibleTiles?.length || 0})` 
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
 * Composant pour l'affichage des tuiles connues
 */
const KnownTilesTable = ({ botMemory, botVehicle, calculateDistance }) => {
  if (!botMemory?.knownTiles || botMemory.knownTiles.length === 0) {
    return <div className="debugger-empty-message">Aucune tuile découverte</div>;
  }

  return (
    <div className="debugger-table-container">
      <table className="debugger-resources-table">
        <thead>
          <tr>
            <th>Coord</th>
            <th>État</th>
            <th>Distance</th>
            <th>Food</th>
            <th>Debris</th>
            <th>Special</th>
            <th>Exploré</th>
            <th>Collecté</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.knownTiles.map((tile, index) => {
            const totalResources = (tile.resources?.food || 0) + (tile.resources?.debris || 0) + (tile.resources?.special || 0);
            const hasResources = totalResources > 0;
            
            return (
              <tr key={index} className={hasResources ? 'tile-with-resources' : ''}>
                <td>
                  <strong>{tile.coord}</strong>
                  {hasResources && <span className="resource-indicator">💎</span>}
                </td>
                <td>
                  <span className={`debugger-tile-status ${tile.collected ? 'collected' : tile.explored ? 'explored' : 'unknown'}`}>
                    {tile.collected ? '✅ Collecté' : tile.explored ? '🔍 Exploré' : '❓ Inconnu'}
                  </span>
                </td>
                <td>{calculateDistance(botVehicle?.coord, tile.coord, true, true)}</td>
                <td className={`debugger-resource-value ${tile.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                  {tile.resources?.food > 0 && '🍞'} {tile.resources?.food || 0}
                </td>
                <td className={`debugger-resource-value ${tile.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                  {tile.resources?.debris > 0 && '🔩'} {tile.resources?.debris || 0}
                </td>
                <td className={`debugger-resource-value ${tile.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                  {tile.resources?.special > 0 && '⭐'} {tile.resources?.special || 0}
                </td>
                <td>
                  <small>{tile.exploredAt ? new Date(tile.exploredAt).toLocaleTimeString() : '-'}</small>
                </td>
                <td>
                  <small>{tile.collectedAt ? new Date(tile.collectedAt).toLocaleTimeString() : '-'}</small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Composant pour l'affichage des tuiles explorées
 */
const ExploredTilesTable = ({ botMemory, botVehicle, calculateDistance }) => {
  if (!botMemory?.exploredTiles || botMemory.exploredTiles.length === 0) {
    return <div className="debugger-empty-message">Aucune tuile explorée</div>;
  }

  return (
    <div className="debugger-table-container">
      <table className="debugger-resources-table">
        <thead>
          <tr>
            <th>Coord</th>
            <th>Distance</th>
            <th>Ressources</th>
            <th>Exploré le</th>
            <th>Collecté</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.exploredTiles.map((tile, index) => (
            <tr key={index}>
              <td>{tile.coord}</td>
              <td>{calculateDistance(botVehicle?.coord, tile.coord, true, true)}</td>
              <td>
                <span className={`debugger-resources-summary ${tile.hasResources ? 'has-resources' : 'no-resources'}`}>
                  {tile.hasResources ? 
                    `🎯 F:${tile.resources?.food || 0} D:${tile.resources?.debris || 0} S:${tile.resources?.special || 0}` : 
                    '❌ Vide'
                  }
                </span>
              </td>
              <td>{tile.exploredAt ? new Date(tile.exploredAt).toLocaleTimeString() : '-'}</td>
              <td>
                <span className={`debugger-collected-status ${tile.collected ? 'collected' : 'not-collected'}`}>
                  {tile.collected ? '✅ Oui' : '⏳ Non'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Composant pour l'affichage des tuiles collectibles
 */
const CollectibleTilesTable = ({ botMemory, botVehicle, calculateDistance }) => {
  if (!botMemory?.collectibleTiles || botMemory.collectibleTiles.length === 0) {
    return <div className="debugger-empty-message">Aucune tuile collectible disponible</div>;
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
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {botMemory.collectibleTiles.map((tile, index) => {
            const totalResources = (tile.resources?.food || 0) + (tile.resources?.debris || 0) + (tile.resources?.special || 0);
            return (
              <tr key={index}>
                <td>{tile.coord}</td>
                <td>{calculateDistance(botVehicle?.coord, tile.coord, true, true)}</td>
                <td className={`debugger-resource-value ${tile.resources?.food > 0 ? 'debugger-resource-food' : ''}`}>
                  {tile.resources?.food || 0}
                </td>
                <td className={`debugger-resource-value ${tile.resources?.debris > 0 ? 'debugger-resource-debris' : ''}`}>
                  {tile.resources?.debris || 0}
                </td>
                <td className={`debugger-resource-value ${tile.resources?.special > 0 ? 'debugger-resource-special' : ''}`}>
                  {tile.resources?.special || 0}
                </td>
                <td className="debugger-resource-total">
                  <strong>{totalResources}</strong>
                </td>
              </tr>
            );
          })}
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
      <ResourcesSummary botMemory={botMemory} />
      
      <ResourceSubTabs 
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        botMemory={botMemory}
      />
      
      <div className="debugger-subtab-content">
        {activeSubTab === 'tiles' && (
          <KnownTilesTable 
            botMemory={botMemory}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
          />
        )}
        {activeSubTab === 'explored' && (
          <ExploredTilesTable 
            botMemory={botMemory}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
          />
        )}
        {activeSubTab === 'collectible' && (
          <CollectibleTilesTable 
            botMemory={botMemory}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
          />
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
