# Vue d'ensemble de la Machine à États Finis (FSM) du Bot

## Introduction

La Machine à États Finis (Finite State Machine - FSM) est le cerveau du Bot, lui permettant de prendre des décisions autonomes et d'interagir avec l'environnement de manière structurée. Cette documentation fournit une vue d'ensemble de l'architecture FSM actuelle et explique comment elle contrôle le comportement du Bot.

## Principes fondamentaux

### Machine à États Finis

Une Machine à États Finis est un modèle mathématique utilisé pour représenter des systèmes de contrôle. Elle est composée de :

- **États** : Situations mutuellement exclusives dans lesquelles le système peut se trouver
- **Transitions** : Règles qui définissent quand et comment passer d'un état à un autre
- **Actions** : Comportements spécifiques exécutés dans un état ou lors d'une transition

### Notre implémentation

Notre implémentation de FSM inclut des améliorations spécifiques :

1. **Architecture centrée sur IDLE** : Toutes les décisions sont centralisées dans l'état IDLE
2. **File d'actions prioritaires** : Permet une gestion flexible des actions à exécuter par niveau d'importance
3. **Séparation claire entre états et actions** : Améliore la modularité et la maintenabilité
4. **Actions indépendantes** : Chaque action est encapsulée dans son propre module

## États principaux

Notre FSM comprend quatre états principaux :

| État | Description |
|------|-------------|
| **IDLE** | État central d'évaluation des conditions, détermine le prochain état |
| **EXPLORING** | Recherche active de ressources via drone ou déplacement aléatoire |
| **COLLECTING** | Navigation vers les ressources connues et collecte |
| **RETURNING** | Retour à la base pour ravitaillement et transfert des ressources au score |

## Flux d'exécution

Le flux d'exécution général suit ce modèle centralisé autour de l'état IDLE :

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
    | (evaluateIdle)        |
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

Chaque cycle de la FSM suit ces étapes :
1. Vérification des conditions de sortie d'état (`checkStateExitConditions`)
2. Si la file est vide, ajout de l'action par défaut selon l'état courant
3. Exécution de l'action la plus prioritaire de la file
4. Retour à l'état IDLE une fois l'action complétée

## Avantages du système

1. **Prévisibilité** : Comportement cohérent et déterministe du Bot
2. **Extensibilité** : Facile d'ajouter de nouveaux états ou actions
3. **Maintenabilité** : Structure claire et modulaire
4. **Débogage** : État actuel, transitions et actions sont facilement traçables via le système de journalisation

## Prise de décision

La prise de décision dans notre FSM est basée sur des priorités hiérarchiques :

1. **Sécurité** (P4) : Niveau de carburant critique, évitement des dangers
2. **Capacité** (P3) : Gestion de la capacité de stockage (retour si plein)
3. **Efficacité** (P2) : Collecte des ressources connues
4. **Découverte** (P1) : Exploration de nouvelles zones

## File d'attente des actions prioritaires

Notre système utilise une file d'actions avec quatre niveaux de priorité définis dans `PRIORITY` :

1. **URGENT** (P4) : Actions critiques (ex: éviter un danger)
2. **HIGH** (P3) : Actions importantes (ex: retourner à la base quand le carburant est bas)
3. **MEDIUM** (P2) : Actions standard (ex: collecter une ressource)
4. **LOW** (P1) : Actions secondaires (ex: explorer une zone)

Les actions de priorité supérieure sont toujours exécutées avant celles de priorité inférieure.

## Schéma conceptuel

```
        +------------------+
        | File d'Actions   |
        | URGENT  (P4)     |
        | HIGH    (P3)     |
        | MEDIUM  (P2)     |
        | LOW     (P1)     |
        +--------+---------+
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

- `botConstants.js` : Définition des états, priorités et statuts d'action
- `botStates.js` : Configuration des états et de leurs actions par défaut 
- `botConditions.js` : Logique de transition entre les états et conditions d'évaluation
- `botActions.js` : Registre centralisé des actions disponibles
- Actions individuelles : Implémentations modulaires des comportements spécifiques
- `fsmLogger.js` : Système avancé de journalisation pour le débogage

## Conclusion

Notre FSM fournit une fondation solide pour le comportement autonome du Bot. Sa conception centralisée autour de l'état IDLE et sa gestion prioritaire des actions permettent un comportement à la fois réactif, prévisible et facilement extensible. La structure modulaire facilite l'évolution du système et l'ajout de nouveaux comportements.

Pour plus de détails sur les composants spécifiques, consultez les autres documents de cette documentation.
