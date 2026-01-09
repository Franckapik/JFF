/**
 * ==========================================================================
 * TILES DOMAIN - Actions et helpers pour gestion des tiles dans le contexte FSM
 * ==========================================================================
 * 
 * Ce module centralise toute la logique de gestion des tiles au niveau FSM.
 * Le worker utilise exclusivement ces actions/helpers pour manipuler les tiles.
 * 
 * ARCHITECTURE:
 * - Les tiles sont stockées dans context.gridInfo.tiles (source de vérité)
 * - Les tiles connues par le bot sont aussi dans context.memory.knownTiles
 * - Toutes les mutations passent par des actions assign
 * - Aucune dépendance à useTileStore dans le worker
 */

// Actions assign pour mutations de tiles
export {
    assignTileCollected, assignTileExplored, assignTileResourcesDeducted, assignTileUpdated, assignTilesGenerated
} from './actions.assign.ts';

// Helpers purs pour calculs et sélection
export {
    collectResourcesFromTile, deductResourcesFromTile,
    findTileWithResources,
    getTileFromContext, markTileCollected, markTileExplored, updateTileInContext
} from './helpers.pure.ts';

