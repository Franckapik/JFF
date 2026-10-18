import type { SessionEvent, TrustCause } from '../../engine/model';
import { BOT_IDS, type BotId, type Coord } from '../../engine/world';

interface TrustHudProps {
  trust: Record<BotId, number>;
  lastChange: Record<BotId, SessionEvent | null>;
  perspective: BotId | 'developer';
  onSelect: (coord: Coord) => void;
}

const CAUSE_LABELS: Record<TrustCause, string> = {
  yield: 'Priorité cédée',
  depletion: 'Réserve épuisée',
  'mine-spotted': 'Mine repérée',
  'mine-hit': 'Vaisseau touché',
  'drone-lost': 'Drone perdu',
};

function trustState(value: number): { label: string; tone: string } {
  if (value < 30) return { label: 'Défiance', tone: 'low' };
  if (value < 60) return { label: 'Prudence', tone: 'middle' };
  if (value < 80) return { label: 'Confiance', tone: 'high' };
  return { label: 'Alliance', tone: 'allied' };
}

export default function TrustHud({ trust, lastChange, perspective, onSelect }: TrustHudProps) {
  const ids = perspective === 'developer' ? BOT_IDS : [perspective];
  return <section className="trust-hud" aria-label="Confiance entre les bots">
    <div className="trust-hud-heading"><span>LIEN ENTRE BOTS</span><strong>Confiance</strong></div>
    {ids.map(id => {
      const other: BotId = id === 'bot-0' ? 'bot-1' : 'bot-0';
      const value = trust[id];
      const { label, tone } = trustState(value);
      const event = lastChange[id];
      return <div className={`trust-hud-row ${tone}`} key={id}>
        <div className="trust-hud-meta"><span>BOT {id.slice(-1)} <b>→</b> BOT {other.slice(-1)}</span><strong>{value}<small>/100</small></strong></div>
        <div className="trust-hud-track" role="progressbar" aria-label={`Confiance du Bot ${id.slice(-1)} envers le Bot ${other.slice(-1)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={label}><span style={{ width: `${value}%` }} /></div>
        <div className="trust-hud-caption"><em>{label}</em>{event?.trust && <button type="button" onClick={() => event.coord && onSelect(event.coord)} title={event.reason} disabled={!event.coord}>{event.trust.delta > 0 ? '+' : ''}{event.trust.delta} · {CAUSE_LABELS[event.trust.cause]}</button>}</div>
      </div>;
    })}
  </section>;
}
