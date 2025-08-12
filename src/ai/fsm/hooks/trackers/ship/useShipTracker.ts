import { useCallback, useEffect, useRef } from 'react';

// === Type Imports ===
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext, SelectedTile } from '../../../../../types/fsm.d.ts';
import type { XStateSend } from '../../../../../types/tracker.d.ts';

// === Handlers ===
import { createShipHandlers } from './handlers';

// ============================================================================
// CONVERSION UTILITAIRE LOCALE
// ============================================================================

/**
 * Conversion simplifiée de coordonnées de tuile vers position mondiale
 * Utilise la logique hexagonale standard pour éviter les dépendances de store
 */
function selectedTileToWorldPosition(selectedTile: SelectedTile): WorldPosition {
  const HEX_SIZE = 1.0;
  const spacing = 0.0;
  
  // Parser la string coord "x,z" depuis SelectedTile
  const [x, z] = selectedTile.coord.coord.split(',').map(Number);
  
  // Conversion hex vers monde (formule hexagonale standard)
  const worldX = x * HEX_SIZE * (1 + spacing);
  const worldZ = z * HEX_SIZE * (1 + spacing);
  
  return { x: worldX, y: 0.5, z: worldZ };
}

interface ShipTrackerParams {
  context: FSMContext;
  send: XStateSend;
  botId: string;
  shipType?: 'ship' | 'main-ship';
}

export const useShipTracker = ({
    context,
    send,
    botId,
    shipType = 'main-ship'
}: ShipTrackerParams): ((position: WorldPosition) => void) => {
    const currentVisualPosition = useRef<WorldPosition | null>(null);
    const lastBasePosition = useRef<string>('');
    const contextRef = useRef(context);
    
    // Update ref when context changes
    contextRef.current = context;

    // ============================================================================
    // INITIALIZATION AVEC initializeHandler (UNE SEULE FOIS PAR POSITION)
    // ============================================================================
    
    useEffect(() => {
        const basePosition = contextRef.current?.vehicle?.basePosition;
        const hasValidContext = contextRef.current && contextRef.current.vehicle && send && typeof send === 'function';
        const basePositionKey = basePosition ? `${basePosition.x},${basePosition.y},${basePosition.z}` : '';
        
        // Initialiser seulement si position valide et différente de la dernière
        if (hasValidContext && basePosition && basePositionKey !== lastBasePosition.current) {
            const handlers = createShipHandlers({
                fsmSend: send,
                botId,
                shipType
            });
            
            // Utiliser le initializeHandler pour l'envoi initial de SHIP_POSITION_UPDATE
            handlers.initializeHandler.process(basePosition);
            lastBasePosition.current = basePositionKey;
        }
    }, [send, botId, shipType]); // Pas de context dans les dépendances

    // ============================================================================
    // FONCTION DE CONTRÔLE D'ENVOI DE POSITION
    // ============================================================================
    
    const shouldSendPositionUpdate = useCallback((currentState?: string): boolean => {
        // Ne pas envoyer SHIP_POSITION_UPDATE pendant l'animation pour éviter les boucles
        // L'événement est géré uniquement lors de l'initialisation via initializeHandler
        const animationStates = [
            'collecting_ship_moving_to_tile',
            'collecting_ship_returning'
        ];
        
        // Envoyer uniquement si ce n'est pas un état d'animation
        return !animationStates.includes(currentState || '');
    }, []);

    // Fonction pour mettre à jour la position depuis l'animation
    const updatePosition = useCallback((position: WorldPosition) => {
        // Early return si pas de contexte valide
        if (!contextRef.current || !send || typeof send !== 'function') {
            return;
        }
        
        currentVisualPosition.current = position;
        
        // ============================================================================
        // ENVOI CONDITIONNEL DE SHIP_POSITION_UPDATE
        // ============================================================================
        
        const currentState = contextRef.current?.currentState;
        
        // Envoi conditionnel selon l'état pour éviter les envois répétés pendant l'animation
        if (shouldSendPositionUpdate(currentState)) {
            send({
                type: 'SHIP_POSITION_UPDATE',
                botId,
                shipType,
                position
            });
        }
        
        // ============================================================================
        // TRAITEMENT DES HANDLERS SELON L'ÉTAT
        // ============================================================================
        
        const handlers = createShipHandlers({
            fsmSend: send,
            botId,
            shipType
        });

        const vehicle = contextRef.current?.vehicle;
        
        // Si le véhicule n'existe pas dans le contexte, attendre la prochaine mise à jour
        if (!vehicle) return;

        // Switch unifié pour tous les sous-états de collecting avec logique basée sur la distance
        switch (currentState) {
            case 'collecting_ship_moving_to_tile': {
                if (contextRef.current?.selectedTileForCollection?.coord) {
                    // Convertir les coordonnées de tuile en position mondiale
                    const selectedTile = contextRef.current.selectedTileForCollection;
                    const targetPosition = selectedTileToWorldPosition(selectedTile);
                    const distance = Math.sqrt(
                        Math.pow(position.x - targetPosition.x, 2) +
                        Math.pow(position.z - targetPosition.z, 2)
                    );
                    handlers.movingToTileHandler.process(distance, position);
                }
                break;
            }
                
            case 'collecting_ship_collecting': {
                // Pour la collecte, la distance n'est pas pertinente (simulation par timer)
                handlers.collectingHandler.process(0, position);
                break;
            }
                
            case 'collecting_ship_returning': {
                if (vehicle?.basePosition) {
                    const basePosition = vehicle.basePosition;
                    const distance = Math.sqrt(
                        Math.pow(position.x - basePosition.x, 2) +
                        Math.pow(position.z - basePosition.z, 2)
                    );
                    handlers.returningHandler.process(distance, position);
                }
                break;
            }
                
            default:
                // Pour les autres états, pas de traitement spécifique
                break;
        }
    }, [send, botId, shipType, shouldSendPositionUpdate]);

    return updatePosition;
};
