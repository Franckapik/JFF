# Plan de migration du composant FusedBotManagerHUD

Ce fichier détaille les étapes pour migrer le composant `FusedBotManagerHUD` de l'ancien store `useFSMStore` vers le nouveau système `useCentralFSMStore` avec `useFSM`.

## Diagnostic

Le composant `FusedBotManagerHUD` utilise actuellement l'ancien store `useFSMStore` qui est basé sur robot3, alors que le reste de l'application a été migré vers XState v5 + Zustand via `useCentralFSMStore`.

## Étapes de migration

1. **Remplacer l'import**
   ```jsx
   // Ancien import
   import useFSMStore from '../../stores/useFSMStore/index.js';
   
   // Nouvel import
   import { useFSM } from '../../hooks/useFSM';
   import { useCentralFSMStore } from '../../stores/useCentralFSMStore';
   ```

2. **Remplacer les accès au store**
   ```jsx
   // Ancien code
   const {
     activeBots,
     botStates,
     addBot: addBotToStore,
     removeBot: removeBotFromStore,
     startSystem,
     stopSystem,
     toggleSystem,
     getBotCount,
     updateBotStatesSnapshot
   } = useFSMStore();
   
   // Nouveau code
   const {
     allBots: activeBots,
     addBot: addBotToStore,
     removeBot: removeBotFromStore,
   } = useFSM();
   
   // Obtenir les états des bots
   const botStates = useCentralFSMStore(state => state.botStates);
   
   // Simuler les fonctions non directement disponibles
   const getBotCount = () => activeBots.length;
   const startSystem = () => console.log('startSystem not needed in new architecture');
   const stopSystem = () => console.log('stopSystem not needed in new architecture');
   const toggleSystem = () => console.log('toggleSystem not needed in new architecture');
   const updateBotStatesSnapshot = (states) => console.log('updateBotStatesSnapshot not needed, Zustand handles this automatically');
   ```

3. **Adapter les fonctions d'envoi d'événements**
   ```jsx
   // Ancien code
   const sendEventToBot = (botId, eventType, payload = {}) => {
     const event = { type: eventType, ...payload };
     useFSMStore.getState().sendEventToBot(botId, event);
   };
   
   // Nouveau code
   const sendEventToBot = (botId, eventType, payload = {}) => {
     const event = { type: eventType, ...payload };
     useCentralFSMStore.getState().send(event, botId);
   };
   ```

4. **Adapter l'affichage des états**
   ```jsx
   // Ancien code
   const botState = botStates[botId];
   const stateName = botState?.value || 'offline';
   
   // Nouveau code
   const botState = botStates[botId];
   const stateName = botState?.value || 'offline';
   ```

## Avantages de la migration

1. **Cohérence** : Tous les composants utiliseront le même système d'état
2. **Performance** : Moins de duplication d'état en mémoire
3. **Maintainabilité** : Code plus simple et plus facile à comprendre
4. **Typage** : Meilleur support TypeScript avec XState v5

## Note sur les événements d'historique

Si `FusedBotManagerHUD` utilise l'historique des événements de l'ancien store, il faudra adapter cette partie pour utiliser un système d'historique des événements dans le nouveau store Zustand.

```jsx
// Ajouter au useCentralFSMStore.js
eventHistory: [],
addEventToHistory: (event, botId) => set((state) => ({
  eventHistory: [...state.eventHistory.slice(-99), { botId, event, timestamp: Date.now() }]
})),
```

Cette fonctionnalité peut être ajoutée lors d'une mise à jour future si nécessaire.
