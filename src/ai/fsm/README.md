# Guide d'Utilisation de l'Architecture FSM Modulaire

## 📁 Structure Créée

```
src/ai/fsm/machine/
├── botMachine.js           # ✅ Machine principale simplifiée
├── states/
│   ├── index.js            # ✅ Export des constantes et états
│   ├── evaluating.js       # ✅ État d'évaluation et décision
│   ├── exploring.js        # ✅ État d'exploration
│   ├── collecting.js       # ✅ État de collecte de ressources
│   ├── returning.js        # ✅ État de retour à la base
│   └── idleAtBase.js       # ✅ État d'attente et maintenance
└── events/                 # ✅ Système d'événements centralisé
    ├── index.js            # ✅ Point d'entrée principal
    ├── systemEvents.js     # ✅ Événements générés par le système
    ├── userEvents.js       # ✅ Événements initiés par l'utilisateur
    ├── emergencyEvents.js  # ✅ Événements d'urgence
    ├── movementEvents.js   # ✅ Événements de mouvement
    ├── resourceEvents.js   # ✅ Événements de ressources
    └── fuelEvents.js       # ✅ Événements de carburant
```

## 🎯 Utilisation Simple

### 1. Créer une Machine Bot

```javascript
import { createBotMachine } from './src/ai/fsm/machine/machineFactory.js';

// Créer une machine pour un bot
const machine = createBotMachine('bot-001', {
  vehicle: {
    fuel: 80,
    coord: 'A1',
    startCoord: 'A1'
  }
});
```

### 2. États Disponibles

| État | Description | Transitions Principales |
|------|-------------|------------------------|
| **EVALUATING** | 🧠 Évaluation et décision | → EXPLORING, COLLECTING, RETURNING, IDLE_AT_BASE |
| **EXPLORING** | 🔍 Exploration et découverte | → EVALUATING (quand terminé) |
| **COLLECTING** | ⛏️ Collecte de ressources | → EVALUATING (quand terminé) |
| **RETURNING** | 🏠 Retour à la base | → IDLE_AT_BASE (quand arrivé) |
| **IDLE_AT_BASE** | ⏳ Maintenance à la base | → EVALUATING (quand prêt) |

### 3. Événements Principaux

```javascript
import { events } from './src/ai/fsm/machine/events';

// Utilisation avec les créateurs d'événements
const evalEvent = events.system.createAssessmentCompleteEvent('EXPLORING', 'need_resources');
machine.send(evalEvent.type, evalEvent);

const exploreEvent = events.resources.createAreaExploredEvent(['A1', 'A2'], [{type: 'mineral', amount: 10}]);
machine.send(exploreEvent.type, exploreEvent);

const collectEvent = events.resources.createResourceCollectedEvent({type: 'mineral'}, {resources: ['mineral']});
machine.send(collectEvent.type, collectEvent);

const baseEvent = events.movement.createBaseReachedEvent({coord: 'A1'});
machine.send(baseEvent.type, baseEvent);
```

### 4. Catégories d'Événements

| Catégorie | Description | Exemples |
|-----------|-------------|----------|
| **System** | Événements système automatiques | `EVALUATION_COMPLETE`, `REFUEL_COMPLETE` |
| **User** | Actions initiées par l'utilisateur | `MANUAL_OVERRIDE`, `MOVE_TO` |
| **Emergency** | Situations critiques | `EMERGENCY_DETECTED`, `LOW_FUEL_DETECTED` |
| **Movement** | Déplacements | `MOVEMENT_STARTED`, `BASE_REACHED` |
| **Resources** | Gestion des ressources | `RESOURCES_DISCOVERED`, `RESOURCE_COLLECTED` |
| **Fuel** | Gestion du carburant | `FUEL_CONSUMED`, `FUEL_ADDED` |
machine.send('REFUEL_COMPLETE');        // IDLE_AT_BASE → EVALUATING

// Événements d'urgence (depuis n'importe quel état)
machine.send('EMERGENCY_DETECTED', { reason: 'low_fuel' });
machine.send('MANUAL_OVERRIDE', { command: 'stop' });
```

## 🏗️ Architecture Modulaire

### Avantages Pédagogiques

1. **📖 Code Lisible** : Chaque état dans son propre fichier
2. **🔧 Maintenable** : Logique isolée et testable
3. **🎯 Simple** : botMachine.js fait seulement 50 lignes
4. **🧩 Modulaire** : États réutilisables et composables
5. **🛡️ Robuste** : Gestion d'erreurs intégrée

### Pattern de Fichier d'État

Chaque fichier d'état suit le même pattern :

```javascript
// état/monEtat.js
import { state, transition, reduce } from 'robot3';
import { BOT_STATES } from './index.js';

export const monEtatState = state(
  // Transitions normales
  transition('EVENEMENT', BOT_STATES.AUTRE_ETAT,
    (context) => /* condition */,
    reduce((context, event) => /* nouveau contexte */)
  ),
  
  // Transitions d'urgence
  transition('EMERGENCY_DETECTED', BOT_STATES.RETURNING, ...)
);
```

## 🚀 Prochaines Étapes

1. **Tests** : Créer des tests pour chaque état
2. **Hooks** : Créer `useBotMachine(botId)` 
3. **Composants** : Interface utilisateur pour le debug
4. **Actions Core** : Intégrer avec `movement.js` existant
5. **Multi-Bots** : Gestion de plusieurs bots simultanément

## 🐛 Debug et Monitoring

Le contexte FSM contient toutes les informations nécessaires pour le debug :

```javascript
const context = machine.context;
console.log({
  botId: context.botId,
  currentAction: context.currentAction,
  lastDecision: context.lastDecision,
  lastStateChange: context.lastStateChange,
  vehicle: context.vehicle
});
```

---

✅ **Architecture FSM Modulaire Complète et Prête à l'Usage !**
