# Bot FSM Documentation

Ce dossier contient la documentation complète pour la Machine à États Finis (FSM) du Bot.

## Structure de la documentation

- **Architecture** : Diagrammes et explications détaillées de l'architecture FSM
  - *Diagrammes* : Représentations visuelles de la FSM
  - *Explications* : Documentation conceptuelle sur le fonctionnement de la FSM

- **Guides** : Instructions pour le développement et l'implémentation
  - *Développement* : Comment étendre et faire évoluer la FSM
  - *Implémentation* : Comment implémenter de nouvelles fonctionnalités

- **Exemples** : Cas pratiques et scénarios d'utilisation de la FSM

- **Logs** : Journaux de débogage et historique des exécutions

## Concepts clés

La FSM du Bot est basée sur quatre états principaux :
- **IDLE** : État d'attente et d'évaluation
- **EXPLORING** : Recherche de ressources
- **COLLECTING** : Collecte des ressources découvertes
- **RETURNING** : Retour à la base pour ravitaillement

La FSM utilise une file d'actions prioritaires pour gérer les tâches à exécuter.

## Flux de travail de la FSM

```
+--------+     évalue     +------------+
|  IDLE  |--------------->|  EXPLORING |
+--------+                +------------+
    ^                          |
    |                          | découvre des
    |                          | ressources
    |                          v
    |                    +------------+
    |                    | COLLECTING |
    |                    +------------+
    |                          |
    |  ravitaillement          | capacité max ou
    |  terminé                 | carburant bas
    |                          v
    |                    +------------+
    +--------------------| RETURNING  |
                         +------------+
```

## Implémentation actuelle

L'implémentation actuelle utilise une architecture centralisée autour de l'état IDLE :
1. Toutes les actions retournent à l'état IDLE une fois terminées
2. L'état IDLE évalue les conditions et transite vers l'état approprié
3. Les actions prioritaires sont gérées par une file d'attente

Pour plus d'informations, consultez les diagrammes et explications dans le dossier d'architecture.