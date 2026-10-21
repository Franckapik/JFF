/* eslint-disable react/no-unknown-property -- React Three Fiber shader uniforms */
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { DoubleSide, Vector2 } from 'three';

import { effectiveRadius } from '../../engine/visibility';
import { worldPosition } from '../../engine/world';
import type { BotView } from '../../engine/model';

const VERTEX = `
  varying vec2 vWorldXZ;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldXZ = world.xz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FRAGMENT = `
  uniform vec2 uCenter;
  uniform float uRadius;
  uniform float uTime;
  uniform float uLayer;
  varying vec2 vWorldXZ;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    vec2 offset = vWorldXZ - uCenter;
    float r = offset.y / 1.5;
    float q = offset.x / 1.7320508 - r * 0.5;
    float hexRadius = max(max(abs(q), abs(r)), abs(q + r));
    vec2 drift = vec2(uTime * (0.035 + uLayer * 0.016), -uTime * 0.023);
    float broad = noise(vWorldXZ * 0.14 + drift + uLayer * 7.1);
    float detail = noise(vWorldXZ * 0.39 - drift * 1.4 + uLayer * 3.7);
    float fold = broad * 0.7 + detail * 0.3;
    float boundary = smoothstep(uRadius - 0.35, uRadius + 1.25, hexRadius + (fold - 0.5) * 0.8);
    float shore = exp(-pow((hexRadius - uRadius - 0.35) * 0.92, 2.0));
    float alpha = boundary * (0.09 + fold * 0.18) + shore * (0.075 + fold * 0.055);
    alpha *= uLayer < 0.5 ? 1.0 : 0.72;
    vec3 color = mix(vec3(0.33, 0.51, 0.52), vec3(0.67, 0.75, 0.70), fold * 0.65 + shore * 0.18);
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Two moving translucent sheets create depth without changing what the bot knows. */
export default function VisionMist({ bot, paused }: { bot: BotView; paused: boolean }) {
  const [x, , z] = worldPosition(bot.coord);
  const radius = effectiveRadius(bot);
  const uniforms = useMemo(() => ({
    uCenter: { value: new Vector2() },
    uRadius: { value: 0 },
    uTime: { value: 0 },
    uLayer: { value: 0 },
  }), []);
  const upperUniforms = useMemo(() => ({
    uCenter: { value: uniforms.uCenter.value },
    uRadius: { value: 0 },
    uTime: { value: 0 },
    uLayer: { value: 1 },
  }), [uniforms]);
  useFrame((_, delta) => {
    uniforms.uCenter.value.set(x, z);
    uniforms.uRadius.value = radius;
    upperUniforms.uRadius.value = radius;
    if (!paused) {
      uniforms.uTime.value += delta;
      upperUniforms.uTime.value += delta;
    }
  });

  return <>
    <mesh position={[x, 0.95, z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5} raycast={() => null}>
      <planeGeometry args={[160, 160]} />
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
    <mesh position={[x, 1.75, z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6} raycast={() => null}>
      <planeGeometry args={[160, 160]} />
      <shaderMaterial vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={upperUniforms} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
  </>;
}
