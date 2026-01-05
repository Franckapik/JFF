/**
 * Store de sélection de bot pour affichage multi-bots
 * 
 * Permet de basculer entre:
 * - 'both': Affichage simultané des deux bots (défaut)
 * - 'bot-0': Affichage bot-0 uniquement
 * - 'bot-1': Affichage bot-1 uniquement
 * 
 * Support du paramètre URL: ?view=bot-0 | ?view=bot-1 | ?view=both
 */
import { create } from 'zustand';

// Types
export type BotViewMode = 'bot-0' | 'bot-1' | 'both';

export interface BotSelectionState {
  selectedView: BotViewMode;
}

export interface BotSelectionActions {
  setSelectedView: (view: BotViewMode) => void;
  initializeFromUrl: () => void;
}

export type BotSelectionStore = BotSelectionState & BotSelectionActions;

// Utility function to get view mode from URL
function getViewModeFromUrl(): BotViewMode {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  
  if (view === 'bot-0' || view === 'bot-1' || view === 'both') {
    return view as BotViewMode;
  }
  
  return 'both'; // default
}

// Store
const useBotSelectionStore = create<BotSelectionStore>((set) => ({
  // État initial: afficher les deux bots
  selectedView: 'both',
  
  // Action pour changer la vue
  setSelectedView: (view: BotViewMode) => {
    set({ selectedView: view });
    // Mettre à jour l'URL sans recharger la page
    const params = new URLSearchParams(window.location.search);
    params.set('view', view);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  },

  // Initialiser la vue depuis les paramètres URL
  initializeFromUrl: () => {
    const viewMode = getViewModeFromUrl();
    set({ selectedView: viewMode });
  },
}));

export default useBotSelectionStore;
