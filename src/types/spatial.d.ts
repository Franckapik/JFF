/**
 * ============================================================================
 * SPATIAL MODULE TYPES
 * ============================================================================
 * 
 * Types TypeScript pour le module core/spatial.
 * Définit les interfaces pour les opérations spatiales pures.
 * 
 * @module types/spatial
 * @author Spatial Migration Team
 * @version 1.0.0
 */

import type { WorldPosition } from './coordinates';

// ============================================================================
// DISTANCE CALCULATION
// ============================================================================

/** Options pour les calculs de distance */
export interface DistanceOptions {
  /** Type de distance à calculer */
  type?: 'euclidean' | 'manhattan' | 'chebyshev';
}

/** Résultat d'un calcul de distance */
export interface DistanceResult {
  /** Distance calculée */
  distance: number;
  /** Positions utilisées pour le calcul */
  from: WorldPosition;
  to: WorldPosition;
}

// ============================================================================
// TARGET REACHING
// ============================================================================

/** Options pour la détection d'arrivée à une cible */
export interface ReachedTargetOptions {
  /** Seuil de distance pour considérer la cible atteinte (défaut: 0.05) */
  threshold?: number;
  /** Ignorer la coordonnée Y dans le calcul (défaut: false) */
  ignoreY?: boolean;
}

// ============================================================================
// COORDINATE CONVERSION
// ============================================================================

/** Configuration pour la conversion de coordonnées */
export interface CoordinateConversionConfig {
  /** Espacement entre les tuiles (défaut: -0.2) */
  spacing?: number;
  /** Hauteur Y standard des tuiles (défaut: 0.5) */
  defaultY?: number;
}

/** Options pour l'encodage de coordonnées hexagonales */
export interface HexCoordEncodeOptions {
  /** Rayon de la grille hexagonale */
  radius: number;
}

// ============================================================================
// VALIDATION
// ============================================================================

/** Résultat d'une validation de coordonnée */
export interface CoordinateValidationResult {
  /** Indique si la coordonnée est valide */
  valid: boolean;
  /** Message d'erreur si invalide */
  error?: string;
}

// ============================================================================
// GRID OPERATIONS
// ============================================================================

/** Configuration pour la génération de grille hexagonale */
export interface HexGridConfig {
  /** Rayon de la grille */
  radius: number;
  /** Espacement entre les tuiles */
  spacing?: number;
  /** Seed pour la génération aléatoire */
  seed?: number;
}

/** Configuration pour le placement de stations */
export interface StationPlacementConfig {
  /** Nombre de stations à placer */
  count?: number;
  /** Distance minimale entre stations */
  minDistance?: number;
}
