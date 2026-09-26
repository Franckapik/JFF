import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Color, Group, InstancedMesh, Object3D, Vector3 } from 'three';

import type { BotView } from '../../engine/model';
import { resourceTotal } from '../../engine/resources';
import { RULES } from '../../engine/rules';
import { worldPosition, type BotId, type Coord, type World } from '../../engine/world';
import { useSessionStore } from '../../stores/useSessionStore';

import BotPanel from './BotPanel';
import { BOT_COLORS, TILE_COLORS, TILE_LABELS } from './presentation';
import { useRenderCounter } from './renderMetrics';

const Tiles = memo(function Tiles({ world, visible, selected, select }: { world: World; visible: string; selected: Coord | null; select: (coord: Coord) => void }) {
  useRenderCounter('Tiles');
  const mesh = useRef<InstancedMesh>(null);
  const tiles = useMemo(() => Object.values(world), [world]);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const known = visible ? new Set(visible.split('|')) : null;
    const transform = new Object3D();
    tiles.forEach((tile, index) => {
      transform.position.set(...worldPosition(tile.coord));
      transform.position.y = tile.coord === selected ? 0.16 : tile.kind === 'obstacle' ? 0.24 : 0;
      transform.scale.set(1, tile.kind === 'obstacle' ? 4 : 1, 1);
      transform.updateMatrix(); mesh.current!.setMatrixAt(index, transform.matrix);
      const publicTile = ['base', 'fuel', 'repair', 'obstacle'].includes(tile.kind);
      const color = known && !known.has(tile.coord) && !publicTile ? '#becac8' : tile.owner ? BOT_COLORS[tile.owner] : tile.kind === 'resource' && resourceTotal(tile.resources) === 0 ? TILE_COLORS.empty : TILE_COLORS[tile.kind];
      mesh.current!.setColorAt(index, new Color(color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [tiles, visible, selected]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, tiles.length]} receiveShadow onClick={event => { event.stopPropagation(); if (event.instanceId !== undefined) select(tiles[event.instanceId].coord); }}>
    <cylinderGeometry args={[0.96, 0.96, 0.12, 6]} /><meshStandardMaterial roughness={0.86} />
  </instancedMesh>;
});

function Vehicle({ bot, paused, speed }: { bot: BotView; paused: boolean; speed: number }) {
  useRenderCounter(bot.id);
  const ship = useRef<Group>(null);
  const drone = useRef<Group>(null);
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
      ship.current.position.y = 0.28;
      if (operation?.kind === 'move') ship.current.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
    }
    if (drone.current) {
      drone.current.position.copy(from);
      let flight = 0;
      if (operation?.kind === 'scan') {
        const travel = (operation.duration - RULES.scanDuration) / 2;
        flight = travel > 0 ? Math.min(1, elapsed / travel, (operation.duration - elapsed) / travel) : 0;
        drone.current.position.lerp(to, Math.max(0, flight));
      } else if (ship.current) drone.current.position.copy(ship.current.position);
      drone.current.position.y = operation?.kind === 'scan' ? 0.8 + 0.6 * flight : 0.8;
      if (!paused && operation?.kind === 'scan') drone.current.rotation.y += delta * 5;
    }
  });
  const color = bot.state === 'eliminated' ? '#697772' : BOT_COLORS[bot.id];
  return <>
    <group ref={ship} position={worldPosition(bot.coord)}>
      <mesh castShadow><boxGeometry args={[0.5, 0.2, 0.8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.15, -0.1]} castShadow><boxGeometry args={[0.3, 0.18, 0.35]} /><meshStandardMaterial color="#f5f7f4" /></mesh>
      <mesh position={[0, 0.02, 0.5]} rotation={[Math.PI / 2, 0, 0]}><coneGeometry args={[0.22, 0.3, 4]} /><meshStandardMaterial color={color} /></mesh>
    </group>
    {bot.droneAvailable && bot.state !== 'eliminated' && <group ref={drone}>
      <mesh><octahedronGeometry args={[0.14]} /><meshStandardMaterial color={color} metalness={0.2} roughness={0.3} /></mesh>
      <mesh><boxGeometry args={[0.55, 0.025, 0.08]} /><meshStandardMaterial color="#f7faf7" /></mesh>
      <mesh><boxGeometry args={[0.08, 0.025, 0.55]} /><meshStandardMaterial color="#f7faf7" /></mesh>
    </group>}
  </>;
}

export default function GameView() {
  useRenderCounter('GameView');
  const snapshot = useSessionStore(state => state.snapshot);
  const status = useSessionStore(state => state.status);
  const [perspective, setPerspective] = useState<BotId | 'world'>('world');
  const [selected, setSelected] = useState<Coord | null>(null);
  if (!snapshot) return <main className="empty-state" role="status">{status === 'disconnected' ? 'Moteur hors ligne' : 'Connexion au moteur...'}</main>;
  const visible = perspective === 'world' ? '' : snapshot.bots[perspective].known.join('|');
  const tile = selected ? snapshot.world[selected] : null;
  const known = perspective === 'world' || !!tile && ['base', 'fuel', 'repair', 'obstacle'].includes(tile.kind) || !!selected && snapshot.bots[perspective].known.includes(selected);
  return <main className="game-layout">
    <section className="board-panel" aria-label="Terrain de la partie">
      <div className="board-toolbar"><h1>Terrain</h1><label>Vision <select value={perspective} onChange={event => setPerspective(event.target.value as BotId | 'world')}><option value="world">Monde</option><option value="bot-0">Bot 0</option><option value="bot-1">Bot 1</option></select></label><span>{resourceTotal(snapshot.remainingResources).toLocaleString('fr-FR')} ressources restantes</span></div>
      <div className="scene">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [9, 12, 10], fov: 45 }} onPointerMissed={() => setSelected(null)}>
          <color attach="background" args={['#edf2f1']} /><ambientLight intensity={1.5} /><directionalLight position={[5, 12, 6]} intensity={2.4} castShadow shadow-mapSize={[512, 512]} />
          <Tiles world={snapshot.world} visible={visible} selected={selected} select={setSelected} />
          {Object.values(snapshot.bots).map(bot => <Vehicle key={bot.id} bot={bot} paused={snapshot.paused || snapshot.phase === 'finished' || snapshot.phase === 'blocked' || status !== 'connected'} speed={snapshot.speed} />)}
          <OrbitControls makeDefault target={[0, 0, 0]} minDistance={8} maxDistance={26} minPolarAngle={0.1} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>
      <div className="tile-inspector"><label>Tuile <select aria-label="Tuile selectionnee" value={selected ?? ''} onChange={event => setSelected(event.target.value ? event.target.value as Coord : null)}><option value="">Aucune</option>{Object.values(snapshot.world).map(candidate => <option key={candidate.coord} value={candidate.coord}>{candidate.coord}</option>)}</select></label><span>{tile ? known ? TILE_LABELS[tile.kind] : 'Inconnue' : `${Object.keys(snapshot.world).length} hexagones`}</span>{tile && known && <span>Nourriture {tile.resources.food} / Debris {tile.resources.debris} / Special {tile.resources.special}</span>}</div>
      <div className="map-legend">{Object.entries(TILE_LABELS).map(([kind, label]) => <span key={kind}><i style={{ background: TILE_COLORS[kind as keyof typeof TILE_COLORS] }} />{label}</span>)}</div>
    </section>
    <aside className="bot-sidebar" aria-label="Bots">
      {(snapshot.phase === 'finished' || snapshot.phase === 'blocked') && <section className="result"><h2>{snapshot.phase === 'blocked' ? 'Partie bloquee' : 'Partie terminee'}</h2><p>{snapshot.winners.length === 0 ? 'Aucun vainqueur' : snapshot.winners.length === 2 ? 'Egalite' : `Victoire du Bot ${snapshot.winners[0].slice(-1)}`}</p><small>{snapshot.endReason}</small></section>}
      {Object.values(snapshot.bots).filter(bot => perspective === 'world' || perspective === bot.id).map(bot => <BotPanel key={bot.id} bot={bot} winner={snapshot.winners.includes(bot.id)} />)}
    </aside>
  </main>;
}