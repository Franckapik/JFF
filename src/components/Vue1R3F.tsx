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
// COLOR UTILITIES - DYNAMIC PALETTE GENERATION
// =========================================================================

/** Convert hex color to HSL */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Convert HSL to hex */
function hslToHex(h: number, s: number, l: number): string {
  h = h % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  const c = (1 - Math.abs(2 * l / 100 - 1)) * (s / 100);
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (val: number) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Lighten a color by a percentage */
function lighten(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s, Math.min(100, l + percent));
}

/** Darken a color by a percentage */
function darken(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, s, Math.max(0, l - percent));
}

/** Saturate a color by a percentage */
function saturate(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, Math.min(100, s + percent), l);
}

/** Desaturate a color by a percentage */
function desaturate(hex: string, percent: number): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToHex(h, Math.max(0, s - percent), l);
}

// =========================================================================
// MAP COLOR PALETTES - MULTIPLE STYLES AVAILABLE
// =========================================================================

// Select active palette here: 'historical', 'forest', 'desert', 'autumn', 'fantasy', 'paper', 'dynamicHistorical', 'dynamicPaper'
const ACTIVE_PALETTE: 'historical' | 'forest' | 'desert' | 'autumn' | 'fantasy' | 'paper' | 'dynamicHistorical' | 'dynamicPaper' = 'dynamicPaper';

// Define parent colors for dynamic palettes
const PARENT_COLORS = {
  historical: { green: '#A4AC86', brown: '#A67C52', gray: '#D4C5A9', blue: '#7A8B9F' },
  forest: { green: '#2D5016', brown: '#5C3D2E', gray: '#8B9D6F', blue: '#4A6B8A' },
  desert: { green: '#D4A574', brown: '#8B4513', gray: '#F5DEB3', blue: '#9B7653' },
  autumn: { green: '#9B6B3A', brown: '#A0522D', gray: '#CD5C5C', blue: '#8B7765' },
  // Background color for paper effect - generates all shades from this single color
  paper: '#e7d9bf',
};

// Function to generate palette dynamically from parent colors with percentage variations
function generatePaletteFromParent(parentColor: string, grayColor: string, blueColor: string) {
  return {
    '#22c55e': parentColor,
    '#16a34a': darken(parentColor, 8),
    '#4a7c23': desaturate(parentColor, 15),
    '#92400e': darken(parentColor, 15),
    '#6b7280': grayColor,
    '#1a1a1a': darken(grayColor, 25),
    '#9ca3af': lighten(grayColor, 10),
    '#3498db': desaturate(blueColor, 20),
    '#8b5cf6': saturate(desaturate(blueColor, 30), 10),
  };
}

// Function to generate subtle palette from a single color with very small variations
function generateSubtlePaletteFromSingleColor(baseColor: string) {
  return {
    '#22c55e': baseColor,                              // Base color (0%)
    '#16a34a': lighten(baseColor, 1),                 // Slightly lighter (+1%)
    '#4a7c23': darken(baseColor, 1),                  // Slightly darker (-1%)
    '#92400e': desaturate(baseColor, 2),              // Very slightly desaturated (-2%)
    '#6b7280': baseColor,                              // Exact base
    '#1a1a1a': darken(baseColor, 3),                  // Slightly darker (-3%)
    '#9ca3af': lighten(baseColor, 2),                 // Slightly lighter (+2%)
    '#3498db': darken(baseColor, 2),                  // Slightly darker (-2%)
    '#8b5cf6': lighten(baseColor, 1),                 // Slightly lighter (+1%)
  };
}

const COLOR_PALETTES = {
  dynamicHistorical: generatePaletteFromParent(
    PARENT_COLORS.historical.green,
    PARENT_COLORS.historical.gray,
    PARENT_COLORS.historical.blue
  ),
  dynamicPaper: generateSubtlePaletteFromSingleColor(PARENT_COLORS.paper),
  historical: {
    // Historical map tones - olive, ochre, taupe
    '#22c55e': '#A4AC86',  // bright green → olive-khaki
    '#16a34a': '#8B8C6D',  // darker green → muted olive
    '#4a7c23': '#7B8B5F',  // grassland → sage green
    '#92400e': '#A67C52',  // brown → warm tan-brown
    '#6b7280': '#D4C5A9',  // gray → soft ochre-beige
    '#1a1a1a': '#6B6B5F',  // dark → taupe-gray
    '#9ca3af': '#E8D4B0',  // light gray → warm beige
    '#3498db': '#7A8B9F',  // blue → slate-blue
    '#8b5cf6': '#8B7BA6',  // purple → muted mauve
  },
  forest: {
    // Deep forest tones - dark greens, rich browns
    '#22c55e': '#2D5016',  // bright green → dark forest green
    '#16a34a': '#1F3A0F',  // darker green → very dark green
    '#4a7c23': '#4A7C1B',  // grassland → deep sage
    '#92400e': '#5C3D2E',  // brown → rich chocolate
    '#6b7280': '#8B9D6F',  // gray → muted green-gray
    '#1a1a1a': '#2A2A24',  // dark → almost black
    '#9ca3af': '#A8B89C',  // light gray → pale sage
    '#3498db': '#4A6B8A',  // blue → forest blue
    '#8b5cf6': '#6B5B7B',  // purple → forest purple
  },
  desert: {
    // Warm desert tones - golds, sands, warm browns
    '#22c55e': '#D4A574',  // bright green → golden sand
    '#16a34a': '#C4895C',  // darker green → darker sand
    '#4a7c23': '#B8860B',  // grassland → dark goldenrod
    '#92400e': '#8B4513',  // brown → saddle brown
    '#6b7280': '#F5DEB3',  // gray → wheat/cream
    '#1a1a1a': '#5C4033',  // dark → dark brown
    '#9ca3af': '#FFE4B5',  // light gray → moccasin
    '#3498db': '#9B7653',  // blue → tan-blue
    '#8b5cf6': '#CD853F',  // purple → peru
  },
  autumn: {
    // Autumn foliage tones - oranges, reds, browns
    '#22c55e': '#9B6B3A',  // bright green → rust-brown
    '#16a34a': '#704214',  // darker green → dark sienna
    '#4a7c23': '#7B3F00',  // grassland → burnt sienna
    '#92400e': '#A0522D',  // brown → sienna
    '#6b7280': '#CD5C5C',  // gray → indian red
    '#1a1a1a': '#3D2817',  // dark → dark brown
    '#9ca3af': '#DEB887',  // light gray → burlywood
    '#3498db': '#8B7765',  // blue → gray-brown
    '#8b5cf6': '#A0522D',  // purple → sienna
  },
  fantasy: {
    // Fantasy map tones - vibrant but cohesive
    '#22c55e': '#6BA82A',  // bright green → forest green
    '#16a34a': '#4A7C1B',  // darker green → deep green
    '#4a7c23': '#3D6B1F',  // grassland → dark moss
    '#92400e': '#8B4513',  // brown → saddle brown
    '#6b7280': '#A9927D',  // gray → taupe-gray
    '#1a1a1a': '#453E37',  // dark → dark gray-brown
    '#9ca3af': '#D4B896',  // light gray → khaki
    '#3498db': '#4A7BA7',  // blue → steel blue
    '#8b5cf6': '#9966CC',  // purple → soft purple
  },
  paper: {
    // Monochrome paper effect - subtle variations on beige background #e7d9bf
    // All colors are very close to the background, with only outline/edges visible
    '#22c55e': '#E5D7B8',  // bright green → very light beige
    '#16a34a': '#E3D5B5',  // darker green → light beige
    '#4a7c23': '#E1D3B2',  // grassland → slightly darker beige
    '#92400e': '#DFD1AF',  // brown → warm beige
    '#6b7280': '#E7D9BF',  // gray → match background exactly
    '#1a1a1a': '#DDD0AB',  // dark → deeper beige
    '#9ca3af': '#E9DBc2',  // light gray → slightly lighter beige
    '#3498db': '#E5D7B8',  // blue → light beige (same as green)
    '#8b5cf6': '#E3D5B5',  // purple → light beige (same as darker green)
  },
};

function getMapStyleColor(baseColor: string): string {
  const palette = COLOR_PALETTES[ACTIVE_PALETTE];
  return palette[baseColor as keyof typeof palette] || baseColor;
}

// Procedural noise function for texture variation
function hash(x: number, y: number): number {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

// =========================================================================
// WORKER UI WRAPPER COMPONENT
// =========================================================================



// =========================================================================
// HEXAGONAL TILE COMPONENT WITH TOON SHADER
// =========================================================================

function HexagonalTile({ position, tile }: { position: { x: number; y: number; z: number }; tile: Tile }) {
  // Get tile color based on type and convert to map style
  const baseColor = getTileColor(tile.type);
  getMapStyleColor(baseColor); // Process color for consistency even if not used
  
  // Add subtle variation using procedural noise
  hash(position.x * 10, position.z * 10); // Compute variation for consistency even if not used

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main hexagonal tile - completely transparent, invisible */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshStandardMaterial 
          transparent={true}
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      
      {/* Edge lines for sketchy borders - main visual element */}
      <lineSegments rotation={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 0.2, 6)]} />
        <lineBasicMaterial 
          color="#5C4033" 
          linewidth={1.5}
          transparent={false}
          opacity={1.0}
        />
      </lineSegments>
      
      {/* Extremely subtle outline - optional, can be removed if grey tint persists */}
      <mesh rotation={[0, 0, 0]} scale={1.08}>
        <cylinderGeometry args={[1, 1, 0.2, 6]} />
        <meshBasicMaterial 
          color="#3E3B36"
          transparent={true}
          opacity={0.02}
        />
      </mesh>
    </group>
  );
}

// =========================================================================
// DECORATIVE TILE COMPONENT - Fading tiles around the main board
// =========================================================================

function DecorativeTile({ position, distance, maxDistance }: { 
  position: { x: number; y: number; z: number }; 
  distance: number;
  maxDistance: number;
}) {
  // Calculate opacity based on distance - inverse gradient
  // distance 1 = 0.3 opacity, distance 4 = ~0.05 opacity, distance 5+ = 0
  const normalizedDistance = distance / (maxDistance - 1);
  const opacity = Math.max(0, (1 - normalizedDistance) * 0.3);

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Edge lines with fading opacity */}
      <lineSegments rotation={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 0.2, 6)]} />
        <lineBasicMaterial 
          color="#9C8A73" 
          linewidth={1}
          transparent={true}
          opacity={opacity}
        />
      </lineSegments>
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
  const heightAboveTiles = 0.4;

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
    const spacingFactor = 0.415;

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

  // Generate decorative tiles around the main board
  const decorativeTiles = React.useMemo(() => {
    if (!tiles || !gridConfig || tilePositions.positions.length === 0) return [];

    const mainTileCoords = new Set(Object.keys(tiles));
    const decoratives: Array<{ x: number; y: number; z: number; distance: number }> = [];
    const maxDecorativeRadius = 5; // Maximum distance from main board
    const actualRadius = gridConfig.radius;

    // Helper function to calculate hex distance between two coordinates
    const hexDistance = (q1: number, r1: number, q2: number, r2: number) => {
      return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs((q1 + r1) - (q2 + r2))) / 2;
    };

    // Get all main tile coordinates as numbers
    const mainCoords = Object.keys(tiles).map(coord => {
      const [q, r] = coord.split(',').map(Number);
      return { q, r };
    });

    // Generate tiles in a larger radius around the main board
    for (let q = -actualRadius - maxDecorativeRadius; q <= actualRadius + maxDecorativeRadius; q++) {
      for (let r = -actualRadius - maxDecorativeRadius; r <= actualRadius + maxDecorativeRadius; r++) {
        const coord = `${q},${r}`;
        
        // Skip if this is a main tile
        if (mainTileCoords.has(coord)) continue;

        // Calculate minimum distance to any main tile
        let minDistance = Infinity;
        for (const mainCoord of mainCoords) {
          const dist = hexDistance(q, r, mainCoord.q, mainCoord.r);
          minDistance = Math.min(minDistance, dist);
        }
        
        // Only include tiles within decorative radius from the board edge
        if (minDistance > 0 && minDistance < maxDecorativeRadius) {
          const worldPos = calculateHexPosition(q, r, gridConfig);
          const scaledX = worldPos.x * tilePositions.spacingFactor;
          const scaledZ = worldPos.z * tilePositions.spacingFactor;

          decoratives.push({
            x: scaledX - tilePositions.center.x,
            y: worldPos.y,
            z: scaledZ - tilePositions.center.z,
            distance: minDistance
          });
        }
      }
    }

    return decoratives;
  }, [tiles, gridConfig, tilePositions]);

  if (!tiles || !gridConfig || tilePositions.positions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Render Decorative Tiles (behind main tiles) */}
      {decorativeTiles.map((decTile, index) => (
        <DecorativeTile
          key={`dec-${index}`}
          position={{ x: decTile.x, y: decTile.y, z: decTile.z }}
          distance={decTile.distance}
          maxDistance={5}
        />
      ))}
      
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
      {/* Fog - creates depth and hides far background */}
      <fog attach="fog" args={['#e7d9bf', 5, 35]} />
      
      {/* Grid Helper */}
{/*       <gridHelper args={[20, 20, '#444444', '#222222']} />
 */}      
      {/* Axes Helper - X (red), Y (green), Z (blue) */}
      <axesHelper args={[10]} />
      
      {/* Lighting setup for paper/map effect - warm and diffuse */}
      <ambientLight intensity={1.0} color="#E8D4B0" />
      {/* Warm directional light simulating natural/candle light */}
      <directionalLight 
        position={[10, 12, 8]} 
        intensity={1.5} 
        color="#F5DEB3"
        castShadow={false}
      />
      {/* Soft fill light from opposite side */}
      <directionalLight 
        position={[-10, -8, -6]} 
        intensity={0.9} 
        color="#D4A574"
      />
      {/* Top light for transparency effect */}
      <pointLight 
        position={[0, 8, 0]} 
        intensity={1.2} 
        color="#F0E68C"
        distance={40}
      />
      {/* Bottom light for depth and translucency */}
      <pointLight 
        position={[0, -2, 0]} 
        intensity={0.6} 
        color="#E8D4B0"
        distance={30}
      />
      
      {/* Tile Grid from Worker */}
      <TileGridRenderer />
      
      {/* Support Base - Large fantasy map plane */}
      {/* <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          color="#C4956E"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh> */}
      

      
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
      backgroundColor: '#1a1a2e'
    }}>
      <Canvas
        camera={{ position: [3, 4, 5], fov: 50 }}
        style={{ width: '100%', height: '100%', background: '#e7d9bf' }}
      >
        <CanvasContent />
      </Canvas>
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
