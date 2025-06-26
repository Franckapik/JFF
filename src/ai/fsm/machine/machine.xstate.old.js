import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';
import { contextReducers } from './reducers/context.js';
import { efficiencyGuards } from './guards/efficiencyGuard.js';
import { shipCollectingActions } from './actions/core/shipCollectingActions.js';
import { droneExploringActions } from './actions/core/droneExploringActions.js';

// Machine FSM XState - structure fidèle à la version robot3
export const fsmBotMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMD2AXAYgZQLIDo10B9MANwEMAbAVwvQEsA7KAYgBEAlAeQDkBRYvwBqAQQAyAVVEAVAJJ9iAYW64ACuP4z+AbQAMAXUSgADqlgNGqJsZAAPRABYArAA58egOxuAzI4BMrs4AnHoAjMEANCAAnoiursH4wT6pAGyOev7+zj7+aQC+BdFEOAREpJS09MxsXHyCIhLS8ooq6praOmFGSCBmFlY2fQ4IALT+wUkBzt6uYZ5hPkGO0XEIwWnO+J5+y46Oi2H+nkUlGGWEGJXUdIwsHDwCQrj8nADi-LxKAJrE7Fp+EptOx9L1TOZLAxrLZRs5-GtEAtPI5ko4wmlPMEcpi0ksziBSngriRyLcag9sAAJORqYgAIVE2EEnH4oiUVP4oMMtgGUJhI0QPgi+EmaVCXlyKUcrkRCEOelFU0cGRyYWRPlOxUJF2JFTJ1XudSegnkmiEAA0NNxWdzwf1IUNYUjhT58EsTsF4ZlxWkEbFELl-O7lRkUcFEicCUTytcDXdaqxqbTiKzsNxJJwlIIVOJNMCuWDeY7ocNQKNjuL8Al-Ho0glPK4Dp45bs3VtXItPOKfMEXP5o7qCBAAE7WMCkOwmKioEe1fCj8fECBgaeoGKJ+rPM2NK3iG2Fnl9PlOwXjdU+NI7PRePHd5xpS+tzzBzv+MK5NJpPSbVyFbUxguY5MBOYBTjOc4sEBS4rmuG4PFujSvB8Xy-P8gIFnaxaDKWzrnmEdYeNkTYRti3hhLKAYIM4ejtr2KRBnkiQ+IOWDEouIGTmukFQNBnHWNglhgI8DTEDulrWraRbHiWArlogYyuIReJbJ4KJ+pk-rrG4wbft2wQLOq+TvqxlwcaB4GzvO5nEAJQkic8-DIZ83x-AC2iYdJEI4XJ9gKbMwZqYEH43hi2RpK2-iok2kyZN2d6OMEpnscBFncdZqXECOYDoDQI5MJuJoMkyLJshyh72ieuFnmMziZDsCQql+L5en6cp6fgmJRb2OQGXiyUELAAAWDAmMQADGqBUFQYDjUa+DDaNxAALaoGQtQyKgMgUCOMDoEmNJ0uJub5iCXkOj5ZZ+QgwWijRN4-ii74qXKJxhMk94+M4uTfbRejOANC0jWNk3TbN82LWN1gyAwM0HSmaYZlmObcHmQJnUe3n8ldcLotewouEsATzM4r3hPgiVTEF-jChGYSA5DE1TTNc3zoz0Ow8JyZ0nIvDCF8Mg2n8mCSHm51Vb5oxBLpD7ZFFNMpHWr1BJ1jh5JM3jOBimwM8DTNg6zUHs0wMNw9zxC8-zvCC5wwui+I3SVbJOOBno7h6CqSkYhRFF+KTVEhckUzBI2-1q6ELEAUOQNLaDLMQ3rHNm4dLxvC5aHuejFXYdjeHS51svZAEvY+ErAeJJ1oRGbMGTClq5xsYNetx+DbN69luX5RtqD0hQsBcynjLMqmZWclhMmXXhYQyu4ni0ZWTZKUGr2NvgJcLMXX0orrS0MBAM2iOgvf9zHY0AO4UFClIp6yIv8OIyiqBogLi87eF5O9v4Pi4P5eEEPhyiWDeTqkx3xLF2DeEyUdG6n2IHvA+R8+5gFgRfK+bBzaSF4PuUQ7BH4dBfpjC6uczwf2SPWb+NFQiNlyIA3sV4dInECH1Y4O8xrwLAIfY+yDGaoKNPDOkrI1CiDkJwPBz8uiEIli7BApCv4ZEoX-GhAdErBh+t9OeNE2yuFYXA-eHDEEnx4ZfPh5tcDCOtl8UQ3wUb4IkU7SeJD3xkKCPI3+1CAEBzcO4GeeIXHSmWDo9hnCkEoOMYmc2ch2DmnkK8DMMhX4OPkjIpxcif5UP-oA2sqJcS0X-uiS8kcG6XEZkEgx3C9a8MKqJJyadUJuQwhjexxCklKSvD6OsMpOn5H9usAirg3TYm-MsPsIc8iOECXo4Jhj25gAoBAGIDkkK1NcuhDyjSc6nhaYRdpGRF4BC2IA9ESRS6JA-MsXESUCRMFQCueAfQYwbOqkksY4CrxKUyNiY4l4y7rAmKiB6WQVQnLcIlQG+oqgJhYI8yWSJgHdMfOiRsX1LyrCom4Twlc+yPgMp2G8ANoFmUymBdKUKJ7NOui8pi1YPY-nfDTb8EUqLoivEsKYkwQpqXRIDGyxKIIZRgquGc8EoDQukS8wIip3m0q+QyuUWtFTfS2L-JsdUuUEpSkuXlVkoI2TsugMAoq8JjG7KiXIdYUTfUMjKSK2w-CxVvHeOq3KiWWR4nxCcHc8oFVJVjTZFKcjuEvFsGYixGHdjlR7d0vZXBRRvKXdI+KinEkZi3Q2IqyV+tGFFdqbpKZ0zqhiB8ix-xJqbrHZmrcjZ61WutFgm1tq7Ryoas8L5XpelFH9PsdUPb1npuqstIMK1ptgUnA1GannXTxMGXsdYFge2FBELSQosgUzNX2TIERLw6NTQnJanqu51p7kg5tSTjh43vI+bID5OwePWKXd6eIQ54jrH+LI9cdQwJKZMspJ7rqJEAeqDFCwhn0rCn20tsDSlcNCWg39FZNSAJCBizY3o6ogrxOM-tkHv3QcZtlOZ6xfUTtGI+DFjYCJ+HRNPQ4PSkRHOpac3If59JFCKEAA */
  id: 'botFSM',
  initial: 'bot_evaluating',
  states: {
    bot_evaluating: {
      on: {
        DRONE_EVALUATION_COMPLETE: [
          {
            target: '#botFSM.ship_idleAtBase',
            guard: 'needsMaintenanceAfterCollection',
            actions: 'prepareIdleAtBaseAfterCollection'
          },
          // fallback simple (autres cas)
          { target: '#botFSM.drone_exploring' }
        ],
        DRONE_EMERGENCY_DETECTED: { target: '#botFSM.drone_exploring.drone_returning', internal: false, actions: 'goToReturning' },
        SHIP_BASE_REACHED: { target: '#botFSM.ship_idleAtBase' },
        DRONE_TILE_EXPLORED: { target: '#botFSM.bot_evaluating' },
        SHIP_RESOURCE_COLLECTED: { target: '#botFSM.bot_evaluating' }
      }
    },
    drone_exploring: {
      initial: 'drone_deploying',
      states: {
        drone_deploying: {
          on: {
            DRONE_TILE_EXPLORED: {
              target: 'drone_onSite',
              actions: 'droneDeployForExploration'
            },
            DRONE_EMERGENCY_DETECTED: { target: 'drone_returning' }
          }
        },
        drone_onSite: {
          on: {
            DRONE_TILE_EXPLORED: {
              target: 'drone_onSite',
              actions: 'droneMarkTileExplored'
            },
            DRONE_EMERGENCY_DETECTED: { target: 'drone_returning' }
          }
        },
        drone_returning: {
          on: {
            DRONE_BASE_REACHED: {
              target: '#botFSM.ship_idleAtBase',
              actions: 'droneDockToShip',
              guard: "New guard"
            }
          }
        }
      }
    },
    ship_collecting: {
      initial: 'ship_movingToTarget',
      states: {
        ship_movingToTarget: {
          on: {
            SHIP_TILE_COLLECTED: {
              target: 'ship_onTile',
              actions: 'shipUpdatePosition'
            }
          }
        },
        ship_onTile: {
          on: {
            SHIP_RESOURCE_COLLECTED: {
              target: 'ship_onTile', // reste sur place tant qu'il y a à collecter
              actions: 'shipCollectsFromTile'
            },
            SHIP_INVENTORY_FULL: [
              {
                target: 'ship_returningToBase',
                guard: 'isAtMaxCapacity',
                actions: 'shipDepositResources'
              },
              { target: 'ship_onTile' }
            ],
            SHIP_EMERGENCY_DETECTED: {
              target: 'ship_returningToBase',
              actions: 'shipDepositResources'
            }
          }
        },
        ship_returningToBase: {
          on: {
            SHIP_BASE_REACHED: { target: '#botFSM.ship_idleAtBase', actions: 'shipDepositResources' }
          }
        }
      }
    },
    ship_idleAtBase: {
      initial: 'ship_waiting',
      states: {
        ship_waiting: {
          on: {
            SHIP_REFUEL_COMPLETE: { target: 'ship_ready', actions: 'prepareExploring' },
            SHIP_UNLOAD_COMPLETE: { target: 'ship_ready', actions: 'prepareExploring' },
            SHIP_REPAIR_COMPLETE: { target: 'ship_ready', actions: 'prepareExploring' },
            SHIP_MAINTENANCE_COMPLETE: { target: 'ship_ready', actions: 'prepareExploring' },
            SHIP_IDLE_TIMEOUT: { target: 'ship_ready', actions: 'prepareExploring' },
            DRONE_EMERGENCY_DETECTED: { target: '#botFSM.drone_exploring.drone_returning' }
          }
        },
        ship_ready: {
          on: {
            DRONE_EMERGENCY_DETECTED: { target: '#botFSM.drone_exploring.drone_returning' }
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
