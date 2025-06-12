# Guide du Système d'États FSM

## Introduction

Ce document explique le système d'états pour l'architecture de la Machine à États Finis (FSM).
Les états définissent les comportements possibles du bot et les transitions entre ces comportements.

## Structure des États

Les états sont organisés selon les comportements principaux du bot :

1. **État d'Évaluation** (`evaluatingState.js`) - État central pour l'analyse de situation et la prise de décision
2. **État d'Exploration** (`exploringState.js`) - Recherche de nouvelles ressources dans l'environnement
3. **État de Collecte** (`collectingState.js`) - Collecte des ressources découvertes
4. **État de Retour** (`returningState.js`) - Retour à la base pour ravitaillement/déchargement
5. **État d'Inactivité à la Base** (`idleAtBaseState.js`) - Maintenance et attente à la base
6. **Index** (`index.js`) - Exports centralisés et constantes

## Comment Utiliser les États

### Structure d'un État

Chaque fichier d'état suit une structure similaire :

```javascript
import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';
import { RESOURCE_EVENT_TYPES } from '../events/resourceEvents.js';
import { contextReducers } from '../reducers/context.js';
import { discoveryGuards } from '../guards/discovery.js';

/**
 * État COLLECTING - Collecte de ressources
 */
export const collectingState = state(
  // Transitions vers d'autres états basées sur des événements
  transition(RESOURCE_EVENT_TYPES.RESOURCE_COLLECTED,
    BOT_STATES.EVALUATING,
    (context, event) => discoveryGuards.isResourceCollectionComplete(context, event),
    reduce((context, event) => contextReducers.resources.updateInventory(context, event))
  ),
  
  // Autre transition...
  transition(EMERGENCY_EVENT_TYPES.LOW_FUEL_DETECTED,
    BOT_STATES.RETURNING,
    (context, event) => safetyGuards.isFuelCritical(context, event),
    reduce((context, event) => contextReducers.state.prepareReturning(context, { reason: 'low_fuel' }))
  )
);
```

### Transitions

Les transitions définissent comment le système passe d'un état à un autre:

1. **Événement** - Le déclencheur de la transition (ex: `RESOURCE_COLLECTED`)
2. **État cible** - L'état vers lequel transitionner (ex: `BOT_STATES.EVALUATING`)
3. **Garde** - Fonction qui détermine si la transition est autorisée
4. **Réducteur** - Fonction qui met à jour le contexte lors de la transition

### Utilisation dans le machineFactory

Le machine factory incorpore tous les états pour créer la FSM complète:

```javascript
import { createMachine } from 'robot3';
import { BOT_STATES } from './states/index.js';
import { 
  evaluatingState,
  exploringState,
  collectingState,
  returningState,
  idleAtBaseState 
} from './states/index.js';

export const createBotMachine = (botId, initialData = {}) => {
  return createMachine(
    BOT_STATES.EVALUATING,  // État initial
    {
      // Mapper les noms d'états à leur configuration
      [BOT_STATES.EVALUATING]: evaluatingState,
      // [BOT_STATES.EXPLORING]: exploringState, // ❌ REMOVED - use specific sub-states
      [BOT_STATES.EXPLORING_DEPLOYING]: exploringState,
      [BOT_STATES.EXPLORING_PROSPECTING]: exploringState,
      [BOT_STATES.EXPLORING_RETURNING]: exploringState,
      [BOT_STATES.COLLECTING]: collectingState,
      [BOT_STATES.IDLE_AT_BASE]: idleAtBaseState,
    },
    // Fonction de création du contexte initial
    () => createEntityContext(botId, initialData)
  );
};
```

## États Disponibles

### 1. EVALUATING ✅ ACTIF
État central qui analyse la situation et décide de l'action suivante.
- **Entrées**: Depuis n'importe quel autre état, ou au démarrage
- **Sorties**: Vers EXPLORING_DEPLOYING, EXPLORING_RETURNING, ou IDLE_AT_BASE
- **Événements clés**: `EVALUATION_COMPLETE`, `AUTO`
- **Usage**: 100% - État toujours actif, point central de décision

### 2. EXPLORING ✅ ACTIF (3 sous-états)
État de recherche et découverte de ressources avec 3 phases distinctes.

#### 2.1 EXPLORING_DEPLOYING
- **Fonction**: Déploiement initial du drone d'exploration
- **Entrées**: Depuis EVALUATING (quand hasUnexploredAreas = true)
- **Sorties**: Vers EXPLORING_PROSPECTING (quand drone atteint cible)
- **Événements clés**: `DRONE_REACHED_TARGET`

#### 2.2 EXPLORING_PROSPECTING  
- **Fonction**: Phase de prospection et analyse des ressources
- **Entrées**: Depuis EXPLORING_DEPLOYING
- **Sorties**: Vers EXPLORING_RETURNING (quand prospection terminée)
- **Événements clés**: `PROSPECTING_COMPLETE`

#### 2.3 EXPLORING_RETURNING
- **Fonction**: Retour à la base avec les données d'exploration
- **Entrées**: Depuis EXPLORING_PROSPECTING
- **Sorties**: Vers IDLE_AT_BASE (quand base atteinte)
- **Événements clés**: `BASE_REACHED`, `MOVEMENT_STARTED`, `MOVEMENT_PROGRESS`
- **⚠️ PROBLÈME CONNU**: Le bot peut rester bloqué ici si BASE_REACHED ne se déclenche pas

### 3. COLLECTING ❌ NON UTILISÉ
État de collecte et d'extraction des ressources.
- **Statut**: Disponible mais jamais utilisé en pratique
- **Raison**: Le flux de collection de ressources n'est pas implémenté
- **Recommandation**: Peut être commenté pour nettoyer le code

### 4. RETURNING ❌ SUPPRIMÉ
État de retour classique - Remplacé par EXPLORING_RETURNING.
- **Statut**: Supprimé lors de la consolidation
- **Remplacement**: La logique est maintenant dans exploring.js (EXPLORING_RETURNING)

### 5. IDLE_AT_BASE ✅ ACTIF
État de ravitaillement et maintenance à la base.
- **Entrées**: Depuis EXPLORING_RETURNING (quand BASE_REACHED)
- **Sorties**: Vers EVALUATING (après maintenance)
- **Événements clés**: `REFUEL_COMPLETE`, `UNLOAD_COMPLETE`, `MAINTENANCE_COMPLETE`
- **Usage**: 60% - Fonctionne quand le bot arrive à la base

## Bonnes Pratiques

1. **Séparation des préoccupations** - Chaque état gère un ensemble cohérent de comportements
2. **Gardes explicites** - Utilisez des gardes clairs pour les conditions de transition  
3. **Réducteurs atomiques** - Les réducteurs doivent effectuer des transformations simples du contexte
4. **Priorité de transitions** - Ordonnez les transitions par priorité (urgences d'abord)
5. **Documentation** - Documentez clairement le but de chaque état et ses transitions

## Flux d'Exécution Observé

**Flux Normal (Fonctionne)**:
```
[*] → EVALUATING → EXPLORING_DEPLOYING → EXPLORING_PROSPECTING → EXPLORING_RETURNING → (BLOQUÉ)
```

**Flux Attendu (Avec correction)**:
```
[*] → EVALUATING → EXPLORING_DEPLOYING → EXPLORING_PROSPECTING → EXPLORING_RETURNING → IDLE_AT_BASE → EVALUATING
```

## Problèmes Identifiés

### ⚠️ Bot Bloqué dans EXPLORING_RETURNING
- **Symptôme**: Le bot reste indéfiniment dans l'état exploring_returning
- **Cause**: L'événement BASE_REACHED ne se déclenche jamais
- **Impact**: Cycle d'exploration incomplet
- **Solution**: Ajouter un mécanisme de timeout (30 secondes)

### ❌ États Non Utilisés
- **COLLECTING**: Logique de collection non implémentée
- **RETURNING**: Remplacé par EXPLORING_RETURNING
- **Recommandation**: Commenter ces états pour nettoyer le code

## Événements Principaux

### ✅ Événements Utilisés
- `EVALUATION_COMPLETE`: Fin d'évaluation → transition vers exploration
- `AUTO`: Déclenchement automatique périodique  
- `DRONE_REACHED_TARGET`: Drone arrivé → passage en prospection
- `PROSPECTING_COMPLETE`: Prospection terminée → retour base
- `MOVEMENT_STARTED/PROGRESS`: Suivi de mouvement

### ❌ Événements Non Utilisés
- `RESOURCE_COLLECTED`: Collection de ressources (non implémentée)
- `INVENTORY_FULL`: Inventaire plein (non utilisé)
- `BASE_REACHED`: Arrivée base (problématique - ne se déclenche pas)
- `REFUEL_COMPLETE/UNLOAD_COMPLETE`: Maintenance base (disponible mais peu utilisé)
