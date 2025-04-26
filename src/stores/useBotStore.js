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

      // Avoid updating if targetTile is already set or reached
      if (botState.targetTile) {
        console.log("[BotStore] Target already set. Skipping exploration.");
        return;
      }

      console.log("[BotStore] Exploring: Finding nearest resource tile...");
      const resourceTile = Object.values(tiles).find((tile) => tile.resources && !tile.collected);
      if (resourceTile) {
        console.log("[BotStore] Found resource tile:", resourceTile.coord);
        set({ targetTile: resourceTile.coord });
      } else {
        console.log("[BotStore] No resource tile found.");
      }
    },
    refuel: (tiles) => {
      const botState = get();
      if (botState.state !== "refueling") return;

      if (botState.targetTile) return;

      console.log("[BotStore] Refueling: Finding nearest fuel tile...");
      const fuelTile = Object.values(tiles).find((tile) => tile.type === "fuel");
      if (fuelTile) {
        console.log("[BotStore] Found fuel tile:", fuelTile.coord);
        set({ targetTile: fuelTile.coord });
      } else {
        console.log("[BotStore] No fuel tile found.");
      }
    },
    repair: (tiles) => {
      const botState = get();
      if (botState.state !== "repairing") return;

      if (botState.targetTile) return;

      console.log("[BotStore] Repairing: Finding nearest repair tile...");
      const repairTile = Object.values(tiles).find((tile) => tile.type === "repair");
      if (repairTile) {
        console.log("[BotStore] Found repair tile:", repairTile.coord);
        set({ targetTile: repairTile.coord });
      } else {
        console.log("[BotStore] No repair tile found.");
      }
    },
  },
  targetTile: null, // Current target tile for the bot
  updateState: (newState) => {
    const { state, transitions } = get();
    if (state === newState) {
      console.warn(`[BotStore] State is already '${newState}', no transition needed.`);
      return; // Avoid transitioning to the same state
    }
    if (transitions[state].includes(newState)) {
      console.log(`[BotStore] Transitioning from '${state}' to '${newState}'`);
      set({ state: newState });
    } else {
      console.error(`[BotStore] Invalid state transition from '${state}' to '${newState}'`);
    }
  },
  execute: (tiles) => {
    const { state, actions, updateState } = get();
    console.log(`[BotStore] Executing action for state: '${state}'`);
    if (state === "idle") {
      updateState("exploring"); // Automatically transition from idle to exploring
    }
    if (state === "exploring") actions.explore(tiles);
    if (state === "refueling") actions.refuel(tiles);
    if (state === "repairing") actions.repair(tiles);
  },
}));

export default useBotStore;

