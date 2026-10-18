/* eslint-disable react/no-unknown-property -- Three.js props are supplied through React Three Fiber */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';

const RADIUS = 29;
const CAPACITY = (RADIUS * 2 + 1) ** 2;
const SQRT_THREE = Math.sqrt(3);

function variation(q: number, r: number): number {
  const value = Math.sin(q * 127.1 + r * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** A camera-following, world-aligned visual field. These hexes never enter the game world. */
export default function EndlessSeabed() {
  const face = useRef<InstancedMesh>(null);
  const rim = useRef<InstancedMesh>(null);
  const lastCenter = useRef('');
  const dummy = useMemo(() => new Object3D(), []);
  const baseColor = useMemo(() => new Color('#35545b'), []);
  const paleColor = useMemo(() => new Color('#48676c'), []);
  const tileColor = useMemo(() => new Color(), []);

  useFrame(({ camera }) => {
    if (!face.current || !rim.current) return;
    const centerR = Math.round(camera.position.z / 1.5);
    const centerQ = Math.round(camera.position.x / SQRT_THREE - centerR / 2);
    const center = `${centerQ},${centerR}`;
    if (center === lastCenter.current) return;
    lastCenter.current = center;

    let index = 0;
    for (let q = centerQ - RADIUS; q <= centerQ + RADIUS; q++) {
      for (let r = centerR - RADIUS; r <= centerR + RADIUS; r++) {
        // Keep the playable island distinct, even as the decorative field moves.
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 3) continue;
        const edgeDistance = Math.max(Math.abs(q - centerQ), Math.abs(r - centerR));
        const fade = Math.min(1, Math.max(0.0001, (RADIUS - edgeDistance) / 5));
        const irregularity = variation(q, r);
        const top = -0.18 - irregularity * 0.025;
        const bottom = -0.29;
        const x = SQRT_THREE * (q + r / 2);
        const z = 1.5 * r;

        dummy.position.set(x, (top + bottom) / 2, z);
        dummy.scale.set(fade, top - bottom, fade);
        dummy.updateMatrix();
        face.current.setMatrixAt(index, dummy.matrix);
        tileColor.copy(baseColor).lerp(paleColor, irregularity * 0.25);
        face.current.setColorAt(index, tileColor);

        dummy.position.y -= 0.025;
        dummy.scale.set(fade, top - bottom + 0.045, fade);
        dummy.updateMatrix();
        rim.current.setMatrixAt(index, dummy.matrix);
        index++;
      }
    }

    face.current.count = index;
    rim.current.count = index;
    face.current.instanceMatrix.needsUpdate = true;
    if (face.current.instanceColor) face.current.instanceColor.needsUpdate = true;
    rim.current.instanceMatrix.needsUpdate = true;
  });

  return <>
    <instancedMesh ref={rim} args={[undefined, undefined, CAPACITY]} frustumCulled={false} raycast={() => null}>
      <cylinderGeometry args={[1.005, 1.005, 1, 6]} />
      <meshBasicMaterial color="#19343d" />
    </instancedMesh>
    <instancedMesh ref={face} args={[undefined, undefined, CAPACITY]} frustumCulled={false} raycast={() => null}>
      <cylinderGeometry args={[0.97, 0.97, 1, 6]} />
      <meshBasicMaterial color="white" />
    </instancedMesh>
  </>;
}
