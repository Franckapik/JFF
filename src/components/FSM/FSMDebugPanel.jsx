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
import { useCentralizedEventHistory } from "../../ai/fsm/hooks/useCentralizedEventHistory.js";
import { useFSMBots } from "../../stores/useFSMStore/useFSMBots.js";

/**
 * Composant de visualisation d'une machine d'état individuelle
 */
const FSMVisualization = ({ botId, expanded = false }) => {
  // Utiliser le nouveau hook centralisé pour l'historique des événements
  const { 
    send, 
    current, 
    eventHistory, 
    clearHistory 
  } = useCentralizedEventHistory(botId);

  // Extraire les données du contexte actuel
  const entity = current?.context?.entity;
  const vehicle = current?.context?.vehicle;
  const state = current?.name;
  const context = current?.context;
  const isMoving = current?.context?.isMoving;
  const autoEvents = current?.context?.autoEvents;


  // États disponibles (pour simulation)
  const availableStates = ['IDLE', 'EXPLORING', 'COLLECTING', 'RETURNING'];
  
  // Événements simulables
  const availableEvents = [
    { name: 'explore', label: '🔍 Explorer', condition: state === 'IDLE' },
    { name: 'foundResource', label: '💎 Ressource trouvée', condition: state === 'EXPLORING' },
    { name: 'collect', label: '📦 Collecter', condition: state === 'IDLE' },
    { name: 'inventoryFull', label: '📦 Inventaire plein', condition: state === 'COLLECTING' },
    { name: 'returnHome', label: '🏠 Retour base', condition: ['IDLE', 'COLLECTING'].includes(state) },
    { name: 'atBase', label: '🎯 Arrivé à la base', condition: state === 'RETURNING' },
    { name: 'explorationTimeout', label: '⏰ Timeout exploration', condition: state === 'EXPLORING' },
    { name: 'resourceDepleted', label: '💔 Ressource épuisée', condition: state === 'COLLECTING' }
  ];

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

  const eventButtonStyle = {
    padding: '2px 6px',
    margin: '2px',
    fontSize: '10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#0a7c0a',
    color: '#fff'
  };

  const disabledButtonStyle = {
    ...eventButtonStyle,
    backgroundColor: '#444',
    cursor: 'not-allowed',
    opacity: 0.5
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

  const handleEventSend = (eventName) => {
    console.log(`[FSMDebugPanel] Sending event '${eventName}' to ${botId}`);
    send(eventName);
  };

  return (
    <div style={containerStyle}>
      {/* Header avec état principal */}
      <div style={headerStyle}>
        <div>
          <strong>{botId}</strong>
          <span style={{ marginLeft: '10px', ...stateStyle }}>
            {state}
          </span>
        </div>
        <div>
          {autoEvents?.isActive ? '🔄 AUTO' : '🎮 MANUEL'}
        </div>
      </div>

      {/* Contenu détaillé (si expanded) */}
      {expanded && (
        <div style={contentStyle}>
          {/* Informations contexte */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Contexte:</strong>
            <div style={{ fontSize: '10px', marginTop: '5px' }}>
              <div>Mode: {entity?.mode || 'N/A'}</div>
              <div>Type: {entity?.type || 'N/A'}</div>
              <div>En mouvement: {isMoving ? 'Oui' : 'Non'}</div>
              {vehicle && (
                <>
                  <div>Position: {vehicle.coord || 'N/A'}</div>
                  <div>Carburant: {vehicle.fuel || 0}/100</div>
                </>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ marginBottom: '10px' }}>
            <strong>Actions rapides:</strong>
            <div style={{ marginTop: '5px' }}>
              <button 
                style={eventButtonStyle}
                onClick={() => autoEvents?.isActive ? autoEvents.stop() : autoEvents?.start()}
              >
                {autoEvents?.isActive ? 'Arrêter Auto' : 'Démarrer Auto'}
              </button>
              <button 
                style={eventButtonStyle}
                onClick={() => send('STOP')}
              >
                Stop
              </button>
            </div>
          </div>

          {/* Événements FSM */}
          <div>
            <strong>Événements FSM:</strong>
            <div style={{ marginTop: '5px' }}>
              {availableEvents.map(event => (
                <button
                  key={event.name}
                  style={event.condition ? eventButtonStyle : disabledButtonStyle}
                  onClick={() => handleEventSend(event.name)}
                  disabled={!event.condition}
                  title={event.condition ? `Envoyer événement ${event.name}` : 'Non disponible dans cet état'}
                >
                  {event.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contexte brut (collapsible) */}
          <details style={{ marginTop: '10px', fontSize: '9px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '10px' }}>
              <strong>Contexte complet</strong>
            </summary>
            <pre style={{ 
              fontSize: '8px', 
              backgroundColor: '#1a1a1a', 
              padding: '5px', 
              borderRadius: '3px',
              overflow: 'auto',
              maxHeight: '100px'
            }}>
              {context ? JSON.stringify(context, null, 2) : 'Contexte non disponible'}
            </pre>
          </details>

          {/* Historique des événements */}
          <details style={{ marginTop: '10px', fontSize: '9px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '10px' }}>
              <strong>📊 Historique des événements ({eventHistory.length})</strong>
              {eventHistory.length > 0 && (
                <button
                  style={{
                    ...eventButtonStyle,
                    marginLeft: '10px',
                    fontSize: '8px',
                    backgroundColor: '#ff6b6b'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory();
                  }}
                >
                  🗑️ Vider
                </button>
              )}
            </summary>
            <div style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '5px', 
              borderRadius: '3px',
              maxHeight: '200px',
              overflow: 'auto',
              fontSize: '8px'
            }}>
              {eventHistory.length === 0 ? (
                <div style={{ color: '#888', fontStyle: 'italic' }}>
                  Aucun événement capturé
                </div>
              ) : (
                eventHistory.map((event) => (
                  <div key={event.id} style={{ 
                    borderBottom: '1px solid #333', 
                    paddingBottom: '3px', 
                    marginBottom: '3px',
                    fontSize: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ 
                          color: getEventTypeColor(event.type),
                          fontWeight: 'bold',
                          marginRight: '5px'
                        }}>
                          {getEventTypeIcon(event.type)}
                        </span>
                        <span style={{ 
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '9px'
                        }}>
                          {event.eventName}
                        </span>
                      </div>
                      <span style={{ color: '#888', fontSize: '7px' }}>
                        {event.timestamp}
                      </span>
                    </div>
                    
                    {event.type === 'TRANSITION' && (
                      <div style={{ fontSize: '7px', color: '#ccc', marginTop: '2px' }}>
                        {event.eventData.from} → {event.eventData.to}
                      </div>
                    )}
                    
                    {event.type === 'SENT' && event.eventData && Object.keys(event.eventData).length > 0 && (
                      <div style={{ fontSize: '7px', color: '#ccc', marginTop: '2px' }}>
                        Data: {JSON.stringify(event.eventData)}
                      </div>
                    )}
                    
                    <div style={{ fontSize: '7px', color: '#666', marginTop: '1px' }}>
                      État: {event.fromState}
                    </div>
                  </div>
                ))
              )}
            </div>
          </details>
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
            <div><strong>Bots FSM actifs:</strong> {globalStats.activeCount}</div>
            <div><strong>Système:</strong> {globalStats.systemRunning ? '🟢 ACTIF' : '🔴 ARRÊTÉ'}</div>
            <div><strong>Dernière MAJ:</strong> {globalStats.timestamp}</div>
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
