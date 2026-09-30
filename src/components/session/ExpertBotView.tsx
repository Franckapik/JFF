import {
  Activity,
  BarChart3,
  Bot as BotIcon,
  CircleHelp,
  Crosshair,
  Eye,
  Footprints,
  Fuel,
  History,
  PackageCheck,
  PackageOpen,
  PackageX,
  Radar,
  Route,
  ShoppingCart,
  TriangleAlert,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';

import type { BotView, OperationKind, SessionEvent, SessionEventCategory, SessionEventType } from '../../engine/model';
import { RESOURCE_KINDS, resourceTotal } from '../../engine/resources';

import { clock, PHASE_LABELS, RESOURCE_LABELS } from './presentation';

type Tab = 'history' | 'route' | 'stats';
type EventIcon = ComponentType<{ size?: number }>;

const OPERATION_ICONS: Record<OperationKind, EventIcon> = {
  move: Route,
  wait: Footprints,
  scan: Radar,
  collect: PackageOpen,
  service: Wrench,
  upgrade: Activity,
  purchase: ShoppingCart,
  rescue: Truck,
};

const EVENT_LABELS: Record<SessionEventType, string> = {
  'session.started': 'Session initialisee',
  'operation.started': 'Operation planifiee',
  'movement.arrived': 'Etape atteinte',
  'danger.impact': 'Impact sur une case dangereuse',
  'cloud.appeared': 'Nuage électrique apparu',
  'cloud.moved': 'Nuage électrique déplacé',
  'cloud.disappeared': 'Nuage électrique dissipé',
  'cloud.impact': 'Impact du nuage sur le vaisseau',
  'drone.interfered': 'Drone repoussé par le nuage',
  'drone.bounced': 'Drone rebondi sur le bord',
  'scan.completed': 'Scan termine',
  'drone.lost': 'Drone detruit',
  'collection.completed': 'Collecte terminee',
  'resources.deposited': 'Ressources deposees',
  'fuel.refueled': 'Plein effectue',
  'ship.repaired': 'Reparation effectuee',
  'exploration.upgraded': 'Rayon augmente',
  'drone.replaced': 'Drone remplace',
  'fuel.stranded': 'Panne de carburant',
  'cargo.lost': 'Cargaison perdue',
  'rescue.completed': 'Remorquage termine',
  'bot.eliminated': 'Bot elimine',
  'bot.finished': 'Bot termine',
  'session.finished': 'Session terminee',
  'session.blocked': 'Session bloquee',
};

const CATEGORY_ICONS: Record<SessionEventCategory, EventIcon> = {
  decision: CircleHelp,
  movement: Route,
  incident: TriangleAlert,
  resource: PackageOpen,
  maintenance: Wrench,
  economy: ShoppingCart,
  lifecycle: Activity,
};

const CATEGORY_LABELS: Record<SessionEventCategory, string> = {
  decision: 'Decisions',
  movement: 'Mouvements',
  incident: 'Incidents',
  resource: 'Ressources',
  maintenance: 'Maintenance',
  economy: 'Achats',
  lifecycle: 'Cycle de vie',
};

function EventGlyph({ event }: { event: SessionEvent }) {
  if (event.type === 'drone.lost' || event.type === 'drone.replaced') return <BotIcon size={16} />;
  if (event.type === 'fuel.stranded' || event.type === 'fuel.refueled') return <Fuel size={16} />;
  if (event.type === 'cargo.lost') return <PackageX size={16} />;
  if (event.type === 'resources.deposited') return <PackageCheck size={16} />;
  if (event.type === 'rescue.completed') return <Truck size={16} />;
  const Icon = CATEGORY_ICONS[event.category];
  return <Icon size={16} />;
}

function formatResources(event: SessionEvent): string | null {
  if (!event.resources || resourceTotal(event.resources) === 0) return null;
  return RESOURCE_KINDS.map(kind => `${RESOURCE_LABELS[kind]} ${event.resources![kind]}`).join(' / ');
}

function formatEventDetail(event: SessionEvent): string {
  const location = event.coord ? `Case ${event.coord}` : null;
  const target = event.target && event.target !== event.coord ? `cible ${event.target}` : null;
  const resources = formatResources(event);
  const delta = event.delta
    ? Object.entries(event.delta).map(([key, value]) => `${key} ${value! > 0 ? '+' : ''}${value}`).join(', ')
    : null;
  return [event.reason, location, target, resources, delta].filter(Boolean).join(' - ');
}

export default function ExpertBotView({ bot, events, onClose }: { bot: BotView; events: SessionEvent[]; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('history');
  const [category, setCategory] = useState<SessionEventCategory | 'all'>('all');
  const filteredEvents = events.filter(event => event.botId === bot.id || event.botId === null)
    .filter(event => category === 'all' || event.category === category)
    .slice()
    .reverse();
  const visits = Object.entries(bot.visits).sort(([, left], [, right]) => (right ?? 0) - (left ?? 0));
  const incidents = {
    impacts: events.filter(event => event.botId === bot.id && (event.type === 'danger.impact' || event.type === 'cloud.impact')).length,
    cargoLosses: events.filter(event => event.botId === bot.id && event.type === 'cargo.lost').length,
    refuels: events.filter(event => event.botId === bot.id && event.type === 'fuel.refueled').length,
    repairs: events.filter(event => event.botId === bot.id && event.type === 'ship.repaired').length,
  };
  const OperationIcon = bot.operation ? OPERATION_ICONS[bot.operation.kind] : Activity;

  return <section className="expert-drawer" aria-label={`Detail expert du Bot ${bot.id.slice(-1)}`}>
    <header className="expert-drawer-heading">
      <div><BotIcon size={18} /><strong>Bot {bot.id.slice(-1)}</strong><span>{PHASE_LABELS[bot.state]}</span></div>
      <button className="icon-button" onClick={onClose} title="Fermer le mode expert" aria-label="Fermer le mode expert"><X size={17} /></button>
    </header>
    <div className="expert-tabs" role="tablist" aria-label="Informations expertes">
      <button role="tab" aria-selected={tab === 'history'} onClick={() => setTab('history')} title="Historique" aria-label="Historique"><History size={17} /></button>
      <button role="tab" aria-selected={tab === 'route'} onClick={() => setTab('route')} title="Route" aria-label="Route"><Route size={17} /></button>
      <button role="tab" aria-selected={tab === 'stats'} onClick={() => setTab('stats')} title="Statistiques" aria-label="Statistiques"><BarChart3 size={17} /></button>
    </div>

    {tab === 'history' && <div className="expert-tab-panel" role="tabpanel">
      <div className="event-filters" aria-label="Filtrer les evenements">
        <button aria-pressed={category === 'all'} onClick={() => setCategory('all')} title="Tous" aria-label="Tous les evenements"><History size={15} /></button>
        {(Object.keys(CATEGORY_ICONS) as SessionEventCategory[]).map(key => {
          const Icon = CATEGORY_ICONS[key];
          return <button key={key} aria-pressed={category === key} onClick={() => setCategory(key)} title={CATEGORY_LABELS[key]} aria-label={CATEGORY_LABELS[key]}><Icon size={15} /></button>;
        })}
      </div>
      <ol className="expert-timeline">
        {filteredEvents.map(event => <li key={event.sequence} className={event.category === 'incident' ? 'incident' : ''}>
          <span className="event-icon" title={CATEGORY_LABELS[event.category]}><EventGlyph event={event} /></span>
          <time>{clock(event.time)}</time>
          <div><strong>{EVENT_LABELS[event.type]}</strong>{formatEventDetail(event) && <small>{formatEventDetail(event)}</small>}</div>
        </li>)}
        {filteredEvents.length === 0 && <li className="empty-expert">Aucun evenement dans ce filtre</li>}
      </ol>
    </div>}

    {tab === 'route' && <div className="expert-tab-panel expert-route" role="tabpanel">
      <dl className="expert-current">
        <div><dt><OperationIcon size={16} />Operation</dt><dd>{bot.operation ? `${bot.operation.kind} - ${Math.ceil(bot.operation.remaining / 100) / 10}s` : 'Aucune'}</dd></div>
        <div><dt><Crosshair size={16} />Cible</dt><dd>{bot.operation?.target ?? '-'}</dd></div>
        {bot.operation?.kind === 'scan' && <div><dt><Crosshair size={16} />Cible prévue</dt><dd>{bot.operation.scanInitialTarget ?? bot.operation.target}</dd></div>}
        <div><dt><Route size={16} />Objectif</dt><dd>{bot.goal ? `${bot.goal.reason} vers ${bot.goal.coord}` : '-'}</dd></div>
        <div><dt><Eye size={16} />Connues</dt><dd>{bot.known.length}</dd></div>
      </dl>
      {bot.operation && <progress aria-label="Progression de l'operation" max={bot.operation.duration} value={bot.operation.duration - bot.operation.remaining} />}
      {bot.operation?.scanDetour && <div className="route-steps" aria-label="Trajet perturbé du drone">
        <span>Nuage {bot.operation.scanDetour.contact}</span>
        <span>Bord {bot.operation.scanDetour.edge}</span>
        <span>Visite {bot.operation.scanDetour.destination}</span>
        <span>Retour {bot.coord}</span>
      </div>}
      <div className="route-steps" aria-label="Etapes restantes">{bot.route.length ? bot.route.map((coord, index) => <span key={`${coord}:${index}`}>{coord}</span>) : <small>Aucune etape restante</small>}</div>
      <h3><Footprints size={16} />Cases les plus visitees</h3>
      <ol className="visit-list">{visits.slice(0, 8).map(([coord, count]) => <li key={coord}><span>{coord}</span><strong>{count}</strong></li>)}</ol>
    </div>}

    {tab === 'stats' && <div className="expert-tab-panel" role="tabpanel">
      <dl className="expert-stats">
        <div><dt><Footprints size={17} />Pas</dt><dd>{bot.statistics.steps}</dd></div>
        <div><dt><Fuel size={17} />Carburant utilise</dt><dd>{bot.statistics.fuelUsed}</dd></div>
        <div><dt><Radar size={17} />Scans</dt><dd>{bot.statistics.scans}</dd></div>
        <div><dt><BotIcon size={17} />Drones perdus</dt><dd>{bot.statistics.droneLosses}</dd></div>
        <div><dt><PackageOpen size={17} />Collectes</dt><dd>{bot.statistics.collections}/{bot.statistics.collectionAttempts}</dd></div>
        <div><dt><Truck size={17} />Remorquages</dt><dd>{bot.statistics.rescues}</dd></div>
        <div><dt><TriangleAlert size={17} />Impacts</dt><dd>{incidents.impacts}</dd></div>
        <div><dt><PackageX size={17} />Pertes cargo</dt><dd>{incidents.cargoLosses}</dd></div>
        <div><dt><Fuel size={17} />Pleins</dt><dd>{incidents.refuels}</dd></div>
        <div><dt><Wrench size={17} />Reparations</dt><dd>{incidents.repairs}</dd></div>
      </dl>
      <h3><PackageCheck size={16} />Depots cumules</h3>
      <div className="expert-resources">{RESOURCE_KINDS.map(kind => <span key={kind} title={RESOURCE_LABELS[kind]}>{RESOURCE_LABELS[kind]} <strong>{bot.deposited[kind]}</strong></span>)}</div>
    </div>}
  </section>;
}
