# BotDebugger - Architecture Refactorisée

## Vue d'ensemble

Le `BotDebugger` a été refactorisé en plusieurs composants modulaires pour améliorer la maintenabilité, la réutilisabilité et la lisibilité du code.

## Structure des fichiers

```
src/components/HUD/debugger/
├── index.js                 # Point d'entrée pour tous les exports
├── useDebuggerData.js       # Hooks personnalisés pour la gestion des données
├── ResourceBar.jsx          # Composant de barre de progression
├── DebuggerHeader.jsx       # En-tête avec sélection des bots
├── DebuggerTabs.jsx         # Navigation par onglets
├── VehicleList.jsx          # Affichage des véhicules d'un joueur
├── ShipResources.jsx        # Affichage des ressources d'un vaisseau
├── ActionsTab.jsx           # Onglet des actions du bot
├── StateTab.jsx             # Onglet de l'état du bot
├── ResourcesTab.jsx         # Onglet des ressources avec sous-onglets
├── PlayerTab.jsx            # Onglet du joueur humain
└── TileTab.jsx              # Onglet des informations de tuile
```

## Responsabilités des composants

### Hooks (useDebuggerData.js)

#### `useDebuggerData`
- Gère tous les états et données du debugger
- Centralise les appels aux stores Zustand
- Fournit les handlers pour les interactions utilisateur

#### `useDebuggerUtils`
- Fonctions utilitaires pour le formatage et les couleurs
- Logique métier réutilisable
- Helpers pour les calculs et validations

### Composants UI

#### `ResourceBar`
**Responsabilité** : Affichage d'une barre de progression pour les ressources
**Props** :
- `value` : Valeur actuelle
- `max` : Valeur maximale
- `color` : Couleur de la barre

#### `DebuggerHeader`
**Responsabilité** : En-tête avec titre et sélection des bots/joueur/tuile
**Props** :
- `botCount` : Nombre de bots
- `currentBotIndex` : Index du bot actuel
- `activeTab` : Onglet actif
- `handleBotChange` : Fonction de changement de bot
- `setActiveTab` : Fonction de changement d'onglet

#### `DebuggerTabs`
**Responsabilité** : Navigation entre les onglets principaux (Actions, État, Ressources)
**Props** :
- `activeTab` : Onglet actif
- `setActiveTab` : Fonction de changement d'onglet

#### `VehicleList`
**Responsabilité** : Affichage de la liste des véhicules d'un joueur
**Props** :
- `playerId` : ID du joueur
- `isVehicleActive` : Fonction pour vérifier si un véhicule est actif

#### `ShipResources`
**Responsabilité** : Affichage des ressources d'un vaisseau avec barres de progression
**Props** :
- `vehicle` : Données du véhicule
- `title` : Titre de la section (optionnel)

### Onglets spécialisés

#### `ActionsTab`
**Responsabilité** : Affichage des actions en cours et de l'historique
**Props** :
- `actionQueue` : File d'actions
- `storeActionHistory` : Historique des actions
- `ACTION_STATUS` : Constantes de statut
- `getActionStatusColor` : Fonction pour les couleurs de statut

#### `StateTab`
**Responsabilité** : Affichage de l'état du bot et des véhicules
**Props** :
- `botState` : État actuel du bot
- `isRunning` : Si le bot est en fonctionnement
- `BOT_STATES` : États disponibles
- `activeBotId` : ID du bot actif
- `formatStateName` : Fonction de formatage des noms d'état
- `isVehicleActive` : Fonction de vérification d'activité des véhicules

#### `ResourcesTab`
**Responsabilité** : Gestion des sous-onglets de ressources (connues, collectées, dangers)
**Props** :
- `botVehicle` : Véhicule du bot
- `botMemory` : Mémoire du bot
- `activeSubTab` : Sous-onglet actif
- `setActiveSubTab` : Fonction de changement de sous-onglet
- `calculateDistance` : Fonction de calcul de distance

#### `PlayerTab`
**Responsabilité** : Affichage des informations du joueur humain
**Props** :
- `playerVehicle` : Véhicule du joueur
- `playerData` : Données du joueur
- `isVehicleActive` : Fonction de vérification d'activité des véhicules

#### `TileTab`
**Responsabilité** : Affichage des informations de la tuile survolée
**Props** :
- `hoveredTile` : Données de la tuile
- `hoveredTileCoord` : Coordonnées de la tuile
- `playerVehicle` : Véhicule du joueur
- `botVehicle` : Véhicule du bot
- `calculateDistance` : Fonction de calcul de distance
- `currentBotIndex` : Index du bot actuel
- `getTileResourceBarStyle` : Fonction de style pour les barres de ressources

## Avantages de cette architecture

### 1. **Séparation des responsabilités**
- Chaque composant a une fonction claire et délimitée
- Facilite la maintenance et les tests
- Réduction du couplage entre les fonctionnalités

### 2. **Réutilisabilité**
- `ResourceBar` peut être utilisé partout dans l'application
- `VehicleList` et `ShipResources` sont génériques
- Les hooks peuvent être réutilisés dans d'autres composants

### 3. **Maintenabilité**
- Code plus court et plus lisible dans chaque fichier
- Modifications isolées dans des composants spécifiques
- Debugging plus facile avec des composants focalisés

### 4. **Extensibilité**
- Ajout facile de nouveaux onglets
- Modification simple des composants existants
- Architecture modulaire qui peut évoluer

### 5. **Performance**
- Possibilité d'optimiser individuellement chaque composant
- Réduction des re-rendus inutiles
- Lazy loading potentiel des onglets

## Utilisation

### Import simple
```jsx
import BotDebuggerNew from './components/HUD/BotDebugger';
```

### Import de composants individuels
```jsx
import { ResourceBar, VehicleList, useDebuggerData } from './components/HUD/debugger';
```

## Tests

Chaque composant peut maintenant être testé individuellement :

```jsx
// Exemple de test pour ResourceBar
import { render } from '@testing-library/react';
import ResourceBar from './ResourceBar';

test('renders resource bar with correct percentage', () => {
  render(<ResourceBar value={75} max={100} color="#4CAF50" />);
  // Test de l'affichage...
});
```

## Migration

L'ancien composant monolithique a été remplacé par cette architecture modulaire sans changer l'API externe. Le composant `BotDebuggerNew` conserve la même interface et peut être utilisé comme un drop-in replacement.
