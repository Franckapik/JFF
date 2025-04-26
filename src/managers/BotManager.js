import { useTileStore } from "../stores/useNewTileStore";
import useBotStore from "../stores/useBotStore";
import usePlayerStore from "../stores/usePlayerStore";

const BotManager = () => {
  const { state, updateState, execute } = useBotStore();
  const tiles = useTileStore((state) => state.tiles);
  const updateShip = usePlayerStore((state) => state.updateShip);

  const performAction = () => {
    // Avoid executing if no tiles are available
    if (!tiles || Object.keys(tiles).length === 0) return;

    // Execute the current state's action
    execute(tiles);

    const botTargetTile = useBotStore.getState().targetTile;
    if (botTargetTile) {
      const targetTile = tiles[botTargetTile];

      if (targetTile) {
        // Update player2's ship position to move toward the target
        updateShip("player2", {
          coord: botTargetTile,
          position: targetTile.position,
        });

        // Transition to the next state based on the tile type
        if (targetTile.type === "fuel") {
          updateState("refueling");
        } else if (targetTile.type === "repair") {
          updateState("repairing");
        } else if (targetTile.resources) {
          updateState("exploring");
        } else {
          updateState("idle");
        }
      }
    }
  };

  return { performAction };
};

export default BotManager;
