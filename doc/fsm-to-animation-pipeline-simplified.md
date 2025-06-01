# Pipeline FSM → Animation Drone - Documentation Simplifiée

## 🎯 Vue d'ensemble

Ce document explique la chaîne complète de traitement qui transforme l'état d'une machine FSM en animation 3D de drones dans React Three Fiber, en utilisant l'approche **simplifiée avec uniquement `reduce()`** de Robot3.

**Pipeline simplifié :**
```
FSM Machine → reduce() → Context FSM → Hook → Composant → useFrame Animation
```

**✅ Architecture Simplifiée**
- Utilisation exclusive des changements de contexte FSM via `reduce()`
- Communication directe Hook → Fleet via le store FSM
- Animation déclenchée par les changements d'état du contexte
- Suppression de la complexité inutile des EventListeners et `action()`

---

## 📋 Table des matières

1. [Architecture Générale](#architecture-générale)
2. [Étape 1: Machine FSM avec reduce()](#étape-1-machine-fsm-avec-reduce)
3. [Étape 2: Contexte FSM](#étape-2-contexte-fsm)
4. [Étape 3: Hook d'accès](#étape-3-hook-daccès)
5. [Étape 4: Composant Fleet](#étape-4-composant-fleet)
6. [Étape 5: Animation useFrame](#étape-5-animation-useframe)
7. [Flux de données détaillé](#flux-de-données-détaillé)
8. [Fonctions clés](#fonctions-clés)
9. [Debugging et Outils de Développement](#debugging-et-outils-de-développement)
10. [Checklist de vérification](#checklist-de-vérification)
11. [Concepts pédagogiques](#concepts-pédagogiques)

---

## 🏗️ Architecture Générale

### 🆕 Architecture Simplifiée avec reduce() uniquement
```mermaid
graph TD
    A[FSM Machine States] --> B[reduce()]
    B --> C[Context FSM Update]
    C --> D[useFSMDroneState Hook]
    D --> E[Fleet Component]
    E --> F[useFrame Animation]
    
    A1[exploring.js] --> A
    B1[context update only] --> B
    C1[FSMContext.jsx] --> C
    D1[calculateDronePositions] --> D
    D2[getDroneVisualState] --> D
    E1[explorerDroneRef] --> E
    F1[rotation.y] --> F
    F2[position.y] --> F
```

### **Points Clés de l'Architecture Simplifiée**

1. **`reduce()`** : Met à jour le contexte FSM de manière pure et déterministe
2. **Direct Context Access** : Hook accède directement au contexte FSM mis à jour
3. **React Reactivity** : Les changements de contexte déclenchent automatiquement les re-renders
4. **Fleet Reactive** : Fleet component réagit aux changements via les hooks React

---

## 🎮 Étape 1: Machine FSM avec reduce()

### Fichier: `/src/ai/fsm/machine/states/exploring.js`

**Rôle:** Définit les états et transitions avec l'approche simplifiée utilisant uniquement `reduce()`.

**Transition d'entrée avec reduce() uniquement :**
```javascript
// Entrée dans l'état exploring → déployer drone automatiquement
transition('onEntry', BOT_STATES.EXPLORING,
  guard((context) => !context.droneFleet?.drones?.explorer?.isActive),
  
  // REDUCE: Mettre à jour le contexte FSM (pur et déterministe)
  reduce((context, event) => {
    // Sélectionner automatiquement une zone d'exploration
    const explorationTarget = selectExplorationTarget(context);
    
    if (!explorationTarget) {
      fsmLogger.warning('[Exploring] No suitable exploration target found');
      return {
        ...context,
        hasExplored: true,
        explorationStatus: 'no_target_found',
        currentAction: 'exploration_skipped'
      };
    }

    // Utiliser le reducer de flotte FSM (mise à jour contexte uniquement)
    const deploymentResult = contextReducers.droneFleet.deployDrone(context, {
      targetArea: explorationTarget,
      droneType: 'explorer',
      priority: 'auto'
    });
    
    fsmLogger.info(`[Exploring] FSM context updated for drone deployment`, {
      target: explorationTarget,
      droneType: 'explorer',
      priority: 'auto'
    });
    
    return deploymentResult;
  })
),
```

**Mise à jour position en temps réel :**
```javascript
// Mise à jour position drone en temps réel
transition(MOVEMENT_EVENT_TYPES.DRONE_POSITION_UPDATE, BOT_STATES.EXPLORING,
  guard((context, event) => context.droneFleet?.drones?.explorer?.isActive),
  
  // REDUCE: Mettre à jour la position dans le contexte (pur)
  reduce((context, event) => {
    return contextReducers.droneFleet.updatePosition(context, {
      droneType: 'explorer',
      position: event.position,
      state: event.state
    });
  })
),
```

### Fichier: `/src/shared/actions/core/droneActions.js` (renommé)

**Rôle:** Actions pures pour le déploiement et contrôle des drones (utilisées dans les reducers).

**Configuration des drones :**
```javascript
export const DRONE_DEPLOYMENT_STATES = {
  DOCKED: 'docked',
  DEPLOYING: 'deploying', 
  ACTIVE: 'active',
  EXPLORING: 'exploring',
  RETURNING: 'returning',
  FAILED: 'failed'
};

export const DRONE_TYPES = {
  EXPLORER: 'explorer',
  COMBAT: 'combat', 
  SPECIAL: 'special'
};
```

**Actions de contexte FSM :**
```javascript
export const fsmDroneFleetActions = {
  deployDroneWithPosition: (context, event) => {
    const { targetArea, droneType } = event;
    
    // Mise à jour pure du contexte FSM
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        status: 'active',
        currentMission: {
          type: 'exploration',
          target: targetArea,
          drone: droneType,
          startTime: Date.now()
        },
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            state: DRONE_DEPLOYMENT_STATES.EXPLORING,
            targetPosition: targetArea,
            isActive: true,
            startTime: Date.now(),
            lastUpdate: Date.now()
          }
        }
      },
      isDroneAtShip: false,
      currentAction: 'drone_deployed'
    };
  },

  updateDronePosition: (context, event) => {
    const { droneType, position, state } = event;
    
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            currentPosition: position,
            state: state,
            lastUpdate: Date.now()
          }
        }
      }
    };
  },

  recallDrone: (context, event) => {
    const { droneType } = event;
    
    return {
      ...context,
      droneFleet: {
        ...context.droneFleet,
        drones: {
          ...context.droneFleet.drones,
          [droneType]: {
            ...context.droneFleet.drones[droneType],
            state: DRONE_DEPLOYMENT_STATES.RETURNING,
            targetPosition: context.position, // Position du vaisseau
            isActive: true
          }
        }
      }
    };
  }
};
```

---

## 🔗 Étape 2: Contexte FSM

### Fichier: `/src/ai/fsm/contexts/FSMContext.jsx`

**Rôle:** Fournit le contexte React pour accéder aux états FSM (inchangé).

### Fichier: `/src/components/FSM/BotInstance.jsx`

**Rôle:** Instance individuelle d'un bot FSM, capture le contexte complet.

**Hook de machine (existant) :**
```javascript
const { state, context, send } = useBotMachineFixed(botId, {
  // Configuration du bot
});

// Capture du contexte complet pour le store
useEffect(() => {
  setBotState(botId, {
    state: state.value,
    context: context, // ← Contexte complet avec droneFleet
    canTransition: state.can,
    // ...
  });
}, [state, context]);
```

### 🔄 Communication Directe via Context

**L'architecture simplifiée utilise uniquement la réactivité React :**

1. **FSM `reduce()`** → Met à jour le contexte
2. **BotInstance** → Capture les changements de contexte 
3. **Context React** → Propage automatiquement les changements
4. **Hook `useFSMDroneState`** → Accède directement au contexte mis à jour
5. **Fleet Component** → Re-render automatique via React

**Avantages de l'approche simplifiée :**
- ✅ **Déterministe** : Pas d'effets de bord asynchrones
- ✅ **Débugable** : Tous les changements tracés via React DevTools
- ✅ **Performant** : Pas de CustomEvents ni d'EventListeners
- ✅ **Simple** : Une seule source de vérité (context FSM)

---

## 🎣 Étape 3: Hook d'accès

### Fichier: `/src/hooks/useFSMDroneState.js`

**Rôle:** Hook React pour accéder à l'état des drones depuis le contexte FSM.

**Fonctions principales :**
```javascript
export const useFSMDroneState = (botId) => {
  const [droneFleet, setDroneFleet] = useState(null);
  
  // Accès au snapshot des états FSM
  const botStatesSnapshot = useFSMStore((state) => state.metrics.botStatesSnapshot);
  
  useEffect(() => {
    const botState = botStatesSnapshot[botId];
    const newDroneFleet = botState?.context?.droneFleet;
    setDroneFleet(newDroneFleet);
  }, [botId, botStatesSnapshot]);

  // Calcule les positions 3D des drones basé sur l'état FSM
  const calculateDronePositions = useCallback((shipPosition) => {
    const positions = {};
    
    Object.entries(droneFleet?.drones || {}).forEach(([droneType, drone]) => {
      switch (drone.state) {
        case 'docked':
          positions[droneType] = shipPosition;
          break;
        case 'exploring':
          positions[droneType] = drone.targetPosition || generateExplorationPosition(shipPosition);
          break;
        case 'returning':
          positions[droneType] = drone.currentPosition || shipPosition;
          break;
        default:
          positions[droneType] = shipPosition;
      }
    });
    
    return positions;
  }, [droneFleet]);

  const getDroneVisualState = useCallback((droneType) => {
    return droneFleet?.drones[droneType]?.state || 'docked';
  }, [droneFleet]);

  const isDroneMoving = useCallback((droneType) => {
    const drone = droneFleet?.drones[droneType];
    return drone?.state === 'deploying' || drone?.state === 'exploring' || drone?.state === 'returning';
  }, [droneFleet]);

  return {
    drones: droneFleet?.drones || {},
    calculateDronePositions,
    getDroneVisualState,
    isDroneMoving,
  };
};

// Fonction utilitaire pour générer une position d'exploration
function generateExplorationPosition(shipPosition) {
  const radius = 5 + Math.random() * 10; // 5-15 unités du vaisseau
  const angle = Math.random() * Math.PI * 2;
  
  return {
    x: shipPosition.x + Math.cos(angle) * radius,
    y: shipPosition.y + 1 + Math.random() * 2, // Légèrement au-dessus
    z: shipPosition.z + Math.sin(angle) * radius
  };
}
```

---

## 🚁 Étape 4: Composant Fleet

### Fichier: `/src/components/Fleet.jsx`

**Rôle:** Composant React Three Fiber qui rend les drones en 3D et réagit directement aux changements de contexte FSM.

### 🔄 Réactivité Directe via Hook

```javascript
const Fleet = React.memo(({ 
  botId, 
  shipPosition = { x: 0, y: 0, z: 0 },
  color = "red"
}) => {
  const explorerDroneRef = useRef();
  
  // ===================================================================
  // ACCÈS DIRECT AU CONTEXTE FSM VIA HOOK
  // ===================================================================
  
  // Hook pour accéder aux données drones depuis le contexte FSM
  const { drones, calculateDronePositions, getDroneVisualState, isDroneMoving } = 
    useFSMDroneState(botId);
  
  // Calcul automatique des positions en temps réel
  const dronePositions = useMemo(() => {
    return calculateDronePositions(shipPosition);
  }, [calculateDronePositions, shipPosition]);
  
  // État visuel du drone explorer
  const explorerState = getDroneVisualState('explorer');
  const isExplorerMoving = isDroneMoving('explorer');
  
  // Position cible du drone explorer depuis le contexte FSM
  const explorerPosition = dronePositions.explorer || shipPosition;

  // ===================================================================
  // RENDU 3D AVEC RÉACTIVITÉ DIRECTE
  // ===================================================================
  
  return (
    <>
      {/* Vaisseau principal */}
      <mesh position={[shipPosition.x, shipPosition.y, shipPosition.z]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Drone explorateur */}
      <group 
        ref={explorerDroneRef}
        position={[explorerPosition.x, explorerPosition.y, explorerPosition.z]}
      >
        <Cone args={[0.15, 0.4, 8]} rotation={[Math.PI, 0, 0]} castShadow>
          <meshStandardMaterial 
            color={color}
            emissive={explorerState === 'exploring' ? color : "black"}
            emissiveIntensity={explorerState === 'exploring' ? 0.8 : 0.2}
          />
        </Cone>
        
        {/* DEBUG: État FSM en temps réel */}
        {drones.explorer && (
          <Html position={[0, 0.8, 0]} center>
            <div style={{ 
              color: 'white', 
              fontSize: '16px', 
              background: 'rgba(0,0,0,0.9)', 
              padding: '8px 12px', 
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              border: '2px solid ' + color,
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                {explorerState === 'exploring' ? '🔍' : 
                 explorerState === 'returning' ? '🏠' : '🛡️'}
              </div>
              <div style={{ fontSize: '14px' }}>
                🚁 {explorerState.toUpperCase()}
                <br />
                {isExplorerMoving ? '📍 Moving' : '⚡ Idle'}
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
});
```

---

## 🔄 Étape 5: Animation useFrame

### Fichier: `/src/components/Fleet.jsx` (Animation Logic)

**Rôle:** Animation fluide basée sur les changements de position du contexte FSM.

```javascript
// Animation automatique basée sur les changements de contexte
useFrame((state, delta) => {
  if (!explorerDroneRef.current) return;
  
  // Position cible depuis le contexte FSM (mise à jour automatique)
  const targetPosition = explorerPosition;
  const currentPosition = explorerDroneRef.current.position;
  
  // Animation fluide vers la position cible
  if (isExplorerMoving) {
    const speed = delta * 2; // Vitesse d'animation
    currentPosition.x = THREE.MathUtils.lerp(currentPosition.x, targetPosition.x, speed);
    currentPosition.y = THREE.MathUtils.lerp(currentPosition.y, targetPosition.y, speed);
    currentPosition.z = THREE.MathUtils.lerp(currentPosition.z, targetPosition.z, speed);
    
    // Rotation pour le mouvement
    explorerDroneRef.current.rotation.y += delta * 2;
  }
  
  // Animation idle quand le drone est en attente
  if (explorerState === 'docked') {
    explorerDroneRef.current.rotation.y += delta * 0.5;
    explorerDroneRef.current.position.y = shipPosition.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
  }
  
  // Animation d'exploration active
  if (explorerState === 'exploring') {
    // Oscillation légère pour simuler le mouvement de recherche
    explorerDroneRef.current.position.y = targetPosition.y + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    explorerDroneRef.current.rotation.y += delta * 1.5;
  }
});
```

---

## 📊 Flux de données détaillé

### **Flow Simplifié avec reduce() uniquement**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   exploring.js  │    │ droneActions.js  │    │   React Context     │
│                 │    │                   │    │   (FSMContext)      │
│ • transition()  │    │ • fsmDroneFleet   │    │                     │
│ • reduce()      │───▶│   Actions         │───▶│ • Context updates   │
│ • guard()       │    │ • Context updates │    │ • Automatic         │
│                 │    │ • Pure functions  │    │   propagation       │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│               FSM State Transition Complete                         │
│                                                                     │
│  reduce() → Context updated with new drone state                    │
│                                                                     │
│  Context: {                                                         │
│    droneFleet: {                                                    │
│      drones: {                                                      │
│        explorer: {                                                  │
│          state: 'exploring',                                        │
│          targetPosition: {x: 5, y: 1, z: 3},                       │
│          isActive: true                                             │
│        }                                                            │
│      }                                                              │
│    }                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BotInstance Context Capture                     │
│                                                                     │
│ useEffect(() => {                                                   │
│   setBotState(botId, {                                              │
│     context: context, // ← Contexte complet avec droneFleet        │
│   });                                                               │
│ }, [state, context]);                                               │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  useFSMDroneState Hook                              │
│                                                                     │
│ const botStatesSnapshot = useFSMStore(...)                          │
│ const newDroneFleet = botState?.context?.droneFleet;                │
│ setDroneFleet(newDroneFleet);                                       │
│                                                                     │
│ calculateDronePositions(shipPosition)                               │
│ getDroneVisualState('explorer') // → 'exploring'                    │
│ isDroneMoving('explorer') // → true                                 │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Fleet Component                                 │
│                                                                     │
│ const explorerPosition = dronePositions.explorer;                   │
│ const explorerState = getDroneVisualState('explorer');              │
│ const isExplorerMoving = isDroneMoving('explorer');                 │
│                                                                     │
│ Position basée sur l'état du contexte FSM                          │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    useFrame Animation                               │
│                                                                     │
│ if (isExplorerMoving) {                                             │
│   currentPosition.lerp(targetPosition, speed);                      │
│   explorerDroneRef.current.rotation.y += delta * 2;                 │
│ }                                                                   │
│                                                                     │
│ if (explorerState === 'docked') {                                   │
│   rotation.y += delta * 0.5; // Animation idle                      │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Three.js Render                                  │
│                                                                     │
│ <group ref={explorerDroneRef} position={[explorerPosition]}>        │
│   <Cone>                                                            │
│     <meshStandardMaterial                                           │
│       emissive={explorerState === 'exploring' ? color : 'black'}    │
│     />                                                              │
│   </Cone>                                                           │
│   <Html>🚁 {explorerState.toUpperCase()}</Html>                     │
│ </group>                                                            │
└─────────────────────────────────────────────────────────────────────┘
```

### **Timeline d'un cycle complet avec reduce() uniquement**

```
T=0ms    │ User triggers exploration (or FSM auto-transitions)
         ▼
T=1ms    │ FSM: transition('onEntry', BOT_STATES.EXPLORING)
         ▼  
T=2ms    │ guard() → Check if drone can be deployed
         ▼
T=3ms    │ reduce() → Update context with drone deployment:
         │   context.droneFleet.drones.explorer = {
         │     state: 'exploring',
         │     targetPosition: {x: 5, y: 1, z: 3},
         │     isActive: true
         │   }
         ▼
T=4ms    │ BotInstance detects context change → updates FSM store
         ▼
T=5ms    │ useFSMDroneState hook detects store change
         ▼
T=6ms    │ calculateDronePositions() recalculates with new context
         ▼
T=7ms    │ Fleet re-renders with new explorerPosition and explorerState
         ▼
T=16ms   │ useFrame() animates based on context state:
         │   • isExplorerMoving = true → smooth lerp to target
         │   • explorerState = 'exploring' → rotation animation
         │   • Visual: emissive glow based on state
         ▼
T=2000ms │ Drone reaches target position (smooth animation)
         ▼
T=2001ms │ (Optional) FSM can transition to next state based on position
```

---

## 🔧 Fonctions clés

### **FSM Layer (exploring.js)**
- `transition('onEntry', ...)` - Déclenchement automatique
- `guard((context) => ...)` - Conditions de déploiement
- `reduce((context, event) => ...)` - Mise à jour pure du contexte

### **Actions Layer (droneActions.js)**
- `fsmDroneFleetActions.deployDroneWithPosition()` - Déploiement pur
- `fsmDroneFleetActions.updateDronePosition()` - Mise à jour position
- `fsmDroneFleetActions.recallDrone()` - Rappel au vaisseau

### **Hook Layer (useFSMDroneState.js)**
- `calculateDronePositions(shipPosition)` - Calcul positions 3D
- `getDroneVisualState(droneType)` - État pour animation
- `isDroneMoving(droneType)` - Détection mouvement

### **Fleet Layer (Fleet.jsx)**
- `useMemo()` - Recalcul optimisé des positions
- `useFrame()` - Boucle d'animation basée sur contexte
- Direct React props - Pas d'EventListeners

---

## 🔧 Debugging et Outils de Développement

### Logs FSM avec reduce() uniquement

```javascript
// Dans exploring.js
reduce((context, event) => {
  const result = contextReducers.droneFleet.deployDrone(context, event);
  
  fsmLogger.info(`[FSM-reduce] Drone deployment context updated`, {
    botId: context.botId,
    droneState: result.droneFleet?.drones?.explorer?.state,
    targetPosition: result.droneFleet?.drones?.explorer?.targetPosition
  });
  
  return result;
})
```

### Debug Panel Simplifié

```jsx
// Debug basé uniquement sur le contexte
<div style={{ fontSize: '10px', marginTop: '4px' }}>
  <div>State: {explorerState}</div>
  <div>Moving: {isExplorerMoving ? 'YES' : 'NO'}</div>
  <div>Position: {JSON.stringify(explorerPosition)}</div>
  <div>Active: {drones.explorer?.isActive ? 'YES' : 'NO'}</div>
</div>
```

### Console Commands

```javascript
// Accéder directement au store FSM
const store = window.__FSM_STORE__;
console.log('FSM State:', store.getState().metrics.botStatesSnapshot);

// Vérifier l'état des drones
const botState = store.getState().metrics.botStatesSnapshot['fsm-bot-0'];
console.log('Drone Fleet:', botState?.context?.droneFleet);

// Déclencher manuellement une transition FSM
const { send } = useBotMachineFixed('fsm-bot-0');
send({ type: 'DRONE_POSITION_UPDATE', position: { x: 10, y: 2, z: 10 } });
```

---

## ✅ Checklist de vérification

### Pipeline reduce() uniquement
- [ ] `reduce()` met à jour le contexte FSM correctement
- [ ] Hook `useFSMDroneState` accède au contexte mis à jour
- [ ] Fleet component re-render avec les nouvelles données
- [ ] Animation `useFrame()` réagit aux changements d'état

### Performance
- [ ] Pas de re-renders excessifs (React DevTools)
- [ ] `useMemo()` pour calculs coûteux
- [ ] `useCallback()` pour fonctions stables
- [ ] `useFrame()` optimisé

### Debug
- [ ] Logs FSM clairs
- [ ] Debug visuel montre l'état correct
- [ ] Console sans erreurs
- [ ] React DevTools montre le flow

---

## 🎓 Concepts pédagogiques

### **Pourquoi l'approche simplifiée ?**

1. **Simplicité**
   - Une seule source de vérité (contexte FSM)
   - Pas de synchronisation complexe entre état et événements
   - Débogage plus facile

2. **Performance**
   - Pas d'EventListeners à gérer
   - Réactivité native de React
   - Moins de code = moins de bugs

3. **Maintenabilité**
   - Architecture plus prévisible
   - Tests plus simples (pas d'effets de bord)
   - Évolution plus facile

### **Patterns d'Architecture Clés**

1. **Context-Driven Animation**
   - L'état FSM pilote directement l'animation
   - Pas de couche d'abstraction supplémentaire

2. **React Hooks Pattern**
   - Encapsulation de la logique d'accès FSM
   - Réutilisabilité entre composants

3. **Pure Reducers**
   - Fonctions pures pour la logique métier
   - Facilité de test et de débogage

4. **Declarative Rendering**
   - Rendu basé sur l'état, pas sur les événements
   - Plus prévisible et débugable

Cette architecture simplifiée offre une solution élégante et maintenable pour connecter FSM et animations 3D ! 🎯
