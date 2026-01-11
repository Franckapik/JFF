/**
 * ==========================================================================
 * APP ROUTER - Routing pour les vues SharedWorker
 * ==========================================================================
 * 
 * ✅ Phase 5 Migration: Worker 100% autonome + Initialisation déléguée
 * 
 * Ce module gère le routing simple pour les différentes vues.
 * L'initialisation du SharedWorker est déléguée au composant GameInitializer.
 * 
 * Routes:
 * - /vue1 : Vue R3F connectée au SharedWorker (scene 3D simple)
 * - /vue2 : Vue complète avec visualisation FSM détaillée
 * 
 * Architecture:
 * - Worker autonome: FSM pure sans dépendances React
 * - GameInitializer: Gère connexion + initialisation (composant dédié)
 * - AppRouter: Routing et navigation uniquement
 * - Vue1/Vue2: Consommateurs purs via useSharedWorkerStore
 * - Synchronisation: Multi-onglets via BroadcastChannel
 * 
 * Avantages de la séparation:
 * - Responsabilités claires (SRP)
 * - GameInitializer réutilisable
 * - AppRouter focalisé sur le routing
 * - Plus facile à tester et maintenir
 * 
 * Test de synchronisation:
 * 1. Ouvrir /vue1 OU /vue2 en premier (les deux fonctionnent)
 * 2. Ouvrir l'autre vue dans un autre onglet
 * 3. Observer: même instanceId, updateCounter, états FSM
 * 
 * Pas de dépendance à react-router pour rester léger.
 * Utilise un simple switch basé sur window.location.pathname.
 * 
 * @see docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md
 * @see components/GameInitializer.tsx
 */

import React from 'react';

import GameInitializer from './components/GameInitializer';
import SharedFSMVisualization from './components/SharedFSMVisualization';
import SharedHeader from './components/SharedHeader';
import Vue1R3F from './components/Vue1R3F';

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
    component: <Vue1R3F />,
    title: 'FSM Game - Vue 1 R3F (SharedWorker)'
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
      {/* Centralized game initialization - handles worker connection and tile generation */}
      <GameInitializer />
      
      {/* Shared header displayed on all views */}
      <SharedHeader />
      
      {/* Current route view */}
      {route.component}
    </>
  );
}
