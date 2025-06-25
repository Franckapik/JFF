import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';

// Machine FSM XState - structure fidèle à la version robot3
export const fsmBotMachine = createMachine({
  id: 'botFSM',
  initial: BOT_STATES.EVALUATING,
  states: {
    [BOT_STATES.EVALUATING]: {
      on: {
        EVALUATION_COMPLETE: { target: BOT_STATES.EXPLORING_DEPLOYING },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING },
        EMERGENCY_DETECTED: { target: BOT_STATES.EXPLORING_RETURNING },
        BASE_REACHED: { target: BOT_STATES.IDLE_AT_BASE },
        AREA_EXPLORED: { target: BOT_STATES.EVALUATING },
        RESOURCE_COLLECTED: { target: BOT_STATES.EVALUATING }
      }
    },
    [BOT_STATES.EXPLORING_DEPLOYING]: {
      on: {
        AREA_EXPLORED: { target: BOT_STATES.EVALUATING },
        EMERGENCY_DETECTED: { target: BOT_STATES.EXPLORING_RETURNING },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING }
      }
    },
    [BOT_STATES.EXPLORING_RETURNING]: {
      on: {
        BASE_REACHED: { target: BOT_STATES.IDLE_AT_BASE },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING }
      }
    },
    [BOT_STATES.COLLECTING]: {
      on: {
        RESOURCE_COLLECTED: { target: BOT_STATES.EVALUATING },
        INVENTORY_FULL: { target: BOT_STATES.COLLECTING_RETURNING_TO_BASE },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING },
        EMERGENCY_DETECTED: { target: BOT_STATES.EXPLORING_RETURNING }
      }
    },
    [BOT_STATES.COLLECTING_MOVING_TO_TARGET]: {
      on: {
        TILE_COLLECTED: { target: BOT_STATES.COLLECTING },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING }
      }
    },
    [BOT_STATES.COLLECTING_RETURNING_TO_BASE]: {
      on: {
        BASE_REACHED: { target: BOT_STATES.IDLE_AT_BASE },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING }
      }
    },
    [BOT_STATES.IDLE_AT_BASE]: {
      on: {
        REFUEL_COMPLETE: { target: BOT_STATES.EVALUATING },
        UNLOAD_COMPLETE: { target: BOT_STATES.EVALUATING },
        REPAIR_COMPLETE: { target: BOT_STATES.EVALUATING },
        MAINTENANCE_COMPLETE: { target: BOT_STATES.EVALUATING },
        IDLE_TIMEOUT: { target: BOT_STATES.EVALUATING },
        MANUAL_OVERRIDE: { target: BOT_STATES.EVALUATING },
        EMERGENCY_DETECTED: { target: BOT_STATES.EXPLORING_RETURNING },
        EXPLORATION_REQUESTED: { target: BOT_STATES.EXPLORING_DEPLOYING }
      }
    }
  }
});

export default fsmBotMachine;
