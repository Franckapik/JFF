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

  it('identifies a private trust change, its direction, cause and location', () => {
    const change: SessionEvent = { ...impact, type: 'trust.changed', category: 'social',
      reason: 'Mine ennemie repérée pendant l’armement',
      trust: { toward: 'bot-1', cause: 'mine-spotted', before: 50, delta: -12, after: 38 } };
    expect(incidentMessage(change)).toMatchObject({
      title: 'Confiance affaiblie · Bot 0 → Bot 1',
      detail: '-12 points · Mine ennemie repérée pendant l’armement · Case 1,0',
      coord: '1,0',
    });
    expect(incidentVisible(change, 'bot-0', new Set())).toBe(true);
    expect(incidentVisible(change, 'bot-1', new Set(['1,0']))).toBe(false);
    expect(incidentVisible(change, 'developer', new Set())).toBe(true);
  });
});
