import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bot as BotIcon, Maximize2, Minimize2, SlidersHorizontal, Waves } from 'lucide-react';
import { lazy, memo, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Color, Group, InstancedMesh, MeshStandardMaterial, Object3D, Vector3 } from 'three';

import type { BotView, ElectricCloud, MineReport } from '../../engine/model';
import type { PhysicsBotPose } from '../../engine/physicsPlayground';
import { RESOURCE_KINDS, type ResourceKind, type Resources } from '../../engine/resources';
import { RULES } from '../../engine/rules';
import { terrainDeckHeight, terrainPosition, TERRAIN_BOTTOM } from '../../engine/terrainPresentation';
import { activeCoords, depletedResourceCoords, isCloudVisible, resourceMarkerCoords, revealedTileKind } from '../../engine/visibility';
import { BOT_IDS, hexDistance, hexLine, isSubmerged, tileLevel, worldPosition, type BotId, type Coord, type World, type WorldTile } from '../../engine/world';
import { useSessionStore } from '../../stores/useSessionStore';

import BotPanel from './BotPanel';
import { TileGlyphs } from './BoardArt';
import { fitBoardCamera } from './boardCamera';
import EndlessSeabed from './EndlessSeabed';
import ExpertBotView from './ExpertBotView';
import FloodStage from './FloodStage';
import { IncidentHud, IncidentPulses } from './IncidentFeedback';
import type { PhysicsCommand } from './PhysicsPlayground';
import { BOT_COLORS, cloudOpacity, cloudTravelProgress, DEPLETED_TILE_COLOR, MINED_TILE_COLOR, RESOURCE_LABELS, TILE_COLORS, TILE_LABELS } from './presentation';
import { useRenderCounter } from './renderMetrics';
import { useIncidentAlerts } from './useIncidentAlerts';
import TrustHud from './TrustHud';
import { sketchTileShader } from './boardShaders';
import VisionMist from './VisionMist';

type Perspective = BotId | 'developer';
const VOID_COLOR = '#14313a';
const PhysicsPlayground = lazy(() => import('./PhysicsPlayground'));

function ScoreBackground({ gameId, score0, score1 }: { gameId: string | null; score0: number; score1: number }) {
  const target = useRef(new Color(VOID_COLOR));
  const leader = useRef<BotId | null>(null);
  const previousGameId = useRef(gameId);

  useEffect(() => {
    if (previousGameId.current !== gameId) {
      previousGameId.current = gameId;
      leader.current = null;
    }
    if (score0 !== score1) leader.current = score0 > score1 ? 'bot-0' : 'bot-1';
    target.current.set(VOID_COLOR);
    if (leader.current) target.current.lerp(new Color(BOT_COLORS[leader.current]), 0.08);
  }, [gameId, score0, score1]);

  useFrame(({ scene }, delta) => {
    if (scene.background instanceof Color) {
      scene.background.lerp(target.current, 1 - Math.exp(-delta * 1.7));
    }
  });

  return <color attach="background" args={[VOID_COLOR]} />;
}

function BoardCamera({ radius }: { radius: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const { position, target } = fitBoardCamera(radius, size.width, size.height);
    camera.position.copy(position);
    camera.lookAt(target);
  }, [camera, radius, size.width, size.height]);
  return null;
}

function knowsTileKind(bot: BotView, tile: WorldTile): boolean {
  return ['base', 'fuel', 'repair', 'obstacle', 'ramp', 'tower'].includes(tile.kind)
    ? bot.explored.includes(tile.coord)
    : bot.known.includes(tile.coord);
}

const Tiles = memo(function Tiles({ world, current, explored, scanned, known, depleted, developer, selected, route, routeOwner, select }: { world: World; current: string; explored: string; scanned: string; known: string; depleted: string; developer: boolean; selected: Coord | null; route: Coord[]; routeOwner: BotId | null; select: (coord: Coord) => void }) {
  useRenderCounter('Tiles');
  const mesh = useRef<InstancedMesh>(null);
  const ink = useRef<InstancedMesh>(null);
  const tiles = useMemo(() => Object.values(world).filter(tile => tile.kind !== 'empty'), [world]);
  useLayoutEffect(() => {
    if (!mesh.current || !ink.current) return;
    const visibleCoords = new Set(current.split('|'));
    const exploredCoords = new Set(explored.split('|'));
    const scannedCoords = new Set(scanned.split('|') as Coord[]);
    const knownCoords = new Set(known.split('|') as Coord[]);
    const depletedCoords = new Set(depleted.split('|') as Coord[]);
    const routeCoords = new Set(route);
    const transform = new Object3D();
    tiles.forEach((tile, index) => {
      transform.position.set(...worldPosition(tile.coord));
      const visible = visibleCoords.has(tile.coord);
      const seen = exploredCoords.has(tile.coord) || visible;
      const raised = tile.coord === selected && seen ? 0.12 : 0;
      const top = terrainDeckHeight(world, tile.coord);
      const height = top - TERRAIN_BOTTOM;
      transform.position.y = TERRAIN_BOTTOM + height / 2 + raised;
      transform.scale.set(1, height, 1);
      transform.updateMatrix(); mesh.current!.setMatrixAt(index, transform.matrix);
      transform.position.y -= 0.045;
      transform.scale.y = height + 0.08;
      transform.updateMatrix(); ink.current!.setMatrixAt(index, transform.matrix);
      const revealed = revealedTileKind(tile, knownCoords, scannedCoords, visible, developer);
      const color = routeOwner && routeCoords.has(tile.coord) && visible ? BOT_COLORS[routeOwner] : tile.owner ? BOT_COLORS[tile.owner] : depletedCoords.has(tile.coord) ? DEPLETED_TILE_COLOR : revealed === 'terrain' ? TILE_COLORS.plain : TILE_COLORS[revealed];
      mesh.current!.setColorAt(index, !seen ? new Color('#3b4c51') : visible ? new Color(color) : new Color(color).lerp(new Color('#9b9a8d'), 0.56));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    ink.current.instanceMatrix.needsUpdate = true;
  }, [world, tiles, current, explored, scanned, known, depleted, developer, selected, route, routeOwner]);
  return <>
    <instancedMesh ref={ink} args={[undefined, undefined, tiles.length]} receiveShadow onClick={event => { event.stopPropagation(); if (event.instanceId !== undefined) select(tiles[event.instanceId].coord); }}>
      <cylinderGeometry args={[1.015, 1.015, 1, 6]} />
      <meshBasicMaterial color="#303b3e" />
    </instancedMesh>
    <instancedMesh ref={mesh} args={[undefined, undefined, tiles.length]} receiveShadow onClick={event => { event.stopPropagation(); if (event.instanceId !== undefined) select(tiles[event.instanceId].coord); }}>
      <cylinderGeometry args={[0.96, 0.96, 1, 6]} />
      {/* eslint-disable-next-line react/no-unknown-property -- React Three Fiber material hook */}
      <meshStandardMaterial roughness={1} metalness={0} onBeforeCompile={sketchTileShader} />
    </instancedMesh>
  </>;
});

const RESOURCE_COLORS = { food: '#63b96b', debris: '#ee9b65', special: '#9c85e9' } as const;
const RESOURCE_OFFSETS = { food: [-0.38, 0, 0.12], debris: [0.35, 0, 0.12], special: [0, 0, -0.32] } as const;

function ResourceTokens({ resources, y = 0.22 }: { resources: Resources; y?: number }) {
  return <>{RESOURCE_KINDS.filter(kind => resources[kind] > 0).map(kind => {
    const [x, , z] = RESOURCE_OFFSETS[kind];
    return <mesh key={kind} position={[x, y, z]} castShadow>
      {kind === 'food' ? <sphereGeometry args={[0.16, 8, 6]} /> : kind === 'debris' ? <boxGeometry args={[0.27, 0.22, 0.27]} /> : <octahedronGeometry args={[0.19]} />}
      <meshStandardMaterial color={RESOURCE_COLORS[kind]} emissive={RESOURCE_COLORS[kind]} emissiveIntensity={0.15} />
    </mesh>;
  })}</>;
}

function ResourceFind({ kind, coord, position, select }: { kind: ResourceKind; coord: Coord; position: [number, number, number]; select: (coord: Coord) => void }) {
  const spinning = useRef<Group>(null);
  const phase = useMemo(() => coord.split(',').map(Number).reduce((sum, value) => sum + value * 1.7, 0), [coord]);
  useFrame(({ clock }) => {
    if (!spinning.current) return;
    const time = clock.getElapsedTime();
    spinning.current.rotation.y = time * (kind === 'special' ? 1.25 : 0.82) + phase;
    spinning.current.position.y = 0.48 + Math.sin(time * 2 + phase) * 0.055;
  });
  return <group position={position} onClick={event => { event.stopPropagation(); select(coord); }}>
    <mesh position={[0, 0.08, 0]}>
      <cylinderGeometry args={[0.22, 0.3, 0.16, 6]} />
      <meshStandardMaterial color="#576e69" roughness={0.85} />
    </mesh>
    <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.23, 0.025, 6, 24]} />
      <meshStandardMaterial color={RESOURCE_COLORS[kind]} emissive={RESOURCE_COLORS[kind]} emissiveIntensity={0.5} />
    </mesh>
    <group ref={spinning} position={[0, 0.48, 0]}>
      {kind === 'food' && <>
        <mesh castShadow><sphereGeometry args={[0.22, 12, 10]} /><meshStandardMaterial color="#7fca72" roughness={0.5} /></mesh>
        <mesh position={[0, 0.24, 0]} rotation={[0, 0, -0.25]}><cylinderGeometry args={[0.026, 0.035, 0.17, 6]} /><meshStandardMaterial color="#5a6750" /></mesh>
        <mesh position={[0.13, 0.3, 0]} rotation={[0, 0, -0.5]}><sphereGeometry args={[0.13, 0.035, 0.07, 8, 6]} /><meshStandardMaterial color="#a6dd82" /></mesh>
      </>}
      {kind === 'debris' && <>
        <mesh castShadow rotation={[0.25, 0.4, 0.15]}><dodecahedronGeometry args={[0.25, 0]} /><meshStandardMaterial color="#e3a36d" metalness={0.35} roughness={0.55} /></mesh>
        <mesh position={[0.09, 0.08, 0.21]} rotation={[0.25, 0.4, 0.15]}><boxGeometry args={[0.16, 0.045, 0.04]} /><meshStandardMaterial color="#ffe0a4" metalness={0.25} /></mesh>
      </>}
      {kind === 'special' && <>
        <mesh castShadow><octahedronGeometry args={[0.28]} /><meshStandardMaterial color="#bba8ff" emissive="#7353bc" emissiveIntensity={0.4} metalness={0.2} roughness={0.3} /></mesh>
        <mesh rotation={[Math.PI / 2.7, 0, 0]}><torusGeometry args={[0.37, 0.018, 6, 32]} /><meshStandardMaterial color="#ead9ff" emissive="#9c85e9" emissiveIntensity={0.5} /></mesh>
      </>}
    </group>
  </group>;
}

const GroundResources = memo(function GroundResources({ world, current, scanned, known, select }: { world: World; current: string; scanned: string; known: string; select: (coord: Coord) => void }) {
  return <>{resourceMarkerCoords(world, current.split('|') as Coord[], scanned.split('|') as Coord[], known.split('|') as Coord[]).map(coord => {
    const kind = RESOURCE_KINDS.find(candidate => world[coord].resources[candidate] > 0);
    return kind && <ResourceFind key={coord} kind={kind} coord={coord} position={terrainPosition(world, coord)} select={select} />;
  })}</>;
});

function DeveloperRoutes({ bots, world }: { bots: BotView[]; world: World }) {
  return <>{bots.flatMap(bot => bot.route.map((coord, index) => {
    const [x, , z] = worldPosition(coord);
    return <mesh key={`${bot.id}-${coord}-${index}`} position={[x + (bot.id === 'bot-0' ? -0.46 : 0.46), terrainDeckHeight(world, coord) + 0.18, z]}>
      <sphereGeometry args={[0.09, 8, 6]} /><meshBasicMaterial color={BOT_COLORS[bot.id]} />
    </mesh>;
  }))}</>;
}

function WaitingMarkers({ bots, visible, world }: { bots: BotView[]; visible: Coord[]; world: World }) {
  const seen = new Set(visible);
  return <>{bots.filter(bot => bot.operation?.kind === 'wait' && seen.has(bot.operation.target)).map(bot => {
    const [x, , z] = worldPosition(bot.operation!.target);
    return <mesh key={bot.id} position={[x, terrainDeckHeight(world, bot.operation!.target) + 0.21, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.78, 24]} /><meshBasicMaterial color={BOT_COLORS[bot.id]} transparent opacity={0.8} />
    </mesh>;
  })}</>;
}

function MineMarkers({ world, bot, current, developer, elapsed }: { world: World; bot: BotView; current: Coord[]; developer: boolean; elapsed: number }) {
  const visible = new Set(current);
  const coords = Object.keys(world) as Coord[];
  return <>{coords.filter(coord => developer ? !!world[coord].mine
    : (bot.knownMines[coord] ?? 0) > elapsed ||
      (world[coord].mine?.state === 'arming' && visible.has(coord))).map(coord => {
    const mine = world[coord].mine;
    const certain = developer || mine?.owner === bot.id || (visible.has(coord) && mine?.state === 'arming');
    const arming = certain && mine?.state === 'arming';
    const color = !certain ? '#8b7187' : arming ? '#e5ac49' : MINED_TILE_COLOR;
    const [x, , z] = worldPosition(coord);
    return <group key={coord} position={[x, terrainDeckHeight(world, coord) + 0.25, z]}>
      <mesh><octahedronGeometry args={[0.22]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={arming ? 0.55 : 0.18} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.35, 0.41, arming ? 12 : 6]} /><meshBasicMaterial color={color} /></mesh>
    </group>;
  })}</>;
}

function MineReportMarkers({ world, report }: { world: World; report: MineReport | undefined }) {
  if (!report || report.nearestDistance === null) return null;
  const { center, nearestDistance } = report;
  return <>{Object.keys(world).filter(coord => world[coord as Coord].kind !== 'empty' && hexDistance(center, coord as Coord) === nearestDistance).map(coord => {
    const [x, , z] = worldPosition(coord as Coord);
    return <mesh key={coord} position={[x, terrainDeckHeight(world, coord as Coord) + 0.19, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.68, 0.75, 6]} /><meshBasicMaterial color="#c2933d" transparent opacity={0.8} />
    </mesh>;
  })}</>;
}

const CLOUD_BOLTS = [
  [[-0.08, 0.05], [0.05, -0.25], [-0.13, -0.48], [0.04, -0.72], [-0.08, -0.94]],
  [[0.2, 0.02], [0.32, -0.22], [0.12, -0.48], [0.25, -0.69], [0.12, -0.89]],
  [[-0.23, -0.04], [-0.36, -0.3], [-0.17, -0.55], [-0.32, -0.79]],
] as const;

function CloudBolt({ points, opacity }: { points: readonly (readonly [number, number])[]; opacity: number }) {
  return <>{points.slice(1).map(([x, y], index) => {
    const [fromX, fromY] = points[index];
    const dx = x - fromX;
    const dy = y - fromY;
    return <mesh key={index} position={[(x + fromX) / 2, (y + fromY) / 2, 0]} rotation={[0, 0, -Math.atan2(dx, dy)]}>
      <cylinderGeometry args={[0.025, 0.043, Math.hypot(dx, dy), 5]} />
      <meshBasicMaterial color="#fff1b0" transparent opacity={opacity} />
    </mesh>;
  })}</>;
}

function ElectricCloudView({ cloud, elapsed, opacity, paused, speed, world }: { cloud: ElectricCloud; elapsed: number; opacity: number; paused: boolean; speed: number; world: World }) {
  const traveler = useRef<Group>(null);
  const body = useRef<Group>(null);
  const warningRing = useRef<Group>(null);
  const arcs = useRef<(Group | null)[]>([]);
  const coreMaterial = useRef<MeshStandardMaterial>(null);
  const phase = useRef(0);
  const received = useRef(performance.now());
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  useLayoutEffect(() => { received.current = performance.now(); }, [elapsed, paused, speed]);
  const destination = new Vector3(...terrainPosition(world, cloud.coord));
  const origin = cloud.previousCoord ? new Vector3(...terrainPosition(world, cloud.previousCoord)) : destination;
  const initialProgress = reducedMotion ? 1 : cloudTravelProgress(cloud, elapsed);
  const initialPosition = origin.clone().lerp(destination, initialProgress);
  const [x, , z] = worldPosition(cloud.coord);
  useFrame((_, delta) => {
    if (!paused && !reducedMotion) phase.current += delta * Math.min(speed, 2);
    const visualElapsed = elapsed + (paused ? 0 : Math.max(0, Math.min(cloud.nextMoveAt - elapsed, (performance.now() - received.current) * speed)));
    const progress = reducedMotion ? 1 : cloudTravelProgress(cloud, visualElapsed);
    traveler.current?.position.copy(origin).lerp(destination, progress);
    if (body.current) {
      const surge = Math.pow(Math.max(0, Math.sin(phase.current * 5.1)), 12);
      body.current.rotation.y = phase.current * 0.34;
      body.current.position.y = 1.02 + (reducedMotion ? 0 : Math.sin(phase.current * 2.6) * 0.1);
      body.current.scale.setScalar(1 + (reducedMotion ? 0 : 0.08 * Math.sin(phase.current * 3.2) + 0.1 * surge));
      if (coreMaterial.current) coreMaterial.current.emissiveIntensity = 0.65 + surge * 1.7;
    }
    if (warningRing.current) warningRing.current.scale.setScalar(reducedMotion ? 1 : 0.95 + 0.12 * Math.sin(phase.current * 3.2));
    arcs.current.forEach((arc, index) => {
      if (arc) arc.visible = reducedMotion ? index === 0 : Math.sin(phase.current * (4.3 + index * 0.31) + index * 2.2) > 0.7;
    });
  });
  return <>
    <group ref={warningRing} position={[x, terrainDeckHeight(world, cloud.coord) + 0.23, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh><ringGeometry args={[0.65, 0.72, 32]} /><meshBasicMaterial color="#f36b75" transparent opacity={0.88 * opacity} /></mesh>
      <mesh><ringGeometry args={[0.83, 0.88, 32]} /><meshBasicMaterial color="#9d3c62" transparent opacity={0.67 * opacity} /></mesh>
      <mesh><circleGeometry args={[0.61, 32]} /><meshBasicMaterial color="#ad415f" transparent opacity={0.2 * opacity} /></mesh>
    </group>
    <group ref={traveler} position={initialPosition}>
      <group ref={body}>
        <mesh position={[-0.3, 0, 0]}><icosahedronGeometry args={[0.43, 1]} /><meshStandardMaterial color="#283c5a" emissive="#5963a2" emissiveIntensity={0.5} transparent opacity={0.93 * opacity} /></mesh>
        <mesh position={[0.22, 0.12, 0.13]}><icosahedronGeometry args={[0.47, 1]} /><meshStandardMaterial color="#293451" emissive="#614e9e" emissiveIntensity={0.55} transparent opacity={0.94 * opacity} /></mesh>
        <mesh position={[0.08, -0.11, -0.27]}><icosahedronGeometry args={[0.35, 1]} /><meshStandardMaterial color="#3d526b" emissive="#5377a6" emissiveIntensity={0.6} transparent opacity={0.92 * opacity} /></mesh>
        <mesh position={[0.03, -0.08, 0.31]}><icosahedronGeometry args={[0.23, 1]} /><meshStandardMaterial ref={coreMaterial} color="#b6eff5" emissive="#7cecff" emissiveIntensity={0.65} transparent opacity={0.9 * opacity} /></mesh>
        <mesh rotation={[0.3, 0, 0.4]}><torusGeometry args={[0.57, 0.033, 5, 24]} /><meshBasicMaterial color="#ffbc79" transparent opacity={0.95 * opacity} /></mesh>
        {CLOUD_BOLTS.map((points, index) => <group key={index} ref={node => { arcs.current[index] = node; }} rotation={[0, index * 2.15, 0]}>
          <CloudBolt points={points} opacity={opacity} />
        </group>)}
      </group>
    </group>
  </>;
}

function scanPosition(world: World, from: Coord, to: Coord, elapsed: number): Vector3 {
  const path = hexLine(from, to);
  if (path.length === 1) return new Vector3(...terrainPosition(world, from));
  const progress = Math.max(0, Math.min(path.length - 1, elapsed / RULES.stepDuration));
  const index = Math.min(path.length - 2, Math.floor(progress));
  return new Vector3(...terrainPosition(world, path[index])).lerp(new Vector3(...terrainPosition(world, path[index + 1])), progress - index);
}

function Vehicle({ bot, world, paused, speed, crossing, flyoverStart, flyoverEnd, onPose }: { bot: BotView; world: World; paused: boolean; speed: number; crossing: boolean; flyoverStart: boolean; flyoverEnd: boolean; onPose?: (id: BotId, position: Vector3, heading: number) => void }) {
  useRenderCounter(bot.id);
  const ship = useRef<Group>(null);
  const drone = useRef<Group>(null);
  const offensiveDrone = useRef<Group>(null);
  const received = useRef(performance.now());
  useLayoutEffect(() => { received.current = performance.now(); }, [bot.operation?.remaining, bot.coord, paused, speed]);
  const from = useMemo(() => new Vector3(...terrainPosition(world, bot.coord)), [world, bot.coord]);
  const to = useMemo(() => new Vector3(...terrainPosition(world, bot.operation?.target ?? bot.coord)), [world, bot.operation?.target, bot.coord]);
  useFrame((_state, delta) => {
    const operation = bot.operation;
    const elapsed = operation ? operation.duration - operation.remaining + (paused ? 0 : Math.min(operation.remaining, (performance.now() - received.current) * speed)) : 0;
    const progress = operation ? Math.min(1, elapsed / operation.duration) : 0;
    if (ship.current) {
      ship.current.position.copy(from);
      if (operation?.kind === 'move' || operation?.kind === 'rescue') ship.current.position.lerp(to, progress);
      ship.current.position.y += 0.28 + (operation?.kind === 'move'
        ? 0.32 * Math.sin(Math.PI * progress) + 0.56 * ((flyoverStart ? 1 - progress : 0) + (flyoverEnd ? progress : 0))
        : 0);
      if (crossing && operation?.kind === 'move') {
        const direction = bot.coord < operation.target ? 1 : -1;
        const dx = (to.x - from.x) * direction;
        const dz = (to.z - from.z) * direction;
        const offset = (bot.id === 'bot-0' ? 1 : -1) * 0.4 * Math.sin(Math.PI * progress) / Math.hypot(dx, dz);
        ship.current.position.x -= dz * offset;
        ship.current.position.z += dx * offset;
      }
      if (operation?.kind === 'move') ship.current.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
      onPose?.(bot.id, ship.current.position, ship.current.rotation.y);
    }
    if (drone.current) {
      drone.current.position.copy(from);
      let flight = 0;
      if (operation?.kind === 'scan') {
        flight = Math.max(0, Math.min(1, elapsed / RULES.stepDuration, (operation.duration - elapsed) / RULES.stepDuration));
        const detour = operation.scanDetour;
        if (detour) {
          if (elapsed <= detour.contactAt) drone.current.position.copy(scanPosition(world, bot.coord, detour.contact, elapsed));
          else if (elapsed <= detour.edgeAt) drone.current.position.copy(scanPosition(world, detour.contact, detour.edge, elapsed - detour.contactAt));
          else if (elapsed <= detour.destinationAt) drone.current.position.copy(scanPosition(world, detour.edge, detour.destination, elapsed - detour.edgeAt));
          else if (elapsed <= detour.destinationAt + RULES.scanDuration) drone.current.position.set(...terrainPosition(world, detour.destination));
          else drone.current.position.copy(scanPosition(world, detour.destination, bot.coord, elapsed - detour.destinationAt - RULES.scanDuration));
        } else {
          const target = operation.scanInitialTarget ?? operation.target;
          const travel = hexLine(bot.coord, target).length - 1;
          const arrival = travel * RULES.stepDuration;
          if (elapsed <= arrival) drone.current.position.copy(scanPosition(world, bot.coord, target, elapsed));
          else if (elapsed <= arrival + RULES.scanDuration) drone.current.position.set(...terrainPosition(world, target));
          else drone.current.position.copy(scanPosition(world, target, bot.coord, elapsed - arrival - RULES.scanDuration));
        }
      } else if (ship.current) drone.current.position.copy(ship.current.position);
      drone.current.position.y += operation?.kind === 'scan' ? 0.8 + 0.6 * flight : 0.52;
      if (!paused && operation?.kind === 'scan') drone.current.rotation.y += delta * 5;
    }
    if (offensiveDrone.current) {
      offensiveDrone.current.position.copy(ship.current?.position ?? from);
      if (operation?.kind === 'mine' || operation?.kind === 'mineScan' || operation?.kind === 'neutralize') {
        const travel = hexDistance(bot.coord, operation.target) * RULES.stepDuration;
        if (elapsed <= travel) offensiveDrone.current.position.copy(scanPosition(world, bot.coord, operation.target, elapsed));
        else if (elapsed <= travel + RULES.scanDuration) offensiveDrone.current.position.set(...terrainPosition(world, operation.target));
        else offensiveDrone.current.position.copy(scanPosition(world, operation.target, bot.coord, elapsed - travel - RULES.scanDuration));
        offensiveDrone.current.position.y += 1.35;
        if (!paused) offensiveDrone.current.rotation.y += delta * 5;
      } else offensiveDrone.current.position.y = (ship.current?.position.y ?? 0.28) + 0.68;
      offensiveDrone.current.position.x += 0.32;
    }
  });
  const color = bot.state === 'disabled' ? '#697772' : BOT_COLORS[bot.id];
  return <>
    <group ref={ship} position={terrainPosition(world, bot.coord)}>
      <mesh castShadow><boxGeometry args={[0.5, 0.2, 0.8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.15, -0.1]} castShadow><boxGeometry args={[0.3, 0.18, 0.35]} /><meshStandardMaterial color="#f5f7f4" /></mesh>
      <mesh position={[0, 0.02, 0.5]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.22, 0.3, 4]} /><meshStandardMaterial color={color} /></mesh>
      <ResourceTokens resources={bot.cargo} y={0.24} />
    </group>
    {bot.droneAvailable && bot.state !== 'disabled' && <group ref={drone}>
      <mesh><octahedronGeometry args={[0.14]} /><meshStandardMaterial color={color} metalness={0.2} roughness={0.3} /></mesh>
      <mesh><boxGeometry args={[0.55, 0.025, 0.08]} /><meshStandardMaterial color="#f7faf7" /></mesh>
      <mesh><boxGeometry args={[0.08, 0.025, 0.55]} /><meshStandardMaterial color="#f7faf7" /></mesh>
    </group>}
    {bot.offensiveDroneAvailable && bot.state !== 'disabled' && <group ref={offensiveDrone}>
      <mesh><octahedronGeometry args={[0.17]} /><meshStandardMaterial color={MINED_TILE_COLOR} metalness={0.35} roughness={0.3} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.035, 6, 16]} /><meshStandardMaterial color={color} /></mesh>
    </group>}
  </>;
}

export default function GameView() {
  useRenderCounter('GameView');
  const snapshot = useSessionStore(state => state.snapshot);
  const status = useSessionStore(state => state.status);
  const gameId = useSessionStore(state => state.gameId);
  const [perspective, setPerspective] = useState<Perspective>('bot-0');
  const [selected, setSelected] = useState<Coord | null>(null);
  useEffect(() => { setSelected(null); }, [gameId]);
  const [expert, setExpert] = useState(false);
  const [expertBotId, setExpertBotId] = useState<BotId>('bot-0');
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const [physicsStatus, setPhysicsStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [physicsCommand, setPhysicsCommand] = useState<PhysicsCommand | null>(null);
  const [physicsImpacts, setPhysicsImpacts] = useState<Record<BotId, number>>({ 'bot-0': 0, 'bot-1': 0 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const physicsBotPoses = useRef<Record<BotId, PhysicsBotPose | null>>({ 'bot-0': null, 'bot-1': null });
  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === sceneRef.current);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);
  const toggleFullscreen = async () => {
    const scene = sceneRef.current;
    if (!scene) return;
    setFullscreenError(false);
    try {
      if (document.fullscreenElement === scene) await document.exitFullscreen();
      else await scene.requestFullscreen();
    } catch {
      setFullscreenError(true);
    }
  };
  const recordBotPose = useCallback((id: BotId, position: Vector3, heading: number) => {
    const pose = physicsBotPoses.current[id];
    if (pose) Object.assign(pose, { x: position.x, y: position.y, z: position.z, heading });
    else physicsBotPoses.current[id] = { x: position.x, y: position.y, z: position.z, heading };
  }, []);
  const currentCoords = snapshot ? perspective === 'developer' ? Object.values(snapshot.world).filter(tile => tile.kind !== 'empty').map(tile => tile.coord) : activeCoords(snapshot.world, snapshot.bots[perspective]) : [];
  const alerts = useIncidentAlerts(snapshot, gameId, perspective, currentCoords);
  if (!snapshot) return <main className="empty-state" role="status">{status === 'disconnected' ? 'Moteur hors ligne' : 'Connexion au moteur...'}</main>;
  const developer = perspective === 'developer';
  const visibleEvents = developer ? snapshot.events : snapshot.events.filter(event => event.type !== 'trust.changed' || event.botId === perspective);
  const viewedBot = snapshot.bots[developer ? expertBotId : perspective];
  const allCoords = Object.values(snapshot.world).filter(candidate => candidate.kind !== 'empty').map(candidate => candidate.coord);
  const current = currentCoords.join('|');
  const explored = developer ? current : viewedBot.explored.join('|');
  const scanned = developer ? current : viewedBot.scanned.join('|');
  const depleted = depletedResourceCoords(snapshot.world, Object.values(snapshot.bots), currentCoords, developer ? currentCoords : viewedBot.scanned, viewedBot.known).join('|');
  const tile = selected && snapshot.world[selected]?.kind !== 'empty' ? snapshot.world[selected] : null;
  const isCurrent = !!selected && currentCoords.includes(selected);
  const isExplored = isCurrent || !!selected && viewedBot.explored.includes(selected);
  const isScanned = !!selected && (developer || viewedBot.scanned.includes(selected) || viewedBot.known.includes(selected));
  const revealedKind = tile && isExplored ? revealedTileKind(tile, new Set(viewedBot.known), new Set(viewedBot.scanned), isCurrent, developer) : null;
  const rememberedMine = !!selected && (viewedBot.knownMines[selected] ?? 0) > snapshot.elapsed;
  const visibleArmingMine = !!tile?.mine && tile.mine.state === 'arming' && isCurrent;
  const mineCertain = developer || tile?.mine?.owner === viewedBot.id || visibleArmingMine;
  const mineLabel = selected && (developer && tile?.mine || rememberedMine || visibleArmingMine)
    ? !mineCertain ? 'Position mémorisée (à confirmer)'
      : tile?.mine?.state === 'arming' ? 'Mine en armement' : 'Mine repérée'
    : null;
  const mineReport = viewedBot.mineReports[viewedBot.mineReports.length - 1];
  const cloudVisible = isCloudVisible(snapshot.cloud, currentCoords, developer);
  const selectedInCloud = !!selected && cloudVisible && selected === snapshot.cloud?.coord;
  const opacity = snapshot.cloud ? cloudOpacity(snapshot.cloud, snapshot.elapsed) : 0;
  const expertBot = snapshot.bots[expertBotId];
  const focusBase = snapshot.world[viewedBot.base];
  const physicsInitial = focusBase?.neighbors.find(coord => snapshot.world[coord]?.walkable) ?? viewedBot.base;
  const physicsScope = `${gameId ?? 'local'}:${viewedBot.id}`;
  const physicsTarget = selected && tile && (developer || currentCoords.includes(selected)) ? selected : physicsInitial;
  const physicsRouteTarget = viewedBot.route[0] ?? (viewedBot.operation?.kind === 'move' ? viewedBot.operation.target : null);
  const visibleBots = Object.values(snapshot.bots).filter(bot => developer || bot.id === perspective || currentCoords.includes(bot.coord));
  const sendPhysics = (action: PhysicsCommand['action'], coord = physicsTarget) => setPhysicsCommand(previous => ({
    serial: (previous?.serial ?? 0) + 1, scope: physicsScope, action, coord,
  }));
  return <main className={`game-layout${expert ? ' expert-open' : ''}`}>
    <section className="board-panel" aria-label="Terrain de la partie">
      <div className="board-toolbar"><div className="board-title"><small>Étude visuelle / 01</small><h1>Le Phare des deux refuges</h1></div><label>Vision <select value={perspective} onChange={event => setPerspective(event.target.value as Perspective)}><option value="bot-0">Bot 0</option><option value="bot-1">Bot 1</option><option value="developer">Développeur</option></select></label><button className="icon-button expert-toggle" aria-pressed={expert} onClick={() => setExpert(value => !value)} title={expert ? 'Masquer le mode expert' : 'Afficher le mode expert'} aria-label={expert ? 'Masquer le mode expert' : 'Afficher le mode expert'}><SlidersHorizontal size={18} /></button><span className="tide-preview-toggle" title="La marée monte pendant la partie et ferme les passages immergés"><Waves size={16} /> Marée {Math.round(snapshot.waterLevel * 100) / 100} m</span><span>{developer ? 'Carte complète' : `${viewedBot.explored.length} / ${allCoords.length} cases explorées`}</span>{viewedBot.mineWarning && <span className="cloud-alert">Mine ennemie à proximité</span>}{mineReport && <span title={`Relevé à ${Math.round(mineReport.time / 1000)} s`}>Scan {mineReport.center} : {mineReport.count} mine(s) / rayon {mineReport.radius} · plus proche {mineReport.nearestDistance ?? '—'} hex.</span>}{cloudVisible && <span className="cloud-alert">⚡ Nuage électrique détecté</span>}{viewedBot.operation?.scanDetour && <span className="cloud-alert">{!viewedBot.operation.scanEdgeReached ? 'Drone repoussé vers le bord' : !viewedBot.operation.scanArrived ? 'Drone vers une tuile aléatoire' : 'Drone en retour'}</span>}</div>
      <div className="physics-controls" aria-label="Atelier physique Rapier 3D">
        <strong>Rapier 3D <span>· atelier physique</span></strong>
        <button type="button" aria-pressed={physicsEnabled} onClick={() => { setPhysicsEnabled(value => !value); setPhysicsCommand(null); setPhysicsStatus('loading'); }}>{physicsEnabled ? 'Masquer' : 'Afficher'}</button>
        {physicsEnabled && <>
          <span className="physics-controls-target">Case {physicsTarget} · les vaisseaux poussent les caisses</span>
          <button type="button" disabled={physicsStatus !== 'ready'} onClick={() => sendPhysics('stack')}>Empiler ici</button>
          <button type="button" disabled={physicsStatus !== 'ready' || !physicsRouteTarget} onClick={() => sendPhysics('route', physicsRouteTarget!)} title={physicsRouteTarget ? `Placer des caisses en ${physicsRouteTarget}` : 'Attendez que le bot choisisse un trajet'}>Caisses sur trajet du Bot {viewedBot.id.slice(-1)}</button>
          <button type="button" disabled={physicsStatus !== 'ready'} onClick={() => sendPhysics('ball')}>Lancer une bille</button>
          <button type="button" disabled={physicsStatus !== 'ready'} onClick={() => sendPhysics('shock')}>Onde de choc</button>
          <span className="physics-impact-count" aria-live="polite">Contacts · Bot 0 : {physicsImpacts['bot-0']} · Bot 1 : {physicsImpacts['bot-1']}</span>
          {physicsStatus !== 'ready' && <span role="status">{physicsStatus === 'failed' ? 'Physique indisponible' : 'Chargement de la physique…'}</span>}
        </>}
      </div>
      <div className="scene" ref={sceneRef}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 10, 8], fov: 45 }} onPointerMissed={() => setSelected(null)}>
          <BoardCamera radius={snapshot.mapRadius} />
          <ScoreBackground gameId={gameId} score0={snapshot.bots['bot-0'].score} score1={snapshot.bots['bot-1'].score} />
          <ambientLight intensity={0.95} /><directionalLight position={[5, 12, 6]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
          <EndlessSeabed radius={snapshot.mapRadius} world={snapshot.world} waterLevel={snapshot.waterLevel} />
          <FloodStage key={gameId ?? 'preview'} world={snapshot.world} waterLevel={snapshot.waterLevel} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} onSelect={setSelected} />
          <Tiles world={snapshot.world} current={current} explored={explored} scanned={scanned} known={viewedBot.known.join('|')} depleted={depleted} developer={developer} selected={selected} route={expert && !developer ? expertBot.route : []} routeOwner={expert && !developer ? expertBot.id : null} select={setSelected} />
          <TileGlyphs world={snapshot.world} current={current} explored={explored} scanned={scanned} known={viewedBot.known.join('|')} depleted={depleted} developer={developer} selected={selected} />
          <MineMarkers world={snapshot.world} bot={viewedBot} current={currentCoords} developer={developer} elapsed={snapshot.elapsed} />
          <MineReportMarkers world={snapshot.world} report={mineReport} />
          <GroundResources world={snapshot.world} current={current} scanned={scanned} known={viewedBot.known.join('|')} select={setSelected} />
          {developer && <DeveloperRoutes bots={Object.values(snapshot.bots)} world={snapshot.world} />}
          <WaitingMarkers bots={Object.values(snapshot.bots)} visible={currentCoords} world={snapshot.world} />
          {cloudVisible && snapshot.cloud && <ElectricCloudView key={`${gameId}-${snapshot.cloud.appearedAt}`} cloud={snapshot.cloud} elapsed={snapshot.elapsed} world={snapshot.world} opacity={opacity} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} speed={snapshot.speed} />}
          <IncidentPulses alerts={alerts} world={snapshot.world} />
          {visibleBots.map(bot => {
            const other = snapshot.bots[bot.id === 'bot-0' ? 'bot-1' : 'bot-0'];
            const crossing = bot.operation?.kind === 'move' && other.operation?.kind === 'move' && bot.operation.target === other.coord && other.operation.target === bot.coord;
            const otherParked = other.state !== 'finished' && other.state !== 'disabled' && other.operation?.kind !== 'move' && other.operation?.kind !== 'rescue';
            const flyoverStart = bot.operation?.kind === 'move' && otherParked && bot.coord === other.coord;
            const flyoverEnd = bot.operation?.kind === 'move' && otherParked && bot.operation.target === other.coord && bot.goal?.coord !== other.coord;
            return <Vehicle key={bot.id} bot={bot} world={snapshot.world} crossing={crossing} flyoverStart={flyoverStart} flyoverEnd={flyoverEnd} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} speed={snapshot.speed} onPose={recordBotPose} />;
          })}
          {!developer && <VisionMist bot={viewedBot} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} />}
          {physicsEnabled && <Suspense fallback={null}><PhysicsPlayground key={physicsScope} scope={physicsScope} tiles={snapshot.world} initialCoord={physicsInitial} command={physicsCommand} botPoses={physicsBotPoses} visibleBots={visibleBots.map(bot => bot.id)} onStatus={setPhysicsStatus} onImpacts={setPhysicsImpacts} /></Suspense>}
          <OrbitControls makeDefault target={[0, 0.85, 0]} minDistance={8} maxDistance={Math.max(26, snapshot.mapRadius * 12)} minPolarAngle={0.1} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
        <button type="button" className="scene-fullscreen-button" onClick={toggleFullscreen} title={isFullscreen ? 'Quitter le plein écran' : 'Afficher la scène en plein écran'} aria-label={isFullscreen ? 'Quitter le plein écran' : 'Afficher la scène en plein écran'} aria-pressed={isFullscreen}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        {fullscreenError && <span className="scene-fullscreen-error" role="alert">Le plein écran est indisponible.</span>}
        <div className="map-cartouche" aria-hidden="true"><span>JFF · ÉTUDE VISUELLE</span><strong>Les deux refuges</strong><small>La lumière veille sur les îles</small></div>
        <TrustHud trust={snapshot.trust} lastChange={snapshot.lastTrustChange} perspective={perspective} onSelect={setSelected} />
        <IncidentHud alerts={alerts} bot={viewedBot} cloudVisible={cloudVisible} onSelect={setSelected} />
      </div>
      <div className="tile-inspector"><label>Tuile <select aria-label="Tuile selectionnee" value={tile ? selected! : ''} onChange={event => setSelected(event.target.value ? event.target.value as Coord : null)}><option value="">Aucune</option>{allCoords.map(coord => <option key={coord} value={coord}>{coord}</option>)}</select></label><span>{tile ? !revealedKind ? 'Inconnue' : depleted.split('|').includes(tile.coord) ? 'Collectée et épuisée' : revealedKind === 'terrain' ? 'Terrain' : TILE_LABELS[revealedKind] : `${allCoords.length} hexagones`}</span>{tile && isExplored && <span>Niveau {tileLevel(tile)}{isSubmerged(tile, snapshot.waterLevel) ? " · Submergée : drone seulement" : ""}</span>}{revealedKind === 'repair' && snapshot.repairAvailableAt > snapshot.elapsed && <span className="cloud-alert">Réparation disponible dans {Math.ceil((snapshot.repairAvailableAt - snapshot.elapsed) / 1000)} s</span>}{mineLabel && <span className="cloud-alert">{mineLabel}</span>}{selectedInCloud && <span className="cloud-alert">Nuage électrique : jusqu’à {RULES.cloudDamage} points de dégâts au contact</span>}{tile && isCurrent && isScanned && tile.kind === 'resource' && RESOURCE_KINDS.filter(kind => tile.resources[kind] > 0).map(kind => <span key={kind}>{RESOURCE_LABELS[kind]} +{tile.resources[kind]}</span>)}{tile && developer && <span>Bot 0 : {knowsTileKind(snapshot.bots['bot-0'], tile) ? 'nature connue' : 'nature inconnue'} · Bot 1 : {knowsTileKind(snapshot.bots['bot-1'], tile) ? 'nature connue' : 'nature inconnue'}</span>}</div>
      <div className="map-legend"><span><i style={{ background: '#3b4c51' }} />Inconnue</span><span><i style={{ background: '#a49f8e' }} />Souvenir du terrain</span>{Object.entries(TILE_LABELS).map(([kind, label]) => <span key={kind}><i style={{ background: TILE_COLORS[kind as keyof typeof TILE_COLORS] }} />{label}</span>)}<span><i style={{ background: MINED_TILE_COLOR }} />Mine armée : dégâts au contact</span><span><i style={{ background: '#e5ac49' }} />Mine en armement : visible 800 ms</span><span><i style={{ background: '#8b7187' }} />Souvenir de mine : position incertaine</span><span><i style={{ background: '#f36b75' }} />Nuage électrique : jusqu’à {RULES.cloudDamage} dégâts au contact</span><span><i style={{ background: DEPLETED_TILE_COLOR }} />Collectée et épuisée</span>{RESOURCE_KINDS.map(kind => <span key={kind}><i style={{ background: RESOURCE_COLORS[kind] }} />{RESOURCE_LABELS[kind]}</span>)}</div>
    </section>
    <aside className="bot-sidebar" aria-label="Bots">
      {(snapshot.phase === 'finished' || snapshot.phase === 'blocked') && <section className="result"><h2>{snapshot.phase === 'blocked' ? 'Partie bloquee' : 'Partie terminee'}</h2><p>{snapshot.winners.length === 0 ? 'Aucun vainqueur' : snapshot.winners.length === 2 ? 'Egalite' : `Victoire du Bot ${snapshot.winners[0].slice(-1)}`}</p><small>{snapshot.endReason}</small></section>}
      {(developer ? BOT_IDS.map(id => snapshot.bots[id]) : [viewedBot]).map(bot => <BotPanel key={bot.id} bot={bot} winner={snapshot.winners.includes(bot.id)} expert={expert} events={visibleEvents} onOpenExpert={() => setExpertBotId(bot.id)} />)}
      {expert && <>
        <div className="expert-bot-switch" aria-label="Bot analyse">{Object.values(snapshot.bots).map(bot => <button key={bot.id} aria-pressed={expertBotId === bot.id} onClick={() => setExpertBotId(bot.id)} title={`Analyser le Bot ${bot.id.slice(-1)}`} aria-label={`Analyser le Bot ${bot.id.slice(-1)}`}><BotIcon size={16} /><span>{bot.id.slice(-1)}</span></button>)}</div>
        <ExpertBotView bot={expertBot} events={visibleEvents} onClose={() => setExpert(false)} />
      </>}
    </aside>
  </main>;
}
