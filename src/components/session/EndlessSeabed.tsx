/* eslint-disable react/no-unknown-property -- Three.js props are supplied through React Three Fiber */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, InstancedMesh, MeshBasicMaterial, MeshStandardMaterial, Object3D } from 'three';

import { TERRAIN_BOTTOM } from '../../engine/terrainPresentation';
import { TERRAIN_BASE_TOP, TERRAIN_LEVEL_STEP, type Coord, type World } from '../../engine/world';

import { sketchTileShader } from './boardShaders';

const RADIUS = 29;
const CAPACITY = (RADIUS * 2 + 1) ** 2;
const SQRT_THREE = Math.sqrt(3);
const LAND_LEVELS = [0, 1, 2] as const;

function variation(q: number, r: number): number {
  const value = Math.sin(q * 127.1 + r * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** A camera-following, world-aligned visual field. These hexes never enter the game world. */
export default function EndlessSeabed({ radius, world, waterLevel }: { radius: number; world: World; waterLevel: number }) {
  const face = useRef<InstancedMesh>(null);
  const rim = useRef<InstancedMesh>(null);
  const landFaces = useRef<(InstancedMesh | null)[]>([]);
  const landRims = useRef<(InstancedMesh | null)[]>([]);
  const landFaceMaterials = useRef<(MeshStandardMaterial | null)[]>([]);
  const landRimMaterials = useRef<(MeshBasicMaterial | null)[]>([]);
  const lastCenter = useRef('');
  const dummy = useMemo(() => new Object3D(), []);
  const baseColor = useMemo(() => new Color('#35545b'), []);
  const paleColor = useMemo(() => new Color('#48676c'), []);
  const tileColor = useMemo(() => new Color(), []);
  const landColor = useMemo(() => new Color(), []);
  const landPale = useMemo(() => new Color('#5c6866'), []);
  const coast = useMemo(() => Object.values(world).filter(tile => tile.kind === 'empty').map(tile => tile.coord).join('|'), [world]);

  useFrame(({ camera }) => {
    if (!face.current || !rim.current || LAND_LEVELS.some(level =>
      !landFaces.current[level] || !landRims.current[level] || !landFaceMaterials.current[level] || !landRimMaterials.current[level]
    )) return;

    LAND_LEVELS.forEach(level => {
      const top = TERRAIN_BASE_TOP + level * TERRAIN_LEVEL_STEP;
      const opacity = Math.max(0, Math.min(1, (top - waterLevel + 0.03) / 0.18));
      landFaceMaterials.current[level]!.opacity = opacity;
      landRimMaterials.current[level]!.opacity = opacity;
      landFaceMaterials.current[level]!.depthWrite = opacity >= 0.99;
      landRimMaterials.current[level]!.depthWrite = opacity >= 0.99;
      landFaces.current[level]!.visible = opacity > 0.01;
      landRims.current[level]!.visible = opacity > 0.01;
    });

    const centerR = Math.round(camera.position.z / 1.5);
    const centerQ = Math.round(camera.position.x / SQRT_THREE - centerR / 2);
    const center = `${centerQ},${centerR}:${radius}:${coast}`;
    if (center === lastCenter.current) return;
    lastCenter.current = center;

    let index = 0;
    const landCounts = [0, 0, 0];
    for (let q = centerQ - RADIUS; q <= centerQ + RADIUS; q++) {
      for (let r = centerR - RADIUS; r <= centerR + RADIUS; r++) {
        // Keep the playable island distinct, even as the decorative field moves.
        const coord: Coord = `${q},${r}`;
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= radius && world[coord]?.kind !== 'empty') continue;
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

        // Clusters of uncharted hexes repeat in world space, but never enter the game world.
        const cellQ = Math.floor(q / 5);
        const cellR = Math.floor(r / 5);
        const seed = variation(cellQ * 7, cellR * 7);
        const reefQ = cellQ * 5 + 1 + Math.floor(variation(cellQ * 11, cellR * 13) * 3);
        const reefR = cellR * 5 + 1 + Math.floor(variation(cellQ * 17, cellR * 19) * 3);
        const localQ = q - reefQ;
        const localR = r - reefR;
        const reefDistance = Math.max(Math.abs(localQ), Math.abs(localR), Math.abs(localQ + localR));
        const mapDistance = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
        if (mapDistance <= radius || seed < 0.48 || fade < 0.15 ||
          (reefDistance > 0 && (reefDistance > 1 || seed < 0.65 || variation(q + 8, r + 3) < 0.28))) continue;

        const heightVariation = variation(q + 21, r - 17);
        const level = reefDistance === 0 || heightVariation > 0.68 ? 2 : heightVariation > 0.2 ? 1 : 0;
        const landIndex = landCounts[level]++;
        const landTop = TERRAIN_BASE_TOP + level * TERRAIN_LEVEL_STEP;
        const landHeight = landTop - TERRAIN_BOTTOM;
        dummy.position.set(x, TERRAIN_BOTTOM + landHeight / 2, z);
        dummy.scale.set(fade, landHeight, fade);
        dummy.updateMatrix();
        landFaces.current[level]!.setMatrixAt(landIndex, dummy.matrix);
        landColor.set('#394c50').lerp(landPale, variation(q - 11, r + 9) * 0.43);
        landFaces.current[level]!.setColorAt(landIndex, landColor);

        dummy.position.y -= 0.045;
        dummy.scale.y = landHeight + 0.08;
        dummy.updateMatrix();
        landRims.current[level]!.setMatrixAt(landIndex, dummy.matrix);
      }
    }

    face.current.count = index;
    rim.current.count = index;
    face.current.instanceMatrix.needsUpdate = true;
    if (face.current.instanceColor) face.current.instanceColor.needsUpdate = true;
    rim.current.instanceMatrix.needsUpdate = true;
    LAND_LEVELS.forEach(level => {
      const landFace = landFaces.current[level]!;
      const landRim = landRims.current[level]!;
      landFace.count = landCounts[level];
      landRim.count = landCounts[level];
      landFace.instanceMatrix.needsUpdate = true;
      if (landFace.instanceColor) landFace.instanceColor.needsUpdate = true;
      landRim.instanceMatrix.needsUpdate = true;
    });
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
    {LAND_LEVELS.map(level => <group key={level}>
      <instancedMesh ref={instance => { landRims.current[level] = instance; }} args={[undefined, undefined, CAPACITY]} frustumCulled={false} renderOrder={1} raycast={() => null}>
        <cylinderGeometry args={[1.015, 1.015, 1, 6]} />
        <meshBasicMaterial ref={material => { landRimMaterials.current[level] = material; }} color="#263b41" transparent depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={instance => { landFaces.current[level] = instance; }} args={[undefined, undefined, CAPACITY]} frustumCulled={false} renderOrder={2} raycast={() => null}>
        <cylinderGeometry args={[0.96, 0.96, 1, 6]} />
        <meshStandardMaterial ref={material => { landFaceMaterials.current[level] = material; }} color="white" roughness={1} metalness={0} transparent depthWrite={false} onBeforeCompile={sketchTileShader} />
      </instancedMesh>
    </group>)}
  </>;
}
