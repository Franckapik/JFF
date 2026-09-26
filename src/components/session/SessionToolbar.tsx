import { Activity, Dices, Download, Map, Pause, Play, RotateCcw, StepForward, Wifi, WifiOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSessionStore } from '../../stores/useSessionStore';

import { clock } from './presentation';

export default function SessionToolbar({ route }: { route: 'vue1' | 'vue2' }) {
  const { status, snapshot, error, connect, control, reset, dismissError } = useSessionStore();
  const [seed, setSeed] = useState('0');
  const sessionSeed = snapshot?.seed;
  useEffect(() => { if (sessionSeed !== undefined) setSeed(String(sessionSeed)); }, [sessionSeed]);
  const ready = status === 'connected' && !!snapshot;
  const canRun = ready && snapshot.phase !== 'finished' && snapshot.phase !== 'blocked';
  const navigate = (path: string) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); };
  const download = () => {
    if (!snapshot) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `jff-${snapshot.seed}-${snapshot.revision}.json`; anchor.click();
    URL.revokeObjectURL(url);
  };
  return <header className="session-header">
    <div className="toolbar">
      <a className="brand" href="/vue1" onClick={event => { event.preventDefault(); navigate('/vue1'); }}>JFF<span>HEX</span></a>
      <nav className="view-tabs" aria-label="Vues">
        <a href="/vue1" aria-current={route === 'vue1' ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate('/vue1'); }}><Map size={17} />Terrain</a>
        <a href="/vue2" aria-current={route === 'vue2' ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate('/vue2'); }}><Activity size={17} />Diagnostic</a>
      </nav>
      <div className="playback">
        <button className="icon-button" disabled={!canRun} onClick={() => control(snapshot?.paused ? 'RESUME' : 'PAUSE')} title={snapshot?.paused ? 'Reprendre' : 'Mettre en pause'} aria-label={snapshot?.paused ? 'Reprendre' : 'Mettre en pause'}>{snapshot?.paused ? <Play size={18} /> : <Pause size={18} />}</button>
        <button className="icon-button" disabled={!canRun || !snapshot?.paused} onClick={() => control('STEP')} title="Avancer de 100 ms" aria-label="Avancer de 100 ms"><StepForward size={18} /></button>
        <select aria-label="Vitesse" value={snapshot?.speed ?? 1} disabled={!ready} onChange={event => control('SPEED', Number(event.target.value))}>{[1, 2, 4, 8].map(speed => <option key={speed} value={speed}>{speed}x</option>)}</select>
        <time className="clock">{clock(snapshot?.elapsed ?? 0)}</time>
        <span className="run-state">{snapshot?.phase === 'blocked' ? 'Bloquee' : snapshot?.phase === 'finished' ? 'Terminee' : snapshot?.paused ? 'Pause' : ready ? 'En cours' : 'Connexion'}</span>
      </div>
      <form className="seed-control" onSubmit={event => { event.preventDefault(); reset(Number(seed)); }}>
        <label htmlFor="map-seed">Graine</label><input id="map-seed" type="number" min="0" max="4294967295" step="1" required value={seed} onChange={event => setSeed(event.target.value)} />
        <button className="icon-button" disabled={!ready} title="Rejouer cette graine" aria-label="Rejouer cette graine"><RotateCcw size={17} /></button>
      </form>
      <div className="toolbar-actions">
        <button className="icon-button" disabled={!ready} onClick={() => reset()} title="Nouvelle carte" aria-label="Nouvelle carte"><Dices size={19} /></button>
        <button className="icon-button" disabled={!ready} onClick={download} title="Exporter le snapshot" aria-label="Exporter le snapshot"><Download size={18} /></button>
        <button className={`icon-button connection ${ready ? 'online' : ''}`} disabled={status !== 'disconnected'} onClick={connect} title={ready ? 'Moteur connecte' : 'Reconnecter le moteur'} aria-label={ready ? 'Moteur connecte' : 'Reconnecter le moteur'}>{ready ? <Wifi size={18} /> : <WifiOff size={18} />}</button>
      </div>
    </div>
    {error && <div className="error-banner" role="alert"><span>{error}</span><button className="icon-button" onClick={dismissError} title="Fermer le message" aria-label="Fermer le message"><X size={16} /></button></div>}
  </header>;
}