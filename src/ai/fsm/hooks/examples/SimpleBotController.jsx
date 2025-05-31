/**
 * EXEMPLE SIMPLE D'UTILISATION DU HOOK USEBOTMACHINE
 * 
 * Ce composant montre comment utiliser useBotMachine pour créer
 * une interface de contrôle de bot simple et intuitive.
 */

import React, { useEffect, useState } from 'react';
import { useBotMachineFixed } from '../useBotMachineFixed.js';

/**
 * Interface simple pour contrôler un bot
 */
const SimpleBotController = ({ botId }) => {
  // Utilisation du hook useBotMachineFixed
  const { 
    actions, 
    state, 
    helpers, 
    vehicle 
  } = useBotMachineFixed(botId);
  
  // État pour gérer les coordonnées de destination
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  
  // Observer l'état du bot pour des notifications
  const [notification, setNotification] = useState('');
  const [notificationTimer, setNotificationTimer] = useState(null);
  
  // Fonction pour afficher une notification temporaire
  const showNotification = (message) => {
    // Effacer l'ancien timer si nécessaire
    if (notificationTimer) clearTimeout(notificationTimer);
    
    // Afficher la nouvelle notification
    setNotification(message);
    
    // La faire disparaître après 3 secondes
    const timer = setTimeout(() => {
      setNotification('');
    }, 3000);
    
    setNotificationTimer(timer);
  };
  
  // Observer les changements d'état
  useEffect(() => {
    showNotification(`État actuel: ${state}`);
  }, [state]);
  
  // Nettoyer le timer au démontage
  useEffect(() => {
    return () => {
      if (notificationTimer) clearTimeout(notificationTimer);
    };
  }, [notificationTimer]);
  
  // Récupérer les métriques du bot
  const metrics = helpers.getMetrics();
  
  // Gestionnaire pour déplacer le bot
  const handleMoveTo = () => {
    const coords = { x: parseInt(targetX), y: parseInt(targetY) };
    actions.moveTo(coords);
    showNotification(`Déplacement vers (${targetX}, ${targetY})`);
  };
  
  return (
    <div className="bot-controller">
      <h2>Bot {botId} - {state}</h2>
      
      {/* Notifications */}
      {notification && (
        <div className="notification">{notification}</div>
      )}
      
      {/* Informations sur le bot */}
      <div className="bot-info">
        <div className="info-section">
          <h3>État</h3>
          <p>Position actuelle: ({vehicle?.position?.x || 0}, {vehicle?.position?.y || 0})</p>
          <p>En mouvement: {helpers.isMoving() ? 'Oui' : 'Non'}</p>
          <p>Mode: {helpers.isAutonomous() ? 'Autonome' : 'Manuel'}</p>
        </div>
        
        <div className="info-section">
          <h3>Ressources</h3>
          <p>Carburant: {metrics.fuel}/100</p>
          <p>Santé: {metrics.health}/100</p>
          <p>Ressources: {metrics.resources.food} nourriture, {metrics.resources.debris} débris</p>
        </div>
        
        <div className="info-section">
          <h3>Historique</h3>
          <p>Dernière action: {metrics.lastAction || 'Aucune'}</p>
          <p>Temps actif: {Math.floor(metrics.uptime / 1000)}s</p>
        </div>
      </div>
      
      {/* Contrôle du déplacement */}
      <div className="control-section">
        <h3>Déplacement</h3>
        <div className="control-group">
          <label>
            X:
            <input 
              type="number" 
              value={targetX} 
              onChange={(e) => setTargetX(e.target.value)}
            />
          </label>
          <label>
            Y:
            <input 
              type="number" 
              value={targetY} 
              onChange={(e) => setTargetY(e.target.value)}
            />
          </label>
          <button onClick={handleMoveTo}>Déplacer</button>
          <button onClick={actions.stopMovement}>Arrêter</button>
        </div>
      </div>
      
      {/* Actions comportementales */}
      <div className="control-section">
        <h3>Comportement</h3>
        <div className="button-group">
          <button onClick={actions.startExploration}>Explorer</button>
          <button onClick={actions.startCollecting}>Collecter</button>
          <button onClick={actions.returnToBase}>Retour à la base</button>
          <button onClick={actions.toggleAutonomous}>
            {helpers.isAutonomous() ? 'Passer en manuel' : 'Passer en auto'}
          </button>
        </div>
      </div>
      
      {/* DEBUG: États forcés */}
      <div className="debug-section">
        <h3>Debug</h3>
        <div className="button-group">
          <button onClick={() => actions.forceState('evaluating')}>État: Évaluation</button>
          <button onClick={() => actions.forceState('exploring')}>État: Exploration</button>
          <button onClick={() => actions.forceState('collecting')}>État: Collection</button>
          <button onClick={() => actions.forceState('returning')}>État: Retour</button>
          <button onClick={() => actions.forceState('idleAtBase')}>État: À la base</button>
        </div>
      </div>
    </div>
  );
};

export default SimpleBotController;
