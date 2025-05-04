# Relation entre États et Actions dans une FSM

## Question fréquente

> "Pourquoi, dans `checkConditions`, engage-t-on une action alors que l'on vient de changer l'état ?"
> ```javascript
> get().changeState(BOT_STATES.RETURNING);
> get().addAction('returnToBase', PRIORITY.HIGH);
> ```

Cette question touche à un aspect fondamental de notre implémentation de machine à états finis (FSM) avec file d'actions prioritaires.

## Explication

### 1. Les états et les actions ont des rôles différents

- **État** : Représente le mode opératoire général du bot. C'est une *intention* ou une *stratégie*.
- **Action** : Représente une tâche concrète que le bot doit exécuter. C'est une *implémentation* ou une *tactique*.

### 2. Changer d'état ne produit pas d'action automatiquement

Lorsque nous appelons `changeState()`, nous modifions simplement une valeur dans notre store (par exemple de `EXPLORING` à `RETURNING`). Cette opération est instantanée et ne déclenche aucun comportement concret par elle-même.

Le changement d'état est comme changer d'avis ou de stratégie : "Je ne devrais plus explorer, je devrais retourner à la base." Mais cela n'implique pas automatiquement que vous commencez à marcher.

### 3. Les actions matérialisent les comportements associés aux états

Après avoir changé d'état, nous devons planifier l'action concrète qui correspond à ce nouvel état. Par exemple :
- Pour l'état `RETURNING`, nous avons besoin de l'action `returnToBase`
- Pour l'état `EXPLORING`, nous avons besoin de l'action `move`

### 4. Pourquoi les séparer ?

Cette séparation offre plusieurs avantages :

1. **Flexibilité** : Un état peut nécessiter plusieurs actions successives
2. **Priorités** : Les actions peuvent avoir différentes priorités selon le contexte
3. **Interruptions** : Des actions de haute priorité peuvent s'insérer sans changer d'état

### 5. Exemple concret

Imaginons que notre bot soit en exploration et détecte que son carburant est bas :

```javascript
// Condition détectée : carburant bas pendant l'exploration
if (currentState === BOT_STATES.EXPLORING && botVehicle.fuel < 50) {
  // 1. Changer d'état (intention) : "Je dois retourner à la base"
  get().changeState(BOT_STATES.RETURNING);
  
  // 2. Planifier l'action concrète avec priorité haute
  get().addAction('returnToBase', PRIORITY.HIGH);
}
```

Si plus tard, alors que le bot est en état `RETURNING`, il découvre qu'il a besoin de contourner un obstacle, il pourrait ajouter une action `avoidObstacle` de priorité URGENT sans changer d'état, car son intention générale reste de retourner à la base.

## Alternative : Actions générées automatiquement par l'état

Une approche alternative serait de générer automatiquement des actions chaque fois que l'état change. Par exemple :

```javascript
const changeState = (newState) => {
  set({ botState: newState });
  
  // Générer automatiquement des actions selon le nouvel état
  switch(newState) {
    case BOT_STATES.RETURNING:
      get().addAction('returnToBase', PRIORITY.HIGH);
      break;
    case BOT_STATES.EXPLORING:
      get().addAction('move', PRIORITY.LOW);
      break;
  }
};
```

Cette approche est plus simple mais moins flexible car elle ne permet pas de personnaliser les actions en fonction du contexte qui a déclenché le changement d'état.

## Conclusion

La séparation entre changement d'état et ajout d'action n'est pas redondante mais intentionnelle. Elle permet une plus grande flexibilité dans la gestion des comportements du bot et sépare clairement l'intention stratégique (état) de l'exécution tactique (actions).

Cette architecture est particulièrement utile lorsque le système devient plus complexe avec des priorités variables et des interruptions possibles entre les différentes actions.