/**
 * ==========================================================================
 * XSTATE V5 TYPES - Types compatibles pour la migration XState v5
 * ==========================================================================
 * 
 * Types spécifiques pour XState v5 avec setup() et typage strict.
 * Utilisés pour migrer progressivement de v4 vers v5.
 * 
 * @author Migration XState v5
 * @version 1.0.0
 */

import type { MachineEvents } from './events.d.ts';
import type { FSMContext } from './fsm.d.ts';

/**
 * Arguments d'action XState v5 - format standard avec context et event
 */
export interface XStateActionArgs {
  context: FSMContext;
  event: MachineEvents;
}

/**
 * Arguments de guard XState v5 - format standard avec context et event
 */
export interface XStateGuardArgs {
  context: FSMContext;
  event: MachineEvents;
}

/**
 * Type d'action XState v5 - retourne un partial du contexte
 */
export type XStateAction = (args: XStateActionArgs) => Partial<FSMContext>;

/**
 * Type de guard XState v5 - retourne un boolean
 */
export type XStateGuard = (args: XStateGuardArgs) => boolean;

/**
 * Configuration typée pour un état XState v5
 */
export interface XStateStateConfig {
  entry?: string | string[];
  exit?: string | string[];
  on?: Partial<Record<MachineEvents['type'], string>>;
  initial?: string;
  states?: Record<string, XStateStateConfig>;
}

/**
 * Configuration complète de la machine XState v5
 */
export interface XStateMachineConfig {
  id: string;
  initial: string;
  context: (input: { input?: Partial<FSMContext> }) => FSMContext;
  states: Record<string, XStateStateConfig>;
}

/**
 * Registry des actions pour setup()
 */
export type XStateActionsRegistry = Record<string, XStateAction>;

/**
 * Registry des guards pour setup()
 */
export type XStateGuardsRegistry = Record<string, XStateGuard>;
