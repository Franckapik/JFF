import { describe, it, expect, vi } from 'vitest';
import { createPlayer } from '../stores/playerStore/utils/playerFactory';
import { VEHICLE_TYPES, getDroneId, getMainShipId } from '../ai/constants/playerConstants';

// Mocking vehicleFactory
vi.mock('../stores/playerStore/utils/vehicleFactory', () => ({
  createVehicle: vi.fn((id, type) => ({
    id,
    type,
    isActive: type === VEHICLE_TYPES.EXPLORER_DRONE,
    mock: 'vehicle' // Just to identify it's our mock
  }))
}));

describe('playerFactory', () => {
  describe('createPlayer', () => {
    it('should create a player with all required properties', () => {
      const playerId = 'player1';
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
      const playerId = 'player2';
      const player = createPlayer(playerId);
      const vehicles = player.vehicles;
      
      // Check that the main ship is created
      const mainShipId = getMainShipId();
      expect(vehicles).toHaveProperty(mainShipId);
      expect(vehicles[mainShipId]).toHaveProperty('type', VEHICLE_TYPES.SHIP);
      
      // Check that all required drones are created
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      const combatDroneId = getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE);
      const specialDroneId = getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE);
      
      expect(vehicles).toHaveProperty(explorerDroneId);
      expect(vehicles[explorerDroneId]).toHaveProperty('type', VEHICLE_TYPES.EXPLORER_DRONE);
      
      expect(vehicles).toHaveProperty(combatDroneId);
      expect(vehicles[combatDroneId]).toHaveProperty('type', VEHICLE_TYPES.COMBAT_DRONE);
      
      expect(vehicles).toHaveProperty(specialDroneId);
      expect(vehicles[specialDroneId]).toHaveProperty('type', VEHICLE_TYPES.SPECIAL_DRONE);
    });
    
    it('should initialize drones with the correct activation state', () => {
      const playerId = 'player3';
      const player = createPlayer(playerId);
      const vehicles = player.vehicles;
      
      // Check activation state of explorer drone (should be active by default)
      const explorerDroneId = getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE);
      expect(vehicles[explorerDroneId]).toHaveProperty('isActive', true);
      
      // Note: We're using mock values for the activation state since our mocked createVehicle
      // function sets isActive based on the drone type
    });
    
    it('should use proper drone IDs based on playerId and drone type', () => {
      const playerId = 'player4';
      const player = createPlayer(playerId);
      const vehicles = player.vehicles;
      
      // Check that the vehicle IDs are constructed correctly
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.EXPLORER_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.COMBAT_DRONE));
      expect(vehicles).toHaveProperty(getDroneId(playerId, VEHICLE_TYPES.SPECIAL_DRONE));
    });
    
    it('should initialize player with empty resources and scores', () => {
      const playerId = 'player5';
      const player = createPlayer(playerId);
      
      // Check initial resource scores
      expect(player.score.resources).toEqual({ food: 0, debris: 0, special: 0 });
      
      // Check initial memory
      expect(player.memory.knownResources).toEqual([]);
      expect(player.memory.knownDangers).toEqual([]);
      expect(player.memory.explorationCount).toBe(0);
      expect(player.memory.collectedResources).toEqual([]);
    });
  });
});
