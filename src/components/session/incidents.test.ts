import { describe, expect, it } from 'vitest';

import type { SessionEvent } from '../../engine/model';

import { incidentMessage, incidentVisible } from './incidents';

const impact: SessionEvent = {
  sequence: 4,
  time: 1200,
  botId: 'bot-0',
  type: 'danger.impact',
  category: 'incident',
  coord: '1,0',
  reason: 'mine',
  delta: { damage: 25 },
  after: { damage: 70 },
};

describe('incident feedback', () => {
  it('names the cause, location and consequence of an impact', () => {
    expect(incidentMessage(impact)).toMatchObject({
      title: 'Mine déclenchée',
      detail: 'Case 1,0 · +25 % de dégâts · intégrité à 30 %',
      tone: 'danger',
      coord: '1,0',
    });
  });

  it('only shows bot incidents to their owner and world hazards in current vision', () => {
    const cloud: SessionEvent = { ...impact, botId: null, type: 'cloud.appeared' };
    expect(incidentVisible(impact, 'bot-0', new Set())).toBe(true);
    expect(incidentVisible(impact, 'bot-1', new Set(['1,0']))).toBe(false);
    expect(incidentVisible(cloud, 'bot-1', new Set())).toBe(false);
    expect(incidentVisible(cloud, 'bot-1', new Set(['1,0']))).toBe(true);
    expect(incidentVisible(impact, 'developer', new Set())).toBe(true);
  });

  it('ignores routine events in the live feed', () => {
    expect(incidentMessage({ ...impact, type: 'movement.arrived', category: 'movement' })).toBeNull();
  });
});
