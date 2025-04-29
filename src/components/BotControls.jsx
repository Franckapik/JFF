import React from 'react';
import useBotStore from '../stores/useBotStore';
import usePlayerStore from '../stores/usePlayerStore';

const BotControls = () => {
  const toggleBotProcessing = useBotStore((state) => state.toggleBotProcessing);
  const isRunning = useBotStore((state) => state.isRunning);
  const botState = useBotStore((state) => state.bots.player2.ship.currentState);
  const player2Ship = usePlayerStore((state) => state.players.player2.vehicles.ship);
  
  return (
    <div className="bot-controls">
      <h3>Bot Controls</h3>
      <div className="bot-status">
        <div>Status: <span className={isRunning ? 'active' : 'inactive'}>{isRunning ? 'Running' : 'Paused'}</span></div>
        <div>State: <span className={`state-${botState}`}>{botState}</span></div>
        <div>Position: {player2Ship.coord || 'Unknown'}</div>
      </div>
      <button onClick={toggleBotProcessing} className={isRunning ? 'stop' : 'start'}>
        {isRunning ? 'Stop Bot' : 'Start Bot'}
      </button>
    </div>
  );
};

export default BotControls;
