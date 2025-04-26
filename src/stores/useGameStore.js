import { create } from "zustand";

const useGameStore = create((set) => ({
  isClockRunning: false, // State to track if the clock is running
  setClockRunning: (isRunning) => set({ isClockRunning: isRunning }), // Action to update the clock state
}));

export default useGameStore;
