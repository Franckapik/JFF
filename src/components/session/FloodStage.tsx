/* eslint-disable react/no-unknown-property -- Three.js props are supplied through React Three Fiber */
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DoubleSide, Group, InstancedMesh, Mesh, Object3D, Quaternion, ShaderMaterial, Vector3 } from 'three';

import { terrainDeckHeight } from '../../engine/terrainPresentation';
import { BOT_IDS, worldPosition, worldRadius, type BotId, type Coord, type World } from '../../engine/world';

import { BOT_COLORS } from './presentation';

const TIDE_LOW = -0.12;
const TIDE_HIGH = 0.82;
const CENTER_TOP = terrainDeckHeight('0,0');
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

function Beam({ from, to, radius = 0.035, color = '#d3bb8b' }: {
  from: [number, number, number]; to: [number, number, number]; radius?: number; color?: string;
}) {
  const start = new Vector3(...from);
  const end = new Vector3(...to);
  const direction = end.clone().sub(start);
  const center = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={center} quaternion={quaternion} castShadow>
    <cylinderGeometry args={[radius, radius, direction.length(), 8]} />
    <meshStandardMaterial color={color} metalness={0.55} roughness={0.42} />
  </mesh>;
}

function Nacelle({ id, x, y }: { id: BotId; x: number; y: number }) {
  const color = BOT_COLORS[id];
  return <group position={[x, y, 0]}>
    <mesh position={[0, -0.18, 0]} castShadow>
      <cylinderGeometry args={[0.28, 0.22, 0.18, 10]} />
      <meshStandardMaterial color={color} metalness={0.42} roughness={0.3} emissive={color} emissiveIntensity={0.14} />
    </mesh>
    <mesh position={[0, 0.02, 0]} castShadow>
      <sphereGeometry args={[0.27, 16, 12]} />
      <meshStandardMaterial color="#dbe8e0" metalness={0.22} roughness={0.15} transparent opacity={0.57} />
    </mesh>
    <mesh position={[0, 0.02, 0]}>
      <octahedronGeometry args={[0.13]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.3} />
    </mesh>
    <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.29, 0.025, 7, 20]} />
      <meshStandardMaterial color="#f5d9a0" metalness={0.55} roughness={0.33} />
    </mesh>
  </group>;
}

function RefugeTower({ paused, onSelect }: { paused: boolean; onSelect: (coord: Coord) => void }) {
  const crown = useRef<Group>(null);
  const beacon = useRef<Mesh>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!paused) time.current += delta;
    if (crown.current) {
      crown.current.rotation.z = Math.sin(time.current * 0.7) * 0.018;
      crown.current.rotation.x = Math.sin(time.current * 0.47 + 1) * 0.012;
    }
    if (beacon.current) beacon.current.rotation.y = time.current * 0.38;
  });

  const posts: [number, number][] = [[-0.37, -0.35], [0.37, -0.35], [-0.37, 0.35], [0.37, 0.35]];
  return <group position={[0, CENTER_TOP, 0]} scale={[1.3, 1.26, 1.3]} onClick={event => { event.stopPropagation(); onSelect('0,0'); }}>
    <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[0.73, 0.83, 0.16, 6]} />
      <meshStandardMaterial color="#e7d8b8" roughness={0.78} />
    </mesh>
    <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.66, 0.035, 6, 6]} />
      <meshStandardMaterial color="#b99061" metalness={0.42} roughness={0.48} />
    </mesh>
    <group ref={crown}>
      {posts.map(([x, z], index) => <Beam key={`post-${index}`} from={[x, 0.13, z]} to={[x * 0.86, 2.3, z * 0.86]} radius={0.052} />)}
      {[-0.35, 0.35].map((z, index) => <group key={z}>
        <Beam from={[-0.37, 0.26, z]} to={[0.34, 1.17, z * 0.9]} radius={0.024} color="#9eaa9a" />
        <Beam from={[0.37, 0.26, z]} to={[-0.34, 1.17, z * 0.9]} radius={0.024} color="#9eaa9a" />
        <Beam from={[-0.34, 1.2, z * 0.9]} to={[0.32, 2.12, z * 0.86]} radius={0.024} color="#9eaa9a" />
        <Beam from={[0.34, 1.2, z * 0.9]} to={[-0.32, 2.12, z * 0.86]} radius={0.024} color="#9eaa9a" />
        {index === 0 && <Beam from={[-1.28, 2.36, 0]} to={[1.28, 2.36, 0]} radius={0.07} color="#d9c297" />}
      </group>)}
      {[0.75, 1.48, 2.28].map((height, index) => <mesh key={height} position={[0, height, 0]} castShadow>
        <cylinderGeometry args={[index === 2 ? 0.55 : 0.49, 0.54, 0.08, 6]} />
        <meshStandardMaterial color={index === 2 ? '#e8d9b5' : '#849f98'} metalness={0.2} roughness={0.7} />
      </mesh>)}
      {BOT_IDS.map((id, index) => {
        const x = index === 0 ? -0.94 : 0.94;
        const y = index === 0 ? 1.76 : 1.56;
        return <group key={id}>
          <Beam from={[x, 2.36, 0]} to={[x, y + 0.27, 0]} radius={0.012} color="#e9d6b2" />
          <Nacelle id={id} x={x} y={y} />
          <mesh position={[x, 2.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.37, 0.025, 6, 24]} />
            <meshBasicMaterial color={BOT_COLORS[id]} transparent opacity={0.75} />
          </mesh>
        </group>;
      })}
      <Beam from={[0, 2.3, 0]} to={[0, 2.8, 0]} radius={0.04} />
      <mesh ref={beacon} position={[0, 2.9, 0]}>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial color="#fff0bd" emissive="#f7d080" emissiveIntensity={1.9} metalness={0.18} roughness={0.26} />
      </mesh>
      <pointLight position={[0, 2.75, 0]} color="#e9c778" intensity={1.3} distance={4.5} decay={2} />
    </group>
  </group>;
}

export default function FloodStage({ world, highTide, paused, onSelect }: { world: World; highTide: boolean; paused: boolean; onSelect: (coord: Coord) => void }) {
  const water = useRef<Mesh>(null);
  const seabed = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const shoreline = useRef<InstancedMesh>(null);
  const shorelineDummy = useMemo(() => new Object3D(), []);
  const coords = useMemo(() => Object.keys(world) as Coord[], [world]);
  const coastOffset = (worldRadius(world) - 3) * SQRT_THREE;
  const phase = useRef(0.08);
  const level = useRef(TIDE_LOW);
  useFrame(({ camera }, delta) => {
    if (!paused && !highTide) phase.current += delta / 28;
    const cycle = 0.5 - 0.5 * Math.cos(phase.current * Math.PI * 2);
    const target = highTide ? TIDE_HIGH : TIDE_LOW + (TIDE_HIGH - TIDE_LOW) * cycle;
    level.current += (target - level.current) * Math.min(1, delta * 2.5);
    if (water.current) water.current.position.set(camera.position.x, level.current, camera.position.z);
    if (seabed.current) seabed.current.position.set(camera.position.x, -0.27, camera.position.z);
    if (material.current) {
      material.current.uniforms.uLevel.value = level.current;
      if (!paused) material.current.uniforms.uTime.value += delta;
    }
    if (shoreline.current) {
      coords.forEach((coord, index) => {
        const [x, , z] = worldPosition(coord);
        const distance = Math.abs(terrainDeckHeight(coord) - level.current);
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
    <RefugeTower paused={paused} onSelect={onSelect} />
  </>;
}
