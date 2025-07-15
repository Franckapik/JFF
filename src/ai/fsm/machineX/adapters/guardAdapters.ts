/**
 * ==========================================================================
 * GUARD ADAPTERS - Adaptateurs pour migrer les guards vers XState v5
 * ==========================================================================
 * 
 * Fonctions utilitaires pour adapter les guards existants (format v4)
 * vers le format XState v5 avec setup().
 * 
 * @author Migration XState v5
 * @version 1.0.0
 */

import type { FSMContext } from '../../../../types/fsm.d.ts';
import type { XStateGuard, XStateGuardArgs } from '../../../../types/xstate.types.ts';

/**
 * Adapte un guard legacy (v4) vers le format XState v5
 * 
 * @param legacyGuard - Guard v4 qui prend seulement le contexte
 * @returns Guard v5 compatible avec setup()
 */
export function adaptLegacyGuard(
  legacyGuard: (context: FSMContext) => boolean
): XStateGuard {
  return ({ context }: XStateGuardArgs) => {
    return legacyGuard(context);
  };
}

/**
 * Adapte un guard qui utilise à la fois le contexte et l'événement
 * 
 * @param contextEventGuard - Guard qui utilise contexte et événement
 * @returns Guard v5 prêt à l'emploi
 */
export function adaptContextEventGuard(
  contextEventGuard: (context: FSMContext, event: unknown) => boolean
): XStateGuard {
  return ({ context, event }: XStateGuardArgs) => {
    return contextEventGuard(context, event);
  };
}

/**
 * Crée un guard simple basé sur une condition du contexte
 * 
 * @param condition - Fonction qui évalue une condition sur le contexte
 * @returns Guard v5 
 */
export function createContextGuard(
  condition: (context: FSMContext) => boolean
): XStateGuard {
  return ({ context }: XStateGuardArgs) => {
    return condition(context);
  };
}

/**
 * Crée un guard composite (AND de plusieurs conditions)
 * 
 * @param guards - Liste de guards à évaluer
 * @returns Guard v5 qui retourne true si tous les guards sont vrais
 */
export function createAndGuard(...guards: XStateGuard[]): XStateGuard {
  return (args: XStateGuardArgs) => {
    return guards.every(guard => guard(args));
  };
}

/**
 * Crée un guard composite (OR de plusieurs conditions)
 * 
 * @param guards - Liste de guards à évaluer
 * @returns Guard v5 qui retourne true si au moins un guard est vrai
 */
export function createOrGuard(...guards: XStateGuard[]): XStateGuard {
  return (args: XStateGuardArgs) => {
    return guards.some(guard => guard(args));
  };
}
