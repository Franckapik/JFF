import { describe, it, expect } from 'vitest';
import { createPlayer } from '../stores/usePlayerStore/utils/playerFactory.js';
import { getMainShipId, getHumanPlayerId, VEHICLE_TYPES } from '../ai/constants/playerConstants.js';

describe('Player Factory', () => {
    it('should create a player with default values', () => {
        const player = createPlayer();
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('vehicles');
        expect(player.vehicles).toEqual({});
    });
});