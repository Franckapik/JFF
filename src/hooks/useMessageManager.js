import { useTileStore } from "../store/useTileStore";

const useMessageManager = () => {
  const addPlayerMessage = useTileStore((state) => state.addPlayerMessage); // Add a message to the store

  const sendVehicleMessage = (vehicleId, type, data = {}) => {
    let title = "";
    let body = "";

    switch (type) {
      case "depart":
        title = "Retour à la tuile de départ";
        body = `Le véhicule ${vehicleId} est revenu à sa position de départ.`;
        break;

      case "fuel":
        title = "Carburant rempli";
        body = `Le véhicule ${vehicleId} a atteint une station de carburant et a rempli son réservoir à 100 %.`;
        break;

      case "repair":
        title = "Réparation effectuée";
        body = `Le véhicule ${vehicleId} a atteint une station de réparation et a réparé tous ses dégâts.`;
        break;

      case "danger":
        title = "Zone dangereuse traversée";
        body = `Le véhicule ${vehicleId} a subi des dégâts en traversant une zone dangereuse.`;
        break;

      case "resource":
        title = "Ressources collectées";
        body = `Le véhicule ${vehicleId} a collecté des ressources :\n- Nourriture : ${data.food || 0}\n- Débris : ${data.debris || 0}\n- Spécial : ${data.special || 0}`;
        break;

      default:
        console.warn(`Type de message inconnu : ${type}`);
        return;
    }

    addPlayerMessage({
      vehiculeId: vehicleId,
      title,
      body,
      timestamp: Date.now(),
    });
  };

  return {
    sendVehicleMessage,
  };
};

export default useMessageManager;
