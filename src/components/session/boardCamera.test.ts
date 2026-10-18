import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';

import { worldPosition } from '../../engine/world';

import { fitBoardCamera } from './boardCamera';

describe('board camera', () => {
  it.each([[320, 450], [900, 650]] as const)('keeps full hex footprints visible at %i × %i', (width, height) => {
    for (const radius of [2, 3, 5, 8]) {
      const { position, target } = fitBoardCamera(radius, width, height);
      const camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.copy(position);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      for (let q = -radius; q <= radius; q++) {
        for (let r = -radius; r <= radius; r++) {
          if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) > radius) continue;
          const [x, , z] = worldPosition(`${q},${r}`);
          for (let corner = 0; corner < 6; corner++) {
            const angle = Math.PI * corner / 3;
            const point = new Vector3(x + Math.cos(angle), 0.7, z + Math.sin(angle)).project(camera);
            expect(Math.abs(point.x), `radius ${radius}, tile ${q},${r}`).toBeLessThan(1);
            expect(Math.abs(point.y), `radius ${radius}, tile ${q},${r}`).toBeLessThan(1);
          }
        }
      }
    }
  });
});
