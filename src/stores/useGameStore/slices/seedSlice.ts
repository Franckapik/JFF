/**
 * =========================================================================
 * SEED SLICE - Gestion du seed de génération pour l'équité (TypeScript)
 * =========================================================================
 * 
 * Ce slice gère le seed de génération pour la reproductibilité :
 * - Stockage du seed utilisé pour la génération de la carte
 * - Génération d'un nouveau seed
 * - Récupération pour debug/replay
 * 
 * Voir: docs/bot-spec/scenarios/initialization-fairness.feature
 * 
 * @version 1.0.0
 * @date 2026-01-08
 */

import fsmLogger from '../../../logger/fsmLogger.ts';
import type { GameStoreType } from '../../../types/stores.d.ts';

// =========================================================================
// TYPES
// =========================================================================

/** Interface du slice de seed */
export interface SeedSliceActions {
  // État
  mapSeed: number | null;
  
  // Actions
  generateSeed: () => number;
  setSeed: (seed: number) => void;
  getSeed: () => number | null;
  resetSeed: () => void;
}

// =========================================================================
// SLICE FACTORY
// =========================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createSeedSlice = (set: any, get: () => GameStoreType): SeedSliceActions => ({
  // État initial
  mapSeed: null,
  
  /**
   * Génère un nouveau seed basé sur le timestamp actuel
   * @returns Le seed généré
   */
  generateSeed: (): number => {
    const seed = Date.now();
    set({ mapSeed: seed });
    fsmLogger.game(`🎲 [SeedSlice] Generated new seed: ${seed}`);
    return seed;
  },
  
  /**
   * Définit un seed spécifique (pour replay/debug)
   * @param seed - Le seed à utiliser
   */
  setSeed: (seed: number): void => {
    set({ mapSeed: seed });
    fsmLogger.game(`🎲 [SeedSlice] Set seed to: ${seed}`);
  },
  
  /**
   * Récupère le seed actuel
   * @returns Le seed actuel ou null si non défini
   */
  getSeed: (): number | null => {
    return get().mapSeed;
  },
  
  /**
   * Réinitialise le seed (pour nouvelle partie)
   */
  resetSeed: (): void => {
    set({ mapSeed: null });
    fsmLogger.game(`🎲 [SeedSlice] Seed reset`);
  },
});

export default createSeedSlice;
