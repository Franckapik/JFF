import { describe, it, expect } from 'vitest';
import { 
  getHumanPlayerId,
  getBotId,
  getMainShipId,
  getDroneId,
  getAllDroneIds,
  isMainShipId,
  isDroneId,
  isBotPlayerId,
  isDroneActiveByDefault,
  VEHICLE_TYPES
} from '../ai/constants/playerConstants.js';

describe('Vehicle IDs', () => {
  describe('getHumanPlayerId', () => {
    it('should generate correct human player IDs', () => {
      expect(getHumanPlayerId()).toBe('player-1');
      expect(getHumanPlayerId(1)).toBe('player-1');
      expect(getHumanPlayerId(2)).toBe('player-2');
    });
  });

  describe('getBotId', () => {
    it('should generate correct bot IDs', () => {
      expect(getBotId(1)).toBe('bot-1');
      expect(getBotId(2)).toBe('bot-2');
    });
  });

  describe('getMainShipId', () => {
    it('should generate correct ship IDs', () => {
      expect(getMainShipId('player-1')).toBe('player-1-ship');
      expect(getMainShipId('bot-1')).toBe('bot-1-ship');
    });

    it('should handle null and undefined', () => {
      expect(getMainShipId(null)).toBe('null-ship');
      expect(getMainShipId(undefined)).toBe('undefined-ship');
    });
  });

  describe('getDroneId', () => {
    it('should generate correct drone IDs', () => {
      expect(getDroneId('player-1', 'explorer')).toBe('player-1-drone-explorer');
      expect(getDroneId('bot-1', 'combat')).toBe('bot-1-drone-combat');
    });

    it('should handle null and undefined', () => {
      expect(getDroneId(null, 'explorer')).toBe('null-drone-explorer');
      expect(getDroneId('player-1', null)).toBe('player-1-drone-null');
    });
  });

  describe('getAllDroneIds', () => {
    it('should return all drone IDs for a player', () => {
      const droneIds = getAllDroneIds('player-1');
      expect(droneIds).toHaveLength(5);
      expect(droneIds).toContain('player-1-drone-explorer');
      expect(droneIds).toContain('player-1-drone-collector');
    });

    it('should return empty array for null/undefined', () => {
      expect(getAllDroneIds(null)).toEqual([]);
      expect(getAllDroneIds(undefined)).toEqual([]);
    });
  });

  describe('isMainShipId', () => {
    it('should correctly identify ship IDs', () => {
      expect(isMainShipId('player-1-ship')).toBe(true);
      expect(isMainShipId('bot-1-ship')).toBe(true);
      expect(isMainShipId('player-1-drone-explorer')).toBe(false);
    });
  });

  describe('isDroneId', () => {
    it('should correctly identify drone IDs', () => {
      expect(isDroneId('player-1-drone-explorer')).toBe(true);
      expect(isDroneId('bot-1-drone-combat')).toBe(true);
      expect(isDroneId('player-1-ship')).toBe(false);
    });
  });

  describe('isBotPlayerId', () => {
    it('should correctly identify bot player IDs', () => {
      expect(isBotPlayerId('bot-1')).toBe(true);
      expect(isBotPlayerId('bot-10')).toBe(true);
      expect(isBotPlayerId('player-1')).toBe(false);
    });
  });

  describe('isDroneActiveByDefault', () => {
    it('should correctly identify default active drones', () => {
      expect(isDroneActiveByDefault('explorer')).toBe(true);
      expect(isDroneActiveByDefault(VEHICLE_TYPES.EXPLORER_DRONE)).toBe(true);
      expect(isDroneActiveByDefault('combat')).toBe(false);
    });
  });
});