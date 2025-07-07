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

// Alias pour compatibilité avec le code existant (utilisé dans initialContext.ts)
export type Resources = ResourceStats;

// Fonction utilitaire de type uniquement
export const isResourceType = (type: string): type is ResourceType => {
  return ['food', 'debris', 'special'].includes(type);
};

/** Valide qu'un objet respecte l'interface Resources */
export const isValidResources = (resources: any): resources is Resources => {
  return (
    resources &&
    typeof resources === 'object' &&
    typeof resources.food === 'number' &&
    typeof resources.debris === 'number' &&
    typeof resources.special === 'number' &&
    !isNaN(resources.food) &&
    !isNaN(resources.debris) &&
    !isNaN(resources.special)
  );
};
