import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { GameSession } from '../../engine/session';
import type { SessionEvent } from '../../engine/model';

import BotPanel from './BotPanel';
import ExpertBotView from './ExpertBotView';

describe('expert bot view', () => {
  it('renders an accessible expert summary and timeline from the authoritative snapshot', () => {
    const session = new GameSession(42);
    session.advance(1000);
    const snapshot = session.getSnapshot();
    const bot = snapshot.bots['bot-0'];

    const summary = renderToStaticMarkup(<BotPanel bot={bot} expert events={snapshot.events} onOpenExpert={() => undefined} />);
    const detail = renderToStaticMarkup(<ExpertBotView bot={bot} events={snapshot.events} onClose={() => undefined} />);

    expect(summary.match(/<button/g)).toHaveLength(6);
    expect(summary).toContain('Resume expert du Bot 0');
    expect(summary).toContain('Carburant actuel');
    expect(detail).toContain('Detail expert du Bot 0');
    expect(detail).toContain('aria-label="Historique"');
    expect(detail).toContain('aria-label="Route"');
    expect(detail).toContain('aria-label="Statistiques"');
    expect(detail).toContain('Operation planifiee');

    session.stop();
  });

  it('shows current points, budget and actions without cumulative deposits', () => {
    const session = new GameSession(42);
    const bot = { ...session.getSnapshot().bots['bot-0'], score: 20, budget: 15, actions: 4, actionsSpent: 1,
      deposited: { food: 20, debris: 65, special: 5 } };
    const events: SessionEvent[] = [
      { sequence: 1, time: 100, botId: bot.id, type: 'resources.deposited', category: 'resource', delta: { budget: 65, score: 20, actions: 5 } },
      { sequence: 2, time: 200, botId: bot.id, type: 'drone.replaced', category: 'economy', delta: { budget: -50 } },
      { sequence: 3, time: 300, botId: bot.id, type: 'mine.placed', category: 'incident', delta: { actions: -1 } },
    ];
    const markup = renderToStaticMarkup(<BotPanel bot={bot} events={events} />);
    expect(markup).toContain('>Points</span><strong>20</strong>');
    expect(markup).toContain('>Budget</span><strong>15</strong>');
    expect(markup).toContain('>Actions</span><strong>4</strong>');
    expect(markup).not.toContain('Score par ressource');
    expect(markup).toContain('Carte Mine');
    expect(markup).toContain('+65');
    expect(markup).toContain('+5');
    expect(markup).toContain('−50');
    expect(markup).toContain('−1');
    const detail = renderToStaticMarkup(<ExpertBotView bot={bot} events={events} onClose={() => undefined} />);
    expect(detail).not.toContain('Depots cumules');
    session.stop();
  });
});
