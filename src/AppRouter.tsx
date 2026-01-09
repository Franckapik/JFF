/**
 * ==========================================================================
 * APP ROUTER - Routing pour les vues SharedWorker
 * ==========================================================================
 * 
 * ✅ Phase 5 Migration: Worker 100% autonome
 * 
 * Ce module gère le routing simple pour les différentes vues:
 * 
 * Routes:
 * - /vue1 : Vue simple connectée au SharedWorker (bot cards)
 * - /vue2 : Vue complète avec visualisation FSM détaillée
 * 
 * Architecture:
 * - Worker autonome: FSM pure sans dépendances React
 * - Vue1/Vue2: Consommateurs via useSharedWorkerStore
 * - Synchronisation: Multi-onglets via BroadcastChannel
 * 
 * Test de synchronisation:
 * 1. Ouvrir /vue1 dans un onglet
 * 2. Ouvrir /vue2 dans un autre onglet
 * 3. Observer: même instanceId, updateCounter, états FSM
 * 
 * Pas de dépendance à react-router pour rester léger.
 * Utilise un simple switch basé sur window.location.pathname.
 * 
 * @see docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md
 */

import React from 'react';

import SharedFSMVisualization from './components/SharedFSMVisualization';
import SharedView from './components/SharedView';

// =========================================================================
// TYPES
// =========================================================================

type RouteKey = 'vue1' | 'vue2';

interface RouteConfig {
  path: string;
  component: React.ReactNode;
  title: string;
}

// =========================================================================
// ROUTE CONFIGURATION
// =========================================================================

const routes: Record<RouteKey, RouteConfig> = {
  vue1: {
    path: '/vue1',
    component: <SharedView viewId="vue1" />,
    title: 'FSM Game - Vue 1 (SharedWorker)'
  },
  vue2: {
    path: '/vue2',
    component: <SharedFSMVisualization />,
    title: 'FSM Game - Vue 2 (SharedWorker + Full Visualization)'
  }
};

// =========================================================================
// ROUTER COMPONENT
// =========================================================================

function matchRoute(pathname: string): RouteKey {
  // Normalize path (remove trailing slash)
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  
  if (normalizedPath === '/vue2') return 'vue2';
  // Default to vue1 for both / and /vue1
  return 'vue1';
}

export default function AppRouter() {
  const [currentRoute, setCurrentRoute] = React.useState<RouteKey>(() => 
    matchRoute(window.location.pathname)
  );
  
  // Update document title
  React.useEffect(() => {
    const route = routes[currentRoute];
    document.title = route.title;
  }, [currentRoute]);
  
  // Handle browser navigation (back/forward)
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(matchRoute(window.location.pathname));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const route = routes[currentRoute];
  
  return (
    <>
      {route.component}
      
      {/* Development navigation helper */}
      {(import.meta as unknown as { env: { DEV: boolean } }).env.DEV && (
        <DevNavigation currentRoute={currentRoute} />
      )}
    </>
  );
}

// =========================================================================
// DEV NAVIGATION HELPER
// =========================================================================

function DevNavigation({ currentRoute }: { currentRoute: RouteKey }) {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '12px',
      borderRadius: '8px',
      zIndex: 10000,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '12px'
    }}>
      <div style={{ color: '#9ca3af', marginBottom: '8px', fontWeight: 'bold' }}>
        🧭 Dev Navigation
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {Object.entries(routes).map(([key, config]) => (
          <button
            key={key}
            onClick={() => navigate(config.path)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: currentRoute === key ? '#3b82f6' : '#374151',
              color: 'white',
              fontSize: '11px',
              fontWeight: currentRoute === key ? 'bold' : 'normal'
            }}
          >
            {config.path === '/vue1' ? 'Vue 1' : 'Vue 2'}
          </button>
        ))}
      </div>
      <div style={{ 
        color: '#6b7280', 
        marginTop: '8px', 
        fontSize: '10px' 
      }}>
        Open /vue1 and /vue2 in separate tabs to test sync
      </div>
    </div>
  );
}
