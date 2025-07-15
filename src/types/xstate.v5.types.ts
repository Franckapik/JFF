/**
 * ==========================================================================
 * XSTATE V5 TYPES - Types stricts pour XState v5 avec setup()
 * ==========================================================================
 */

import type { ActorRefFrom, StateValue } from 'xstate';

import type { MachineEvents } from '../ai/fsm/machineX/events.pure.v5';

import type { FSMContext } from './fsm.d.ts';

/**
 * Arguments pour les actions XState v5 avec typage strict
 */
export interface XStateV5ActionArgs {
  context: FSMContext;
  event: MachineEvents;
}

/**
 * Arguments pour les guards XState v5 avec typage strict  
 */
export interface XStateV5GuardArgs {
  context: FSMContext;
  event: MachineEvents;
}

/**
 * Type d'une action XState v5 - retourne un partial du contexte
 */
export type XStateV5Action = (args: XStateV5ActionArgs) => Partial<FSMContext>;

/**
 * Type d'un guard XState v5 - retourne un boolean
 */
export type XStateV5Guard = (args: XStateV5GuardArgs) => boolean;


/**
 * Snapshot de l'état de la machine
 */
export interface MachineSnapshot {
  value: StateValue;
  context: FSMContext;
  status: 'active' | 'done' | 'error' | 'stopped';
}

/**
 * Type de la machine pure XState v5
 */
export type MachineXV5Pure = ActorRefFrom<typeof import('../ai/fsm/machineX/machine.pure.v5').machineXV5Pure>;
