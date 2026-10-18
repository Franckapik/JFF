import { Vector3 } from 'three';

import { worldPosition } from '../../engine/world';

/** Frame every playable hex at the fixed scene angle, with room for tile edges. */
export function fitBoardCamera(radius: number, width: number, height: number): { position: Vector3; target: Vector3 } {
  const target = new Vector3(0, 0.85, 0);
  const direction = new Vector3(6.4, 8.45, 7.8).normalize();
  const right = new Vector3(direction.z, 0, -direction.x).normalize();
  const up = new Vector3().crossVectors(direction, right).normalize();
  const verticalTangent = Math.tan(Math.PI / 8);
  const horizontalTangent = verticalTangent * width / Math.max(1, height);
  let distance = 8;
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) > radius) continue;
      const [x, , z] = worldPosition(`${q},${r}`);
      const point = new Vector3(x, 0.7, z).sub(target);
      const depth = point.dot(direction);
      distance = Math.max(distance,
        depth + (Math.abs(point.dot(right)) + 1.1) / (horizontalTangent * 0.84),
        depth + (Math.abs(point.dot(up)) + 0.75) / (verticalTangent * 0.84));
    }
  }
  return { position: target.clone().addScaledVector(direction, distance), target };
}
