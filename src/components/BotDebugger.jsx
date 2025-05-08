// src/components/BotDebugger.jsx
// Composant de débogage pour visualiser l'état de la FSM du bot
import React, { useState, useEffect } from 'react';
import useSimpleBotStore from '../stores/useBotStore';
import usePlayerStore from '../stores/usePlayerStore';
import { useTileStore } from "../stores/useNewTileStore";

// Style pour le débogueur
const debuggerStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  width: '400px',
  height: '500px',  // Hauteur fixe
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: 1000,
};

const tabStyle = {
  display: 'flex',
  marginBottom: '10px',
};

const tabButtonStyle = (active) => ({
  padding: '5px 10px',
  backgroundColor: active ? '#444' : '#222',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius: '4px',
});

const stateBoxStyle = (isActive) => ({
  padding: '5px 10px',
  backgroundColor: isActive ? '#2a6d2a' : '#333',
  border: '1px solid ' + (isActive ? '#4caf50' : '#555'),
  borderRadius: '4px',
  margin: '5px 0',
});

const actionItemStyle = (completed) => ({
  padding: '5px',
  backgroundColor: completed ? '#2a4d6d' : '#444',
  margin: '3px 0',
  borderRadius: '4px',
});

// Style pour les sous-onglets des ressources
const subTabStyle = {
  display: 'flex',
  borderBottom: '1px solid #444',
  marginBottom: '8px',
};

const subTabButtonStyle = (active) => ({
  padding: '4px 8px',
  backgroundColor: active ? '#444' : 'transparent',
  border: 'none',
  color: active ? '#fff' : '#aaa',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius: '3px 3px 0 0',
  fontSize: '11px',
});

// Style pour les barres de ressources
const getResourceBarStyle = (level, total = 100) => {
  const percentage = Math.min(100, (level / total) * 100);
  
  let color = "#4CAF50"; // Vert par défaut
  if (level === 0) color = "#777777"; // Gris si aucune ressource
  else if (level > 35) color = "#2196F3"; // Bleu si beaucoup de ressources
  
  return {
    width: `${percentage}%`,
    backgroundColor: color,
    height: "8px",
    borderRadius: "4px"
  };
};

// Style pour la barre de carburant
const getFuelBarStyle = (fuelLevel) => {
  let color = "#4CAF50"; // Vert par défaut
  
  // Changement de couleur selon le niveau de carburant
  if (fuelLevel < 30) color = "#f44336"; // Rouge si très bas
  else if (fuelLevel < 50) color = "#ff9800"; // Orange si sous le seuil de 50%
  
  return {
    width: `${fuelLevel}%`,
    backgroundColor: color
  };
};

// Style pour le contenu avec scroll
const contentContainerStyle = {
  flex: 1,
  overflow: 'auto',
  paddingRight: '5px',
  marginRight: '-5px', // Compenser le padding pour éviter le double scroll
};

/**
 * Composant de débogage pour la FSM du bot
 * Affiche l'état actuel, la file d'actions et les dernières actions complétées
 */
const BotDebugger = () => {
  // États pour le débogueur
  const [isVisible, setIsVisible] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('bot'); // 'bot' ou 'player'
  const [activeTab, setActiveTab] = useState('state'); // 'state', 'actions', 'history', 'conditions', 'resources'
  const [stateHistory, setStateHistory] = useState([]);
  const [conditionLog, setConditionLog] = useState([]);
  const [activeMemoryTab, setActiveMemoryTab] = useState('resources'); // 'resources', 'collected' ou 'dangers'
  
  // Récupération de l'état du bot
  const {
    botState,
    isRunning,
    actionQueue,
    completedActions,
    BOT_STATES
  } = useSimpleBotStore();
  
  // Récupération des données des joueurs
  const players = usePlayerStore((state) => state.players);
  const botVehicle = usePlayerStore(state => state.players?.player2?.vehicles?.ship);
  const botMemory = usePlayerStore(state => state.players?.player2?.memory);
  const playerVehicle = usePlayerStore(state => state.players?.player1?.vehicles?.ship);
  
  // Récupérer la fonction calculateDistance du TileStore
  const calculateDistance = useTileStore((state) => state.calculateDistance);
  
  // Ajoute un état au historique lors des changements
  useEffect(() => {
    if (botState) {
      setStateHistory(prev => [...prev.slice(-19), { 
        state: botState, 
        timestamp: new Date().toLocaleTimeString(),
        fuel: botVehicle?.fuel,
        resources: botVehicle?.resources
      }]);
    }
  }, [botState, botVehicle]);
  
  // Ajoute un log de condition quand une action d'évaluation est complétée
  useEffect(() => {
    const lastAction = completedActions[completedActions.length - 1];
    if (lastAction?.type === 'evaluateIdle') {
      setConditionLog(prev => [...prev.slice(-9), {
        timestamp: new Date().toLocaleTimeString(),
        nextState: botState,
        conditions: {
          fuel: botVehicle?.fuel,
          atCapacity: botVehicle?.isAtCapacity,
          knownResources: botMemory?.knownResources?.length || 0,
          explorationCount: botMemory?.explorationCount || 0
        }
      }]);
    }
  }, [completedActions, botState, botVehicle, botMemory]);
  
  // Formater le nom d'un état pour l'affichage
  const formatStateName = (state) => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };
  
  // Obtenir une couleur pour les ressources en fonction de leur quantité
  const getResourceColor = (quantity) => {
    if (quantity > 50) return "#4CAF50"; // Vert pour beaucoup
    if (quantity > 20) return "#FFC107"; // Jaune pour moyen
    return "#ff9800"; // Orange pour peu
  };
  
  // Couleur spéciale pour les ressources rares (special)
  const getSpecialResourceColor = (quantity) => {
    if (quantity > 0) return "#673AB7"; // Violet pour les ressources spéciales
    return "#777777"; // Gris pour aucune
  };
  
  // Rendu des différents onglets pour le BOT
  const renderBotTabContent = () => {
    switch (activeTab) {
      case 'state':
        return (
          <div>
            <h4>État actuel: <span style={{ color: '#4caf50' }}>{formatStateName(botState)}</span></h4>
            <div>Bot actif: <span style={{ color: isRunning ? '#4caf50' : '#ff5722' }}>{isRunning ? 'Oui' : 'Non'}</span></div>
            
            <h4>États disponibles:</h4>
            {Object.values(BOT_STATES).map(state => (
              <div key={state} style={stateBoxStyle(state === botState)}>
                {formatStateName(state)}
              </div>
            ))}
            
            <h4>Données du véhicule:</h4>
            <div>Carburant: {botVehicle?.fuel || 0}/100</div>
            <div>Ressources: 
              Food: {botVehicle?.resources?.food || 0}, 
              Debris: {botVehicle?.resources?.debris || 0}, 
              Special: {botVehicle?.resources?.special || 0}
            </div>
            <div>À capacité max: {botVehicle?.isAtCapacity ? 'Oui' : 'Non'}</div>
          </div>
        );
        
      case 'actions':
        return (
          <div>
            <h4>File d'actions ({actionQueue.length}):</h4>
            {actionQueue.length === 0 ? (
              <div style={{ padding: '5px', color: '#888' }}>Aucune action en attente</div>
            ) : (
              actionQueue.map((action, index) => (
                <div key={index} style={actionItemStyle(false)}>
                  <div><strong>Type:</strong> {action.type}</div>
                  <div><strong>Priorité:</strong> {action.priority}</div>
                </div>
              ))
            )}
          </div>
        );
      
      case 'history':
        return (
          <div>
            <h4>Historique des états ({stateHistory.length}):</h4>
            {stateHistory.map((item, index) => (
              <div key={index} style={{ 
                padding: '5px', 
                margin: '3px 0',
                backgroundColor: '#333',
                borderLeft: '3px solid #4caf50',
                borderRadius: '2px' 
              }}>
                <div><strong>{item.timestamp}</strong> → {formatStateName(item.state)}</div>
                <div style={{ fontSize: '10px', color: '#aaa' }}>
                  Fuel: {item.fuel}, Resources: {JSON.stringify(item.resources)}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'conditions':
        return (
          <div>
            <h4>Log des évaluations ({conditionLog.length}):</h4>
            {conditionLog.map((log, index) => (
              <div key={index} style={{ 
                padding: '5px', 
                margin: '5px 0',
                backgroundColor: '#333',
                borderLeft: `3px solid #2196f3`,
                borderRadius: '2px' 
              }}>
                <div><strong>{log.timestamp}</strong> → État choisi: {formatStateName(log.nextState)}</div>
                <div style={{ fontSize: '11px', marginTop: '3px' }}>
                  <div>Fuel: <span style={{ color: log.conditions.fuel < 50 ? '#ff5722' : '#4caf50' }}>{log.conditions.fuel}</span></div>
                  <div>À capacité: <span style={{ color: log.conditions.atCapacity ? '#ff5722' : '#4caf50' }}>{log.conditions.atCapacity ? 'Oui' : 'Non'}</span></div>
                  <div>Ressources connues: {log.conditions.knownResources}</div>
                  <div>Explorations: {log.conditions.explorationCount}</div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'resources':
        return (
          <div>
            <h4>Ressources du Bot</h4>
            {/* Sous-onglets pour choisir le type de ressource à afficher */}
            <div style={subTabStyle}>
              <button 
                style={subTabButtonStyle(activeMemoryTab === 'resources')}
                onClick={() => setActiveMemoryTab('resources')}>
                Resources ({botMemory?.knownResources?.length || 0})
              </button>
              <button 
                style={subTabButtonStyle(activeMemoryTab === 'collected')}
                onClick={() => setActiveMemoryTab('collected')}>
                Collected ({botMemory?.collectedResources?.length || 0})
              </button>
              <button 
                style={subTabButtonStyle(activeMemoryTab === 'dangers')}
                onClick={() => setActiveMemoryTab('dangers')}>
                Dangers ({botMemory?.knownDangers?.length || 0})
              </button>
            </div>
            
            {/* Contenu des sous-onglets */}
            {activeMemoryTab === 'resources' && (
              <>
                {(!botMemory?.knownResources || botMemory.knownResources.length === 0) ? (
                  <p style={{padding: '10px', textAlign: 'center', fontStyle: 'italic', color: '#aaa', fontSize: '12px'}}>
                    Aucune ressource découverte
                  </p>
                ) : (
                  <div style={{maxHeight: '200px', overflowY: 'auto', marginTop: '8px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '12px'}}>
                      <thead>
                        <tr>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Coord</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Tiles</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Food</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Debris</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Special</th>
                        </tr>
                      </thead>
                      <tbody>
                        {botMemory.knownResources.map((resource, index) => (
                          <tr key={index} style={{':hover': {backgroundColor: 'rgba(255, 255, 255, 0.05)'}}}>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{resource.coord}</td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{calculateDistance(botVehicle?.coord, resource.coord, true, true)}</td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getResourceColor(resource.resources?.food || 0)}}>
                              {resource.resources?.food || 0}
                            </td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getResourceColor(resource.resources?.debris || 0)}}>
                              {resource.resources?.debris || 0}
                            </td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getSpecialResourceColor(resource.resources?.special || 0)}}>
                              {resource.resources?.special || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {activeMemoryTab === 'collected' && (
              <>
                {(!botMemory?.collectedResources || botMemory.collectedResources.length === 0) ? (
                  <p style={{padding: '10px', textAlign: 'center', fontStyle: 'italic', color: '#aaa', fontSize: '12px'}}>
                    Aucune ressource collectée
                  </p>
                ) : (
                  <div style={{maxHeight: '200px', overflowY: 'auto', marginTop: '8px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '12px'}}>
                      <thead>
                        <tr>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Coord</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Food</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Debris</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Special</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {botMemory.collectedResources.map((resource, index) => (
                          <tr key={index}>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{resource.coord}</td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getResourceColor(resource.resources?.food || 0)}}>
                              {resource.resources?.food || 0}
                            </td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getResourceColor(resource.resources?.debris || 0)}}>
                              {resource.resources?.debris || 0}
                            </td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', color: getSpecialResourceColor(resource.resources?.special || 0)}}>
                              {resource.resources?.special || 0}
                            </td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{resource.collectedAt ? 
                                new Date(resource.collectedAt).toLocaleTimeString() : 
                                'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {activeMemoryTab === 'dangers' && (
              <>
                {(!botMemory?.knownDangers || botMemory.knownDangers.length === 0) ? (
                  <p style={{padding: '10px', textAlign: 'center', fontStyle: 'italic', color: '#aaa', fontSize: '12px'}}>
                    Aucun danger détecté
                  </p>
                ) : (
                  <div style={{maxHeight: '200px', overflowY: 'auto', marginTop: '8px'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '12px'}}>
                      <thead>
                        <tr>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Coord</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Tiles</th>
                          <th style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444', backgroundColor: '#222', position: 'sticky', top: '0', zIndex: '1'}}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {botMemory.knownDangers.map((danger, index) => (
                          <tr key={index}>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{danger.coord}</td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{calculateDistance(botVehicle?.coord, danger.coord, true, true)}</td>
                            <td style={{padding: '6px', textAlign: 'center', borderBottom: '1px solid #444'}}>{danger.type || 'Unknown'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            
            {/* Section Ressources du vaisseau avec barres de progression */}
            <div style={{marginTop: '15px'}}>
              <h4 style={{margin: '0', fontWeight: 'bold'}}>Ship Resources:</h4>
              
              {botVehicle && (
                <>
                  {/* Food Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Food:</span> {botVehicle.resources?.food || 0}/{botVehicle.maxCapacity?.food || 100}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(botVehicle.resources?.food || 0, botVehicle.maxCapacity?.food || 100)}></div>
                    </div>
                  </div>
                  
                  {/* Debris Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Debris:</span> {botVehicle.resources?.debris || 0}/{botVehicle.maxCapacity?.debris || 1000}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(botVehicle.resources?.debris || 0, botVehicle.maxCapacity?.debris || 1000)}></div>
                    </div>
                  </div>
                  
                  {/* Special Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Special:</span> {botVehicle.resources?.special || 0}/{botVehicle.maxCapacity?.special || 2}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(botVehicle.resources?.special || 0, botVehicle.maxCapacity?.special || 2)}></div>
                    </div>
                  </div>
                  
                  <p>
                    <strong>At Capacity:</strong> {botVehicle.isAtCapacity ? "Yes" : "No"}
                  </p>
                </>
              )}
            </div>
            
            {/* Section pour le score total du bot */}
            <div style={{marginTop: '15px'}}>
              <h4 style={{margin: '0', fontWeight: 'bold'}}>Total Score:</h4>
              
              {/* Food Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Food:</span> {players?.player2?.score?.resources?.food || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player2?.score?.resources?.food || 0, 100)}></div>
                </div>
              </div>
              
              {/* Debris Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Debris:</span> {players?.player2?.score?.resources?.debris || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player2?.score?.resources?.debris || 0, 200)}></div>
                </div>
              </div>
              
              {/* Special Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Special:</span> {players?.player2?.score?.resources?.special || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player2?.score?.resources?.special || 0, 10)}></div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Onglet inconnu</div>;
    }
  };

  // Rendu des différents onglets pour le PLAYER
  const renderPlayerTabContent = () => {
    switch (activeTab) {
      case 'state':
        return (
          <div>
            <h4>État du joueur: <span style={{ color: '#2196F3' }}>Player 1</span></h4>
            <div>Joueur actif: <span style={{ color: '#2196F3' }}>Oui</span></div>
            
            <h4>Données du véhicule:</h4>
            <div>Carburant: {playerVehicle?.fuel || 0}/100</div>
            <div>Dommages: {playerVehicle?.damage || 0}%</div>
            <div>Position: {playerVehicle?.coord || "Inconnue"}</div>
            <div>En mouvement: {playerVehicle?.isMoving ? "Oui" : "Non"}</div>
            <div>Ressources: 
              Food: {playerVehicle?.resources?.food || 0}, 
              Debris: {playerVehicle?.resources?.debris || 0}, 
              Special: {playerVehicle?.resources?.special || 0}
            </div>
            <div>À capacité max: {playerVehicle?.isAtCapacity ? 'Oui' : 'Non'}</div>
          </div>
        );
      
      case 'resources':
        return (
          <div>
            <h4>Ressources du Joueur</h4>
            
            {/* Section Ressources du vaisseau avec barres de progression */}
            <div style={{marginTop: '15px'}}>
              <h4 style={{margin: '0', fontWeight: 'bold'}}>Ship Resources:</h4>
              
              {playerVehicle && (
                <>
                  {/* Food Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Food:</span> {playerVehicle.resources?.food || 0}/{playerVehicle.maxCapacity?.food || 100}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(playerVehicle.resources?.food || 0, playerVehicle.maxCapacity?.food || 100)}></div>
                    </div>
                  </div>
                  
                  {/* Debris Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Debris:</span> {playerVehicle.resources?.debris || 0}/{playerVehicle.maxCapacity?.debris || 1000}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(playerVehicle.resources?.debris || 0, playerVehicle.maxCapacity?.debris || 1000)}></div>
                    </div>
                  </div>
                  
                  {/* Special Resource */}
                  <div style={{marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                      <span>Special:</span> {playerVehicle.resources?.special || 0}/{playerVehicle.maxCapacity?.special || 2}
                    </div>
                    <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                      <div style={getResourceBarStyle(playerVehicle.resources?.special || 0, playerVehicle.maxCapacity?.special || 2)}></div>
                    </div>
                  </div>
                  
                  <p>
                    <strong>At Capacity:</strong> {playerVehicle.isAtCapacity ? "Yes" : "No"}
                  </p>
                </>
              )}
            </div>
            
            {/* Section pour le carburant */}
            <div style={{marginTop: '15px'}}>
              <h4 style={{margin: '0', fontWeight: 'bold'}}>Fuel Status:</h4>
              <div style={{marginTop: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Fuel:</span> {playerVehicle?.fuel || 0}/100
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '12px', overflow: 'hidden'}}>
                  <div style={{...getFuelBarStyle(playerVehicle?.fuel || 0), height: '100%'}}></div>
                </div>
                {playerVehicle?.fuel < 30 && (
                  <p style={{color: '#ff5722', marginTop: '5px', fontSize: '11px'}}>
                    Attention: Niveau de carburant critique!
                  </p>
                )}
              </div>
            </div>
            
            {/* Section pour le score total du joueur */}
            <div style={{marginTop: '15px'}}>
              <h4 style={{margin: '0', fontWeight: 'bold'}}>Total Score:</h4>
              
              {/* Food Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Food:</span> {players?.player1?.score?.resources?.food || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player1?.score?.resources?.food || 0, 100)}></div>
                </div>
              </div>
              
              {/* Debris Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Debris:</span> {players?.player1?.score?.resources?.debris || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player1?.score?.resources?.debris || 0, 200)}></div>
                </div>
              </div>
              
              {/* Special Total */}
              <div style={{marginBottom: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '3px'}}>
                  <span>Special:</span> {players?.player1?.score?.resources?.special || 0}
                </div>
                <div style={{width: '100%', backgroundColor: '#444', borderRadius: '3px', height: '8px', overflow: 'hidden'}}>
                  <div style={getResourceBarStyle(players?.player1?.score?.resources?.special || 0, 10)}></div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'actions':
      case 'history':
      case 'conditions':
        return (
          <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
            <p>Aucune donnée disponible pour le joueur dans cet onglet.</p>
            <p>Le joueur n'utilise pas de système FSM ou d'actions automatisées.</p>
          </div>
        );
        
      default:
        return <div>Onglet inconnu</div>;
    }
  };
  
  // Gestionnaire d'actions pour le débogueur
  const handleResetHistory = () => {
    setStateHistory([]);
    setConditionLog([]);
  };

  // Rendu des onglets selon le mode actif (Bot ou Player)
  const renderTabContent = () => {
    if (activeMainTab === 'bot') {
      return renderBotTabContent();
    } else {
      return renderPlayerTabContent();
    }
  };
  
  return isVisible ? (
    <div style={debuggerStyle}>
      {/* En-tête avec titre et boutons de contrôle */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: 0 }}>FSM Debugger</h3>
        <div>
          <button onClick={handleResetHistory} style={{ 
            padding: '2px 5px',
            backgroundColor: '#555',
            border: 'none',
            color: '#fff',
            marginRight: '5px'
          }}>
            Reset
          </button>
          <button onClick={() => setIsVisible(false)} style={{ 
            padding: '2px 5px',
            backgroundColor: '#555',
            border: 'none',
            color: '#fff'
          }}>
            ×
          </button>
        </div>
      </div>

      {/* Onglets pour choisir entre Bot et Player */}
      <div style={tabStyle}>
        <button 
          onClick={() => setActiveMainTab('bot')} 
          style={{
            ...tabButtonStyle(activeMainTab === 'bot'),
            backgroundColor: activeMainTab === 'bot' ? '#4caf50' : '#222',
          }}
        >
          Bot
        </button>
        <button 
          onClick={() => setActiveMainTab('player')} 
          style={{
            ...tabButtonStyle(activeMainTab === 'player'),
            backgroundColor: activeMainTab === 'player' ? '#2196F3' : '#222',
          }}
        >
          Player
        </button>
      </div>
      
      {/* Onglets secondaires */}
      <div style={tabStyle}>
        <button 
          onClick={() => setActiveTab('state')} 
          style={tabButtonStyle(activeTab === 'state')}
        >
          État
        </button>
        {activeMainTab === 'bot' && (
          <button 
            onClick={() => setActiveTab('actions')} 
            style={tabButtonStyle(activeTab === 'actions')}
          >
            Actions ({actionQueue.length})
          </button>
        )}
        {activeMainTab === 'bot' && (
          <button 
            onClick={() => setActiveTab('history')} 
            style={tabButtonStyle(activeTab === 'history')}
          >
            Historique
          </button>
        )}
        {activeMainTab === 'bot' && (
          <button 
            onClick={() => setActiveTab('conditions')} 
            style={tabButtonStyle(activeTab === 'conditions')}
          >
            Conditions
          </button>
        )}
        <button 
          onClick={() => setActiveTab('resources')} 
          style={tabButtonStyle(activeTab === 'resources')}
        >
          Resources
        </button>
      </div>
      
      {/* Conteneur de contenu avec scroll */}
      <div style={contentContainerStyle}>
        {/* Contenu des onglets */}
        {renderTabContent()}
      </div>
    </div>
  ) : (
    <button 
      onClick={() => setIsVisible(true)} 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Show Debugger
    </button>
  );
};

export default BotDebugger;