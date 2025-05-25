import { describe, it, expect, vi } from 'vitest';
import { createVehicle } from '../stores/playerStore/utils/vehicleFactory';
import { VEHICLE_TYPES, isDroneActiveByDefault, isDroneId } from '../ai/constants/playerConstants';

// Mock des dépendances externes
vi.mock('../ai/constants/playerConstants', () => ({
  VEHICLE_TYPES: {
    SHIP: 'ship',
    EXPLORER_DRONE: 'explorer_drone',
    COMBAT_DRONE: 'combat_drone',
    SPECIAL_DRONE: 'special_drone'
  },
  isDroneActiveByDefault: vi.fn().mockImplementation((droneType) => {
    return droneType === 'explorer_drone';
  }),
  isDroneId: vi.fn().mockImplementation((id) => {
    return id.startsWith('explorer_drone') || 
           id.startsWith('combat_drone') || 
           id.startsWith('special_drone');
  })
}));

describe('Fabrication des Objets - vehicleFactory', () => {
  describe('createVehicle', () => {
    
    // Test de création d'un vaisseau principal
    it('devrait créer un vaisseau principal avec les propriétés attendues', () => {
      const id = 'ship';
      const type = VEHICLE_TYPES.SHIP;
      
      const ship = createVehicle(id, type);
      
      // Vérification des propriétés de base
      expect(ship).toHaveProperty('id', id);
      expect(ship).toHaveProperty('type', type);
      expect(ship).toHaveProperty('position', null);
      expect(ship).toHaveProperty('coord', null);
      expect(ship).toHaveProperty('isMoving', false);
      expect(ship).toHaveProperty('progress', 0);
      
      // Vérification des propriétés spécifiques au vaisseau
      expect(ship).toHaveProperty('fuel', 100);
      expect(ship).toHaveProperty('damage', 0);
      expect(ship).toHaveProperty('path', []);
      expect(ship).toHaveProperty('startCoord', null);
      expect(ship).toHaveProperty('isAtCapacity', false);
      
      // Vérification des capacités maximales
      expect(ship).toHaveProperty('maxCapacity');
      expect(ship.maxCapacity).toEqual({ food: 100, debris: 1000, special: 2 });
      
      // Vérification des ressources initiales
      expect(ship.resources).toEqual({ food: 0, debris: 0, special: 0 });
    });
    
    // Test de création d'un drone explorateur
    it('devrait créer un drone explorateur avec les propriétés attendues', () => {
      const id = 'explorer_drone_1';
      const type = VEHICLE_TYPES.EXPLORER_DRONE;
      
      // Mock pour le test
      isDroneId.mockReturnValueOnce(true);
      isDroneActiveByDefault.mockReturnValueOnce(true);
      
      const drone = createVehicle(id, type);
      
      // Vérification des propriétés de base
      expect(drone).toHaveProperty('id', id);
      expect(drone).toHaveProperty('type', type);
      expect(drone).toHaveProperty('position', null);
      expect(drone).toHaveProperty('coord', null);
      
      // Vérification des propriétés spécifiques au drone
      expect(drone).toHaveProperty('isActive', true);
      expect(drone).toHaveProperty('fuel', 50);
      expect(drone).toHaveProperty('damage', 0);
      
      // Vérification des capacités spécifiques au drone explorateur
      expect(drone).toHaveProperty('explorationBonus', 1.5);
      expect(drone.maxCapacity).toEqual({ food: 0, debris: 0, special: 0 });
      
      // Vérification des appels de fonction
      expect(isDroneId).toHaveBeenCalledWith(id);
      expect(isDroneActiveByDefault).toHaveBeenCalledWith(type);
    });
    
    // Test de création d'un drone de combat
    it('devrait créer un drone de combat avec les propriétés attendues', () => {
      const id = 'combat_drone_1';
      const type = VEHICLE_TYPES.COMBAT_DRONE;
      
      // Mock pour le test
      isDroneId.mockReturnValueOnce(true);
      isDroneActiveByDefault.mockReturnValueOnce(false);
      
      const drone = createVehicle(id, type);
      
      // Vérification des propriétés de base
      expect(drone).toHaveProperty('id', id);
      expect(drone).toHaveProperty('type', type);
      
      // Vérification des propriétés spécifiques au drone de combat
      expect(drone).toHaveProperty('isActive', false);
      expect(drone).toHaveProperty('damage', 5);
      expect(drone).toHaveProperty('attackRange', 2);
      expect(drone).toHaveProperty('mineLayingCapacity', 3);
      
      // Vérification des capacités de ressources du drone de combat
      expect(drone.maxCapacity).toEqual({ food: 20, debris: 50, special: 1 });
    });
    
    // Test de création d'un drone spécial
    it('devrait créer un drone spécial avec les propriétés attendues', () => {
      const id = 'special_drone_1';
      const type = VEHICLE_TYPES.SPECIAL_DRONE;
      
      // Mock pour le test
      isDroneId.mockReturnValueOnce(true);
      isDroneActiveByDefault.mockReturnValueOnce(false);
      
      const drone = createVehicle(id, type);
      
      // Vérification des propriétés de base
      expect(drone).toHaveProperty('id', id);
      expect(drone).toHaveProperty('type', type);
      
      // Vérification des propriétés spécifiques au drone spécial
      expect(drone).toHaveProperty('isActive', false);
      expect(drone).toHaveProperty('specialScanRange', 5);
      expect(drone).toHaveProperty('specialDetection', true);
      
      // Vérification des capacités de ressources du drone spécial
      expect(drone.maxCapacity).toEqual({ food: 0, debris: 0, special: 0 });
    });
    
    // Test de création avec un type de drone non reconnu
    it('devrait créer un drone générique pour un type non reconnu', () => {
      const id = 'unknown_drone_1';
      const type = 'unknown_drone';
      
      // Mock pour le test
      isDroneId.mockReturnValueOnce(true);
      
      const drone = createVehicle(id, type);
      
      // Vérification des propriétés de base d'un drone
      expect(drone).toHaveProperty('id', id);
      expect(drone).toHaveProperty('type', type);
      expect(drone).toHaveProperty('isActive');
      expect(drone).toHaveProperty('fuel', 50);
      expect(drone).toHaveProperty('damage', 0);
      
      // Ne devrait pas avoir les propriétés spécifiques d'autres types de drones
      expect(drone).not.toHaveProperty('explorationBonus');
      expect(drone).not.toHaveProperty('attackRange');
      expect(drone).not.toHaveProperty('specialDetection');
    });
    
    // Test de vérification que tous les véhicules ont des ressources initiales vides
    it('devrait initialiser tous les véhicules avec des ressources vides', () => {
      const shipId = 'ship';
      const droneId = 'explorer_drone_1';
      
      // Mock pour le drone
      isDroneId.mockReturnValueOnce(true);
      
      const ship = createVehicle(shipId, VEHICLE_TYPES.SHIP);
      const drone = createVehicle(droneId, VEHICLE_TYPES.EXPLORER_DRONE);
      
      // Vérification des ressources
      expect(ship.resources).toEqual({ food: 0, debris: 0, special: 0 });
      expect(drone.resources).toEqual({ food: 0, debris: 0, special: 0 });
    });
    
    // Test de vérification que tous les véhicules ont une cible initiale nulle
    it('devrait initialiser tous les véhicules avec une cible nulle', () => {
      const shipId = 'ship';
      const droneId = 'explorer_drone_1';
      
      // Mock pour le drone
      isDroneId.mockReturnValueOnce(true);
      
      const ship = createVehicle(shipId, VEHICLE_TYPES.SHIP);
      const drone = createVehicle(droneId, VEHICLE_TYPES.EXPLORER_DRONE);
      
      // Vérification de la cible
      const expectedTarget = { position: null, coord: null };
      expect(ship.targetTile).toEqual(expectedTarget);
      expect(drone.targetTile).toEqual(expectedTarget);
    });
  });
});
