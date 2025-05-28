// src/stores/useBotStore/index.js
// Machine à états finis simplifiée avec file d'actions bloquantes
import { create } from 'zustand';
import { createBotManagementSlice } from './slices/botManagementSlice';
import { createExecutionSlice } from './slices/executionSlice';
import { createQueueSlice } from './slices/queueSlice';
import { createStateTransitionSlice } from './slices/stateTransitionSlice';
import { BOT_STATES, PRIORITY } from '../../ai/constants/botConstants';

// Store bot avec file d'actions bloquantes
const useBotStore = create((set, get) => ({
  ...createBotManagementSlice(set, get),
  ...createExecutionSlice(set, get),
  ...createQueueSlice(set, get),
  ...createStateTransitionSlice(set, get),
  
  // Expose les constantes et statuts pour usage externe
  BOT_STATES,
  PRIORITY,
}));

export default useBotStore;
