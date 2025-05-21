import React from 'react';
import useBotStore from '../../stores/useBotStore';
import useGameStore from '../../stores/useGameStore';
import usePlayerStore from '../../stores/playerStore';
import { getBotPlayerId, getMainShipId } from '../../ai/constants/playerConstants';

/**
 * Composant pour contrôler et gérer plusieurs bots
 * Permet de changer le bot actif et de démarrer/arrêter tous les bots
 */
const MultiBotControls = () => {
  // Récupérer les informations sur les bots et les fonctions du store
  const {
    isRunning,
    toggleBotProcessing,
    switchActiveBot,
    currentBotIndex,
    initializeBot,
    botState,
    processingMode,
    setProcessingMode
  } = useBotStore();
  
  // Récupérer le nombre de bots du gameStore
  const botCount = useGameStore(state => state.botCount);
  
  // Créer un tableau d'indices de bots (0, 1, 2, etc.)
  const botIndices = Array.from({ length: botCount }, (_, i) => i);
  
  // Fonction pour initialiser tous les bots
  const initializeAllBots = () => {
    botIndices.forEach(index => {
      initializeBot(index);
    });
  };
  
  // Récupérer les informations du joueur actif
  const getCurrentBotId = (index) => getBotPlayerId(index || currentBotIndex);
  const vehicleId = getMainShipId();
  
  // Obtenir les informations pour tous les bots
  const botsInfo = botIndices.map(index => {
    const botId = getBotPlayerId(index);
    const botVehicle = usePlayerStore(state => state.players?.[botId]?.vehicles?.[vehicleId]);
    
    return {
      botId,
      botIndex: index,
      fuel: botVehicle?.fuel || 0,
      position: botVehicle?.coord || "Unknown",
      resources: {
        food: botVehicle?.resources?.food || 0,
        debris: botVehicle?.resources?.debris || 0,
        special: botVehicle?.resources?.special || 0
      },
      isActive: index === currentBotIndex
    };
  });
  
  // Fonction pour changer le mode de traitement
  const toggleProcessingMode = () => {
    setProcessingMode(processingMode === 'parallel' ? 'sequential' : 'parallel');
  };
  
  return (
    <div className="multi-bot-controls" style={{ padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '5px', margin: '10px 0' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Multi-Bot Controls</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button 
          onClick={toggleBotProcessing}
          style={{ 
            backgroundColor: isRunning ? '#F44336' : '#4CAF50', 
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          {isRunning ? "Stop All Bots" : "Start All Bots"}
        </button>
        
        <button
          onClick={initializeAllBots}
          style={{ 
            backgroundColor: '#2196F3', 
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }}
        >
          Reinitialize All Bots
        </button>
      </div>
      
      {/* Sélecteur de mode de traitement */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: '8px',
        borderRadius: '4px'
      }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Processing Mode:</span>
        <button
          onClick={toggleProcessingMode}
          style={{
            backgroundColor: processingMode === 'parallel' ? '#4CAF50' : '#FF9800',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {processingMode === 'parallel' ? "Parallel (All Bots)" : "Sequential (One by One)"}
        </button>
      </div>
      
      <div>
        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Switch Active Bot:</p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {botIndices.map(index => (
            <button
              key={`bot-switch-${index}`}
              onClick={() => switchActiveBot(index)}
              style={{
                backgroundColor: currentBotIndex === index ? '#FF9800' : '#757575',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currentBotIndex === index ? 'bold' : 'normal'
              }}
            >
              Bot {index + 1} ({getBotPlayerId(index)})
            </button>
          ))}
        </div>
      </div>
      
      {/* Afficher les informations de tous les bots */}
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ margin: '5px 0', borderBottom: '1px solid #ddd' }}>All Bots Status</h4>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '10px',
          marginTop: '10px'
        }}>
          {botsInfo.map(bot => (
            <div 
              key={`bot-info-${bot.botIndex}`}
              style={{
                padding: '8px',
                backgroundColor: bot.isActive ? 'rgba(255, 152, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                border: bot.isActive ? '1px solid #FF9800' : '1px solid transparent'
              }}
            >
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Bot {bot.botIndex + 1} ({bot.botId})</span>
                {bot.isActive && (
                  <span style={{ 
                    fontSize: '11px', 
                    backgroundColor: '#FF9800', 
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#444' }}>
                <div>Fuel: <strong>{bot.fuel}/100</strong></div>
                <div>Position: <strong>{bot.position}</strong></div>
                <div>Resources: <strong>
                  F:{bot.resources.food} | 
                  D:{bot.resources.debris} | 
                  S:{bot.resources.special}
                </strong></div>
                {bot.isActive && (
                  <div style={{ marginTop: '5px' }}>
                    <strong>Current State: </strong>
                    <span style={{ 
                      fontWeight: 'bold',
                      color: botState === 'idle' ? '#4CAF50' : 
                              botState === 'exploring' ? '#2196F3' : 
                              botState === 'collecting' ? '#FFC107' : '#9C27B0'
                    }}>
                      {botState.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiBotControls;
