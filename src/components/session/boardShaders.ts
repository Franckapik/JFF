// This shader is added to the instanced tile material. Its coordinates follow
// the hexagons, keeping pencil strokes attached while the camera orbits.
export function sketchTileShader(shader: { vertexShader: string; fragmentShader: string }): void {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vInkPosition;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvInkPosition = (instanceMatrix * vec4(position, 1.0)).xyz;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vInkPosition;')
    .replace('#include <color_fragment>', `#include <color_fragment>
      float paperGrain = fract(sin(dot(floor(vInkPosition.xz * 170.0), vec2(12.9898, 78.233))) * 43758.5453);
      float inkValue = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11));
      float hatch = 1.0 - smoothstep(0.025, 0.095, abs(fract((vInkPosition.x + vInkPosition.z * 0.72) * 7.0) - 0.5));
      float crossHatch = 1.0 - smoothstep(0.025, 0.095, abs(fract((vInkPosition.x - vInkPosition.z * 0.8) * 6.0) - 0.5));
      float shade = smoothstep(0.28, 0.78, 1.0 - inkValue);
      diffuseColor.rgb *= 0.955 + paperGrain * 0.08 - shade * (hatch * 0.17 + crossHatch * 0.09);
    `);
}
