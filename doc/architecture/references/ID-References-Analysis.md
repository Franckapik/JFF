# Analyse des références aux IDs dans le projet

Ce document analyse toutes les références aux IDs de joueurs et de véhicules dans le projet, en vue de préparer une migration vers une architecture multi-bots.

## 1. Constantes et fonctions utilitaires

### Constants (`src/ai/constants/playerConstants.js`)
```javascript
// IDs des joueurs
export const BOT_PLAYER_ID = 'player2';
export const HUMAN_PLAYER_ID = 'player1';

// Types de véhicules
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  EXPLORER_DRONE: 'explorer_drone',
  COMBAT_DRONE: 'combat_drone',
  SPECIAL_DRONE: 'special_drone'
};
```

### Fonctions utilitaires (`playerConstants.js`)
```javascript
// Gestion des IDs de joueurs
getBotPlayerId(playerCount = 2)           // Retourne 'player2'

// Gestion des IDs de véhicules
getMainShipId()                          // Retourne 'ship'
getBotMainVehicleId()                    // Retourne 'ship'
getDroneId(playerId, droneType)          // Retourne '{droneType}_{playerNum}'
getAllDroneIds(playerId)                 // Retourne tableau des IDs de drones
isMainShipId(vehicleId)                  // Vérifie si c'est un vaisseau
isDroneId(vehicleId)                     // Vérifie si c'est un drone
isDroneActiveByDefault(droneType)        // Vérifie l'activation par défaut
```

## 2. Points de changement majeurs

### 2.1 Création des joueurs et véhicules (`playerFactory.js`, `vehicleFactory.js`)

#### playerFactory.js
- Création des véhicules basée sur l'ID du joueur
- Création séquentielle des drones (explorer, combat, special)
- Structure du joueur avec vehicles, score, memory et messages

#### vehicleFactory.js
- Création des véhicules avec propriétés spécifiques par type
- Gestion des capacités spéciales par type de drone
- Systèmes de ressources et capacités différentes selon le type

### 2.2 Système de mouvement (`UnifiedDroneMovement.jsx`)

#### Gestion des mouvements
- Vitesses et rotations spécifiques par type de drone (Explorer: +20% vitesse, Combat: -10% vitesse, Special: vitesse standard)
- Comportements différents pour bot et joueur humain (position droite/gauche, états locaux/store)
- Gestion du retour au vaisseau et cooldown variable (Explorer: 2s, Combat: 4s, Special: 3s)
- Formation triangulaire avec hauteurs différentes autour du vaisseau parent

#### Comportements spécialisés
- Explorer Drone: Exploration, détection détaillée des ressources et dangers
- Combat Drone: Combat, pose de mines, collecte limitée avec transfert automatique au vaisseau
- Special Drone: Scan spécial à rayon étendu, détection d'objets rares

### 2.3 Composant de Debug (`BotDebugger.jsx`)
- Affichage des IDs de tous les véhicules
- Monitoring des états et ressources
- Interface de debug pour bot et joueur humain

## 3. Points d'attention pour la migration

### 3.1 Structure des données
- Store des joueurs avec IDs comme clés
- Véhicules stockés par joueur
- Gestion de la mémoire et du score par joueur

### 3.2 Actions et conditions FSM
- Actions du bot référençant BOT_PLAYER_ID
- Conditions centralisées dans botConditions.js
- Vérifications d'état des drones et du vaisseau

### 3.3 Système de messages
- Messages spécifiques par type de drone
- Communication entre véhicules d'un même joueur

## 4. Plan de migration suggéré

1. Refactoring des constantes
   - Système dynamique d'attribution des IDs
   - Gestion flexible du nombre de bots

2. Modification du système de création
   - Fonction createPlayer adaptable
   - Factory de véhicules générique

3. Adaptation du système de mouvement
   - UnifiedDroneMovement multi-bot
   - Gestion des collisions entre bots

4. Mise à jour du système de messages
   - Canal de communication par bot
   - Isolation des messages entre bots

5. Implémentation multi-bot FSM
   - Instance FSM par bot
   - Partage de ressources contrôlé

## 5. Points de vigilance

- Performance avec plusieurs bots actifs
- Gestion des collisions et conflits
- Isolation des états et mémoires
- Équilibrage des ressources
- Communication inter-bots
