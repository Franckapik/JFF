import { createMachine } from 'xstate';
import { BOT_STATES } from './constants/constants.js';

// Machine FSM minimale XState pour test
export const fsmMachine = createMachine({
  id: 'centralFSM',
  initial: BOT_STATES.EVALUATING,
  states: {
    [BOT_STATES.EVALUATING]: {
      on: {
        EVALUATION_COMPLETE: BOT_STATES.EXPLORING_DEPLOYING
      }
    },
    [BOT_STATES.EXPLORING_DEPLOYING]: {
      on: {
        TILE_EXPLORED: BOT_STATES.EVALUATING
      }
    }
  }
});

export default fsmMachine;
