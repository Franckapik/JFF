import { describe, it, expect, vi } from 'vitest';
import { createVehicle } from '../stores/usePlayerStore/utils/vehicleFactory';
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
      expect(drone).toHaveProperty('position', null);
      expect(drone).toHaveProperty('coord', null);
      
      // Vérification des propriétés spécifiques au drone spécial
      expect(drone).toHaveProperty('isActive', false);
      expect(drone).toHaveProperty('fuel', 50);
      expect(drone).toHaveProperty('damage', 0);
      expect(drone).toHaveProperty('specialAbilityCharge', 100);
      
      // Vérification des appels de fonction
      expect(isDroneId).toHaveBeenCalledWith(id);
      expect(isDroneActiveByDefault).toHaveBeenCalledWith(type);
    });
    
    // Test de création avec un ID invalide/dupliqué
    it('devrait créer un véhicule même avec un ID potentiellement dupliqué', () => {
      // Dans cet exemple, la fonction ne vérifie pas l'unicité des IDs
      const id = 'ship'; // ID qui pourrait déjà exister
      const type = VEHICLE_TYPES.SHIP;
      
      // Création du véhicule
      const ship = createVehicle(id, type);
      
      // Vérifier que le véhicule est créé avec l'ID fourni
      expect(ship).toHaveProperty('id', id);
      expect(ship).toHaveProperty('type', type);
    });
    
    // Test de création avec un type inconnu
    it('devrait retourner un véhicule générique pour un type inconnu', () => {
      const id = 'unknown_1';
      const type = 'unknown_type'; // Type qui n'existe pas dans VEHICLE_TYPES
      
      // Création du véhicule
      const vehicle = createVehicle(id, type);
      
      // Vérifier qu'un véhicule générique est retourné
      expect(vehicle).toHaveProperty('id', id);
      expect(vehicle).toHaveProperty('type', type);
      expect(vehicle).toHaveProperty('position', null);
      expect(vehicle).toHaveProperty('coord', null);
      expect(vehicle).toHaveProperty('isMoving', false);
      
      // Les propriétés spécifiques aux drones ou au vaisseau ne devraient pas être présentes
      expect(vehicle).not.toHaveProperty('isActive');
      expect(vehicle).not.toHaveProperty('explorationBonus');
      expect(vehicle).not.toHaveProperty('combatBonus');
      expect(vehicle).not.toHaveProperty('specialAbilityCharge');
    });
    
    // Test avec des valeurs nulles ou undefined
    it('devrait gérer correctement les valeurs nulles ou undefined', () => {
      // Test avec ID null
      const vehicleNullId = createVehicle(null, VEHICLE_TYPES.SHIP);
      expect(vehicleNullId).toHaveProperty('id', null);
      
      // Test avec type null
      const vehicleNullType = createVehicle('ship', null);
      expect(vehicleNullType).toHaveProperty('type', null);
      
      // Test avec les deux valeurs null
      const vehicleBothNull = createVehicle(null, null);
      expect(vehicleBothNull).toHaveProperty('id', null);
      expect(vehicleBothNull).toHaveProperty('type', null);
    });
  });
});
