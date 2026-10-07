import type { SessionEvent } from '../../engine/model';
import type { BotId, Coord } from '../../engine/world';

export type IncidentTone = 'danger' | 'warning' | 'electric' | 'recovery';

export interface IncidentMessage {
  title: string;
  detail: string;
  tone: IncidentTone;
  coord?: Coord;
}

function damageDetail(event: SessionEvent): string {
  const amount = event.delta?.damage;
  const total = event.after?.damage;
  return [amount ? `+${amount} % de dégâts` : null, total !== undefined ? `intégrité à ${100 - total} %` : null]
    .filter(Boolean).join(' · ');
}

export function incidentMessage(event: SessionEvent): IncidentMessage | null {
  const location = event.coord ? `Case ${event.coord}` : '';
  switch (event.type) {
    case 'danger.impact':
      return { title: event.reason === 'mine' ? 'Mine déclenchée' : 'Terrain dangereux', detail: [location, damageDetail(event)].filter(Boolean).join(' · '), tone: 'danger', coord: event.coord };
    case 'cloud.impact':
      return { title: 'Décharge électrique', detail: [location, damageDetail(event)].filter(Boolean).join(' · '), tone: 'electric', coord: event.coord };
    case 'cloud.appeared':
      return { title: 'Nuage électrique détecté', detail: location, tone: 'electric', coord: event.coord };
    case 'mine.spotted':
      return { title: 'Mine ennemie repérée', detail: location, tone: 'warning', coord: event.coord };
    case 'mine.exploded':
      return { title: 'Mine explosée', detail: location, tone: 'danger', coord: event.coord };
    case 'drone.interfered':
      return { title: 'Drone dévié par le nuage', detail: [location, event.target ? `repli vers ${event.target}` : null].filter(Boolean).join(' · '), tone: 'electric', coord: event.coord };
    case 'drone.lost':
      return { title: 'Drone détruit', detail: [location, event.reason === 'mine' ? 'sur une mine' : 'sur un terrain dangereux'].filter(Boolean).join(' · '), tone: 'danger', coord: event.coord };
    case 'fuel.stranded':
      return { title: 'Panne de carburant', detail: [location, 'Vaisseau immobilisé'].filter(Boolean).join(' · '), tone: 'danger', coord: event.coord };
    case 'ship.disabled':
      return { title: 'Vaisseau immobilisé', detail: [location, event.reason].filter(Boolean).join(' · '), tone: 'danger', coord: event.coord };
    case 'cargo.lost':
      return { title: 'Cargaison perdue', detail: [location, 'Remorquage en cours'].filter(Boolean).join(' · '), tone: 'warning', coord: event.coord };
    case 'rescue.completed':
      return { title: 'Remorquage terminé', detail: event.target ? `Retour à la base ${event.target}` : location, tone: 'recovery', coord: event.coord };
    default:
      return null;
  }
}

export function incidentVisible(event: SessionEvent, perspective: BotId | 'developer', currentCoords: ReadonlySet<Coord>): boolean {
  if (perspective === 'developer') return true;
  if (event.botId === perspective) return true;
  return event.botId === null && !!event.coord && currentCoords.has(event.coord);
}
