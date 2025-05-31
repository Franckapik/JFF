/**
 * ============================================================================
 * EXEMPLE D'UTILISATION - Système d'événements FSM
 * ============================================================================
 * 
 * Ce fichier montre comment utiliser le système d'événements centralisé
 * avec la machine FSM.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

import { events } from './machine/events';

// Exemple d'utilisation dans un composant React
function useFSMEventsExample(send) {
  const handleMovement = (targetCoord) => {
    // Créer un événement de mouvement
    const moveEvent = events.user.createMoveToEvent({
      coord: targetCoord,
      position: { x: targetCoord.x, y: targetCoord.y, z: 0 }
    });
    
    // Envoyer l'événement à la machine FSM
    send(moveEvent.type, moveEvent);
  };
  
  const handleExploration = () => {
    // Créer un événement d'exploration
    const exploreEvent = events.user.createExplorationRequestedEvent({
      center: { x: 50, y: 50 },
      radius: 10
    });
    
    // Envoyer l'événement à la machine FSM
    send(exploreEvent.type, exploreEvent);
  };
  
  const handleEmergency = () => {
    // Créer un événement d'urgence
    const emergencyEvent = events.emergency.createEmergencyDetectedEvent(
      'obstacle_detected',
      { position: { x: 30, y: 20 }, severity: 'high' }
    );
    
    // Envoyer l'événement à la machine FSM
    send(emergencyEvent.type, emergencyEvent);
  };
  
  const handleLowFuel = (fuelLevel) => {
    // Créer un événement de carburant bas
    const lowFuelEvent = events.emergency.createLowFuelDetectedEvent(
      fuelLevel,
      20 // threshold
    );
    
    // Envoyer l'événement à la machine FSM
    send(lowFuelEvent.type, lowFuelEvent);
  };
  
  const handleResourceCollection = (resource) => {
    // Simuler un nouvel inventaire après collection
    const newInventory = {
      resources: ['mineral', 'crystal', resource.type],
      capacity: 5,
      used: 3
    };
    
    // Créer un événement de collecte de ressource
    const collectionEvent = events.resources.createResourceCollectedEvent(
      resource,
      newInventory
    );
    
    // Envoyer l'événement à la machine FSM
    send(collectionEvent.type, collectionEvent);
    
    // Vérifier si l'inventaire est plein
    if (newInventory.used >= newInventory.capacity) {
      const fullEvent = events.resources.createInventoryFullEvent(newInventory);
      send(fullEvent.type, fullEvent);
    }
  };
  
  const handleRefueling = () => {
    // Créer un événement de ravitaillement terminé
    const refuelEvent = events.system.createRefuelCompleteEvent(100);
    
    // Envoyer l'événement à la machine FSM
    send(refuelEvent.type, refuelEvent);
  };
  
  return {
    handleMovement,
    handleExploration,
    handleEmergency,
    handleLowFuel,
    handleResourceCollection,
    handleRefueling
  };
}

// Exemple d'utilisation dans un fichier d'état FSM
function createExampleState() {
  import { state, transition, reduce } from 'robot3';
  import { BOT_STATES } from './states/index.js';
  import { MOVEMENT_EVENT_TYPES } from './events/movementEvents.js';
  import { RESOURCE_EVENT_TYPES } from './events/resourceEvents.js';
  import { EMERGENCY_EVENT_TYPES } from './events/emergencyEvents.js';
  
  const exampleState = state(
    // Transition lors de la découverte de ressources
    transition(RESOURCE_EVENT_TYPES.RESOURCES_DISCOVERED,
      BOT_STATES.COLLECTING,
      (context, event) => event.resources && event.resources.length > 0,
      reduce((context, event) => ({
        ...context,
        knownResources: [...context.knownResources, ...event.resources],
        lastAction: 'resources_discovered'
      }))
    ),
    
    // Transition lors d'une urgence
    transition(EMERGENCY_EVENT_TYPES.EMERGENCY_DETECTED,
      BOT_STATES.EVALUATING,
      () => true,
      reduce((context, event) => ({
        ...context,
        emergencyFlag: true,
        emergencyType: event.condition,
        lastAction: 'emergency_handling'
      }))
    ),
    
    // Transition lors de l'arrivée à la base
    transition(MOVEMENT_EVENT_TYPES.BASE_REACHED,
      BOT_STATES.IDLE_AT_BASE,
      (context) => context.vehicle && context.vehicle.coord === context.vehicle.startCoord,
      reduce((context) => ({
        ...context,
        currentAction: 'arrived_at_base',
        lastStateChange: Date.now()
      }))
    )
  );
  
  return exampleState;
}

export { useFSMEventsExample, createExampleState };
