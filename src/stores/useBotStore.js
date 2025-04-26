import { create } from "zustand";

const useBotStore = create((set, get) => ({
  state: "idle", // Initial state of the bot
  transitions: {
    idle: ["exploring", "refueling", "repairing"],
    exploring: ["idle", "refueling", "repairing"],
    refueling: ["idle", "exploring"],
    repairing: ["idle", "exploring"],
  },
  actions: {
    explore: (tiles) => {
      const botState = get();
      if (botState.state !== "exploring") return;

      // Avoid updating if targetTile is already set
      if (botState.targetTile) return;

      // Logic to find the nearest resource tile
      const resourceTile = Object.values(tiles).find((tile) => tile.resources && !tile.collected);
      if (resourceTile) {
        set({ targetTile: resourceTile.coord });
      }
    },
    refuel: (tiles) => {
      const botState = get();
      if (botState.state !== "refueling") return;

      // Avoid updating if targetTile is already set
      if (botState.targetTile) return;

      // Logic to find the nearest fuel tile
      const fuelTile = Object.values(tiles).find((tile) => tile.type === "fuel");
      if (fuelTile) {
        set({ targetTile: fuelTile.coord });
      }
    },
    repair: (tiles) => {
      const botState = get();
      if (botState.state !== "repairing") return;

      // Avoid updating if targetTile is already set
      if (botState.targetTile) return;

      // Logic to find the nearest repair tile
      const repairTile = Object.values(tiles).find((tile) => tile.type === "repair");
      if (repairTile) {
        set({ targetTile: repairTile.coord });
      }
    },
  },
  targetTile: null, // Current target tile for the bot
  updateState: (newState) => {
    const { state, transitions } = get();
    if (state === newState) {
      console.warn(`State is already '${newState}', no transition needed.`);
      return; // Avoid transitioning to the same state
    }
    if (transitions[state].includes(newState)) {
      set({ state: newState });
    } else {
      console.error(`Invalid state transition from ${state} to ${newState}`);
    }
  },
  execute: (tiles) => {
    const { state, actions, updateState } = get();
    if (state === "idle") {
      updateState("exploring"); // Automatically transition from idle to exploring
    }
    if (state === "exploring") actions.explore(tiles);
    if (state === "refueling") actions.refuel(tiles);
    if (state === "repairing") actions.repair(tiles);
  },
}));

export default useBotStore;
