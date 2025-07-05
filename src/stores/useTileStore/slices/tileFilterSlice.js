/**
 * =========================================================================
 * TILE FILTER SLICE
 * =========================================================================
 * 
 * Ce slice gère la logique de filtrage, recherche et sélection des tuiles :
 * - Filtrage par type de tuile (walkable, danger, stations, etc.)
 * - Attribution automatique des bases aux joueurs
 * - Recherche de tuiles dans un rayon donné avec critères avancés
 * - Sélection aléatoire de tuiles pour la logique des bots
 * - Sélecteurs optimisés pour le rendu et les calculs
 * 
 * Types de filtres supportés :
 * - Tuiles walkable : tuiles praticables pour le mouvement
 * - Tuiles de départ : bases de joueurs avec attribution automatique
 * - Stations de service : carburant et réparation
 * - Filtres par exploration et danger
 * 
 * Dépendances :
 * - playerConstants : pour l'attribution des bases aux joueurs
 * - calculateDistance : pour les calculs de proximité (via get())
 * - useXFSMStore : pour synchroniser avec les bots actifs
 */

import fsmLogger from '../../../logger/fsmLogger.js';
import  useXFSMStore  from '../../useXFSMStore/index.js';

// =========================================================================
// IMPORTS
// =========================================================================

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileFilterSlice = (set, get) => {
  return {
    
    // =====================================================================
    // ACTIONS PUBLIQUES - RECHERCHE ET SÉLECTION AVANCÉE
    // =====================================================================
  
    /**
     * Récupère les tuiles 'walkable' dans un rayon donné autour d'une position
     * 
     * Cette fonction polyvalente :
     * 1. Accepte soit des coordonnées soit un objet véhicule avec propriété coord
     * 2. Utilise l'algorithme de pathfinding pour calculer les distances réelles
     * 3. Applique des filtres configurables (exploration, danger)
     * 4. Retourne les résultats triés par proximité
     * 
     * Utilisée principalement par :
     * - Logique d'exploration automatique des bots
     * - Système de recherche de cibles
     * - Calculs de territoire accessible
     * 
     * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param {number} exploringRadius - Rayon de recherche autour de la position (défaut: 3)
     * @param {boolean} onlyUnexplored - Si true, retourne uniquement les tuiles non explorées
     * @param {boolean} excludeDanger - Si true, exclut les tuiles de type 'danger'
     * @returns {Array} - Liste des tuiles walkable trouvées avec métadonnées, triées par distance
     */
    getWalkableTilesInRadius: (source, exploringRadius = 3, onlyUnexplored = false, excludeDanger = true) => {
      // Conversion flexible de la source en coordonnées (accepte véhicules et coordonnées)
      let coord;
      if (typeof source === 'string') {
        coord = source;
      } else if (source && source.coord) {
        coord = source.coord;
      } else {
        return [];
      }
      
      if (!coord) return [];
      
      // Utiliser getWalkableTiles comme base de filtrage
      const walkableTiles = get().getWalkableTiles();
      const tilesInRadius = [];

      
      // Appliquer les filtres supplémentaires sur les tuiles walkables
      walkableTiles.forEach(tile => {
        // Calculer la distance réelle en nombre de tuiles via pathfinding
        // Utiliser directement la fonction du pathSlice qui gère les coordonnées de grille
        const distance = get().calculateDistance(coord, tile.coord, false, false);
        
        // Vérifier si la tuile est dans le rayon d'exploration spécifié
        if (distance <= exploringRadius) {
          // Application des filtres configurables
          if ((!excludeDanger || tile.type !== 'danger') &&
              (!onlyUnexplored || !tile.explored)) {
            
            tilesInRadius.push({
              coord: tile.coord,
              position: tile.position,
              tile: tile,
              distance: distance
            });
          }
        }
      });
      
      // Retourne les tuiles walkable triées par proximité croissante
      return tilesInRadius.sort((a, b) => a.distance - b.distance);
    },

    /**
     * Sélectionne une tuile walkable au hasard parmi toutes les tuiles disponibles
     * 
     * Cette fonction :
     * 1. Filtre toutes les tuiles pour ne garder que les walkables
     * 2. Exclut automatiquement les tuiles de type 'danger'
     * 3. Effectue une sélection aléatoire uniforme
     * 4. Retourne null si aucune tuile n'est disponible
     * 
     * Utilisée principalement par :
     * - Actions automatisées des bots
     * - Système de mouvement erratique
     * - Logique de dispersion des unités
     * 
     * @returns {Object|null} - La tuile walkable sélectionnée avec toutes ses propriétés ou null
     */
    selectRandomWalkableTile: () => {
      const tiles = get().tiles;
      
      // Filtrage efficace pour obtenir uniquement les tuiles walkables et sûres
      const walkableTiles = Object.values(tiles).filter(tile => 
        tile && tile.walkable !== false && tile.type !== 'danger'
      );
      
      if (walkableTiles.length === 0) {
        return null;
      }
      
      // Sélection aléatoire uniforme dans le tableau filtré
      const randomIndex = Math.floor(Math.random() * walkableTiles.length);
      return walkableTiles[randomIndex];
    },
    
    // =====================================================================
    // ACTIONS PUBLIQUES - FILTRES SPÉCIALISÉS PAR TYPE
    // =====================================================================
  
    /**
     * Récupère toutes les tuiles walkables du jeu
     * 
     * Filtre simple pour obtenir toutes les tuiles praticables,
     * utilisé pour les calculs globaux et les analyses de terrain.
     * 
     * @returns {Array} Liste de toutes les tuiles walkables
     */
    getWalkableTiles: () => {
      const { tiles } = get();
      return Object.values(tiles).filter(tile => tile.walkable);
    },
    
    /**
     * Récupère toutes les tuiles de départ existantes (render-safe)
     * 
     * Cette fonction est entièrement render-safe et ne fait que lire l'état actuel.
     * Aucune synchronisation ou accès à d'autres stores pendant le rendu.
     * Le filtrage par bots actifs est fait au niveau du composant si nécessaire.
     * 
     * @returns {Array} Liste des tuiles de départ existantes
     */
    getDepartTiles: () => {
      const { tiles } = get();
      // Récupérer uniquement les tuiles de départ existantes (lecture seule)
      const departTiles = Object.values(tiles).filter(tile => tile.type === "depart");
      
      // Retourner toutes les tuiles de départ avec leurs assignements actuels
      return departTiles;
    },

    /**
     * Force la synchronisation des tuiles de départ avec les bots actifs
     * Cette fonction DOIT être appelée depuis un effet ou une action, pas pendant le rendu
     * 
     * @returns {void}
     */
    syncDepartTilesWithActiveBots: () => {
      const { syncStartingTilesWithFSMBots } = get();
      
      // Récupérer les bots actifs depuis le XFSMStore
      const activeBots = useXFSMStore.getState().activeBots;
      const activeBotIds = activeBots;
      
      // Synchroniser les tuiles de départ avec les bots actifs
      syncStartingTilesWithFSMBots(activeBotIds);
    },
    
    /**
     * Récupère toutes les stations de carburant
     * 
     * Filtre spécialisé pour les tuiles de type "fuel",
     * utilisé pour la logique de ravitaillement des véhicules.
     * 
     * @returns {Array} Liste de toutes les stations de carburant
     */
    getFuelStations: () => {
      const { tiles } = get();
      return Object.values(tiles).filter(tile => tile.type === "fuel");
    },
    
    /**
     * Récupère toutes les stations de réparation
     * 
     * Filtre spécialisé pour les tuiles de type "repair",
     * utilisé pour la logique de maintenance des véhicules.
     * 
     * @returns {Array} Liste de toutes les stations de réparation
     */
    getRepairStations: () => {
      const { tiles } = get();
      return Object.values(tiles).filter(tile => tile.type === "repair");
    },
  };
};

export default createTileFilterSlice;