# 🚀 Guide d'utilisation XState v5 - Machine FSM

## 📋 Vue d'ensemble

La machine XState v5 est maintenant **EN PRODUCTION** et remplace complètement la version v4. Cette machine utilise l'API `setup()` moderne d'XState v5 avec un typage strict complet.

## 🎯 Utilisation principale

### **Dans le Store XFSMStore**
```typescript
import machineXV5 from '../../ai/fsm/machineX/machine.xstate.v5.ts';

// Le store utilise automatiquement la machine v5
const actor = createActor(machineXV5, { input: botContext });
```

### **Envoi d'événements typés**
```typescript
// Tous les événements sont strictement typés
actor.send({ type: 'SHIP_POSITION_UPDATE', position: { x: 10, y: 0, z: 10 } });
actor.send({ type: 'needExploring' });
actor.send({ type: 'EMERGENCY_STOP' });
```

## 🏗️ Architecture v5

### **États principaux**
- **`evaluating`** - Point central de décision
- **`exploring`** - Déploiement/scan/retour de drone
- **`collecting`** - Mouvement/collecte/retour vers base
- **`maintaining`** - Dépôt/réparation/ravitaillement

### **Sous-états détaillés**

#### État `exploring`
```
exploring
├── drone_deploying    → DRONE_REACHES_TILE → drone_scanning
├── drone_scanning     → DRONE_SCANS_TILE → drone_returning  
└── drone_returning    → DRONE_REACHES_BASE → evaluating
```

#### État `collecting`
```
collecting
├── ship_moving_to_tile → SHIP_REACHES_TILE → ship_collecting
├── ship_collecting     → SHIP_LOAD_RESOURCES → ship_returning
└── ship_returning      → SHIP_REACHES_BASE → evaluating/maintaining
```

#### État `maintaining`
```
maintaining
├── ship_on_base → (transition automatique selon besoins)
├── depositing   → SHIP_DEPOSIT_COMPLETE → evaluating
├── repairing    → SHIP_REPAIR_COMPLETE → evaluating
└── refueling    → SHIP_REFUEL_COMPLETE → evaluating
```

## ⚡ Nouveautés v5

### **Guards intelligents**
```typescript
// Transitions automatiques basées sur les conditions
always: [
  { target: 'depositing', guard: 'needsDeposit' },
  { target: 'refueling', guard: 'needsRefuel' },
  { target: 'repairing', guard: 'needsRepair' },
  { target: '#machineXV5.evaluating' }
]
```

### **Actions métier typées**
```typescript
// Actions avec modification intelligente du contexte
depositResources: createBusinessAction('depositResources', (context) => ({
  vehicle: {
    ...context.vehicle,
    resources: { food: 0, debris: 0, special: 0, total: 0 },
    isAtCapacity: false
  }
}))
```

### **Événements d'urgence**
```typescript
// Nouveaux événements pour gestion d'urgence
'EMERGENCY_STOP': '#machineXV5.maintaining',
'LOW_FUEL_WARNING': '#machineXV5.maintaining',
'RESOURCE_DEPLETED': '#machineXV5.evaluating'
```

## 🔧 API de développement

### **Ajout de nouveaux événements**
1. Ajouter dans `/src/types/events.d.ts` :
```typescript
export type MachineEvents = 
  // ...existing events...
  | { type: 'MY_NEW_EVENT'; payload?: MyPayloadType }
```

2. Ajouter dans les constantes :
```typescript
export const MACHINE_EVENT_TYPES = {
  // ...existing...
  MY_NEW_EVENT: 'MY_NEW_EVENT'
} as const;
```

### **Ajout de nouveaux guards**
```typescript
// Dans machine.xstate.v5.ts
const v5Guards = {
  // ...existing guards...
  myNewGuard: adaptLegacyGuard((context: FSMContext) => {
    return /* votre logique */;
  })
};
```

### **Ajout de nouvelles actions**
```typescript
// Actions métier avec modification du contexte
const v5Actions = {
  // ...existing actions...
  myNewAction: createBusinessAction('myNewAction', (context) => ({
    // Modifications du contexte
    vehicle: { ...context.vehicle, newProperty: 'value' }
  }))
};
```

## 🧪 Tests et validation

### **Tests automatiques**
```bash
# Exécuter les tests de migration
npm run test:migration-v5
```

### **Tests manuels**
```typescript
import { runMigrationTests } from './ai/fsm/machineX/validation/migrationTests.ts';

// Tests complets
const results = await runMigrationTests();
```

## 📈 Performance et monitoring

### **Métriques à surveiller**
- Temps d'instanciation des actors
- Fréquence des transitions d'état
- Utilisation mémoire des snapshots
- Performance des guards complexes

### **Debugging**
```typescript
// Accès au snapshot pour debugging
const snapshot = actor.getSnapshot();
console.log('Current state:', snapshot.value);
console.log('Context:', snapshot.context);
```

## 🔄 Migration de code existant

### **Depuis la v4**
```typescript
// ❌ ANCIEN (v4)
import { machineX } from './machine.xstate';

// ✅ NOUVEAU (v5)
import machineXV5 from './machine.xstate.v5.ts';
```

### **Types d'événements**
```typescript
// ❌ ANCIEN (non typé)
actor.send({ type: 'SOME_EVENT', data: anything });

// ✅ NOUVEAU (strictement typé)
actor.send({ type: 'SHIP_POSITION_UPDATE', position: { x: 10, y: 0, z: 10 } });
```

## 🚀 Conseils de production

1. **Toujours utiliser des événements typés** - Compilation TypeScript vérifie la validité
2. **Privilégier les guards pour la logique conditionnelle** - Plus lisible et testable
3. **Utiliser `createBusinessAction`** pour les actions avec logique métier
4. **Surveiller les performances** - La v5 est plus rapide mais monitorer quand même
5. **Garder la v4 en backup** - Pour rollback d'urgence si nécessaire

## 📚 Ressources

- **Machine v5** : `/src/ai/fsm/machineX/machine.xstate.v5.ts`
- **Types** : `/src/types/events.d.ts` et `/src/types/xstate.types.ts`
- **Tests** : `/src/ai/fsm/machineX/validation/migrationTests.ts`
- **Documentation** : `/docs/XSTATE_V5_MIGRATION_PLAN.md`

---

**🎉 La machine v5 est prête pour la production ! 🎉**
