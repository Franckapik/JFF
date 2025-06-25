# Architecture actuelle du système FSM (avant migration XState)

## 1. Organisation des dossiers

```
src/
  ai/
    fsm/
      index.js                # Point d'entrée, exports centralisés
      fsmMachine.xstate.js    # (Nouveau) Machine XState minimale (test)
      machine/
        machineFactory.js     # Machine FSM robot3 (ancienne)
        constants/constants.js# Constantes globales FSM
        context/initialContext.js # Création du contexte initial
        states/               # États modulaires (evaluatingState, exploringState...)
        actions/              # Actions FSM
        events/               # Événements FSM
        guards/               # Guards FSM
      hooks/
        useBotMachine.js      # Hook principal pour utiliser la machine FSM (robot3)
        useFSMDroneTracker.js # Tracker drone
        useFSMShipTracker.js  # Tracker vaisseau
        ...
      contexts/
        FSMContext.jsx        # Fournisseur de contexte FSM (React)
        FSMSyncContext.jsx    # Fournisseur de contexte synchronisé FSM
  stores/
    useFSMStore/             # Store Zustand pour bots FSM (robot3)
      index.js
    useCentralFSMStore.js    # Nouveau store Zustand + XState (centralisé)
    zustandXStateMiddleware.js # Middleware Zustand/XState v5
    ...
  hooks/
    useFSM.js                # Hook d'accès rapide à la machine centrale XState
  components/
    FSM/
      BotInstance.jsx        # Instance visuelle d'un bot FSM
      FSMStateIndicator.jsx  # Indicateur d'état FSM
      FusedBotManagerHUD.jsx # HUD de gestion FSM
    HUD/
      CentralFSMHud.jsx      # HUD centralisé pour la machine XState
      Clock.jsx, TileStoreMonitor.jsx
    Fleet.jsx, Scene.jsx, ...
```

## 2. Technologies utilisées
- **robot3** : Ancienne machine FSM (modulaire, utilisée dans la majorité du code)
- **zustand** : Store global pour bots, events, etc.
- **xstate v5** : (Nouveau) Machine centrale de test, intégrée via middleware
- **@xstate/react** : (installé, pas encore utilisé dans les hooks)

## 3. Points d'entrée FSM
- `src/ai/fsm/index.js` : Exporte tous les hooks, machines, contextes, actions, guards, etc.
- `src/ai/fsm/machine/machineFactory.js` : Fabrique la machine robot3 (ancienne)
- `src/ai/fsm/machine/fsmMachine.xstate.js` : Machine XState minimale (test)
- `src/stores/useFSMStore/index.js` : Store Zustand pour robot3
- `src/stores/useCentralFSMStore.js` : Store Zustand pour XState

## 4. Utilisation dans les composants
- `useBotMachine` (robot3) : utilisé dans la majorité des composants FSM (BotInstance, Fleet, FSMStateIndicator...)
- `useFSM` (XState) : utilisé dans CentralFSMHud.jsx

## 5. Hooks et contextes
- `useBotMachine.js` : Hook principal pour robot3
- `useFSM.js` : Hook pour la machine centrale XState
- `FSMContext.jsx`, `FSMSyncContext.jsx` : Fournisseurs de contexte React

## 6. Stores
- `useFSMStore` : Zustand, multi-bots, robot3
- `useCentralFSMStore` : Zustand, centralisé, XState

## 7. HUDs et UI
- `FusedBotManagerHUD` : Gestion multi-bots (robot3)
- `CentralFSMHud` : HUD centralisé (XState)
- `FSMStateIndicator`, `BotInstance` : Affichage état bot

## 8. Migration prévue
- Remplacer progressivement la logique robot3 par XState dans les machines, hooks et stores.
- Adapter les hooks et contextes pour utiliser XState et @xstate/react.
- Garder la structure modulaire (états, actions, guards, events).

---

**Ce fichier sert de référence pour la migration XState et la compréhension de l’architecture FSM actuelle.**
