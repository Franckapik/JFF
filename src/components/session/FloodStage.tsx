/* eslint-disable react/no-unknown-property -- Three.js props are supplied through React Three Fiber */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, Group, InstancedMesh, Mesh, Object3D, ShaderMaterial } from 'three';

import { terrainDeckHeight, TERRAIN_BASE_TOP, TERRAIN_LEVEL_STEP } from '../../engine/terrainPresentation';
import { TIDE_LOW } from '../../engine/tide';
import { worldPosition, worldRadius, type Coord, type World } from '../../engine/world';

const CENTER_TOP = TERRAIN_BASE_TOP + 5 * TERRAIN_LEVEL_STEP;
const SQRT_THREE = Math.sqrt(3);

const WATER_VERTEX = `
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying float vCrest;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec2 p = world.xz;
    vec2 d1 = normalize(vec2(0.91, 0.41));
    vec2 d2 = normalize(vec2(-0.38, 0.92));
    vec2 d3 = normalize(vec2(0.74, -0.67));
    float a = dot(p, d1) * 1.15 - uTime * 0.82;
    float b = dot(p, d2) * 1.83 - uTime * 1.14;
    float c = dot(p, d3) * 2.75 - uTime * 1.72;
    float height = 0.060 * sin(a) + 0.033 * sin(b) + 0.016 * sin(c);
    vec2 slope = 0.060 * 1.15 * cos(a) * d1
      + 0.033 * 1.83 * cos(b) * d2
      + 0.016 * 2.75 * cos(c) * d3;
    world.y += height;
    vWorldPosition = world.xyz;
    vWorldNormal = normalize(vec3(-slope.x, 1.0, -slope.y));
    vCrest = 0.58 * sin(a) + 0.29 * sin(b) + 0.13 * sin(c);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const WATER_FRAGMENT = `
  uniform float uTime;
  uniform float uLevel;
  uniform float uCoastOffset;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying float vCrest;

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(cell + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(cell + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(cell + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 p = vWorldPosition.xz;
    float brokenSurface = noise(p * 0.78 + vec2(uTime * 0.07, -uTime * 0.12));
    float finerSurface = noise(p * 2.4 - vec2(uTime * 0.24, uTime * 0.18));
    vec2 rippleSlope = vec2(
      cos(dot(p, vec2(0.86, 0.50)) * 5.8 - uTime * 1.9),
      cos(dot(p, vec2(-0.57, 0.82)) * 6.9 - uTime * 2.3)
    ) * 0.025;
    vec3 normal = normalize(vWorldNormal + vec3(rippleSlope.x, 0.0, rippleSlope.y));
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 sunDirection = normalize(vec3(-0.42, 0.9, -0.38));
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.4);
    float glint = pow(max(dot(reflect(-sunDirection, normal), viewDirection), 0.0), 86.0);
    float distanceFromIsland = length(p);
    float openSea = smoothstep(3.5 + uCoastOffset, 13.0 + uCoastOffset, distanceFromIsland);
    vec3 shallow = vec3(0.16, 0.42, 0.47);
    vec3 deep = vec3(0.045, 0.22, 0.30);
    vec3 color = mix(shallow, deep, openSea * 0.67);
    color += (brokenSurface - 0.5) * vec3(0.065, 0.105, 0.11);
    color += (finerSurface - 0.5) * vec3(0.014, 0.025, 0.026);
    color = mix(color, vec3(0.38, 0.63, 0.66), fresnel * 0.38);
    color += vec3(0.38, 0.48, 0.46) * glint * (0.15 + finerSurface * 0.23);
    float foam = smoothstep(0.68, 0.94, vCrest + (brokenSurface - 0.5) * 0.28);
    color = mix(color, vec3(0.65, 0.78, 0.75), foam * 0.14);
    float farFromIsland = smoothstep(4.2 + uCoastOffset, 8.5 + uCoastOffset, distanceFromIsland);
    float highWater = smoothstep(-0.12, 0.82, uLevel);
    float alpha = mix(0.48, 0.72, farFromIsland) + highWater * mix(0.12, 0.15, farFromIsland);
    gl_FragColor = vec4(color, alpha);
  }
`;

const BEAM_VERTEX = `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const BEAM_FRAGMENT = `
  varying vec3 vLocal;
  void main() {
    float reach = clamp((vLocal.x + 6.0) / 12.0, 0.0, 1.0);
    float width = mix(0.16, 2.35, reach);
    float feather = 1.0 - smoothstep(0.28, 1.0, abs(vLocal.y) / width);
    float alpha = feather * (1.0 - smoothstep(0.12, 1.0, reach)) * 0.17;
    gl_FragColor = vec4(1.0, 0.83, 0.55, alpha);
  }
`;

function OldLighthouse({ paused, onSelect }: { paused: boolean; onSelect: (coord: Coord) => void }) {
  const lantern = useRef<Group>(null);
  const target = useMemo(() => new Object3D(), []);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!paused) time.current += delta;
    if (lantern.current) lantern.current.rotation.y = time.current * 0.16;
  });

  return <group position={[0, CENTER_TOP, 0]} onClick={event => { event.stopPropagation(); onSelect('0,0'); }}>
    <mesh position={[0, 0.09, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[0.68, 0.76, 0.18, 10]} />
      <meshStandardMaterial color="#a6a997" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, 1.29, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.34, 0.62, 2.35, 12]} />
      <meshStandardMaterial color="#d7cdb2" roughness={0.95} flatShading />
    </mesh>
    {[0.44, 1.08, 1.73, 2.38].map((height, index) => <mesh key={height} position={[0, height, 0]} castShadow>
      <cylinderGeometry args={[0.61 - index * 0.074, 0.63 - index * 0.074, 0.11, 12]} />
      <meshStandardMaterial color={index % 2 === 0 ? '#b6a88e' : '#8f9b91'} roughness={0.93} flatShading />
    </mesh>)}
    {[0, Math.PI * 2 / 3, Math.PI * 4 / 3].map((angle, index) => <group key={index} rotation={[0, angle, 0]}>
      <mesh position={[0, 1.83, 0.395]}>
        <boxGeometry args={[0.15, 0.29, 0.035]} />
        <meshStandardMaterial color="#40595b" roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.99, 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.076, 0.018, 6, 10, Math.PI]} />
        <meshStandardMaterial color="#d7c7a4" roughness={0.95} />
      </mesh>
    </group>)}
    <mesh position={[0, 2.5, 0]} castShadow>
      <cylinderGeometry args={[0.59, 0.45, 0.15, 12]} />
      <meshStandardMaterial color="#788a84" metalness={0.35} roughness={0.69} />
    </mesh>
    <mesh position={[0, 2.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.58, 0.025, 7, 24]} />
      <meshStandardMaterial color="#665f50" metalness={0.35} roughness={0.75} />
    </mesh>
    {Array.from({ length: 10 }, (_, index) => {
      const angle = index * Math.PI / 5;
      return <mesh key={index} position={[Math.cos(angle) * 0.57, 2.78, Math.sin(angle) * 0.57]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 5]} />
        <meshStandardMaterial color="#625d50" metalness={0.4} roughness={0.72} />
      </mesh>;
    })}
    <mesh position={[0, 2.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.57, 0.023, 7, 24]} />
      <meshStandardMaterial color="#625d50" metalness={0.4} roughness={0.72} />
    </mesh>
    <mesh position={[0, 2.99, 0]}>
      <cylinderGeometry args={[0.39, 0.39, 0.64, 12]} />
      <meshStandardMaterial color="#afc1b6" metalness={0.1} roughness={0.32} transparent opacity={0.38} depthWrite={false} />
    </mesh>
    {Array.from({ length: 8 }, (_, index) => {
      const angle = index * Math.PI / 4;
      return <mesh key={index} position={[Math.cos(angle) * 0.39, 2.99, Math.sin(angle) * 0.39]}>
        <cylinderGeometry args={[0.022, 0.022, 0.66, 6]} />
        <meshStandardMaterial color="#5f6962" metalness={0.45} roughness={0.62} />
      </mesh>;
    })}
    <mesh position={[0, 3.39, 0]} castShadow>
      <coneGeometry args={[0.55, 0.33, 12]} />
      <meshStandardMaterial color="#60736e" roughness={0.68} metalness={0.28} />
    </mesh>
    <mesh position={[0, 3.6, 0]}>
      <sphereGeometry args={[0.065, 8, 6]} />
      <meshStandardMaterial color="#b89e6f" metalness={0.65} roughness={0.4} />
    </mesh>
    <group ref={lantern} position={[0, 2.98, 0]}>
      <primitive object={target} position={[12, -4, 0]} />
      <mesh>
        <sphereGeometry args={[0.19, 12, 8]} />
        <meshBasicMaterial color="#fff0bc" toneMapped={false} />
      </mesh>
      <pointLight color="#ffdb8a" intensity={2.5} distance={5} decay={2} />
      <spotLight color="#ffdf9a" intensity={48} distance={18} decay={1.5} angle={0.23} penumbra={0.8} target={target} />
      <group rotation={[0, 0, -0.32]}>
        {[0, -0.22].map((height, index) => <mesh key={index} position={[6, height, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={7 + index} raycast={() => null}>
          <planeGeometry args={[12, 5]} />
          <shaderMaterial vertexShader={BEAM_VERTEX} fragmentShader={BEAM_FRAGMENT} transparent depthWrite={false} side={DoubleSide} />
        </mesh>)}
      </group>
    </group>
  </group>;
}

export default function FloodStage({ world, waterLevel, paused, onSelect }: { world: World; waterLevel: number; paused: boolean; onSelect: (coord: Coord) => void }) {
  const water = useRef<Mesh>(null);
  const seabed = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const shoreline = useRef<InstancedMesh>(null);
  const shorelineDummy = useMemo(() => new Object3D(), []);
  const coords = useMemo(() => Object.values(world).filter(tile => tile.kind !== 'empty').map(tile => tile.coord), [world]);
  const coastOffset = (worldRadius(world) - 3) * SQRT_THREE;
  const level = useRef(waterLevel);
  useFrame(({ camera }, delta) => {
    level.current = waterLevel;
    if (water.current) water.current.position.set(camera.position.x, level.current, camera.position.z);
    if (seabed.current) seabed.current.position.set(camera.position.x, -0.27, camera.position.z);
    if (material.current) {
      material.current.uniforms.uLevel.value = level.current;
      if (!paused) material.current.uniforms.uTime.value += delta;
    }
    if (shoreline.current) {
      coords.forEach((coord, index) => {
        const [x, , z] = worldPosition(coord);
        const distance = Math.abs(terrainDeckHeight(world, coord) - level.current);
        shorelineDummy.position.set(x, level.current + 0.025, z);
        shorelineDummy.rotation.set(-Math.PI / 2, 0, 0);
        shorelineDummy.scale.setScalar(distance < 0.13 ? 1 : 0.0001);
        shorelineDummy.updateMatrix();
        shoreline.current!.setMatrixAt(index, shorelineDummy.matrix);
      });
      shoreline.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <>
    <mesh ref={seabed} position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <planeGeometry args={[240, 240]} />
      <meshBasicMaterial color="#0e3540" />
    </mesh>
    <mesh ref={water} position={[0, TIDE_LOW, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3} raycast={() => null}>
      <planeGeometry args={[128, 128, 160, 160]} />
      <shaderMaterial ref={material} vertexShader={WATER_VERTEX} fragmentShader={WATER_FRAGMENT}
        uniforms={{ uTime: { value: 0 }, uLevel: { value: TIDE_LOW }, uCoastOffset: { value: coastOffset } }} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
    <instancedMesh ref={shoreline} args={[undefined, undefined, coords.length]} renderOrder={4} raycast={() => null}>
      <ringGeometry args={[0.93, 0.98, 6]} />
      <meshBasicMaterial color="#b9e9dc" transparent opacity={0.64} depthWrite={false} side={DoubleSide} />
    </instancedMesh>
    <OldLighthouse paused={paused} onSelect={onSelect} />
  </>;
}
