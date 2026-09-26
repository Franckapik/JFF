import { Bot as BotIcon, Trophy } from 'lucide-react';

import type { BotView } from '../../engine/model';
import { RESOURCE_KINDS } from '../../engine/resources';
import { RULES } from '../../engine/rules';

import { BOT_COLORS, PHASE_LABELS, RESOURCE_LABELS } from './presentation';

export default function BotPanel({ bot, winner = false }: { bot: BotView; winner?: boolean }) {
  return <article className="bot-panel" style={{ borderTopColor: BOT_COLORS[bot.id] }}>
    <div className="bot-heading"><h2><BotIcon size={20} color={BOT_COLORS[bot.id]} />Bot {bot.id.slice(-1)}</h2><span>{winner && <Trophy size={17} />} {PHASE_LABELS[bot.state]}</span></div>
    <div className="bot-economy"><div><span>Score depose</span><strong>{bot.score.toLocaleString('fr-FR')}</strong></div><div><span>Budget</span><strong>{bot.budget.toLocaleString('fr-FR')}</strong></div></div>
    <dl className="bot-vitals"><div><dt>Carburant</dt><dd>{bot.fuel}%</dd></div><div><dt>Degats</dt><dd className={bot.damage >= 50 ? 'warning' : ''}>{bot.damage}%</dd></div><div><dt>Rayon</dt><dd>{bot.radius}</dd></div><div><dt>Drone</dt><dd>{bot.droneAvailable ? 'Disponible' : 'Perdu'}</dd></div></dl>
    <div className="cargo-list">{RESOURCE_KINDS.map(kind => <label key={kind}><span>{RESOURCE_LABELS[kind]}</span><span>{bot.cargo[kind]} / {RULES.capacity[kind]}</span><meter aria-label={`${bot.id} ${RESOURCE_LABELS[kind]}`} min={0} max={RULES.capacity[kind]} value={bot.cargo[kind]} /></label>)}</div>
    <div className="bot-footer"><span>Position {bot.coord}</span><span>{bot.known.length} cases connues</span></div>
    <p className="decision">{bot.decision}</p>
  </article>;
}