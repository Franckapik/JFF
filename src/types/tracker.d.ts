/**
 * ==========================================================================
 * TYPES POUR LES TRACKERS XState/FSM
 * ==========================================================================
 * 
 * Types spécifiques aux trackers de position pour les drones et vaisseaux.
 * Ces types unifient la logique de tracking entre XState et React Three Fiber.
 */

import type { GridCoordinate, WorldPosition } from './coordinates';
import type { DroneType } from './drone';
import type { FSMContext } from './fsm';

// ============================================================================
// TYPES D'ENTITÉS TRACKÉES
// ============================================================================

/** Types de vaisseaux supportés par le système de tracking */
export type ShipType = 'ship' | 'main-ship';

// ============================================================================
// FONCTIONS DE CALLBACK
// ============================================================================

/** Type pour la fonction send de XState */
export type XStateSend = (event: Record<string, unknown>) => void;

/** Type pour les fonctions de debounce des événements */
export type CanSendEventFn = (eventType: string) => boolean;
export type MarkEventSentFn = (eventType: string, timeout?: number) => void;

/** Type pour les fonctions de conversion de coordonnées */
export type GridToHexCoordFn = (coord: GridCoordinate) => string | null;
export type WorldToGridFn = (position: WorldPosition) => GridCoordinate;

// ============================================================================
// INTERFACES POUR LES PARAMÈTRES DES TRACKERS
// ============================================================================

export interface DroneTrackerParams {
  context: FSMContext;
  droneType: DroneType;
  send: XStateSend;
  botId: string;
}

export interface ShipTrackerParams {
  position: WorldPosition;
  context: FSMContext;
  shipType: ShipType;
  send: XStateSend;
  botId: string;
  gridToHexCoord: GridToHexCoordFn;
  worldToGrid: WorldToGridFn;
}

// ============================================================================
// TYPES POUR LES HANDLERS
// ============================================================================

/** Interface pour les handlers de traitement des positions */
export interface PositionHandler {
  process: (distance: number, position: WorldPosition) => boolean;
}

/** Interface pour les handlers d'initialisation */
export interface InitializationHandler {
  handleInitialPosition: (position: WorldPosition) => boolean;
}

/** Paramètres génériques pour les handlers */
export interface HandlerParams {
  /**
   * Identifiant unique du bot.
   */
  botId: string;

  /**
   * Type de drone utilisé.
   */
  droneType: DroneType;

  /**
   * Fonction pour envoyer des événements XState.
   */
  send: XStateSend;
}

// ============================================================================
// TYPES DE FONCTIONS DE TRAITEMENT
// ============================================================================

/** Fonction de traitement principal pour les drones */
export type DroneProcessorFunction = (params: DroneTrackerParams) => void;

/** Fonction de traitement principal pour les vaisseaux */
export type ShipProcessorFunction = (params: ShipTrackerParams) => void;
