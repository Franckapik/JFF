# 📺 Architecture des Vues SharedWorker

> **Dernière mise à jour :** 9 janvier 2026  
> **Statut :** ✅ 100% autonome - Worker indépendant de Zustand/React

---

## 🎯 Vue d'ensemble

Le projet propose 3 modes de visualisation :

| Mode | Route | Composant | Description |
|------|-------|-----------|-------------|
| **Legacy** | `/` | `App.tsx` | Mode original avec FSM locaux (Zustand) |
| **Vue1** | `/vue1` | `SharedView.tsx` | Vue synchronisée via SharedWorker |
| **Vue2** | `/vue2` | `SharedFSMVisualization.tsx` | Vue complète avec visualisation FSM |

---

## 🏗️ Architecture Technique

### Flux de données

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SHARED WORKER (Unique Instance)                  │
│  ✅ Autonome - Aucune dépendance store/context React                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 State Management:                                               │
│   • gameConfigStore (local copy)                                    │
│   • context.gridInfo.tiles (FSM single source of truth)            │
│   • context.memory.knownTiles                                       │
│                                                                     │
│  🤖 FSM Actors:                                                     │
│   • bot-0: Actor<machineXV5Pure>                                    │
│   • bot-1: Actor<machineXV5Pure>                                    │
│                                                                     │
│  📡 Communication:                                                  │
│   • BroadcastChannel (STATE_UPDATE)                                │
│   • MessagePort (bi-directional)                                   │
│                                                                     │
└─────────────────────────┬───────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│    VUE1 (/vue1)     │         │    VUE2 (/vue2)     │
│  SharedView.tsx     │         │  SharedFSM...tsx    │
├─────────────────────┤         ├─────────────────────┤
│                     │         │                     │
│ • Simple FSM cards  │         │ • Full FSM viz      │
│ • Bot states        │         │ • Tile matrix       │
│ • Context metrics   │         │ • Fairness analysis │
│                     │         │ • Cycle statistics  │
│                     │         │                     │
│ 📊 Data Source:     │         │ 📊 Data Source:     │
│  useSharedWorker    │         │  useSharedWorker    │
│  Store              │         │  Store              │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘
```

---

## 📡 Protocole de Communication

### Messages Worker → Frontend

```typescript
interface WorkerResponse {
  type: 'STATE_UPDATE' | 'INIT_COMPLETE' | 'CONNECTED' | 'ERROR';
  instanceId: string;          // ID unique du worker
  updateCounter: number;        // Compteur de MAJ
  botStates: {                  // États FSM des bots
    'bot-0': BotStateData;
    'bot-1': BotStateData;
  };
  activeBots: ('bot-0' | 'bot-1')[];
  timestamp: number;
}
```

### Messages Frontend → Worker

```typescript
interface WorkerMessage {
  type: 'INIT' | 'SEND_EVENT' | 'REQUEST_STATE' | 'CONNECT' | 'RESET';
  botId?: 'bot-0' | 'bot-1';
  event?: MachineEvents;
  tiles?: Record<string, Tile>;
  gameConfig?: {
    isClockRunning?: boolean;
    playerCount?: number;
    botCount?: number;
    mapSeed?: number | null;
    selectedView?: 'bot-0' | 'bot-1' | 'both';
  };
}
```

---

## 🎮 Vue1 - SharedView.tsx

### Responsabilités

- **Initialisation** : Génère la grille et envoie `INIT` au worker (uniquement Vue1)
- **Synchronisation** : Affiche l'état du worker (instanceId, updateCounter, timestamp)
- **Visualisation** : Composant `SharedFSMVisualization` simplifié

### Fonctionnalités

| Feature | Description |
|---------|-------------|
| **SyncHeader** | Barre de statut en haut (connexion, updates, reset) |
| **Bot Cards** | Carte par bot avec état actuel + métriques contexte |
| **Dual View** | Affichage simultané des 2 bots si `selectedView='both'` |
| **Reset Game** | Bouton pour réinitialiser sans tuer le worker |

### Code clé

```tsx
// Connexion au worker (mount)
React.useEffect(() => {
  connect();
}, [connect]);

// Initialisation (Vue1 uniquement)
React.useEffect(() => {
  if (!isConnected || isInitialized) return;
  
  if (viewId === 'vue1') {
    const tiles = initializeGameGrid(radius, spacing);
    setTiles(tiles);
    assignStartingTiles(['bot-0', 'bot-1']);
    
    const currentTiles = useTileStore.getState().tiles;
    initGame(currentTiles);
  }
}, [isConnected, isInitialized, viewId]);
```

---

## 🎨 Vue2 - SharedFSMVisualization.tsx

### Responsabilités

- **Visualisation complète** : Tous les détails FSM (états, transitions, contexte)
- **Analyse de fairness** : Conditions de départ équitables
- **Matrice de tuiles** : Visualisation hexagonale
- **Statistiques** : Exploration, collecte, cycle count

### Sections

| Section | Description |
|---------|-------------|
| **SyncHeader** | Identique à Vue1 |
| **Current State** | État actuel des bots |
| **Starting Conditions** | Analyse de fairness (spawn, resources, terrain) |
| **Drone Status** | État des 3 types de drones (explorer, combat, special) |
| **Tile Matrix** | Grille hexagonale interactive |
| **Cycle Statistics** | Tuiles explorées, ressources collectées |
| **FSM Cycle Flow** | Diagramme visuel des états |
| **Context Memory** | Snapshot du contexte FSM |
| **Event Log** | Historique des transitions |
| **Debug Info** | Infos techniques |

### Code clé

```tsx
// 🔄 Récupération depuis SharedWorker (plus de useXFSMStore local)
const botStates = useSharedWorkerStore((state) => state.botStates);
const isConnected = useSharedWorkerStore((s) => s.isConnected);
const updateCounter = useSharedWorkerStore((s) => s.updateCounter);

// Données locales (TileStore pour fairness analysis)
const tiles = useTileStore((state) => state.tiles);
const fairnessData = useTileStore((state) => state.lastFairnessValidation);
```

---

## 🔄 Cycle de vie

### 1. Connexion initiale

```
┌─────────┐  CONNECT   ┌─────────────┐  CONNECTED  ┌────────┐
│  Vue1   │ ────────► │   Worker    │ ──────────► │  Vue1  │
└─────────┘            └─────────────┘              └────────┘
     │                       │                           │
     │                       │                           │
┌─────────┐  CONNECT   ┌─────────────┐  CONNECTED  ┌────────┐
│  Vue2   │ ────────► │   Worker    │ ──────────► │  Vue2  │
└─────────┘            └─────────────┘              └────────┘
```

### 2. Initialisation (Vue1 uniquement)

```
┌─────────┐                        ┌─────────────┐
│  Vue1   │  1. Generate tiles     │             │
│         │  2. Assign starting    │             │
│         │  3. Send INIT message  │             │
│         │ ────────────────────► │   Worker    │
│         │                        │             │
│         │  4. INIT_COMPLETE      │  - Create   │
│         │ ◄──────────────────── │    actors   │
│         │                        │  - Start    │
│         │  5. STATE_UPDATE       │    FSM      │
│         │ ◄──────────────────── │             │
└─────────┘                        └─────────────┘
```

### 3. Synchronisation continue

```
┌─────────────┐  STATE_UPDATE   ┌────────┐
│   Worker    │ ──────────────► │  Vue1  │
│             │                  └────────┘
│  (Unique    │  STATE_UPDATE   ┌────────┐
│  Instance)  │ ──────────────► │  Vue2  │
│             │                  └────────┘
└─────────────┘
      ▲
      │ FSM Transitions
      │ (autonomous)
      │
```

---

## ✅ Migrations Complètes

### Phase 5 : TileStore → FSM Context

**Avant :**
```tsx
// ❌ Direct store call in FSM
const tiles = useTileStore.getState().tiles;
```

**Après :**
```tsx
// ✅ Context-based (worker autonomy)
const tiles = context.gridInfo.tiles;
```

### Hooks React (Vue1/Vue2)

**Avant :**
```tsx
// ❌ Local FSM actors
const botStates = useBotStates();
const activeBots = useActiveBots();
```

**Après :**
```tsx
// ✅ SharedWorker state
const botStates = useSharedWorkerStore((s) => s.botStates);
const isConnected = useSharedWorkerStore((s) => s.isConnected);
```

---

## 🔧 Gestion des Tiles

### Synchronisation

Les tiles sont **gérées en deux copies** :

1. **Frontend (useTileStore)** :
   - Génération initiale (Vue1)
   - Analyse de fairness
   - Visualisation UI

2. **Worker (context.gridInfo.tiles)** :
   - Source de vérité FSM
   - Exploration/Collection
   - Pure logic operations

**Synchronisation :**
```tsx
// Vue1 → Worker (INIT)
initGame(currentTiles);

// Worker → Vue1/Vue2 (STATE_UPDATE)
// Les snapshots contiennent context.gridInfo.tiles
```

---

## 🎯 Avantages de l'Architecture

| Avantage | Description |
|----------|-------------|
| **Synchronisation multi-onglets** | Ouvrir `/vue1` et `/vue2` simultanément = même état FSM |
| **Worker autonome** | Aucune dépendance store/context React dans le worker |
| **Single source of truth** | Le worker possède l'unique instance FSM |
| **Pure logic** | Toute la logique FSM est pure (testable, prévisible) |
| **Hot reload safe** | Le worker survit aux reloads des vues |

---

## 🚀 Utilisation

### Développement

```bash
# Terminal 1 - Build worker
npm run build:worker

# Terminal 2 - Dev server
npm run dev

# Ouvrir les vues
# Vue1 (simple): http://localhost:5173/vue1
# Vue2 (full):   http://localhost:5173/vue2
```

### Test de synchronisation

1. Ouvrir `/vue1` dans un onglet
2. Ouvrir `/vue2` dans un autre onglet
3. Observer :
   - ✅ Même `instanceId`
   - ✅ Même `updateCounter`
   - ✅ États FSM identiques
   - ✅ Transitions synchronisées

---

## 🐛 Debugging

### Vérifier la connexion

```tsx
// Dans SharedView ou SharedFSMVisualization
const isConnected = useSharedWorkerStore((s) => s.isConnected);
const instanceId = useSharedWorkerStore((s) => s.instanceId);

console.log('Connected:', isConnected);
console.log('Instance:', instanceId);
```

### Logs Worker

Les logs du worker apparaissent dans la console du premier onglet qui l'a créé.

```javascript
// Dans fsm-shared-worker.ts
console.log('🤖 [WORKER] Bot initialized');
```

### Inspecter l'état FSM

```tsx
const botStates = useSharedWorkerStore((s) => s.botStates);
console.log('Bot-0 State:', botStates['bot-0']?.value);
console.log('Bot-0 Context:', botStates['bot-0']?.context);
```

---

## 📚 Références

- [FSM_ARCHITECTURE_DIAGRAM.md](./FSM_ARCHITECTURE_DIAGRAM.md) - Diagramme complet FSM
- [TILESTORE_FSM_INTEGRATION.md](./TILESTORE_FSM_INTEGRATION.md) - Plan de migration TileStore
- [SHARED_WORKER_ARCHITECTURE.md](./SHARED_WORKER_ARCHITECTURE.md) - Architecture worker (legacy doc)

---

## 🎉 Résultat Final

**Worker 100% autonome** : Le SharedWorker contient toute la logique FSM et ne dépend d'aucun store React. Les vues sont de simples consommateurs de l'état FSM via `useSharedWorkerStore`.

Cette architecture garantit :
- ✅ Testabilité (pure functions)
- ✅ Prévisibilité (single source of truth)
- ✅ Scalabilité (N vues peuvent se connecter)
- ✅ Maintenabilité (séparation worker/UI)
