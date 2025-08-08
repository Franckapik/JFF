import { assign } from 'xstate';

import allActions from '../actionsold/index.ts';

export const globalEventHandlers = {
  'SHIP_POSITION_UPDATE': {
    actions: assign(({ context, event }) => {
      return allActions.updateShipPosition(context, event);
    })
  },
  'DRONE_POSITION_UPDATE': {
    actions: assign(({ context, event }) => {
      return allActions.updateDronePosition(context, event);
    })
  },
  'DRONE_INITIALIZE_REQUEST': {
    actions: assign(({ context, event }) => {
      return allActions.processDroneInitRequest(context, event);
    })
  }
};