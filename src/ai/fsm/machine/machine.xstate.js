import { createMachine, assign, log } from 'xstate';
import fsmLogger from '../../../logger/fsmLogger';

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgGIAlAUQGUSAVAfQGEB5AOUpIA1KBtABgF1FQADgHtY2AC7YhufiAAeiAIwBWAGwBOAHQrlADi4AWNWoDMKnfv0AaEAE9EagOz6NDgEwOlxrutV6FAX39rNCw8QgAxeiJaEmoySgBBFm4+JBBhUQkpGXkEJQdrOwRzHS0HD1c1V30FFRV9FUDgjBx8DTAAN1QAGwBXVAlcKAJ8SBJZAW6hACc8KBSZDPFJaTTc5QVSrm2FBSquJQMdQsRq52NDNW19Lh0lVwOdJpAQ1rB2rr6BuZGwSFohN1umB0IN5rxFiJltk1op7lsdnsHod9MdbIgVFwHFodE5PMZyoZcc9XmEPj1+mDfpAALKoPBiMC4VC4dBgBZpJZZVagXIqArohAKYyaG6uEX5CwOPT6EktMlgCZTWZDDQQaZSMDUCBgSZCGw-AAiRCYsVICVoAAlyNRKABJAAyJA5gih3JypwUNQ0XhUxlx3nc7hOCGMDw0rhUriUXsxej0SjloTair1Kqgao1+GosHQLNwRpNjFiZFoCUYZFtjudEM5bpWHoQkY8Wn0IvqmK9OjUIbDXAjUZjDVuI8TQRe8pTSpmc0zmuo0zAYl60wLQwIxtN1HNVptACEEhQXel6zDeXDbhptlxdvsUWiijoFGVDHUlDpcUo1MKk28NOhAWBUFZ1gHABGoZAhA6OZqDEIRYOwYECDIS07QABW3EgLWtSt7SdY8uQbWEmwUNwr0DBwb27VRhRDMxjA0L8jBjFQY0ohw1F-MkAKBEEwQ0UDsHAnigKpFD0OoB16ASQ1MLIegAFVonIAjTx5ORTjMVxGOMWobjcJR3wUOidAYpi1BYtisU48dSTaES+JAsCFyXFc12GcSMJ3HDqAPI9a1dTIiPPIV4XIm8kQOI4QwsJQrwUaMuFMap1D2YwuLaNAGXpdyBOcqRqAAI1QWBCE8uJEiIGhDRIND6DIO1OACk8grPDSEDFRi23KaVep0P1jBizEtHufRPC4VxaiMCwMveLLcDEHKnKE6gCuK0rkNQjD4gSKrMLQhI7SIVTWvU3JOqUbrylxG6BpDL9tNcbsrm-TFKK4GzmmTOacsWvBlvAtaSrKraKt2mhSHCBSSAdE7oTOxALquvrpTuwU3AYqonDuSpHAmscvr-ea-tynVCPXcqarqhqaAYGk0KdZJmsItrciuOKPoJTw9BFLwH0R4bWOqcbJvUNQZtsycfuy-7VUXAR6XTTaJNIA6jroeh6cZmtUkC+HG3Zq8TA8f0kpMW57qqCNntSt7tk+idvo0YmlrlsAADNejAbofnKyHoYdDWtaoHXIVOg3WKNrnTd5i30fFDQsdRe4jEo9xAnHXAhB1eA0jssAw-14iVBDABaFRwuvKvr3yWbyS+MFC-dYiEt0n1VGSiyPye+78kT-H9AcOoRTudLJad1NlTmJvgva0jTIjbwakjcXqgFIoEu0zwnCe1FKh51w68nmdVXVecyamA0hhn1nFFM58HnqBL1H0NeQyehiCSJbHVDUCaj+nOmOc2Zcz5mnnWcOxFxSUR9NGL0FxjBeEuiXQUH8fRODULiZO6h-7jz-MfIBZ9syLmXKucBetm4hSev1FwBIzB-yMAcCy78F5f0wT-HBh88HcUAo5a+ECi4hVIlcDQmwh6mA4hZcWMU7gaCwezGM3ZhRJTrg5YCqpBLgUgtBIYsF4ISGBDfBGQpzDODEX6fkzFpGCg7C4BKg9xbILMATR2f41H8U0dQdx5CWqCPauKBek0V7vgcMYTwdEGh2LXo4hozjVG8PURmTxJC3I+JZsYyoCd77aE8FUUyKCii2IcPYjiY1Yl3Dri7WWUAjGNkuu-KMid3Cv02JNCylTfquySflXARVga1JbhNGKMYXxhMwV+GoKjuGZU6dUtUup6z8IobPPk0ZGJPncI8QwT1XAxQTkPIktwUpMQ6TLXK8tFZpLUo2KMWwzDFPKDgpwg1BSGTimKV8VxTDXFOQtLpGhFye29lcyBIVbmiKMI4e4oTHDFJMtiAwOxdITWHgEDOQA */
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
    action_evaluating_entry: () => {},
    action_evaluating_exit: () => {},
    action_exploring_entry: () => {},
    action_exploring_exit: () => {},
    action_drone_deploying_entry: () => {fsmLogger.state('action_drone_deploying_entry');},
    action_drone_deploying_exit: () => {},
    action_drone_scanning_entry: () => {},
    action_drone_scanning_exit: () => {},
    action_drone_returning_entry: () => {},
    action_drone_returning_exit: () => {},
    action_collecting_entry: () => {},
    action_collecting_exit: () => {},
    action_ship_moving_to_tile_entry: () => {},
    action_ship_moving_to_tile_exit: () => {},
    action_ship_collecting_entry: () => {},
    action_ship_collecting_exit: () => {},
    action_ship_returning_entry: () => {},
    action_ship_returning_exit: () => {},
    action_maintaining_entry: () => {},
    action_maintaining_exit: () => {},
    action_ship_on_base_entry: () => {},
    action_ship_on_base_exit: () => {},
    action_ship_depositing_entry: () => {},
    action_ship_depositing_exit: () => {},
    action_ship_repairing_entry: () => {},
    action_ship_repairing_exit: () => {},
    action_ship_refueling_entry: () => {},
    action_ship_refueling_exit: () => {},
  }
});

