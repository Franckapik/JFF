/**
 * ==========================================================================
 * VUE1 R3F - Vue React Three Fiber connectée au SharedWorker
 * ==========================================================================
 * 
 * ✅ Phase 5 Migration: Worker 100% autonome avec R3F visualization
 * 
 * Ce composant affiche une scène 3D simple en React Three Fiber,
 * synchronisée avec le SharedWorker autonome via useSharedWorkerStore.
 * 
 * Features:
 * - Scene 3D simple (cube + lumières)
 * - Wrapper UI montrant les infos du worker
 * - Synchronisation via BroadcastChannel
 * 
 * Architecture:
 * - Worker: FSM autonome (context.gridInfo.tiles, gameConfigStore local)
 * - Vue1 R3F: Consommateur via useSharedWorkerStore
 * - Synchronisation: BroadcastChannel (STATE_UPDATE)
 * - Initialisation: Gérée par AppRouter (parent commun)
 * 
 * Note: La connexion et l'initialisation sont désormais gérées par AppRouter,
 * ce qui permet de commencer avec n'importe quelle vue (vue1 ou vue2).
 * 
 * @see docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md
 */

import React from 'react';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { getTileColor } from '../config/tileColors';
import { UIProvider } from '../contexts/UIContext';
import { calculateHexPosition } from '../core/spatial/hexGrid';
import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';
import type { GridCoordinate } from '../types/coordinates.d';
import type { Tile } from '../types/tile.d';

// =========================================================================
// MAP/PAPER STYLE COLOR PALETTE
// =========================================================================

function getMapStyleColor(baseColor: string): string {
  // Convert game colors to historical map/parchment tones inspired by hex map aesthetics
  const mapPalette: Record<string, string> = {
    // Primary resources (food/grassland) - olive greens and khaki tones
    '#22c55e': '#A4AC86',  // bright green → olive-khaki
    '#16a34a': '#8B8C6D',  // darker green → muted olive
    '#4a7c23': '#7B8B5F',  // grassland → sage green
    
    // Obstacles/desert - warm browns and taupes
    '#92400e': '#A67C52',  // brown → warm tan-brown
    
    // Empty/wasteland - ochre and beige range
    '#6b7280': '#D4C5A9',  // gray → soft ochre-beige
    '#1a1a1a': '#6B6B5F',  // dark → taupe-gray
    '#9ca3af': '#E8D4B0',  // light gray → warm beige
    
    // Water/special - blue-grays and slate tones
    '#3498db': '#7A8B9F',  // blue → slate-blue
    '#8b5cf6': '#8B7BA6',  // purple → muted mauve
  };
  return mapPalette[baseColor] || baseColor;
}

// Procedural noise function for texture variation
function hash(x: number, y: number): number {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

// =========================================================================
// WORKER UI WRAPPER COMPONENT
// =========================================================================

function WorkerUIWrapper() {
  const instanceId = useSharedWorkerStore((s) => s.instanceId);
  const updateCounter = useSharedWorkerStore((s) => s.updateCounter);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
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
          backgroundColor: '#22c55e',
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          <span>📺</span>
          <span>VUE 1 R3F</span>
        </div>

        {/* ✅ Phase 5: Worker Autonomy Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#059669',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
          🤖 Worker
        </div>

        {/* Connection Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: isConnected ? '#065f46' : '#7f1d1d',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            backgroundColor: isConnected ? '#10b981' : '#ef4444',
            borderRadius: '50%'
          }} />
          {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
        </div>

        {/* Instance ID */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>
            INSTANCE ID
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            fontWeight: 'bold',
            backgroundColor: '#374151',
            padding: '4px 12px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            {instanceId || '---'}
          </div>
        </div>

        {/* Update Counter */}
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
// HEXAGONAL TILE COMPONENT WITH TOON SHADER
// =========================================================================

function HexagonalTile({ position, tile }: { position: { x: number; y: number; z: number }; tile: Tile }) {
  // Get tile color based on type and convert to map style
  const baseColor = getTileColor(tile.type);
  const mapColor = getMapStyleColor(baseColor);
  
  // Add subtle variation using procedural noise
  const noiseVariation = hash(position.x * 10, position.z * 10);

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main hexagonal tile - flat on XZ plane with paper effect */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshStandardMaterial 
          color={mapColor}
          roughness={0.8}
          metalness={0.0}
          flatShading={false}
          transparent={true}
          opacity={0.85}
        />
      </mesh>
      
      {/* Edge lines for sketchy borders */}
      <lineSegments rotation={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 0.2, 6)]} />
        <lineBasicMaterial 
          color="#5C4033" 
          linewidth={2}
          transparent={true}
          opacity={0.7}
        />
      </lineSegments>
      
      {/* Subtle outline for depth */}
      <mesh rotation={[0, 0, 0]} scale={1.08}>
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshBasicMaterial 
          color="#3E3B36"
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// =========================================================================
// BOT SPHERE COMPONENT - Simple sphere showing bot position with lerp
// =========================================================================

function BotSphere({ 
  botId, 
  coord, 
  gridConfig,
  gridCenter,
  spacingFactor 
}: { 
  botId: string; 
  coord: string | null; 
  gridConfig: { spacing: number; radius: number } | null;
  gridCenter: { x: number; z: number };
  spacingFactor: number;
}) {
  // Position above tiles (Y = 0.5 to be above tile height of 0.2)
  const heightAboveTiles = 0.5;

  // Mesh ref for useFrame
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  // Track current target position
  const targetPos = React.useRef<[number, number, number]>([0, heightAboveTiles, 0]);
  
  // Track if position has been initialized
  const initializedRef = React.useRef(false);
  
  // Lerp speed (0 = instant, 1 = very slow)
  const lerpAlpha = 0.01;

  // Calculate target position whenever coord changes
  const calculateTargetPos = React.useCallback(() => {
    if (!coord || !gridConfig) {
      return [0, heightAboveTiles, 0] as [number, number, number];
    }

    const [q, r] = coord.split(',').map(Number);
    const worldPos = calculateHexPosition(q, r, gridConfig);
    
    // Apply same spacing factor as tiles
    const scaledX = worldPos.x * spacingFactor;
    const scaledZ = worldPos.z * spacingFactor;

    // Apply grid center offset (same as tiles)
    const centeredX = scaledX - gridCenter.x;
    const centeredZ = scaledZ - gridCenter.z;

    return [centeredX, heightAboveTiles, centeredZ] as [number, number, number];
  }, [coord, gridConfig, gridCenter, spacingFactor]);

  // Update target position when coord changes
  React.useEffect(() => {
    const newTarget = calculateTargetPos();
    targetPos.current = newTarget;
    
    // Initialize mesh position on first render
    if (!initializedRef.current && meshRef.current) {
      meshRef.current.position.set(newTarget[0], newTarget[1], newTarget[2]);
      initializedRef.current = true;
    }
  }, [calculateTargetPos]);

  // Animate position with lerp every frame
  useFrame(() => {
    if (!meshRef.current) return;

    const current = meshRef.current.position;
    const target = targetPos.current;

    // Linear interpolation
    current.x += (target[0] - current.x) * lerpAlpha;
    current.y += (target[1] - current.y) * lerpAlpha;
    current.z += (target[2] - current.z) * lerpAlpha;
  });

  // Color based on botId
  const color = botId === 'bot-0' ? '#3b82f6' : '#f59e0b';

  // Don't set position as prop - let useFrame handle it completely
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// =========================================================================
// TILE GRID RENDERER
// =========================================================================

function TileGridRenderer() {
  const botStates = useSharedWorkerStore((s) => s.botStates);

  // Get tiles from the first bot's context
  const tiles = React.useMemo(() => {
    if (!botStates || Object.keys(botStates).length === 0) return null;
    
    const firstBot = botStates['bot-0'];
    if (!firstBot?.context?.gridInfo?.tiles) return null;
    
    return firstBot.context.gridInfo.tiles;
  }, [botStates]);

  const gridConfig = React.useMemo(() => {
    if (!botStates || Object.keys(botStates).length === 0) return null;
    
    const firstBot = botStates['bot-0'];
    if (!firstBot?.context?.gridInfo) return null;
    
    return {
      spacing: firstBot.context.gridInfo.spacing,
      radius: firstBot.context.gridInfo.radius
    };
  }, [botStates]);

  // Calculate grid center and tile positions
  const tilePositions = React.useMemo(() => {
    if (!tiles || !gridConfig) return { 
      positions: [], 
      center: { x: 0, z: 0 },
      spacingFactor: 0.43 
    };

    const positions: Array<{ coord: GridCoordinate; x: number; y: number; z: number }> = [];
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

    // Increased spacing factor to prevent tile overlap with flat orientation
    const spacingFactor = 0.43;

    Object.entries(tiles).forEach(([coord]) => {
      const [q, r] = coord.split(',').map(Number);
      
      const worldPos = calculateHexPosition(q, r, {
        spacing: gridConfig.spacing,
        radius: gridConfig.radius
      });

      // Apply spacing factor (no axis swap since tiles are now flat)
      const scaledX = worldPos.x * spacingFactor;
      const scaledZ = worldPos.z * spacingFactor;

      positions.push({
        coord: coord as GridCoordinate,
        x: scaledX,
        y: worldPos.y,
        z: scaledZ
      });

      minX = Math.min(minX, scaledX);
      maxX = Math.max(maxX, scaledX);
      minZ = Math.min(minZ, scaledZ);
      maxZ = Math.max(maxZ, scaledZ);
    });

    // Calculate center
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;

    // Center all positions
    const centeredPositions = positions.map(pos => ({
      ...pos,
      x: pos.x - centerX,
      z: pos.z - centerZ
    }));

    return {
      positions: centeredPositions,
      center: { x: centerX, z: centerZ },
      spacingFactor
    };
  }, [tiles, gridConfig]);

  if (!tiles || !gridConfig || tilePositions.positions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Render Tiles */}
      {tilePositions.positions.map((tilePos) => {
        const tile = tiles[tilePos.coord];
        if (!tile) return null;
        
        return (
          <HexagonalTile 
            key={tilePos.coord} 
            position={{ x: tilePos.x, y: tilePos.y, z: tilePos.z }}
            tile={tile}
          />
        );
      })}

      {/* Render Bots */}
      {botStates && Object.entries(botStates).map(([botId, botState]) => {
        const vehicleCoord = botState?.context?.vehicle?.coord || null;
        
        return (
          <BotSphere
            key={botId}
            botId={botId}
            coord={vehicleCoord}
            gridConfig={gridConfig}
            gridCenter={tilePositions.center}
            spacingFactor={tilePositions.spacingFactor}
          />
        );
      })}
    </>
  );
}

// =========================================================================
// R3F CANVAS CONTENT
// =========================================================================

function CanvasContent() {
  return (
    <>
      {/* Grid Helper */}
{/*       <gridHelper args={[20, 20, '#444444', '#222222']} />
 */}      
      {/* Axes Helper - X (red), Y (green), Z (blue) */}
      <axesHelper args={[10]} />
      
      {/* Lighting setup for paper/map effect - warm and diffuse */}
      <ambientLight intensity={0.75} color="#E8D4B0" />
      {/* Warm directional light simulating natural/candle light */}
      <directionalLight 
        position={[10, 12, 8]} 
        intensity={1.3} 
        color="#F5DEB3"
        castShadow={true}
      />
      {/* Soft fill light from opposite side */}
      <directionalLight 
        position={[-10, -8, -6]} 
        intensity={0.6} 
        color="#D4A574"
      />
      {/* Subtle top light for depth */}
      <pointLight 
        position={[0, 6, 0]} 
        intensity={0.8} 
        color="#F0E68C"
        distance={30}
      />
      
      {/* Tile Grid from Worker */}
      <TileGridRenderer />
      
      {/* Orbit Controls */}
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={25}
        autoRotate={false}
      />
    </>
  );
}

// =========================================================================
// MAIN VUE1 R3F COMPONENT
// =========================================================================

function Vue1R3FContent() {
  // No need to connect or init here - AppRouter handles it
  // Just consume the worker state for display
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a2e'
    }}>
      {/* Worker UI Wrapper at the top */}
      <WorkerUIWrapper />

      {/* R3F Canvas - offset by header height */}
      <div style={{
        flex: 1,
        marginTop: '60px',
        width: '100%'
      }}>
        <Canvas
          camera={{ position: [3, 4, 5], fov: 50 }}
          style={{ width: '100%', height: '100%', background: '#e7d9bf' }}
        >
          <CanvasContent />
        </Canvas>
      </div>

      {/* Style for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

// =========================================================================
// EXPORT WITH UI PROVIDER
// =========================================================================

export default function Vue1R3F() {
  return (
    <UIProvider>
      <Vue1R3FContent />
    </UIProvider>
  );
}
