/**
 * Discovery Guards for FSM
 * Guards related to exploration, discovery, and pathfinding
 * Reuses existing guards from shared/actions/core/
 */

import { explorationGuards } from '../../../../shared/actions/core/explorationActions.js';
import { movementGuards } from '../../../../shared/actions/core/movementActions.js';

/**
 * Discovery guards - Exploration and discovery logic
 */
export const discoveryGuards = {
  // Exploration guards
  canStartExploration: explorationGuards.canStartExploration,
  needsExploration: explorationGuards.needsExploration,
  isExplorationExpired: explorationGuards.isExplorationExpired,
  isExplorationComplete: explorationGuards.isExplorationComplete,

  // Movement and navigation guards
  canMoveTo: movementGuards.canMoveTo,
  hasValidTarget: movementGuards.hasValidTarget,

  // Discovery optimization checks
  hasUnexploredAreas: (context, event) => {
    return explorationGuards.needsExploration(context, event);
  },

  // Check if current exploration session is still valid
  isCurrentExplorationValid: (context, event) => {
    return !explorationGuards.isExplorationExpired(context, event) &&
           !explorationGuards.isExplorationComplete(context, event);
  },

  // Check if new exploration can be started
  canBeginNewExploration: (context, event) => {
    return explorationGuards.canStartExploration(context, event) &&
           movementGuards.canMoveTo(context, event);
  },

  // Check if exploration target is reachable
  isExplorationTargetReachable: (context, event) => {
    return movementGuards.canMoveTo(context, event) &&
           movementGuards.hasValidTarget(context, event);
  },

  // Check if should continue current exploration
  shouldContinueExploration: (context, event) => {
    return explorationGuards.needsExploration(context, event) &&
           !explorationGuards.isExplorationExpired(context, event);
  },

  // Check if exploration priority is high
  hasHighExplorationPriority: (context, event) => {
    // High priority if no recent exploration or critical areas unexplored
    return explorationGuards.isExplorationExpired(context, event) ||
           explorationGuards.needsExploration(context, event);
  }
};

export default discoveryGuards;
