import { assign } from 'xstate';

import { MACHINE_EVENT_TYPES } from '../../../types/events.d.ts';
import allActions from '../actions/index.ts';

export const globalEventHandlers = {
  [MACHINE_EVENT_TYPES.SHIP_POSITION_UPDATE]: {
    actions: assign(({ context, event }) => {
      return allActions.updateShipPosition(context, event);
    })
  },
  [MACHINE_EVENT_TYPES.DRONE_POSITION_UPDATE]: {
    actions: assign(({ context, event }) => {
      return allActions.updateDronePosition(context, event);
    })
  },
  [MACHINE_EVENT_TYPES.DRONE_INITIALIZE_REQUEST]: {
    actions: assign(({ context, event }) => {
      return allActions.processDroneInitRequest(context, event);
    })
  }
};