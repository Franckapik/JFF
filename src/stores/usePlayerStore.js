import { create } from 'zustand';

const useUserPlayerStore = create((set, get) => ({
  // Initialize your state properties here
  players: {
    player1: {
      id: 'player1',
      vehicles: {
        ship: { fuel: 100, damage: 0, position: null, coord: null, isMoving: false, progress: 0, ressources: { food: 0, debris: 0, special: 0 }, startCoord: null },
        drones : [],
        selectedVehicle: null,
      },
      score : {
        ressources : { food: 0, debris: 0, special: 0 },
      },
      memory: {
        knownResources: [],
        knownDangers: [],
      },
      messages : [],
    }
  },
}));

export default useUserPlayerStore;
