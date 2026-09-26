export const RESOURCE_KINDS = ['food', 'debris', 'special'] as const;
export type ResourceKind = typeof RESOURCE_KINDS[number];
export type Resources = Record<ResourceKind, number>;

export function emptyResources(): Resources {
  return { food: 0, debris: 0, special: 0 };
}

export function resourceTotal(resources: Resources): number {
  return RESOURCE_KINDS.reduce((total, kind) => total + resources[kind], 0);
}

export function addResources(left: Resources, right: Resources): Resources {
  return { food: left.food + right.food, debris: left.debris + right.debris, special: left.special + right.special };
}

export function transferResources(stock: Resources, cargo: Resources, capacity: Resources) {
  const taken = emptyResources();
  const remaining = emptyResources();
  const loaded = emptyResources();
  for (const kind of RESOURCE_KINDS) {
    if (![stock[kind], cargo[kind], capacity[kind]].every(value => Number.isSafeInteger(value) && value >= 0) || cargo[kind] > capacity[kind]) {
      throw new Error(`Invalid resource quantity: ${kind}`);
    }
    taken[kind] = Math.min(stock[kind], capacity[kind] - cargo[kind]);
    remaining[kind] = stock[kind] - taken[kind];
    loaded[kind] = cargo[kind] + taken[kind];
  }
  return { taken, remaining, cargo: loaded };
}