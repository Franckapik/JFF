import fsmLogger from '../../../../../../logger/fsmLogger.ts';
import type { HandlerParams } from '../../../../../../types/tracker.d.ts';

export const createInitializationHandler = ({ botId, droneType, send }: HandlerParams) => {

  return {
    /**
     * Interface unifiée avec les autres handlers : process(distance, position)
     * Pour l'initialisation, on ignore distance et position
     */
    process(): boolean {
      fsmLogger.context(`🛸 [${botId}] Processing ${droneType} drone initialization`);
      
      // Envoyer l'événement d'initialisation qui calculera automatiquement la position
      // Si le vaisseau n'a pas encore de position, l'action retournera le contexte inchangé
      // et on continuera d'essayer à chaque frame
      send({ 
        type: 'DRONE_INITIALIZE_REQUEST', 
        botId, 
        droneType
      });
      
      return true;
    }
  };
};

export default createInitializationHandler;
