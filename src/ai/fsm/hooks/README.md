# Hooks FSM - Guide pédagogique

Ce dossier contient les hooks React qui fournissent une interface pour utiliser le système de Machine à États Finis (FSM) dans l'application.

**Statut**: Documentation mise à jour basée sur l'utilisation réelle et les problèmes identifiés.

## Comprendre useBotMachine

Le hook `useBotMachine` est conçu pour faciliter l'interaction avec le système FSM qui contrôle les bots autonomes dans l'application.

### Qu'est-ce qu'une Machine à États Finis (FSM) ?

Une Machine à États Finis est un modèle mathématique qui décrit un système qui peut être dans un nombre fini d'états. Le système peut passer d'un état à un autre en réponse à des événements externes. C'est un excellent moyen de modéliser des systèmes complexes de manière structurée.

### États Réels du Bot (Observés en pratique)

1. ✅ `EVALUATING` - Évaluation de la situation et prise de décision (100% utilisé)
2. ✅ `EXPLORING_DEPLOYING` - Déploiement du drone d'exploration (100% utilisé)
3. ✅ `EXPLORING_PROSPECTING` - Phase de prospection du drone (100% utilisé)
4. ⚠️ `EXPLORING_RETURNING` - Retour à la base **[PROBLÉMATIQUE - Bot peut rester bloqué]**
5. ✅ `IDLE_AT_BASE` - Maintenance à la base (60% utilisé quand atteignable)
6. ❌ `COLLECTING` - Collecte de ressources (0% utilisé - non implémenté)

### Comment fonctionne useBotMachine ?

1. **Initialisation**: 
   - Crée une machine FSM pour le bot spécifique
   - Configure le contexte initial (données du bot)
   - Synchronise la position initiale avec les tuiles de départ

2. **Système d'événements automatiques**:
   - `AUTO` : Déclenche l'exploration automatique  
   - `EVALUATION_COMPLETE` : Fin d'évaluation → transition vers exploration
   - `DRONE_REACHED_TARGET` : Drone arrivé → passage en prospection
   - `PROSPECTING_COMPLETE` : Prospection terminée → retour base

3. **Transitions d'états fonctionnelles**:
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

## Flux d'Exécution Réel

### ✅ Flux Normal Observé
```
Démarrage → EVALUATING → EXPLORING_DEPLOYING → EXPLORING_PROSPECTING → EXPLORING_RETURNING → (BLOQUÉ)
```

### ⚠️ Problème Identifié
- **Bot bloqué dans EXPLORING_RETURNING**: Le bot ne passe jamais à IDLE_AT_BASE
- **Cause**: L'événement `BASE_REACHED` ne se déclenche jamais
- **Impact**: Cycle d'exploration incomplet, bot inutilisable

### ✅ Solutions Implémentées
- **Timeout de 30 secondes** dans exploring_returning
- **Monitoring général** pour détecter les états bloqués  
- **Logs de debugging** pour identifier les problèmes

## Utilisation Mise à Jour

### ✅ Exemple Fonctionnel (États Utilisés)

```javascript
function BotComponent({ botId }) {
  // Hook principal avec synchronisation
  const { state, current, send, entity, vehicle } = useBotMachine(botId);
  
  // États réels observés
  const isEvaluating = state === 'evaluating';
  const isExploringDeploying = state === 'exploring_deploying';
  const isExploringProspecting = state === 'exploring_prospecting';
  const isExploringReturning = state === 'exploring_returning'; // ⚠️ Peut être bloqué
  const isIdleAtBase = state === 'idle_at_base';
  
  // Données contextuelles réelles
  const position = vehicle?.position;
  const droneStatus = current.context?.droneFleet?.drones?.explorer;
  const lastStateChange = current.context?.lastStateChange;
  
  // Calcul du temps dans l'état actuel
  const timeInState = lastStateChange ? Date.now() - lastStateChange : 0;
  
  return (
    <div>
      <h2>Bot {botId}</h2>
      <p>État: {state}</p>
      <p>Position: {position ? `${position.x}, ${position.y}` : 'Inconnue'}</p>
      <p>Temps dans état: {Math.round(timeInState/1000)}s</p>
      
      {/* Indicateur de problème */}
      {isExploringReturning && timeInState > 25000 && (
        <div style={{color: 'red'}}>
          ⚠️ Bot bloqué - Timeout dans {Math.round((30000-timeInState)/1000)}s
        </div>
      )}
      
      {/* Actions manuelles fonctionnelles */}
      <button onClick={() => send('MANUAL_OVERRIDE', { command: 'stop' })}>
        Stop (Override Manuel)
      </button>
      
      {/* Démarrage d'exploration (si en attente) */}
      {isEvaluating && (
        <button onClick={() => send('EVALUATION_COMPLETE')}>
          Démarrer Exploration
        </button>
      )}
    </div>
  );
}
```

### ❌ Exemple Non Fonctionnel (États Non Utilisés)

```javascript
// ❌ ÉVITER - Ces états ne sont jamais atteints
function BrokenBotComponent({ botId }) {
  const { state, actions } = useBotMachine(botId);
  
  // ❌ Ces états ne sont jamais utilisés en pratique
  const isCollecting = state === 'collecting'; // Toujours false
  const isReturning = state === 'returning';   // État supprimé
  
  // ❌ Ces actions ne fonctionnent pas
  const handleCollectResource = () => {
    // Cette logique n'est jamais déclenchée
    actions.collectResource(); // Non implémenté
  };
  
  return (
    <div>
      {/* ❌ Ce contenu ne s'affichera jamais */}
      {isCollecting && <p>Collecte en cours...</p>}
      <button onClick={handleCollectResource}>Collecter</button>
    </div>
  );
}
```

## Problèmes Connus et Solutions

### ⚠️ Bot Bloqué dans exploring_returning

**Problème**: Le bot reste indéfiniment dans cet état car BASE_REACHED ne se déclenche jamais.

**Détection**: 
```javascript
const timeInState = Date.now() - current.context.lastStateChange;
if (state === 'exploring_returning' && timeInState > 30000) {
  console.warn('Bot bloqué détecté');
}
```

**Solution Automatique**: Le hook inclut maintenant un timeout automatique de 30 secondes.

### ✅ Bonnes Pratiques

1. **Utilisez les états réels**: `evaluating`, `exploring_deploying`, `exploring_prospecting`, `exploring_returning`, `idle_at_base`
2. **Surveillez les timeouts**: Particulièrement dans `exploring_returning`
3. **Testez les overrides manuels**: `MANUAL_OVERRIDE` fonctionne depuis tous les états
4. **Évitez les états non implémentés**: `collecting` et `returning` (ancien)
5. **Monitorez les logs**: Utilisez fsmLogger pour déboguer

## Métriques et Monitoring

Le hook fournit maintenant des capacités de monitoring intégrées :

```javascript
const { state, current } = useBotMachine(botId);

// Temps dans l'état actuel
const timeInState = Date.now() - (current.context.lastStateChange || 0);

// État du drone
const droneStatus = current.context.droneFleet?.drones?.explorer;

// Historique des états
const stateHistory = current.context.stateHistory || [];
```

Cette documentation reflète l'état réel du système après analyse des logs et identification des problèmes.
