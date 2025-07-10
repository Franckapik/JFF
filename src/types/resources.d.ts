/**
 * Types de ressources (extraits de initialContext.ts)
 */

export type ResourceType = 'food' | 'debris' | 'special';

/** Structure de ressources (extrait de initialContext.ts) */
export interface ResourceStats {
  food: number;
  debris: number;
  special: number;
  total: number;
}


