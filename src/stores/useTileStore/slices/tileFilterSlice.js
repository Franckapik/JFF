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
import { DRONE_EXPLORATION_CONFIG } from '../../../ai/fsm/machineX/config/constants.js';

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
     * ⭐ FONCTION CRITIQUE POUR L'EXPLORATION DES DRONES ⭐
     * 
     * Cette fonction polyvalente est utilisée principalement par la logique d'exploration
     * automatique des drones. Elle filtre les tuiles accessibles dans un rayon strict
     * et applique des critères avancés pour la sélection de cibles.
     * 
     * 🔧 FONCTIONNEMENT DÉTAILLÉ :
     * 1. Conversion flexible de la source (coordonnée string ou objet avec .coord)
     * 2. Récupération de toutes les tuiles walkable via getWalkableTiles()
     * 3. Calcul de distance euclidienne via calculateDistance() pour chaque tuile
     * 4. Filtrage par rayon d'exploration (défaut: 3, drone max: 2)
     * 5. Application des filtres optionnels (exploration, danger)
     * 6. Tri par proximité croissante (tuiles les plus proches en premier)
     * 
     * 🎯 UTILISATIONS PRINCIPALES :
     * - Exploration automatique des drones (rayon strictement limité à 2)
     * - Recherche de cibles pour les actions de bots
     * - Calculs de territoire accessible autour d'une position
     * - Planification de mouvement avec contraintes
     * 
     * 📊 LOGS DÉTAILLÉS POUR DEBUG :
     * - Source de coordonnées détectée et convertie
     * - Nombre total de tuiles walkable disponibles
     * - Processus de filtrage étape par étape
     * - Distances calculées et critères appliqués
     * - Résultats finaux avec métadonnées complètes
     * 
     * ⚠️ CONSTANTE DE CONFIGURATION :
     * - DRONE_EXPLORATION_CONFIG.MAX_EXPLORATION_RADIUS = 2 (tuiles max pour drones)
     * - Ce rayon strict évite l'exploration excessive et maintient la performance
     * 
     * @param {string|Object} source - Coordonnée (format "x,y") ou objet avec propriété coord
     * @param {number} exploringRadius - Rayon de recherche autour de la position (défaut: 3, drone max: 2)
     * @param {boolean} onlyUnexplored - Si true, retourne uniquement les tuiles non explorées
     * @param {boolean} excludeDanger - Si true, exclut les tuiles de type 'danger'
     * @returns {Array} - Liste des tuiles walkable trouvées avec métadonnées, triées par distance
     */
    getWalkableTilesInRadius: (source, exploringRadius = 3, onlyUnexplored = false, excludeDanger = true) => {
      // 🎯 ÉTAPE 1: Conversion et validation de la source
      // Détection automatique du type de source (coordonnée directe ou objet)
      fsmLogger.info('🎯 [getWalkableTilesInRadius] Source directe détectée:', source);
      
      let coord;
      if (typeof source === 'string') {
        coord = source;
        fsmLogger.info('🔍 [getWalkableTilesInRadius] Début de recherche:', {
          centerCoord: coord,
          exploringRadius,
          onlyUnexplored,
          excludeDanger
        });
      } else if (source && source.coord) {
        coord = source.coord;
        fsmLogger.info('🔍 [getWalkableTilesInRadius] Début de recherche depuis objet:', {
          centerCoord: coord,
          sourceType: 'object',
          exploringRadius,
          onlyUnexplored,
          excludeDanger
        });
      } else {
        fsmLogger.warning('⚠️ [getWalkableTilesInRadius] Source invalide:', source);
        return [];
      }
      
      if (!coord) {
        fsmLogger.warning('⚠️ [getWalkableTilesInRadius] Coordonnée manquante');
        return [];
      }
      
      // 📋 ÉTAPE 2: Récupération de la base de données des tuiles walkable
      // Utilisation du filtre optimisé getWalkableTiles() comme source
      const walkableTiles = get().getWalkableTiles();
      fsmLogger.info('📋 [getWalkableTilesInRadius] Tuiles walkables totales:', walkableTiles.length);
      
      // 🧪 ÉTAPE 3: Test de cohérence des distances (debug pour les 3 premières tuiles)
      fsmLogger.info('🧪 [getWalkableTilesInRadius] Test de cohérence des distances:');
      walkableTiles.slice(0, 3).forEach((tile, index) => {
        const euclideanDistance = get().calculateDistance(coord, tile.coord, false, false);
        const pathfindingDistance = get().calculateDistance(coord, tile.coord, true, false);
        fsmLogger.info(`   Tuile ${index + 1}: ${coord} → ${tile.coord}`, {
          euclidean: euclideanDistance.toFixed(3),
          pathfinding: pathfindingDistance,
          difference: Math.abs(euclideanDistance - pathfindingDistance).toFixed(3),
          tileType: tile.type
        });
      });
      
      // 🔄 ÉTAPE 4: Traitement principal - Filtrage avec calcul de distance
      const tilesInRadius = [];
      let tilesProcessed = 0;
      let tilesInRadiusCount = 0;
      let tilesFilteredByDanger = 0;
      let tilesFilteredByExploration = 0;

      walkableTiles.forEach(tile => {
        tilesProcessed++;
        
        // 🧮 Calcul de distance euclidienne (plus précis pour les rayons stricts)
        // Utilisation directe de calculateDistance du pathSlice avec coordonnées de grille
        const distance = get().calculateDistance(coord, tile.coord, false, false);
        
        // Exemple de log détaillé pour une tuile spécifique (debug)
        if (tilesProcessed === 1) {
          fsmLogger.info('🧮 [getWalkableTilesInRadius] Distance calculée:', {
            from: coord,
            to: tile.coord,
            centerGridCoord: coord,
            tileGridCoord: tile.coord,
            calculatedDistance: distance.toFixed(3),
            exploringRadius,
            withinRadius: distance <= exploringRadius
          });
        }
        
        // ✅ Vérification du rayon d'exploration spécifié
        if (distance <= exploringRadius) {
          tilesInRadiusCount++;
          
          // 🚫 Application des filtres configurables
          let includeInResult = true;
          
          // Filtre danger
          if (excludeDanger && tile.type === 'danger') {
            includeInResult = false;
            tilesFilteredByDanger++;
          }
          
          // Filtre exploration
          if (onlyUnexplored && tile.explored) {
            includeInResult = false;
            tilesFilteredByExploration++;
          }
          
          // ➕ Ajout à la liste des résultats si tous les filtres passent
          if (includeInResult) {
            tilesInRadius.push({
              coord: tile.coord,
              position: tile.position,
              tile: tile,
              distance: distance
            });
          }
        }
      });
      
      // 📈 ÉTAPE 5: Bilan et statistiques de filtrage
      fsmLogger.info('📈 [getWalkableTilesInRadius] Bilan de filtrage:', {
        tilesProcessed,
        tilesInRadiusCount,
        tilesFilteredByDanger,
        tilesFilteredByExploration,
        finalValidTiles: tilesInRadius.length,
        searchRadius: exploringRadius,
        centerCoord: coord
      });
      
      // ⚠️ Vérification spéciale pour rayon drone (constante)
      if (exploringRadius <= DRONE_EXPLORATION_CONFIG.MAX_EXPLORATION_RADIUS) {
        if (tilesInRadius.length === 0) {
          fsmLogger.info(`🚫 [getWalkableTilesInRadius] Aucune tuile valide trouvée dans le rayon ${exploringRadius}`);
        } else {
          fsmLogger.info(`✅ [getWalkableTilesInRadius] ${tilesInRadius.length} tuiles trouvées dans le rayon drone ${exploringRadius}`);
        }
      }
      
      // 🔄 ÉTAPE 6: Tri par proximité croissante et retour
      // Les tuiles les plus proches sont prioritaires pour l'exploration
      const sortedResults = tilesInRadius.sort((a, b) => a.distance - b.distance);
      
      // 📊 Log final des premiers résultats pour debug
      if (sortedResults.length > 0) {
        fsmLogger.info('📊 [getWalkableTilesInRadius] Premiers résultats triés:', 
          sortedResults.slice(0, 3).map(t => ({
            coord: t.coord,
            distance: t.distance.toFixed(3),
            type: t.tile.type,
            explored: t.tile.explored
          }))
        );
      }
      
      return sortedResults;
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