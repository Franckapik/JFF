import { describe, expect, it } from "vitest";

import type { Bot } from "./model";
import { depletedResourceCoords } from "./visibility";
import type { Coord, World } from "./world";

describe("depleted resource markers", () => {
  it("marks only harvested, exhausted resources visible to the current perspective", () => {
    const world = {} as World;
    for (const [coord, kind, food] of [
      ["0,0", "resource", 0],
      ["1,0", "resource", 0],
      ["2,0", "resource", 3],
      ["3,0", "empty", 0],
    ] as const) {
      world[coord] = { coord, kind, walkable: true, neighbors: [], resources: { food, debris: 0, special: 0 }, owner: null };
    }
    const bots: Pick<Bot, "harvested">[] = [
      { harvested: { "0,0": { food: 3, debris: 0, special: 0 }, "2,0": { food: 2, debris: 0, special: 0 }, "3,0": { food: 1, debris: 0, special: 0 } } },
    ];
    const all = Object.keys(world) as Coord[];

    expect(depletedResourceCoords(world, bots, all, all)).toEqual(["0,0"]);
    expect(depletedResourceCoords(world, bots, all, [])).toEqual([]);
    expect(depletedResourceCoords(world, bots, ["1,0"], all)).toEqual([]);
  });
});
