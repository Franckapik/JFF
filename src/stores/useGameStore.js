import { create } from "zustand";

const useGameStore = create((set) => ({
  isClockRunning: false, // State to track if the clock is running
  setClockRunning: (isRunning) => set({ isClockRunning: isRunning }), // Action to update the clock state
  
  // Configuration des joueurs
  playerCount: 1, // Nombre de joueurs humains
  botCount: 1,    // Nombre de bots
  
}));

export default useGameStore;
