import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { GameSession } from '../../engine/session';

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
});