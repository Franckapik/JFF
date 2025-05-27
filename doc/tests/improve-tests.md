# Analyse de Couverture de Test et Suggestions

Ce document analyse la couverture de test actuelle basée sur `doc/tests/testable-functions.md` et propose des pistes pour l'améliorer. L'existence des tests est principalement inférée par la présence d'un fichier de test correspondant au fichier source. Une inspection détaillée du contenu de chaque fichier de test est recommandée pour confirmer la couverture effective de chaque fonction.

## 1. Fonctions Listées et État Actuel des Tests

### 1.1. Système de Coordonnées (`/src/utils/coordinateSystem.js`)
**Fichier de test principal:** `src/__tests__/coordinateSystem.test.js` (Existe)

| Fonction                 | Test Existant (Présomption)     | Suggestions d'amélioration                                                                  |
|--------------------------|---------------------------------|---------------------------------------------------------------------------------------------|
| `isValidGridCoord`       | Oui                             | Tester avec formats invalides (`null`, `undefined`, `''`, `'1'`, `'a,b,c'`), coordonnées hors limites. |
| `isValidWorldPosition`   | Oui                             | Tester avec positions nulles, `undefined`, non-numériques, objets incomplets (`{x,y}`).       |
| `hexToGridCoord`         | Oui                             | Cas valides (ex: 'A1', 'Z10'), invalides ('1A', '', 'A', '#A1'), minuscules ('a1').          |
| `gridToHexCoord`         | Oui                             | Cas valides (ex: '0,0', '10,5'), invalides ('a,b', '', '1,', ',1'), avec espaces (' 1, 2 '). |
| `gridToWorld`            | Oui                             | Tester avec des coordonnées valides et invalides.                                           |
| `worldToGrid`            | Oui                             | Tester avec des positions valides et invalides.                                             |
| `toVector3`              | Oui                             | Tester avec objets position incomplets ou mal formés, `null`, `undefined`.                  |
| `fromVector3`            | Oui                             | Tester avec des `Vector3` nuls ou invalides, vérifier la structure de l'objet retourné.       |
| `hasReachedTarget`       | Oui                             | Différents seuils (0, positif), positions exactes, positions éloignées, coordonnées `null`. |

### 1.2. Gestion des Joueurs (`/src/ai/constants/playerConstants.js`)
**Fichier de test principal:** `src/__tests__/playerConstants.test.js` (Existe)

| Fonction                 | Test Existant (Présomption)     | Suggestions d'amélioration                                                                 |
|--------------------------|---------------------------------|--------------------------------------------------------------------------------------------|
| `getBotPlayerId`         | Oui                             | Tester avec index valides, hors limites, non numériques.                                    |
| `getMainShipId`          | Oui                             | Vérifier la constance de l'ID retourné.                                                    |
| `isMainShipId`           | Oui                             | Tester avec l'ID du vaisseau principal, ID de bot, ID de drone, `null`, `undefined`.         |
| `isBotPlayerId`          | Oui                             | Tester avec des ID de bots valides, ID du vaisseau principal, ID de drone, `null`.           |
| `getDroneId`             | Oui                             | Tester avec `playerId` et `droneType` valides, invalides, `null`.                            |
| `getAllDroneIds`         | Oui                             | Tester pour un joueur avec plusieurs drones, aucun drone, `playerId` invalide.               |
| `isDroneId`              | Oui                             | Tester avec des ID de drones valides, ID de vaisseau, `null`, `undefined`.                   |
| `isDroneActiveByDefault` | Oui                             | Tester pour chaque type de drone défini, types invalides.                                  |
| `initializeDrone`        | Oui                             | Vérifier la structure de l'état initial, tester avec des ID de drones invalides.             |
| `transitionDroneState`   | Oui                             | Tester des transitions valides et invalides, vérifier l'état résultant.                      |
| `isDroneInState`         | Oui                             | Tester avec différents états, ID de drone valide/invalide.                                 |
| `getDroneState`          | Oui                             | Tester pour un drone avec un état défini, drone inconnu.                                   |
| `isDroneDocked`          | Oui                             | Tester pour un drone docké, non docké, état inconnu.                                       |

### 1.3. Gestion des Tuiles (`/src/stores/useTileStore.js`)
**Fichier de test principal:** `src/__tests__/tileManagement.test.js` (Existe)
*(Note: Ce fichier de test semble correspondre. Vérifier qu'il couvre bien les fonctions exportées/utilisées de `useTileStore.js`.)*

| Fonction                       | Test Existant (Présomption)     | Suggestions d'amélioration                                                                                                |
|--------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| `getWalkableTilesInRadius`     | Oui                             | Rayon 0, grand rayon, avec/sans tuiles infranchissables, `onlyUnexplored`, `excludeDanger`. Mock `tileStore` si nécessaire. |
| `selectRandomWalkableTile`     | Oui                             | Scénario avec plusieurs tuiles accessibles, une seule, aucune. Mock `tileStore`.                                          |
| `getNeighbors`                 | Oui                             | Coordonnée centrale, en bordure, dans un coin. Grille vide.                                                                |
| `deductTileResources`          | Oui                             | Déduction partielle, totale, tentative de déduction excessive. Ressources multiples. Mock `tileStore`.                     |
| `analyzeResourcesNearPosition` | Oui                             | Différents rayons, présence/absence de ressources. Mock `tileStore`.                                                      |
| `markTileAsExplored`           | Oui                             | Marquer une tuile non explorée, déjà explorée. Mock `tileStore`.                                                          |
| `calculateDistance`            | Oui                             | Distance entre mêmes points, points adjacents, éloignés. `formatted`, `usePathfinding` (avec mocks).                      |

### 1.4. Fabrication des Objets (`/src/stores/usePlayerStore/utils/vehicleFactory.js`)
**Fichier de test principal:** `src/__tests__/vehicleFactory.test.js` (Existe)

| Fonction        | Test Existant (Présomption)     | Suggestions d'amélioration                                                              |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------|
| `createVehicle` | Oui                             | Création de différents types de véhicules, ID invalide/dupliqué (si géré), type inconnu. |

### 1.5. Pathfinding et Navigation (`/src/utils/utils.js`)
**Fichier de test principal:** `src/__tests__/pathfinding.test.js` (Existe)
*(Note: `pathfinding.test.js` pourrait ne couvrir que partiellement `utils.js`. Les fonctions non liées au pathfinding comme `generateHexPositions` pourraient nécessiter des tests dédiés ou un fichier `utils.test.js`.)*

| Fonction                  | Test Existant (Présomption)     | Suggestions d'amélioration                                                                                             |
|---------------------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `findPath`                | Oui                             | Chemin simple, complexe, avec obstacles, sans chemin possible, départ=arrivée. Grilles de différentes tailles. Mock `tiles`. |
| `calculatePathDistance`   | Oui                             | Chemin vide, chemin simple, chemin complexe. Mock `tiles`.                                                             |
| `findTileAtPosition`      | Oui                             | Position exacte sur une tuile, entre des tuiles, hors de la carte. Mock `tiles`.                                         |
| `generateHexPositions`    | À vérifier                      | Rayon 0, 1, N. Vérifier le nombre de positions, espacement. Potentiellement non couvert par `pathfinding.test.js`.       |

### 1.6. Bot Actions (`/src/ai/fsm/actions/individual/`)
**Fichier de test principal:** `src/__tests__/botActions.test.js` (Existe)
*(Note: Ces tests sont complexes et nécessitent des mocks pour `playerStore`, `tileStore`, etc. Vérifier la couverture des différents états de retour : succès, échec, en cours pour chaque action.)*

| Fonction                    | Test Existant (Présomption)     | Suggestions d'amélioration                                                                                                                               |
|-----------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `exploreWithDroneAction`    | Oui                             | Scénarios: succès (tuile explorée), échec (pas de drone, zone dangereuse), en cours. Vérifier les appels aux stores et `addAction`/`changeState`.         |
| `moveToResourceAction`      | Oui                             | Scénarios: succès (ressource atteinte), échec (pas de chemin, ressource disparue), en cours. Vérifier les appels.                                          |
| `collectResourceAction`     | Oui                             | Scénarios: succès (ressources collectées), échec (pas de ressources, inventaire plein), en cours. Vérifier les mises à jour des stores.                    |
| `returnToBaseAction`        | Oui                             | Scénarios: succès (base atteinte), échec (pas de chemin), en cours.                                                                                      |
| `refuelAtBaseAction`        | Oui                             | Scénarios: succès (ravitaillement effectué), échec (pas à la base, pas besoin de ravitaillement).                                                          |

## 2. Fonctions Non Listées Explicitement (mais présentes dans `testable-functions.md`)

Ces fonctions sont mentionnées à la fin de `testable-functions.md` et devraient également être testées.

| Fonction                    | Source Potentielle (à confirmer)      | Fichier de Test Suggéré                     | État Actuel / Suggestions                                                                                                |
|-----------------------------|---------------------------------------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `fsmLogger.*`               | `src/utils/fsmLogger.js`              | `src/__tests__/fsmLogger.test.js`           | **Probablement manquant.** Vérifier si le logger écrit correctement les messages. Mock les sorties console. Test chaque niveau. |
| `updateVehicle`             | `src/stores/usePlayerStore/...`          | `src/__tests__/usePlayerStore.test.js` ou `vehicleUtils.test.js` | **À vérifier.** Tester la mise à jour des propriétés du véhicule, gestion des IDs invalides. Mock le store.        |
| `generateInitialDrones`     | `src/stores/usePlayerStore/...` ou setup | `src/__tests__/usePlayerStore.test.js` ou `gameSetup.test.js` | **À vérifier.** Vérifier le nombre de drones créés, leur positionnement, IDs.                                |
| `setClockRunning`           | `src/stores/useGameStore/.js`          | `src/__tests__/useGameStore/.test.js`        | **Probablement manquant.** Tester le changement d'état du store.                                                          |
| `setPlayerCount`            | `src/stores/useGameStore/.js`          | `src/__tests__/useGameStore/.test.js`        | **Probablement manquant.** Tester le changement d'état du store, limites (min/max joueurs).                              |
| `formatStateName`           | UI / FSM Utility                      | `src/__tests__/uiUtils.test.js` ou `fsmUtils.test.js` | **Probablement manquant.** Tester différents noms d'états, cas vides/nuls.                                           |
| `getActionStatusColor`      | UI Utility                            | `src/__tests__/uiUtils.test.js`             | **Probablement manquant.** Tester pour chaque statut d'action possible.                                                  |
| `getTileResourceBarStyle`   | UI Utility                            | `src/__tests__/uiUtils.test.js`             | **Probablement manquant.** Tester avec différentes quantités, vérifier les styles retournés.                             |

## 3. Suggestions Générales pour Améliorer la Couverture

*   **Tests d'intégration légers**: Pour les fonctions qui interagissent (ex: conversions de coordonnées aller-retour), des tests vérifiant la cohérence des opérations combinées.
*   **Tests des stores Zustand**: Pour les fonctions dans les stores (`useTileStore`, `usePlayerStore`, `useGameStore`), s'assurer que les actions modifient correctement l'état et que les sélecteurs retournent les bonnes données. Utiliser `@testing-library/react` pour les hooks si nécessaire, ou tester les fonctions pures exportées.
*   **Mocking des dépendances**: Standardiser et vérifier l'usage des mocks pour isoler les unités testées, notamment pour les fonctions interagissant avec les stores ou d'autres modules.
*   **Conventions de nommage des tests**: S'assurer que les descriptions (`describe`, `it`) sont claires, en français (comme le reste du code), et reflètent bien ce qui est testé.
*   **Revue des tests existants**: Une passe sur les tests existants pour identifier les manques de cas limites ou de scénarios non couverts, en s'inspirant des suggestions ci-dessus.
*   **Création des fichiers de test manquants**: Prioriser la création des fichiers comme `fsmLogger.test.js`, `useGameStore.test.js`, et potentiellement `uiUtils.test.js` ou `fsmUtils.test.js`.

## 4. Prochaines Étapes Suggérées

1.  **Confirmer les sources exactes** des fonctions listées dans la section 2 et leur couverture actuelle.
2.  **Créer les fichiers de test manquants** identifiés.
3.  **Implémenter les tests** pour les fonctions non couvertes ou partiellement couvertes (ex: `generateHexPositions`).
4.  **Enrichir les tests existants** avec les suggestions d'amélioration (cas limites, scénarios variés, assertions plus précises).
5.  **Intégrer un outil de couverture de code** (ex: Vitest a des options pour cela via `c8` ou `istanbul`) pour obtenir des métriques précises et identifier les zones non testées.