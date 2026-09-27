/** Les deux routes lisent la meme session detenue par le SharedWorker. */

import React from 'react';

import GameInitializer from './components/GameInitializer';
import SessionToolbar from './components/session/SessionToolbar';
import { profilingEnabled, recordRender } from './components/session/renderMetrics';

const GameView = React.lazy(() => import('./components/session/GameView'));
const Diagnostics = React.lazy(() => import('./components/session/Diagnostics'));

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
    component: <GameView />,
    title: 'JFF - Terrain'
  },
  vue2: {
    path: '/vue2',
    component: <Diagnostics />,
    title: 'JFF - Diagnostic'
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
      <GameInitializer />
      <SessionToolbar route={currentRoute} />
      <React.Suspense fallback={<main className="empty-state" role="status">Chargement de la vue...</main>}>
        {profilingEnabled ? <React.Profiler id="session-view" onRender={recordRender}>{route.component}</React.Profiler> : route.component}
      </React.Suspense>
    </>
  );
}
