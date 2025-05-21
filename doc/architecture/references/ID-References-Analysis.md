# Analyse des références aux IDs dans le projet

Ce document analyse toutes les références aux IDs de joueurs et de véhicules dans le projet, en vue de préparer une migration vers une architecture multi-bots.

## 1. Constantes et fonctions utilitaires

### Constants (`src/ai/constants/playerConstants.js`)
```javascript
export const BOT_PLAYER_ID = 'player2';
export const HUMAN_PLAYER_ID = 'player1';
export const VEHICLE_TYPES = {
  SHIP: 'ship',
  DRONE: 'drone'
};
```

### Fonctions utilitaires
```javascript
// Gestion des IDs de joueurs
getBotPlayerId(playerCount = 2) // Retourne 'player2'

// Gestion des IDs de véhicules
getMainShipId()            // Retourne 'ship'
getBotMainVehicleId()      // Retourne 'ship'
getDroneId(playerId, index)// Retourne 'drone{X}' où X est calculé à partir du playerId
getAllDroneIds(playerId)   // Retourne tableau des IDs de drones pour un joueur
isMainShipId(vehicleId)    // Vérifie si l'ID est celui d'un vaisseau
isDroneId(vehicleId)       // Vérifie si l'ID est celui d'un drone
```

## 2. Points de changement majeurs

### 2.1 Création des joueurs (`playerFactory.js`)
- La création des véhicules est basée sur le numéro du joueur
- Les IDs de drones sont générés séquentiellement
- Modifications nécessaires pour supporter plusieurs bots

### 2.2 Composants d'interface

#### BotHUD.jsx
- Références directes à \`player2\` et \`ship\`
- Affichage spécifique au bot

#### VehicleSelector.jsx
- Filtrage sur HUMAN_PLAYER_ID
- Sélection de véhicules limitée au joueur humain

#### PlayerHUD.jsx
- Références à \`player1\` et ses véhicules
- Gestion des drones liée au joueur humain

### 2.3 Système de mouvement

#### UnifiedDroneMovement.jsx
- Logique différente pour bot vs joueur humain
- Utilisation de BOT_PLAYER_ID et HUMAN_PLAYER_ID

#### ShipMovement.jsx
- Gestion des mouvements basée sur le type de joueur
- Références à BOT_PLAYER_ID

## 3. Points d'attention pour la migration

### 3.1 Structure des données
- Le store des joueurs utilise des IDs comme clés
- Les véhicules sont stockés par joueur
- La mémoire et le score sont liés au joueur

### 3.2 FSM et Actions
- Les actions du bot sont actuellement centrées sur BOT_PLAYER_ID
- La logique FSM devra être instanciable par bot

### 3.3 Messages et communication
- Système de messages par joueur
- Communication entre véhicules d'un même joueur

## 4. Plan de migration suggéré

1. Refactoring des constantes
   - Remplacer BOT_PLAYER_ID/HUMAN_PLAYER_ID par un système dynamique
   - Créer un générateur d'IDs de joueurs

2. Modification de la création des joueurs
   - Rendre createPlayer plus flexible
   - Supporter différents types de joueurs (humain/bot)

3. Adaptation de l'interface
   - Rendre BotHUD générique pour plusieurs bots
   - Adapter VehicleSelector pour tous types de joueurs

4. Refactoring du système de mouvement
   - Unifier la logique bot/humain
   - Rendre le système indépendant du type de joueur

5. FSM et Actions
   - Rendre la FSM instanciable par bot
   - Isoler l'état par instance de bot

## 5. Points de vigilance

- Performances avec plusieurs bots
- Synchronisation des états
- Gestion de la mémoire partagée/isolée
- Conflits de ressources
- Interface utilisateur adaptative
