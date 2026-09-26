import type { Resources } from './resources';

export const RULES = {
  capacity: { food: 200, debris: 1800, special: 3 } satisfies Resources,
  mapRadius: 3,
  maxExplorationRadius: 3,
  upgradePrices: { 1: 50, 2: 100 } as Record<number, number>,
  dronePrice: 50,
  fuelCapacity: 100,
  fuelPerStep: 1,
  dangerDamage: 10,
  repairThreshold: 50,
  fuelReserve: 3,
  fuelUrgencyThreshold: 20,
  stationFuelThreshold: 30,
  stepDuration: 400,
  scanDuration: 800,
  collectDuration: 1000,
  serviceDuration: 1200,
  purchaseDuration: 1000,
  rescueDuration: 5000,
  maxLogEntries: 120,
} as const;