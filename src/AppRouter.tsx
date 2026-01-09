/**
 * ==========================================================================
 * APP ROUTER - Routing pour les vues SharedWorker
 * ==========================================================================
 * 
 * Ce module gère le routing simple pour les différentes vues:
 * - / : Vue legacy (app originale avec instances FSM locales)
 * - /vue1 : Vue 1 connectée au SharedWorker
 * - /vue2 : Vue 2 connectée au SharedWorker (future: canvas R3F)
 * 
 * Pas de dépendance à react-router pour rester léger.
 * Utilise un simple switch basé sur window.location.pathname.
 */

import React from 'react';

import App from './App';
import SharedView from './components/SharedView';
import SharedFSMVisualization from './components/SharedFSMVisualization';

// =========================================================================
// TYPES
// =========================================================================

type RouteKey = 'legacy' | 'vue1' | 'vue2';

interface RouteConfig {
  path: string;
  component: React.ReactNode;
  title: string;
}

// =========================================================================
// ROUTE CONFIGURATION
// =========================================================================

const routes: Record<RouteKey, RouteConfig> = {
  legacy: {
    path: '/',
    component: <App />,
    title: 'FSM Game - Legacy Mode'
  },
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
  
  if (normalizedPath === '/vue1') return 'vue1';
  if (normalizedPath === '/vue2') return 'vue2';
  return 'legacy';
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
            {config.path === '/' ? 'Legacy' : config.path.slice(1).toUpperCase()}
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
