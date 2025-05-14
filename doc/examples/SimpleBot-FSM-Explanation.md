# Explication du SimpleBot FSM avec File d'Actions Prioritaires

## Les Différentes Couches de Logique

1. **États (States)** : Représentent la "situation générale" du bot (IDLE, EXPLORING, RETURNING)
2. **Actions** : Tâches concrètes à effectuer, placées dans une file d'attente (move, returnToBase, refuel)
3. **Fonctions** : Implémentations techniques qui exécutent les actions (moveToRandomTile, returnToBase, refuelAtBase)

## Scénario Initial du Bot (Pas à Pas)

### 1. Démarrage du Bot

```javascript
// L'utilisateur active le bot
toggleBotProcessing() // Passe isRunning à true
```

### 2. Premier Cycle

```javascript
// Dans processBot()
checkConditions() // Vérifie si des conditions nécessitent un changement d'état
// -> Carburant > 50%, aucun changement

// File d'actions vide, on en ajoute selon l'état actuel (EXPLORING)
addAction('move', PRIORITY.LOW) // Ajoute une action de mouvement aléatoire

// Exécute l'action la plus prioritaire (la seule dans la file)
executeNextAction() // Prend l'action 'move' et appelle moveToRandomTile()
```

### 3. Exploration Continue

```javascript
// Le bot continue à explorer, ajoutant des actions 'move' et les exécutant
// À chaque cycle de processBot():
checkConditions() // Toujours carburant > 50%
// Si file vide, ajouter 'move'
executeNextAction() // Déplace vers une tuile aléatoire
```

### 4. Déclenchement de la Condition de Carburant Bas

```javascript
// Le carburant passe sous 50%
checkConditions() // Détecte carburant < 50%
changeState(BOT_STATES.RETURNING) // Change l'état en RETURNING
addAction('returnToBase', PRIORITY.HIGH) // Ajoute une action prioritaire de retour à la base

// À ce stade, la file peut contenir:
// 1. 'returnToBase' (priorité HIGH)
// 2. 'move' (priorité LOW) - si déjà planifiée

// Au prochain executeNextAction(), c'est 'returnToBase' qui sera exécutée en premier
// car elle a une priorité plus élevée
```

### 5. Retour à la Base

```javascript
executeNextAction() // Exécute 'returnToBase', appelle la fonction returnToBase()
// Le bot commence à naviguer vers sa base
```

### 6. Arrivée à la Base

```javascript
// Lorsque le bot arrive à la base:
returnToBase() // Détecte qu'on est à la base
addAction('refuel', PRIORITY.MEDIUM) // Ajoute automatiquement une action de ravitaillement

// Au prochain cycle:
executeNextAction() // Exécute 'refuel', appelle refuelAtBase()
// Le bot se ravitaille

// Quand le carburant atteint 100%:
refuelAtBase() // Détecte carburant plein
transferResourcesToScore() // Transfère les ressources
changeState(BOT_STATES.EXPLORING) // Revient à l'état EXPLORING
addAction('move', PRIORITY.MEDIUM) // Planifie une nouvelle exploration
```

## Clarifications Importantes

### 1. Distinction États vs. Actions

- **États**: Définissent le "mode de fonctionnement" général (que dois-je faire globalement?)
  - EXPLORING: "Je dois explorer la carte"
  - RETURNING: "Je dois retourner à ma base"
  
- **Actions**: Tâches spécifiques à accomplir (comment le faire concrètement?)
  - 'move': Déplacement vers une tuile spécifique
  - 'returnToBase': Navigation vers la base
  - 'refuel': Ravitaillement à la base

### 2. Pourquoi Avoir les Deux?

Les états guident la "stratégie" globale, tandis que les actions sont les "tactiques" concrètes.

- Un état (ex: RETURNING) peut nécessiter plusieurs actions successives ('returnToBase', puis 'refuel')
- Des actions urgentes peuvent être insérées sans changer d'état (ex: éviter un danger)
- Les états permettent une lecture "haut niveau" de ce que fait le bot

### 3. Flux de Décision

1. **Conditions** vérifient si un changement d'état est nécessaire
2. **États** déterminent quelles actions ajouter si la file est vide
3. **Priorité des actions** décide quelle action exécuter ensuite
4. **Fonctions d'exécution** réalisent concrètement les actions

## Schéma du Flux de Fonctionnement

```
processBot()
    |
    +--> checkConditions() [Vérifie si changement d'état requis]
    |        |
    |        +--> Si carburant < 50% --> changeState(RETURNING) + addAction('returnToBase', HIGH)
    |
    +--> Si file vide --> Ajouter action selon état actuel
    |        |
    |        +--> Si IDLE --> Ne rien faire
    |        +--> Si EXPLORING --> addAction('move', LOW)
    |        +--> Si RETURNING --> addAction('returnToBase', HIGH)
    |
    +--> executeNextAction() [Exécute l'action prioritaire]
             |
             +--> Action 'move' --> moveToRandomTile()
             +--> Action 'returnToBase' --> returnToBase()
             +--> Action 'refuel' --> refuelAtBase()
```

Cette structure à plusieurs niveaux permet d'avoir un bot qui:
1. Prend des décisions stratégiques (états)
2. Gère des priorités tactiques (file d'actions)
3. Exécute des comportements spécifiques (fonctions d'action)

C'est comme un humain qui décide "Je dois rentrer chez moi" (état), planifie "Je dois d'abord aller à la gare, puis prendre le train" (actions), et exécute chaque étape (fonctions).