/**
 * ============================================================================
 * ÉVÉNEMENTS DE RESSOURCES - Collecte et gestion des ressources
 * ============================================================================
 * 
 * Les événements de ressources sont liés à la découverte, collecte
 * et gestion des ressources dans l'environnement.
 * 
 * @author FSM Optimization
 * @version 1.0.0
 */

// ============================================================================
// ÉVÉNEMENTS DE DÉCOUVERTE
// ============================================================================

/**
 * Événement de découverte de ressources
 * Déclenché lorsque de nouvelles ressources sont découvertes
 */
const RESOURCES_DISCOVERED = 'RESOURCES_DISCOVERED';

/**
 * Créateur d'événement: RESOURCES_DISCOVERED
 * @param {Array} resources - Liste des ressources découvertes
 * @param {object} location - Coordonnée de la découverte
 * @returns {object} Event payload
 */
const createResourcesDiscoveredEvent = (resources, location) => ({
  type: RESOURCES_DISCOVERED,
  resources,
  location,
  timestamp: Date.now()
});

/**
 * Événement de zone explorée
 * Déclenché lorsqu'une zone a été complètement explorée
 */
const AREA_EXPLORED = 'AREA_EXPLORED';

/**
 * Créateur d'événement: AREA_EXPLORED
 * @param {Array} completedSections - Sections explorées
 * @param {Array} discoveredResources - Ressources découvertes
 * @returns {object} Event payload
 */
const createAreaExploredEvent = (completedSections, discoveredResources = []) => ({
  type: AREA_EXPLORED,
  completedSections,
  discoveredResources,
  timestamp: Date.now()
});

/**
 * Événement de détection de nouvelles ressources
 * Déclenché lorsque de nouvelles ressources sont détectées
 */
const NEW_RESOURCES_DETECTED = 'NEW_RESOURCES_DETECTED';

/**
 * Créateur d'événement: NEW_RESOURCES_DETECTED
 * @param {Array} resources - Ressources détectées
 * @param {object} location - Coordonnée de la détection
 * @returns {object} Event payload
 */
const createNewResourcesDetectedEvent = (resources, location) => ({
  type: NEW_RESOURCES_DETECTED,
  resources,
  location,
  timestamp: Date.now()
});

// ============================================================================
// ÉVÉNEMENTS DE COLLECTE
// ============================================================================

/**
 * Événement de collecte de ressource
 * Déclenché lorsqu'une ressource a été collectée
 */
const RESOURCE_COLLECTED = 'RESOURCE_COLLECTED';

/**
 * Créateur d'événement: RESOURCE_COLLECTED
 * @param {object} resource - Ressource collectée
 * @param {object} newInventory - Nouvel inventaire après collecte
 * @returns {object} Event payload
 */
const createResourceCollectedEvent = (resource, newInventory) => ({
  type: RESOURCE_COLLECTED,
  resource,
  newInventory,
  timestamp: Date.now()
});

/**
 * Événement d'inventaire plein
 * Déclenché lorsque l'inventaire atteint sa capacité maximale
 */
const INVENTORY_FULL = 'INVENTORY_FULL';

/**
 * Créateur d'événement: INVENTORY_FULL
 * @param {object} inventory - État de l'inventaire
 * @returns {object} Event payload
 */
const createInventoryFullEvent = (inventory) => ({
  type: INVENTORY_FULL,
  inventory,
  timestamp: Date.now()
});

/**
 * Événement de capacité atteinte
 * Déclenché lorsque la capacité maximale est atteinte
 */
const CAPACITY_REACHED = 'CAPACITY_REACHED';

/**
 * Créateur d'événement: CAPACITY_REACHED
 * @param {object} resources - Ressources actuelles
 * @param {number} maxCapacity - Capacité maximale
 * @returns {object} Event payload
 */
const createCapacityReachedEvent = (resources, maxCapacity) => ({
  type: CAPACITY_REACHED,
  resources,
  maxCapacity,
  timestamp: Date.now()
});

// Export des types d'événements (constants)
export const RESOURCE_EVENT_TYPES = {
  RESOURCES_DISCOVERED,
  AREA_EXPLORED,
  NEW_RESOURCES_DETECTED,
  RESOURCE_COLLECTED,
  INVENTORY_FULL,
  CAPACITY_REACHED
};

// Export des créateurs d'événements
export const resourceEvents = {
  createResourcesDiscoveredEvent,
  createAreaExploredEvent,
  createNewResourcesDetectedEvent,
  createResourceCollectedEvent,
  createInventoryFullEvent,
  createCapacityReachedEvent
};
