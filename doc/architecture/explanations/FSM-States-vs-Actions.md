# États vs Actions dans notre FSM

Ce document explique la distinction fondamentale entre les **états** et les **actions** dans notre implémentation de Machine à États Finis (FSM) pour le Bot.

## Définitions

### États (States)

Un **état** représente une _situation_ ou un _mode_ dans lequel se trouve le Bot. Les états définissent le contexte général de comportement et sont mutuellement exclusifs (le Bot ne peut être que dans un seul état à la fois).

**Exemples d'états :**
- `IDLE`: État d'attente et d'évaluation
- `EXPLORING`: En exploration du terrain
- `COLLECTING`: En collecte de ressources
- `RETURNING`: En retour vers la base

### Actions (Actions)

Une **action** représente une _tâche spécifique_ que le Bot exécute. Les actions sont concrètes, peuvent prendre du temps et peuvent échouer ou réussir. Une action s'exécute généralement dans le contexte d'un état.

**Exemples d'actions :**
- `exploreWithDroneAction`: Explorer une zone avec le drone
- `moveToRandomTileAction`: Se déplacer vers une tuile aléatoire
- `collectResourceAction`: Collecter des ressources
- `returnToBaseAction`: Retourner à la base

## Relation entre États et Actions

### 1. États comme Contextes, Actions comme Comportements

- Un **état** définit _quels types d'actions_ sont appropriés
- Une **action** définit _comment exécuter_ un comportement spécifique

### 2. Hiérarchie Conceptuelle

```
État (EXPLORING)
  ├── Action par défaut (exploreWithDroneAction)
  └── Actions alternatives (moveToRandomTileAction)
```

### 3. Cycle de Vie

1. Le Bot entre dans un **état**
2. L'état détermine quelle **action** exécuter
3. L'**action** s'exécute jusqu'à son terme (succès ou échec)
4. Quand l'action est terminée, le Bot retourne à l'état **IDLE**
5. L'état **IDLE** évalue les conditions et décide du prochain **état**

## Différences Fondamentales

| **États** | **Actions** |
|-----------|-------------|
| Nombre limité et prédéfini | Extensibles et modulaires |
| Représentent une situation | Représentent un comportement concret |
| Définissent un contexte | Implémentent une logique spécifique |
| Persistent jusqu'à une transition | Ont une durée d'exécution définie |
| Mutuellement exclusifs | Peuvent être mises en file d'attente |

## Implémentation dans le Code

### États (dans `botStates.js`)

```javascript
export const BotStateConfig = {
  [BOT_STATES.EXPLORING]: {
    description: "Bot en exploration",
    defaultAction: { type: 'exploreWithDrone', priority: PRIORITY.MEDIUM },
    onEnterState: (playerStore) => {
      console.log("[BotState] Entering EXPLORING state");
    }
  }
}
```

### Actions (comme `exploreWithDroneAction.js`)

```javascript
export const exploreWithDroneAction = (playerStore, tileStore, addAction, changeState) => {
  // Logique pour explorer avec le drone
  
  if (/* action terminée */) {
    // Retourner à IDLE pour décider du prochain état
    changeState(BOT_STATES.IDLE);
    return true;
  }
  
  return undefined; // Action toujours en cours
}
```

## Avantages de cette Séparation

1. **Modularité**: Nouvelles actions facilement ajoutables sans modifier les états
2. **Clarté conceptuelle**: Distinction claire entre "où je suis" (état) et "ce que je fais" (action)
3. **Centralisation de la décision**: Toute la logique de transition est dans IDLE
4. **Réutilisabilité**: Les actions peuvent être réutilisées dans différents contextes

## Conclusion

Dans notre architecture FSM, les états et les actions jouent des rôles complémentaires mais distincts. Comprendre cette séparation est essentiel pour maintenir et étendre le système de manière cohérente et modulaire.