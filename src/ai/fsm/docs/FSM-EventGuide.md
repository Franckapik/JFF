# Guide des Événements FSM

Ce document explique comment les événements sont traités dans le système de Machine à États Finis (FSM).

## Qu'est-ce qu'un événement FSM ?

Un événement est un déclencheur qui peut faire passer la machine d'un état à un autre. Dans notre système FSM, les événements sont envoyés à la machine via la fonction `send` du hook `useBotMachine`.

## Types d'événements principaux

### 1. Événements de contrôle utilisateur

Ces événements sont déclenchés directement par l'utilisateur via les méthodes exposées par le hook `useBotMachine`.

| Événement | Description | Action correspondante |
|-----------|-------------|----------------------|
| `MOVE_TO` | Déplacer le bot vers une position | `actions.moveTo(coord)` |
| `STOP` | Arrêter le mouvement | `actions.stopMovement()` |
| `START_EXPLORING` | Lancer l'exploration | `actions.startExploration()` |
| `START_COLLECTING` | Lancer la collecte | `actions.startCollecting()` |
| `RETURN_TO_BASE` | Retourner à la base | `actions.returnToBase()` |
| `UPDATE_CONTEXT` | Mettre à jour le contexte | `actions.toggleAutonomous()` |

### 2. Événements de progression

Ces événements sont déclenchés automatiquement pendant le fonctionnement du bot, souvent en réponse à un changement dans l'environnement.

| Événement | Description | Déclencheur |
|-----------|-------------|-------------|
| `UPDATE_PROGRESS` | Mise à jour de la progression | Progression du mouvement |
| `RESOURCE_FOUND` | Ressource découverte | Pendant l'exploration |
| `COLLECTION_COMPLETE` | Collecte terminée | Ressource collectée |
| `BASE_REACHED` | Base atteinte | Arrivée à la base |
| `MAINTENANCE_COMPLETE` | Maintenance terminée | Ravitaillement/réparations terminées |

### 3. Événements d'urgence

Ces événements ont une priorité élevée et peuvent interrompre d'autres actions.

| Événement | Description | Condition |
|-----------|-------------|-----------|
| `LOW_FUEL` | Carburant faible | Niveau de carburant sous un seuil |
| `EMERGENCY` | Situation d'urgence | Santé critique, danger, etc. |
| `MANUAL_OVERRIDE` | Intervention manuelle | Action utilisateur |

### 4. Événement AUTO (Réflexion autonome)

L'événement spécial `AUTO` est envoyé périodiquement lorsque le bot est en mode autonome. Il permet à la machine de "réfléchir" et de prendre des décisions en fonction de l'état actuel et du contexte.

## Flux de traitement d'un événement

Quand un événement est envoyé à la machine FSM, voici ce qui se passe:

1. **Vérification des transitions possibles**
   - La machine examine toutes les transitions définies pour l'état actuel

2. **Évaluation des conditions (guards)**
   - Pour chaque transition applicable, les conditions (guards) sont évaluées
   - Si aucune condition n'est satisfaite, la machine reste dans le même état

3. **Sélection de la transition**
   - Si plusieurs transitions sont possibles, la première définie est choisie
   - Les transitions sont évaluées dans l'ordre où elles sont déclarées

4. **Mise à jour du contexte**
   - Le réducteur (reducer) associé à la transition est exécuté
   - Il met à jour le contexte en fonction de l'événement

5. **Changement d'état**
   - La machine passe à l'état cible de la transition
   - Les effets d'entrée de l'état cible sont exécutés

## Exemple de traitement d'événement

Prenons un exemple concret pour illustrer le processus:

```javascript
// État actuel: EXPLORING
// Événement reçu: LOW_FUEL

// Dans l'état EXPLORING, il existe une transition définie:
transition('LOW_FUEL',
  BOT_STATES.RETURNING,          // État cible
  (context) => context.fuel < 20, // Condition (guard)
  reduce((context) => ({         // Réducteur (reducer)
    ...context,
    currentAction: 'returning',
    reason: 'low_fuel',
    lastStateChange: Date.now()
  }))
)
```

Processus:
1. L'événement `LOW_FUEL` est reçu alors que le bot est dans l'état `EXPLORING`
2. La machine trouve la transition pour cet événement
3. La condition `context.fuel < 20` est évaluée
4. Si le carburant est effectivement inférieur à 20:
   - Le réducteur est exécuté pour mettre à jour le contexte
   - L'état change de `EXPLORING` à `RETURNING`
5. Sinon, la machine reste dans l'état `EXPLORING`

## Utilisation dans le code

Dans les composants React, vous envoyez des événements ainsi:

```javascript
// Via les actions prédéfinies
actions.startExploration();  // Envoie l'événement START_EXPLORING

// Ou en utilisant directement send
machine.send('CUSTOM_EVENT', { additionalData: value });
```

## Architecture des événements

Les définitions des états et leurs réactions aux événements se trouvent dans les fichiers:
- `/src/ai/fsm/machine/states/exploring.js`
- `/src/ai/fsm/machine/states/collecting.js`
- `/src/ai/fsm/machine/states/evaluating.js`
- `/src/ai/fsm/machine/states/returning.js`
- `/src/ai/fsm/machine/states/idleAtBase.js`

## Bonnes pratiques

1. **Nommage explicite**
   - Utiliser des noms d'événements clairs et descriptifs (ex: `LOW_FUEL` plutôt que `ERROR_1`)

2. **Conditions précises**
   - Définir des conditions de garde qui vérifient précisément ce qui doit être vérifié

3. **Réducteurs immutables**
   - Toujours traiter le contexte comme immutable pour éviter les effets de bord

4. **Priorités claires**
   - Ranger les transitions par ordre de priorité (les plus critiques en premier)

5. **Événements composés**
   - Éviter de grouper plusieurs changements logiques dans un seul événement
   - Préférer des événements atomiques et composables
