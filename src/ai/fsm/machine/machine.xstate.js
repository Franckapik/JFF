import { createMachine, assign, log } from 'xstate';
import fsmLogger from '../../../logger/fsmLogger';

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgDowA3VAGwFdUAXPKAYn0gFEAPABzIHsAnOgbQAMAXUSh2XWNlpdcYkK0QBGAKyCAbARUB2bQE4AzIfXb1AJj0AaEAE9EKpYILa1ggCxL1Bt2bOCl2gC+gdZoWHiEJORUtLgMTBAAwlxkZGDosVBCokggElIycrmKCEpuepo6+kYGJuZWtoh+mtrlhioVABxmbl7BoRg4+ESklDR0jGCQALKoeNRguKi46GDZ8vnS2LLyJSpm1nYIZgYqWm1upz4Wgp39IGFDkRzcfHEEEDyyYAD6EGCcLg2CYAEQASgB5AByzB+YOYAEFEgAJZgAZR+ABUAJIAGWY61ym0KuyaSgMSgI6k62gMvjMSk6Bn8B0aCBUXgIem5ek6nQqdME+3ujwiRBevDoHy++B+sHQy1woMhMJ+aMSCKhGJx+MJ4kkWx2xSa6hMzk6SnJOgcel6h3snJ5vP5Xj8wpCD0GYrAEreUGl3x+PDA1AoPCVcXo4OhsPhSNRGIAQgi0QSRBsDSTjaU1JVdIZjKYLPaENS9AQ2npLeoVAYaUo9CKvcN0Ck0hkpbAcOwfsguMQ6D9qFwh9g0vQ0cjsQAFOGIlHorF4tM5fUFbZFUAlBk+AgGVr6bQWbSWzolszqJyCa-+Ny3S90u4e0UttvpTIELvYHut1LviaTjOPy4hCCIgnOaIQgAqmCiTonqeSZhupLHDWbhUienRtPmbjaOel4EDet73oIj5NuEr5-h27xfj2wahuGAFTrOcYLkmKYrhm65GluyjlHm1SFvUJa0uWTrlByeimLy5FPAQaDzHMEb+rRPyyD8ABGqCwGAE7MWqmIImCmI-CCzDThCaLYpiCHEsh2Z1toVJmK4KhqPmeiskctYGM4PLlBYJxuL0sligpuDUEpnbdmpuCadpumAbOaKGcZc7Tgi2JgrZSE8QoiCOc5rnufonklqaZwWNyFJlGYWGNs+zaEOFkV4NF36xfFOl6UBKVGSZ8IAGJQcwuI5dxm75QghXmMVggeV5iD6C0PIcioLpuqFwwtVF7z-HZkZJaZ5mWdZPyJBC0zTvimKcUSuWTSUegOFy+4eF0lxMgY5VlH5vKGL46jPZaW3NUprXKQQwbsHMfo9Sx5mZWC52XddzC3eNhqPYgwOva0DbUp9BjfWyFUEFVhiWj4WH8qD8ng7t-rBgAZhQYBkExQFDSNuIo1dN13WuWMobjhj4x9dbEyJqh-RUehCjSvQNR6uBcP88C5C+YBccL2YALQNEces9HTURjJkOtZrxpQMuWnQdATLlKG6eGk24Zz1XyVb29yuim76dCW-Z1sBLSFZYSc60+KonTqCWtROa4ggnHLJx1m4-uAn6Aayvt3DAnEQd5SUjIMuHPinBHMdx2y+ydIRN6eNyHT+A1AwUc8WdSp8gbyoqgf3RNKEnOYe4O+obidMnhj7iWdcN9eTfPfLDaZ683cyr89FhspRfY8cfJOLWjimBoZRuXPdUL-4QPL63dO-u2FuD7rIemJo7sWCYLm3GYR7lb5Ss6hGTNz-qvRqHcCCP3-DRGKfYBxxCHCOWgaQ94oUZL9T+FQjxqG6P-NkvhfJOhUAFYBz0TYQLktA6iKkYrUOfkLK2U1I6VXKLoAI14aauyOIQrkq1SENn2BnShYp6HtToiGHeA9GHB2YfyJy5hyhXHmm6c8Jw+HNwEeQ4R7c5I7TaoXF+TCShGHjvucm-l5rJ0cMAnRnpIH6MhqpdSWkdJoOzDSS+ZwTDlHmjUC8Jg6aOO7gCJChiZHF0QMAswe46q3ApG5P+DISxsNlsTI8NJWhmCCQzAxTMASw2kYhIe2ZbEEG6NPDhU9bzlQsBY7kqgdCeW0LHHJik8lQzAKzdmRS7KRNLL9Z6zIK4eDUNyESBFSq8l6IQgI2TgiBCAA */
  id: 'machine',
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
  }
}, {
  guards: {
    shouldExplore: (context, event) => {
      // Exemple : autorise la transition seulement si context.energy > 0
      console.log('shouldExplore', context);
      return true;
    },
    shouldCollect: (context, event) => {
      // Exemple : autorise la transition seulement si context.cargo > 0
      return context.cargo > 0;
    },
    shouldMaintain: (context, event) => {
      // Exemple : autorise la transition seulement si context.needsMaintenance === true
      return context.needsMaintenance === true;
    }
  },
  actions: {
    updateContext: assign((ctx, event) => ({ ...ctx, ...event })),
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

