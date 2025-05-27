/**
 * Slice pour la recherche et sélection de tuiles
 * Responsable de : recherche de tuiles walkables, sélection aléatoire, filtrage par critères
 */

const createTileSearchSlice = (set, get) => ({

  /**
   * Récupère les tuiles 'walkable' dans un rayon donné autour d'une position
   * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
   * @param {number} exploringRadius - Rayon de recherche autour de la position (défaut: 3)
   * @param {boolean} onlyUnexplored - Si true, retourne uniquement les tuiles non explorées
   * @param {boolean} excludeDanger - Si true, exclut les tuiles de type 'danger'
   * @returns {Array} - Liste des tuiles walkable trouvées, triées par distance
   */
  getWalkableTilesInRadius: (source, exploringRadius = 3, onlyUnexplored = false, excludeDanger = true) => {
    // Convertir la source en coordonnées (accepte soit des coordonnées, soit un véhicule)
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
    
    // Parcours de toutes les tuiles pour chercher celles dans le rayon
    Object.entries(tiles).forEach(([tileCoord, tile]) => {
      // Utiliser calculateDistance pour obtenir la distance en nombre de tuiles
      const distance = calculateDistanceFn(coord, tileCoord, false, true);
      
      // Vérifier si la tuile est dans le rayon d'exploration
      if (distance <= exploringRadius) {
        // Vérifier les autres conditions (walkable, non danger, non explorée)
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
    
    // Retourne les tuiles walkable triées par proximité
    return walkableTiles.sort((a, b) => a.distance - b.distance);
  },

  /**
   * Sélectionne une tuile walkable au hasard parmi toutes les tuiles
   * Utilisé principalement pour les actions automatisées des bots
   * @returns {Object|null} - La tuile walkable sélectionnée ou null si aucune tuile disponible
   */
  selectRandomWalkableTile: () => {
    const tiles = get().tiles;
    
    // Filtrer uniquement les tuiles walkable
    const walkableTiles = Object.values(tiles).filter(tile => 
      tile && tile.walkable !== false && tile.type !== 'danger'
    );
    
    if (walkableTiles.length === 0) {
      console.warn("Aucune tuile walkable disponible pour la sélection aléatoire");
      return null;
    }
    
    // Sélection d'une tuile au hasard dans le tableau
    const randomIndex = Math.floor(Math.random() * walkableTiles.length);
    return walkableTiles[randomIndex];
  },
});

export default createTileSearchSlice;
