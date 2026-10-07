import { useFrame } from '@react-three/fiber';
import { AlertTriangle, CloudLightning, Fuel, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';

import type { BotView } from '../../engine/model';
import { RULES } from '../../engine/rules';
import { worldPosition, type Coord } from '../../engine/world';

import { clock } from './presentation';
import type { ActiveIncident } from './useIncidentAlerts';

const PULSE_DURATION = 2400;

function IncidentPulse({ alert }: { alert: ActiveIncident }) {
  const ring = useRef<Mesh>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const coord = alert.message.coord!;
  useFrame(() => {
    const progress = Math.min(1, Math.max(0, (Date.now() - alert.receivedAt) / PULSE_DURATION));
    if (ring.current) ring.current.scale.setScalar(0.75 + progress * 1.5);
    if (material.current) material.current.opacity = (1 - progress) * 0.85;
  });
  const color = alert.message.tone === 'electric' ? '#21b5d4' : alert.message.tone === 'recovery' ? '#2f9b71' : '#d74737';
  const [x, , z] = worldPosition(coord);
  return <mesh ref={ring} position={[x, 0.3, z]} rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[0.53, 0.68, 32]} />
    <meshBasicMaterial ref={material} color={color} transparent opacity={0.85} />
  </mesh>;
}

export function IncidentPulses({ alerts }: { alerts: ActiveIncident[] }) {
  const reducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return null;
  return <>{alerts.filter(alert => alert.message.coord && Date.now() - alert.receivedAt < PULSE_DURATION).map(alert =>
    <IncidentPulse key={alert.event.sequence} alert={alert} />
  )}</>;
}

export function IncidentHud({ alerts, bot, cloudVisible, onSelect }: { alerts: ActiveIncident[]; bot: BotView; cloudVisible: boolean; onSelect: (coord: Coord) => void }) {
  const criticalDamage = bot.damage >= RULES.slowMovementThreshold;
  const lowFuel = bot.fuel <= RULES.fuelUrgencyThreshold;
  const threats = [bot.mineWarning && 'Mine à proximité', cloudVisible && 'Nuage électrique visible', criticalDamage && 'Vaisseau ralenti', lowFuel && 'Carburant critique'].filter((threat): threat is string => typeof threat === 'string');
  return <>
    {alerts.length > 0 && <div className="incident-feed" role="log" aria-label="Incidents récents" aria-live="polite" aria-relevant="additions">
      <div className="incident-feed-heading"><span className="incident-live-dot" />EN DIRECT <span>· {alerts.length} incident{alerts.length > 1 ? 's' : ''}</span></div>
      {[...alerts].reverse().map(alert => {
        const Icon = alert.message.tone === 'electric' ? CloudLightning : alert.message.tone === 'recovery' ? ShieldCheck : AlertTriangle;
        return <button type="button" key={alert.event.sequence} className={`incident-card ${alert.message.tone}`} onClick={() => alert.message.coord && onSelect(alert.message.coord)} disabled={!alert.message.coord} aria-label={`${alert.message.title}. ${alert.message.detail}${alert.message.coord ? '. Voir la case' : ''}`}>
          <span className="incident-card-icon"><Icon size={18} /></span>
          <span className="incident-card-copy"><strong>{alert.message.title}</strong><small>{alert.message.detail}</small></span>
          <time>{clock(alert.event.time)}</time>
        </button>;
      })}
    </div>}
    <div className={`scene-status${threats.length || bot.state === 'disabled' ? ' under-threat' : ''}`} aria-label={`État du Bot ${bot.id.slice(-1)}`}>
      <div className="scene-status-heading"><span><ShieldAlert size={15} /> BOT {bot.id.slice(-1)} · ÉTAT DU VAISSEAU</span><strong>{bot.state === 'disabled' ? 'IMMOBILISÉ' : threats.length ? 'VIGILANCE' : 'STABLE'}</strong></div>
      <div className="scene-status-meters">
        <div><span>Intégrité <strong>{100 - bot.damage} %</strong></span><meter aria-label={`Intégrité du Bot ${bot.id.slice(-1)}`} min="0" max="100" value={100 - bot.damage} className={criticalDamage ? 'critical' : bot.damage > 0 ? 'caution' : ''} /></div>
        <div><span><Fuel size={12} /> Carburant <strong>{bot.fuel} %</strong></span><meter aria-label={`Carburant du Bot ${bot.id.slice(-1)}`} min="0" max="100" value={bot.fuel} className={lowFuel ? 'critical' : ''} /></div>
      </div>
      {threats.length > 0 && <div className="scene-threats">{threats.map(threat => <span key={threat}>{threat}</span>)}</div>}
    </div>
  </>;
}
