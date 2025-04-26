import { useTileStore } from "../stores/useNewTileStore";
import useBotStore from "../stores/useBotStore";
import usePlayerStore from "../stores/usePlayerStore";

const BotManager = () => {
  const { state, updateState, execute } = useBotStore();
  const tiles = useTileStore((state) => state.tiles);
  const updateShip = usePlayerStore((state) => state.updateShip);

  const performAction = () => {
    if (!tiles || Object.keys(tiles).length === 0) {
      console.warn("[BotManager] No tiles available. Skipping action.");
      return;
    }

    console.log("[BotManager] Performing action for state:", state);
    execute(tiles);

    const botTargetTile = useBotStore.getState().targetTile;
    if (botTargetTile) {
      const targetTile = tiles[botTargetTile];
      if (targetTile) {
        console.log("[BotManager] Setting target tile for player2's ship:", botTargetTile);
        updateShip("player2", {
          coord: botTargetTile, // Set the target coordinate
          isMoving: true, // Mark the ship as moving
        });
      } else {
        console.warn("[BotManager] Target tile not found in tiles.");
      }
    } else {
      console.log("[BotManager] No target tile set.");
    }
  };

  return { performAction };
};

export default BotManager;
