# Bot FSM Documentation

Ce dossier contient la documentation complète pour la Machine à États Finis (FSM) du Bot.

## Structure de la documentation

- **Architecture** : Diagrammes et explications détaillées de l'architecture FSM
  - *Diagrammes* : Représentations visuelles de la FSM
  - *Explications* : Documentation conceptuelle sur le fonctionnement de la FSM
    - [Vue d'ensemble de la FSM](architecture/explanations/FSM-Overview.md)
    - [États vs Actions](architecture/explanations/FSM-States-vs-Actions.md)
    - [Architecture centrée sur IDLE](architecture/explanations/IDLE-Centered-Architecture.md)
    - [Système de communication des drones](architecture/explanations/Drone-Communication-System.md) *(NOUVEAU)*
  - *Références* : Documentation technique des composants du système
    - [Référence des éléments FSM](architecture/references/FSM-Elements-Reference.md)
    - [Analyse des références aux IDs](architecture/references/ID-References-Analysis.md)
    - [Système de drones](architecture/references/Drone-System-Reference.md) *(NOUVEAU)*

- **Guides** : Instructions pour le développement et l'implémentation
  - *Développement* : Comment étendre et faire évoluer la FSM
    - [Guide d'évolution de la FSM](guides/development/FSM-Evolution-Guide.md)
    - [Étapes de migration FSM](guides/development/FSM-Migration-Steps.md)
  - *Implémentation* : Comment implémenter de nouvelles fonctionnalités
    - [Guide d'implémentation des actions](guides/implementation/Action-Implementation-Guide.md)
    - [Guide d'implémentation des états](guides/implementation/State-Implementation-Guide.md)
    - [Guide d'implémentation des drones](guides/implementation/Drone-Implementation-Guide.md) *(NOUVEAU)*
    - [Guide d'intégration des drones au FSM](guides/implementation/Drone-FSM-Integration-Guide.md) *(NOUVEAU)*

- **Exemples** : Cas pratiques et scénarios d'utilisation de la FSM

- **Logs** : Journaux de débogage et historique des exécutions
  - [Journal des modifications](CHANGELOG.md) *(NOUVEAU)*

## Concepts clés

La FSM du Bot est basée sur quatre états principaux :
- **IDLE** : État d'attente et d'évaluation
- **EXPLORING** : Recherche de ressources avec drones spécialisés
- **COLLECTING** : Collecte des ressources découvertes
- **RETURNING** : Retour à la base pour ravitaillement

La FSM utilise une file d'actions prioritaires pour gérer les tâches à exécuter.

### Système de drones

Le projet inclut un système avancé de drones avec trois types spécialisés :
- **Explorer Drone** : Exploration et détection des ressources
- **Combat Drone** : Combat, pose de mines et collecte limitée
- **Special Drone** : Scan avancé et détection d'objets rares

Chaque type de drone possède des caractéristiques uniques, des comportements spécifiques et s'intègre au système FSM.

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