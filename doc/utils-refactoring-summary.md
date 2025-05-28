# Refactorisation des Utilitaires PlayerStore

## Résumé des modifications

Cette refactorisation a déplacé les fonctions utilitaires des slices vers des modules spécialisés dans le dossier `utils/`, en excluant les fonctions de validation comme demandé.

## Nouveaux fichiers utilitaires créés

### 1. `/utils/resourceUtils.js`
**Fonctions extraites du resourceSlice :**
- `checkVehicleCapacity()` - Vérifie si un véhicule est à capacité maximale
- `calculateUpdatedResources()` - Calcule les nouvelles ressources après ajout
- `canDepositResources()` - Vérifie si un véhicule peut déposer des ressources
- `calculateUpdatedScore()` - Calcule le score mis à jour après transfert
- `createEmptyVehicle()` - Crée un véhicule avec ressources vidées

### 2. `/utils/messageUtils.js`
**Fonctions extraites du messageSlice :**
- `createStandardMessage()` - Crée un message standardisé avec ID et horodatage
- `markAllMessagesAsRead()` - Marque tous les messages comme lus
- `filterMessagesByType()` - Filtre les messages par type
- `getUnreadMessages()` - Filtre les messages non lus
- `countMessagesByType()` - Compte les messages par type
- `getRecentMessages()` - Récupère les messages récents

### 3. `/utils/memoryUtils.js`
**Fonctions extraites du memorySlice :**
- `isResourceAlreadyKnown()` - Vérifie les doublons de ressources
- `isDangerAlreadyKnown()` - Vérifie les doublons de dangers
- `createMemoryResource()` - Crée un objet ressource standardisé
- `createMemoryDanger()` - Crée un objet danger standardisé
- `filterResourcesByType()` - Filtre les ressources par type
- `filterDangersBySeverity()` - Filtre les dangers par sévérité
- `getRecentDiscoveries()` - Récupère les découvertes récentes
- `getMemoryCounts()` - Compte les éléments en mémoire

### 4. `/utils/vehicleUtils.js`
**Fonctions extraites du vehicleSlice :**
- `createUpdatedVehicleState()` - Crée un état de véhicule mis à jour pour Zustand
- `createUpdatedVehiclesState()` - Mise à jour de plusieurs véhicules
- `filterVehiclesByType()` - Filtre les véhicules par type
- `getMovingVehicles()` - Récupère les véhicules en mouvement
- `getVehiclesAtPosition()` - Récupère les véhicules à une position
- `extractVehicleEssentials()` - Extrait les informations essentielles
- `createVehiclesSummary()` - Crée un résumé des véhicules

### 5. `/utils/index.js`
Point d'entrée centralisé pour tous les utilitaires, permettant des imports simplifiés.

## Slices refactorisés

### `resourceSlice.js`
- Import des utilitaires de ressources
- Simplification des fonctions `processResourceDeposit`, `isAtCapacity`, `addResources`, `transferResourcesToScore`
- Logique métier déplacée vers les utilitaires

### `messageSlice.js`
- Import de `markAllMessagesAsRead`
- Simplification de la fonction `markMessagesAsRead`

### `memorySlice.js`
- Import des utilitaires de mémoire
- Simplification des fonctions `addKnownResource` et `addKnownDanger`
- Standardisation des objets avec métadonnées

### `vehicleSlice.js`
- Import de `createUpdatedVehicleState`
- Simplification de la fonction `updateVehicle`

## Avantages de cette refactorisation

1. **Réutilisabilité** : Les utilitaires peuvent être utilisés dans d'autres parties du code
2. **Testabilité** : Fonctions pures plus faciles à tester unitairement
3. **Lisibilité** : Slices plus concis et focalisés sur la logique d'état
4. **Maintenance** : Logique métier centralisée dans les utilitaires
5. **Modularité** : Import centralisé via l'index
6. **Consistency** : Standardisation des objets avec métadonnées

## Notes

- Les fonctions de validation ont été intentionnellement conservées dans les slices
- Tous les fichiers se compilent sans erreur
- La structure suit le pattern établi avec les utilitaires existants
- Les imports utilisent l'index centralisé pour une meilleure organisation
