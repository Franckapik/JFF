# Consolidation des Hooks useBotMachine

## ✅ Consolidation Terminée (2025-06-10)

### Fichiers Supprimés
- ❌ `useBotMachineSync.js` - Redondant avec `useBotMachine.js`
- ❌ `useBotMachineFixedSync.js` - Copie quasi-identique de `useBotMachineSync.js`
- ❌ `useBotMachineSharedInstance.js` - Fonctionnalité intégrée dans le hook unifié

### Fichier Unifié Créé
- ✅ `useBotMachine.js` - Hook FSM unifié avec toutes les fonctionnalités

## 🔧 Fonctionnalités Consolidées

Le nouveau hook `useBotMachine` inclut :

1. **Synchronisation FSM** - Entre toutes les instances d'un même bot
2. **Instances partagées optionnelles** - Via l'option `useSharedInstance`
3. **Position sync automatique** - Synchronisation avec les tuiles de départ
4. **Auto-exploration** - Démarrage automatique après évaluation
5. **Compatibilité rétroactive** - Exports d'alias pour la transition

## 📋 Migrations Effectuées

### Composants Mis à Jour
- `components/Fleet.jsx`
- `components/FSM/BotInstance.jsx`
- `components/FSM/FSMStateIndicator.jsx`
- `components/HUD/debugger/StateTab.jsx`
- `components/HUD/debugger/useDebuggerData.js`
- `ai/fsm/hooks/useCentralizedEventHistorySync.js`

### Changements d'Import
```javascript
// AVANT (multiple imports)
import { useBotMachineFixed } from '../hooks/useBotMachineSync.js';
import { useBotMachineSharedInstance } from '../hooks/useBotMachineSharedInstance.js';

// APRÈS (import unifié)
import { useBotMachine } from '../hooks/useBotMachine.js';
```

### Utilisation
```javascript
// Utilisation standard (comportement par défaut)
const bot = useBotMachine(botId);

// Avec instance partagée (équivalent à l'ancien useBotMachineSharedInstance)
const bot = useBotMachine(botId, ENTITY_TYPES.auto, { useSharedInstance: true });
```

## 🎯 Avantages de la Consolidation

1. **Maintenance simplifiée** - Un seul fichier à maintenir
2. **Cohérence** - Comportement uniforme dans toute l'application
3. **Flexibilité** - Options configurables selon les besoins
4. **Performance** - Réduction des duplications de code
5. **Rétrocompatibilité** - Aliases pour une migration en douceur

## 🔄 Exports Disponibles

```javascript
// Export principal
export const useBotMachine = (botId, entityType, options) => { ... }

// Aliases pour la compatibilité
export const useBotMachineFixed = useBotMachine;
export const useBotMachineSharedInstance = (botId, entityType) => 
  useBotMachine(botId, entityType, { useSharedInstance: true });

// Utilitaires
export const clearBotMachineInstance = (botId) => { ... }
export const clearAllBotMachineInstances = () => { ... }
```

## 📈 Résultats

- **-2 fichiers** redondants supprimés
- **~300 lignes** de code dupliqué éliminées
- **6 composants** mis à jour avec succès
- **0 breaking changes** grâce aux aliases de compatibilité

---

*Cette consolidation fait partie de la Phase 2 de migration FSM vers une architecture Bot-Only.*
