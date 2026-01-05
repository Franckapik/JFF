/**
 * Store de sélection de bot pour affichage multi-bots
 * 
 * Permet de basculer entre:
 * - 'both': Affichage simultané des deux bots (défaut)
 * - 'bot-0': Affichage bot-0 uniquement
 * - 'bot-1': Affichage bot-1 uniquement
 */
import { create } from 'zustand';

// Types
export type BotViewMode = 'bot-0' | 'bot-1' | 'both';

export interface BotSelectionState {
  selectedView: BotViewMode;
}

export interface BotSelectionActions {
  setSelectedView: (view: BotViewMode) => void;
}

export type BotSelectionStore = BotSelectionState & BotSelectionActions;

// Store
const useBotSelectionStore = create<BotSelectionStore>((set) => ({
  // État initial: afficher les deux bots
  selectedView: 'both',
  
  // Action pour changer la vue
  setSelectedView: (view: BotViewMode) => {
    set({ selectedView: view });
  },
}));

export default useBotSelectionStore;
