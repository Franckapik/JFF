import { create } from "zustand";

const useGameStore = create((set) => ({
  isClockRunning: false, // State to track if the clock is running
  setClockRunning: (isRunning) => set({ isClockRunning: isRunning }), // Action to update the clock state
  
  // Configuration du nombre de joueurs
  playerCount: 2, // Par défaut, 2 joueurs
  setPlayerCount: (count) => set({ playerCount: count }),
}));

export default useGameStore;
