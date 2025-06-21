# React-Robot & XState - Bonnes Pratiques & Syntaxes

> 📚 **Guide de référence** pour l'utilisation correcte de react-robot et XState dans le projet
> 
> **Date de création** : 11 juin 2025  
> **Contexte** : Résolution du problème de transmission d'événements UPDATE_POSITION

---

## 🎯 Problème Résolu : Transmission d'Événements avec Données

### ❌ ERREUR COMMUNE : Syntaxe Incorrecte
```javascript
// ❌ FAUX - Ne fonctionne PAS avec react-robot/XState
send(eventObject.type, {
  position: eventObject.position,
  coord: eventObject.coord,
  newCoord: eventObject.newCoord,
  entityType: eventObject.entityType,
  timestamp: eventObject.timestamp
});
```

**Résultat** : L'action ne reçoit que le type d'événement comme chaîne, sans les données.

### ✅ SYNTAXE CORRECTE : Objet Événement Complet
```javascript
// ✅ CORRECT - Passer l'objet événement ENTIER
const eventObject = movementEvents.createUpdatePositionEvent(
  visualPosition,
  'ship',
  tileCoord,
  tileCoord
);

send(eventObject); // Passer l'objet complet, PAS juste le type
```

**Résultat** : L'action reçoit toutes les propriétés de l'événement.

---

## 🔍 Diagnostic et Validation

### Logs de Validation Réussie
```javascript
// Dans l'action updatePosition
fsmLogger.context(`🔄 [updatePosition] Event received:`, {
  eventType: event.type,
  hasPosition: !!event.position,
  hasCoord: !!event.coord,
  hasNewCoord: !!event.newCoord,
  entityType: event.entityType,
  fullEvent: event
});

// Résultat attendu :
// hasPosition: true, hasCoord: true, hasNewCoord: true
```

### Structure d'Événement Correcte
```javascript
const correctEvent = {
  type: 'UPDATE_POSITION',
  position: { x: 5, y: 0, z: 3 },
  entityType: 'ship',
  coord: '5,3',
  newCoord: '5,3',
  timestamp: Date.now()
};
```

---

## 🏗️ Architecture des Événements FSM

### 1. Création d'Événements (Factory Pattern)
```javascript
// src/ai/fsm/machine/events/movementEvents.js
export const createUpdatePositionEvent = (position, entityType = 'ship', coord = null, newCoord = null) => ({
  type: UPDATE_POSITION,
  position,
  entityType,
  coord,
  newCoord,
  timestamp: Date.now()
});
```

### 2. Envoi depuis les Trackers
```javascript
// src/ai/fsm/hooks/useFSMShipTracker.js
const eventObject = movementEvents.createUpdatePositionEvent(
  visualPosition,
  'ship',
  tileCoord,
  tileCoord
);

// ✅ Syntaxe correcte
send(eventObject);
```

### 3. Réception dans les Actions
```javascript
// src/ai/fsm/machine/actions/core/movementActions.js
updatePosition: (context, event) => {
  // ✅ Toutes les propriétés sont disponibles
  const { position, coord, newCoord, entityType } = event;
  
  if (!position || !coord || !newCoord) {
    return context; // Gestion d'erreur
  }
  
  return {
    ...context,
    vehicle: {
      ...context.vehicle,
      position,
      coord: newCoord
    }
  };
}
```

---

## 🔄 Flux de Données Complet

```
1. Animation Hook          2. Tracker               3. Event Factory
   ↓                          ↓                        ↓
   visualPosition      →   handleInitialPosition  →   createUpdatePositionEvent()
                                                        ↓
4. XState Send             5. State Transition      6. Action Execution
   ↓                          ↓                        ↓
   send(eventObject)   →   EVALUATING state    →   updatePosition(context, event)
```

---

## 🛡️ Prévention des Erreurs

### Validation avant Envoi
```javascript
const eventObject = movementEvents.createUpdatePositionEvent(
  visualPosition,
  'ship',
  tileCoord,
  tileCoord
);

// ✅ Validation recommandée
fsmLogger.context(`🚀 Sending UPDATE_POSITION event:`, {
  hasPosition: !!eventObject.position,
  hasCoord: !!eventObject.coord,
  hasNewCoord: !!eventObject.newCoord,
  eventData: eventObject
});

send(eventObject);
```

### Pattern de Debug pour Actions
```javascript
updatePosition: (context, event) => {
  // Debug détaillé
  fsmLogger.context(`🔄 [updatePosition] Event received:`, {
    eventType: event.type,
    hasPosition: !!event.position,
    hasCoord: !!event.coord,
    hasNewCoord: !!event.newCoord,
    entityType: event.entityType,
    fullEvent: event
  });
  
  // Validation des conditions
  const hasValidData = event.position && event.coord && event.newCoord;
  
  fsmLogger.context(`🧪 [updatePosition] Condition checks:`, {
    hasPosition: !!event.position,
    hasCoord: !!event.coord,
    hasNewCoord: !!event.newCoord,
    willPass: hasValidData,
    condition: `!${!event.position} && !${!event.coord} && !${!event.newCoord}`
  });
  
  if (!hasValidData) {
    fsmLogger.error(`❌ [updatePosition] No position data found in event:`, {
      event: event.type || event,
      checks: {
        hasPosition: !!event.position,
        hasCoord: !!event.coord,
        hasNewCoord: !!event.newCoord
      }
    });
    return context;
  }
  
  // Logique principale...
}
```

---

## 📋 Checklist de Validation

### ✅ Envoi d'Événements
- [ ] Utiliser la factory d'événements appropriée
- [ ] Passer l'objet événement ENTIER à `send()`
- [ ] Ne jamais passer `send(type, data)` 
- [ ] Ajouter des logs de validation avant envoi

### ✅ Réception d'Événements  
- [ ] Valider la présence des propriétés attendues
- [ ] Ajouter des logs de debug détaillés
- [ ] Gérer les cas d'erreur avec retour de contexte
- [ ] Tester avec des logs de condition

### ✅ Structure d'Événements
- [ ] Inclure un `type` explicite
- [ ] Ajouter un `timestamp` pour le debugging
- [ ] Utiliser des noms de propriétés cohérents
- [ ] Documenter la structure attendue

---

## 🚀 Exemples d'Autres Événements

### Événement Drone
```javascript
// ✅ Correct
const droneEvent = movementEvents.createDroneReachedTargetEvent(
  visualPosition,
  tileCoord,
  'explorer'
);
send(droneEvent);
```

### Événement Ressource
```javascript
// ✅ Correct  
const resourceEvent = resourceEvents.createResourceFoundEvent(
  resourceData,
  tileCoord
);
send(resourceEvent);
```

---

## 🎯 Récapitulatif

**RÈGLE D'OR** : Avec react-robot/XState, **toujours passer l'objet événement complet** à `send()`.

- ✅ `send(eventObject)`
- ❌ `send(eventObject.type, { data })`

Cette règle simple évite 99% des problèmes de transmission de données dans les machines d'état XState.

---

*Dernière mise à jour : Juin 2025 - Problème UPDATE_POSITION résolu avec succès*
