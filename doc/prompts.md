# Guide de Migration FSM - Prompts pour GitHub Copilot

Ce document fournit les prompts structurés pour migrer progressivement vers l'architecture FSM avec React-Robot.

## 🎯 Objectif Global
Migrer du système PlayerStore/BotStore vers une architecture unifiée avec actions partagées et FSM React-Robot, sans breaking changes.

## 📋 Plan de Migration (5 Phases)

### Phase 1 : Actions Core Partagées (Semaine 1)
**Objectif :** Extraire la logique pure des stores existants

#### Étape 1.1 : Actions de Mouvement
```
Contexte : Extraire la logique pure de movementSlice.js
Objectif : Créer des fonctions réutilisables sans effets de bord
Contrainte : Maintenir la compatibilité avec l'existant

Crée src/shared/actions/core/movement.js qui :
1. Extrait la logique pure de moveToTile, stopMovement, updateMovementProgress
2. Retourne des objets de transformation au lieu de mutations
3. Ajoute validation et gestion d'erreurs
4. Permet l'utilisation par Bot et Player
5. Inspire-toi du pattern "Actions de Mouvement Proposées" dans actions-comparison.md
```

#### Étape 1.2 : Autres Actions Core
```
Crée en parallèle :
- src/shared/actions/core/inventory.js (basé sur resourceSlice)
- src/shared/actions/core/fuel.js (basé sur fuelSlice)  
- src/shared/actions/core/vehicle.js (basé sur vehicleSlice)

Chaque fichier doit suivre le même pattern que movement.js
```

#### Étape 1.3 : Tests des Actions Core
```
Crée des tests unitaires pour movement.js qui vérifient :
- Les fonctions sont pures (mêmes inputs = mêmes outputs)
- Gestion correcte des cas d'erreur
- Transformations d'état correctes
- Utilise Vitest comme framework de test
```

### Phase 2 : Hook Player Unifié (Semaine 2)
**Objectif :** Interface unifiée pour les players existants

#### Étape 2.1 : Créer usePlayer Hook
```
Contexte : Unifier l'interface Player/Bot
Objectif : Même API publique, implémentation différente
Contrainte : Pas de breaking changes pour les composants existants

Crée src/hooks/usePlayer.js qui :
1. Utilise usePlayerStore en interne
2. Expose les mêmes méthodes que useBotMachine (actions.moveTo, etc.)
3. Utilise les actions core partagées de src/shared/actions/core/
4. Maintient la compatibilité avec Fleet.jsx et ShipMovement.jsx
5. Inspire-toi de la section "Hook Player Unifié" dans fsm-optimized-architecture.md
```

#### Étape 2.2 : Adapter les Composants Existants
```
Refactorise Fleet.jsx pour utiliser le nouveau usePlayer hook :
- Remplace les appels directs à usePlayerStore
- Utilise la nouvelle interface actions.*
- Garde l'interface utilisateur identique
- Assure-toi qu'aucun breaking change n'est introduit
```

### Phase 3 : Machine FSM Simple (Semaine 3)
**Objectif :** FSM minimale qui fonctionne avec l'existant

#### Étape 3.1 : Installation
```bash
npm install robot3
```

#### Étape 3.2 : Machine FSM de Base
```
Contexte : Remplacer le système BotStore complexe
Objectif : FSM simple avec robot3
Contrainte : Réutiliser BotConditions et actions existantes

Crée src/ai/fsm/machine/simpleBotMachine.js qui :
1. Utilise uniquement 3 états : IDLE, EXPLORING, COLLECTING
2. Intègre les guards de BotConditions.js (isLowFuel, hasKnownResources, etc.)
3. Utilise les actions core de src/shared/actions/core/
4. Maintient un contexte compatible avec la structure Player
5. Base-toi sur la section "Machine Principale" dans fsm-optimized-architecture.md
```

#### Étape 3.3 : Hook useBotMachine Simple
```
Crée src/ai/fsm/hooks/useBotMachine.js qui :
1. Utilise la simpleBotMachine
2. Expose la même interface que usePlayer (actions.moveTo, etc.)
3. Utilise les actions partagées de src/shared/actions/core/
4. Permet l'interopérabilité avec les composants Player
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

### Phase 5 : Interface Unifiée (Semaine 5)
**Objectif :** Interface de debug et contrôle commune

#### Étape 5.1 : Composants Unifiés
```
Crée src/components/unified/PlayerController.jsx qui :
1. Affiche et contrôle indifféremment un player ou un bot
2. Utilise le pattern de la section "Comparaison d'Usage" dans fsm-optimized-architecture.md
3. Détecte automatiquement le type d'entité (player/bot)
4. Adapte l'interface selon les capacités (manuel vs autonome)
```

#### Étape 5.2 : Debug Panel Unifié
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
- [ ] **Actions resource.js, fuel.js, vehicle.js manquantes**
- [ ] Fonctions pures sans effets de bord
- [ ] **Tests unitaires manquants pour movement.js**
- [ ] Documentation des API

### Phase 2 : Hook Unifié
- [ ] usePlayer hook créé
- [ ] Fleet.jsx migré sans breaking changes
- [ ] Interface identique à l'ancien système
- [ ] Tests de régression passent

### Phase 3 : FSM Simple
- [ ] Machine FSM fonctionnelle
- [ ] useBotMachine hook créé
- [ ] États de base opérationnels
- [ ] Compatibilité avec BotConditions

### Phase 4 : Migration Bot
- [ ] Système parallèle ancien/nouveau
- [ ] MultiBotManager supporte les deux modes
- [ ] Tests comparatifs concluants
- [ ] Performance équivalente

### Phase 5 : Interface Unifiée
- [ ] Interface unifiée créée
- [ ] Debug panel mis à jour
- [ ] Documentation utilisateur
- [ ] Migration complète validée

## 🎯 Avantages de cette Approche

- **Migration sans risque :** L'ancien système reste fonctionnel
- **Validation continue :** Chaque étape est testée
- **Prompts spécifiques :** Contexte clair pour Copilot
- **Réutilisation maximale :** On garde ce qui fonctionne
- **Interface préservée :** Pas de breaking changes


## Architecture Proposée (Sans Store)

```
src/
├── ai/
│   └── fsm/
│       ├── index.js                     # Point d'entrée principal
│       ├── machine/
│       │   ├── botMachine.js           # Définition de la machine principale
│       │   ├── context/
│       │   │   ├── index.js            # Export du contexte initial
│       │   │   ├── initialContext.js   # Création du contexte initial
│       │   │   └── contextHelpers.js   # Utilitaires pour le contexte
│       │   ├── states/
│       │   │   ├── index.js            # Export des constantes d'états
│       │   │   ├── evaluating.js      # État EVALUATING + transitions
│       │   │   ├── exploring.js       # État EXPLORING + transitions
│       │   │   ├── collecting.js      # État COLLECTING + transitions
│       │   │   ├── returning.js       # État RETURNING + transitions
│       │   │   └── idleAtBase.js       # État IDLE_AT_BASE + transitions
│       │   ├── guards/
│       │   │   ├── index.js            # Export de tous les guards
│       │   │   ├── safety.js          # Guards de sécurité (fuel, capacity)
│       │   │   ├── efficiency.js      # Guards d'efficacité (resources)
│       │   │   ├── discovery.js       # Guards d'exploration
│       │   │   └── base.js             # Guards liés à la base
│       │   ├── actions/
│       │   │   ├── index.js            # Export de toutes les actions
│       │   │   ├── exploration.js     # Actions d'exploration
│       │   │   ├── collection.js      # Actions de collecte
│       │   │   ├── navigation.js      # Actions de navigation
│       │   │   ├── assessment.js      # Actions d'évaluation
│       │   │   └── base.js             # Actions à la base
│       │   ├── events/
│       │   │   ├── index.js            # Export des événements
│       │   │   ├── system.js          # Événements système
│       │   │   ├── user.js            # Événements utilisateur
│       │   │   └── emergency.js       # Événements d'urgence
│       │   └── reducers/
│       │       ├── index.js            # Export des réducteurs
│       │       ├── fuel.js             # Gestion du carburant
│       │       ├── inventory.js        # Gestion des ressources
│       │       └── position.js         # Gestion de la position
│       ├── hooks/
│       │   ├── useBotMachine.js        # Hook principal pour la machine
│       │   ├── useBotActions.js        # Hook pour les actions
│       │   └── useBotEvents.js         # Hook pour les événements
│       ├── utils/
│       │   ├── machineHelpers.js       # Utilitaires pour la machine
│       │   ├── stateValidation.js      # Validation des états
│       │   └── debugging.js            # Outils de debug
│       └── types/
│           ├── machine.d.ts            # Types TypeScript (optionnel)
│           └── context.d.ts            # Types pour le contexte
├── shared/
│   └── actions/
│       └── core/
│           ├── index.js                # Export de toutes les actions core
│           ├── movement.js             # Actions de mouvement partagées
│           ├── inventory.js            # Actions d'inventaire partagées
│           ├── fuel.js                 # Actions de carburant partagées
│           └── exploration.js          # Actions d'exploration partagées
├── components/
│   ├── Bot/
│   │   ├── BotController.jsx           # Contrôleur principal du bot
│   │   ├── BotDebugPanel.jsx           # Panel de debug FSM
│   │   ├── BotStateDisplay.jsx         # Affichage d'état
│   │   └── BotActionButtons.jsx        # Boutons d'actions manuelles
│   └── FSM/
│       ├── FSMVisualizer.jsx           # Visualisateur de la machine
│       ├── StateTransitionGraph.jsx    # Graphique des transitions
│       └── ContextInspector.jsx        # Inspecteur du contexte
└── tests/ (optionnel)
    ├── ai/
    │   ├── fsm/
    │   │   ├── machine.test.js          # Tests de la machine
    │   │   ├── guards.test.js           # Tests des guards
    │   │   ├── actions.test.js          # Tests des actions
    │   │   └── integration.test.js      # Tests d'intégration
    │   └── scenarios/
    │       ├── exploration.test.js      # Scénarios d'exploration
    │       ├── collection.test.js       # Scénarios de collecte
    │       └── emergency.test.js        # Scénarios d'urgence
    └── components/
        └── Bot/
            └── BotController.test.jsx
```