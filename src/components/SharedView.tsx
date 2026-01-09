/**
 * ==========================================================================
 * SHARED VIEW COMPONENT - Vue synchronisée via SharedWorker
 * ==========================================================================
 * 
 * Composant wrapper qui affiche FSMVisualization avec les données
 * du SharedWorker au lieu du store local.
 * 
 * Affiche également le compteur d'updates et l'ID d'instance
 * comme preuve de synchronisation.
 */

import React from 'react';

import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';
import { useTileStore } from '../stores/useTileStore';
import { useUI } from '../contexts/UIContext';

// =========================================================================
// TYPES
// =========================================================================

interface SharedViewProps {
  viewId: 'vue1' | 'vue2';
}

// =========================================================================
// SYNC HEADER COMPONENT
// =========================================================================

function SyncHeader({ viewId }: { viewId: string }) {
  const instanceId = useSharedWorkerStore((s) => s.instanceId);
  const updateCounter = useSharedWorkerStore((s) => s.updateCounter);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const isInitialized = useSharedWorkerStore((s) => s.isInitialized);
  const lastUpdateTimestamp = useSharedWorkerStore((s) => s.lastUpdateTimestamp);
  const resetGame = useSharedWorkerStore((s) => s.resetGame);
  
  const timeSinceUpdate = lastUpdateTimestamp 
    ? Math.round((Date.now() - lastUpdateTimestamp) / 1000) 
    : null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '12px 20px',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderBottom: '2px solid #0f3460'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: viewId === 'vue1' ? '#22c55e' : '#3b82f6',
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          <span>📺</span>
          <span>{viewId.toUpperCase()}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: isConnected ? '#166534' : '#991b1b',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#22c55e' : '#ef4444',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        {isInitialized && (
          <div style={{
            backgroundColor: '#1e40af',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            🎮 Game Running
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            INSTANCE ID
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            backgroundColor: '#374151',
            padding: '4px 10px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            {instanceId || '---'}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            UPDATES
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fbbf24',
            backgroundColor: '#374151',
            padding: '2px 12px',
            borderRadius: '6px',
            minWidth: '60px'
          }}>
            {updateCounter}
          </div>
        </div>
        
        {timeSinceUpdate !== null && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
              LAST UPDATE
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              {timeSinceUpdate}s ago
            </div>
          </div>
        )}
        
        <button
          onClick={() => resetGame()}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color 0.2s',
            opacity: isConnected ? 1 : 0.5,
            pointerEvents: isConnected ? 'auto' : 'none'
          }}
          onMouseOver={(e) => {
            if (isConnected) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dc2626';
            }
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ef4444';
          }}
          title="Reset the game without killing the worker"
        >
          <span>🔄</span>
          <span>Reset Game</span>
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// SIMPLIFIED FSM VISUALIZATION (Using SharedWorker data)
// =========================================================================

function SharedFSMVisualization() {
  const botStates = useSharedWorkerStore((s) => s.botStates);
  const { selectedView } = useUI();
  
  // Determine which bots to display
  const botsToDisplay = selectedView === 'both' 
    ? (['bot-0', 'bot-1'] as const)
    : ([selectedView] as const);
  
  const hasActiveBot = botsToDisplay.some(botId => {
    const state = botStates[botId];
    return state && state.value;
  });
  
  if (!hasActiveBot) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Waiting for FSM initialization...
        </div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          The game will start when the SharedWorker is ready.
        </div>
      </div>
    );
  }
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#fafafa',
      color: '#333'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>
        🎮 FSM State (SharedWorker)
      </h2>
      
      <div style={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {botsToDisplay.map(botId => {
          const state = botStates[botId];
          if (!state) return null;
          
          const currentValue = typeof state.value === 'string' 
            ? state.value 
            : JSON.stringify(state.value);
          
          const borderColor = botId === 'bot-0' ? '#22c55e' : '#3b82f6';
          
          return (
            <div
              key={botId}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontWeight: 'bold',
                  color: borderColor
                }}>
                  {botId.toUpperCase()}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {state.status}
                </span>
              </div>
              
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                marginBottom: '12px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}>
                  CURRENT STATE
                </div>
                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                  {currentValue}
                </div>
              </div>
              
              {state.context && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    <ContextItem 
                      label="Ship Coord" 
                      value={state.context.vehicle?.coord || 'N/A'} 
                    />
                    <ContextItem 
                      label="Fuel" 
                      value={`${state.context.vehicle?.fuel ?? 0}%`} 
                    />
                    <ContextItem 
                      label="Damage" 
                      value={`${state.context.vehicle?.damage ?? 0}%`} 
                    />
                    <ContextItem 
                      label="Resources" 
                      value={state.context.vehicle?.resources?.total ?? 0} 
                    />
                    <ContextItem 
                      label="Drone State" 
                      value={state.context.droneFleet?.drones?.explorer?.visualState || 'N/A'} 
                    />
                    <ContextItem 
                      label="Tiles Explored" 
                      value={state.context.memory?.stats?.tilesExplored ?? 0} 
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContextItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      padding: '6px 8px',
      borderRadius: '4px'
    }}>
      <div style={{ color: '#9ca3af', fontSize: '10px' }}>{label}</div>
      <div style={{ fontWeight: '500', color: '#374151' }}>{value}</div>
    </div>
  );
}

// =========================================================================
// MAIN SHARED VIEW COMPONENT
// =========================================================================

export default function SharedView({ viewId }: SharedViewProps) {
  const connect = useSharedWorkerStore((s) => s.connect);
  const initGame = useSharedWorkerStore((s) => s.initGame);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const isInitialized = useSharedWorkerStore((s) => s.isInitialized);
  
  // Initialize tiles (needed for game logic)
  const initializeGameGrid = useTileStore((s) => s.initializeGameGrid);
  const setTiles = useTileStore((s) => s.setTiles);
  const assignStartingTiles = useTileStore((s) => s.assignStartingTiles);
  
  // Connect to worker on mount
  React.useEffect(() => {
    connect();
  }, [connect]);
  
  // Initialize game when connected (only vue1 should init, vue2 just connects)
  React.useEffect(() => {
    if (!isConnected || isInitialized) return;
    
    // Only vue1 initializes the game
    if (viewId === 'vue1') {
      // Generate tiles
      const radius = 3;
      const spacing = -0.2;
      const generatedTiles = initializeGameGrid(radius, spacing);
      setTiles(generatedTiles);
      assignStartingTiles(['bot-0', 'bot-1']);
      
      // Get updated tiles and send to worker
      const currentTiles = useTileStore.getState().tiles;
      initGame(currentTiles);
      
      console.log(`🎮 [${viewId.toUpperCase()}] Game initialized with ${Object.keys(currentTiles).length} tiles`);
    }
  }, [isConnected, isInitialized, viewId, initializeGameGrid, setTiles, assignStartingTiles, initGame]);
  
  // Poll for state updates periodically (backup mechanism)
  const requestState = useSharedWorkerStore((s) => s.requestState);
  React.useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      requestState();
    }, 5000); // Every 5 seconds as backup
    
    return () => clearInterval(interval);
  }, [isConnected, requestState]);
  
  return (
    <div style={{ paddingTop: '60px' }}>
      <SyncHeader viewId={viewId} />
      <SharedFSMVisualization />
      
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
