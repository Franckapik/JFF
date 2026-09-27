import { Activity, Bot as BotIcon, Fuel, PackageX, Radar, Route, Skull, TriangleAlert, Trophy, Truck } from 'lucide-react';

import type { BotView, SessionEvent } from '../../engine/model';
import { RESOURCE_KINDS } from '../../engine/resources';
import { RULES } from '../../engine/rules';

import { BOT_COLORS, PHASE_LABELS, RESOURCE_LABELS } from './presentation';

export default function BotPanel({ bot, winner = false, expert = false, events = [], onOpenExpert }: { bot: BotView; winner?: boolean; expert?: boolean; events?: SessionEvent[]; onOpenExpert?: () => void }) {
  const progress = bot.operation ? Math.round((1 - bot.operation.remaining / bot.operation.duration) * 100) : 0;
  const impacts = events.filter(event => event.botId === bot.id && event.type === 'danger.impact').length;
  const cargoLosses = events.filter(event => event.botId === bot.id && event.type === 'cargo.lost').length;
  return <article className="bot-panel" style={{ borderTopColor: BOT_COLORS[bot.id] }}>
    <div className="bot-heading"><h2><BotIcon size={20} color={BOT_COLORS[bot.id]} />Bot {bot.id.slice(-1)}</h2><span>{winner && <Trophy size={17} />} {PHASE_LABELS[bot.state]}</span></div>
    <div className="bot-economy"><div><span>Score depose</span><strong>{bot.score.toLocaleString('fr-FR')}</strong></div><div><span>Budget</span><strong>{bot.budget.toLocaleString('fr-FR')}</strong></div></div>
    <dl className="bot-vitals"><div><dt>Carburant commun</dt><dd>{bot.fuel}%</dd></div><div><dt>Degats</dt><dd className={bot.damage >= 50 ? 'warning' : ''}>{bot.damage}%</dd></div><div><dt>Rayon</dt><dd>{bot.radius}</dd></div><div><dt>Drone</dt><dd>{bot.droneAvailable ? 'Disponible' : 'Perdu'}</dd></div></dl>
    <div className="cargo-list">{RESOURCE_KINDS.map(kind => <label key={kind}><span>{RESOURCE_LABELS[kind]}</span><span>{bot.cargo[kind]} / {RULES.capacity[kind]}</span><meter aria-label={`${bot.id} ${RESOURCE_LABELS[kind]}`} min={0} max={RULES.capacity[kind]} value={bot.cargo[kind]} /></label>)}</div>
    <div className="bot-footer"><span>Position {bot.coord}</span><span>{bot.known.length} cases connues</span></div>
    <p className="decision">{bot.decision}</p>
    {expert && <div className="expert-summary" aria-label={`Resume expert du Bot ${bot.id.slice(-1)}`}>
      <button onClick={onOpenExpert} title={`Operation ${bot.operation?.kind ?? 'inactive'} : ${progress}%`} aria-label={`Operation ${bot.operation?.kind ?? 'inactive'}, progression ${progress}%`}><Route size={16} /><span>{progress}%</span></button>
      <button onClick={onOpenExpert} className={bot.fuel <= RULES.fuelUrgencyThreshold ? 'caution' : ''} title={`Carburant actuel ${bot.fuel}%`} aria-label={`Carburant actuel ${bot.fuel}%`}><Fuel size={16} /><span>{bot.fuel}</span></button>
      <button onClick={onOpenExpert} className={bot.damage > 0 ? 'caution' : ''} title={`${impacts} impacts, ${bot.damage}% de degats actuels`} aria-label={`${impacts} impacts, ${bot.damage}% de degats actuels`}><TriangleAlert size={16} /><span>{impacts}</span></button>
      <button onClick={onOpenExpert} className={!bot.droneAvailable ? 'critical' : ''} title={`${bot.statistics.droneLosses} drones detruits`} aria-label={`${bot.statistics.droneLosses} drones detruits`}><Radar size={16} /><span>{bot.statistics.droneLosses}</span></button>
      <button onClick={onOpenExpert} title={`${bot.statistics.rescues} remorquages`} aria-label={`${bot.statistics.rescues} remorquages`}><Truck size={16} /><span>{bot.statistics.rescues}</span></button>
      <button onClick={onOpenExpert} className={bot.state === 'eliminated' || cargoLosses > 0 ? 'critical' : ''} title={bot.eliminationReason ?? `${cargoLosses} pertes de cargaison`} aria-label={bot.eliminationReason ?? `${cargoLosses} pertes de cargaison`}>{bot.state === 'eliminated' ? <Skull size={16} /> : cargoLosses > 0 ? <PackageX size={16} /> : <Activity size={16} />}<span>{cargoLosses}</span></button>
    </div>}
  </article>;
}
