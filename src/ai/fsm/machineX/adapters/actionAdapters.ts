/**
 * ==========================================================================
 * ACTION ADAPTERS - Adaptateurs pour migrer les actions vers XState v5
 * ==========================================================================
 * 
 * Fonctions utilitaires pour adapter les actions existantes (format v4)
 * vers le format XState v5 avec setup().
 * 
 * @author Migration XState v5
 * @version 1.0.0
 */

import { assign } from 'xstate';

import type { FSMContext } from '../../../../types/fsm.d.ts';
import type { XStateAction, XStateActionArgs } from '../../../../types/xstate.types.ts';

/**
 * Adapte une action legacy (v4) vers le format XState v5
 * 
 * @param legacyAction - Action v4 qui retourne un contexte complet
 * @returns Action v5 compatible avec setup()
 */
export function adaptLegacyAction<TEvent = any>(
  legacyAction: (context: FSMContext, event: TEvent) => FSMContext
): XStateAction {
  return assign(({ context, event }: XStateActionArgs) => {
    // Appel de l'action legacy et retour du contexte complet
    const newContext = legacyAction(context, event as TEvent);
    
    // XState v5 attend un partial, on retourne la différence
    return newContext;
  });
}

/**
 * Adapte une action simple qui modifie juste une partie du contexte
 * 
 * @param partialUpdater - Fonction qui retourne un partial du contexte
 * @returns Action v5 prête à l'emploi
 */
export function createPartialAction(
  partialUpdater: (args: XStateActionArgs) => Partial<FSMContext>
): XStateAction {
  return assign(partialUpdater);
}

/**
 * Adapte une action qui ne fait que des logs (pas de modification de contexte)
 * 
 * @param logger - Fonction de log
 * @returns Action v5 qui ne modifie pas le contexte
 */
export function adaptLogAction(
  logger: (context: FSMContext, event: any) => void
): XStateAction {
  return ({ context, event }: XStateActionArgs) => {
    logger(context, event);
    // Pas de retour = pas de modification du contexte
    return {};
  };
}

/**
 * Helper pour créer des actions d'entrée/sortie d'état
 * 
 * @param stateName - Nom de l'état pour les logs
 * @param type - Type d'action ('entry' ou 'exit')
 * @returns Action v5 avec log automatique
 */
export function createStateAction(
  stateName: string, 
  type: 'entry' | 'exit'
): XStateAction {
  return ({ context }: XStateActionArgs) => {
    console.log(`[${context.entityId}] ${type} ${stateName} state`);
    
    return {
      timestamps: {
        ...context.timestamps,
        stateChange: Date.now()
      },
      lastAction: `${stateName}_${type}`
    };
  };
}
