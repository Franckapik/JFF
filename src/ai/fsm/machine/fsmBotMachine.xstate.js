/*
FSM XState v5 – Archite6. Exemple d'utilisation :
   - Pour déclencher une collecte depuis l'état IDLE_AT_BASE.READY :
     - La machine transitera automatiquement vers l'état COLLECTING.MOVING_TO_TARGET après évaluation
     - Les transitions suivantes sont gérées automatiquement selon les événements reçus et les guards/actions factorisés.e migrée et factorisée (SYNTHÈSE)
=============================================================

1. États composés (hierarchiques) :
   - Les états complexes (EXPLORING, COLLECTING, IDLE_AT_BASE) sont des états composés avec sous-états explicites.
   - Exemple :
     - EXPLORING → DEPLOYING, ON_SITE, RETURNING
     - COLLECTING → MOVING_TO_TARGET, ON_TILE, RETURNING_TO_BASE
     - IDLE_AT_BASE → WAITING, READY

2. Factorisation des actions et guards :
   - Toutes les actions métier sont importées depuis des modules factorisés (ex : shipCollectingActions, droneExploringActions).
   - Les guards (conditions de transition) sont factorisés (ex : efficiencyGuards) et injectés dans la config XState.

3. Transitions explicites :
   - Chaque sous-état gère ses propres transitions métier (ex : TILE_COLLECTED, INVENTORY_FULL, EMERGENCY_DETECTED).
   - Les transitions globales (ex : EMERGENCY_DETECTED) sont accessibles depuis plusieurs états.

4. Centralisation du contexte :
   - Les reducers de contexte (contextReducers) sont utilisés pour préparer les transitions et mettre à jour l’état global.

5. Extensibilité et testabilité :
   - La structure modulaire permet d’ajouter facilement de nouveaux sous-états, guards ou actions.
   - La migration est progressive et chaque état/sous-état peut être testé indépendamment.

6. Exemple d’utilisation :
   - Pour déclencher une collecte :
     - Envoyer l’événement START_COLLECTING depuis IDLE_AT_BASE.READY → active COLLECTING.MOVING_TO_TARGET
     - Les transitions suivantes sont gérées automatiquement par la machine selon les événements reçus et les guards/actions factorisés.

Voir FSM_MIGRATION_PLAN_XSTATE.md pour le plan détaillé et les exemples de migration.
*/

// EVENTS FSM PRINCIPAUX (voir transitions ci-dessous)
// --------------------------------------------------
// EVALUATION_COMPLETE : Fin d'une phase d'évaluation, décision prise (explorer, collecter, maintenance...)
// EMERGENCY_DETECTED  : Détection d'une urgence (panne, danger, fuel bas, etc.)
// BASE_REACHED        : Le bot a atteint la base (fin de retour, ou début de maintenance)
// TILE_EXPLORED       : Une tuile a été explorée (exploration drone terminée)
// RESOURCE_COLLECTED  : Une ressource a été collectée (collecte sur tuile)
// TILE_COLLECTED      : Une tuile a été collectée (fin d'action sur une tuile)
// INVENTORY_FULL      : L'inventaire du bot est plein (nécessite retour/dépôt)
// REFUEL_COMPLETE     : Fin du ravitaillement en carburant
// UNLOAD_COMPLETE     : Fin du déchargement des ressources
// REPAIR_COMPLETE     : Fin de la réparation
// MAINTENANCE_COMPLETE: Fin de la maintenance générale
// IDLE_TIMEOUT        : Timeout d'inactivité à la base
//
// Les événements sont envoyés par la logique métier, l'UI, ou les capteurs du bot.

import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';
import { contextReducers } from './reducers/context.js';
import { efficiencyGuards } from './guards/efficiencyGuard.js';
import { shipCollectingActions } from './actions/core/shipCollectingActions.js';
import { droneExploringActions } from './actions/core/droneExploringActions.js';

// Machine FSM XState - structure fidèle à la version robot3
export const fsmBotMachine = createMachine({
  id: 'botFSM',
  initial: BOT_STATES.EVALUATING,
  states: {
    [BOT_STATES.EVALUATING]: {
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
        EMERGENCY_DETECTED: { target: '#botFSM.exploring.RETURNING', internal: false, actions: { type: 'goToReturning' } },
        BASE_REACHED: { target: '#botFSM.idleAtBase' },
        TILE_EXPLORED: { target: '#botFSM.evaluating' },
        RESOURCE_COLLECTED: { target: '#botFSM.evaluating' }
      }
    },
    [BOT_STATES.EXPLORING]: {
      initial: 'DEPLOYING',
      states: {
        DEPLOYING: {
          on: {
            TILE_EXPLORED: {
              target: 'ON_SITE',
              actions: 'droneDeployForExploration'
            },
            EMERGENCY_DETECTED: { target: 'RETURNING' }
          }
        },
        ON_SITE: {
          on: {
            TILE_EXPLORED: {
              target: 'ON_SITE',
              actions: 'droneMarkTileExplored'
            },
            EMERGENCY_DETECTED: { target: 'RETURNING' }
          }
        },
        RETURNING: {
          on: {
            BASE_REACHED: { target: '#botFSM.idleAtBase', actions: 'droneDockToShip' }
          }
        }
      }
    },
    [BOT_STATES.COLLECTING]: {
      initial: 'MOVING_TO_TARGET',
      states: {
        MOVING_TO_TARGET: {
          on: {
            TILE_COLLECTED: {
              target: 'ON_TILE',
              actions: 'shipUpdatePosition'
            }
          }
        },
        ON_TILE: {
          on: {
            RESOURCE_COLLECTED: {
              target: 'ON_TILE', // reste sur place tant qu'il y a à collecter
              actions: 'shipCollectsFromTile'
            },
            INVENTORY_FULL: [
              {
                target: 'RETURNING_TO_BASE',
                guard: 'isAtMaxCapacity',
                actions: 'shipDepositResources'
              },
              { target: 'ON_TILE' }
            ],
            EMERGENCY_DETECTED: {
              target: 'RETURNING_TO_BASE',
              actions: 'shipDepositResources'
            }
          }
        },
        RETURNING_TO_BASE: {
          on: {
            BASE_REACHED: { target: '#botFSM.idleAtBase', actions: 'shipDepositResources' }
          }
        }
      }
    },
    [BOT_STATES.IDLE_AT_BASE]: {
      initial: 'WAITING',
      states: {
        WAITING: {
          on: {
            REFUEL_COMPLETE: { target: 'READY', actions: 'prepareExploring' },
            UNLOAD_COMPLETE: { target: 'READY', actions: 'prepareExploring' },
            REPAIR_COMPLETE: { target: 'READY', actions: 'prepareExploring' },
            MAINTENANCE_COMPLETE: { target: 'READY', actions: 'prepareExploring' },
            IDLE_TIMEOUT: { target: 'READY', actions: 'prepareExploring' },
            EMERGENCY_DETECTED: { target: '#botFSM.exploring.RETURNING' }
          }
        },
        READY: {
          on: {
            EMERGENCY_DETECTED: { target: '#botFSM.exploring.RETURNING' }
          }
        }
      }
    }
  }
}, {
  guards: {
    ...efficiencyGuards,
    needsMaintenanceAfterCollection: (context, event) => {
      // Extrait du guard robot3
      const needsMaintenance = context.vehicle?.fuel < 30 || 
                              context.vehicle?.damage > 50 ||
                              context.vehicle?.needsRepair;
      const justReturnedFromCollection = context.lastStateChange === 'returned_to_base_after_collection';
      return needsMaintenance && justReturnedFromCollection;
    }
  },
  actions: {
    ...shipCollectingActions,
    ...droneExploringActions,
    prepareIdleAtBaseAfterCollection: (context, event) => {
      // Extrait du reduce robot3 (simplifié, sans logger)
      return contextReducers.stateTransitionReducers.prepareIdleAtBase(context, {
        reason: 'maintenance_required_after_collection'
      });
    }
  }
});

export default fsmBotMachine;
