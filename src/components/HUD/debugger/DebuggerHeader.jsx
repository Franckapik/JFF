import React from 'react';

/**
 * Composant pour l'en-tête du debugger et la sélection des bots
 */
const DebuggerHeader = React.memo(({ 
  botCount, 
  currentBotIndex, 
  activeTab, 
  handleBotChange, 
  setActiveTab 
}) => {
  return (
    <div className="debugger-header">
      <h2 className="debugger-title">Bot Debugger</h2>
      <div className="debugger-bot-selector">
        {[...Array(botCount)].map((_, index) => (
          <button
            key={index}
            className={`debugger-bot-button ${currentBotIndex === index ? 'debugger-bot-active' : ''}`}
            onClick={() => handleBotChange(index)}
          >
            Bot {index + 1}
          </button>
        ))}
        <button
          className={`debugger-bot-button debugger-bot-player ${activeTab === 'player' ? 'debugger-bot-active' : ''}`}
          onClick={() => setActiveTab('player')}
        >
          Player
        </button>
        <button
          className={`debugger-bot-button debugger-bot-tile ${activeTab === 'tile' ? 'debugger-bot-active' : ''}`}
          onClick={() => setActiveTab('tile')}
        >
          Tile
        </button>
        <button
          className={`debugger-bot-button debugger-bot-tile ${activeTab === 'stores' ? 'debugger-bot-active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
      </div>
    </div>
  );
});

export default DebuggerHeader;
