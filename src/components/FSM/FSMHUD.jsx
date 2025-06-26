/**
 * ============================================================================
 * FSM HUD - HUD unifié pour la gestion et le debug des bots FSM
 * ============================================================================
 * 
 * Composant unifié qui combine les fonctionnalités de gestion et debug
 * des machines d'état finies (FSM) pour une interface claire et efficace.
 * 
 * Fonctionnalités principales:
 * - Gestion des bots (ajout/suppression)
 * - Status des bots (actif/inactif)
 * - Compteurs d'explorations et collectes
 * - Fuel, cible, position des véhicules/drones
 * - Heure de dernière MAJ
 * - Détails exp        <button 
          style={buttonStyle}
          onClick={handleRemoveBot}
          disabled={botCount <= 1}
        >les: flotte de drones, contexte FSM, historique événements
 * 
 * @version 1.0.0
 */

/**
 * ==========================================================================
 * FUSED BOT MANAGER HUD - HUD unifié pour la gestion et le debug des bots FSM
 * ==========================================================================
 *
 * Bonnes pratiques Zustand appliquées ici :
 * - Toujours utiliser des sélecteurs mémorisés (useCallback) pour éviter leur recréation à chaque rendu.
 * - Ne jamais utiliser useFSMStore() sans sélecteur dans un composant React.
 * - Utiliser une fonction de comparaison personnalisée si besoin (ici, shallow equality sur la référence).
 *
 * Voir : https://docs.pmnd.rs/zustand/guides/recipes#selectors-and-equality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useFSMStore } from '../../stores/useFSMStoreXState';
import { useFSM } from '../../hooks/useFSM';
import fsmLogger from '../../logger/fsmLogger.js';

/**
 * Composant pour afficher le score total du joueur
 * Version simplifiée qui affiche un score agrégé basé sur les bots
 */
const PlayerScoreDisplay = ({ botIds, botStates }) => {
  // Calculer un score approximatif basé sur l'activité des bots
  const calculateEstimatedScore = () => {
    let estimatedScore = { food: 0, debris: 0, special: 0 };
    
    // Estimation basée sur le nombre de bots actifs et leur état
    botIds.forEach(botId => {
      const botState = botStates[botId];
      if (botState) {
        // Score estimé basé sur l'état du bot
        const multiplier = botState.fuel > 50 ? 1.5 : 1;
        const baseScore = {
          food: Math.floor(15 * multiplier),
          debris: Math.floor(25 * multiplier),
          special: Math.floor(2 * multiplier)
        };
        
        estimatedScore.food += baseScore.food;
        estimatedScore.debris += baseScore.debris;
        estimatedScore.special += baseScore.special;
      }
    });
    
    const total = estimatedScore.food + estimatedScore.debris + estimatedScore.special;
    return { ...estimatedScore, total };
  };

  const totalScore = calculateEstimatedScore();

  const scoreStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    padding: '6px',
    backgroundColor: '#1a2a1a',
    borderRadius: '4px',
    border: '1px solid #FFD700'
  };

  return (
    <div style={scoreStyle}>
      <div style={{ fontWeight: 'bold', color: '#FFD700' }}>
        [SCORE] Total:
      </div>
      <div style={{ fontSize: '11px', display: 'flex', gap: '8px' }}>
        <span>F:{totalScore.food}</span>
        <span>D:{totalScore.debris}</span>
        <span>S:{totalScore.special}</span>
        <span style={{ fontWeight: 'bold', color: '#FFD700' }}>
          = {totalScore.total} pts
        </span>
      </div>
    </div>
  );
};

/**
 * Composant pour un bot individuel avec toutes ses infos
 */
const BotCard = ({ botId, isManagerRunning, onBotStateChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Remplacer l'utilisation de useCentralizedEventHistorySync par des valeurs factices pour debug :
  const send = () => {};
  const current = {};
  const eventHistory = [];
  const clearHistory = () => {};

  // Extraire les données du contexte actuel avec vérifications de sécurité
  const entity = current?.context?.entity || null;
  const vehicle = current?.context?.vehicle || null;
  const droneFleet = current?.context?.droneFleet || null;
  const state = current?.name || 'UNKNOWN';
  const context = current?.context || null;
  const isMoving = current?.context?.isMoving || false;
  const fuel = vehicle?.fuel || 0;
  const target = vehicle?.target || null;
  const position = vehicle?.position || entity?.position || null;
  const score = context?.score || null;

  // Pour diagnostic : log la fréquence d'exécution - DÉSACTIVÉ pour éviter la boucle infinie
  // useEffect(() => {
  //   console.log('BotCard effect fired', {botId, state, fuel, isMoving});
  // }, [current, state, fuel, isMoving, botId, onBotStateChange]);

  // Calculer les statistiques d'exploration et collecte depuis le contexte FSM
  const getExplorationCount = () => {
    return context?.memory?.stats?.tilesExplored || 0;
  };

  const getCollectionCount = () => {
    return context?.memory?.stats?.tilesCollected || 0;
  };

  // Fonctions utilitaires pour les couleurs et icônes
  const getStateColor = (stateName) => {
    switch (stateName) {
      case 'IDLE': return '#666';
      case 'EXPLORING': case 'exploring_deploying': case 'exploring_returning': return '#4CAF50';
      case 'COLLECTING': return '#FF9800';
      case 'RETURNING': return '#2196F3';
      default: return '#999';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'TRANSITION': return '#4CAF50';
      case 'SENT': return '#2196F3';
      case 'CONTEXT_UPDATE': return '#FF9800';
      default: return '#999';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'TRANSITION': return '[~]';
      case 'SENT': return '►';
      case 'CONTEXT_UPDATE': return '≡';
      default: return '[...]';
    }
  };

  const cardStyle = {
    border: '1px solid #444',
    borderRadius: '6px',
    margin: '8px 0',
    backgroundColor: '#2a2a2a',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '10px',
    backgroundColor: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: showDetails ? '1px solid #444' : 'none'
  };

  const contentStyle = {
    padding: '10px',
    fontSize: '11px'
  };

  const stateStyle = {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    backgroundColor: getStateColor(state),
    color: '#000'
  };

  return (
    <div style={cardStyle}>
      {/* Header du bot */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>♦ {botId}</span>
          <span style={stateStyle}>{state || 'UNKNOWN'}</span>
          <span style={{ 
            fontSize: '10px', 
            color: isManagerRunning && !isMoving ? '#4CAF50' : '#666' 
          }}>
            {isManagerRunning ? (isMoving ? '►' : '●') : '○'}
          </span>
        </div>
        <button
          style={{
            padding: '4px 8px',
            fontSize: '10px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            backgroundColor: showDetails ? '#FF9800' : '#444',
            color: '#fff'
          }}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▲' : '▼'}
        </button>
      </div>

      {/* Contenu principal */}
      <div style={contentStyle}>
        {/* Informations de base */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <div>
            <div><strong>⚡ F: Fuel:</strong> {fuel}%</div>
            <div><strong>→ Target:</strong> {target && target.x !== undefined && target.y !== undefined ? `${target.x},${target.y}` : 'Aucune'}</div>
            <div><strong>◊ Position:</strong> {position && position.x !== undefined && position.z !== undefined ? `${Math.round(position.x)},${Math.round(position.z)}` : 'Inconnue'}</div>
          </div>
          <div>
            <div><strong>⌐ E: Explorations:</strong> {getExplorationCount()}</div>
            <div><strong>■ C: Collectes:</strong> {getCollectionCount()}</div>
            <div><strong>★ Score:</strong> {
              typeof score === 'object' && score?.resources 
                ? `${(score.resources.food || 0) + (score.resources.debris || 0) + (score.resources.special || 0)}` 
                : score || 0
            }</div>
          </div>
        </div>

        {/* Ressources du vaisseau */}
        {vehicle?.resources && typeof vehicle.resources === 'object' && (
          <div style={{ 
            backgroundColor: '#1a2a1a', 
            padding: '6px', 
            borderRadius: '3px',
            marginBottom: '8px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>♦ Ressources du vaisseau:</div>
            <div style={{ fontSize: '10px' }}>
              F: {vehicle.resources.food || 0}/{vehicle.maxCapacity?.food || 200} |
              D: {vehicle.resources.debris || 0}/{vehicle.maxCapacity?.debris || 1800} |
              S: {vehicle.resources.special || 0}/{vehicle.maxCapacity?.special || 3}
            </div>
          </div>
        )}

        {/* Heure de dernière MAJ */}
        <div style={{ 
          fontSize: '9px', 
          color: '#888', 
          textAlign: 'right',
          borderTop: '1px solid #444',
          paddingTop: '4px'
        }}>
          ♠ T: Dernière MAJ: {lastUpdate.toLocaleTimeString()}
        </div>

        {/* Section détails (expandable) */}
        {showDetails && (
          <div style={{ marginTop: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            
            {/* Flotte de drones */}
            {droneFleet && typeof droneFleet === 'object' && Object.keys(droneFleet).length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '4px' }}>
                  ▓ [DRONES] Flotte de drones ({Object.keys(droneFleet).length})
                </div>
                <div style={{ 
                  backgroundColor: '#1a1a1a', 
                  padding: '6px', 
                  borderRadius: '3px',
                  fontSize: '10px'
                }}>
                  {Object.entries(droneFleet)
                    .filter(([droneId, drone]) => droneId && drone !== null && drone !== undefined)
                    .map(([droneId, drone]) => {
                      return (
                        <div key={droneId} style={{ margin: '2px 0' }}>
                          <span style={{ color: '#4CAF50' }}>{droneId}:</span>
                          <span style={{ marginLeft: '5px' }}>
                            ∞ Pos: {drone?.position && drone.position.x !== undefined && drone.position.z !== undefined 
                              ? `${Math.round(drone.position.x)},${Math.round(drone.position.z)}` 
                              : 'N/A'} |
                            ≈ BAT: {drone?.fuel || 0}% |
                            <span style={{ 
                              backgroundColor: getStateColor(drone?.state), 
                              color: '#000',
                              padding: '1px 3px',
                              borderRadius: '2px',
                              marginLeft: '3px'
                            }}>
                              {drone?.state || 'IDLE'}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  {Object.entries(droneFleet).filter(([droneId, drone]) => !droneId || drone === null || drone === undefined).length > 0 && (
                    <div style={{ margin: '2px 0', color: '#f44336', fontStyle: 'italic' }}>
                      ¡ [!] {Object.entries(droneFleet).filter(([droneId, drone]) => !droneId || drone === null || drone === undefined).length} drone(s) avec données manquantes
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contexte FSM */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold', color: '#FF9800' }}>⌂ [CFG] Contexte FSM</span>
                <button
                  style={{
                    padding: '2px 6px',
                    fontSize: '8px',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: '#4CAF50',
                    color: '#000'
                  }}
                  onClick={() => {
                    const contextData = {
                      botId,
                      timestamp: new Date().toISOString(),
                      state,
                      context: context || {},
                      vehicle: vehicle || {},
                      droneFleet: droneFleet || {}
                    };
                    navigator.clipboard.writeText(JSON.stringify(contextData, null, 2));
                  }}
                  title="Copier le contexte complet"
                >
                  ♫ [COPY] Copier
                </button>
              </div>
              <pre style={{ 
                fontSize: '8px', 
                backgroundColor: '#1a1a1a', 
                padding: '6px', 
                borderRadius: '3px',
                overflow: 'auto',
                maxHeight: '100px',
                color: '#ccc',
                lineHeight: '1.2'
              }}>
                {context ? JSON.stringify({
                  state,
                  isMoving,
                  autoEvents: context.autoEvents,
                  entity: entity || {},
                  fuel: fuel,
                  target: target,
                  position: position
                }, null, 2) : 'Aucun contexte disponible'}
              </pre>
            </div>

            {/* Historique des événements */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{ fontWeight: 'bold', color: '#2196F3' }}>
                  ≡ [HIST] Historique ({eventHistory.length})
                </span>
                <button
                  style={{
                    padding: '2px 6px',
                    fontSize: '8px',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: '#f44336',
                    color: '#fff'
                  }}
                  onClick={clearHistory}
                  title="Vider l'historique"
                >
                  ♪ [DEL] Vider
                </button>
              </div>
              <div style={{ 
                backgroundColor: '#1a1a1a', 
                padding: '6px', 
                borderRadius: '3px',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {eventHistory.length === 0 ? (
                  <div style={{ fontSize: '9px', color: '#666', fontStyle: 'italic' }}>
                    Aucun événement enregistré
                  </div>
                ) : (
                  eventHistory.slice(-10).reverse().map((event, index) => (
                    <div key={index} style={{ 
                      margin: '3px 0', 
                      padding: '4px', 
                      backgroundColor: '#2a2a2a',
                      borderRadius: '2px',
                      fontSize: '9px',
                      borderLeft: `3px solid ${getEventTypeColor(event.type)}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{getEventTypeIcon(event.type)}</span>
                          <span style={{ 
                            fontWeight: 'bold',
                            color: getEventTypeColor(event.type)
                          }}>
                            {event.type}
                          </span>
                          <span style={{ color: '#ccc' }}>
                            {typeof event.eventName === 'object' ? (event.eventName.type || 'UNKNOWN_EVENT') : String(event.eventName || 'unknown')}
                          </span>
                        </div>
                        <span style={{ color: '#888', fontSize: '8px' }}>
                          {String(event.timestamp || '')}
                        </span>
                      </div>
                      
                      {event.type === 'TRANSITION' && (
                        <div style={{ fontSize: '8px', color: '#ccc', marginTop: '2px' }}>
                          État: {String(event.eventData?.from || 'unknown')} → {String(event.eventData?.to || 'unknown')}
                        </div>
                      )}
                      
                      <div style={{ fontSize: '8px', color: '#666', marginTop: '1px' }}>
                        État actuel: {String(event.fromState || 'unknown')}
                      </div>
                    </div>
                  ))
                )}
                {eventHistory.length > 10 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    fontSize: '8px', 
                    fontStyle: 'italic',
                    marginTop: '4px'
                  }}>
                    ... {eventHistory.length - 10} événements plus anciens
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Composant principal du HUD fusionné
 */
const FSMHUD = () => {
  // État local pour le debug et les statistiques
  const [botStates, setBotStates] = useState({});
  
  // Adaptation des sélecteurs pour le nouveau store (useFSMStore qui était useCentralFSMStore)
  // Le nouveau store a une structure différente, nous adaptons ici
  const botIds = useFSMStore(useCallback(state => Object.keys(state.botStates || {}), []));
  const isRunning = useState(true)[0]; // Placeholder - dans le nouveau store, pas de concept global "running"
  const addBotToStore = useFSMStore(useCallback(state => state.addBot, []));
  const removeBotFromStore = useFSMStore(useCallback(state => state.removeBot, []));
  
  // Fonctions adaptées pour le nouveau store
  const startSystem = useCallback(() => { /* Pas d'équivalent dans le nouveau store */ }, []);
  const stopSystem = useCallback(() => { /* Pas d'équivalent dans le nouveau store */ }, []);
  const toggleSystem = useCallback(() => { /* Pas d'équivalent dans le nouveau store */ }, []);
  const botCount = useFSMStore(useCallback(state => Object.keys(state.botStates || {}).length, []));
  const updateBotStatesSnapshot = useCallback(() => { /* Gestion automatique dans le nouveau store */ }, []);

  // Callback pour mettre à jour l'état d'un bot spécifique (avec deep equality)
  const updateBotState = useCallback((botId, botData) => {
    setBotStates(prev => {
      const prevData = prev[botId];
      // Deep equality simple (JSON.stringify)
      if (prevData && JSON.stringify(prevData) === JSON.stringify(botData)) {
        return prev; // Pas de changement réel
      }
      return {
        ...prev,
        [botId]: botData
      };
    });
  }, []);

  // Effet pour synchroniser les états des bots avec le store FSM
  useEffect(() => {
    updateBotStatesSnapshot(botStates);
  }, [botStates, updateBotStatesSnapshot]);

  // Handlers pour les contrôles
  const handleToggleRunning = useCallback(() => {
    toggleSystem();
  }, [toggleSystem]);

  const handleAddBot = useCallback(() => {
    addBotToStore();
  }, [addBotToStore]);

  const handleRemoveBot = useCallback(() => {
    removeBotFromStore();
  }, [removeBotFromStore]);

  // Démarrage automatique
  useEffect(() => {
    fsmLogger.info("[FusedBotManagerHUD] HUD fusionné initialisé");
    if (!isRunning) {
      startSystem();
    }
  }, [startSystem, isRunning]);

  // Styles du conteneur principal
  const containerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '400px',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
    backgroundColor: '#2a2a2a',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '12px',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#fff',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    padding: '8px 0',
    borderBottom: '2px solid #4CAF50'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    padding: '6px 10px',
    fontSize: '11px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#444',
    color: '#fff',
    transition: 'background-color 0.2s'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f44336'
  };

  // Sécurisation des accès à l’état global et aux bots
  const safeBotIds = Array.isArray(botIds) && botIds.length > 0 ? botIds : ['main'];
  const safeBotStates = typeof botStates === 'object' && botStates !== null ? botStates : { main: {} };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#4CAF50', fontSize: '16px' }}>
          ☼ Bot Manager FSM
        </h3>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          v2.0.0 FUSIONNÉ
        </div>
      </div>

      {/* Controls globaux */}
      <div style={controlsStyle}>
        <button 
          style={isRunning ? activeButtonStyle : buttonStyle}
          onClick={handleToggleRunning}
        >
          {isRunning ? '‖ STOP' : '► START'}
        </button>
        <button 
          style={buttonStyle}
          onClick={handleAddBot}
          disabled={botCount >= 4}
        >
          ± + Ajouter Bot
        </button>
        <button 
          style={dangerButtonStyle}
          onClick={handleRemoveBot}
          disabled={botCount <= 1}
        >
          ∓ - Supprimer Bot
        </button>
      </div>

      {/* Status global */}
      <div style={{ 
        marginBottom: '12px', 
        padding: '10px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '6px',
        border: `1px solid ${isRunning ? '#4CAF50' : '#f44336'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong>Status Système:</strong> 
          <span style={{ color: isRunning ? '#4CAF50' : '#f44336' }}>
            {isRunning ? '● ACTIF' : '○ ARRÊTÉ'}
          </span>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Bots actifs:</strong> {botCount}
        </div>
        
        {/* Score du joueur */}
        <PlayerScoreDisplay botIds={safeBotIds} botStates={safeBotStates} />
      </div>

      {/* Liste des bots */}
      <div>
        {safeBotIds.map(botId => (
          <BotCard
            key={botId}
            botId={botId}
            isManagerRunning={isRunning}
            onBotStateChange={updateBotState}
          />
        ))}
      </div>

      {/* Footer avec info debug */}
      <div style={{ 
        marginTop: '12px', 
        padding: '6px', 
        backgroundColor: '#1a1a1a', 
        borderRadius: '3px',
        fontSize: '9px',
        color: '#888',
        borderTop: '1px solid #444'
      }}>
        <div>Rendu: {new Date().toLocaleTimeString()}</div>
        <div>IDs Bots: [{botIds.join(', ')}]</div>
      </div>
    </div>
  );
};

export default FSMHUD;
