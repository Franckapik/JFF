/**
 * =========================================================================
 * TILE FILTER SLICE (TypeScript)
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

import type {
  GridCoordinate,
  Tile,
  TileType,
  TileWithDistance
} from '../../../types/index.ts';
import type { TileFilterSliceActions, TileStoreType } from '../../../types/stores.d.ts';

import fsmLogger from '../../../logger/fsmLogger.ts';

// =========================================================================
// TYPES LOCAUX SIMPLIFIÉS
// =========================================================================

/** Options de filtrage pour la recherche de tuiles */
interface TileSearchOptions {
  onlyUnexplored?: boolean;
  excludeDanger?: boolean;
  maxRadius?: number;
}

/** Actions du slice de filtrage */
/** Actions du slice des filtres et recherche */

// =========================================================================
// SLICE PRINCIPAL
// =========================================================================

const createTileFilterSlice = (_set: unknown, get: () => TileStoreType): TileFilterSliceActions => {
  return {
    
    // =====================================================================
    // ACTIONS PUBLIQUES - RECHERCHE ET SÉLECTION AVANCÉE
    // =====================================================================
  
    /**
     * Récupère les tuiles walkable dans un rayon donné autour d'une position
     * 
     * ⭐ VERSION SIMPLIFIÉE ET ROBUSTE TYPESCRIPT ⭐
     * 
     * Cette fonction optimisée utilise les avantages de TypeScript pour :
     * - Signature d'API claire et non ambiguë
     * - Types stricts avec validation à la compilation
     * - Options regroupées dans un objet pour la lisibilité
     * - Gestion d'erreurs simplifiée
     * 
     * 🔧 FONCTIONNEMENT :
     * 1. Validation stricte des paramètres d'entrée
     * 2. Récupération optimisée des tuiles walkable
     * 3. Calcul de distance euclidienne performant
     * 4. Filtrage selon les options spécifiées
     * 5. Tri par proximité croissante
     * 
     * 🎯 UTILISATIONS :
     * - Exploration automatique des drones
     * - Recherche de cibles pour les bots
     * - Calculs de territoire accessible
     * 
     * @param centerCoord - Coordonnée centrale de la recherche (format "x,z")
     * @param radius - Rayon de recherche en tuiles (minimum 1, maximum contraint par config)
     * @param options - Options de filtrage (optionnel)
     * @returns Liste des tuiles trouvées avec métadonnées, triées par distance croissante
     */
    getWalkableTilesInRadius: (
      centerCoord: GridCoordinate,
      radius: number,
      options: TileSearchOptions = {}
    ): TileWithDistance[] => {
      // ===============================================================
      // VALIDATION STRICTE DES PARAMÈTRES
      // ===============================================================
      
      // Validation de la coordonnée centrale
      if (!centerCoord || typeof centerCoord !== 'string' || !centerCoord.includes(',')) {
        fsmLogger.error('[getWalkableTilesInRadius] Coordonnée centrale invalide:', centerCoord);
        return [];
      }
      
      // Validation et contrainte du rayon
      const validRadius = Math.max(1, Math.min(radius, 3));
      if (validRadius !== radius) {
        fsmLogger.info(`[getWalkableTilesInRadius] Rayon ajusté de ${radius} à ${validRadius} (contraintes: 1-${3})`);
      }
      
      // Extraction des options avec valeurs par défaut
      const {
        onlyUnexplored = false,
        excludeDanger = true,
      } = options;
      
      // ===============================================================
      // RÉCUPÉRATION ET TRAITEMENT DES TUILES
      // ===============================================================
      
      const walkableTiles = get().getWalkableTiles();
      
      if (walkableTiles.length === 0) {
        fsmLogger.error('[getWalkableTilesInRadius] Aucune tuile walkable disponible');
        return [];
      }
      
      // Parse des coordonnées centrales pour les calculs
      const [centerX, centerZ] = centerCoord.split(',').map(Number);
      
      if (isNaN(centerX) || isNaN(centerZ)) {
        fsmLogger.error('[getWalkableTilesInRadius] Coordonnées centrales non numériques:', centerCoord);
        return [];
      }
      
      // ===============================================================
      // FILTRAGE ET CALCUL DES DISTANCES
      // ===============================================================
      
      const results: TileWithDistance[] = [];
      let processedCount = 0;
      let filteredByRadius = 0;
      let filteredByDanger = 0;
      let filteredByExploration = 0;
      
      for (const tile of walkableTiles) {
        processedCount++;
        
        // Calcul de distance euclidienne optimisé
        const [tileX, tileZ] = tile.position.coord.split(',').map(Number);
        const distance = get().calculateDistance(
          { x: centerX, y: 0, z: centerZ },
          { x: tileX, y: 0, z: tileZ }
        );
        
        // Filtrage par rayon
        if (distance > validRadius) {
          filteredByRadius++;
          continue;
        }
        
        // Filtrage par type (danger)
        if (excludeDanger && tile.type === 'danger') {
          filteredByDanger++;
          continue;
        }
        
        // Filtrage par exploration
        if (onlyUnexplored && tile.explored) {
          filteredByExploration++;
          continue;
        }
        
        // Ajout du résultat valide
        results.push({
          coord: tile.position.coord,
          position: tile.position,
          tile,
          distance
        });
      }
      
      // ===============================================================
      // TRI ET LOGS DE DIAGNOSTIC
      // ===============================================================
      
      // Tri par distance croissante (les plus proches en premier)
      const sortedResults = results.sort((a, b) => a.distance - b.distance);
      
      // Logs informatifs pour le debug
      fsmLogger.info(`[getWalkableTilesInRadius] Recherche terminée:`, {
        centerCoord,
        radius: validRadius,
        processed: processedCount,
        found: sortedResults.length,
        filtered: {
          byRadius: filteredByRadius,
          byDanger: filteredByDanger,
          byExploration: filteredByExploration
        },
        options: { onlyUnexplored, excludeDanger }
      });
      
      // Log des premiers résultats pour vérification
      if (sortedResults.length > 0) {
        fsmLogger.info('[getWalkableTilesInRadius] Premiers résultats:', 
          sortedResults.slice(0, 3).map(r => ({
            coord: r.coord,
            distance: r.distance.toFixed(2),
            type: r.tile.type,
            explored: r.tile.explored
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
     * @returns La tuile walkable sélectionnée avec toutes ses propriétés ou null
     */
    selectRandomWalkableTile: (): Tile | null => {
      const tiles = get().tiles;
      
      // Filtrage efficace pour obtenir uniquement les tuiles walkables et sûres
      const walkableTiles = Object.values(tiles).filter((tile: unknown): tile is Tile =>
        tile !== null && typeof tile === 'object' && 
        'walkable' in tile && (tile as Tile).walkable !== false && 
        'type' in tile && (tile as Tile).type !== 'danger'
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
     * @returns Liste de toutes les tuiles walkables
     */
    getWalkableTiles: (): Tile[] => {
      const { tiles } = get();
      return Object.values(tiles).filter((tile: unknown): tile is Tile => 
        tile !== null && typeof tile === 'object' && 'walkable' in tile && (tile as Tile).walkable
      );
    },
    
    /**
     * Récupère toutes les tuiles d'un type donné
     * 
     * Filtre générique pour n'importe quel type de tuile.
     * 
     * @param tileType - Type de tuile recherché
     * @returns Liste des tuiles du type spécifié
     */
    getTilesByType: (tileType: TileType): Tile[] => {
      const { tiles } = get();
      return Object.values(tiles).filter((tile: unknown): tile is Tile => 
        tile !== null && typeof tile === 'object' && 'type' in tile && (tile as Tile).type === tileType
      );
    },
  } as TileFilterSliceActions;
};

export default createTileFilterSlice;
