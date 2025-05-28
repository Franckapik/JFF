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
 */

// =========================================================================
// IMPORTS
// =========================================================================
import { getHumanPlayerId, getBotId } from '../../../ai/constants/playerConstants';

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
        console.warn("Source invalide pour getWalkableTilesInRadius");
        return [];
      }
      
      if (!coord) return [];
      
      const tiles = get().tiles;
      const walkableTiles = [];
      const calculateDistanceFn = get().calculateDistance;
      
      // Parcours optimisé de toutes les tuiles pour chercher celles dans le rayon
      Object.entries(tiles).forEach(([tileCoord, tile]) => {
        // Utiliser calculateDistance pour obtenir la distance réelle en nombre de tuiles
        const distance = calculateDistanceFn(coord, tileCoord, false, true);
        
        // Vérifier si la tuile est dans le rayon d'exploration spécifié
        if (distance <= exploringRadius) {
          // Application des filtres configurables
          if (tile && 
              tile.walkable !== false && 
              (!excludeDanger || tile.type !== 'danger') &&
              (!onlyUnexplored || !tile.explored)) {
            
            walkableTiles.push({
              coord: tileCoord,
              position: tile.position,
              tile: tile,
              distance: distance
            });
          }
        }
      });
      
      // Retourne les tuiles walkable triées par proximité croissante
      return walkableTiles.sort((a, b) => a.distance - b.distance);
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
        console.warn("Aucune tuile walkable disponible pour la sélection aléatoire");
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
     * Récupère toutes les tuiles de départ avec attribution automatique aux joueurs
     * 
     * Cette fonction :
     * 1. Filtre les tuiles de type "depart"
     * 2. Attribue automatiquement les joueurs selon l'ordre :
     *    - Index 0 : joueur humain principal
     *    - Index 1+ : bots numérotés
     * 3. Ajoute des métadonnées pour l'identification des bases
     * 
     * @returns {Array} Liste des tuiles de départ avec métadonnées de joueurs
     */
    getDepartTiles: () => {
      const { tiles } = get();
      return Object.values(tiles)
        .filter(tile => tile.type === "depart")
        .map((tile, index) => ({
          ...tile,
          playerId: index === 0 ? getHumanPlayerId(1) : getBotId(index - 1),
          isPlayerBase: index === 0,
          playerIndex: index
        }));
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