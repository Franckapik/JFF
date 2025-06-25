# Plan de migration progressive vers XState/@xstate/react

> **Note : Ce plan vise à migrer l’architecture FSM actuelle vers un système XState intégré à Zustand, afin de centraliser l’état et les transitions, et de rendre toutes les informations FSM accessibles à tous les composants React via le store Zustand.**
>
> **Ce modèle remplace progressivement le besoin d’un context React dédié pour la FSM, car Zustand (avec XState) permet un accès global, réactif et typé à l’état de la machine.**
>
> **Le context React FSM (`FSMContext.jsx`, `FSMSyncContext.jsx`) ne sera plus nécessaire à terme, sauf cas très spécifiques (scope local, injection dynamique, etc.).**

Ce plan détaille les étapes à suivre, prompt par prompt, pour migrer l’ensemble du système FSM actuel (robot3 + Zustand) vers XState v5 et @xstate/react, tout en gardant la structure modulaire et la stabilité du projet.

---

## 1. Préparation et audit
- [ ] Relire et valider l’architecture actuelle (voir `FSM_ARCHITECTURE_ACTUELLE.md`).
- [ ] Lister tous les usages de la machine robot3 (composants, hooks, contextes, stores).
- [ ] Identifier les états, actions, guards, events à migrer.

## 2. Migration de la machine centrale
- [ ] Migrer la machine centrale (ex-`machineFactory.js`) vers une machine XState complète, en gardant la structure des états, transitions, contextes.
- [ ] Ajouter les actions, guards, events dans la config XState.
- [ ] Tester la machine seule (unit tests ou playground XState).

## 3. Migration des hooks FSM
- [ ] Créer un hook `useBotMachineXState` basé sur @xstate/react (`useMachine` ou `useActor`), pour remplacer progressivement `useBotMachine`.
- [ ] Adapter un composant test (ex: BotInstance) pour utiliser ce nouveau hook.
- [ ] Vérifier la compatibilité avec Zustand si besoin (store global ou local).

## 4. Migration des contextes React
- [ ] Adapter `FSMContext.jsx` et `FSMSyncContext.jsx` pour fournir la machine XState et ses services via React context.
- [ ] Remplacer l’injection de la machine robot3 par la machine XState dans les providers.

## 5. Migration des composants consommateurs
- [ ] Adapter les composants principaux (BotInstance, FSMStateIndicator, Fleet, FusedBotManagerHUD, etc.) pour utiliser le hook XState.
- [ ] Remplacer l’accès à l’état et l’envoi d’événements par ceux de XState.
- [ ] Tester chaque composant indépendamment.

## 6. Migration des stores et synchronisation globale
- [ ] Adapter ou remplacer `useFSMStore` pour qu’il utilise XState (ou bien supprimer si tout passe par XState/@xstate/react).
- [ ] Vérifier la synchronisation des bots multiples (si besoin, utiliser des machines XState par bot).
- [ ] Adapter la gestion de l’historique, des métriques, etc.

## 7. Migration des utilitaires et modules annexes
- [ ] Adapter les modules d’actions, guards, events pour XState (exporter des fonctions compatibles XState).
- [ ] Tester les guards/actions dans la config XState.

## 8. Nettoyage et documentation
- [ ] Supprimer les dépendances à robot3 et les anciens hooks/stores non utilisés.
- [ ] Mettre à jour la documentation (README, schémas, etc.).
- [ ] Documenter les patterns XState retenus (machines hiérarchiques, spawn, etc.).

---

## Stratégie de prompts (séquençage conseillé)

1. **Prompt 1** : Migrer la machine centrale (machineFactory.js → fsmMachine.xstate.js complet)
2. **Prompt 2** : Créer/adapter le hook `useBotMachineXState` et l’utiliser dans un composant test
3. **Prompt 3** : Adapter les contextes React pour XState
4. **Prompt 4** : Migrer un composant clé (BotInstance ou FSMStateIndicator) vers XState
5. **Prompt 5** : Adapter le store global (si besoin) et la gestion multi-bots
6. **Prompt 6** : Migrer les actions, guards, events
7. **Prompt 7** : Nettoyer, tester, documenter

---

**Ce plan peut être suivi prompt par prompt pour une migration progressive, sûre et testable.**
