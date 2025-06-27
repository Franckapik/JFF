import { createMachine, assign, log } from 'xstate';
import fsmLogger from '../../../logger/fsmLogger';

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgGIAlAUQGUSAVAfQGEB5AOUpIA1KBtABgF1FQADgHtY2AC7YhufiAAeiAIwBWAGwBOAHQrlADi4AWNWoDMKnfv0AaEAE9EagOz6NDgEwOlxrutV6FAX39rNCw8QgAxeiJaEmoySgBBFm4+JBBhUQkpGXkEJQdrOwRzHS0HD1c1V30FFRV9FUDgjBx8DTAAN1QAGwBXVAlcKAJ8SBJZAW6hACc8KBSZDPFJaTTchWMnDS5NnQUqpSUdVx1jQsRXY1ctfXyuJwtamqaQENawdq6+gbmRsEhaEJut0wOhBvNeIsRMtsmtFEoTtsuFwFPtXFwlAYdOcECp7lodE5PJsnGpCS83mFPj1+uC-pAALKoPBiMC4VC4dBgBZpJZZVagXIqAq2RTGTT6LiXNT5CwOPT6CktKlgCZTWZDDQQaZSMDUCBgSZCGy-AAiRCYsVICVoAAlyNRKABJAAyJB5gmh-JyFwUNQ0XhUxkJ3nc7hxVy4GlcKlcSj9eL0eiUStCbVVRo1UC1Ovw1Fg6A5uDNFsYsTItASjDIjtd7shvK9Kx9CBjHhu4vqeL9OjUEfR0dj8YaXCTGNT73aapmcxzuuo0zAYl602LQwI5st1GtdodACEEhQPekm7DBfDR0iUWiMVicXsyoY6kdCUo1BsJ1T0ECQWDZ7AcAEahkCEDo5moMQhAg7AQQIMhbSdAAFbcSBte0a2dN1jz5Zs4VbBQ3CRWMHBRXtVA2HEzGMDQ3yMeMVHjEiHDUT82m-YFQXBDQAOwID2N-Ol4KQ6gXXoBJTRQsh6AAVWichsNPAU5AuMxrk8J57jjI4FEo04aKMGVakY+4WKCV5lTYn9OP-QCFyXFc12GITkJ3dDqAPI8G09TJcPPBBlERZFryqW99GxUUEAsJRtgUOMdljBp3xMViPjQFlmUc7jbKkagACNUFgQhnLiRIiBoU0SEQ+gyCdTgvJPHyz2UyKpRo-QSXlTqdCDM4IpHLQEVuLxXFqIwLBSjQ0twMQMps3jqBy-LCrghDkPiBIypQxCEidIgFMapTcklNT2vKLr5R6nE32uE4jHUWp7mRUzmjTVKMpmvA5qAxaCqK1aSo2mhSHCaSSBdfaYUOxBjrajrCXhy6IrcaiqicHQESMEi4wmqaPsyg0cPXYqKqqmqaAYBlELdZJ6pwprcjUBjthMDxgx2ExRxxfqGOqTwpVGtRxrMyk2lx2bNUXARmSzFbhNIbbdroehKep+tUm8yGW0Z6KuBZzw9HFLxwqKa7o17Rn3zxEjdZx97xezRcADNejAbpfmK4HQZdJWVaoNWoQOrWmd1zZ9fZo2cWRjRUbCjHHClBxAjM3AhANeA0hFsAA81vCVBxABaFQr3uAK8WMQx4wmzoaR+IZs+9PDYuMBQA1UUxKhfE4rvyaOpSUfQHDqcV0eMKvpyzevfOagi9PRepYvUfRqhFIpYrUzYLBMP0B7jRPhYsj4M3VWdtXnAmphNOvG0DxvThbueahjQXl5xE5qI3sk0dUNQpTHzMT9zHqAsRY5iT3phcTYUYrjDnLsYLw-c84RTfgGUkhJY7qF-vvV6U5-6alPnmRcy5VygOvjnPyJxuouE2GYH+RgMQylfnpD+aD0YYNcBNfi1kr4awbn5AijMNAKEJEGYUdFBZc3RhoNBdDDgOD9JiFMWDJycL-JqHiQEQJgSGBBKCEgQRgKhv5cwzghGD1MMxGU4iIpdhcLFAegsEFmEUS9ZRVlVHZnUdQFR4IDEtkuLPBeMpCTGE8JRBotjl4OIaE4jhbiuKeMIQ5EhPCp65EqJcKRzdtCeCqKcRBRQbFyMibcaJ6NbbpU+twhqZDmr91frGaO7hDBojkaYdq5Tpr2yyvNH6hVfGNylFzeMj4QlkjfDUHYHS8Yn0NE2KpdNDFDhonsdwGJzC5NcFzDJg9DBJmqAxIwUyumS2lsk6pvDmqxlKN4QkBFB4-ycL1E2hwNDHSfIzUw2hFRKKpGLSpDswDO1dmchZLYrmCIMhUBw4pyg6WsYSbYkoUTNylEPAIScgA */
  id: 'machine',
  
  // 🔧 CORRECTIF CRITIQUE : Traiter l'input pour initialiser le contexte
  context: ({ input }) => {
    console.log('[Machine] Initializing context with input:', input);
    return input || {};
  },
  
  initial: 'evaluating',
  states: {
    evaluating: {
      entry: { type: 'action_evaluating_entry' },
      exit: { type: 'action_evaluating_exit' },
      on: {
        needExploring: {
          target: 'exploring',
          guard: 'shouldExplore',
          actions: 'updateContext'
        },
        needCollecting: {
          target: 'collecting',
          guard: 'shouldCollect',
          actions: 'updateContext'
        },
        needMaintenance: {
          target: 'maintaining',
          guard: 'shouldMaintain',
          actions: 'updateContext'
        },
      }
    },
    exploring: {
      entry: { type: 'action_exploring_entry' },
      exit: { type: 'action_exploring_exit' },
      initial: 'drone_deploying',
      states: {
        drone_deploying: {
          entry: { type: 'action_drone_deploying_entry' },
          exit: { type: 'action_drone_deploying_exit' },
          on: {
            DRONE_REACHES_TILE: 'drone_scanning'
          }
        },
        drone_scanning: {
          entry: { type: 'action_drone_scanning_entry' },
          exit: { type: 'action_drone_scanning_exit' },
          on: {
            DRONE_SCANS_TILE: 'drone_returning'
          }
        },
        drone_returning: {
          entry: { type: 'action_drone_returning_entry' },
          exit: { type: 'action_drone_returning_exit' },
          on: {
            DRONE_REACHES_BASE: '#machine.evaluating'
          }
        }
      }
    },
    collecting: {
      entry: { type: 'action_collecting_entry' },
      exit: { type: 'action_collecting_exit' },
      initial: 'ship_moving_to_tile',
      states: {
        ship_moving_to_tile: {
          entry: { type: 'action_ship_moving_to_tile_entry' },
          exit: { type: 'action_ship_moving_to_tile_exit' },
          on: {
            SHIP_REACHES_TILE: 'ship_collecting'
          }
        },
        ship_collecting: {
          entry: { type: 'action_ship_collecting_entry' },
          exit: { type: 'action_ship_collecting_exit' },
          on: {
            SHIP_LOAD_RESOURCES: 'ship_returning'
          }
        },
        ship_returning: {
          entry: { type: 'action_ship_returning_entry' },
          exit: { type: 'action_ship_returning_exit' },
          on: {
            SHIP_REACHES_BASE: '#machine.evaluating'
          }
        }
      }
    },
    maintaining: {
      entry: { type: 'action_maintaining_entry' },
      exit: { type: 'action_maintaining_exit' },
      initial: 'ship_on_base',
      states: {
        ship_on_base: {
          entry: { type: 'action_ship_on_base_entry' },
          exit: { type: 'action_ship_on_base_exit' },
          on: {
            SHIP_START_DEPOSIT: 'depositing',
            SHIP_START_REPAIR: 'repairing',
            SHIP_START_REFUEL: 'refueling'
          }
        },
        depositing: {
          entry: { type: 'action_ship_depositing_entry' },
          exit: { type: 'action_ship_depositing_exit' },
          on: {
            SHIP_DEPOSIT_COMPLETE: '#machine.evaluating'
          }
        },
        repairing: {
          entry: { type: 'action_ship_repairing_entry' },
          exit: { type: 'action_ship_repairing_exit' },
          on: {
            SHIP_REPAIR_COMPLETE: '#machine.evaluating'
          }
        },
        refueling: {
          entry: { type: 'action_ship_refueling_entry' },
          exit: { type: 'action_ship_refueling_exit' },
          on: {
            SHIP_REFUEL_COMPLETE: '#machine.evaluating'
          }
        }
      }
    }
  },
  on: {
    RESET_CONTEXT: {
      actions: 'resetContext'
    },
    FORCE_STATE: {
      target: '#machine.evaluating',
      actions: 'updateContext'
    }
  }
}, {
  guards: {
    shouldExplore: (context, event) => {
      // Exemple : autorise la transition seulement si context.energy > 0
      console.log('shouldExplore guard called with context:', context);
      return true;
    },
    shouldCollect: (context, event) => {
      // Exemple : autorise la transition seulement si context.cargo > 0
      console.log('shouldCollect guard called with context:', context);
      return context.cargo > 0;
    },
    shouldMaintain: (context, event) => {
      // Exemple : autorise la transition seulement si context.needsMaintenance === true
      console.log('shouldMaintain guard called with context:', context);
      return context.needsMaintenance === true;
    }
  },
  actions: {
    updateContext: assign((ctx, event) => {
      console.log('[FSM] updateContext - Previous context:', ctx);
      console.log('[FSM] updateContext - Event received:', event);
      const updatedContext = { ...ctx, ...event };
      console.log('[FSM] updateContext - New context:', updatedContext);
      return updatedContext;
    }),
    resetContext: assign((ctx, event) => {
      console.log('[FSM] resetContext called - Replacing context with event data');
      // Reject type property from the event to avoid XState errors
      const { type, ...newContext } = event;
      return newContext;
    }),
    action_evaluating_entry: ({ context, self }) => {
      logAction('action_evaluating_entry');
      
      // Évaluation des conditions environnementales
      const vehicle = context?.vehicle || {};
      const fuel = vehicle.fuel || 100;
      const damage = vehicle.damage || 0;
      const resources = vehicle.resources || { food: 0, debris: 0, special: 0 };
      const maxCapacity = vehicle.maxCapacity || { food: 200, debris: 1800, special: 3 };
      
      // Vérifier si maintenance nécessaire (priorité 1)
      const needsMaintenance = fuel < 30 || damage > 50 || vehicle.needsRepair;
      
      // Vérifier si collecte possible (priorité 2)
      const knownTiles = context.memory?.knownTiles || new Map();
      const tilesWithResources = Array.from(knownTiles.values()).filter(tile => 
        tile.explored && tile.hasResources && tile.resourcePercentage > 0
      );
      const hasCollectibleTiles = tilesWithResources.length > 0;
      
      // Vérifier capacité du vaisseau
      const totalResources = Object.values(resources).reduce((sum, val) => sum + val, 0);
      const totalCapacity = Object.values(maxCapacity).reduce((sum, val) => sum + val, 0);
      const isShipNotFull = totalResources < totalCapacity * 0.8;
      
      // Vérifier si exploration nécessaire (priorité 3)
      const exploredTilesCount = Array.from(knownTiles.values()).filter(tile => tile.explored).length;
      const needsExploration = exploredTilesCount < 3; // Explorer au moins 3 tuiles
      
      console.log('[Evaluating] Conditions:', {
        fuel, damage, needsMaintenance,
        hasCollectibleTiles, isShipNotFull,
        exploredTilesCount, needsExploration
      });
      
      // Décision basée sur les priorités
      setTimeout(() => {
        if (needsMaintenance) {
          console.log('[Evaluating] → needMaintenance (fuel/damage critical)');
          self.send({ type: 'needMaintenance', reason: 'critical_condition' });
        } else if (hasCollectibleTiles && isShipNotFull) {
          console.log('[Evaluating] → needCollecting (resources available)');
          self.send({ type: 'needCollecting', reason: 'resources_available' });
        } else if (needsExploration) {
          console.log('[Evaluating] → needExploring (need more exploration)');
          self.send({ type: 'needExploring', reason: 'insufficient_exploration' });
        } else {
          console.log('[Evaluating] → needMaintenance (nothing to do)');
          self.send({ type: 'needMaintenance', reason: 'idle_time' });
        }
      }, 1000); // Délai de 1s pour permettre à l'état de s'initialiser
    },
    action_evaluating_exit: () => logAction('action_evaluating_exit'),
    action_exploring_entry: () => logAction('action_exploring_entry'),
    action_exploring_exit: () => logAction('action_exploring_exit'),
    action_drone_deploying_entry: () => logAction('action_drone_deploying_entry'),
    action_drone_deploying_exit: () => logAction('action_drone_deploying_exit'),
    action_drone_scanning_entry: () => logAction('action_drone_scanning_entry'),
    action_drone_scanning_exit: () => logAction('action_drone_scanning_exit'),
    action_drone_returning_entry: () => logAction('action_drone_returning_entry'),
    action_drone_returning_exit: () => logAction('action_drone_returning_exit'),
    action_collecting_entry: () => logAction('action_collecting_entry'),
    action_collecting_exit: () => logAction('action_collecting_exit'),
    action_ship_moving_to_tile_entry: () => logAction('action_ship_moving_to_tile_entry'),
    action_ship_moving_to_tile_exit: () => logAction('action_ship_moving_to_tile_exit'),
    action_ship_collecting_entry: () => logAction('action_ship_collecting_entry'),
    action_ship_collecting_exit: () => logAction('action_ship_collecting_exit'),
    action_ship_returning_entry: () => logAction('action_ship_returning_entry'),
    action_ship_returning_exit: () => logAction('action_ship_returning_exit'),
    action_maintaining_entry: () => logAction('action_maintaining_entry'),
    action_maintaining_exit: () => logAction('action_maintaining_exit'),
    action_ship_on_base_entry: () => logAction('action_ship_on_base_entry'),
    action_ship_on_base_exit: () => logAction('action_ship_on_base_exit'),
    action_ship_depositing_entry: () => logAction('action_ship_depositing_entry'),
    action_ship_depositing_exit: () => logAction('action_ship_depositing_exit'),
    action_ship_repairing_entry: () => logAction('action_ship_repairing_entry'),
    action_ship_repairing_exit: () => logAction('action_ship_repairing_exit'),
    action_ship_refueling_entry: () => logAction('action_ship_refueling_entry'),
    action_ship_refueling_exit: () => logAction('action_ship_refueling_exit'),
  }
});

// Generic logging function for FSM actions
const logAction = (actionName) => {
  fsmLogger.state(actionName);
};

