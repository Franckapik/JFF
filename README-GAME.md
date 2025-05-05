# Space Resource Gathering - Documentation du Jeu

## Vue d'ensemble

Space Resource Gathering est un jeu de stratégie en temps réel où les joueurs contrôlent des vaisseaux et des drones pour explorer une grille hexagonale, collecter des ressources et les ramener à leur base. Le jeu oppose un joueur humain (player1) à une IA (player2) qui utilise un système de machine à états finis (FSM) pour prendre ses décisions.

## Mécaniques de base

### Carte et déplacement
- La carte est composée de tuiles hexagonales générées procéduralement
- Chaque tuile peut avoir différents types: ressource, danger, départ, carburant, réparation
- Les joueurs déplacent leurs vaisseaux et drones d'une tuile à l'autre
- Le déplacement consomme du carburant

### Ressources et collecte
- Trois types de ressources: nourriture (food), débris (debris) et spécial
- Chaque véhicule a une capacité maximale pour chaque type de ressource
- Les ressources collectées doivent être ramenées à la base pour être converties en points

### Véhicules
- **Vaisseau principal (ship)**: capacité de stockage élevée, peut subir des dommages
- **Drones**: plus rapides mais avec une capacité de stockage limitée

### États des véhicules
- Position (coordonnées sur la grille)
- En mouvement (isMoving)
- Niveau de carburant (fuel)
- Niveau de dégâts (damage)
- Ressources transportées
- Capacité maximale atteinte (isAtCapacity)

## Architecture technique

### Stores (Zustand)
- **usePlayerStore**: gère les joueurs, leurs véhicules et leurs ressources
- **useTileStore**: gère les tuiles et leurs propriétés (ressources, type, etc.)
- **useBotStore**: implémente l'IA du bot avec une machine à états finis

### Composants React
- **Scene.jsx**: rendu 3D principal avec Three.js
- **ShipMovement.jsx**: gestion des mouvements des vaisseaux
- **UserHUD.jsx**: interface utilisateur affichant les informations du joueur
- **BotControls.jsx**: contrôles pour l'IA (pause/reprise)

### IA du Bot (Machine à états finis)
- **États**: IDLE, EXPLORING, COLLECTING, RETURNING, AVOIDING, REPAIRING, REFUELING
- **BotServices.js**: services d'abstraction pour les actions du bot

## Gameplay

1. **Exploration**: Les joueurs explorent la carte pour découvrir des ressources
2. **Collecte**: Les véhicules collectent des ressources jusqu'à leur capacité maximale
3. **Retour à la base**: Une fois pleins, les véhicules retournent à leur base
4. **Transfert**: Les ressources sont transférées au score du joueur
5. **Gestion**: Ravitaillement en carburant et réparation des dommages

## Services du Bot

Le module `BotServices.js` fournit une abstraction pour les actions du bot:
- `moveToTile`: déplacement vers une tuile cible
- `collectResources`: collecte de ressources
- `transferResources`: transfert des ressources vers le score
- `findNearbyResources`: recherche des ressources à proximité
- `isAtCapacity`: vérification si le véhicule est à sa capacité maximale
- `getRandomWalkableTile`: sélection d'une tuile aléatoire accessible

## Workflow du Bot
1. **Planification**: détermine les actions à effectuer selon l'état actuel
2. **Mise en file**: ajoute les actions à une file d'attente
3. **Exécution**: exécute les actions de la file une par une
4. **Transition**: change d'état en fonction des résultats des actions

## Interface utilisateur
- **HUD supérieur**: informations sur le joueur actif et les véhicules
- **HUD inférieur**: informations détaillées sur les stores (debug)
- **Contrôles du Bot**: pause/reprise de l'IA
- **Sélecteur de véhicule**: changement du véhicule actuellement contrôlé
- **Système de messages**: notifications des événements importants

## Développement technique
Le jeu est développé avec:
- React pour la logique UI
- Three.js et React Three Fiber pour le rendu 3D
- Zustand pour la gestion d'état
- Une architecture modulaire orientée services

## Règles du Jeu - Collecte de Ressources

### Objectif Principal
L'objectif principal de chaque joueur est d'accumuler le plus grand nombre de ressources. Le joueur avec le score le plus élevé à la fin du jeu est déclaré vainqueur.

### Cycle de Collecte des Ressources
1. **Exploration**: 
   - Avant de collecter des ressources, les joueurs doivent d'abord découvrir où elles se trouvent
   - Les drones peuvent être envoyés pour explorer les tuiles et identifier celles qui contiennent des ressources
   - L'exploration avec les drones est sans risque et permet de repérer les dangers avant de s'y aventurer avec le vaisseau principal

2. **Déplacement**:
   - Une fois une tuile intéressante identifiée, le vaisseau peut s'y déplacer
   - Le déplacement consomme du carburant proportionnellement à la distance parcourue

3. **Collecte**:
   - Arrivé sur une tuile contenant des ressources, le joueur peut les collecter
   - Les ressources collectées sont stockées dans la capacité du vaisseau
   - Chaque véhicule a une capacité de stockage limitée

4. **Retour à la Base**:
   - Les ressources collectées doivent être ramenées à la base pour être comptabilisées dans le score du joueur
   - Tant que les ressources ne sont pas déposées à la base, elles ne sont pas comptabilisées et peuvent être perdues en cas de danger

5. **Transfert au Score**:
   - Une fois à la base, les ressources sont automatiquement transférées au score du joueur
   - Le joueur peut alors repartir collecter davantage de ressources

### Stratégie d'Exploration
- Il est recommandé d'explorer plusieurs tuiles avec les drones avant de décider où envoyer le vaisseau principal
- Les drones peuvent identifier:
  - Les types et quantités de ressources disponibles
  - Les dangers potentiels qui pourraient endommager le vaisseau
  - Les zones de ravitaillement en carburant ou de réparation

### Dangers et Risques
- Certaines tuiles contiennent des dangers qui peuvent endommager les véhicules ou réduire leur carburant
- Si un drone découvre un danger, il peut en informer le joueur pour qu'il évite cette zone
- Les ressources collectées peuvent être perdues si le vaisseau est détruit avant de retourner à la base

### Gestion des Ressources
- Le joueur doit constamment surveiller:
  - Le niveau de carburant (pour s'assurer de pouvoir retourner à la base)
  - Les dégâts subis (pour éviter la destruction du vaisseau)
  - La capacité de stockage (pour maximiser l'efficacité des voyages)

Cette boucle de gameplay - explorer, collecter, retourner, répéter - constitue le cœur de l'expérience de jeu. Le joueur qui gère le mieux ses ressources, minimise les risques et optimise ses déplacements accumulera le plus de points.