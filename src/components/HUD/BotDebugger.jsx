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
import TileTab from './debugger/TileTab';
import StoresTab from './debugger/StoresTab';

/**
 * BotDebugger refactorisé pour une approche bot-only
 * Affiche les informations FSM des bots de façon organisée
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
    hoveredTile,
    hoveredTileCoord,
    calculateDistance,
    botCount,
    handleBotChange,
  } = useDebuggerData();

  // Récupération des utilitaires via le hook personnalisé
  const {
    formatStateName,
    getTileResourceBarStyle,
    isVehicleActive,
    getActionStatusColor,
  } = useDebuggerUtils();
  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'actions':
        return (
          <ActionsTab
            actionQueue={actionQueue}
            storeActionHistory={storeActionHistory}
            getActionStatusColor={getActionStatusColor}
          />
        );
      case 'state':
        return (
          <StateTab
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
      case 'tile':
        return (
          <TileTab
            hoveredTile={hoveredTile}
            hoveredTileCoord={hoveredTileCoord}
            botVehicle={botVehicle}
            calculateDistance={calculateDistance}
            currentBotIndex={currentBotIndex}
            getTileResourceBarStyle={getTileResourceBarStyle}
          />
        );
      case 'stores':
        return <StoresTab />;
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
