# Plan de Migration - État EVALUATING vers XState

## 🎯 Objectif
Migrer uniquement l'état `evaluating` de Robot3 vers XState dans une nouvelle architecture `machineX`, en conservant l'ancien système comme référence.

## 📁 Architecture Cible

```
src/ai/fsm/machineX/
├── machine.xstate.js              # Machine principale XState
├── config/
│   ├── constants.js               # Constantes nécessaires uniquement
│   └── events.config.js           # Événements pour evaluating
├── guards/
│   ├── index.js                   # Export centralisé
│   ├── safety.guards.js           # Guards de sécurité
│   ├── efficiency.guards.js       # Guards d'efficacité
│   └── discovery.guards.js        # Guards d'exploration
├── actions/
│   ├── index.js                   # Export centralisé
│   └── evaluating.actions.js      # Actions spécifiques à evaluating
└── states/
    ├── index.js                   # Export centralisé
    └── evaluating.state.js        # Configuration état evaluating
```

---

## 🚀 Plan de Migration par Prompts

### **PROMPT 1 : Création de l'architecture de base**

**Objectif** : Créer la structure de dossiers et les fichiers vides

**Actions à demander** :
1. Créer le dossier `src/ai/fsm/machineX/` avec toute la structure
2. Créer tous les fichiers vides avec headers de documentation
3. Créer `config/constants.js` en s'inspirant de l'existant mais UNIQUEMENT les constantes utilisées par evaluating

**Fichiers à créer** :
- `machineX/config/constants.js` (constantes minimales)
- `machineX/config/events.config.js` (vide avec TODO)
- `machineX/guards/index.js` (export vide)
- `machineX/guards/safety.guards.js` (structure vide)
- `machineX/guards/efficiency.guards.js` (structure vide) 
- `machineX/guards/discovery.guards.js` (structure vide)
- `machineX/actions/index.js` (export vide)
- `machineX/actions/evaluating.actions.js` (structure vide)
- `machineX/states/index.js` (export vide)
- `machineX/states/evaluating.state.js` (structure vide)

---

### **PROMPT 2 : Migration des constantes essentielles**

**Objectif** : Identifier et migrer uniquement les constantes utilisées par l'état evaluating

**Actions à demander** :
1. Analyser `machine/constants/constants.js` existant
2. Extraire UNIQUEMENT les constantes utilisées dans l'état evaluating de Robot3
3. Réécrire ces constantes pour XState dans `machineX/config/constants.js`

**Constantes probables à migrer** :
- `BOT_STATES.EVALUATING`, `BOT_STATES.EXPLORING_DEPLOYING`, etc.
- `EXPLORATION_CYCLE_CONFIG` (seuils d'exploration)
- `DEFAULT_CAPACITIES` (capacités par défaut)
- `VEHICLE_TYPES` (types de véhicules)

**Résultat attendu** : Un fichier `constants.js` propre avec uniquement le nécessaire

---

### **PROMPT 3 : Migration des guards de sécurité**

**Objectif** : Migrer les guards de sécurité utilisés dans evaluating

**Actions à demander** :
1. Analyser `machine/guards/safetyGuard.js` existant
2. Identifier les guards utilisés dans `evaluatingState.js` de Robot3
3. Réécrire ces guards en syntaxe XState dans `machineX/guards/safety.guards.js`

**Guards à migrer** :
- `needsEmergencyReturn` 
- `isCriticalFuel`
- Autres guards de sécurité utilisés dans evaluating

**Résultat attendu** : Fichier `safety.guards.js` avec syntaxe XState native

---

### **PROMPT 4 : Migration des guards d'efficacité**

**Objectif** : Migrer les guards d'efficacité utilisés dans evaluating

**Actions à demander** :
1. Analyser `machine/guards/efficiencyGuard.js` existant
2. Identifier les guards utilisés dans les transitions de `evaluatingState.js`
3. Réécrire en syntaxe XState dans `machineX/guards/efficiency.guards.js`

**Guards à migrer** :
- `shouldReturnForEfficiency`
- `isFullTank` (si utilisé)
- Autres guards d'efficacité dans evaluating

---

### **PROMPT 5 : Migration des guards de découverte**

**Objectif** : Migrer les guards d'exploration/découverte

**Actions à demander** :
1. Analyser `machine/guards/discoveryGuard.js` existant  
2. Identifier tous les guards utilisés dans evaluating (le plus complexe)
3. Réécrire en syntaxe XState dans `machineX/guards/discovery.guards.js`

**Guards à migrer** :
- `hasBestTileForCollection`
- `hasExploredEnoughTiles`
- `shouldTransitionToCollection`
- `hasUnexploredAreas`
- `needsExploration`

---

### **PROMPT 6 : Configuration des événements**

**Objectif** : Définir les événements utilisés par l'état evaluating

**Actions à demander** :
1. Analyser tous les événements utilisés dans `evaluatingState.js` de Robot3
2. Créer la configuration des événements dans `machineX/config/events.config.js`
3. Organiser par catégories (système, mouvement, urgence, etc.)

**Événements à configurer** :
- `EVALUATION_COMPLETE`
- `SHIP_UPDATE_POSITION` 
- `DRONE_POSITION_UPDATE`
- Événements de transition vers autres états

---

### **PROMPT 7 : Migration des actions evaluating**

**Objectif** : Migrer les actions spécifiques à l'état evaluating

**Actions à demander** :
1. Analyser les actions utilisées dans `evaluatingState.js` de Robot3
2. Extraire la logique actuelle de `action_evaluating_entry` du fichier existant
3. Réécrire en architecture modulaire dans `machineX/actions/evaluating.actions.js`

**Actions à migrer** :
- `action_evaluating_entry` (logique d'évaluation complexe)
- `action_evaluating_exit`
- Actions de mise à jour de contexte
- Actions de logging spécialisées

---

### **PROMPT 8 : Configuration de l'état evaluating**

**Objectif** : Créer la configuration complète de l'état evaluating

**Actions à demander** :
1. Analyser toutes les transitions de `evaluatingState.js` de Robot3
2. Reconstruire l'état evaluating complet dans `machineX/states/evaluating.state.js`
3. Utiliser tous les guards et actions migrés précédemment

**Transitions à reconfigurer** :
- Toutes les transitions `EVALUATION_COMPLETE` vers différents états
- Transitions de mise à jour de position
- Gestion des priorités et conditions

---

### **PROMPT 9 : Intégration dans la machine XState**

**Objectif** : Créer la machine XState principale avec l'état evaluating

**Actions à demander** :
1. Créer `machineX/machine.xstate.js` avec architecture XState propre
2. Intégrer l'état evaluating configuré
3. Ajouter des états temporaires/simplifiés pour exploring, collecting, maintaining
4. Configurer tous les guards et actions importés

**Résultat attendu** : Machine XState fonctionnelle avec état evaluating complet

---

### **PROMPT 10 : Exports centralisés et finalisation**

**Objectif** : Finaliser l'architecture avec exports propres

**Actions à demander** :
1. Compléter tous les fichiers `index.js` pour exports centralisés
2. Vérifier que tous les imports/exports fonctionnent
3. Ajouter la documentation manquante
4. Tester la compilation (pas d'exécution, juste compilation)

**Livrables finaux** :
- Architecture complète dans `machineX/`
- État evaluating entièrement migré
- Guards, actions, et constantes réutilisables
- Machine XState compilable

---

## 📋 Checklist de Migration

### Phase 1 - Structure (Prompts 1-2)
- [ ] Architecture de dossiers créée
- [ ] Fichiers vides avec headers
- [ ] Constantes essentielles migrées

### Phase 2 - Guards (Prompts 3-5)  
- [ ] Guards de sécurité migrés
- [ ] Guards d'efficacité migrés
- [ ] Guards de découverte migrés

### Phase 3 - Configuration (Prompts 6-8)
- [ ] Événements configurés
- [ ] Actions evaluating migrées
- [ ] État evaluating configuré

### Phase 4 - Intégration (Prompts 9-10)
- [ ] Machine XState créée
- [ ] Exports centralisés
- [ ] Documentation complète

---

## 🎯 Critères de Succès

1. **Architecture propre** : Structure modulaire claire et maintenable
2. **Syntaxe XState native** : Aucune trace de syntaxe Robot3
3. **Logique préservée** : Même comportement que l'état evaluating original
4. **Code réutilisable** : Guards et actions réutilisables pour autres états
5. **Documentation complète** : Chaque fichier documenté et commenté

---

## 🚧 Notes Importantes

- **Conserver l'ancien système** : Ne pas modifier le dossier `machine/` existant
- **Syntaxe XState pure** : Tout réécrire selon les patterns XState
- **Inspiration uniquement** : Utiliser Robot3 comme référence, pas copie
- **Evaluating uniquement** : Ne pas implémenter les autres états complets
- **Pas de tests** : Focus sur la migration uniquement

---

*Plan de migration créé pour la transition Robot3 → XState*
