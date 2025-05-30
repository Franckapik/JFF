/**
 * ============================================================================
 * TEST SETUP - Configuration et Helpers pour les Tests FSM
 * ============================================================================
 * 
 * Configuration commune et utilitaires pour tous les tests liés au système FSM.
 * Fournit des fixtures, mocks et helpers réutilisables.
 * 
 * @author Migration FSM Tests
 * @version 1.0.0
 */

import { vi } from 'vitest';

// ============================================================================
// CONFIGURATION GLOBALE DES TESTS
// ============================================================================

// Mock global pour Date.now() - timestamp fixe pour tests déterministes
export const MOCK_TIMESTAMP = 1609459200000; // 2021-01-01 00:00:00 UTC

// Mock global pour console pour éviter le spam dans les tests
export const mockConsole = () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
};

// Restore console après les tests
export const restoreConsole = () => {
  vi.restoreAllMocks();
};

// ============================================================================
// FIXTURES - DONNÉES DE TEST RÉUTILISABLES
// ============================================================================

/**
 * Contexte de base pour un joueur
 */
export const createPlayerContext = (overrides = {}) => ({
  playerId: 'player1',
  type: 'player',
  vehicle: {
    id: 'ship1',
    coord: '5,5',
    position: [5, 5, 0],
    fuel: 100,
    resources: {
      food: 0,
      debris: 0,
      special: 0
    },
    isMoving: false,
    progress: 0,
    targetTile: {
      position: null,
      coord: null
    },
    movementStartTime: null,
    lastUpdate: null,
    atMaxCapacity: false
  },
  ...overrides
});

/**
 * Contexte de base pour un bot
 */
export const createBotContext = (overrides = {}) => ({
  botId: 'bot1',
  type: 'bot',
  vehicle: {
    id: 'bot1',
    coord: '10,10',
    position: [10, 10, 0],
    fuel: 80,
    resources: {
      food: 0,
      debris: 0,
      special: 0
    },
    isMoving: false,
    progress: 0,
    targetTile: {
      position: null,
      coord: null
    },
    movementStartTime: null,
    lastUpdate: null,
    atMaxCapacity: false,
    startCoord: '10,10' // Position de base pour le bot
  },
  knownResources: [],
  hasNewResourceDiscovery: false,
  isDroneAtShip: true,
  hasExplored: false,
  allLocalResourcesCollected: false,
  ...overrides
});

/**
 * Tuiles de test - valides et invalides
 */
export const testTiles = {
  valid: {
    position: [15, 15, 0],
    coord: '15,15'
  },
  validWithExtra: {
    position: [20, 20, 0],
    coord: '20,20',
    type: 'resource',
    extraData: 'should be filtered'
  },
  invalid: {
    null: null,
    undefined: undefined,
    missingPosition: { coord: '10,10' },
    missingCoord: { position: [10, 10, 0] },
    invalidCoordFormat: { position: [10, 10, 0], coord: 'invalid' },
    emptyCoord: { position: [10, 10, 0], coord: '' },
    nonStringCoord: { position: [10, 10, 0], coord: 123 }
  }
};

/**
 * Événements de test standardisés
 */
export const testEvents = {
  movement: {
    validMove: { targetTile: testTiles.valid },
    invalidMove: { targetTile: testTiles.invalid.null },
    progress25: { progress: 25 },
    progress50: { progress: 50 },
    progress100: { progress: 100 },
    progressOverflow: { progress: 150 },
    progressNegative: { progress: -10 },
    newPosition: { newCoord: '7,8' },
    invalidPosition: { newCoord: null }
  },
  fuel: {
    consume5: { amount: 5 },
    consume10: { amount: 10 },
    consumeAll: { amount: 1000 },
    refuel: { amount: 100 }
  },
  resources: {
    collect: { type: 'food', amount: 10 },
    deposit: { resources: { food: 20, debris: 5 } }
  }
};

// ============================================================================
// HELPERS DE TEST
// ============================================================================

/**
 * Vérifie l'immutabilité d'une fonction
 * @param {Function} fn - Fonction à tester
 * @param {Object} input - Objet d'entrée
 * @param {...any} args - Arguments supplémentaires
 */
export const assertImmutability = (fn, input, ...args) => {
  const originalInput = JSON.parse(JSON.stringify(input));
  const result = fn(input, ...args);
  
  expect(input).toEqual(originalInput);
  expect(result).not.toBe(input); // Différence référentielle
  
  return result;
};

/**
 * Vérifie qu'une fonction est pure (même entrée = même sortie)
 * @param {Function} fn - Fonction à tester
 * @param {Object} input - Objet d'entrée
 * @param {...any} args - Arguments supplémentaires
 */
export const assertPurity = (fn, input, ...args) => {
  const result1 = fn(input, ...args);
  const result2 = fn(input, ...args);
  const result3 = fn(input, ...args);
  
  expect(result1).toEqual(result2);
  expect(result2).toEqual(result3);
  
  return result1;
};

/**
 * Teste une action avec différents scénarios
 * @param {Function} action - Action à tester
 * @param {Object} baseContext - Contexte de base
 * @param {Array} scenarios - Liste des scénarios { event, expectations }
 */
export const testActionScenarios = (action, baseContext, scenarios) => {
  scenarios.forEach(({ name, event, expectations }) => {
    const result = action(baseContext, event);
    
    expectations.forEach(({ path, value, matcher = 'toBe' }) => {
      const actualValue = path.split('.').reduce((obj, key) => obj?.[key], result);
      expect(actualValue)[matcher](value);
    });
  });
};

/**
 * Crée un spy sur Date.now() avec un timestamp fixe
 * @param {number} timestamp - Timestamp à retourner
 * @returns {Object} - Spy object avec restore method
 */
export const mockDateNow = (timestamp = MOCK_TIMESTAMP) => {
  let currentTime = timestamp;
  const spy = vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
  
  return {
    spy,
    restore: () => spy.mockRestore(),
    advance: (ms) => {
      currentTime += ms;
      spy.mockImplementation(() => currentTime);
      return currentTime;
    },
    setTime: (newTime) => {
      currentTime = newTime;
      spy.mockImplementation(() => currentTime);
      return currentTime;
    }
  };
};

/**
 * Vérifie qu'un objet respecte une structure attendue
 * @param {Object} obj - Objet à vérifier
 * @param {Object} schema - Structure attendue
 */
export const assertStructure = (obj, schema) => {
  Object.keys(schema).forEach(key => {
    expect(obj).toHaveProperty(key);
    
    if (typeof schema[key] === 'object' && schema[key] !== null) {
      if (Array.isArray(schema[key])) {
        expect(Array.isArray(obj[key])).toBe(true);
      } else {
        assertStructure(obj[key], schema[key]);
      }
    } else if (typeof schema[key] === 'string') {
      expect(typeof obj[key]).toBe(schema[key]);
    }
  });
};

/**
 * Structure attendue pour un véhicule
 */
export const vehicleSchema = {
  id: 'string',
  coord: 'string',
  position: 'object',
  fuel: 'number',
  resources: {
    food: 'number',
    debris: 'number',
    special: 'number'
  },
  isMoving: 'boolean',
  progress: 'number',
  targetTile: {
    position: 'object',
    coord: 'string'
  }
};

/**
 * Structure attendue pour un contexte player/bot
 */
export const contextSchema = {
  vehicle: vehicleSchema
};

// ============================================================================
// MATCHERS PERSONNALISÉS
// ============================================================================

/**
 * Matchers Vitest personnalisés pour les tests FSM
 */
export const customMatchers = {
  /**
   * Vérifie qu'un véhicule est en mouvement
   */
  toBeMoving: (vehicle) => {
    const pass = vehicle?.isMoving === true && vehicle?.targetTile?.coord !== null;
    return {
      pass,
      message: () => pass 
        ? `Expected vehicle not to be moving`
        : `Expected vehicle to be moving`
    };
  },
  
  /**
   * Vérifie qu'un véhicule a atteint sa destination
   */
  toHaveReachedDestination: (vehicle) => {
    const pass = vehicle?.coord === vehicle?.targetTile?.coord && vehicle?.progress === 100;
    return {
      pass,
      message: () => pass
        ? `Expected vehicle not to have reached destination`
        : `Expected vehicle to have reached destination`
    };
  },
  
  /**
   * Vérifie qu'un contexte contient une erreur
   */
  toHaveError: (context, expectedError) => {
    const hasError = context?.error !== undefined;
    const errorMatches = expectedError ? context?.error?.includes(expectedError) : true;
    const pass = hasError && errorMatches;
    
    return {
      pass,
      message: () => pass
        ? `Expected context not to have error${expectedError ? ` containing "${expectedError}"` : ''}`
        : `Expected context to have error${expectedError ? ` containing "${expectedError}"` : ''}`
    };
  }
};

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  MOCK_TIMESTAMP,
  mockConsole,
  restoreConsole,
  createPlayerContext,
  createBotContext,
  testTiles,
  testEvents,
  assertImmutability,
  assertPurity,
  testActionScenarios,
  mockDateNow,
  assertStructure,
  vehicleSchema,
  contextSchema,
  customMatchers
};
