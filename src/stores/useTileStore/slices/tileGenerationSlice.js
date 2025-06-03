/**
 * =========================================================================
 * TILE GENERATION SLICE - Gestion de la génération et pathfinding des tuiles
 * =========================================================================
 * 
 * Ce slice gère tous les aspects liés à la génération des tuiles et au pathfinding :
 * - Génération des positions hexagonales
 * - Calculs de pathfinding (BFS)
 * - Mise à jour des véhicules
 * - Recherche de tuiles par position
 * - Calculs de distance et de chemins
 * 
 * Fonctionnalités migrées depuis utils/utils.js :
 * - generateHexPositions
 * - updateVehicle
 * - findPath, calculatePathDistance
 * - findTileAtPosition, calculatePath
 */

import { Vector3 } from "three";
import useGameStore from "../../useGameStore/";

// =========================================================================
// CONSTANTES HEXAGONALES
// =========================================================================

/**
 * Directions hexagonales pour calculer les voisins
 * Représente les 6 directions possibles dans une grille hexagonale
 */
const hexDirections = [
  { q: 1, r: 0 },   // Est
  { q: -1, r: 0 },  // Ouest
  { q: 0, r: 1 },   // Sud-Est
  { q: 0, r: -1 },  // Nord-Ouest
  { q: 1, r: -1 },  // Nord-Est
  { q: -1, r: 1 },  // Sud-Ouest
];

/**
 * Constantes de génération des tuiles
 */
const tileConstants = {
  // Taille et espacement
  hexSize: 1.7,                    // Taille de base d'une tuile hexagonale
  sqrt3: Math.sqrt(3),              // Racine de 3 pour les calculs hexagonaux
  
  // Propriétés par défaut des tuiles
  defaultY: 0,                     // Position Y par défaut (plan de jeu)
  maxNeighbors: 6,                 // Nombre maximum de voisins pour une tuile
  
  // Génération de ressources
  foodMax: 100,                    // Quantité maximale de nourriture
  debrisMax: 1000,                 // Quantité maximale de débris
  specialMax: 2,                   // Quantité maximale de ressources spéciales
  immunityChance: 0.1,             // 10% de chance d'immunité
  
  // Ressources des bases de départ
  startResources: {
    food: 100,
    debris: 100,
    special: 50
  },
  
  // Configuration des stations par rayon
  stationsConfig: {
    fuel: {
      0: 0,    // Pas de stations pour rayon 0
      1: 1,    // 1 station pour rayon 1
      default: 2  // 2 stations pour rayon >= 2
    },
    repair: {
      0: 0,    // Pas de stations pour rayon 0
      1: 1,    // 1 station pour rayon 1
      default: 2  // 2 stations pour rayon >= 2
    }
  },
  
  // Configuration des tuiles de danger
  dangerConfig: {
    0: 0,      // Pas de danger pour rayon 0
    1: 0.05,   // 5% de tuiles danger pour rayon 1
    default: 0.1  // 10% de tuiles danger pour rayon >= 2
  },
  
  // Seuils de distance et précision
  thresholds: {
    positionMatch: 0.3,    // Seuil pour considérer qu'une position correspond à une tuile
    movementReach: 0.15,   // Seuil pour considérer qu'un véhicule a atteint sa cible
    floatingPrecision: 0.1 // Précision pour les calculs de position flottante
  }
};

// =========================================================================
// UTILITAIRES HEXAGONALES
// =========================================================================

/**
 * Génère une couleur hexadécimale aléatoire
 * @returns {string} Couleur au format "#RRGGBB"
 */
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Encode les coordonnées hexagonales q,r en format lettre-nombre
 * @param {number} q - Coordonnée q
 * @param {number} r - Coordonnée r  
 * @param {number} radius - Rayon de la grille
 * @returns {string} Coordonnée encodée (ex: "A5")
 */
const encodeHexCoord = (q, r, radius) => {
  const letter = String.fromCharCode(65 + q + radius);
  return `${letter}${r + radius}`;
};

// =========================================================================
// SLICE FACTORY - TILE GENERATION UTILITIES
// =========================================================================

const createTileGenerationSlice = (set, get) => ({
  // =========================================================================
  // HEX GRID GENERATION - MÉTHODES PRINCIPALES
  // =========================================================================

  /**
   * Génère la grille hexagonale de base
   * Utilise les constantes définies et les fonctions du coordinateSlice
   */
  generateBaseHexGrid: (radius, spacing) => {
    const hexPositions = [];

    // Génération de la grille hexagonale
    for (let q = -radius; q <= radius; q++) {
      for (let r = -radius; r <= radius; r++) {
        const s = -q - r;
        if (Math.abs(s) <= radius) {
          // Calcul des positions en utilisant les constantes
          const x = (q + r / 2) * (tileConstants.hexSize + spacing);
          const z = r * (tileConstants.sqrt3 / 2) * (tileConstants.hexSize + spacing);

          // Calcul des voisins en utilisant les directions constantes
          const neighbors = hexDirections
            .map((dir) => ({ q: q + dir.q, r: r + dir.r }))
            .filter((neighbor) =>
              Math.abs(neighbor.q) <= radius &&
              Math.abs(neighbor.r) <= radius &&
              Math.abs(-neighbor.q - neighbor.r) <= radius
            )
            .map((neighbor) => encodeHexCoord(neighbor.q, neighbor.r, radius));

          // Création de la tuile avec les constantes et utilitaires
          hexPositions.push({
            coord: encodeHexCoord(q, r, radius),
            position: { x, y: tileConstants.defaultY, z },
            walkable: true,
            explored: false,
            collected: false,
            partiallyCollected: false,
            type: "resource",
            neighbors,
            color: generateRandomColor(),
            outer: neighbors.length < tileConstants.maxNeighbors,
            resources: {
              food: Math.floor(Math.random() * (tileConstants.foodMax + 1)),
              debris: Math.floor(Math.random() * (tileConstants.debrisMax + 1)),
              special: Math.floor(Math.random() * (tileConstants.specialMax + 1)),
            },
            immunity: Math.random() < tileConstants.immunityChance,
          });
        }
      }
    }
    
    return hexPositions;
  },

  /**
   * Version simplifiée de generateHexPositions - génération minimale
   * Version "bot only" - pas de position de départ initiale
   */
  initializeGameGrid: (radius, spacing, initialBotCount = 0) => {
    const { isValidWorldPosition } = get(); // Utilisation du coordinateSlice
    
    // 1. Générer la grille de base
    const hexPositions = get().generateBaseHexGrid(radius, spacing);
    
    // 2. Placer les stations
    get().placeGameStations(hexPositions, radius);
    
    // 3. Placer les tuiles de danger
    get().placeDangerTiles(hexPositions, radius);
    
    // Note: Les tuiles de départ sont maintenant gérées exclusivement 
    // par syncStartingTilesWithFSMBots() pour éviter la redondance
    
    return hexPositions;
  },


  // =========================================================================
  // PATHFINDING FUNCTIONS
  // =========================================================================

  /**
   * Find a path between two hex coordinates using breadth-first search
   * Utilise les fonctions du coordinateSlice pour la validation des coordonnées
   * @param {string} startCoord - Starting coordinate (e.g., "A1")
   * @param {string} targetCoord - Target coordinate (e.g., "B2")
   * @param {Object} tiles - Map of all tiles
   * @returns {Array} Array of coordinates representing the path
   */
  findPath: (startCoord, targetCoord, tiles) => {
    const { isValidGridCoord, normalizeCoordinate } = get(); // Utilisation du coordinateSlice
    
    // Validation et normalisation des coordonnées d'entrée
    const normalizedStart = normalizeCoordinate(startCoord);
    const normalizedTarget = normalizeCoordinate(targetCoord);
    
    if (!normalizedStart || !normalizedTarget) {
      console.warn('Invalid coordinates provided to findPath:', { startCoord, targetCoord });
      return [];
    }
    
    const queue = [[normalizedStart]];
    const visited = new Set();

    while (queue.length > 0) {
      const path = queue.shift();
      const currentCoord = path[path.length - 1];

      if (currentCoord === normalizedTarget) {
        return path;
      }

      if (!visited.has(currentCoord)) {
        visited.add(currentCoord);
        const neighbors = tiles[currentCoord]?.neighbors || [];
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor) && 
              tiles[neighbor]?.walkable !== false &&
              isValidGridCoord(neighbor)) { // Validation avec coordinateSlice
            queue.push([...path, neighbor]);
          }
        });
      }
    }

    return [];
  },

  /**
   * Calculate the total distance of a path
   * Utilise les fonctions du coordinateSlice pour les calculs de distance
   * @param {Array} path - Array of coordinates representing the path
   * @param {Object} tiles - Map of all tiles
   * @returns {number} Total distance of the path
   */
  calculatePathDistance: (path, tiles) => {
    if (!path || path.length < 2) return 0;
    
    const { calculateDistance, toVector3 } = get(); // Utilisation du coordinateSlice
    
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const tileA = tiles[path[i]];
      const tileB = tiles[path[i + 1]];
      if (tileA && tileB) {
        // Utilisation de calculateDistance du coordinateSlice
        totalDistance += calculateDistance(tileA.position, tileB.position);
      }
    }
    
    return totalDistance;
  },

  /**
   * Find the current tile based on a 3D position
   * Utilise les fonctions du coordinateSlice pour la validation et les constantes pour les seuils
   * @param {Object} position - Position {x, y, z} to check
   * @param {Object} tiles - Map of all tiles
   * @returns {Object|null} The tile at this position or null if not found
   */
  findTileAtPosition: (position, tiles) => {
    const { isValidWorldPosition, calculateDistance } = get(); // Utilisation du coordinateSlice
    
    if (!isValidWorldPosition(position)) {
      return null;
    }
    
    // Utilisation de calculateDistance pour une recherche plus précise avec constante
    return Object.values(tiles).find(tile => {
      if (!tile || !isValidWorldPosition(tile.position)) return false;
      return calculateDistance(position, tile.position) < tileConstants.thresholds.positionMatch;
    });
  },

  /**
   * Calculate path from current position to target
   * @param {Object} currentPosition - Current position {x, y, z}
   * @param {string} targetCoord - Target coordinate
   * @param {Object} tiles - Map of all tiles
   * @param {string} fallbackCoord - Fallback coordinate if current position doesn't match a tile
   * @returns {Object} Path data {path, totalDistance}
   */
  calculatePath: (currentPosition, targetCoord, tiles, fallbackCoord) => {
    const { findTileAtPosition, findPath, calculatePathDistance } = get();
    
    // Find the tile at current position
    const currentTile = findTileAtPosition(currentPosition, tiles);
    
    let path = [];
    if (currentTile) {
      path = findPath(currentTile.coord, targetCoord, tiles);
    } else if (fallbackCoord) {
      // Use fallback coordinate if we can't find a tile at current position
      path = findPath(fallbackCoord, targetCoord, tiles);
    }
    
    if (!path || path.length === 0) {
      return { path: [], totalDistance: 0 };
    }
    
    const totalDistance = calculatePathDistance(path, tiles);
    
    return { path, totalDistance };
  },

  /**
   * FONCTION CENTRALE : Synchronise les tuiles de départ avec les bots FSM actifs
   * 
   * Cette fonction est la SEULE responsable de la gestion des tuiles de départ.
   * Elle remplace et consolide toute la logique précédemment dispersée dans :
   * - addPlayerStartingPosition (supprimée - redondante)
   * - ensureStartingTilesForActiveBots (supprimée - redondante)
   * 
   * Responsabilités unifiées :
   * 1. Création de nouvelles tuiles de départ (conversion resource → depart)
   * 2. Suppression d'excès de tuiles de départ (conversion depart → resource)
   * 3. Assignation stable des bots aux tuiles existantes
   * 4. Préservation des assignements existants lors d'ajouts de nouveaux bots
   * 
   * Avantages de cette approche unifiée :
   * - Source unique de vérité pour les tuiles de départ
   * - Pas de duplication de logique
   * - Gestion stable des assignements (évite la réassignation systématique)
   * - Cohérence garantie entre bots actifs et tuiles disponibles
   * 
   * @param {Array} activeBotIds - Liste des IDs des bots actifs (ex: ['bot-0', 'bot-1'])
   */
  syncStartingTilesWithFSMBots: (activeBotIds = []) => {
    const state = get();
    
    // Éviter les boucles infinies en vérifiant s'il y a du travail à faire
    if (!activeBotIds || activeBotIds.length === 0) {
      console.log('[TileStore] No active bots to sync, skipping synchronization');
      return;
    }
    
    const currentDepartTiles = Object.values(state.tiles).filter(tile => tile.type === "depart");
    const totalBotsNeeded = activeBotIds.length;
    
    // Vérification rapide si synchronisation est nécessaire
    const currentlyAssignedBots = currentDepartTiles
      .map(tile => tile.playerId)
      .filter(id => activeBotIds.includes(id));
    
    if (currentlyAssignedBots.length === totalBotsNeeded && currentDepartTiles.length === totalBotsNeeded) {
      // Déjà synchronisé, pas besoin de changements
      return;
    }
    
    const newTiles = { ...state.tiles };

    // Si nous avons trop de tuiles de départ, convertir les excès en tuiles resource
    if (currentDepartTiles.length > totalBotsNeeded) {
      const tilesToRevert = currentDepartTiles.slice(totalBotsNeeded);
      tilesToRevert.forEach(tile => {
        newTiles[tile.coord] = {
          ...tile,
          type: "resource",
          playerId: undefined,
          isPlayerBase: false,
          playerIndex: undefined,
          color: generateRandomColor(),
          resources: {
            food: Math.floor(Math.random() * (tileConstants.foodMax + 1)),
            debris: Math.floor(Math.random() * (tileConstants.debrisMax + 1)),
            special: Math.floor(Math.random() * (tileConstants.specialMax + 1)),
          }
        };
      });
    }
    
    // Si nous avons besoin de plus de tuiles de départ
    if (currentDepartTiles.length < totalBotsNeeded) {
      const availableResourceTiles = Object.values(newTiles).filter(
        tile => tile.type === "resource" && tile.walkable && !tile.outer
      );
      
      const tilesToCreate = totalBotsNeeded - currentDepartTiles.length;
      
      // Identifier quels bots n'ont pas encore de tuile assignée
      const existingBotIds = currentDepartTiles
        .map(tile => tile.playerId)
        .filter(Boolean);
      
      const unassignedBotIds = activeBotIds.filter(botId => !existingBotIds.includes(botId));
      
      // Convertir des tuiles resource en tuiles depart pour les nouveaux bots
      for (let i = 0; i < tilesToCreate && availableResourceTiles.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableResourceTiles.length);
        const selectedTile = availableResourceTiles[randomIndex];
        const playerIndex = currentDepartTiles.length + i;
        
        // Assigner le bot correspondant de la liste des non-assignés
        const botId = unassignedBotIds[i] || `bot-${Date.now()}-${i}`;
        
        newTiles[selectedTile.coord] = {
          ...selectedTile,
          type: "depart",
          playerId: botId,
          isPlayerBase: false,
          playerIndex,
          color: "#2196F3", // Bleu pour tous les bots
          resources: { ...tileConstants.startResources },
          owner: botId
        };
        
        // Retirer la tuile de la liste des disponibles
        availableResourceTiles.splice(randomIndex, 1);
      }
    }
    
    // Approche stable : préserver les assignements existants pour les bots actifs
    const allDepartTiles = Object.values(newTiles).filter(tile => tile.type === "depart");
    
    // Créer un mapping stable : botId -> tuile assignée
    const existingAssignments = new Map();
    allDepartTiles.forEach(tile => {
      if (tile.playerId && activeBotIds.includes(tile.playerId)) {
        existingAssignments.set(tile.playerId, tile);
      }
    });
    
    // Identifier les tuiles libres (bots inactifs ou non assignées)
    const freeTiles = allDepartTiles.filter(tile => 
      !tile.playerId || !activeBotIds.includes(tile.playerId)
    );
    
    // Identifier les bots qui ont besoin d'une tuile
    const unassignedBots = activeBotIds.filter(botId => !existingAssignments.has(botId));
    
    // Assigner les bots non-assignés aux tuiles libres
    unassignedBots.forEach((botId, index) => {
      if (index < freeTiles.length) {
        const freeTile = freeTiles[index];
        newTiles[freeTile.coord] = {
          ...freeTile,
          playerId: botId,
          playerIndex: index,
          isPlayerBase: false,
          owner: botId,
          color: "#2196F3"
        };
      }
    });
    
    // Réindexer toutes les tuiles assignées pour maintenir la cohérence
    const finalDepartTiles = Object.values(newTiles).filter(tile => 
      tile.type === "depart" && activeBotIds.includes(tile.playerId)
    );
    
    finalDepartTiles.forEach((tile, index) => {
      newTiles[tile.coord] = {
        ...tile,
        playerIndex: index
      };
    });

    // Mettre à jour l'état avec les nouvelles tuiles
    set({ tiles: newTiles });
    
    // Log uniquement si des changements ont été effectués
    console.log(`[TileStore] Synchronized starting tiles with FSM bots:`, {
      totalBots: totalBotsNeeded,
      activeBots: activeBotIds.length,
      departTiles: Object.keys(newTiles).filter(coord => newTiles[coord].type === "depart").length
    });
  },

  /**
   * Place les stations (fuel/repair) sur la grille
   * Utilise les constantes de configuration pour déterminer le nombre de stations
   */
  placeGameStations: (hexPositions, radius) => {
    const stationCandidates = hexPositions.filter(
      tile => tile.walkable && tile.type === "resource"
    );
    
    // Utilisation des constantes pour déterminer le nombre de stations
    const numFuelStations = tileConstants.stationsConfig.fuel[radius] ?? 
                           tileConstants.stationsConfig.fuel.default;
    const numRepairStations = tileConstants.stationsConfig.repair[radius] ?? 
                             tileConstants.stationsConfig.repair.default;
    
    // Place fuel stations
    for (let i = 0; i < numFuelStations && stationCandidates.length > 0; i++) {
      const index = Math.floor(Math.random() * stationCandidates.length);
      stationCandidates[index].type = "fuel";
      stationCandidates.splice(index, 1);
    }
    
    // Place repair stations
    for (let i = 0; i < numRepairStations && stationCandidates.length > 0; i++) {
      const index = Math.floor(Math.random() * stationCandidates.length);
      stationCandidates[index].type = "repair";
      stationCandidates.splice(index, 1);
    }
  },

  /**
   * Place les tuiles de danger sur la grille
   * Utilise les constantes de configuration pour déterminer le pourcentage de danger
   */
  placeDangerTiles: (hexPositions, radius) => {
    const dangerTiles = hexPositions.filter(
      tile => tile.walkable && tile.type === "resource"
    );
    
    // Utilisation des constantes pour déterminer le pourcentage de danger
    const dangerPercentage = tileConstants.dangerConfig[radius] ?? 
                            tileConstants.dangerConfig.default;
    const numDangerTiles = Math.floor(dangerTiles.length * dangerPercentage);
    
    if (dangerTiles.length > numDangerTiles + 1) {
      dangerTiles.slice(0, numDangerTiles).forEach(tile => {
        tile.type = "danger";
        tile.resources = null;
      });
    }
  },


  // =========================================================================
  // PATHFINDING FUNCTIONS
  // =========================================================================
});

export default createTileGenerationSlice;
