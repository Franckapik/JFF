import RAPIER from '@dimforge/rapier3d-compat';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

import { terrainDeckHeight, TERRAIN_BOTTOM } from '../../engine/terrainPresentation';
import { worldPosition, type Coord, type World } from '../../engine/world';
import TreasureShape from './TreasureShape';

let rapierReady: Promise<void> | null = null;

export default function TreasureView({ world, coord, paused }: { world: World; coord: Coord; paused: boolean }) {
  const shape = useRef<Group>(null);
  const initialPaused = useRef(paused);
  const [physics, setPhysics] = useState<{ world: RAPIER.World; body: RAPIER.RigidBody } | null>(null);
  const [x, , z] = worldPosition(coord);
  const deck = terrainDeckHeight(world, coord);

  useEffect(() => {
    let active = true;
    rapierReady ??= RAPIER.init();
    rapierReady.then(() => {
      if (!active) return;
      const simulation = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
      simulation.timestep = 1 / 60;
      const halfHeight = (deck - TERRAIN_BOTTOM) / 2;
      const floor = simulation.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, TERRAIN_BOTTOM + halfHeight, z));
      simulation.createCollider(RAPIER.ColliderDesc.cylinder(halfHeight, 0.68).setFriction(0.85), floor);
      const body = simulation.createRigidBody(RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, deck + 0.2, z)
        .setRotation({ x: 0, y: Math.sin(0.14), z: 0, w: Math.cos(0.14) })
        .setLinearDamping(0.3).setAngularDamping(0.35));
      simulation.createCollider(RAPIER.ColliderDesc.cuboid(0.225, 0.2, 0.2)
        .setDensity(1.4).setFriction(0.8).setRestitution(0.28), body);
      if (!initialPaused.current) body.applyImpulse({ x: 0, y: 0.75, z: 0 }, true);
      setPhysics({ world: simulation, body });
    }).catch(() => undefined);
    return () => { active = false; };
  }, [x, z, deck]);

  useEffect(() => () => physics?.world.free(), [physics]);

  const remainder = useRef(0);
  useFrame((_, delta) => {
    if (!physics || paused || !shape.current) return;
    remainder.current = Math.min(remainder.current + Math.min(delta, 0.05), 0.1);
    while (remainder.current >= 1 / 60) {
      physics.world.step();
      remainder.current -= 1 / 60;
    }
    const position = physics.body.translation();
    const rotation = physics.body.rotation();
    shape.current.position.set(position.x, position.y, position.z);
    shape.current.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  });

  return <group ref={shape} position={[x, deck + 0.2, z]} onClick={event => {
    event.stopPropagation();
    physics?.body.applyImpulse({ x: 0, y: 0.85, z: 0 }, true);
  }}><TreasureShape /></group>;
}
