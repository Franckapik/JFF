# Convention de Nommage pour le Tracking de Position

## Contexte
Ce document établit les conventions de nommage standardisées pour les événements, méthodes et constantes liés au tracking de position dans le système FSM.

## Date de mise en œuvre
- Standardisation initiale : 13 juin 2025
- Réorganisation et nettoyage : 13 juin 2025
- Version : 2.0.0

## Architecture des entités

Le système supporte uniquement deux types d'entités :
- **SHIP** : Le vaisseau principal
- **DRONE** : Les drones déployés par le vaisseau

Les événements **ENTITY** sont des événements génériques pouvant s'appliquer aux deux types d'entités.

⚠️ **Important** : L'entité "bot" n'existe plus dans cette architecture. Tous les événements utilisent soit "ship", soit "drone".

## Principes généraux

### Structure des noms d'événements
Le format général des noms d'événements suit cette structure:
```
{ENTITY}_{ACTION}_{TARGET}
```

Où:
- `ENTITY` : l'entité concernée (DRONE, SHIP, BOT)
- `ACTION` : l'action réalisée (DEPLOYED, REACHED, APPROACHING)
- `TARGET` : la cible de l'action (TARGET, SHIP, BASE)

### Structure des noms de méthodes
Les méthodes de création d'événements suivent cette structure:
```
create{Entity}{Action}{Target}Event
```

Les méthodes de traitement d'événements suivent cette structure:
```
on{Action}{Target}
```

## Organisation du fichier movementEvents.js

Le fichier est maintenant organisé en trois sections principales :

### 1. ÉVÉNEMENTS D'ENTITÉ GÉNÉRIQUE
Événements pouvant s'appliquer à n'importe quelle entité (ship ou drone) :
- `ENTITY_MOVEMENT_STARTED`
- `ENTITY_MOVEMENT_PROGRESS` 
- `ENTITY_POSITION_UPDATE`
- `ENTITY_MOVEMENT_CANCELLED`
- `ENTITY_NAVIGATION_PROGRESS`

### 2. ÉVÉNEMENTS DE VAISSEAU (SHIP)
Événements spécifiques au vaisseau principal :
- `SHIP_MOVEMENT_STARTED`
- `SHIP_REACHED_BASE`
- `SHIP_ARRIVED_AT_TILE`
- `SHIP_UPDATE_POSITION`
- `SHIP_COLLECTION_COMPLETED`
- `SHIP_REFUEL_COMPLETED`

### 3. ÉVÉNEMENTS DE DRONE
Événements spécifiques aux drones :
- `DRONE_DEPLOYED`
- `DRONE_POSITION_UPDATE`
- `DRONE_REACHED_TARGET`
- `DRONE_APPROACHING_SHIP`
- `DRONE_REACHED_SHIP`
- `PROSPECTING_COMPLETE`

## Méthodes standardisées

### Méthodes de création d'événements

#### Méthodes pour entités génériques (ENTITY)
- `createEntityMovementStartedEvent` : Crée un événement de début de mouvement pour une entité
- `createEntityMovementProgressEvent` : Crée un événement de progression de mouvement pour une entité
- `createEntityPositionUpdateEvent` : Crée un événement de mise à jour de position pour une entité
- `createEntityMovementCancelledEvent` : Crée un événement d'annulation de mouvement pour une entité
- `createEntityNavigationProgressEvent` : Crée un événement de progression de navigation pour une entité

#### Méthodes pour vaisseaux (SHIP)
- `createShipMovementStartedEvent` : Crée un événement de début de mouvement pour un vaisseau
- `createShipReachedBaseEvent` : Crée un événement d'arrivée à la base pour un vaisseau
- `createShipArrivedAtTileEvent` : Crée un événement d'arrivée à une tuile pour un vaisseau
- `createShipUpdatePositionEvent` : Crée un événement de mise à jour de position pour un vaisseau
- `createShipCollectionCompletedEvent` : Crée un événement de collecte complétée pour un vaisseau
- `createShipRefuelCompletedEvent` : Crée un événement de ravitaillement terminé pour un vaisseau

#### Méthodes pour drones (DRONE)
- `createDroneDeployedEvent` : Crée un événement de déploiement de drone
- `createDronePositionUpdateEvent` : Crée un événement de mise à jour de position de drone
- `createDroneReachedTargetEvent` : Crée un événement d'arrivée du drone à sa cible
- `createDroneApproachingShipEvent` : Crée un événement d'approche du drone vers le vaisseau
- `createDroneReachedShipEvent` : Crée un événement d'arrivée du drone au vaisseau
- `createProspectingCompleteEvent` : Crée un événement de fin de prospection

### Méthodes de traitement (handlers)
- `onMovementStart` : Gère le début d'un mouvement
- `onTargetReached` : Gère l'arrivée à une cible
- `onProspectingStart` : Gère le début d'une prospection
- `onApproachingShip` : Gère l'approche d'un drone vers le vaisseau

## Constantes

### Seuils de distance
Les constantes suivantes définissent les seuils de distance dans `POSITION_TRACKER_CONFIG.THRESHOLDS`:

- `TARGET_REACH` : Distance pour considérer une cible atteinte
- `RESET_MOVEMENT` : Distance pour nettoyer les flags de mouvement
- `DEPLOYMENT_START` : Distance pour déclencher le déploiement
- `DRONE_APPROACHING_SHIP` : Distance pour détecter l'approche d'un drone vers le vaisseau
- `SHIP_MOVEMENT_START` : Distance pour déclencher le mouvement d'un vaisseau
- `STATION_REACH` : Distance pour atteindre une station

### Timing
Les constantes temporelles sont définies dans `POSITION_TRACKER_CONFIG.TIMINGS`.

## Rétrocompatibilité
Pour assurer la compatibilité avec le code existant, certaines méthodes et constantes obsolètes sont maintenues avec des redirections vers les nouvelles implémentations :

### Événements standardisés
- `MOVEMENT_STARTED` → Redirigé vers `ENTITY_MOVEMENT_STARTED`
- `MOVEMENT_PROGRESS` → Redirigé vers `ENTITY_MOVEMENT_PROGRESS`
- `BASE_REACHED` → Redirigé vers `SHIP_REACHED_BASE`
- `ENTITY_REACHED_BASE` → Redirigé vers `SHIP_REACHED_BASE` (ancienne standardisation)
- `MOVEMENT_CANCELLED` → Redirigé vers `ENTITY_MOVEMENT_CANCELLED`
- `UPDATE_POSITION` → Redirigé vers `ENTITY_POSITION_UPDATE`
- `NAVIGATION_PROGRESS` → Redirigé vers `ENTITY_NAVIGATION_PROGRESS`
- `DRONE_RETURNED` → Redirigé vers `DRONE_REACHED_SHIP`

### Méthodes standardisées
- `createMovementStartedEvent` → Redirigé vers `createEntityMovementStartedEvent`
- `createMovementProgressEvent` → Redirigé vers `createEntityMovementProgressEvent`
- `createBaseReachedEvent` → Redirigé vers `createShipReachedBaseEvent`
- `createEntityReachedBaseEvent` → Redirigé vers `createShipReachedBaseEvent` (ancienne standardisation)
- `createMovementCancelledEvent` → Redirigé vers `createEntityMovementCancelledEvent`
- `createUpdatePositionEvent` → Redirigé vers `createEntityPositionUpdateEvent`
- `createNavigationProgressEvent` → Redirigé vers `createEntityNavigationProgressEvent`
- `createDroneReturnedEvent` → Redirigé vers `createDroneReachedShipEvent`

Ces redirections seront supprimées dans une future version après mise à jour complète du code.
