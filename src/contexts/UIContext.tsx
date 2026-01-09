/**
 * ==========================================================================
 * UI CONTEXT - État UI partagé (remplace useBotSelectionStore)
 * ==========================================================================
 * 
 * Gère l'état UI global sans Zustand:
 * - Sélection de vue (bot-0, bot-1, both)
 * - État de l'horloge
 * - Synchronisation avec l'URL
 * 
 * @example
 * ```tsx
 * import { UIProvider, useUI } from './contexts/UIContext';
 * 
 * // Dans App
 * <UIProvider>
 *   <MyComponent />
 * </UIProvider>
 * 
 * // Dans un composant
 * const { selectedView, setSelectedView } = useUI();
 * ```
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// ==========================================================================
// TYPES
// ==========================================================================

export type BotViewMode = 'bot-0' | 'bot-1' | 'both';

interface UIState {
  selectedView: BotViewMode;
  isClockRunning: boolean;
}

interface UIActions {
  setSelectedView: (view: BotViewMode) => void;
  toggleClock: () => void;
  setClockRunning: (running: boolean) => void;
}

type UIContextValue = UIState & UIActions;

// ==========================================================================
// CONTEXT
// ==========================================================================

const UIContext = createContext<UIContextValue | null>(null);

// ==========================================================================
// URL SYNC UTILITIES
// ==========================================================================

function getViewModeFromUrl(): BotViewMode {
  if (typeof window === 'undefined') return 'both';
  
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  
  if (view === 'bot-0' || view === 'bot-1' || view === 'both') {
    return view;
  }
  
  return 'both';
}

function updateUrlWithView(view: BotViewMode): void {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.search);
  params.set('view', view);
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

// ==========================================================================
// PROVIDER
// ==========================================================================

interface UIProviderProps {
  children: React.ReactNode;
  defaultView?: BotViewMode;
  defaultClockRunning?: boolean;
}

export function UIProvider({ 
  children, 
  defaultView,
  defaultClockRunning = true 
}: UIProviderProps) {
  // Initialize from URL or default
  const [selectedView, setSelectedViewState] = useState<BotViewMode>(
    defaultView ?? getViewModeFromUrl()
  );
  const [isClockRunning, setClockRunning] = useState(defaultClockRunning);

  // Sync URL on view change
  const setSelectedView = useCallback((view: BotViewMode) => {
    setSelectedViewState(view);
    updateUrlWithView(view);
  }, []);

  const toggleClock = useCallback(() => {
    setClockRunning(prev => !prev);
  }, []);

  // Listen to popstate for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const viewFromUrl = getViewModeFromUrl();
      setSelectedViewState(viewFromUrl);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<UIContextValue>(() => ({
    selectedView,
    isClockRunning,
    setSelectedView,
    toggleClock,
    setClockRunning,
  }), [selectedView, isClockRunning, setSelectedView, toggleClock]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

// ==========================================================================
// HOOK
// ==========================================================================

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}

// ==========================================================================
// SELECTOR HOOKS (for performance)
// ==========================================================================

export function useSelectedView(): BotViewMode {
  return useUI().selectedView;
}

export function useIsClockRunning(): boolean {
  return useUI().isClockRunning;
}

export default UIContext;
