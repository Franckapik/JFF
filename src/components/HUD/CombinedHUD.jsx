import React, { useState, useEffect } from "react";
import usePlayerStore from "../../stores/playerStore";
import useBotStore from "../../stores/useBotStore";
import { useTileStore } from "../../stores/useNewTileStore";
import { BOT_PLAYER_ID, HUMAN_PLAYER_ID, getBotMainVehicleId } from '../../ai/constants/playerConstants';
import PlayerHUD from "./PlayerHUD";
import BotHUD from "./BotHUD";

// Style pour le conteneur principal du HUD combiné
const combinedHudStyle = {
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  padding: '10px',
  borderRadius: '8px',
  maxWidth: '500px',
  maxHeight: '500px',
  overflow: 'auto',
  fontFamily: 'monospace',
  fontSize: '12px',
  zIndex: 1000,
};

// Style pour les onglets principaux
const tabStyle = {
  display: 'flex',
  marginBottom: '10px',
};

// Style pour les boutons d'onglet
const tabButtonStyle = (active) => ({
  padding: '5px 10px',
  backgroundColor: active ? '#444' : '#222',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '5px',
  borderRadius: '4px',
});

// Style pour les conteneurs de contenu
const contentStyle = {
  padding: '10px',
  backgroundColor: '#222',
  borderRadius: '4px',
};

/**
 * Composant CombinedHUD qui réunit PlayerHUD et BotHUD avec un système d'onglets
 * similaire à celui du BotDebugger
 */
const CombinedHUD = () => {
  // États pour la gestion des onglets
  const [activeMainTab, setActiveMainTab] = useState('player'); // 'player' ou 'bot'
  const [activeSubTab, setActiveSubTab] = useState('status'); // 'status', 'resources', 'actions', 'history'
  const [stateHistory, setStateHistory] = useState([]);
  
  // Récupération des données
  const players = usePlayerStore((state) => state.players);
  const botState = useBotStore((state) => state.botState);
  const isRunning = useBotStore((state) => state.isRunning);
  const actionQueue = useBotStore((state) => state.actionQueue) || [];
  const completedActions = useBotStore((state) => state.completedActions) || [];
  
  // Récupération des véhicules avec les constantes
  const humanVehicleId = "ship"; // Vaisseau du joueur humain
  const botVehicleId = getBotMainVehicleId();
  const humanShip = players[HUMAN_PLAYER_ID]?.vehicles?.[humanVehicleId];
  const botShip = players[BOT_PLAYER_ID]?.vehicles?.[botVehicleId];
  
  // Ajoute un état au historique lors des changements
  useEffect(() => {
    if (botState && botShip) {
      const timestamp = new Date().toLocaleTimeString();
      const newStateEntry = {
        state: botState,
        timestamp,
        position: botShip.coord || "Unknown",
        fuel: botShip.fuel || 0
      };
      
      setStateHistory(prev => {
        // Limiter l'historique à 20 entrées pour la performance
        const updatedHistory = [newStateEntry, ...prev];
        return updatedHistory.slice(0, 20);
      });
    }
  }, [botState, botShip]);
  
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

  // Rendu du contenu en fonction des onglets
  const renderContent = () => {
    // Contenu pour l'onglet Joueur
    if (activeMainTab === 'player') {
      switch (activeSubTab) {
        case 'status':
          return (
            <div style={contentStyle}>
              <h4>Status du Joueur</h4>
              {humanShip && (
                <>
                  <p><strong>Position:</strong> {humanShip.coord || "Unknown"}</p>
                  <p><strong>Carburant:</strong> {humanShip.fuel}%</p>
                  <div style={{width: '100%', backgroundColor: '#444', height: '10px', marginBottom: '15px'}}>
                    <div style={{...getFuelBarStyle(humanShip.fuel), height: '100%'}}></div>
                  </div>
                  <p><strong>En mouvement:</strong> {humanShip.isMoving ? "Oui" : "Non"}</p>
                </>
              )}
            </div>
          );
        case 'resources':
          return (
            <div style={contentStyle}>
              <h4>Ressources du Joueur</h4>
              {humanShip && (
                <>
                  <p><strong>Ressources à bord:</strong></p>
                  <ul>
                    <li>Food: {humanShip.resources?.food || 0}</li>
                    <li>Debris: {humanShip.resources?.debris || 0}</li>
                    <li>Special: {humanShip.resources?.special || 0}</li>
                  </ul>
                  <p><strong>À capacité:</strong> {humanShip.isAtCapacity ? "Oui" : "Non"}</p>
                  <p><strong>Score total:</strong></p>
                  <ul>
                    <li>Food: {players[HUMAN_PLAYER_ID]?.score?.resources?.food || 0}</li>
                    <li>Debris: {players[HUMAN_PLAYER_ID]?.score?.resources?.debris || 0}</li>
                    <li>Special: {players[HUMAN_PLAYER_ID]?.score?.resources?.special || 0}</li>
                  </ul>
                </>
              )}
            </div>
          );
        case 'actions':
          return (
            <div style={contentStyle}>
              <h4>Actions du Joueur</h4>
              <p>Aucune action du joueur à afficher.</p>
            </div>
          );
        case 'history':
          return (
            <div style={contentStyle}>
              <h4>Historique du Joueur</h4>
              <p>Historique des mouvements non disponible pour le joueur.</p>
            </div>
          );
        default:
          return <div>Sélectionnez un sous-onglet</div>;
      }
    } 
    // Contenu pour l'onglet Bot
    else if (activeMainTab === 'bot') {
      switch (activeSubTab) {
        case 'status':
          return (
            <div style={contentStyle}>
              <h4>Status du Bot</h4>
              <p><strong>État actuel:</strong> {botState || "Unknown"}</p>
              <p><strong>Bot actif:</strong> {isRunning ? "Oui" : "Non"}</p>
              {botShip && (
                <>
                  <p><strong>Position:</strong> {botShip.coord || "Unknown"}</p>
                  <p><strong>Carburant:</strong> {botShip.fuel}%</p>
                  <div style={{width: '100%', backgroundColor: '#444', height: '10px', marginBottom: '15px'}}>
                    <div style={{...getFuelBarStyle(botShip.fuel), height: '100%'}}></div>
                  </div>
                  <p><strong>En mouvement:</strong> {botShip.isMoving ? "Oui" : "Non"}</p>
                </>
              )}
            </div>
          );
        case 'resources':
          return (
            <div style={contentStyle}>
              <h4>Ressources du Bot</h4>
              {botShip && (
                <>
                  <p><strong>Ressources à bord:</strong></p>
                  <ul>
                    <li>Food: {botShip.resources?.food || 0}</li>
                    <li>Debris: {botShip.resources?.debris || 0}</li>
                    <li>Special: {botShip.resources?.special || 0}</li>
                  </ul>
                  <p><strong>À capacité:</strong> {botShip.isAtCapacity ? "Oui" : "Non"}</p>
                  <p><strong>Score total:</strong></p>
                  <ul>
                    <li>Food: {players[BOT_PLAYER_ID]?.score?.resources?.food || 0}</li>
                    <li>Debris: {players[BOT_PLAYER_ID]?.score?.resources?.debris || 0}</li>
                    <li>Special: {players[BOT_PLAYER_ID]?.score?.resources?.special || 0}</li>
                  </ul>
                </>
              )}
            </div>
          );
        case 'actions':
          return (
            <div style={contentStyle}>
              <h4>File d'actions ({actionQueue.length})</h4>
              {actionQueue.length === 0 ? (
                <p style={{ color: '#888' }}>Aucune action en attente</p>
              ) : (
                <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
                  {actionQueue.map((action, index) => (
                    <li key={index} style={{ 
                      padding: '5px', 
                      backgroundColor: '#333', 
                      margin: '3px 0',
                      borderRadius: '4px' 
                    }}>
                      <div><strong>Type:</strong> {action.type}</div>
                      <div><strong>Priorité:</strong> {action.priority}</div>
                    </li>
                  ))}
                </ul>
              )}
              
              <h4>Actions complétées ({completedActions.length})</h4>
              {completedActions.length === 0 ? (
                <p style={{ color: '#888' }}>Aucune action complétée</p>
              ) : (
                <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
                  {completedActions.slice(0, 5).map((action, index) => (
                    <li key={index} style={{ 
                      padding: '5px', 
                      backgroundColor: '#2a4d6d', 
                      margin: '3px 0',
                      borderRadius: '4px' 
                    }}>
                      <div><strong>Type:</strong> {action.type}</div>
                      <div><strong>Priorité:</strong> {action.priority}</div>
                      <div style={{ fontSize: '10px', color: '#aaa' }}>
                        Complété à: {new Date(action.completedAt).toLocaleTimeString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        case 'history':
          return (
            <div style={contentStyle}>
              <h4>Historique des états ({stateHistory.length})</h4>
              {stateHistory.map((item, index) => (
                <div key={index} style={{ 
                  padding: '5px', 
                  margin: '3px 0',
                  backgroundColor: '#333',
                  borderLeft: '3px solid #4caf50',
                  borderRadius: '2px' 
                }}>
                  <div><strong>{item.timestamp}</strong> → {item.state}</div>
                  <div style={{ fontSize: '10px', color: '#aaa' }}>
                    Position: {item.position}, Fuel: {item.fuel}%
                  </div>
                </div>
              ))}
            </div>
          );
        default:
          return <div>Sélectionnez un sous-onglet</div>;
      }
    }
    
    return <div>Sélectionnez un onglet principal</div>;
  };
  
  return (
    <div style={combinedHudStyle}>
      {/* Onglets principaux pour choisir entre joueur et bot */}
      <div style={tabStyle}>
        <button 
          style={tabButtonStyle(activeMainTab === 'player')}
          onClick={() => setActiveMainTab('player')}>
          Joueur
        </button>
        <button 
          style={tabButtonStyle(activeMainTab === 'bot')}
          onClick={() => setActiveMainTab('bot')}>
          Bot
        </button>
      </div>
      
      {/* Sous-onglets pour choisir la catégorie d'informations */}
      <div style={tabStyle}>
        <button 
          style={tabButtonStyle(activeSubTab === 'status')}
          onClick={() => setActiveSubTab('status')}>
          Status
        </button>
        <button 
          style={tabButtonStyle(activeSubTab === 'resources')}
          onClick={() => setActiveSubTab('resources')}>
          Resources
        </button>
        <button 
          style={tabButtonStyle(activeSubTab === 'actions')}
          onClick={() => setActiveSubTab('actions')}>
          Actions
        </button>
        <button 
          style={tabButtonStyle(activeSubTab === 'history')}
          onClick={() => setActiveSubTab('history')}>
          History
        </button>
      </div>
      
      {/* Contenu principal basé sur la sélection d'onglets */}
      {renderContent()}
    </div>
  );
};

export default CombinedHUD;