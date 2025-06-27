import { useEffect, useRef } from "react";

/**
 * useXFSMShipTracker
 * Clone du tracker drone, adapté pour le vaisseau principal (ship).
 * Surveille la position du ship et déclenche des événements FSM XState selon la logique ship.
 * @param {Object} context - Contexte FSM du bot
 * @param {Function} fsmSend - Fonction pour envoyer des events FSM
 * @param {string} botId - ID du bot
 * @param {string} [shipType='ship'] - Type de ship (par défaut 'ship')
 * @returns {Function} updateShipVisualPosition - Callback pour MAJ la position visuelle
 */
export function useXFSMShipTracker(context, fsmSend, botId, shipType = 'ship') {
  const lastPosition = useRef(null);

  // Exemple : surveille la position du ship et déclenche un event FSM si la position change
  const updateShipVisualPosition = (newPosition) => {
    if (!lastPosition.current ||
        lastPosition.current.x !== newPosition.x ||
        lastPosition.current.y !== newPosition.y ||
        lastPosition.current.z !== newPosition.z) {
      // Ici, tu peux adapter la logique d'événement selon les besoins du ship
      fsmSend({ type: 'SHIP_POSITION_UPDATED', position: newPosition, botId, shipType });
      lastPosition.current = { ...newPosition };
    }
  };

  // Optionnel : effet pour reset le tracker si le botId change
  useEffect(() => {
    lastPosition.current = null;
  }, [botId]);

  return updateShipVisualPosition;
}
