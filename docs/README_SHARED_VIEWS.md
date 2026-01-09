# 📺 Composants de Vue SharedWorker

Ce dossier contient les composants React pour les vues synchronisées via le SharedWorker.

---

## 🎯 Architecture Post-Migration Phase 5

**Worker 100% Autonome** : Le SharedWorker contient toute la logique FSM sans aucune dépendance à Zustand ou aux contextes React.

```
Worker (Autonome)          →    Vue1 (Consommateur)
  ├─ machineXV5Pure              ├─ SharedView.tsx
  ├─ context.gridInfo.tiles      └─ useSharedWorkerStore
  ├─ gameConfigStore                   ↓
  └─ BroadcastChannel         Affichage simplifié
                                        
Worker (Autonome)          →    Vue2 (Consommateur)
  ├─ machineXV5Pure              ├─ SharedFSMVisualization.tsx
  ├─ context.gridInfo.tiles      └─ useSharedWorkerStore
  ├─ gameConfigStore                   ↓
  └─ BroadcastChannel         Affichage complet
```

---

## 📁 Fichiers

### SharedView.tsx

**Route** : `/vue1`

Composant simple affichant les cartes des bots avec leurs états et métriques.

**Fonctionnalités :**
- 📊 Cartes par bot (état, fuel, damage, resources)
- 🔗 Connexion au SharedWorker
- 🎮 Initialisation du jeu (uniquement Vue1)
- 🔄 Bouton Reset
- 📈 Compteur d'updates et instanceId

**Usage :**
```tsx
<SharedView viewId="vue1" />
```

---

### SharedFSMVisualization.tsx

**Route** : `/vue2`

Visualisation complète avec tous les détails FSM.

**Sections :**
1. **SyncHeader** - Barre de statut (connexion, updates)
2. **Current State** - États FSM actuels
3. **Starting Conditions** - Analyse de fairness
4. **Drone Status** - 3 types de drones (explorer, combat, special)
5. **Tile Matrix** - Grille hexagonale interactive
6. **Cycle Statistics** - Métriques exploration/collecte
7. **FSM Cycle Flow** - Diagramme visuel
8. **Context Memory** - Snapshot contexte
9. **Event Log** - Historique transitions
10. **Debug Info** - Infos techniques

**Usage :**
```tsx
<SharedFSMVisualization />
```

---

### FSMVisualization.tsx

**Route** : `/` (Legacy mode)

Version originale utilisant les stores Zustand locaux (non SharedWorker).

**Différences avec SharedFSMVisualization :**
- ❌ Pas de synchronisation multi-onglets
- ❌ Utilise `useBotStates()` et `useActiveBots()` (hooks locaux)
- ✅ Autonome (pas de worker requis)

---

## 🔄 Cycle de Synchronisation

### 1. Connexion

```tsx
// SharedView.tsx ou SharedFSMVisualization.tsx
const connect = useSharedWorkerStore((s) => s.connect);

React.useEffect(() => {
  connect(); // Établit la connexion MessagePort
}, [connect]);
```

### 2. Initialisation (Vue1 uniquement)

```tsx
// Vue1 génère la grille et envoie INIT au worker
if (viewId === 'vue1' && isConnected && !isInitialized) {
  const tiles = initializeGameGrid(radius, spacing);
  setTiles(tiles);
  assignStartingTiles(['bot-0', 'bot-1']);
  
  const currentTiles = useTileStore.getState().tiles;
  initGame(currentTiles); // → INIT message au worker
}
```

### 3. Réception des états

```tsx
// Le worker broadcast les STATE_UPDATE
// useSharedWorkerStore reçoit et met à jour automatiquement

const botStates = useSharedWorkerStore((s) => s.botStates);
const updateCounter = useSharedWorkerStore((s) => s.updateCounter);

// Les composants React se re-render automatiquement
```

---

## 🎨 Composants Partagés

### SyncHeader

Barre de statut en haut affichant :
- 📺 Identifiant de la vue (VUE1/VUE2)
- ✅ Badge "Worker Autonome" (Phase 5)
- 🟢/🔴 Statut connexion
- 🎮 Game Running indicator
- 🆔 Instance ID (preuve de sync)
- 📊 Compteur d'updates
- ⏱️ Last update timestamp
- 🔄 Bouton Reset

**Code :**
```tsx
function SyncHeader({ viewId }: { viewId: string }) {
  const instanceId = useSharedWorkerStore((s) => s.instanceId);
  const updateCounter = useSharedWorkerStore((s) => s.updateCounter);
  const isConnected = useSharedWorkerStore((s) => s.isConnected);
  // ...
}
```

### SingleBotCycleFlow

Affichage compact du cycle FSM pour un bot.

**Props :**
- `botId`: 'bot-0' | 'bot-1'
- `compact`: boolean (optionnel)

**Code :**
```tsx
<SingleBotCycleFlow botId="bot-0" compact={true} />
```

### ContextItem

Affichage d'une métrique du contexte FSM.

**Props :**
- `label`: string
- `value`: string | number

**Code :**
```tsx
<ContextItem label="Fuel" value="85%" />
```

---

## 🧪 Test de Synchronisation

### Étapes

1. **Lancer le dev server**
   ```bash
   npm run build:worker  # Build le worker
   npm run dev           # Lancer Vite
   ```

2. **Ouvrir Vue1**
   - URL : `http://localhost:5173/vue1`
   - Observer l'initialisation du jeu
   - Noter l'`instanceId` (ex: `fsm-1736438765432-xyz`)

3. **Ouvrir Vue2 (nouvel onglet)**
   - URL : `http://localhost:5173/vue2`
   - Vérifier que l'`instanceId` est **identique** à Vue1
   - Observer que les `updateCounter` augmentent simultanément

4. **Vérifications**
   - ✅ Même instanceId dans les 2 vues
   - ✅ UpdateCounter synchronisé
   - ✅ États FSM identiques (bot-0, bot-1)
   - ✅ Transitions visibles dans les 2 vues en temps réel

### Logs Console

```javascript
// Vue1 (onglet 1)
🎮 [VUE1] Game initialized with 37 tiles
📡 [SharedWorker] Connected (instanceId: fsm-1736438765432-xyz)
🔄 [VUE1] State: evaluating | Status: active

// Vue2 (onglet 2)
📡 [SharedWorker] Connected (instanceId: fsm-1736438765432-xyz)
🔄 [VUE2] State: evaluating | Status: active
```

---

## 🐛 Troubleshooting

### Worker ne se connecte pas

**Symptômes :**
- Badge "Disconnected" rouge
- Pas d'`instanceId`
- `updateCounter` à 0

**Solutions :**
1. Vérifier que le worker est build : `npm run build:worker`
2. Vérifier le fichier : `public/fsm-shared-worker.js` existe
3. Check console : erreurs de connexion MessagePort
4. Hard refresh : Ctrl+Shift+R (kill le worker)

### États FSM non synchronisés

**Symptômes :**
- `instanceId` différents entre vues
- `updateCounter` divergents

**Solutions :**
1. Fermer tous les onglets `/vue1` et `/vue2`
2. Hard refresh (tue le SharedWorker)
3. Rouvrir `/vue1` en premier (initialisation)
4. Puis ouvrir `/vue2`

### Tiles non affichées

**Symptômes :**
- Grille vide
- "0 tiles" dans les logs

**Solutions :**
1. S'assurer que Vue1 a initialisé (premier onglet)
2. Vérifier `useTileStore.getState().tiles` dans console
3. Check que `INIT` message a été envoyé au worker

---

## 📚 Documentation Complète

- [SHARED_WORKER_VIEWS_ARCHITECTURE.md](../../docs/SHARED_WORKER_VIEWS_ARCHITECTURE.md) - Architecture détaillée
- [FSM_ARCHITECTURE_DIAGRAM.md](../../docs/FSM_ARCHITECTURE_DIAGRAM.md) - Diagramme FSM complet
- [TILESTORE_FSM_INTEGRATION.md](../../docs/TILESTORE_FSM_INTEGRATION.md) - Plan de migration

---

## 🎉 Phase 5 Complète

Les vues Vue1 et Vue2 sont maintenant des **consommateurs purs** du SharedWorker autonome. Aucune logique FSM ne réside dans les composants React - tout est dans le worker.

**Avantages :**
- ✅ Synchronisation multi-onglets parfaite
- ✅ Worker autonome (testable, prévisible)
- ✅ Single source of truth (context.gridInfo.tiles)
- ✅ Hot reload safe (worker survit aux reloads UI)
