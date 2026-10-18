import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Mesh } from 'three';

import { PhysicsPlaygroundWorld, type PhysicsBotPose, type PlaygroundBody } from '../../engine/physicsPlayground';
import { BOT_IDS, type BotId, type Coord, type World } from '../../engine/world';

export interface PhysicsCommand {
  serial: number;
  scope: string;
  action: 'stack' | 'ball' | 'shock' | 'route';
  coord: Coord;
}

function BodyView({ item, playground }: { item: PlaygroundBody; playground: PhysicsPlaygroundWorld }) {
  const mesh = useRef<Mesh>(null);
  useFrame(() => {
    if (!mesh.current || !playground.active || !item.active) return;
    const position = item.body.translation();
    const rotation = item.body.rotation();
    mesh.current.position.set(position.x, position.y, position.z);
    mesh.current.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  });
  if (!playground.active || !item.active) return null;
  const position = item.body.translation();
  return <mesh ref={mesh} position={[position.x, position.y, position.z]} castShadow receiveShadow
    onClick={event => { event.stopPropagation(); if (playground.active && item.active) playground.push(item.id, event.camera.position); }}>
    {item.shape === 'ball'
      ? <sphereGeometry args={[item.size[0] / 2, 24, 16]} />
      : <boxGeometry args={item.size} />}
    <meshStandardMaterial color={item.color} roughness={item.shape === 'ball' ? 0.25 : 0.72}
      metalness={item.shape === 'ball' ? 0.38 : 0.05} emissive={item.shape === 'ball' ? '#1b7187' : '#000000'} emissiveIntensity={0.2} />
  </mesh>;
}

export default function PhysicsPlayground({ tiles, initialCoord, scope, command, botPoses, visibleBots, onStatus, onImpacts }: {
  tiles: World;
  initialCoord: Coord;
  scope: string;
  command: PhysicsCommand | null;
  botPoses: { current: Record<BotId, PhysicsBotPose | null> };
  visibleBots: BotId[];
  onStatus: (status: 'loading' | 'ready' | 'failed') => void;
  onImpacts: (counts: Record<BotId, number>) => void;
}) {
  const stableTiles = useRef(tiles).current;
  const [playground, setPlayground] = useState<PhysicsPlaygroundWorld | null>(null);
  const [objects, setObjects] = useState<readonly PlaygroundBody[]>([]);
  const handled = useRef(0);
  const reported = useRef<Record<BotId, number>>({ 'bot-0': 0, 'bot-1': 0 });

  useEffect(() => {
    let active = true;
    onStatus('loading');
    PhysicsPlaygroundWorld.create(stableTiles, initialCoord).then(created => {
      if (!active) { created.free(); return; }
      setPlayground(created);
      setObjects([...created.objects]);
      reported.current = { 'bot-0': 0, 'bot-1': 0 };
      onImpacts({ ...reported.current });
      onStatus('ready');
    }).catch(() => { if (active) onStatus('failed'); });
    return () => { active = false; };
  }, [stableTiles, initialCoord, onStatus, onImpacts]);

  useEffect(() => {
    if (!playground) return () => undefined;
    return () => playground.free();
  }, [playground]);

  useEffect(() => {
    if (!playground?.active || !command || command.scope !== scope || command.serial === handled.current) return;
    handled.current = command.serial;
    if (command.action === 'stack') playground.stack(command.coord, stableTiles);
    if (command.action === 'ball') playground.launch();
    if (command.action === 'shock') playground.shockwave();
    if (command.action === 'route') playground.dropCrates(command.coord, stableTiles);
    setObjects([...playground.objects]);
  }, [command, playground, scope, stableTiles]);

  useFrame((_, delta) => {
    if (!playground?.active) return;
    for (const id of BOT_IDS) playground.syncBot(id, visibleBots.includes(id) ? botPoses.current[id] : null);
    playground.step(delta);
    const counts = playground.impactCounts;
    if (BOT_IDS.some(id => counts[id] !== reported.current[id])) {
      reported.current = { ...counts };
      onImpacts(reported.current);
    }
  });

  return <>{objects.map(item => <BodyView key={item.id} item={item} playground={playground!} />)}</>;
}
