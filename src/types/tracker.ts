/**
 * ==========================================================================
 * TYPES POUR LES TRACKERS XState/FSM
 * ==========================================================================
 * 
 * Types spécifiques aux trackers de position pour les drones et vaisseaux.
 * Ces types unifient la logique de tracking entre XState et React Three Fiber.
 */

import type { MutableRefObject } from 'react';

import type { GridCoordinate, TileCoordinate, WorldPosition } from './coordinates';
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
export type XStateSend = (event: any) => void;

/** Type pour les fonctions de debounce des événements */
export type CanSendEventFn = (eventType: string) => boolean;
export type MarkEventSentFn = (eventType: string, timeout?: number) => void;

/** Type pour les fonctions de conversion de coordonnées */
export type GridToHexCoordFn = (coord: GridCoordinate) => string | null;
export type WorldToGridFn = (position: WorldPosition) => TileCoordinate;

// ============================================================================
// INTERFACES POUR LES PARAMÈTRES DES TRACKERS
// ============================================================================

/** Paramètres de base partagés par tous les trackers */
export interface BaseTrackerParams {
  position: WorldPosition;
  context: FSMContext;
  send: XStateSend;
  botId: string;
  initialPositionSent: MutableRefObject<boolean>;
  canSendEvent: CanSendEventFn;
  markEventSent: MarkEventSentFn;
}

/** Paramètres spécifiques aux trackers de drones */
export interface DroneTrackerParams extends BaseTrackerParams {
  droneType: DroneType;
  gridToHexCoord: GridToHexCoordFn;
  worldToGrid: WorldToGridFn;
  useTileStore: any; // Type générique pour le store Zustand
}

/** Paramètres spécifiques aux trackers de vaisseaux */
export interface ShipTrackerParams extends BaseTrackerParams {
  shipType: ShipType;
  lastPosition: WorldPosition | null;
}

// ============================================================================
// TYPES POUR LES HANDLERS
// ============================================================================

/** Interface pour les handlers de traitement des positions */
export interface PositionHandler<T = BaseTrackerParams> {
  process: (distance: number, position: WorldPosition) => boolean;
}

/** Interface pour les handlers d'initialisation */
export interface InitializationHandler {
  handleInitialPosition: (position: WorldPosition) => boolean;
}

// ============================================================================
// TYPES DE FONCTIONS DE TRAITEMENT
// ============================================================================

/** Fonction de traitement principal pour les drones */
export type DroneProcessorFunction = (params: DroneTrackerParams) => void;

/** Fonction de traitement principal pour les vaisseaux */
export type ShipProcessorFunction = (params: ShipTrackerParams) => void;
