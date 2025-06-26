import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';
import { contextReducers } from './reducers/context.js';
import { efficiencyGuards } from './guards/efficiencyGuard.js';
import { shipCollectingActions } from './actions/core/shipCollectingActions.js';
import { droneExploringActions } from './actions/core/droneExploringActions.js';

// Machine FSM XState - structure fidèle à la version robot3
export const fsmBotMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMD2AXAYgZQLIDowA3AQwBsBXE9ASwDsoBiAUQDUBBAGQFV2AVAJIB5AHIB9AMJDcABU7M+zANoAGALqJQAB1SwatVHU0gAHogBMAdkv4ArAE4AzJYCMADksq39229sAaEABPRA98cxcANmsXX0jIxxUXAF9kwLQsPEJSSmp6JjYuXkFRSWk5BWUXDSQQHT0DI1qzBEjzQJCEF0tnfBcvABZLAejXK0dU9IwcAmJyKloGFlxmACUAcWYRCQBNMQARSolFfdUa7V19GkNjFtt24MRusMivBJUVeIHHBMmQDJm2XmeSWACF2NhmGJVsx2BIABLMU7qYz1K43ZpPcz2ez4NwDAbmNwqAb48zkgKPLpuRx9SI4qJRSK2e7uP4ArJzXKLJiCeRiZgADTkQhhyPOdUujVuT1iA3wBIcjnsxNslkibjcHSejnM+CSONszk1jgJ6vZ005OQW+UYMOwQm4qwkUKknHkxyRZ1RUuuTVALRcLnM8vMthUtki3Us90iA21CDcLjsLhxPgcKkcPyNFsysxMWjIqAATvl8BAwIXUEFbXyoUKRWLvbU0dLMV0XIk7G0fMq3BrHB4Ey4Bqnu-Z6QM1UlfANc4CwAWi6WGOXK0Wa0tmCsNltdgcjidmxcGn6ZR2u5HsUaVQOh1Tg0T8KaiTTzIPB3O0v9LfmqyuoHwQxsH0MBGDrAVhU4UUvRRFtfQxAMdU8BV6WcSx7BUcxmXiYdTVxFR7GxV4nESQdbHnTklxLMtgNA5Y1k2bY9kORRPXFH1T0Q0wnjVXF33DTV6RDGlHGHAlcVsEZ+hZYMJ0+Si-2XMtizAdAKGLOhbXBSFoVhBFYIlVsz3bfoHk6TDaX7No43MTNrEIxT8AAY1QMgyDAZyeXwABbVAiHyPhUD4EhixgdBwIEfk3Q9I84JPdF-R4hAQz1NwiTsjCg2JVwE2+SIFQnUl3FNXUpK-KY8xctyPK82i6D4GgPLtZgHSdF0yndZh2OPSUuKSloRnlHDCRUdV3xjSIEx+AqDX7DxMw+TMnNc9zPO8wxGuagQRFYLY+FFPZMG4d1euM7iWh6WlMOZR9+hGfs8vDOlHGDH4gyI7CJm-DkCFW2qNoapqwJ2vaRAO1YjpOzglGqTjEvPb5kyW7p7FJUcvHfabYhTFUkwjMMs0sFaavW+qtrA7dGL3FjD0M+G2yQhArvwG7bDukkNSmqlHCk8JCPsDDMzsj4WRJta6tXVT1M0wLUFBEhYDAnSoRhOFEQ4+D+vPOTcXxQliXR8kwzywlWc7D62k-bxIicmgIA89h0AVpX8AAdxIK4lhhY7mE4MpZHkRQzoQgaLBxfUlqI0drM+eMH1e2lrxt3nhmVO2HbAJ2XbAd3PZ5RhuBEaD2H2AOKmD+K+oR9tsQIqOQ3ceI4-EwjwgGexunfFVyXSjPHedxXc49r2mBhGR2AEVZy6D5Qq-OsOUojpbCMb2O42HcNbH5iI-HZywiV1fus8H12R4L3BJ-BrZ2G2V1ylnkPtdr5eG5j5uN4fV5k1idnbx+LMSZj7ZyHnnUejABD7H5IIFYjo+BPxrkzOukcPjRybq8T+nRgzdGfAbN8H58TANPsPfOtoqa7mYgeNicUjKh3PD0FQfRCJWynD0BIYkHzMLsERDwwZhhRFNEQnO+BVIkAgEEBiFD9ysW6jQhmJkmYMKYROd8rCAEcKwSOGwq9vD3Cwq8IYqRvx0FQBWeAtRfryIuogAAtCGBMNjt4qhXi4j4QYnJchtAwKxi8fD6jaEMD474RaxGHGEP+ndUz9l5t9SqC5qIAR8eeHw2jYidwcG9EcLhhwjkYfiRIOJRxSS+B4hJZYKxVk3FAJJplRb6jSQ098WTxI-GfBhDBsROxYTcKU-89UQLoDADUpmWSrL3DDESJuPRzJPCnIwzm756Q9HStYXpykpZqQ0lpbxWtEHJRKvKLJIYJz9kjPSYcvc8TfCSCMHEYZgziwBvkYZyV7FUkuXNTw7h8rBgoj9X81UJbeT8gFBgQUQphTUi8y6MyEBTlxAfRIq80b4k1I8smq5NrA2hYgVkCojR1wSBhXweV4iswYZ2DKn0Ko-iqv9DFgFpZbLljnHFXQvDJletiYYxsow0lJQVTsE4MJox8N4FI-yqr2wHqy3ZjNkreBydiK5h84xOGmeYIRoDz7PLlQo-ZzhhxRkYQkbomYRi+CKlq12ojxFsrVLSfovZ+iDk8FYFpeohiRiSF9foDyjFAA */
  id: 'botFSM',
  initial: 'evaluating',
  states: {
    evaluating: {
      on: {
        EVALUATION_COMPLETE: [
          {
            target: '#botFSM.idleAtBase',
            guard: 'needsMaintenanceAfterCollection',
            actions: 'prepareIdleAtBaseAfterCollection'
          },
          // fallback simple (autres cas)
          { target: '#botFSM.exploring' }
        ],
        EMERGENCY_DETECTED: { target: '#botFSM.exploring.returning', internal: false, actions: 'goToReturning' },
        BASE_REACHED: { target: '#botFSM.idleAtBase' },
        TILE_EXPLORED: { target: '#botFSM.evaluating' },
        RESOURCE_COLLECTED: { target: '#botFSM.evaluating' }
      }
    },
    exploring: {
      initial: 'deploying',
      states: {
        deploying: {
          on: {
            TILE_EXPLORED: {
              target: 'onSite',
              actions: 'droneDeployForExploration'
            },
            EMERGENCY_DETECTED: { target: 'returning' }
          }
        },
        onSite: {
          on: {
            TILE_EXPLORED: {
              target: 'onSite',
              actions: 'droneMarkTileExplored'
            },
            EMERGENCY_DETECTED: { target: 'returning' }
          }
        },
        returning: {
          on: {
            BASE_REACHED: { target: '#botFSM.idleAtBase', actions: 'droneDockToShip' }
          }
        }
      }
    },
    collecting: {
      initial: 'movingToTarget',
      states: {
        movingToTarget: {
          on: {
            TILE_COLLECTED: {
              target: 'onTile',
              actions: 'shipUpdatePosition'
            }
          }
        },
        onTile: {
          on: {
            RESOURCE_COLLECTED: {
              target: 'onTile', // reste sur place tant qu'il y a à collecter
              actions: 'shipCollectsFromTile'
            },
            INVENTORY_FULL: [
              {
                target: 'returningToBase',
                guard: 'isAtMaxCapacity',
                actions: 'shipDepositResources'
              },
              { target: 'onTile' }
            ],
            EMERGENCY_DETECTED: {
              target: 'returningToBase',
              actions: 'shipDepositResources'
            }
          }
        },
        returningToBase: {
          on: {
            BASE_REACHED: { target: '#botFSM.idleAtBase', actions: 'shipDepositResources' }
          }
        }
      }
    },
    idleAtBase: {
      initial: 'waiting',
      states: {
        waiting: {
          on: {
            REFUEL_COMPLETE: { target: 'ready', actions: 'prepareExploring' },
            UNLOAD_COMPLETE: { target: 'ready', actions: 'prepareExploring' },
            REPAIR_COMPLETE: { target: 'ready', actions: 'prepareExploring' },
            MAINTENANCE_COMPLETE: { target: 'ready', actions: 'prepareExploring' },
            IDLE_TIMEOUT: { target: 'ready', actions: 'prepareExploring' },
            EMERGENCY_DETECTED: { target: '#botFSM.exploring.returning' }
          }
        },
        ready: {
          on: {
            EMERGENCY_DETECTED: { target: '#botFSM.exploring.returning' }
          }
        }
      }
    }
  }
}, {
  guards: {
    // Guards avec support pour les valeurs forcées depuis le panneau de simulation
    needsMaintenanceAfterCollection: (context, event) => {
      // Si le panneau de simulation force une valeur, l'utiliser
      if (event._forcedGuards?.needsMaintenanceAfterCollection !== undefined) {
        return event._forcedGuards.needsMaintenanceAfterCollection;
      }
      
      // Logique normale
      const needsMaintenance = context.vehicle?.fuel < 30 || 
                              context.vehicle?.damage > 50 ||
                              context.vehicle?.needsRepair;
      const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
      return needsMaintenance && justReturnedFromCollection;
    },
    
    isAtMaxCapacity: (context, event) => {
      // Si le panneau de simulation force une valeur, l'utiliser
      if (event._forcedGuards?.isAtMaxCapacity !== undefined) {
        return event._forcedGuards.isAtMaxCapacity;
      }
      
      // Logique normale
      return context.inventory?.isFull || false;
    },
    
    hasResources: (context, event) => {
      // Si le panneau de simulation force une valeur, l'utiliser
      if (event._forcedGuards?.hasResources !== undefined) {
        return event._forcedGuards.hasResources;
      }
      
      // Logique normale
      const resources = context.inventory?.resources || { food: 0, debris: 0, special: 0 };
      return resources.food > 0 || resources.debris > 0 || resources.special > 0;
    },
    
    hasEnoughFuel: (context, event) => {
      // Si le panneau de simulation force une valeur, l'utiliser
      if (event._forcedGuards?.hasEnoughFuel !== undefined) {
        return event._forcedGuards.hasEnoughFuel;
      }
      
      // Logique normale
      return (context.vehicle?.fuel || 0) > 20;
    },
    
    isAtTarget: (context, event) => {
      // Si le panneau de simulation force une valeur, l'utiliser
      if (event._forcedGuards?.isAtTarget !== undefined) {
        return event._forcedGuards.isAtTarget;
      }
      
      // Logique normale (calcul de distance simplifiée)
      const pos = context.position || { x: 0, y: 0, z: 0 };
      const target = context.target || { x: 0, y: 0, z: 0 };
      const distance = Math.sqrt(
        Math.pow(pos.x - target.x, 2) + 
        Math.pow(pos.z - target.z, 2)
      );
      return distance < 0.5; // Tolérance d'arrivée
    },
    
    // Spread des guards externes (si disponibles)
    ...(typeof efficiencyGuards !== 'undefined' ? efficiencyGuards : {})
  },
  actions: {
    // Actions simplifiées pour la visualisation
    goToReturning: (context, event) => {
      console.log('Going to returning state');
    },
    droneDeployForExploration: (context, event) => {
      console.log('Drone deploying for exploration');
    },
    droneMarkTileExplored: (context, event) => {
      console.log('Marking tile as explored');
    },
    droneDockToShip: (context, event) => {
      console.log('Drone docking to ship');
    },
    shipUpdatePosition: (context, event) => {
      console.log('Ship updating position');
    },
    shipCollectsFromTile: (context, event) => {
      console.log('Ship collecting from tile');
    },
    shipDepositResources: (context, event) => {
      console.log('Ship depositing resources');
    },
    prepareExploring: (context, event) => {
      console.log('Preparing for exploration');
    },
    prepareIdleAtBaseAfterCollection: (context, event) => {
      // Fallback si contextReducers n'est pas disponible
      if (typeof contextReducers !== 'undefined') {
        return contextReducers.stateTransitionReducers.prepareIdleAtBase(context, {
          reason: 'maintenance_required_after_collection'
        });
      }
      console.log('Preparing idle at base after collection');
    },
    // Spread des actions externes (si disponibles)
    ...(typeof shipCollectingActions !== 'undefined' ? shipCollectingActions : {}),
    ...(typeof droneExploringActions !== 'undefined' ? droneExploringActions : {})
  }
});

export default fsmBotMachine;
