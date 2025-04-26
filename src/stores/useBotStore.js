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

      if (botState.targetTile) {
        console.log("[BotStore] Target already set. Skipping exploration.");
        return;
      }

      const resourceTiles = Object.values(tiles).filter((tile) => tile.resources && !tile.collected);

      console.log("[BotStore] Available resource tiles:", resourceTiles.map((tile) => tile.coord));

      if (resourceTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * resourceTiles.length);
        console.log("[BotStore] Random index selected:", randomIndex);
        const resourceTile = resourceTiles[randomIndex];
        console.log("[BotStore] Selected random resource tile:", resourceTile.coord);
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
      const fuelTiles = Object.values(tiles).filter((tile) => tile.type === "fuel");

      if (fuelTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * fuelTiles.length);
        const fuelTile = fuelTiles[randomIndex];
        console.log("[BotStore] Found random fuel tile:", fuelTile.coord);
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
      const repairTiles = Object.values(tiles).filter((tile) => tile.type === "repair");

      if (repairTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * repairTiles.length);
        const repairTile = repairTiles[randomIndex];
        console.log("[BotStore] Found random repair tile:", repairTile.coord);
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

