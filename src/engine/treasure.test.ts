import { describe, expect, it } from 'vitest';

import { emptyResources } from './resources';
import { RULES } from './rules';
import { createBot, GameSession } from './session';
import { chooseTreasureCoord } from './treasure';
import { revealedTileKind } from './visibility';
import { generateWorld, pathBetween, type Coord } from './world';

describe('unique treasure', () => {
  it('prefers a resource tile within one route step when the map has one', () => {
    for (const radius of [2, 3, 4, 5, 6, 7, 8]) for (let seed = 0; seed < 8; seed++) {
      const world = generateWorld(seed, radius);
      const bases: [Coord, Coord] = [`${-radius},0`, `${radius},0`];
      const coord = chooseTreasureCoord(world, bases, seed);
      expect(coord).not.toBeNull();
      expect(world[coord!].kind).toBe('resource');
      const distances = bases.map(base => pathBetween(world, base, coord!).length - 1);
      const alternatives = Object.values(world).filter(tile => tile.kind === 'resource').map(tile => {
        const routes = bases.map(base => pathBetween(world, base, tile.coord).length - 1);
        return { difference: Math.abs(routes[0] - routes[1]), nearest: Math.min(...routes) };
      });
      const balanced = alternatives.some(tile => tile.difference <= 1 && tile.nearest >= 2);
      if (balanced) expect(Math.abs(distances[0] - distances[1]), `seed ${seed}, radius ${radius}`).toBeLessThanOrEqual(1);
      else expect(Math.abs(distances[0] - distances[1])).toBe(Math.min(...alternatives.map(tile => tile.difference)));
      const session = new GameSession(seed, { radius });
      const snapshot = session.getSnapshot();
      expect(snapshot.treasure).toEqual({ status: 'hidden', coord: null, developerCoord: coord, owner: null });
      expect(Object.values(snapshot.world).filter(tile => tile.kind === 'treasure')).toHaveLength(1);
      expect(snapshot.world[coord!].kind).toBe('treasure');
      expect(snapshot.world[coord!].resources).toEqual(emptyResources());
      expect(revealedTileKind(snapshot.world[coord!], new Set([coord!]), new Set(), true)).toBe('terrain');
      expect(revealedTileKind(snapshot.world[coord!], new Set(), new Set([coord!]), true)).toBe('treasure');
      expect(revealedTileKind(snapshot.world[coord!], new Set(), new Set(), true, true)).toBe('treasure');
      session.stop();
    }
  });

  it('reveals on drone arrival, follows the discoverer through collection, and stays at its base', () => {
    const world = generateWorld(7, 3);
    for (const tile of Object.values(world)) {
      tile.resources = emptyResources();
      tile.level = 1;
      tile.walkable = true;
      if (tile.kind !== 'base') tile.kind = 'plain';
    }
    const target: Coord = '0,1';
    world[target].kind = 'resource';
    world[target].resources.food = 1;
    world['-2,0'].kind = 'resource';
    world['-2,0'].resources.food = 1;
    const bots = { 'bot-0': createBot('bot-0', world, 7), 'bot-1': createBot('bot-1', world, 7) };
    bots['bot-0'].coord = '0,0';
    bots['bot-0'].known = Object.values(world).map(tile => tile.coord).filter(coord => coord !== target);
    bots['bot-1'].damage = 100;
    const session = new GameSession(7, { world, bots });
    expect(chooseTreasureCoord(world, [bots['bot-0'].base, bots['bot-1'].base], 7)).toBe(target);
    expect(session.getSnapshot().world[target]).toMatchObject({ kind: 'treasure', resources: emptyResources() });
    session.advance(1);
    expect(session.getSnapshot().bots['bot-0'].operation).toMatchObject({ kind: 'scan', target });
    session.advance(RULES.stepDuration);
    let snapshot = session.getSnapshot();
    expect(snapshot.treasure).toEqual({ status: 'revealed', coord: target, developerCoord: target, owner: 'bot-0' });
    expect(snapshot.events.filter(event => event.type === 'treasure.revealed')).toHaveLength(1);
    for (let step = 0; step < 50 && session.getSnapshot().treasure.status !== 'deposited'; step++) session.advance(400);
    snapshot = session.getSnapshot();
    expect(snapshot.treasure).toEqual({ status: 'deposited', coord: target, developerCoord: target, owner: 'bot-0' });
    expect(snapshot.events.filter(event => event.type === 'treasure.collected')).toHaveLength(1);
    expect(snapshot.events.filter(event => event.type === 'treasure.deposited')).toHaveLength(1);
    expect(snapshot.events.find(event => event.type === 'collection.completed' && event.coord === target)?.resources).toEqual(emptyResources());
    expect(snapshot.bots['bot-0'].coord).toBe(snapshot.bots['bot-0'].base);
    expect(snapshot.bots['bot-0'].score).toBe(0);
    expect(snapshot.bots['bot-0'].deposited).toEqual(emptyResources());
    expect(snapshot.bots['bot-0'].harvested[target]).toBeUndefined();
    session.advance(5_000);
    expect(session.getSnapshot().treasure.status).toBe('deposited');
    session.assertInvariants();
    session.stop();
  });
});
