import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { WorldPosition } from '../../../../../../types/coordinates.d.ts';
import type { ShipType, XStateSend } from '../../../../../../types/tracker.d.ts';

interface ShipHandlerParams {
  botId: string;
  shipType: ShipType;
  send: XStateSend;
}

export const createInitializationHandler = ({ botId, shipType, send }: ShipHandlerParams) => {

  return {
    /**
     * Interface unifiée avec les autres handlers : process(distance, position)
     * Pour l'initialisation, on ignore distance et utilise position pour mettre à jour le contexte
     */
    process(_distance?: number, position?: WorldPosition): boolean {
      if (!position) {
        fsmLogger.debug(`🚢 [${botId}] No position available for ${shipType} ship initialization`);
        return false;
      }

      fsmLogger.context(`🚢 [${botId}] Processing ${shipType} ship initialization`, { position });
      
      // Envoyer l'événement d'initialisation avec la position
      send({ 
        type: 'SHIP_POSITION_UPDATE', 
        botId, 
        shipType,
        position
      });
      
      return true;
    }
  };
};

export default createInitializationHandler;
