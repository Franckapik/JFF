import { create } from 'zustand';
import { zustandXStateMiddleware } from './zustandXStateMiddleware';
import fsmMachine from '../ai/fsm/machine/fsmMachine.xstate';

// Store Zustand centralisé avec middleware XState
export const useCentralFSMStore = create(
  zustandXStateMiddleware(fsmMachine, 'fsm')((set, get) => ({
    // Ajoutez ici d'autres slices ou actions globales si besoin
  }))
);
