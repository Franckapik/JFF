import { describe, expect, it } from 'vitest';

import { PhysicsPlaygroundWorld } from './physicsPlayground';
import { terrainDeckHeight } from './terrainPresentation';
import { generateWorld, worldPosition, type Coord } from './world';

describe('Rapier playground on the existing hex board', () => {
  it('keeps a stack on the board, then lets a projectile knock it over', async () => {
    const tiles = generateWorld(42, 3);
    const coord: Coord = '0,0';
    const playground = await PhysicsPlaygroundWorld.create(tiles, coord);
    try {
      for (let frame = 0; frame < 120; frame++) playground.step(1 / 60);
      const blocks = playground.objects.filter(item => item.shape === 'block');
      const [centerX, , centerZ] = worldPosition(coord);
      const before = blocks.map(item => item.body.translation());
      expect(blocks).toHaveLength(6);
      expect(before.every(position => position.y > 0 && Math.hypot(position.x - centerX, position.z - centerZ) < 1)).toBe(true);

      playground.launch();
      for (let frame = 0; frame < 180; frame++) playground.step(1 / 60);
      const moved = blocks.some((item, index) => {
        const position = item.body.translation();
        return Math.hypot(position.x - before[index].x, position.z - before[index].z) > 0.35;
      });
      expect(moved).toBe(true);
      expect(playground.objects.some(item => item.shape === 'ball')).toBe(true);
    } finally {
      playground.free();
    }
  });

  it('lets a moving bot push loose crates across its next tile', async () => {
    const tiles = generateWorld(42, 3);
    const playground = await PhysicsPlaygroundWorld.create(tiles, '0,0');
    try {
      const from = worldPosition('-3,0');
      const to = worldPosition('-2,0');
      const botHeight = terrainDeckHeight(tiles, '-2,0') + 0.28;
      playground.dropCrates('-2,0', tiles);
      const crates = playground.objects.filter(item => item.purpose === 'route');
      for (let frame = 0; frame < 45; frame++) {
        playground.syncBot('bot-0', { x: from[0], y: botHeight, z: from[2], heading: Math.PI / 2 });
        playground.step(1 / 60);
      }
      const before = crates.map(item => item.body.translation());
      for (let frame = 0; frame <= 90; frame++) {
        const progress = frame / 90;
        playground.syncBot('bot-0', { x: from[0] + (to[0] - from[0]) * progress, y: botHeight, z: from[2], heading: Math.PI / 2 });
        playground.step(1 / 60);
      }
      expect(crates.some((item, index) => {
        const position = item.body.translation();
        return Math.hypot(position.x - before[index].x, position.z - before[index].z) > 0.35;
      })).toBe(true);
      expect(playground.impactCounts['bot-0']).toBeGreaterThan(0);
    } finally {
      playground.free();
    }
  });
});
