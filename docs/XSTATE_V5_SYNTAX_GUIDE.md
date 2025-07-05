# 📚 GUIDE DE SYNTAXE XSTATE v5 - Référence Complète

**Date de création :** 6 juillet 2025  
**Version XState :** v5.x  
**Contexte :** Corrections réalisées lors du debugging de la mise à jour de position du vaisseau

---

## 🎯 **PROBLÈMES RÉSOLUS ET LEÇONS APPRISES**

### ❌ **Problème Initial**
- Les actions `updateShipPosition` et `updateDronePosition` recevaient `event = undefined`
- Les événements étaient bien émis et transmis au store, mais n'arrivaient pas aux actions
- La position du vaisseau restait à `(0,0,0)` au lieu de la vraie position

### ✅ **Solution Appliquée**
- Utilisation d'`assign()` pour les actions qui modifient le contexte
- Configuration correcte des event handlers globaux

---

## 🔧 **SYNTAXE XSTATE v5 - ÉLÉMENTS CRITIQUES**

### 1. **IMPORTS ESSENTIELS**

```javascript
import { createMachine, assign } from 'xstate';
```

**Points clés :**
- `assign` doit être importé explicitement pour les actions qui modifient le contexte
- `createMachine` reste le même qu'en v4

### 2. **CONFIGURATION DES ACTIONS GLOBALES**

#### ❌ **SYNTAXE INCORRECTE (ne fonctionne pas)**
```javascript
on: {
  SHIP_POSITION_UPDATE: {
    actions: 'updateShipPosition'  // ❌ String action
  },
  DRONE_POSITION_UPDATE: {
    actions: [{
      type: 'updateDronePosition'  // ❌ Object action sans assign
    }]
  }
}
```

#### ✅ **SYNTAXE CORRECTE (fonctionne)**
```javascript
on: {
  SHIP_POSITION_UPDATE: {
    actions: assign(({ context, event }) => {
      console.log('Debug:', { context: !!context, event: !!event });
      return allActions.updateShipPosition(context, event);
    })
  },
  DRONE_POSITION_UPDATE: {
    actions: assign(({ context, event }) => {
      return allActions.updateDronePosition(context, event);
    })
  }
}
```

### 3. **SIGNATURES DES ACTIONS**

#### **Actions qui modifient le contexte (assign)**
```javascript
// Signature recommandée pour XState v5
export const updateShipPosition = (context, event) => {
  // Validation
  if (!event) {
    console.warn('Event is undefined');
    return context; // Retourner contexte inchangé
  }
  
  // Traitement
  const { position, botId, shipType } = event;
  
  // Retourner nouveau contexte
  return {
    ...context,
    vehicle: {
      ...context.vehicle,
      position: { ...position },
      lastPositionUpdate: Date.now()
    }
  };
};
```

#### **Actions d'effet (side effects)**
```javascript
// Pour les actions qui ne modifient pas le contexte
export const logAction = ({ context, event }) => {
  console.log('Action triggered:', event.type);
  // Pas de retour nécessaire
};
```

### 4. **CONFIGURATION COMPLÈTE DE LA MACHINE**

```javascript
export const machineX = createMachine({
  id: 'machineX',
  initial: 'initialState',
  
  // Contexte initial
  context: ({ input }) => {
    return createInitialContext(input);
  },
  
  // Event handlers globaux
  on: {
    GLOBAL_EVENT: {
      actions: assign(({ context, event }) => {
        return actionFunction(context, event);
      })
    }
  },
  
  // États
  states: {
    initialState: {
      // Configuration de l'état
    }
  }
}, {
  // Configuration des guards et actions
  guards: {
    ...allGuards
  },
  actions: {
    ...allActions  // Actions disponibles par nom
  }
});
```

### 5. **PATTERNS DE DÉBOGAGE**

#### **Debug dans assign**
```javascript
actions: assign(({ context, event }) => {
  console.log('🔍 DEBUG:', {
    eventType: event?.type,
    hasContext: !!context,
    hasEvent: !!event,
    contextKeys: Object.keys(context || {})
  });
  return actionFunction(context, event);
})
```

#### **Debug dans les actions**
```javascript
export const debugAction = (context, event) => {
  console.log('Action called with:', {
    contextType: typeof context,
    eventType: typeof event,
    eventKeys: event ? Object.keys(event) : 'no event'
  });
  
  // Traitement...
  return newContext;
};
```

---

## ⚠️ **PIÈGES COURANTS ET SOLUTIONS**

### 1. **Event undefined dans les actions**
**Cause :** Action configurée sans `assign()`  
**Solution :** Utiliser `assign()` pour toutes les actions qui modifient le contexte

### 2. **Actions non trouvées**
**Cause :** Mauvais export/import des actions  
**Solution :** Vérifier la structure d'export des actions dans `index.js`

### 3. **Contexte non mis à jour**
**Cause :** Action ne retourne pas le nouveau contexte  
**Solution :** Toujours retourner un objet contexte depuis les actions assign

### 4. **Event handlers ignorés**
**Cause :** Mauvaise configuration des transitions globales  
**Solution :** Utiliser la section `on:` au niveau racine de la machine

---

## 🔍 **DIAGNOSTIC RAPIDE**

### **Vérifications essentielles :**

1. **Import d'assign :** `import { createMachine, assign } from 'xstate'`
2. **Event handlers globaux :** Utilisent `assign(({ context, event }) => ...)`
3. **Actions :** Retournent un nouveau contexte
4. **Export des actions :** Structure correcte dans `actions/index.js`

### **Logs de diagnostic :**
```javascript
// Dans assign
console.log('Assign called:', { context: !!context, event: !!event, eventType: event?.type });

// Dans l'action
console.log('Action called:', { contextType: typeof context, eventType: typeof event });
```

---

## 📋 **CHECKLIST DE VALIDATION**

- [ ] `assign` importé depuis 'xstate'
- [ ] Actions globales utilisent `assign(({ context, event }) => ...)`
- [ ] Actions retournent un nouveau contexte
- [ ] Events arrivent avec les bonnes données
- [ ] Store transmet correctement les événements
- [ ] Contexte FSM se met à jour correctement

---

## 🏆 **RÉSULTAT FINAL**

Avec cette configuration, les événements `SHIP_POSITION_UPDATE` et `DRONE_POSITION_UPDATE` :
1. Sont correctement reçus par la machine XState
2. Passent par `assign()` avec `context` et `event` valides
3. Appellent les actions avec les bons paramètres
4. Mettent à jour le contexte FSM correctement
5. Propagent les changements vers les composants React

**Note importante :** Cette syntaxe est spécifique à XState v5 et peut différer des versions antérieures.
