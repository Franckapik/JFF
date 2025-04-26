import { create } from "zustand";

// Store for managing the bot's state and actions
const useBotStore = create((set, get) => ({
  // Current state of the bot (Finite State Machine)
  state: "idle", // Initial state of the bot

  // Allowed state transitions
  transitions: {
    idle: ["exploring", "refueling", "repairing"],
    exploring: ["idle", "refueling", "repairing"],
    refueling: ["idle", "exploring"],
    repairing: ["idle", "exploring"],
  },

  // Actions the bot can perform based on its state
  actions: {
    // Action: Explore the map to find resources
    explore: (tiles) => {
      const botState = get();

      // Ensure the bot is in the correct state
      if (botState.state !== "exploring") return;

      // Skip exploration if a valid target is already set
      if (botState.targetTile) {
        console.log("[BotStore] Target already set. Skipping exploration.");
        return;
      }

      // Find all resource tiles that have not been collected
      const resourceTiles = Object.values(tiles).filter((tile) => tile.resources && !tile.collected);

      console.log("[BotStore] Available resource tiles:", resourceTiles.map((tile) => tile.coord));

      // Select a random resource tile as the target
      if (resourceTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * resourceTiles.length);
        const resourceTile = resourceTiles[randomIndex];
        console.log("[BotStore] Selected random resource tile:", resourceTile.coord);
        set({ targetTile: resourceTile.coord });
      } else {
        console.log("[BotStore] No resource tile found.");
      }
    },

    // Action: Refuel the bot's ship
    refuel: (tiles) => {
      const botState = get();
      if (botState.state !== "refueling") return;

      // Skip refueling if a target is already set
      if (botState.targetTile) return;

      console.log("[BotStore] Refueling: Finding nearest fuel tile...");
      const fuelTiles = Object.values(tiles).filter((tile) => tile.type === "fuel");

      // Select a random fuel tile as the target
      if (fuelTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * fuelTiles.length);
        const fuelTile = fuelTiles[randomIndex];
        console.log("[BotStore] Found random fuel tile:", fuelTile.coord);
        set({ targetTile: fuelTile.coord });
      } else {
        console.log("[BotStore] No fuel tile found.");
      }
    },

    // Action: Repair the bot's ship
    repair: (tiles) => {
      const botState = get();
      if (botState.state !== "repairing") return;

      // Skip repairing if a target is already set
      if (botState.targetTile) return;

      console.log("[BotStore] Repairing: Finding nearest repair tile...");
      const repairTiles = Object.values(tiles).filter((tile) => tile.type === "repair");

      // Select a random repair tile as the target
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

  // Current target tile for the bot
  targetTile: null,

  // Update the bot's state (Finite State Machine transition)
  updateState: (newState) => {
    const { state, transitions } = get();

    // Prevent transitioning to the same state
    if (state === newState) {
      console.warn(`[BotStore] State is already '${newState}', no transition needed.`);
      return;
    }

    // Check if the transition is valid
    if (transitions[state].includes(newState)) {
      console.log(`[BotStore] Transitioning from '${state}' to '${newState}'`);
      set({ state: newState });
    } else {
      console.error(`[BotStore] Invalid state transition from '${state}' to '${newState}'`);
    }
  },

  // Execute the current state's action
  execute: (tiles) => {
    const { state, actions, updateState } = get();

    console.log(`[BotStore] Executing action for state: '${state}'`);

    // Execute the action based on the current state
    if (state === "idle") {
      updateState("exploring");
    }

    if (state === "exploring") {
      actions.explore(tiles);
    }

    if (state === "refueling") {
      actions.refuel(tiles);
    }

    if (state === "repairing") {
      actions.repair(tiles);
    }
  },
}));

export default useBotStore;

