import { addResources, emptyResources, RESOURCE_KINDS } from '../../engine/resources';
import { useSessionStore } from '../../stores/useSessionStore';

import BotPanel from './BotPanel';
import { clock, PHASE_LABELS, RESOURCE_LABELS } from './presentation';
import { useRenderCounter } from './renderMetrics';

export default function Diagnostics() {
  useRenderCounter('Diagnostics');
  const { snapshot, instanceId, gameId } = useSessionStore();
  if (!snapshot) return <main className="empty-state" role="status">Connexion au moteur...</main>;
  const bots = Object.values(snapshot.bots);
  const cargo = bots.reduce((total, bot) => addResources(total, bot.cargo), emptyResources());
  const deposited = bots.reduce((total, bot) => addResources(total, bot.deposited), emptyResources());
  const accounted = addResources(addResources(snapshot.remainingResources, cargo), addResources(deposited, snapshot.lostResources));
  const conserved = RESOURCE_KINDS.every(kind => accounted[kind] === snapshot.initialResources[kind]);
  return <main className="diagnostics">
    <div className="section-heading"><h1>Diagnostic de session</h1><span className={conserved ? 'healthy' : 'warning'}>{conserved ? 'Ressources conservees' : 'Ecart de ressources'}</span></div>
    <dl className="session-metadata"><div><dt>Revision</dt><dd>{snapshot.revision}</dd></div><div><dt>Temps logique</dt><dd>{clock(snapshot.elapsed)}</dd></div><div><dt>Snapshot</dt><dd>{(new TextEncoder().encode(JSON.stringify(snapshot)).length / 1024).toFixed(1)} ko</dd></div><div><dt>Partie</dt><dd title={gameId ?? ''}>{gameId?.split(':').slice(-1)[0]}</dd></div></dl>
    <div className="diagnostic-bots">{bots.map(bot => <BotPanel key={bot.id} bot={bot} winner={snapshot.winners.includes(bot.id)} />)}</div>
    <section className="diagnostic-section"><h2>Bilan des ressources</h2><div className="table-scroll"><table><thead><tr><th>Ressource</th><th>Initial</th><th>Carte</th><th>Cargaisons</th><th>Pertes</th><th>Ecart</th></tr></thead><tbody>{RESOURCE_KINDS.map(kind => <tr key={kind}><th>{RESOURCE_LABELS[kind]}</th><td>{snapshot.initialResources[kind]}</td><td>{snapshot.remainingResources[kind]}</td><td>{cargo[kind]}</td><td>{snapshot.lostResources[kind]}</td><td>{accounted[kind] - snapshot.initialResources[kind]}</td></tr>)}</tbody></table></div></section>
    <section className="diagnostic-section"><h2>Etats et activite</h2><div className="table-scroll"><table><thead><tr><th>Bot</th><th>Etat XState</th><th>Cible</th><th>Pas</th><th>Carburant utilise</th><th>Scans</th><th>Tentatives</th><th>Collectes non vides</th><th>Tuiles distinctes</th><th>Secours</th><th>Depenses</th></tr></thead><tbody>{bots.map(bot => <tr key={bot.id}><th>{bot.id}</th><td>{PHASE_LABELS[bot.state]}</td><td>{bot.operation?.target ?? '-'}</td><td>{bot.statistics.steps}</td><td>{bot.statistics.fuelUsed}</td><td>{bot.statistics.scans}</td><td>{bot.statistics.collectionAttempts}</td><td>{bot.statistics.collections}</td><td>{Object.keys(bot.harvested).length}</td><td>{bot.statistics.rescues}</td><td>{bot.spent}</td></tr>)}</tbody></table></div></section>
    <section className="diagnostic-section"><h2>Provenance des collectes</h2><div className="table-scroll"><table><thead><tr><th>Bot</th><th>Tuile</th>{RESOURCE_KINDS.map(kind => <th key={kind}>{RESOURCE_LABELS[kind]}</th>)}</tr></thead><tbody>{bots.flatMap(bot => Object.entries(bot.harvested).map(([coord, resources]) => resources && <tr key={`${bot.id}:${coord}`}><th>{bot.id}</th><td>{coord}</td>{RESOURCE_KINDS.map(kind => <td key={kind}>{resources[kind]}</td>)}</tr>))}</tbody></table></div></section>
    <section className="diagnostic-section"><h2>Journal des decisions</h2><ol className="decision-log">{snapshot.logs.slice(-30).reverse().map(entry => <li key={entry.sequence}><time>{clock(entry.time)}</time><strong>{entry.botId ?? 'Session'}</strong><span>{entry.message}</span></li>)}</ol></section>
    <footer className="session-id">Instance : {instanceId}<br />Partie : {gameId}</footer>
  </main>;
}
