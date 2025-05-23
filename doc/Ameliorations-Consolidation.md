# Éléments à améliorer pour consolider le projet

Ce document présente les éléments fragiles, incohérents, redondants ou rapidement améliorables du code, identifiés lors de l'analyse du projet. Ces améliorations permettraient de consolider la base de code avant d'ajouter de nouvelles fonctionnalités.

## 1. Structure et organisation du code

### 1.1 Problème de cohérence dans le mouvement des drones et des vaisseaux

- **Description**: Les fichiers `UnifiedDroneMovement.jsx` et `ShipMovement.jsx` contiennent beaucoup de code dupliqué et des logiques similaires gérées différemment.
- **Impact**: Maintenance difficile, modifications requises à plusieurs endroits pour un seul changement de comportement.
- **Solution proposée**: Extraire les comportements communs dans des hooks partagés (par exemple, `useVehicleMovement`) et ne garder que les spécificités dans les composants.

### 1.2 Mélange de responsabilités dans `UnifiedDroneMovement.jsx`

- **Description**: Ce composant gère à la fois le rendu, le mouvement, la logique métier et les communications.
- **Impact**: Fichier complexe (500+ lignes), difficile à maintenir et à tester.
- **Solution proposée**: Décomposer en plusieurs modules: 
  - Hook de mouvement (`useDroneMovement`)
  - Hook de communication (`useDroneCommunication`) 
  - Composant de rendu pur 

### 1.3 Inconsistance dans la gestion des chemins de fichiers

- **Description**: Certains imports utilisent des chemins relatifs (`../stores/`), d'autres des chemins absolus depuis la racine du projet.
- **Impact**: Rend le déplacement de fichiers risqué et génère de la confusion.
- **Solution proposée**: Standardiser avec des chemins absolus depuis la racine et configurer des alias dans Vite (`@components/`, `@stores/`, etc.).

## 2. Architecture du système FSM (Machine à États Finis)

### 2.1 Défis de l'architecture multi-bot

- **Description**: Le système actuel mélange des états partagés et spécifiques à chaque bot, avec un problème de contexte lors des transitions.
- **Impact**: Bugs lorsqu'on bascule entre les bots, état parfois incohérent.
- **Solution proposée**: Refactoriser pour créer une instance FSM distincte par bot plutôt qu'un état global partagé. Envisager un pattern Factory.

### 2.2 Variables statiques dans les actions FSM

- **Description**: Les actions comme `exploreWithDroneAction` utilisent des propriétés statiques pour stocker l'état (`exploreWithDroneAction.explorationStarted`).
- **Impact**: Peut causer des problèmes avec le multi-bot car ces états sont partagés entre tous les bots.
- **Solution proposée**: Stocker les informations d'état dans la mémoire du bot plutôt que dans des variables statiques.

### 2.3 Utilisation de setTimeout dans les handlers d'état de sortie

- **Description**: Dans `botStates.js`, les handlers `onExitState` utilisent des timeouts pour réinitialiser les flags `_isExiting`.
- **Impact**: Introduction de comportements asynchrones imprévisibles et risque de memory leaks.
- **Solution proposée**: Réviser le mécanisme de protection contre la récursion en utilisant une approche plus fonctionnelle sans effets de bord.

## 3. Gestion des données et intégration de stores

### 3.1 Accès direct à l'état global dans les composants

- **Description**: De nombreux composants utilisent `usePlayerStore.getState()` au lieu du hook `usePlayerStore()`.
- **Impact**: Ne profite pas de la réactivité de React, performances sous-optimales.
- **Solution proposée**: Utiliser systématiquement le hook dans les composants React pour que le re-rendu se déclenche automatiquement.

### 3.2 Multiples sources de vérité pour les coordonnées

- **Description**: Les positions sont stockées dans plusieurs formats: `position`, `coord`, dans le store, et dans les refs des composants Three.js.
- **Impact**: Synchronisation difficile, bugs quand une source est mise à jour mais pas les autres.
- **Solution proposée**: Unifier la source de vérité et implémenter des transformateurs clairs entre les différentes représentations.

### 3.3 Manque de sélecteurs mémorisés dans les stores

- **Description**: Les composants extraient souvent des tranches de données complexes du store sans utiliser de mémoisation.
- **Impact**: Performances dégradées avec des re-calculs inutiles.
- **Solution proposée**: Implémenter des sélecteurs mémorisés, par exemple avec Reselect ou `useMemo`.

## 4. Problèmes de performances et d'optimisation

### 4.1 Utilisation inefficace de useFrame dans les composants de mouvement

- **Description**: `useFrame` est appelé sur tous les composants même quand ils ne se déplacent pas.
- **Impact**: Calculs inutiles à chaque frame affectant les performances.
- **Solution proposée**: Désactiver conditionnellement `useFrame` quand le mouvement n'est pas nécessaire ou implémenter un système de throttling.

### 4.2 Calculs redondants de distance et de trajectoire

- **Description**: Les mêmes calculs de distance et de trajectoire sont effectués à plusieurs endroits.
- **Impact**: Surcoût de performance, surtout avec plusieurs bots et drones.
- **Solution proposée**: Centraliser les calculs et mettre en cache les résultats quand les paramètres ne changent pas.

### 4.3 Re-rendus inutiles dans les composants visuels

- **Description**: Certains composants visuels se re-rendent bien qu'aucune de leurs propriétés n'ait changé.
- **Impact**: Performances dégradées, surtout avec plusieurs entités.
- **Solution proposée**: Utiliser `React.memo` et `useCallback` de manière judicieuse.

## 5. Inconsistances de fonctionnalités

### 5.1 Gestion inégale des interactions drone-tuile

- **Description**: La détection des ressources, l'exploration, et les interactions avec les tuiles diffèrent entre les drones et les vaisseaux.
- **Impact**: Comportements surprenants et bugs subtils lors des interactions.
- **Solution proposée**: Unifier le modèle d'interaction et créer un système d'événements cohérent pour toutes les entités.

### 5.2 Multiples implémentations de la communication entre entités

- **Description**: Communication parfois directe (mémoire), parfois via messages (`sendVehicleMessage`).
- **Impact**: Complexité accrue, flux de données difficile à suivre.
- **Solution proposée**: Standardiser sur un seul modèle de communication, idéalement basé sur les événements.

### 5.3 Incohérence dans la gestion du retour des drones

- **Description**: ✅ Le flag `droneReturnedToShip` est désormais déprécié et remplacé par la machine à états `useDroneState`.
- **Impact**: Résolu - Les drones utilisent maintenant un système de transitions d'état clair et robuste.
- **Solution mise en œuvre**: Une machine à états (`useDroneState`) a été implémentée pour les drones, avec des transitions claires entre DOCKED_WITH_SHIP, MOVING_TO_TARGET, AT_TARGET et RETURNING_TO_SHIP.

## 6. Qualité du code et maintenabilité

### 6.1 Manque de types stricts (TypeScript)

- **Description**: Le projet utilise JavaScript sans types précis, avec beaucoup de commentaires explicatifs.
- **Impact**: Erreurs silencieuses, difficultés pour les nouveaux développeurs.
- **Solution proposée**: Migrer progressivement vers TypeScript, en commençant par les interfaces de données principales.

### 6.2 Tests incomplets et fragmentés

- **Description**: Les tests existants ne couvrent pas tous les scénarios, particulièrement pour les interactions complexes.
- **Impact**: Régressions lors des modifications.
- **Solution proposée**: Ajouter des tests unitaires pour les modules clés et des tests d'intégration pour les flux importants.

### 6.3 Logs et débogage non standardisés

- **Description**: Les logs utilisent parfois `console.log`, parfois `fsmLogger` avec différents niveaux.
- **Impact**: Difficile de filtrer et de suivre les logs pertinents.
- **Solution proposée**: Standardiser l'utilisation de `fsmLogger` avec des catégories cohérentes et configurer correctement les niveaux de log.

## 7. Améliorations rapides à fort impact

### 7.1 Nettoyer les commentaires de code mort

- **Description**: De nombreux blocs de code sont commentés sans indication claire de leur utilité future.
- **Impact**: Pollution visuelle et confusion.
- **Solution proposée**: Nettoyer ces commentaires ou les documenter clairement s'ils doivent être conservés.

### 7.2 Remplacer les magic strings et numbers

- **Description**: Plusieurs valeurs constantes sont codées en dur dans les composants.
- **Impact**: Modification difficile et risque d'erreurs.
- **Solution proposée**: Extraire ces valeurs dans des constantes nommées.

### 7.3 Unifier les méthodes de gestion des cooldowns

- **Description**: Les cooldowns sont gérés différemment selon les composants (setTimeout, delta cumulé, compteurs).
- **Impact**: Difficile de prédire et synchroniser les comportements temporels.
- **Solution proposée**: Créer un hook `useCooldown` réutilisable.

## Conclusion

Ces améliorations permettraient de solidifier la base de code existante avant d'ajouter de nouvelles fonctionnalités. La priorité devrait être accordée à la résolution des problèmes architecturaux (particulièrement ceux liés au multi-bot et à la machine à états) et à l'unification des modèles de communication et d'interaction.

Les optimisations de performance et les améliorations de qualité de code pourraient être implémentées progressivement tout en développant de nouvelles fonctionnalités.
