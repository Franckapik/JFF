# 🗂️ Plan de migration XState — État `exploring`

## 1. Préparation de l’architecture
- [ ] Créer les fichiers vides nécessaires dans `machineX` :
  - `states/exploring.state.js`
  - `actions/exploring.actions.js`
  - (optionnel) `guards/exploring.guards.js` si des guards spécifiques à exploring sont nécessaires
- [ ] Ajouter les entrées correspondantes dans les `index.js` (`states`, `actions`, `guards` si besoin).

## 2. Migration des constantes
- [ ] Identifier et migrer dans `config/constants.js` uniquement les constantes utilisées par l’état `exploring` (seuils, types, etc.).

## 3. Migration des guards
- [ ] Migrer les guards utilisés par `exploring` dans un fichier dédié (`guards/exploring.guards.js` ou dans les guards existants si déjà centralisés).
- [ ] Centraliser les exports dans `guards/index.js`.

## 4. Configuration des événements
- [ ] Lister et migrer dans `config/events.config.js` uniquement les événements utilisés par l’état `exploring` (et urgences associées).

## 5. Migration des actions
- [ ] Migrer les actions d’entrée/sortie et internes de l’état `exploring` dans `actions/exploring.actions.js`.
- [ ] Centraliser dans `actions/index.js`.

## 6. Recréation de l’état `exploring`
- [ ] Recréer l’état `exploring` dans `states/exploring.state.js` selon la logique XState actuelle (transitions, actions, guards).
- [ ] Centraliser dans `states/index.js`.

## 7. Intégration dans la machine principale
- [ ] Intégrer l’état `exploring` dans `machine.xstate.js` (remplacer l’état temporaire).
- [ ] S’assurer que les actions/guards sont bien centralisés.

## 8. Export principal
- [ ] Mettre à jour `machineX/index.js` pour exposer le nouvel état, ses actions, guards, et la config.

## 9. Validation continue
- [ ] À chaque étape, valider la compilation (aucune erreur).
- [ ] Mettre à jour ce plan en cochant chaque étape terminée.

## 10. Documentation
- [ ] Ajouter/compléter la documentation dans chaque fichier d’index si besoin.
- [ ] Vérifier la cohérence des imports/exports dans tous les index.

## 11. (Optionnel) Enrichissement
- [ ] Ajouter des transitions internes ou sous-états détaillés pour `exploring` si nécessaire.
- [ ] Nettoyer ou enrichir la documentation.
