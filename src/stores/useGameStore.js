import { create } from "zustand";

const useGameStore = create((set) => ({
  isClockRunning: false, // State to track if the clock is running
  setClockRunning: (isRunning) => set({ isClockRunning: isRunning }), // Action to update the clock state
  
  // Configuration des joueurs
  playerCount: 3, // Nombre total de joueurs (1 humain + X bots)
  botCount: 2,    // Nombre de bots
  
  // Actions
  setPlayerCount: (count) => {
    if (count < 2) count = 2; // Minimum 2 joueurs (1 humain + 1 bot)
    if (count > 4) count = 4; // Maximum 4 joueurs pour l'instant
    set({ 
      playerCount: count,
      botCount: count - 1 // Le nombre de bots est le nombre total moins le joueur humain
    });
  },
}));

export default useGameStore;
