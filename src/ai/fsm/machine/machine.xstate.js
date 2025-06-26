import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';
import { contextReducers } from './reducers/context.js';
import { efficiencyGuards } from './guards/efficiencyGuard.js';
import { shipCollectingActions } from './actions/core/shipCollectingActions.js';
import { droneExploringActions } from './actions/core/droneExploringActions.js';

// Machine FSM XState - structure fidèle à la version robot3
export const fsmBotMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMD2AXAYgZQLIDowA3AQwBsBXE9ASwDsoBiAUQDUBBAGQFV2AVAJIB5AHIB9AMJDcABU7M+zANoAGALqJQAB1SwatVHU0gAHogCsK-ACYAzCoAsKgJwAOBwDZnAdg-fz5gA0IACeiB7WHvgAjNGuts7ODtbO5s4qtgC+mcFoWHiEpJTU9ExsXLyCopLScgrK0RpIIDp6BkbNZggRwWEI0d623jEqrm7m0SrRHo7e2bkYOATE5FS0DCy4zABKAOLMIhIAmmIAIvUSiqeqTdq6+jSGxl3m1r2IA67DM67u3knOWyuDzmeYgPJLQqrEobABC7GwzDE22Y7AkAAlmNd1MZWg8np0PslzPgQb5Aa9bJYPA53gh-s58A4HJNJuYvBEHK4wRCCitiusmIJ5GJmAANORCFHY24te7tZ5E7wOEZDWweDzA1wZOnRBzDUbWfXWaLWUa2OwOHmLPlFNalRgo7BCbjbCRIqSceSXLE3XHyx4dUBdWJGmwOJIzNLePXON6hRCuaL4V4qKYZBIDIbRa35ZYmLRkVAAJ1K+AgYELqBCDuFSPFkulfuaeIVhP6RpV1ncwNNEQmKm8uv1yYclnSJv1-3VuchYALRdLDHLlaLNY2zC2ewOxzOFyuzbubUDio7zJsPY8fesA6HCY72psRuVzlN1ms3mss75C5LZcM2D6GAjB1qKEqcFKvo4i2AYEsGRLuDEr4WjG0TmN4PbDmm+A+J42rmJ40xZDk4I2vmVZLlA+AAUBmw7PshwnOcig+jK-rHnBpgfF41g4ehAwBK4ExJvGfRoVMTIfrYY5fG+prfuRi5lsWYDoBQxZ0A68KIsiqIYlBsqtie7aTKJiDpLY+DApyDi2PY+pjAp+AAMaoGQZBgM5gr4AAtqgRClHwqB8CQxYwOgIECCKnrege0FHviQZcQgRq8a43ZmqZ8QYcCdK2VEEY0uyUxxA5VokbyBCue5nneYYfA0B5jrMM6rrujUXrMKxh5yhxSVdJ4Kogh40nJJ+NJfHefTqlEUxuDS0T2R+zhOdVHlef+dANU1AgiKwBx8FKJyYNwXo9UZnFdIMlnpCNlgYd4Ma0veY5WERcTmNZcZfB4q1uetdVbY1wG7ftIiHdsx2nZwSiNOxiWnrZyZplMdl9leJp0rYaEptEbjeCoaTslecwVWRLn-bVm3bcBm70TuTH7gZ8NtvB9J2ThKh3YOk16ljBE2Ky3Zci4Al-TVG3LipakaYFqCwiQsDAdpSIomimJsTBfWnqaiRWbZN5pBqAwYXlyQ4YtcReMyniPU5NAQB57DoArSv4AA7iQDwbCiJ3MJwNSyPIijnbB-UfM4USvmm8RGtJ2qLbqCQks+GEyQ9gz247YDO67YAe17gqMNwIgQewpyB3UIfxb1CMmZHFsxxatki4n96xsmmWTHZDnocRCx5vgDtOy7iv5573tMCiMjsAI2yV8Hyg1xd4f9A30fmnHre2Lqn3DGhLIzNdWrlQPkLDzno9uxPRe4LP4MHOwhwerUi+h9r9dR5Mm8twnO-t5qSykxPxxFiPjVIWcR55wLpPRgAhTgikEFsF0fB351zZnjL+Tct5-11CkRkKRmQgnShhHw-dSKDwvrnMeMCi5023IxPcLE4qGTDqeQYb0XBAhUGaDIcddQuCiGkbsExAQ-RjJAy+0CVIkAgCEOiDDdzMS6iwlmxk2YcJGGInhaZm7-zEnqA0cYfBXijHEbIJE6CoArPAZolU1GXUQAAWivPgFwaZ+wRA-FzTwdInEkh8IkMYyQvDxEjuQyqUIBSlAcavL4lluyJAJikSI-hXB0n8CqL4KRNSOGmOYOyTl5wURiVrdByVgFWEGA9QcaZvrOF1HjXin4uTWwJoaUmZ8fwlOXBWKs64oCxJ1rEVw+BqlfFqS4RJeCvgxBZAkFI9g7DoSKb+Si1E6CAXQGAIZJlXjDHQiyNO+oj7PTEpYZMcZlS+EEmaAiqyelUWlupTSDBdkYKSMMYE6oWS2XcAEfRHxuxVKNFedwVJuwYXFgDUpCVWbJSNHSd8oy5r-JjDMQmPDoVU2XH5AKDAgohTCqpd5yVPx5TSGMuwhMLTakjjebFksqL1WBqSl4JomQFPwcqU0IC8oahwhw14ZppLLNBGTQea0cVPNUi8uWec2UfFGMmbGJpgSfgJuqIIL0BWLR8HECZ7i7CSOoUrRVCAnGLTcekLmN4vEExpB4PBsQxlJGbgnQYgITVX3HoXWFtd4VdGkpzRIQxbKPUWQRXUPEUzZRjDwpw8RvXSLALIvocL1HJRHG4vGAw4gWiWUJXeepJL+C8MY-G5VshAA */
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
