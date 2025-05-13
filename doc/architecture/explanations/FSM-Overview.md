# Vue d'ensemble de la Machine à États Finis (FSM) du Bot

## Introduction

La Machine à États Finis (Finite State Machine - FSM) est le cerveau du Bot, lui permettant de prendre des décisions autonomes et d'interagir avec l'environnement de manière structurée. Cette documentation fournit une vue d'ensemble de l'architecture FSM et explique comment elle contrôle le comportement du Bot.

## Principes fondamentaux

### Machine à États Finis

Une Machine à États Finis est un modèle mathématique utilisé pour représenter des systèmes de contrôle. Elle est composée de :

- **États** : Situations mutuellement exclusives dans lesquelles le système peut se trouver
- **Transitions** : Règles qui définissent quand et comment passer d'un état à un autre
- **Actions** : Comportements spécifiques exécutés dans un état ou lors d'une transition

### Notre implémentation

Notre implémentation de FSM inclut des améliorations spécifiques :

1. **Architecture centrée sur IDLE** : Toutes les décisions sont centralisées dans l'état IDLE
2. **File d'actions prioritaires** : Permet une gestion flexible des actions à exécuter
3. **Séparation claire entre états et actions** : Améliore la modularité et la maintenabilité

## États principaux

Notre FSM comprend quatre états principaux :

| État | Description |
|------|-------------|
| **IDLE** | État d'attente et d'évaluation des conditions |
| **EXPLORING** | Recherche active de ressources dans l'environnement |
| **COLLECTING** | Collecte de ressources découvertes |
| **RETURNING** | Retour à la base pour ravitaillement |

## Flux d'exécution

Le flux d'exécution général suit ce modèle :

```
+--------+
| DÉBUT  |
+---+----+
    |
    v
+--------+
|  IDLE  |<-----------------+
+---+----+                  |
    |                       |
    | (évaluation)          |
    v                       |
+--------+                  |
| Choisir|                  |
|  État  |                  |
+---+----+                  |
    |                       |
    v                       |
+--------+                  |
| État   |                  |
| Actif  +------------------+
+--------+  (action terminée)
```

## Avantages du système

1. **Prévisibilité** : Comportement cohérent et déterministe du Bot
2. **Extensibilité** : Facile d'ajouter de nouveaux états ou actions
3. **Maintenabilité** : Structure claire et modulaire
4. **Débogage** : État actuel et transitions sont facilement traçables

## Prise de décision

La prise de décision dans notre FSM est basée sur :

- **Conditions environnementales** : Niveau de carburant, ressources disponibles
- **Mémoire du Bot** : Ressources connues, expériences passées
- **Priorités** : Sécurité (carburant), efficacité (collecte), exploration

## File d'attente des actions prioritaires

Notre système utilise une file d'actions avec quatre niveaux de priorité :

1. **URGENT** (P4) : Actions critiques (comme éviter un danger)
2. **HIGH** (P3) : Actions importantes (comme retourner à la base quand le carburant est bas)
3. **MEDIUM** (P2) : Actions standard (comme collecter une ressource)
4. **LOW** (P1) : Actions secondaires (comme explorer une zone)

## Schéma conceptuel

```
        +---------------+
        |  File d'Actions  |
        +-------+---------+
                |
                v
+-------+    +-------+    +-------+    +-------+
|       |    |       |    |       |    |       |
| IDLE  +--->|EXPLORE+--->|COLLECT+--->|RETURN |
|       |    |       |    |       |    |       |
+-------+    +-------+    +-------+    +-------+
    ^                                      |
    |                                      |
    +--------------------------------------+
```

## Implémentation

L'implémentation de notre FSM est répartie en plusieurs modules :

- `botConstants.js` : Définition des états et priorités
- `botStates.js` : Configuration des états et des actions par défaut
- `botConditions.js` : Logique de transition entre les états
- `botActions.js` : Registre des actions disponibles
- Actions individuelles : Implémentation des comportements spécifiques

## Conclusion

Notre FSM fournit une fondation solide pour le comportement autonome du Bot. Sa conception centralisée autour de l'état IDLE et sa gestion prioritaire des actions permettent un comportement à la fois réactif, prévisible et facilement extensible.

Pour plus de détails sur les composants spécifiques, consultez les autres documents de cette documentation.
