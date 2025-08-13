import { useCallback, useEffect, useRef } from 'react';

// === Store Imports ===
import { useTileStore } from '../../../../../stores/useTileStore/index';

// === Type Imports ===
import type { WorldPosition } from '../../../../../types/coordinates.d.ts';
import type { FSMContext } from '../../../../../types/fsm.d.ts';
import type { TileStoreType } from '../../../../../types/stores.d.ts';
import type { XStateSend } from '../../../../../types/tracker.d.ts';

// === Logger ===
import fsmLogger from '../../../../../logger/fsmLogger.ts';

// === Handlers ===
import { createShipHandlers } from './handlers';

interface ShipTrackerParams {
  context: FSMContext;
  send: XStateSend;
  botId: string;
  shipType?: 'ship' | 'main-ship';
  fleetPosition?: WorldPosition | null; // 🆕 Position initiale du vaisseau
}

export const useShipTracker = ({
    context,
    send,
    botId,
    shipType = 'main-ship',
    fleetPosition // 🆕 Position Fleet pour l'initialisation
}: ShipTrackerParams): ((position: WorldPosition) => void) => {
    const currentVisualPosition = useRef<WorldPosition | null>(null);
    const lastBasePosition = useRef<string>('');
    const contextRef = useRef(context);
    const initialPositionSent = useRef<boolean>(false); // 🆕 Flag pour éviter duplications
    
    // Update ref when context changes
    contextRef.current = context;

    // ============================================================================
    // INITIALIZATION AVEC FLEETPOSITION (PRIORITAIRE SUR BASEPOSITION)
    // ============================================================================
    
    useEffect(() => {
        const hasValidContext = contextRef.current && send && typeof send === 'function';
        
        // 🆕 PRIORITÉ 1: Utiliser fleetPosition si disponible (position du monde réel)
        if (hasValidContext && fleetPosition && !initialPositionSent.current) {
            const handlers = createShipHandlers({
                fsmSend: send,
                botId,
                shipType
            });
            
            fsmLogger.mouvement(`🚢 [${botId}] 🔧 TRACKER: Initializing ship with fleet position`, { 
                fleetPosition, 
                shipType,
                previousPosition: currentVisualPosition.current 
            });
            
            // Utiliser le initializeHandler pour l'envoi initial de SHIP_POSITION_UPDATE
            handlers.initializeHandler.process(fleetPosition);
            initialPositionSent.current = true;
            return;
        }
        
        // PRIORITÉ 2: Fallback sur basePosition du contexte si pas de fleetPosition
        const basePosition = contextRef.current?.vehicle?.basePosition;
        const basePositionKey = basePosition ? `${basePosition.x},${basePosition.y},${basePosition.z}` : '';
        
        // Initialiser seulement si position valide et différente de la dernière (et pas déjà initialisé)
        if (hasValidContext && basePosition && basePositionKey !== lastBasePosition.current && !initialPositionSent.current) {
            const handlers = createShipHandlers({
                fsmSend: send,
                botId,
                shipType
            });
            
            fsmLogger.mouvement(`🚢 [${botId}] Initializing ship with context base position`, { basePosition, shipType });
            
            // Utiliser le initializeHandler pour l'envoi initial de SHIP_POSITION_UPDATE
            handlers.initializeHandler.process(basePosition);
            lastBasePosition.current = basePositionKey;
            initialPositionSent.current = true;
        }
    }, [fleetPosition, send, botId, shipType]); // 🆕 fleetPosition dans les dépendances

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
        
        // Log détaillé de position toutes les 120 frames (environ 1 fois toutes les 2 secondes)
        const shouldLogPosition = Math.floor(Date.now() / 2000) % 2 === 0;
        
        // ============================================================================
        // ENVOI CONDITIONNEL DE SHIP_POSITION_UPDATE
        // ============================================================================
        
        const currentState = contextRef.current?.currentState;
        
        // Envoi conditionnel selon l'état pour éviter les envois répétés pendant l'animation
        if (shouldSendPositionUpdate(currentState)) {
            if (shouldLogPosition) {
                fsmLogger.mouvement(`🚢 [${botId}] 📨 TRACKER: Sending SHIP_POSITION_UPDATE`, {
                    position,
                    currentState,
                    vehicle: contextRef.current?.vehicle ? {
                        targetTile: contextRef.current.vehicle.targetTile,
                        basePosition: contextRef.current.vehicle.basePosition,
                        isMoving: contextRef.current.vehicle.isMoving
                    } : null
                });
            }
            
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
                if (vehicle?.targetTile) {
                    // Utiliser vehicle.targetTile pour la navigation (coordonnée de grille)
                    const targetCoord = vehicle.targetTile;
                    
                    // Convertir les coordonnées de grille en position mondiale
                    const tileStore = useTileStore.getState() as TileStoreType;
                    const targetWorldPos = tileStore.gridToWorld(targetCoord);
                    
                    const distance = tileStore.calculateDistance(position, targetWorldPos);
                    handlers.movingToTileHandler.process(distance, position);
                }
                break;
            }
                
            case 'collecting_ship_collecting': {
                fsmLogger.action(`📦 [${botId}] Ship collecting tracker called`, {
                  position,
                  vehicle: !!vehicle,
                  shipType
                });
                // Pour la collecte, la distance n'est pas pertinente (simulation par timer)
                handlers.collectingHandler.process(0, position);
                break;
            }
                
            case 'collecting_ship_returning': {
                if (vehicle?.basePosition) {
                    const basePosition = vehicle.basePosition;
                    const tileStore = useTileStore.getState() as TileStoreType;
                    const distance = tileStore.calculateDistance(position, basePosition);
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
