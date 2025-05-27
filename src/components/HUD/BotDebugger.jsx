import React from 'react';

// Hooks et données
import { useDebuggerData } from './debugger/useDebuggerData';
import useDebuggerUtils from './debugger/useDebuggerUtils';

// Composants UI
import DebuggerHeader from './debugger/DebuggerHeader';
import DebuggerTabs from './debugger/DebuggerTabs';

// Composants des onglets
import ActionsTab from './debugger/ActionsTab';
import StateTab from './debugger/StateTab';
import ResourcesTab from './debugger/ResourcesTab';
import PlayerTab from './debugger/PlayerTab';
import TileTab from './debugger/TileTab';

/**
 * Version refactorisée du BotDebugger
 * Affiche toutes les informations des bots de façon organisée
 */
const BotDebuggerNew = () => {
  // Récupération des données via le hook personnalisé
  const {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    activeBotId,
    botState,
    isRunning,
    actionQueue,
    storeActionHistory,
    BOT_STATES,
    ACTION_STATUS,
    currentBotIndex,
    botVehicle,
    botMemory,
    playerVehicle,
    playerData,
    hoveredTile,
    hoveredTileCoord,
    calculateDistance,
    botCount,
    handleBotChange,
  } = useDebuggerData();

  // Récupération des utilitaires via le hook personnalisé
  const {
    formatStateName,
    getActionStatusColor,
    getTileResourceBarStyle,
    isVehicleActive,
  } = useDebuggerUtils();
  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'actions':
        return (
          <ActionsTab
            actionQueue={actionQueue}
            storeActionHistory={storeActionHistory}
            ACTION_STATUS={ACTION_STATUS}
            getActionStatusColor={getActionStatusColor}
          />
        );
      case 'state':
        return (
          <StateTab
            botState={botState}
            isRunning={isRunning}
            BOT_STATES={BOT_STATES}
            activeBotId={activeBotId}
            formatStateName={formatStateName}
            isVehicleActive={isVehicleActive}
          />
        );
      case 'resources':
        return (
          <ResourcesTab
            botVehicle={botVehicle}
            botMemory={botMemory}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            calculateDistance={calculateDistance}
          />
        );
      case 'player':
        return (
          <PlayerTab
            playerVehicle={playerVehicle}
            playerData={playerData}
            isVehicleActive={isVehicleActive}
          />
        );
      case 'tile':
        return (
          <TileTab
            hoveredTile={hoveredTile}
            hoveredTileCoord={hoveredTileCoord}
            playerVehicle={playerVehicle}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
            currentBotIndex={currentBotIndex}
            getTileResourceBarStyle={getTileResourceBarStyle}
          />
        );
      default:
        return <div className="debugger-empty-message">Onglet non trouvé</div>;
    }
  };

  return (
    <div className="bot-debugger">
      <DebuggerHeader
        botCount={botCount}
        currentBotIndex={currentBotIndex}
        activeTab={activeTab}
        handleBotChange={handleBotChange}
        setActiveTab={setActiveTab}
      />
      
      <DebuggerTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="debugger-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BotDebuggerNew;
