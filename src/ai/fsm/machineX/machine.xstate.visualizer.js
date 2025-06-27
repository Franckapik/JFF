// ============================================================================
// XSTATE MACHINE - Version inlinée pour Visualisateur XState VSCode
// ============================================================================
// Ce fichier est destiné UNIQUEMENT à la visualisation (pas d'import externe)
// Toutes les actions, guards et états sont définis en dur ici.
// ============================================================================
import { createMachine, assign } from 'xstate';

// Actions inlinées (exemple minimal)
const actions = {
  action_evaluating_entry: () => {},
  action_evaluating_exit: () => {},
  action_exploring_entry: () => {},
  action_exploring_exit: () => {},
  action_collecting_entry: () => {},
  action_collecting_exit: () => {},
  action_maintaining_entry: () => {},
  action_maintaining_exit: () => {},
  updateContext: assign({})
};

// Guards inlinés (exemple minimal)
const guards = {
  shouldExplore: () => true,
  shouldCollect: () => true,
  shouldMaintain: () => false
};

// États inlinés
const evaluatingState = {
  entry: 'action_evaluating_entry',
  exit: 'action_evaluating_exit',
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
    }
  }
};

const exploringState = {
  entry: 'action_exploring_entry',
  exit: 'action_exploring_exit'
};
const collectingState = {
  entry: 'action_collecting_entry',
  exit: 'action_collecting_exit'
};
const maintainingState = {
  entry: 'action_maintaining_entry',
  exit: 'action_maintaining_exit'
};

export const machineXVisualizer = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgA0A6MAN1QBsBXVAFzygGJ9IBRADwAcKB7AJwYBtAAwBdRKE49Y2ej1wSQ7RAGYATCqIA2ACwqA7PuEBGAKymd+taf0AaEAE9Eatfu3CtarVpUWAnH5qlgC+wfZoWHiEJOTUdAzMYJAAwjwUFGDo9LhQIuJIIFIycgoFygjqmroGRmYWVjb2ThWmfkRBNQAcpmrCOsK++qHhGDj4xGSUNNlMLBAAsqh4tGC4qLjoYHmKRbLY8orlldp6hibmltZ2joh+pkR+Wp36Fsadd53GvqFhILg8EDgigiY0IO2kewOZUQAFotE1YfcAsiUaiVMMQCCohNYtMGODivtSqByjo1AiEMZhG1TJ09J0+p4dH4VCFfljxiQuLwBDkCZDiUpED42upTB49F5zNSKWovkQVMZrMYdLStOY3loMRzoug0hksviCrsSodhSpRdYJep1eK-BTWToHuLhF4XsZHmo-NrRtiiGhlktcEbJBDTdCECKFVbqlK7RTPtoXsJXWTjCqPJ0fsEgA */
  id: 'machineX',
  initial: 'evaluating',
  states: {
    evaluating: evaluatingState,
    exploring: exploringState,
    collecting: collectingState,
    maintaining: maintainingState
  }
}, {
  actions,
  guards
});

export default machineXVisualizer;
