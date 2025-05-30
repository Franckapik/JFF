# Guide de Migration FSM - Bot-Only First

Ce document fournit les prompts structurés pour migrer vers l'architecture FSM avec React-Robot, en commençant par un système bot-only optimal.

## 🎯 Objectif Global
Créer une architecture FSM robuste avec des bots autonomes fonctionnels, puis ajouter facilement le player humain comme "bot en mode manuel".

## 🏗️ Stratégie : FSM Context = Store Unique
- **Bot autonome** : contexte FSM avec `autonomousMode: true`
- **Player humain** : même contexte FSM avec `autonomousMode: false` 
- **Actions partagées** : movement.js déjà prêt avec pattern contexte FSM
- **Interface unifiée** : `useEntity(id, type)` pour bot et player

## 📋 Plan de Migration (6 Phases)

### Phase 1 : Actions Core Bot-Focused (Semaine 1)
**Objectif :** Finaliser les actions pures pour contexte FSM

#### Étape 1.1 : Compléter Actions Manquantes ✅ FAIT: movement.js
```
Crée les actions manquantes basées sur le pattern de movement.js :
- src/shared/actions/core/inventory.js (gestion ressources dans contexte)
- src/shared/actions/core/fuel.js (gestion carburant dans contexte)
- src/shared/actions/core/exploration.js (gestion exploration dans contexte)

Chaque fichier doit :
1. Utiliser le pattern contexte FSM (context, event) => newContext
2. Fonctions pures sans effets de bord
3. Validation et gestion d'erreurs complètes
4. Compatible avec la structure vehicule du contexte FSM
```

#### Étape 1.2 : Tests Unitaires Actions Core
```
Crée des tests unitaires pour toutes les actions core qui vérifient :
- Les fonctions sont pures (mêmes inputs = mêmes outputs)
- Gestion correcte des cas d'erreur
- Transformations de contexte correctes
- Guards fonctionnent correctement
- Utilise Vitest comme framework de test
```

### Phase 2 : Machine FSM Bot Complète (Semaine 2)
**Objectif :** FSM autonome fonctionnelle avec contexte comme store

#### Étape 2.1 : Installation et Contexte Initial
```bash
npm install robot3
```

```
Contexte : Créer le contexte FSM unifié qui remplace PlayerStore/BotStore
Objectif : Store unique basé sur le contexte FSM
Contrainte : Compatible avec les actions core existantes

Crée src/ai/fsm/machine/context/initialContext.js qui :
1. Définit createEntityContext(entityId, entityType = 'auto')
2. Structure véhicule identique à PlayerStore mais dans contexte FSM
3. Propriétés FSM spécifiques : autonomousMode, currentTarget, explorationQueue
4. Support des types : 'auto' (bot), 'manual' (bot contrôlé), 'human' (futur player)
5. Utilise les constantes de movement.js (VEHICLE_TYPES, DEFAULT_VEHICLE_STATE)
```

#### Étape 2.2 : Machine FSM Simple
```
Contexte : Machine d'état pour bots autonomes
Objectif : FSM avec 4 états principaux
Contrainte : Utiliser les actions core existantes

Crée src/ai/fsm/machine/botMachine.js qui :
1. États : IDLE, EXPLORING, COLLECTING, RETURNING
2. Utilise createMachine de robot3
3. Intègre les guards basés sur BotConditions.js
4. Actions utilisant movementActions du fichier movement.js
5. Gestion de l'autonomousMode dans les transitions
6. Events : auto (transitions conditionnelles) + manuels (debug/contrôle)
```

#### Étape 2.3 : Hook useBotMachine
```
Crée src/ai/fsm/hooks/useBotMachine.js qui :
1. Utilise useMachine de robot3 avec botMachine
2. Initialise avec createEntityContext
3. Interface publique : { entity, vehicle, state, context, actions, send }
4. Actions : moveTo, stopMovement, startExploration, toggleAutonomous
5. Helpers : isAutonomous, canManualControl, isMoving
6. Gère les événements automatiques (timers, conditions)
```

### Phase 3 : Composants Bot Complets (Semaine 3)
**Objectif :** Interface utilisateur complète pour bots autonomes

#### Étape 3.1 : Composant Bot Principal
```
Crée src/components/Bot/BotController.jsx qui :
1. Utilise useBotMachine pour contrôler un bot
2. Affiche l'état FSM actuel et le contexte
3. Boutons de contrôle manuel pour debug : moveTo, startExploration, returnToBase
4. Indicateurs visuels : fuel, position, cible actuelle, mode autonome
5. Interface de toggle autonome/manuel
```

#### Étape 3.2 : Gestionnaire Multi-Bots
```
Crée src/components/Bot/MultiBotManager.jsx qui :
1. Gère plusieurs bots simultanément avec useBotMachine(botId)
2. Vue d'ensemble de tous les bots : états, positions, fuel
3. Contrôles globaux : start/stop all, emergency stop
4. Métriques collectives : bots actifs, ressources collectées, efficacité
```

#### Étape 3.3 : Debug Panel Avancé
```
Améliore src/components/HUD/BotDebugger.jsx pour :
1. Visualiser l'état FSM en temps réel
2. Historique des transitions d'état
3. Inspection détaillée du contexte FSM
4. Graphique des transitions possibles depuis l'état actuel
5. Métriques de performance par bot
```

### Phase 4 : Migration Progressive Bot (Semaine 4)
**Objectif :** Remplacer graduellement l'ancien système

#### Étape 4.1 : Systèmes Parallèles
```
Modifie MultiBotManager.jsx pour :
1. Ajouter une prop enableNewFSM (boolean)
2. Permettre le choix entre useBotStore (ancien) et useBotMachine (nouveau)
3. Faire coexister les deux systèmes sans conflit
4. Ajouter un toggle dans l'UI pour tester les deux modes
```

#### Étape 4.2 : Tests de Régression
```
Crée des tests d'intégration qui :
1. Comparent le comportement ancien vs nouveau bot
2. Testent les mêmes scénarios sur les deux systèmes
3. Vérifient que les actions produisent des résultats équivalents
4. Mesurent les performances des deux approches
```

### Phase 5 : Actions Core Complètes (Semaine 5)
**Objectif :** Finaliser toutes les actions manquantes

#### Étape 5.1 : Actions Avancées
```
Complète le système avec :
- src/shared/actions/core/vehicle.js (santé, shields, réparations)
- src/shared/actions/core/navigation.js (pathfinding, obstacles)
- src/shared/actions/core/combat.js (si applicable au jeu)

Toutes basées sur le pattern contexte FSM de movement.js
```

#### Étape 5.2 : Optimisations FSM
```
Améliore la machine FSM avec :
1. États avancés : PATROLLING, EMERGENCY, MAINTENANCE
2. Transitions complexes basées sur les nouvelles actions
3. Performance et gestion mémoire optimisées
4. Logging et debugging avancés
```

### Phase 6 : Player Humain (Semaine 6) 🎯 FACILE !
**Objectif :** Ajout player réel avec changements minimaux

#### Étape 6.1 : Hook useEntity Unifié
```
Contexte : Player humain = Bot en mode manuel
Objectif : Interface unifiée pour Player et Bots
Contrainte : Réutiliser 95% du code existant

Crée src/hooks/useEntity.js qui :
1. Wrapper de useBotMachine avec entityType ('human', 'auto', 'manual')
2. Gère autonomousMode selon le type
3. Interface identique : { entity, vehicle, actions, state }
4. ≈ 30 lignes de code total !
```

#### Étape 6.2 : Contrôles Humains
```
Crée src/components/Player/PlayerControls.jsx qui :
1. Map clavier/souris → événements FSM existants
2. useKeyboard('w') → send('MOVE_TO_TILE', ...)
3. Réutilise 100% des actions bots
4. ≈ 50 lignes de code total !
```

#### Étape 6.3 : Migration PlayerStore (Optionnelle)
```
Si nécessaire, crée des utilitaires de migration :
1. migratePlayerToEntity() pour convertir les données
2. usePlayerCompat() pour compatibilité temporaire
3. Tests de régression Player vs Entity
```
Refactorise BotDebugger pour :
1. Fonctionner avec les deux systèmes (ancien/nouveau)
2. Ajouter un toggle pour switcher entre les modes
3. Afficher les différences d'état côte à côte
4. Inclure des métriques de performance comparatives
```

## ✅ Checklist de Validation

### Phase 1 : Actions Core
- [x] ~~Actions movement.js créées et testées~~ **✅ FAIT**
- [x] ~~Actions vehicle.js intégrées dans movement.js~~ **✅ FAIT** 
  - ✅ updateVehicleProperties, activateVehicle, deactivateVehicle
  - ✅ damageVehicle, repairVehicle, setVehicleShield, setVehicleSpeed
  - ✅ createVehicleWithCapacities avec types MAIN_SHIP, DRONE, SCOUT, HARVESTER
- [x] ~~Fonctions pures sans effets de bord~~ **✅ FAIT** (pattern contexte FSM respecté)
- [x] ~~Validation et gestion d'erreurs~~ **✅ FAIT** (validateTargetTile, validateVehicle, etc.)
- [x] ~~Guards complets~~ **✅ FAIT** (movementGuards + vehicleGuards)
- [x] ~~Selectors utilitaires~~ **✅ FAIT** (movementSelectors + vehicleSelectors)
- [x] ~~Events formatés~~ **✅ FAIT** (movementEvents + vehicleEvents)

### Phase 2 : Machine FSM Bot
- [x] ✅ **Context FSM initial** (createEntityContext) ✅ FAIT
- [x] ✅ **Machine FSM botMachine.js** (États IDLE, EXPLORING, COLLECTING, RETURNING) ✅ FAIT  
- [x] ✅ **Hook useBotMachine** ✅ FAIT
- [x] ✅ **Intégration avec actions movement.js existantes** ✅ FAIT

### Phase 3 : Composants Bot
- [ ] **BotController.jsx manquant** (utilise useBotMachine)
- [ ] **MultiBotManager.jsx manquant** (gestion multi-bots)
- [ ] **Debug panel FSM avancé manquant** (amélioration BotDebugger.jsx)
- [ ] Interface de contrôle manuel/autonome
- [ ] Indicateurs visuels FSM (états, transitions, contexte)

### Phase 4 : Migration Bot
- [ ] **Système parallèle ancien/nouveau manquant**
- [ ] MultiBotManager avec prop enableNewFSM 
- [ ] Tests comparatifs ancien vs nouveau système
- [ ] Toggle UI pour tester les deux modes
- [ ] Métriques de performance comparatives

### Phase 5 : Actions Complètes
- [x] ~~Actions vehicle.js~~ **✅ FAIT** (intégrées dans movement.js)
- [ ] **Actions navigation.js manquantes** (pathfinding, obstacles)
- [ ] **Actions combat.js manquantes** (si applicable)
- [ ] États avancés FSM (PATROLLING, EMERGENCY, MAINTENANCE)
- [ ] Optimisations performance et mémoire
- [ ] Logging et debugging avancés

### Phase 6 : Player Humain
- [ ] **Hook useEntity unifié manquant**
- [ ] **PlayerControls.jsx manquant** (mapping clavier/souris → FSM)
- [ ] Migration PlayerStore (optionnelle)
- [ ] Tests de régression Player vs Bot
- [ ] Interface unifiée Bot/Player

## 📊 Progression Actuelle

### ✅ Complété (≈25%)
- **Actions movement.js** : Complètes avec pattern contexte FSM
- **Actions vehicle.js** : Intégrées dans movement.js (santé, shields, capacités)
- **Validation et guards** : Système robuste de validation
- **Architecture actions** : Pattern pur (context, event) => newContext établi

### 🚧 En Cours de Migration
- **Tests unitaires** : À créer pour movement.js
- **Actions manquantes** : inventory.js, fuel.js, exploration.js
- **Machine FSM** : À créer avec robot3

### 🔜 Prochaines Étapes Prioritaires
1. **Créer actions inventory.js** (pattern de movement.js)
2. **Créer actions fuel.js** (pattern de movement.js) 
3. **Créer actions exploration.js** (pattern de movement.js)
4. **Installer robot3** et créer contexte FSM initial
5. **Créer machine botMachine.js** avec les actions existantes

### 🎯 Prêt Pour
- **Phase 2** : Les actions core sont suffisamment avancées pour créer la FSM
- **Tests d'intégration** : Architecture actions robuste permet de tester la FSM
- **Migration progressive** : Structure permet d'ajouter les composants manquants

## Pourquoi Bot-Only First ?

### Avantages Stratégiques

1. **Focus sur l'autonomie** : Les bots doivent être autonomes, le player humain est juste un "bot en mode manuel"
2. **Architecture plus simple** : FSM Context remplace complètement PlayerStore
3. **Réutilisation maximale** : Toutes les actions bot → actions player gratuitement
4. **Validation robuste** : FSM + actions testées à fond avant ajout player
5. **Demo impressionnante** : Multi-bots autonomes fonctionnels rapidement

### Player = Bot Humain

Le player humain utilise **exactement** les mêmes :
- Actions FSM (`moveTo`, `collect`, `refuel`)
- Structure de données (contexte FSM)
- Logique métier (guards, validations)
- Interface (`useEntity` pour tous)

**Seule différence :** `autonomousMode: false` + mapping clavier/souris → événements FSM

### Preuve de Concept

```javascript
// Bot autonome
const bot = useEntity('bot1', 'auto');     // autonomousMode: true

// Player humain  
const human = useEntity('player1', 'human'); // autonomousMode: false

// Interface identique !
bot.actions.moveTo('5,5');
human.actions.moveTo('5,5');
```

## Architecture Proposée (FSM Context = Store Unique)

```
src/
├── ai/
│   └── fsm/
│       ├── index.js                     # Point d'entrée principal
│       ├── machine/
│       │   ├── botMachine.js           # Machine unifiée (Bot + futur Player)
│       │   ├── context/
│       │   │   ├── index.js            # Export du contexte initial
│       │   │   ├── initialContext.js   # createEntityContext() unifié
│       │   │   └── contextHelpers.js   # Utilitaires pour le contexte
│       │   ├── states/
│       │   │   ├── index.js            # Export des constantes d'états
│       │   │   ├── idle.js             # État IDLE + transitions
│       │   │   ├── exploring.js        # État EXPLORING + transitions
│       │   │   ├── collecting.js       # État COLLECTING + transitions
│       │   │   └── returning.js        # État RETURNING + transitions
│       │   ├── guards/
│       │   │   ├── index.js            # Export de tous les guards
│       │   │   ├── safety.js           # Guards de sécurité (fuel, capacity)
│       │   │   ├── efficiency.js       # Guards d'efficacité (resources)
│       │   │   ├── discovery.js        # Guards d'exploration
│       │   │   └── base.js             # Guards liés à la base
│       │   ├── actions/
│       │   │   ├── index.js            # Export de toutes les actions FSM
│       │   │   ├── exploration.js      # Actions d'exploration
│       │   │   ├── collection.js       # Actions de collecte
│       │   │   ├── navigation.js       # Actions de navigation
│       │   │   └── assessment.js       # Actions d'évaluation
│       │   ├── events/
│       │   │   ├── index.js            # Export des événements
│       │   │   ├── auto.js             # Événements automatiques (bots)
│       │   │   ├── manual.js           # Événements manuels (debug/player)
│       │   │   └── emergency.js        # Événements d'urgence
│       │   └── reducers/
│       │       ├── index.js            # Export des réducteurs
│       │       ├── context.js          # Réducteurs de contexte
│       │       └── vehicle.js          # Réducteurs de véhicule
│       ├── hooks/
│       │   ├── useBotMachine.js        # Hook principal (Bot autonome)
│       │   ├── useEntity.js            # Hook unifié (Phase 6: Player)
│       │   └── useBotEvents.js         # Hook pour les événements auto
│       └── utils/
│           ├── machineHelpers.js       # Utilitaires pour la machine
│           ├── contextValidation.js    # Validation du contexte
│           └── debugging.js            # Outils de debug FSM
├── shared/
│   └── actions/
│       └── core/
│           ├── index.js                # Export de toutes les actions core
│           ├── movement.js             # ✅ Actions de mouvement (FAIT)
│           ├── inventory.js            # Actions d'inventaire (Phase 1)
│           ├── fuel.js                 # Actions de carburant (Phase 1)
│           ├── exploration.js          # Actions d'exploration (Phase 1)
│           ├── vehicle.js              # Actions véhicule (Phase 5)
│           └── navigation.js           # Actions navigation (Phase 5)
├── components/
│   ├── Bot/
│   │   ├── BotController.jsx           # Contrôleur principal du bot
│   │   ├── MultiBotManager.jsx         # Gestionnaire multi-bots
│   │   ├── BotDebugPanel.jsx           # Panel de debug FSM
│   │   └── BotStateDisplay.jsx         # Affichage d'état temps réel
│   ├── Player/                         # Phase 6: Ajout Player
│   │   ├── PlayerControls.jsx          # Contrôles clavier/souris → FSM
│   │   └── HumanPlayerController.jsx   # Interface player humain
│   └── Entity/                         # Phase 6: Interface unifiée
│       ├── EntityController.jsx        # Contrôleur unifié Bot/Player
│       └── EntityManager.jsx           # Gestionnaire multi-entités
└── hooks/
    ├── useEntity.js                    # Phase 6: Hook unifié
    └── usePlayerCompat.js              # Phase 6: Compatibilité migration
```