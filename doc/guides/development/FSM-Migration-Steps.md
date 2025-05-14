# Guide de Migration: FSM Bot vers Architecture IDLE-Centralisée

Ce document détaille les étapes nécessaires pour migrer la machine à états finis (FSM) actuelle du bot vers une architecture améliorée centralisée autour de l'état IDLE, comme illustré dans le diagramme `BotFSM-Improved-Diagram.puml`.

## Objectifs de la Migration

- Centraliser la logique décisionnelle dans l'état IDLE
- Simplifier les transitions entre états
- Améliorer la lisibilité et la maintenabilité du code
- Clarifier le flux de logique de la FSM

## Étapes de Migration (Segmentées par Prompt)

### Prompt 1: Mise à jour des constantes et configuration des états

**Fichier cible:** `src/ai/constants/botConstants.js`

1. Vérifier que les constantes BOT_STATES contiennent tous les états nécessaires
2. Ajouter des constantes pour les priorités spécifiques à l'état IDLE

**Fichier cible:** `src/ai/fsm/states/botStates.js`

1. Redéfinir le comportement de l'état IDLE:
   - Améliorer `onEnterState` pour analyser les conditions
   - Implémenter une nouvelle fonction d'évaluation des conditions dans IDLE
   - Clarifier la fonction `onExitState` pour déterminer l'état de destination

2. Mettre à jour les actions par défaut pour tous les états
   - Assurer que l'état IDLE a l'action d'évaluation comme action par défaut
   - Vérifier que les autres états ont des actions par défaut appropriées

### Prompt 2: Refactoring du module de conditions

**Fichier cible:** `src/ai/fsm/conditions/botConditions.js`

1. Restructurer le module pour faciliter l'évaluation centralisée
   - Créer des groupes de conditions par état cible
   - Introduire une hiérarchie de priorité claire pour l'évaluation

2. Ajouter de nouvelles conditions pour la centralisation:
   - `shouldStartExploring`: Détermine s'il faut passer de IDLE à EXPLORING
   - `shouldStartCollecting`: Détermine s'il faut passer de IDLE à COLLECTING
   - `shouldReturnToBase`: Détermine s'il faut passer de IDLE à RETURNING

3. Créer une fonction d'évaluation centralisée pour l'état IDLE:
   ```javascript
   evaluateNextState: (botVehicle, playerStore) => {
     // Logique d'évaluation pour déterminer l'état suivant depuis IDLE
   }
   ```

### Prompt 3: Modification des actions du bot

**Fichier cible:** `src/ai/fsm/actions/botActions.js`

1. Ajouter une nouvelle action d'évaluation pour l'état IDLE:
   ```javascript
   evaluateConditionsFromIdle: (playerStore, tileStore, addAction, changeState) => {
     // Logique pour évaluer les conditions et déclencher la transition appropriée
   }
   ```

2. Mettre à jour le comportement des actions existantes:
   - Modifier les actions pour qu'elles retournent à IDLE après achèvement
   - Ajouter des vérifications de conditions finales dans chaque action

3. Ajouter cette action à l'actionMap:
   ```javascript
   actionMap: {
     // Ajouter: 'evaluateIdle': 'evaluateConditionsFromIdle',
     // ...existing actions...
   }
   ```

### Prompt 4: Refactoring du store FSM

**Fichier cible:** `src/stores/useBotStore.js`

1. Mettre à jour la fonction `changeState`:
   - Modifier pour supporter le modèle centralisé
   - Assurer que les transitions passent par IDLE quand approprié

2. Modifier la fonction `checkConditions`:
   - Adapter pour le nouveau modèle d'évaluation centralisé
   - Différencier l'évaluation dans l'état IDLE vs. autres états

3. Réviser la fonction `toggleBotProcessing`:
   - Faire démarrer le bot dans l'état IDLE plutôt que directement en COLLECTING
   - Ajouter une action d'évaluation immédiate lors du démarrage

4. Implémenter une nouvelle fonction `returnToIdle`:
   ```javascript
   returnToIdle: (reason) => {
     // Logique pour retourner à l'état IDLE depuis n'importe quel état
     console.log(`[SimpleBotStore] Returning to IDLE state: ${reason}`);
     get().changeState(BOT_STATES.IDLE);
   }
   ```

### Prompt 5: Tests et Débogages

1. Créer un système de journalisation avancé pour la FSM:
   - Journaliser toutes les transitions d'état
   - Enregistrer les conditions évaluées et leurs résultats

2. Implémenter un outil de visualisation en temps réel:
   - Un composant React pour afficher l'état actuel
   - Une visualisation des transitions récentes
   - Un tableau des conditions évaluées récemment

3. Créer des tests de comportement:
   - Scénarios de test pour chaque transition
   - Validation du comportement attendu du bot

## Considérations d'Implémentation

### Gestion des Transitions

Dans le diagramme amélioré, toutes les transitions passent par l'état IDLE:

- Les états actifs (EXPLORING, COLLECTING, RETURNING) retournent à IDLE après avoir terminé leurs tâches
- L'état IDLE évalue les conditions et transite vers l'état approprié

L'implémentation devra gérer ces transitions bidirectionnelles en ajoutant:

```javascript
// Dans botStates.js pour chaque état actif
onExitState: (playerStore, changeState) => {
  // Logique spécifique à l'état
  // ...
  
  // Retour à l'état IDLE
  changeState(BOT_STATES.IDLE);
}
```

### Évaluation des Conditions

L'état IDLE devient responsable de l'évaluation et de la décision. Cela nécessite:

1. Une fonction d'évaluation complète qui considère:
   - L'état actuel du bot et son véhicule
   - Les ressources découvertes
   - Le niveau de carburant
   - La capacité du vaisseau

2. Un ordre de priorité clair:
   - Sécurité d'abord (niveau de carburant)
   - Efficacité ensuite (collecte des ressources)
   - Exploration en dernier (découverte)

## Métriques de Succès

La migration sera considérée comme réussie si:

1. La FSM a une structure plus propre et lisible
2. La logique de décision est centralisée dans l'état IDLE
3. Le comportement du bot est au moins aussi efficace qu'avant
4. Le code est plus facile à maintenir et étendre

---

Ce guide fournit un cadre pour la migration vers une architecture FSM centralisée. Chaque prompt représente une étape logique du processus, permettant une implémentation progressive et contrôlée.