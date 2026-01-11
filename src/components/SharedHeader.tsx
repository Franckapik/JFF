/**
 * ==========================================================================
 * SHARED HEADER - Compact header for all views
 * ==========================================================================
 * 
 * Composant header minimaliste partagé entre Vue1 et Vue2.
 * Affiche uniquement icônes et chiffres, positionnement top-right.
 * 
 * Features:
 * - Instance ID, Update Counter, Connection Status
 * - Reset Game button
 * - View switcher buttons (discrete)
 * - Compact design avec icônes seulement
 * - Position absolute top-right
 */

import { useSharedWorkerStore } from '../stores/useSharedWorkerStore';

function getCurrentRoute(): 'vue1' | 'vue2' {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  return pathname === '/vue2' ? 'vue2' : 'vue1';
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function SharedHeader() {
  const instanceId = useSharedWorkerStore((s) => s.instanceId);
  const updateCounter = useSharedWorkerStore((s) => s.updateCounter);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  const lastUpdateTimestamp = useSharedWorkerStore((s) => s.lastUpdateTimestamp);
  const resetGame = useSharedWorkerStore((s) => s.resetGame);
  const currentRoute = getCurrentRoute();

  const timeSinceUpdate = lastUpdateTimestamp
    ? Math.round((Date.now() - lastUpdateTimestamp) / 1000)
    : null;

  return (
    <div style={{
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '8px 12px',
      borderRadius: '6px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      color: 'white'
    }}>
      {/* Connection Status Dot */}
      <div
        title={isConnected ? 'Connected' : 'Disconnected'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#10b981' : '#ef4444',
          flexShrink: 0
        }}
      />

      {/* Update Counter */}
      <div
        title="Update count"
        style={{
          fontFamily: 'monospace',
          fontWeight: 'bold',
          minWidth: '24px',
          textAlign: 'center'
        }}
      >
        {updateCounter}
      </div>

      {/* Time Since Last Update */}
      {timeSinceUpdate !== null && (
        <div
          title="Seconds since last update"
          style={{
            fontSize: '10px',
            color: '#9ca3af',
            minWidth: '20px',
            textAlign: 'center'
          }}
        >
          {timeSinceUpdate}s
        </div>
      )}

      {/* Instance ID (truncated) */}
      <div
        title={instanceId || 'No instance ID'}
        style={{
          fontSize: '10px',
          color: '#9ca3af',
          fontFamily: 'monospace',
          maxWidth: '60px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {instanceId ? instanceId.slice(0, 8) : '---'}
      </div>

      {/* Separator */}
      <div style={{ width: '1px', height: '16px', backgroundColor: '#4b5563' }} />

      {/* View Switcher Buttons (discrete) */}
      <button
        onClick={() => navigateTo('/vue1')}
        title="Switch to Vue 1 (R3F)"
        style={{
          background: currentRoute === 'vue1' ? '#3b82f6' : 'transparent',
          border: '1px solid #4b5563',
          cursor: 'pointer',
          fontSize: '10px',
          padding: '2px 6px',
          color: currentRoute === 'vue1' ? 'white' : '#9ca3af',
          borderRadius: '3px',
          transition: 'all 0.2s',
          fontWeight: currentRoute === 'vue1' ? 'bold' : 'normal'
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#e5e7eb';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#6b7280';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = currentRoute === 'vue1' ? 'white' : '#9ca3af';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#4b5563';
        }}
      >
        V1
      </button>

      <button
        onClick={() => navigateTo('/vue2')}
        title="Switch to Vue 2 (Full)"
        style={{
          background: currentRoute === 'vue2' ? '#3b82f6' : 'transparent',
          border: '1px solid #4b5563',
          cursor: 'pointer',
          fontSize: '10px',
          padding: '2px 6px',
          color: currentRoute === 'vue2' ? 'white' : '#9ca3af',
          borderRadius: '3px',
          transition: 'all 0.2s',
          fontWeight: currentRoute === 'vue2' ? 'bold' : 'normal'
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#e5e7eb';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#6b7280';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = currentRoute === 'vue2' ? 'white' : '#9ca3af';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#4b5563';
        }}
      >
        V2
      </button>

      {/* Separator */}
      <div style={{ width: '1px', height: '16px', backgroundColor: '#4b5563' }} />

      {/* Reset Button */}
      <button
        onClick={() => resetGame()}
        title="Reset game"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          padding: '2px 4px',
          color: '#ef4444',
          opacity: isConnected ? 1 : 0.5,
          pointerEvents: isConnected ? 'auto' : 'none',
          transition: 'color 0.2s'
        }}
        onMouseOver={(e) => {
          if (isConnected) {
            (e.currentTarget as HTMLButtonElement).style.color = '#dc2626';
          }
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
        }}
      >
        🔄
      </button>
    </div>
  );
}
