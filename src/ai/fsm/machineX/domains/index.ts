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
export * from './global/index.ts';

// Domaine évaluation (COMPLET - migré depuis actions.pure.v5.ts)
export * from './evaluation/index.ts';

// Domaine exploration (COMPLET - assignDroneDeployingContext migré)
export * from './exploration/index.ts';

// Domaine collection (COMPLET - Phase 5 migration, useTileStore removed)
export * from './collection/index.ts';

// Domaine maintenance (TODO: migrer les actions maintenance)
export * from './maintenance/index.ts';

// Domaine tiles (NEW - Phase 5: gestion des tiles dans le contexte FSM)
export * from './tiles/index.ts';
