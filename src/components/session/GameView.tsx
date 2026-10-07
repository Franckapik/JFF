import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bot as BotIcon, SlidersHorizontal } from 'lucide-react';
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Color, Group, InstancedMesh, Object3D, Vector3 } from 'three';

import type { BotView, ElectricCloud, MineReport } from '../../engine/model';
import { RESOURCE_KINDS, type Resources } from '../../engine/resources';
import { RULES } from '../../engine/rules';
import { activeCoords, depletedResourceCoords, isCloudVisible, resourceMarkerCoords, revealedTileKind } from '../../engine/visibility';
import { BOT_IDS, hexDistance, hexLine, worldPosition, type BotId, type Coord, type World, type WorldTile } from '../../engine/world';
import { useSessionStore } from '../../stores/useSessionStore';

import BotPanel from './BotPanel';
import ExpertBotView from './ExpertBotView';
import { IncidentHud, IncidentPulses } from './IncidentFeedback';
import { BOT_COLORS, cloudOpacity, DEPLETED_TILE_COLOR, MINED_TILE_COLOR, TILE_COLORS, TILE_LABELS } from './presentation';
import { useRenderCounter } from './renderMetrics';
import { useIncidentAlerts } from './useIncidentAlerts';

type Perspective = BotId | 'developer';

function knowsTileKind(bot: BotView, tile: WorldTile): boolean {
  return ['base', 'fuel', 'repair', 'obstacle'].includes(tile.kind)
    ? bot.explored.includes(tile.coord)
    : bot.known.includes(tile.coord);
}

const Tiles = memo(function Tiles({ world, current, explored, scanned, known, depleted, developer, selected, route, routeOwner, select }: { world: World; current: string; explored: string; scanned: string; known: string; depleted: string; developer: boolean; selected: Coord | null; route: Coord[]; routeOwner: BotId | null; select: (coord: Coord) => void }) {
  useRenderCounter('Tiles');
  const mesh = useRef<InstancedMesh>(null);
  const tiles = useMemo(() => Object.values(world), [world]);
  useLayoutEffect(() => {
    if (!mesh.current) return;
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
      transform.position.y = tile.coord === selected && seen ? 0.16 : tile.kind === 'obstacle' && seen ? 0.24 : 0;
      transform.scale.set(1, tile.kind === 'obstacle' && seen ? 4 : 1, 1);
      transform.updateMatrix(); mesh.current!.setMatrixAt(index, transform.matrix);
      const revealed = revealedTileKind(tile, knownCoords, scannedCoords, visible, developer);
      const color = routeOwner && routeCoords.has(tile.coord) && visible ? BOT_COLORS[routeOwner] : tile.owner ? BOT_COLORS[tile.owner] : depletedCoords.has(tile.coord) ? DEPLETED_TILE_COLOR : revealed === 'terrain' ? TILE_COLORS.empty : TILE_COLORS[revealed];
      mesh.current!.setColorAt(index, !seen ? new Color('#151c20') : visible ? new Color(color) : new Color(color).multiplyScalar(0.38));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [tiles, current, explored, scanned, known, depleted, developer, selected, route, routeOwner]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, tiles.length]} receiveShadow onClick={event => { event.stopPropagation(); if (event.instanceId !== undefined) select(tiles[event.instanceId].coord); }}>
    <cylinderGeometry args={[0.96, 0.96, 0.12, 6]} /><meshStandardMaterial roughness={0.86} />
  </instancedMesh>;
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

const GroundResources = memo(function GroundResources({ world, current, scanned }: { world: World; current: string; scanned: string }) {
  return <>{resourceMarkerCoords(world, current.split('|') as Coord[], scanned.split('|') as Coord[]).map(coord =>
    <group key={coord} position={worldPosition(coord)}><ResourceTokens resources={world[coord].resources} /></group>
  )}</>;
});

function DeveloperRoutes({ bots }: { bots: BotView[] }) {
  return <>{bots.flatMap(bot => bot.route.map((coord, index) => {
    const [x, , z] = worldPosition(coord);
    return <mesh key={`${bot.id}-${coord}-${index}`} position={[x + (bot.id === 'bot-0' ? -0.46 : 0.46), 0.18, z]}>
      <sphereGeometry args={[0.09, 8, 6]} /><meshBasicMaterial color={BOT_COLORS[bot.id]} />
    </mesh>;
  }))}</>;
}

function WaitingMarkers({ bots, visible }: { bots: BotView[]; visible: Coord[] }) {
  const seen = new Set(visible);
  return <>{bots.filter(bot => bot.operation?.kind === 'wait' && seen.has(bot.operation.target)).map(bot => {
    const [x, , z] = worldPosition(bot.operation!.target);
    return <mesh key={bot.id} position={[x, 0.21, z]} rotation={[-Math.PI / 2, 0, 0]}>
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
    return <group key={coord} position={[x, 0.25, z]}>
      <mesh><octahedronGeometry args={[0.22]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={arming ? 0.55 : 0.18} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.35, 0.41, arming ? 12 : 6]} /><meshBasicMaterial color={color} /></mesh>
    </group>;
  })}</>;
}

function MineReportMarkers({ world, report }: { world: World; report: MineReport | undefined }) {
  if (!report || report.nearestDistance === null) return null;
  const { center, nearestDistance } = report;
  return <>{Object.keys(world).filter(coord => hexDistance(center, coord as Coord) === nearestDistance).map(coord => {
    const [x, , z] = worldPosition(coord as Coord);
    return <mesh key={coord} position={[x, 0.19, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.68, 0.75, 6]} /><meshBasicMaterial color="#c2933d" transparent opacity={0.8} />
    </mesh>;
  })}</>;
}

function ElectricCloudView({ cloud, opacity, paused }: { cloud: ElectricCloud; opacity: number; paused: boolean }) {
  const body = useRef<Group>(null);
  const phase = useRef(0);
  const [x, , z] = worldPosition(cloud.coord);
  useFrame((_, delta) => {
    if (!paused) phase.current += delta;
    if (body.current) {
      body.current.rotation.y = phase.current * 0.45;
      body.current.position.y = 0.82 + Math.sin(phase.current * 2.3) * 0.1;
    }
  });
  return <>
    <mesh position={[x, 0.2, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.78, 0.85, 6]} />
      <meshBasicMaterial color="#65dbe9" transparent opacity={0.88 * opacity} />
    </mesh>
    <group position={worldPosition(cloud.coord)}>
      <group ref={body}>
        <mesh position={[-0.27, 0, 0]}><icosahedronGeometry args={[0.35, 1]} /><meshStandardMaterial color="#bad9df" emissive="#4ba3c3" emissiveIntensity={0.75} transparent opacity={0.86 * opacity} /></mesh>
        <mesh position={[0.2, 0.13, 0.15]}><icosahedronGeometry args={[0.4, 1]} /><meshStandardMaterial color="#9fcbd4" emissive="#3977ba" emissiveIntensity={0.8} transparent opacity={0.83 * opacity} /></mesh>
        <mesh position={[0.12, -0.12, -0.25]}><icosahedronGeometry args={[0.28, 1]} /><meshStandardMaterial color="#c5e5e8" emissive="#4ba3c3" emissiveIntensity={0.65} transparent opacity={0.85 * opacity} /></mesh>
        <mesh rotation={[0.3, 0, 0.4]}><torusGeometry args={[0.51, 0.025, 4, 16]} /><meshBasicMaterial color="#f5e777" transparent opacity={opacity} /></mesh>
      </group>
    </group>
  </>;
}

function scanPosition(from: Coord, to: Coord, elapsed: number): Vector3 {
  const path = hexLine(from, to);
  if (path.length === 1) return new Vector3(...worldPosition(from));
  const progress = Math.max(0, Math.min(path.length - 1, elapsed / RULES.stepDuration));
  const index = Math.min(path.length - 2, Math.floor(progress));
  return new Vector3(...worldPosition(path[index])).lerp(new Vector3(...worldPosition(path[index + 1])), progress - index);
}

function Vehicle({ bot, paused, speed, crossing, flyoverStart, flyoverEnd }: { bot: BotView; paused: boolean; speed: number; crossing: boolean; flyoverStart: boolean; flyoverEnd: boolean }) {
  useRenderCounter(bot.id);
  const ship = useRef<Group>(null);
  const drone = useRef<Group>(null);
  const offensiveDrone = useRef<Group>(null);
  const received = useRef(performance.now());
  useLayoutEffect(() => { received.current = performance.now(); }, [bot.operation?.remaining, bot.coord, paused, speed]);
  const from = useMemo(() => new Vector3(...worldPosition(bot.coord)), [bot.coord]);
  const to = useMemo(() => new Vector3(...worldPosition(bot.operation?.target ?? bot.coord)), [bot.operation?.target, bot.coord]);
  useFrame((_state, delta) => {
    const operation = bot.operation;
    const elapsed = operation ? operation.duration - operation.remaining + (paused ? 0 : Math.min(operation.remaining, (performance.now() - received.current) * speed)) : 0;
    const progress = operation ? Math.min(1, elapsed / operation.duration) : 0;
    if (ship.current) {
      ship.current.position.copy(from);
      if (operation?.kind === 'move' || operation?.kind === 'rescue') ship.current.position.lerp(to, progress);
      ship.current.position.y = 0.28 + (operation?.kind === 'move'
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
    }
    if (drone.current) {
      drone.current.position.copy(from);
      let flight = 0;
      if (operation?.kind === 'scan') {
        flight = Math.max(0, Math.min(1, elapsed / RULES.stepDuration, (operation.duration - elapsed) / RULES.stepDuration));
        const detour = operation.scanDetour;
        if (detour) {
          if (elapsed <= detour.contactAt) drone.current.position.copy(scanPosition(bot.coord, detour.contact, elapsed));
          else if (elapsed <= detour.edgeAt) drone.current.position.copy(scanPosition(detour.contact, detour.edge, elapsed - detour.contactAt));
          else if (elapsed <= detour.destinationAt) drone.current.position.copy(scanPosition(detour.edge, detour.destination, elapsed - detour.edgeAt));
          else if (elapsed <= detour.destinationAt + RULES.scanDuration) drone.current.position.set(...worldPosition(detour.destination));
          else drone.current.position.copy(scanPosition(detour.destination, bot.coord, elapsed - detour.destinationAt - RULES.scanDuration));
        } else {
          const target = operation.scanInitialTarget ?? operation.target;
          const travel = hexLine(bot.coord, target).length - 1;
          const arrival = travel * RULES.stepDuration;
          if (elapsed <= arrival) drone.current.position.copy(scanPosition(bot.coord, target, elapsed));
          else if (elapsed <= arrival + RULES.scanDuration) drone.current.position.set(...worldPosition(target));
          else drone.current.position.copy(scanPosition(target, bot.coord, elapsed - arrival - RULES.scanDuration));
        }
      } else if (ship.current) drone.current.position.copy(ship.current.position);
      drone.current.position.y = operation?.kind === 'scan' ? 0.8 + 0.6 * flight : 0.8 + (ship.current?.position.y ?? 0.28) - 0.28;
      if (!paused && operation?.kind === 'scan') drone.current.rotation.y += delta * 5;
    }
    if (offensiveDrone.current) {
      offensiveDrone.current.position.copy(ship.current?.position ?? from);
      if (operation?.kind === 'mine' || operation?.kind === 'mineScan' || operation?.kind === 'neutralize') {
        const travel = hexDistance(bot.coord, operation.target) * RULES.stepDuration;
        if (elapsed <= travel) offensiveDrone.current.position.copy(scanPosition(bot.coord, operation.target, elapsed));
        else if (elapsed <= travel + RULES.scanDuration) offensiveDrone.current.position.set(...worldPosition(operation.target));
        else offensiveDrone.current.position.copy(scanPosition(operation.target, bot.coord, elapsed - travel - RULES.scanDuration));
        offensiveDrone.current.position.y = 1.35;
        if (!paused) offensiveDrone.current.rotation.y += delta * 5;
      } else offensiveDrone.current.position.y = (ship.current?.position.y ?? 0.28) + 0.68;
      offensiveDrone.current.position.x += 0.32;
    }
  });
  const color = bot.state === 'disabled' ? '#697772' : BOT_COLORS[bot.id];
  return <>
    <group ref={ship} position={worldPosition(bot.coord)}>
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
  const [expert, setExpert] = useState(false);
  const [expertBotId, setExpertBotId] = useState<BotId>('bot-0');
  const currentCoords = snapshot ? perspective === 'developer' ? Object.keys(snapshot.world) as Coord[] : activeCoords(snapshot.world, snapshot.bots[perspective]) : [];
  const alerts = useIncidentAlerts(snapshot, gameId, perspective, currentCoords);
  if (!snapshot) return <main className="empty-state" role="status">{status === 'disconnected' ? 'Moteur hors ligne' : 'Connexion au moteur...'}</main>;
  const developer = perspective === 'developer';
  const viewedBot = snapshot.bots[developer ? expertBotId : perspective];
  const allCoords = Object.keys(snapshot.world) as Coord[];
  const current = currentCoords.join('|');
  const explored = developer ? current : viewedBot.explored.join('|');
  const scanned = developer ? current : viewedBot.scanned.join('|');
  const depleted = depletedResourceCoords(snapshot.world, Object.values(snapshot.bots), currentCoords, developer ? currentCoords : viewedBot.scanned).join('|');
  const tile = selected ? snapshot.world[selected] : null;
  const isCurrent = !!selected && currentCoords.includes(selected);
  const isExplored = isCurrent || !!selected && viewedBot.explored.includes(selected);
  const isScanned = !!selected && (developer || viewedBot.scanned.includes(selected));
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
  return <main className={`game-layout${expert ? ' expert-open' : ''}`}>
    <section className="board-panel" aria-label="Terrain de la partie">
      <div className="board-toolbar"><h1>Terrain</h1><label>Vision <select value={perspective} onChange={event => setPerspective(event.target.value as Perspective)}><option value="bot-0">Bot 0</option><option value="bot-1">Bot 1</option><option value="developer">Développeur</option></select></label><button className="icon-button expert-toggle" aria-pressed={expert} onClick={() => setExpert(value => !value)} title={expert ? 'Masquer le mode expert' : 'Afficher le mode expert'} aria-label={expert ? 'Masquer le mode expert' : 'Afficher le mode expert'}><SlidersHorizontal size={18} /></button><span>{developer ? 'Carte complète' : `${viewedBot.explored.length} / ${allCoords.length} cases explorées`}</span>{viewedBot.mineWarning && <span className="cloud-alert">Mine ennemie à proximité</span>}{mineReport && <span title={`Relevé à ${Math.round(mineReport.time / 1000)} s`}>Scan {mineReport.center} : {mineReport.count} mine(s) / rayon {mineReport.radius} · plus proche {mineReport.nearestDistance ?? '—'} hex.</span>}{cloudVisible && <span className="cloud-alert">⚡ Nuage électrique détecté</span>}{viewedBot.operation?.scanDetour && <span className="cloud-alert">{!viewedBot.operation.scanEdgeReached ? 'Drone repoussé vers le bord' : !viewedBot.operation.scanArrived ? 'Drone vers une tuile aléatoire' : 'Drone en retour'}</span>}</div>
      <div className="scene">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [9, 12, 10], fov: 45 }} onPointerMissed={() => setSelected(null)}>
          <color attach="background" args={['#edf2f1']} /><ambientLight intensity={1.5} /><directionalLight position={[5, 12, 6]} intensity={2.4} castShadow shadow-mapSize={[512, 512]} />
          <Tiles world={snapshot.world} current={current} explored={explored} scanned={scanned} known={viewedBot.known.join('|')} depleted={depleted} developer={developer} selected={selected} route={expert && !developer ? expertBot.route : []} routeOwner={expert && !developer ? expertBot.id : null} select={setSelected} />
          <MineMarkers world={snapshot.world} bot={viewedBot} current={currentCoords} developer={developer} elapsed={snapshot.elapsed} />
          <MineReportMarkers world={snapshot.world} report={mineReport} />
          <GroundResources world={snapshot.world} current={current} scanned={scanned} />
          {developer && <DeveloperRoutes bots={Object.values(snapshot.bots)} />}
          <WaitingMarkers bots={Object.values(snapshot.bots)} visible={currentCoords} />
          {cloudVisible && snapshot.cloud && <ElectricCloudView cloud={snapshot.cloud} opacity={opacity} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} />}
          <IncidentPulses alerts={alerts} />
          {Object.values(snapshot.bots).filter(bot => developer || bot.id === perspective || currentCoords.includes(bot.coord)).map(bot => {
            const other = snapshot.bots[bot.id === 'bot-0' ? 'bot-1' : 'bot-0'];
            const crossing = bot.operation?.kind === 'move' && other.operation?.kind === 'move' && bot.operation.target === other.coord && other.operation.target === bot.coord;
            const otherParked = other.state !== 'finished' && other.state !== 'disabled' && other.operation?.kind !== 'move' && other.operation?.kind !== 'rescue';
            const flyoverStart = bot.operation?.kind === 'move' && otherParked && bot.coord === other.coord;
            const flyoverEnd = bot.operation?.kind === 'move' && otherParked && bot.operation.target === other.coord && bot.goal?.coord !== other.coord;
            return <Vehicle key={bot.id} bot={bot} crossing={crossing} flyoverStart={flyoverStart} flyoverEnd={flyoverEnd} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} speed={snapshot.speed} />;
          })}
          <OrbitControls makeDefault target={[0, 0, 0]} minDistance={8} maxDistance={26} minPolarAngle={0.1} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
        <IncidentHud alerts={alerts} bot={viewedBot} cloudVisible={cloudVisible} onSelect={setSelected} />
      </div>
      <div className="tile-inspector"><label>Tuile <select aria-label="Tuile selectionnee" value={selected ?? ''} onChange={event => setSelected(event.target.value ? event.target.value as Coord : null)}><option value="">Aucune</option>{Object.values(snapshot.world).map(candidate => <option key={candidate.coord} value={candidate.coord}>{candidate.coord}</option>)}</select></label><span>{tile ? !revealedKind ? 'Inconnue' : depleted.split('|').includes(tile.coord) ? 'Collectée et épuisée' : revealedKind === 'terrain' ? 'Terrain' : TILE_LABELS[revealedKind] : `${allCoords.length} hexagones`}</span>{revealedKind === 'repair' && snapshot.repairAvailableAt > snapshot.elapsed && <span className="cloud-alert">Réparation disponible dans {Math.ceil((snapshot.repairAvailableAt - snapshot.elapsed) / 1000)} s</span>}{mineLabel && <span className="cloud-alert">{mineLabel}</span>}{selectedInCloud && <span className="cloud-alert">Nuage électrique : traversée dangereuse</span>}{tile && isCurrent && isScanned && tile.kind === 'resource' && <span>Nourriture {tile.resources.food} / Débris {tile.resources.debris} / Spécial {tile.resources.special}</span>}{tile && developer && <span>Bot 0 : {knowsTileKind(snapshot.bots['bot-0'], tile) ? 'nature connue' : 'nature inconnue'} · Bot 1 : {knowsTileKind(snapshot.bots['bot-1'], tile) ? 'nature connue' : 'nature inconnue'}</span>}</div>
      <div className="map-legend"><span><i style={{ background: '#151c20' }} />Inconnue</span><span><i style={{ background: '#596a69' }} />Souvenir du terrain</span>{Object.entries(TILE_LABELS).map(([kind, label]) => <span key={kind}><i style={{ background: TILE_COLORS[kind as keyof typeof TILE_COLORS] }} />{label}</span>)}<span><i style={{ background: MINED_TILE_COLOR }} />Mine armée : dégâts au contact</span><span><i style={{ background: '#e5ac49' }} />Mine en armement : visible 800 ms</span><span><i style={{ background: '#8b7187' }} />Souvenir de mine : position incertaine</span><span><i style={{ background: '#65dbe9' }} />Nuage électrique : contact sur sa tuile</span><span><i style={{ background: DEPLETED_TILE_COLOR }} />Collectée et épuisée</span>{RESOURCE_KINDS.map(kind => <span key={kind}><i style={{ background: RESOURCE_COLORS[kind] }} />{kind === 'food' ? 'Nourriture' : kind === 'debris' ? 'Débris' : 'Spécial'}</span>)}</div>
    </section>
    <aside className="bot-sidebar" aria-label="Bots">
      {(snapshot.phase === 'finished' || snapshot.phase === 'blocked') && <section className="result"><h2>{snapshot.phase === 'blocked' ? 'Partie bloquee' : 'Partie terminee'}</h2><p>{snapshot.winners.length === 0 ? 'Aucun vainqueur' : snapshot.winners.length === 2 ? 'Egalite' : `Victoire du Bot ${snapshot.winners[0].slice(-1)}`}</p><small>{snapshot.endReason}</small></section>}
      {(developer ? BOT_IDS.map(id => snapshot.bots[id]) : [viewedBot]).map(bot => <BotPanel key={bot.id} bot={bot} winner={snapshot.winners.includes(bot.id)} expert={expert} events={snapshot.events} onOpenExpert={() => setExpertBotId(bot.id)} />)}
      {expert && <>
        <div className="expert-bot-switch" aria-label="Bot analyse">{Object.values(snapshot.bots).map(bot => <button key={bot.id} aria-pressed={expertBotId === bot.id} onClick={() => setExpertBotId(bot.id)} title={`Analyser le Bot ${bot.id.slice(-1)}`} aria-label={`Analyser le Bot ${bot.id.slice(-1)}`}><BotIcon size={16} /><span>{bot.id.slice(-1)}</span></button>)}</div>
        <ExpertBotView bot={expertBot} events={snapshot.events} onClose={() => setExpert(false)} />
      </>}
    </aside>
  </main>;
}
