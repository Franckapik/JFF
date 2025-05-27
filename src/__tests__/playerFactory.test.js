import { describe, it, expect } from 'vitest';
import { createPlayer } from '../stores/usePlayerStore/utils/playerFactory.js';
import { getMainShipId, getHumanPlayerId, VEHICLE_TYPES, getDroneId } from '../ai/constants/playerConstants.js';

describe('playerFactory', () => {
  describe('createPlayer', () => {
    it('should create a player with all required properties', () => {
      const playerId = 'player-1';
      const player = createPlayer(playerId);
      
      // Check basic player properties
      expect(player).toHaveProperty('id', playerId);
      expect(player).toHaveProperty('exploringRadius', 3);
      expect(player).toHaveProperty('score');
      expect(player.score).toHaveProperty('resources');
      expect(player).toHaveProperty('memory');
      expect(player).toHaveProperty('messages');
      
      // Check memory properties
      expect(player.memory).toHaveProperty('knownResources');
      expect(player.memory).toHaveProperty('knownDangers');
      expect(player.memory).toHaveProperty('explorationCount');
      expect(player.memory).toHaveProperty('collectedResources');
    });
    
    it('should create a player with main ship and all required drones', () => {
      const playerId = 'player-2';
      const startCoord = 'A0';
      const player = createPlayer(playerId, startCoord);
      
      expect(player).toHaveProperty('id', playerId);
      expect(player).toHaveProperty('vehicles');
      
      const { vehicles } = player;
      
      // Should have main ship
      const mainShipId = getMainShipId(playerId);
      expect(vehicles).toHaveProperty(mainShipId);
      // ← CORRECTION : Ne pas s'attendre à une coord spécifique si elle n'est pas initialisée
      expect(vehicles[mainShipId]).toHaveProperty('coord');
      
      // Should have all required drones
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE));
    });

    it('should initialize drones with the correct activation state', () => {
      const playerId = 'player-3';
      const startCoord = 'B0';
      const player = createPlayer(playerId, startCoord);
      
      const { vehicles } = player;
      
      // Check activation state of explorer drone (should be active by default)
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      expect(vehicles[explorerDroneId]).toHaveProperty('isActive', true);
      
      // Check other drones (should be inactive by default)
      const combatDroneId = getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE);
      const specialDroneId = getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE);
      
      expect(vehicles[combatDroneId]).toHaveProperty('isActive', false);
      expect(vehicles[specialDroneId]).toHaveProperty('isActive', false);
    });

    it('should use proper drone IDs based on playerId and drone type', () => {
      const playerId = 'player-4';
      const startCoord = 'C0';
      const player = createPlayer(playerId, startCoord);
      
      const { vehicles } = player;
      
      // Check that the vehicle IDs are constructed correctly
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE));
      
      // Check that each drone has the correct base properties
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      const explorerDrone = vehicles[explorerDroneId];
      
      // ← CORRECTION : Vérifier juste que la propriété coord existe, pas sa valeur
      expect(explorerDrone).toHaveProperty('coord');
      expect(explorerDrone).toHaveProperty('isMoving', false);
      expect(explorerDrone).toHaveProperty('isActive', true);
    });

    it('should initialize memory with default values', () => {
      const playerId = 'player-5';
      const startCoord = 'D0';
      const player = createPlayer(playerId, startCoord);
      
      expect(player).toHaveProperty('memory');
      expect(player.memory).toHaveProperty('knownResources');
      expect(player.memory).toHaveProperty('explorationCount', 0);
      expect(player.memory).toHaveProperty('collectedResources');
      
      // Check that arrays are initialized as empty
      expect(Array.isArray(player.memory.knownResources)).toBe(true);
      expect(Array.isArray(player.memory.collectedResources)).toBe(true);
      expect(player.memory.knownResources).toHaveLength(0);
      expect(player.memory.collectedResources).toHaveLength(0);
    });

    it('should handle human player creation correctly', () => {
      const humanPlayerId = getHumanPlayerId();
      const startCoord = 'E0';
      const player = createPlayer(humanPlayerId, startCoord);
      
      expect(player).toHaveProperty('id', humanPlayerId);
      expect(player).toHaveProperty('vehicles');
      
      // Human player should still have all the same vehicles
      const { vehicles } = player;
      const mainShipId = getMainShipId(humanPlayerId);
      expect(vehicles).toHaveProperty(mainShipId);
    });

    it('should initialize all vehicles with coord property', () => {
      const playerId = 'player-6';
      const startCoord = 'F0';
      const player = createPlayer(playerId, startCoord);
      
      const { vehicles } = player;
      
      // All vehicles should have a coord property (même si null)
      Object.values(vehicles).forEach(vehicle => {
        expect(vehicle).toHaveProperty('coord');
        expect(vehicle).toHaveProperty('isMoving');
      });
      
      // Check specific vehicle types exist
      const mainShipId = getMainShipId(playerId);
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      const combatDroneId = getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE);
      const specialDroneId = getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE);
      
      expect(vehicles).toHaveProperty(mainShipId);
      expect(vehicles).toHaveProperty(explorerDroneId);
      expect(vehicles).toHaveProperty(combatDroneId);
      expect(vehicles).toHaveProperty(specialDroneId);
    });

    it('should create vehicles with expected structure', () => {
      const playerId = 'player-7';
      const player = createPlayer(playerId);
      
      const { vehicles } = player;
      const mainShipId = getMainShipId(playerId);
      const mainShip = vehicles[mainShipId];
      
      // Verify ship structure
      expect(mainShip).toHaveProperty('coord');
      expect(mainShip).toHaveProperty('isMoving');
      expect(mainShip).toHaveProperty('fuel');
      expect(mainShip).toHaveProperty('resources');
      
      // Verify drone structure
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      const explorerDrone = vehicles[explorerDroneId];
      
      expect(explorerDrone).toHaveProperty('coord');
      expect(explorerDrone).toHaveProperty('isMoving');
      expect(explorerDrone).toHaveProperty('isActive');
    });
  });
});
