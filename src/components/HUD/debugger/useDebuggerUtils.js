import { useCallback } from 'react';
import usePlayerStore from "../../../stores/usePlayerStore";

/**
 * Hook personnalisé pour les fonctions utilitaires du debugger
 */
export const useDebuggerUtils = () => {
  // Formater le nom d'un état d'action
  const formatStateName = useCallback((stateName) => {
    if (!stateName) return 'N/A';
    return stateName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }, []);

  // Obtenir la couleur pour la priorité d'une action
  const getActionPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'urgent':
        return '#f44336'; // Rouge
      case 'high':
        return '#ff9800'; // Orange
      case 'medium':
        return '#2196f3'; // Bleu
      case 'low':
        return '#4caf50'; // Vert
      default:
        return '#9e9e9e'; // Gris
    }
  }, []); 

  // Obtenir la couleur pour un statut d'action
  const getActionStatusColor = useCallback((status, ACTION_STATUS) => {
    switch(status) {
      case ACTION_STATUS.PENDING: return "#f9a825"; // Orange
      case ACTION_STATUS.IN_PROGRESS: return "#2196F3"; // Bleu
      case ACTION_STATUS.COMPLETED: return "#4CAF50"; // Vert
      case ACTION_STATUS.FAILED: return "#f44336"; // Rouge
      default: return "#aaaaaa"; // Gris
    }
  }, []);

  // Formater une valeur numérique pour l'affichage
  const formatNumber = useCallback((value, decimals = 2) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toFixed(decimals);
  }, []);

  // Formater les coordonnées pour l'affichage
  const formatPosition = useCallback((position) => {
    if (!position || typeof position.x !== 'number' || typeof position.z !== 'number') {
      return 'N/A';
    }
    return `(${position.x.toFixed(1)}, ${position.z.toFixed(1)})`;
  }, []);

  // Obtenir la couleur d'une ressource basée sur sa quantité
  const getResourceColor = useCallback((current, max) => {
    const percentage = (current / max) * 100;
    if (percentage < 20) return '#f44336'; // Rouge
    if (percentage < 50) return '#ff9800'; // Orange
    if (percentage < 80) return '#ffc107'; // Jaune
    return '#4caf50'; // Vert
  }, []);

  // Calculer le style pour une barre de ressource
  const getResourceBarStyle = useCallback((quantity) => {
    let color = "#4CAF50"; // Green by default
    
    if (quantity === 0) color = "#777777"; // Gray if empty
    else if (quantity < 3) color = "#f44336"; // Red if very low
    else if (quantity < 5) color = "#ff9800"; // Orange if somewhat low
    
    return {
      width: `${Math.min(quantity * 10, 100)}%`,
      backgroundColor: color,
    };
  }, []);

  // Fonction helper pour la barre de ressources des tuiles
  const getTileResourceBarStyle = useCallback((quantity) => {
    let color = "#4CAF50"; // Green by default
    
    if (quantity === 0) color = "#777777"; // Gray if empty
    else if (quantity < 3) color = "#f44336"; // Red if very low
    else if (quantity < 5) color = "#ff9800"; // Orange if somewhat low
    
    return {
      width: `${Math.min(quantity * 10, 100)}%`,
      backgroundColor: color,
    };
  }, []);

  // Récupérer les données d'un véhicule de bot
  const getBotVehicleData = useCallback((botId, vehicleId) => {
    return usePlayerStore.getState().players?.[botId]?.vehicles?.[vehicleId];
  }, []);

  // Vérifier si un véhicule est actif
  const isVehicleActive = useCallback((botId, vehicleId) => {
    const vehicle = getBotVehicleData(botId, vehicleId);
    return vehicle?.isActive === true;
  }, [getBotVehicleData]);

  return {
    formatStateName,
    getActionStatusColor,
    getActionPriorityColor,
    formatNumber,
    formatPosition,
    getResourceColor,
    getResourceBarStyle,
    getTileResourceBarStyle,
    getBotVehicleData,
    isVehicleActive,
  };
};

export default useDebuggerUtils;
