/**
 * ==========================================================================
 * DOMAINS - Exports principaux pour l'architecture FSM
 * ==========================================================================
 * 
 * Cette approche domain-based permet une meilleure organisation du code
 * quand la complexité augmente. Chaque domaine contient ses propres:
 * - actions.assign.ts (mise à jour contexte)
 * - actions.effects.ts (effets de bord)
 * - guards.ts (conditions)
 * - index.ts (exports)
 */

// Domaine global (actions transversales - COMPLET - migré depuis actions.pure.v5.ts)
export * from './global';

// Domaine évaluation (COMPLET - migré depuis actions.pure.v5.ts)
export * from './evaluation';

// Domaine exploration (COMPLET - assignDroneDeployingContext migré)
export * from './exploration';

// Domaine collection (TODO: migrer les actions collection)
export * from './collection';

// Domaine maintenance (TODO: migrer les actions maintenance)
export * from './maintenance';
