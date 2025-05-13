# Architecture FSM Centrée sur l'État IDLE

## Concept clé

Notre FSM implémente une architecture centrée sur l'état IDLE, où toutes les décisions sont prises dans cet état central :

1. Toute action complétée retourne à l'état IDLE
2. L'état IDLE évalue les conditions et détermine l'état approprié
3. Les états actifs (EXPLORING, COLLECTING, RETURNING) exécutent uniquement des comportements spécifiques

## Avantages de cette architecture

### 1. Centralisation de la logique décisionnelle

Toute la logique de décision est centralisée dans l'état IDLE, simplifiant le raisonnement sur le comportement du bot.

### 2. Réduction des transitions complexes

Dans une FSM traditionnelle, les transitions entre états forment un graphe complexe. Notre architecture réduit cette complexité en imposant que presque toutes les transitions passent par IDLE.

### 3. Clarté du flux de contrôle

Le flux de contrôle devient plus prévisible :
1. Exécuter une action
2. Revenir à IDLE
3. Évaluer les conditions
4. Transition vers un nouvel état

## Implémentation

### État IDLE centralisé

```javascript
[BOT_STATES.IDLE]: {
  description: "Bot en attente d'évaluation des conditions",
  
  // Action par défaut: évaluer les conditions
  defaultAction: { type: 'evaluateIdle', priority: PRIORITY.HIGH },
  
  onEnterState: (playerStore) => {
    console.log("[BotState] Entering IDLE state - Evaluating conditions");
    // Afficher l'état actuel du bot
    const botVehicle = playerStore.players?.player2?.vehicles?.ship;
    console.log(`Bot status: Fuel=${botVehicle?.fuel}, At base=${botVehicle?.coord === botVehicle?.startCoord}`);
  }
}
```

### Actions retournant à IDLE

Toutes les actions doivent se terminer en retournant à IDLE pour réévaluation :

```javascript
// Exemple dans collectResourceAction.js
if (elapsedTime >= collectResourceAction.collectionTime) {
  // Collection terminée...
  
  // Au lieu de prendre des décisions ici, retourner à l'état IDLE
  fsmLogger.action('Collection completed. Returning to IDLE for next action decision.');
  changeState(BOT_STATES.IDLE);
  addAction('evaluateIdle', PRIORITY.HIGH);
  
  // Réinitialiser les variables d'état
  collectResourceAction.reset();
  
  return true; // Action terminée avec succès
}
```

## Diagramme de flux

```
+-----------------+
|                 |
|      IDLE       |<-------------------+
|                 |                    |
+--------+--------+                    |
         |                             |
         | Évaluation des              |
         | conditions                  |
         v                             |
+--------+--------+                    |
|                 |      Action        |
|    État actif   +--------------------+
|                 |     terminée
+-----------------+
```

## Conclusion

Cette architecture centrée sur IDLE offre une approche plus disciplinée et maintenable pour notre FSM. Elle centralise la logique décisionnelle et clarifie le flux de contrôle, simplifiant ainsi le raisonnement sur le comportement du bot et facilitant l'ajout de nouveaux comportements.