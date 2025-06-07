/**
 * ============================================================================
 * FSM DEBUG PANEL - Panneau de debug avancé pour machines d'état
 * ============================================================================
 * 
 * Panneau de debug complet pour visualiser et interagir avec les FSM.
 * Affiche les états, transitions, contexte, et permet les interactions.
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCentralizedEventHistorySync } from "../../ai/fsm/hooks/useCentralizedEventHistorySync.js";
import { useFSMBots } from "../../stores/useFSMStore/useFSMBots.js";

/**
 * Composant de visualisation d'une machine d'état individuelle
 */
const FSMVisualization = ({ botId, expanded = false }) => {
  // Utiliser le nouveau hook centralisé avec synchronisation
  const { 
    send, 
    current, 
    eventHistory, 
    clearHistory 
  } = useCentralizedEventHistorySync(botId);

  // Extraire les données du contexte actuel
  const entity = current?.context?.entity;
  const vehicle = current?.context?.vehicle;
  const droneFleet = current?.context?.droneFleet;
  const state = current?.name;
  const context = current?.context;
  const isMoving = current?.context?.isMoving;
  const autoEvents = current?.context?.autoEvents;


  // États disponibles (pour simulation)
  const availableStates = ['IDLE', 'EXPLORING', 'COLLECTING', 'RETURNING'];

  const containerStyle = {
    border: '1px solid #555',
    borderRadius: '5px',
    margin: '5px 0',
    backgroundColor: '#2a2a2a'
  };

  const headerStyle = {
    padding: '8px',
    backgroundColor: '#333',
    borderRadius: '5px 5px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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

  function getStateColor(stateName) {
    const colors = {
      'IDLE': '#ffd700',
      'EXPLORING': '#87ceeb',
      'COLLECTING': '#90ee90',
      'RETURNING': '#ffa500'
    };
    return colors[stateName] || '#ddd';
  }

  function getEventTypeColor(type) {
    const colors = {
      'SENT': '#4CAF50',        // Vert pour les événements envoyés
      'TRANSITION': '#2196F3',   // Bleu pour les transitions d'état
      'CONTEXT_UPDATE': '#FF9800' // Orange pour les updates de contexte
    };
    return colors[type] || '#ddd';
  }

  function getEventTypeIcon(type) {
    const icons = {
      'SENT': '📤',
      'TRANSITION': '🔄', 
      'CONTEXT_UPDATE': '📝'
    };
    return icons[type] || '❓';
  }

  // ===== DEBUG: Log de l'état du drone =====
  useEffect(() => {
    if (droneFleet?.drones?.explorer) {
      console.log(`[FSMDebugPanel] Drone state for ${botId}:`, {
        droneState: droneFleet.drones.explorer.state,
        isActive: droneFleet.drones.explorer.isActive,
        position: droneFleet.drones.explorer.position,
        targetPosition: droneFleet.drones.explorer.targetPosition,
        lastUpdate: droneFleet.drones.explorer.lastUpdate,
        currentTime: Date.now()
      });
    }
  }, [droneFleet?.drones?.explorer?.state, droneFleet?.drones?.explorer?.lastUpdate, botId]);

  return (
    <div style={containerStyle}>
      {/* Header avec état principal */}
      <div style={headerStyle}>
        <div>
          <strong>{botId}</strong>
          <span style={{ marginLeft: '10px', ...stateStyle }}>
            {String(state || 'unknown')}
          </span>
        </div>
        <div>
          {autoEvents?.isActive ? '🔄 AUTO' : '🎮 MANUEL'}
          {droneFleet?.status && (
            <span style={{ marginLeft: '5px', fontSize: '10px' }}>
              🚁 {String(droneFleet.status).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Contenu détaillé (si expanded) */}
      {expanded && (
        <div style={contentStyle}>
          {/* Informations contexte */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Contexte:</strong>
            <div style={{ fontSize: '10px', marginTop: '5px' }}>
              <div>Mode: {String(entity?.mode || 'N/A')}</div>
              <div>Type: {String(entity?.type || 'N/A')}</div>
              <div>En mouvement: {isMoving ? 'Oui' : 'Non'}</div>
              {vehicle && (
                <>
                  <div>Position: {String(vehicle.coord || 'N/A')}</div>
                  <div>Carburant: {String(vehicle.fuel || 0)}/100</div>
                </>
              )}
            </div>
          </div>

          {/* États des drones en temps réel */}
          {droneFleet && (
            <div style={{ marginBottom: '10px' }}>
              <strong>🚁 Flotte de drones:</strong>
              <div style={{ 
                fontSize: '10px', 
                marginTop: '5px',
                padding: '5px',
                backgroundColor: '#333',
                borderRadius: '3px'
              }}>
                <div>Status: <span style={{ fontWeight: 'bold' }}>{String(droneFleet.status || '').toUpperCase() || 'N/A'}</span></div>
                
                {/* Drone explorateur */}
                {droneFleet.drones?.explorer && (
                  <div style={{ 
                    marginTop: '5px', 
                    padding: '3px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '2px',
                    borderLeft: droneFleet.drones.explorer.state === 'exploring' ? '3px solid #4CAF50' : '3px solid #666'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        {droneFleet.drones.explorer.state === 'exploring' ? '🔍' : 
                         droneFleet.drones.explorer.state === 'returning' ? '🏠' : '🛡️'} 
                        Explorer
                      </span>
                      <span style={{ 
                        fontSize: '9px', 
                        color: droneFleet.drones.explorer.isActive ? '#4CAF50' : '#888' 
                      }}>
                        {String(droneFleet.drones.explorer.state || '').toUpperCase() || 'DOCKED'}
                      </span>
                    </div>
                    {droneFleet.drones.explorer.position && (
                      <div style={{ fontSize: '9px', color: '#ccc', marginTop: '2px' }}>
                        Pos: {String(droneFleet.drones.explorer.position.x?.toFixed(1) || '0')},{String(droneFleet.drones.explorer.position.z?.toFixed(1) || '0')}
                      </div>
                    )}
                    {droneFleet.drones.explorer.missionTarget && (
                      <div style={{ fontSize: '9px', color: '#ccc' }}>
                        Target: {String(droneFleet.drones.explorer.missionTarget.x || '0')},{String(droneFleet.drones.explorer.missionTarget.z || '0')}
                      </div>
                    )}
                  </div>
                )}

                {/* Drone de combat */}
                {droneFleet.drones?.combat && (
                  <div style={{ 
                    marginTop: '3px', 
                    padding: '3px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '2px',
                    borderLeft: droneFleet.drones.combat.isActive ? '3px solid #f44336' : '3px solid #666'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>⚔️ Combat</span>
                      <span style={{ 
                        fontSize: '9px', 
                        color: droneFleet.drones.combat.isActive ? '#f44336' : '#888' 
                      }}>
                        {String(droneFleet.drones.combat.state || '').toUpperCase() || 'DOCKED'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Drone spécial */}
                {droneFleet.drones?.special && (
                  <div style={{ 
                    marginTop: '3px', 
                    padding: '3px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '2px',
                    borderLeft: droneFleet.drones.special.isActive ? '3px solid #ff9800' : '3px solid #666'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>⭐ Spécial</span>
                      <span style={{ 
                        fontSize: '9px', 
                        color: droneFleet.drones.special.isActive ? '#ff9800' : '#888' 
                      }}>
                        {String(droneFleet.drones.special.state || '').toUpperCase() || 'DOCKED'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Debug Data - Contexte FSM avec copie facile */}
          <div style={{ marginBottom: '10px' }}>
            <strong>🔍 Debug Data - Contexte FSM:</strong>
            <div style={{ 
              marginTop: '5px',
              padding: '8px',
              backgroundColor: '#333',
              borderRadius: '3px',
              position: 'relative'
            }}>
              <button
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
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
                  console.log('[FSMDebugPanel] Contexte copié:', contextData);
                }}
                title="Copier le contexte complet dans le presse-papier"
              >
                📋 Copier
              </button>
              
              <pre style={{ 
                fontSize: '8px', 
                backgroundColor: '#1a1a1a', 
                padding: '8px', 
                borderRadius: '3px',
                overflow: 'auto',
                maxHeight: '120px',
                marginTop: '15px',
                color: '#ccc',
                lineHeight: '1.2'
              }}>
                {context ? JSON.stringify({
                  botId,
                  timestamp: new Date().toISOString(),
                  state,
                  isMoving,
                  entity: entity || {},
                  vehicle: vehicle || {},
                  droneFleet: droneFleet || {}
                }, null, 2) : 'Contexte non disponible'}
              </pre>
            </div>
          </div>

          {/* Debug Data - Historique des événements avec copie facile */}
          <div style={{ marginBottom: '10px' }}>
            <strong>📊 Debug Data - Historique ({eventHistory.length} événements):</strong>
            <div style={{ 
              marginTop: '5px',
              padding: '8px',
              backgroundColor: '#333',
              borderRadius: '3px',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '5px',
                right: '5px',
                display: 'flex',
                gap: '3px'
              }}>
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
                    const historyData = {
                      botId,
                      timestamp: new Date().toISOString(),
                      eventCount: eventHistory.length,
                      events: eventHistory
                    };
                    navigator.clipboard.writeText(JSON.stringify(historyData, null, 2));
                    console.log('[FSMDebugPanel] Historique copié:', historyData);
                  }}
                  title="Copier l'historique complet dans le presse-papier"
                >
                  📋 Copier
                </button>
                {eventHistory.length > 0 && (
                  <button
                    style={{
                      padding: '2px 6px',
                      fontSize: '8px',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      backgroundColor: '#ff6b6b',
                      color: '#000'
                    }}
                    onClick={() => clearHistory()}
                    title="Vider l'historique des événements"
                  >
                    🗑️ Vider
                  </button>
                )}
              </div>
              
              <div style={{ 
                backgroundColor: '#1a1a1a', 
                padding: '8px', 
                borderRadius: '3px',
                maxHeight: '180px',
                overflow: 'auto',
                fontSize: '8px',
                marginTop: '15px'
              }}>
                {eventHistory.length === 0 ? (
                  <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
                    Aucun événement capturé
                  </div>
                ) : (
                  eventHistory.slice(-10).map((event) => (
                    <div key={event.id} style={{ 
                      borderBottom: '1px solid #333', 
                      paddingBottom: '4px', 
                      marginBottom: '4px',
                      fontSize: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ 
                            color: getEventTypeColor(event.type),
                            fontWeight: 'bold',
                            marginRight: '6px'
                          }}>
                            {getEventTypeIcon(event.type)}
                          </span>                            <span style={{ 
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '9px'
                          }}>
                            {String(event.eventName || 'unknown')}
                          </span>
                        </div>
                        <span style={{ color: '#888', fontSize: '7px' }}>
                          {String(event.timestamp || '')}
                        </span>
                      </div>
                      
                      {event.type === 'TRANSITION' && (
                        <div style={{ fontSize: '7px', color: '#ccc', marginTop: '2px' }}>
                          Transition: {String(event.eventData?.from || 'unknown')} → {String(event.eventData?.to || 'unknown')}
                        </div>
                      )}
                      
                      {event.type === 'CONTEXT_UPDATE' && event.eventData?.droneStateChange && (
                        <div style={{ fontSize: '7px', color: '#ccc', marginTop: '2px' }}>
                          Drone: {String(event.eventData.droneStateChange.from || 'unknown')} → {String(event.eventData.droneStateChange.to || 'unknown')}
                        </div>
                      )}
                      
                      {event.type === 'SENT' && event.eventData && Object.keys(event.eventData).length > 0 && (
                        <div style={{ fontSize: '7px', color: '#ccc', marginTop: '2px' }}>
                          Data: {typeof event.eventData === 'object' ? JSON.stringify(event.eventData) : String(event.eventData)}
                        </div>
                      )}
                      
                      <div style={{ fontSize: '7px', color: '#666', marginTop: '1px' }}>
                        État: {String(event.fromState || 'unknown')}
                      </div>
                    </div>
                  ))
                )}
                {eventHistory.length > 10 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    fontSize: '7px', 
                    fontStyle: 'italic',
                    marginTop: '5px',
                    padding: '3px'
                  }}>
                    ... et {eventHistory.length - 10} événements plus anciens (utilisez "Copier" pour voir l'historique complet)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Panneau principal de debug FSM
 */
const FSMDebugPanel = ({ 
  position = 'bottom-left',
  minimizable = true 
}) => {
  // Utiliser le store Zustand pour récupérer les IDs des bots
  const { botIds, botCount, isSystemRunning } = useFSMBots();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [expandedBot, setExpandedBot] = useState(null);
  const [globalStats, setGlobalStats] = useState({});

  // Calcul des stats globales
  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalStats({
        activeCount: botCount,
        systemRunning: isSystemRunning,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [botCount, isSystemRunning]);

  // Styles du panneau principal
  const getContainerStyle = () => {
    const baseStyle = {
      position: 'fixed',
      width: '350px',
      maxHeight: '60vh',
      overflowY: 'auto',
      backgroundColor: '#1a1a1a',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#fff',
      zIndex: 1100
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, bottom: '10px', left: '10px' };
      case 'bottom-right':
        return { ...baseStyle, bottom: '10px', right: '370px' };
      case 'top-left':
        return { ...baseStyle, top: '10px', left: '10px' };
      case 'top-right':
        return { ...baseStyle, top: '10px', right: '370px' };
      default:
        return { ...baseStyle, bottom: '10px', left: '10px' };
    }
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMinimized ? '0' : '10px',
    padding: '5px 0',
    borderBottom: isMinimized ? 'none' : '1px solid #4CAF50'
  };

  const titleStyle = {
    margin: 0,
    color: '#4CAF50',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '2px 6px',
    fontSize: '10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#000'
  };

  return (
    <div style={getContainerStyle()}>
      {/* Header avec titre et contrôles */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          🔬 FSM Debug Panel
        </h3>
        <div>
          {minimizable && (
            <button 
              style={buttonStyle}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '📈' : '📉'}
            </button>
          )}
        </div>
      </div>

      {/* Contenu (si non minimisé) */}
      {!isMinimized && (
        <>
          {/* Stats globales */}
          <div style={{ 
            marginBottom: '10px', 
            padding: '5px', 
            backgroundColor: '#2a2a2a', 
            borderRadius: '3px',
            fontSize: '11px'
          }}>
            <div><strong>Bots FSM actifs:</strong> {String(globalStats.activeCount || 0)}</div>
            <div><strong>Système:</strong> {globalStats.systemRunning ? '🟢 ACTIF' : '🔴 ARRÊTÉ'}</div>
            <div><strong>Dernière MAJ:</strong> {String(globalStats.timestamp || 'N/A')}</div>
          </div>

          {/* Liste des machines d'état */}
          {botIds.map(botId => (
            <div key={botId}>
              <FSMVisualization 
                botId={botId}
                expanded={expandedBot === botId}
              />
              <button
                style={{
                  ...buttonStyle,
                  marginLeft: '5px',
                  marginBottom: '5px',
                  fontSize: '9px'
                }}
                onClick={() => setExpandedBot(expandedBot === botId ? null : botId)}
              >
                {expandedBot === botId ? '🔼 Réduire' : '🔽 Détails'}
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FSMDebugPanel;
