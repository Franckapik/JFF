# Analyse des Dysfonctionnements FSM - Test Autonome

## 🔍 Question 1 : Pourquoi l'état `initializing` n'était pas visible ?

### Réponse

L'état `initializing` **passe trop vite** et n'était pas capturé car :

1. **Le monitoring démarre APRÈS `actor.start()`**
   ```javascript
   actor.start();
   const unsubscribe = monitor.startMonitoring(); // ❌ Trop tard !
   ```

2. **La transition `initializing → evaluating` est INSTANTANÉE**
   - L'état `initializing` a un `always` guard qui vérifie `areAllEntitiesInitialized`
   - Dans le contexte mocké, toutes les positions sont pré-initialisées
   - Donc la transition se fait en ~0ms, avant que `subscribe()` ne capture le changement

### ✅ Solution Appliquée

```javascript
startMonitoring() {
  // Capturer l'état initial AVANT subscribe
  const initialSnapshot = this.actor.getSnapshot();
  
  // Log de l'état initial
  if (this.verbose) {
    console.log('📌 INITIAL STATE CAPTURED');
    console.table({ state: JSON.stringify(initialSnapshot.value) });
  }
  
  // Puis subscribe pour les changements suivants
  const subscription = this.actor.subscribe(...)
}
```

**Résultat** : L'état initial est maintenant capturé et affiché !

---

## 🔍 Question 2 : Pourquoi le bot reste bloqué dans `drone_deploying` ?

### Diagnostic

Le test montre :
```
target-tile: 'none'
drone-state: 'uninitialized'
```

### Analyse Multi-niveaux

#### Niveau 1 : **Pas de tuile cible (targetTile = 'none')**

**Cause racine** : L'action `assignDroneDeployingContext` ne trouve pas de tuile valide.

Regardons le code :
```typescript
export const assignDroneDeployingContext = createAssignAction(({ context }) => {
  const tiles = context.gridInfo?.tiles || {};
  const shipPosition = context.vehicle?.position || context.vehicle?.basePosition;
  
  // ⚠️ GUARD: Vérifier que gridInfo contient des tiles
  if (Object.keys(tiles).length === 0) {
    return {}; // ❌ Pas de tiles → pas de targetDroneTile
  }
  
  const candidateTiles = findTilesInRadius(startCoord, range, tiles);
  let targetDroneTile = selectRandomTile(candidateTiles);
  
  if (!targetDroneTile) {
    return {}; // ❌ Aucune tuile trouvée dans le rayon
  }
  
  // Assignation du targetDroneTile...
});
```

**Hypothèses** :
1. ✅ `context.gridInfo.tiles` **est peuplé** (mockTiles contient '0,0', '3,3', '7,7')
2. ❓ `findTilesInRadius()` **ne trouve pas de tuiles valides** dans le rayon de 2
   - Le bot est en '0,0'
   - Les tiles '3,3' et '7,7' sont peut-être **hors du rayon**
3. ❓ `selectRandomTile()` **échoue** (tiles filtrées vides)

#### Niveau 2 : **Architecture FSM - Événements externes manquants**

**Même si le targetTile était défini**, le bot resterait **bloqué** car :

```typescript
// Machine definition
drone_deploying: {
  entry: 'onDroneDeployingEntry',
  exit: 'onDroneDeployingExit',
  on: {
    DRONE_REACHES_TILE: { // ⚠️ Attend un événement externe !
      target: 'drone_scanning',
      actions: 'assignDroneScanningContext'
    }
  }
}
```

**Le problème** : 
- L'événement `DRONE_REACHES_TILE` **n'est JAMAIS envoyé** en mode autonome
- Selon le commentaire dans `actions.effects.ts` :

```typescript
/**
 * EVENT: DRONE_REACHES_TILE envoyé par deployingHandler (tracker)
 * 
 * PATTERN: L'événement est géré par le tracker, pas par un setTimeout ici.
 */
```

**Constat** : La FSM **n'est PAS vraiment autonome** ! Elle dépend des **trackers R3F** pour fonctionner.

### 🔬 Vérification de l'hypothèse : Calcul du rayon

```javascript
// Bot position: '0,0'
// Rayon: 2 (exploringRadius)
// Tiles disponibles: '3,3', '7,7'

// Distance de '0,0' à '3,3' = sqrt((3-0)² + (3-0)²) = sqrt(18) ≈ 4.24
// Distance de '0,0' à '7,7' = sqrt((7-0)² + (7-0)²) = sqrt(98) ≈ 9.90

// Avec rayon = 2 → Aucune tuile dans le rayon !
```

**Confirmation** : Les tuiles mockées sont **trop éloignées** pour le rayon par défaut de 2.

---

## 📊 Résumé des Problèmes

| # | Problème | Cause | Impact | Gravité |
|---|----------|-------|--------|---------|
| 1 | État `initializing` invisible | Monitoring démarre trop tard | Logs incomplets | ⚠️ Mineur |
| 2 | `targetTile = 'none'` | Tuiles mockées hors du rayon d'exploration | Pas de destination → bloqué | ❌ Critique |
| 3 | Bloqué dans `drone_deploying` | Pas d'événement `DRONE_REACHES_TILE` | Aucune transition possible | ❌ Critique |
| 4 | FSM non-autonome | Dépend des trackers R3F pour envoyer les événements | Test autonome impossible | ⚠️ Architectural |

---

## ✅ Solutions Proposées

### Solution 1 : Corriger les données mockées (Court terme)

**Ajouter des tuiles proches dans le rayon d'exploration** :

```javascript
// Dans fsm-mock-data.js
export const mockTiles = {
  '0,0': mockDepartTile,
  '1,1': { // ✅ Proche : distance ≈ 1.41
    position: { x: 1, y: 0, z: 1, coord: '1,1' },
    resources: { food: 50, debris: 25, special: 0, total: 75 },
    hasResources: true,
    type: 'resource',
    biome: 'plains'
  },
  '2,0': { // ✅ Proche : distance = 2
    position: { x: 2, y: 0, z: 0, coord: '2,0' },
    resources: { food: 80, debris: 40, special: 0, total: 120 },
    hasResources: true,
    type: 'resource',
    biome: 'forest'
  },
  '3,3': { /* ... reste inchangé ... */ }
};
```

### Solution 2 : Simuler les événements trackers (Moyen terme)

**Créer un "SimulatedTracker" qui envoie les événements automatiquement** :

```javascript
class SimulatedTracker {
  constructor(actor) {
    this.actor = actor;
  }

  start() {
    // Observer les changements d'état
    this.actor.subscribe((snapshot) => {
      const state = snapshot.value;
      
      // Simuler les événements selon l'état
      if (state?.exploring === 'drone_deploying') {
        setTimeout(() => {
          this.actor.send({ type: 'DRONE_REACHES_TILE' });
        }, 1000); // Délai simulé de déplacement
      }
      
      if (state?.exploring === 'drone_scanning') {
        setTimeout(() => {
          this.actor.send({ type: 'DRONE_HAS_SCANNED' });
        }, 500); // Délai de scan
      }
      
      // etc...
    });
  }
}
```

### Solution 3 : Architecture "vraiment autonome" (Long terme)

**Refactoriser la FSM pour qu'elle soit autonome via `after` (delayed transitions)** :

```typescript
drone_deploying: {
  entry: 'onDroneDeployingEntry',
  // ✅ Transition automatique après un délai
  after: {
    DRONE_DEPLOY_DURATION: {
      target: 'drone_scanning',
      actions: 'assignDroneScanningContext'
    }
  }
}
```

**Avantages** :
- ✅ Pas besoin de trackers pour tester
- ✅ FSM vraiment autonome
- ✅ Tests plus simples

**Inconvénients** :
- ❌ Logique de timing dans la machine (moins flexible)
- ❌ Nécessite refactoring complet

---

## 🎯 Recommandation Immédiate

**Pour débloquer le test** :

1. ✅ **Ajouter des tuiles proches** dans `fsm-mock-data.js` (Solution 1)
2. ✅ **Implémenter SimulatedTracker** dans `test-fsm-autonomous.js` (Solution 2)

**Code à ajouter** :

```javascript
// Dans test-fsm-autonomous.js
class SimulatedTracker {
  constructor(actor) {
    this.actor = actor;
    this.timers = [];
  }

  start() {
    const subscription = this.actor.subscribe((snapshot) => {
      const state = snapshot.value;
      
      if (typeof state === 'object' && state.exploring) {
        this.handleExploringState(state.exploring);
      }
    });
    
    return () => {
      this.timers.forEach(t => clearTimeout(t));
      subscription.unsubscribe?.();
    };
  }

  handleExploringState(subState) {
    if (subState === 'drone_deploying') {
      const timer = setTimeout(() => {
        this.actor.send({ type: 'DRONE_REACHES_TILE' });
      }, 1000);
      this.timers.push(timer);
    } else if (subState === 'drone_scanning') {
      const timer = setTimeout(() => {
        this.actor.send({ type: 'DRONE_HAS_SCANNED' });
      }, 500);
      this.timers.push(timer);
    } else if (subState === 'drone_returning') {
      const timer = setTimeout(() => {
        this.actor.send({ type: 'DRONE_REACHES_BASE' });
      }, 1000);
      this.timers.push(timer);
    }
  }
}

// Dans runAutonomousTest()
const tracker = new SimulatedTracker(actor);
const unsubscribeTracker = tracker.start();
```

---

## 📝 Conclusion

1. **L'état `initializing` n'était pas visible** car il passait trop vite avant que le monitoring ne démarre ➜ **✅ Corrigé**

2. **Le bot reste bloqué** pour deux raisons :
   - **Tuiles trop éloignées** (aucune dans le rayon d'exploration) ➜ ❌ À corriger
   - **Événements non envoyés** (trackers R3F absents) ➜ ❌ À corriger

3. **La FSM n'est pas vraiment autonome** - elle dépend des trackers externes pour progresser ➜ ⚠️ Design architectural

**Next steps** : Implémenter les Solutions 1 et 2 pour débloquer le test.
