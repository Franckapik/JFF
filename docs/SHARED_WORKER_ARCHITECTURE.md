# Architecture SharedWorker FSM

## Vue d'ensemble

Cette architecture permet d'avoir **une seule instance de machine XState** qui tourne dans un SharedWorker, avec plusieurs vues (onglets) qui affichent le même état synchronisé.

## Structure des fichiers

```
src/
├── workers/
│   └── fsm-shared-worker.ts     # SharedWorker avec la machine XState
├── stores/
│   └── useSharedWorkerStore/
│       └── index.ts             # Store Zustand pour se connecter au worker
├── components/
│   └── SharedView.tsx           # Composant de vue synchronisée
├── AppRouter.tsx                # Routeur simple sans react-router
└── index.jsx                    # Point d'entrée avec le routeur
```

## Routes disponibles

| Route | Description |
|-------|-------------|
| `/` | Vue legacy (mode original avec instances FSM locales) |
| `/vue1` | Vue 1 connectée au SharedWorker (initialise le jeu) |
| `/vue2` | Vue 2 connectée au SharedWorker (réception seule) |

## Preuve de synchronisation

Chaque vue affiche en header :
- **Instance ID** : Identifiant unique du SharedWorker
- **Update Counter** : Compteur d'updates FSM
- **Connection Status** : État de connexion au worker

## Utilisation

1. Démarrer le serveur : `npm run dev`
2. Ouvrir **deux onglets** :
   - Onglet 1 : `http://localhost:3000/vue1`
   - Onglet 2 : `http://localhost:3000/vue2`
3. Observer que les deux onglets affichent :
   - Le même `Instance ID`
   - Le même `Update Counter` (synchronisé)
   - Les mêmes états FSM pour bot-0 et bot-1

## Fonctionnement

### SharedWorker (`fsm-shared-worker.ts`)

Le worker contient :
- **Une instance unique de machineXV5Pure** par bot
- **Le tracker simulé** (adapté de `simulatedTrackerCore.ts`) qui planifie les événements automatiquement
- **Un système de broadcast** vers tous les ports (vues) connectés

### Store Zustand (`useSharedWorkerStore`)

Le store :
- Se connecte au SharedWorker via `MessagePort`
- Reçoit les updates d'état en temps réel
- Expose `botStates`, `instanceId`, `updateCounter` aux composants React

### Composant SharedView

- Affiche le header de synchronisation
- Affiche FSMVisualization avec les données du worker
- Vue1 initialise le jeu, Vue2 se connecte en lecture seule

## Différences avec le mode Legacy

| Aspect | Legacy (`/`) | SharedWorker (`/vue1`, `/vue2`) |
|--------|--------------|----------------------------------|
| Instances FSM | 1 par onglet | 1 partagée pour tous |
| Synchronisation | Aucune | Temps réel |
| Tracker simulé | Dans React (useMultiSimulatedTracker) | Dans le Worker |
| État | Local à chaque onglet | Centralisé dans le Worker |

## Évolutions futures

- **Vue2 avec canvas R3F** : Remplacer `SharedFSMVisualization` par un canvas Three.js
- **Contrôles partagés** : Envoyer des événements au worker depuis n'importe quelle vue
- **Persistence** : Sauvegarder l'état dans IndexedDB via le worker

## Relancer le worker

### Méthode 1 : Bouton "Reset Game" (dans SharedView)
Chaque vue (`/vue1` et `/vue2`) a un bouton **🔄 Reset Game** en haut à droite :
- Clique sur le bouton pour réinitialiser les bots **sans tuer le worker**
- Tous les bots reviennent à l'état initial
- Les vues restent synchronisées (même `INSTANCE_ID`)
- Les logs du worker montrent : `🔄 [WORKER] Resetting all bots...`

**Avantage :** Le worker ne redémarre pas, les connexions restent actives.

### Méthode 2 : Rafraîchir la page (F5)
Rafraîchir `/vue1` ou `/vue2` :
- Cela **tue et relance le worker** 
- Un nouvel `INSTANCE_ID` est généré
- Les autres vues doivent se reconnecter automatiquement
- Les logs du worker recommencent à zéro

**Utiliser si :** Le reset normal ne fonctionne pas ou tu veux un vrai redémarrage.

### Méthode 3 : Ajouter des contrôles supplémentaires (futur)
On peut ajouter des boutons pour :
- Relancer juste un des 2 bots
- Charger un état sauvegardé
- Changer les paramètres du jeu

## Architecture Legacy vs SharedWorker

### Routes existantes

| Route | Architecture | Tracker | Bots | Synchronisation |
|-------|--------------|---------|------|-----------------|
| `/` | **Legacy (ancien)** | `useMultiSimulatedTracker` hook React | Local à cette vue | Aucune |
| `/vue1` | **SharedWorker (nouveau)** | `simulatedTrackerCore` dans le worker | Partagés par toutes les vues | Temps réel |
| `/vue2` | **SharedWorker (nouveau)** | Même que vue1 | Partagés par toutes les vues | Temps réel |

### Pourquoi deux systèmes coexistent ?

1. **Legacy `/`** : L'app originale avec instances FSM locales à chaque onglet
   - Chaque onglet a ses propres bots
   - Aucune synchronisation
   - Utilisée pour le debug et les tests unitaires
   
2. **SharedWorker `/vue1` et `/vue2`** : Nouvelle architecture
   - Une **seule instance de machine XState** partagée
   - Tous les bots dans le même contexte
   - Synchronisation temps réel entre les vues
   - Preuve de synchronisation via `instanceId` et `updateCounter`

### Différence de tracker

- **Legacy** : `useMultiSimulatedTracker()` est un hook React qui :
  - Tourne dans le composant React
  - Planifie les événements dans le navigateur principal
  - Émet des événements via `send()` local
  - Recrée les timers à chaque rendu

- **SharedWorker** : `simulatedTrackerCore` est :
  - Importé du même fichier que le legacy
  - Mais exécuté **dans le worker** (pas dans React)
  - Les timers restent actifs même si les vues ferment
  - Les événements sont envoyés à l'instance XState du worker
  - Le worker broadcast les snapshots à **toutes les vues** connectées

### Flux de synchronisation

```
┌─────────────────────────────────────┐
│   SharedWorker (fsm-shared-worker)  │
│  ┌─────────────────────────────────┐│
│  │ Machine XState (bot-0, bot-1)   ││
│  └──────────────┬──────────────────┘│
│                 │                     │
│         ┌───────┴─────────┐          │
│         ▼                 ▼          │
│   Tracker Core    Broadcast          │
│   (planifie)      (tous les ports)   │
│                                      │
└──────────────────┬───────────────────┘
                   │ MessagePort
         ┌─────────┴─────────┐
         ▼                   ▼
      Vue1                Vue2
    (port 1)            (port 2)
   SharedView          SharedView
   receive → update    receive → update
   (même instanceId,   (même instanceId,
    même bots)         même bots)
```

## Debug

### Test du bouton Reset Game

1. **Démarrer le serveur :**
   ```bash
   npm run dev
   ```

2. **Ouvrir deux onglets :**
   - Onglet 1 : `http://localhost:5173/vue1`
   - Onglet 2 : `http://localhost:5173/vue2`

3. **Observer la synchronisation :**
   - Onglet 1 montre `instanceId` et `updateCounter` en haut à droite
   - Onglet 2 affiche les MÊMES valeurs
   - Les deux bots progressent simultanément

4. **Tester le Reset :**
   - Cliquer sur le bouton **🔄 Reset Game** (en haut à droite)
   - Les bots reviennent à l'état initial
   - `updateCounter` augmente
   - `instanceId` **reste le même** (worker pas tué)
   - Les logs montrent : `🔄 [WORKER] Resetting all bots...`

5. **Vérifier dans DevTools :**
   - Ouvrir `chrome://inspect/#workers`
   - Cliquer "inspect" sur le worker
   - Voir les logs du reset en direct

### Dans le navigateur (Chrome DevTools)

Pour voir les logs du SharedWorker :
1. Ouvrir Chrome DevTools
2. Aller dans `chrome://inspect/#workers`
3. Cliquer sur "inspect" pour `fsm-shared-worker.ts`

Les logs du worker incluent :
- `🚀 [SHARED WORKER] Started` - Démarrage
- `🔌 [WORKER] Port connected` - Connexion d'une vue
- `🤖 [WORKER:bot-0] Sending: EVENT_NAME` - Événement planifié

### Dans le terminal VSCode

**Actuellement non disponible** :
- Les logs du SharedWorker ne s'affichent **que dans DevTools** (contexte navigateur)
- Le process Node.js de Vite ne capture pas les logs du worker
- Solution possible (futur) : ajouter `console.log` → `postMessage` vers le store qui forward au terminal

### Console de la vue (F12)

Les logs des vues affichent :
- `🔌 [STORE] Connecting to SharedWorker...` - Tentative connexion
- `🔌 [STORE] Connected to worker. Instance: fsm-xxx` - Connexion réussie
- `✅ [STORE] Game initialized in worker` - Jeu démarré
- `🎮 [VUE1] Game initialized with 37 tiles` - Vue prête
