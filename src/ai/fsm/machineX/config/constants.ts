/**
 * ============================================================================
 * FSM TYPES & CONSTANTS - Version moderne avec Types Union (TypeScript)
 * ============================================================================
 * 
 * Transformation complète vers les types union pour une meilleure expérience TypeScript.
 * Plus simple, plus sûr, et meilleure auto-complétion.
 * 
 * @author Migration TypeScript - Types Union
 * @version 4.0.0 - Modern TypeScript Types
 */

// ============================================================================
// IMPORTS DES TYPES DRONES (déjà unifiés)
// ============================================================================

export type {
  DroneFSMState, DroneType,
  DroneVisualState
} from '../../../../types/drone.d.ts';

// ============================================================================
// TYPES UNION POUR LES ÉTATS FSM
// ============================================================================

// export type FSMState = 
//   | 'exploring_deploying'
//   | 'exploring_returning'
//   | 'collecting_moving_to_target'
//   | 'collecting_returning_to_base'
//   | 'idleAtBase';

/**
 * Types d'entités dans le système FSM
 */
export type EntityType = 'auto' | 'player';

// ============================================================================
// TYPES UNION POUR LES TILES ET RESSOURCES
// ============================================================================

// export type TileType = 
//   | 'empty'
//   | 'resource'
//   | 'obstacle'
//   | 'explored'
//   | 'scanning'
//   | 'danger'
//   | 'food'
//   | 'fuel'
//   | 'repair'
//   | 'depart';

// export type TileBiome = 
//   | 'space'
//   | 'asteroid'
//   | 'nebula'
//   | 'station'
//   | 'grassland';

// export type ResourceType = 'food' | 'debris' | 'special';

// export type FuelLevel = 'full' | 'normal' | 'low' | 'critical';
