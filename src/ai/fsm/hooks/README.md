# Hooks FSM - Guide pédagogique

Ce dossier contient les hooks React qui fournissent une interface pour utiliser le système de Machine à États Finis (FSM) dans l'application.

## Comprendre useBotMachine

Le hook `useBotMachine` est conçu pour faciliter l'interaction avec le système FSM qui contrôle les bots autonomes dans l'application.

### Qu'est-ce qu'une Machine à États Finis (FSM) ?

Une Machine à États Finis est un modèle mathématique qui décrit un système qui peut être dans un nombre fini d'états. Le système peut passer d'un état à un autre en réponse à des événements externes. C'est un excellent moyen de modéliser des systèmes complexes de manière structurée.

Dans notre cas, chaque bot a cinq états possibles:
1. `EVALUATING` - Évaluation de la situation et prise de décision
2. `EXPLORING` - Exploration de la carte pour découvrir des ressources
3. `COLLECTING` - Collecte de ressources connues
4. `RETURNING` - Retour à la base (urgence ou plein de ressources)
5. `IDLE_AT_BASE` - Maintenance à la base (ravitaillement, déchargement)

### Comment fonctionne useBotMachine ?

1. **Initialisation**: 
   - Crée une machine FSM pour le bot spécifique
   - Configure le contexte initial (données du bot)

2. **Système d'événements**:
   - Les événements sont envoyés à la machine via la fonction `send`
   - Exemples: 'MOVE_TO', 'STOP', 'START_EXPLORING', 'AUTO'...

3. **Transitions d'états**:
   - Chaque état définit des transitions qui peuvent se produire
   - Les transitions sont déclenchées par des événements
   - Des conditions (guards) déterminent si une transition est possible
   - Des réducteurs (reducers) mettent à jour le contexte lors des transitions

4. **Mode autonome**:
   - En mode autonome, un intervalle envoie régulièrement l'événement 'AUTO'
   - Cet événement permet au bot de "réfléchir" et prendre des décisions

## Exemple d'utilisation

```jsx
import { useBotMachine } from '../ai/fsm/hooks/useBotMachine';

function BotComponent({ botId }) {
  // Initialiser le hook avec l'ID du bot
  const { state, actions, helpers } = useBotMachine(botId);
  
  // Vérifier l'état actuel
  const isExploring = state === 'exploring';
  
  // Récupérer des statistiques
  const metrics = helpers.getMetrics();
  
  return (
    <div>
      <h2>Bot {botId}</h2>
      <p>État actuel: {state}</p>
      <p>Carburant: {metrics.fuel}/100</p>
      
      {/* Actions de contrôle */}
      <button onClick={() => actions.startExploration()}>
        Explorer
      </button>
      <button onClick={() => actions.returnToBase()}>
        Retour à la base
      </button>
      <button onClick={() => actions.toggleAutonomous()}>
        {helpers.isAutonomous() ? 'Mode Manuel' : 'Mode Auto'}
      </button>
    </div>
  );
}
```

## Architecture du système FSM

Le système FSM est organisé en plusieurs composants:

1. **States** (`/src/ai/fsm/machine/states/`):
   - Définitions des états et leurs transitions possibles

2. **Guards** (`/src/ai/fsm/machine/guards/`):
   - Conditions qui déterminent si une transition est possible
   - Organisées par catégorie: safety, efficiency, discovery, base

3. **Reducers** (`/src/ai/fsm/machine/reducers/`):
   - Fonctions qui mettent à jour le contexte lors des transitions
   - Assurent la cohérence des données

4. **Context** (`/src/ai/fsm/machine/context/`):
   - Structure des données du bot
   - État initial et configuration

## Résumé

Le hook `useBotMachine` simplifie l'interaction avec un système FSM complexe. Il fournit:

1. Des actions simples pour contrôler le bot
2. Des informations sur l'état actuel du bot
3. Des utilitaires pour vérifier différentes conditions
4. Un accès aux détails pour le débogage avancé

Cette architecture permet de créer des comportements complexes et réactifs pour les bots tout en maintenant le code organisé et maintenable.
