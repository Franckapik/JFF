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

### ✅ **PROMPT 3 : Migration des guards de sécurité** ✅

**Objectif** : Migrer les guards de sécurité utilisés dans evaluating

**COMPLETED** - Safety guards migrated successfully:
- ✅ Analyzed `machine/guards/safetyGuard.js` and identified used guards
- ✅ Migrated `needsEmergencyReturn` (used in evaluatingState.js line 142)
- ✅ Migrated `isCriticalFuel` (used in evaluatingState.js line 148)
- ✅ Migrated all core safety guards: `isLowFuel`, `hasEnoughFuelForDistance`, `isVehicleCritical`, `isVehicleOperational`, etc.
- ✅ Updated `guards/index.js` to export safety guards
- ✅ All guards follow XState syntax and structure

**Résultat** : ✅ Fichier `safety.guards.js` avec syntaxe XState native - TERMINÉ

---

### **PROMPT 4 : Migration des guards d'efficacité** ✅

**Objectif** : Migrer les guards d'efficacité utilisés dans evaluating

**COMPLETED** - Efficiency guards migrated successfully:
- ✅ Analyzed `machine/guards/efficiencyGuard.js` and identified used guards
- ✅ Migrated `shouldReturnForEfficiency` (used in evaluatingState.js line 143)
- ✅ Migrated all core efficiency guards: `hasCapacityFor`, `isAtMaxCapacity`, `canCollectResource`, `isFullTank`, `canRefuel`, etc.
- ✅ Implemented resource management utilities for capacity calculations
- ✅ Updated `guards/index.js` to export efficiency guards
- ✅ All guards follow XState syntax and structure

**Résultat** : ✅ Fichier `efficiency.guards.js` avec syntaxe XState native - TERMINÉ

---

### **PROMPT 5 : Migration des guards de découverte** ✅

**Objectif** : Migrer les guards d'exploration/découverte utilisés dans evaluating

**COMPLETED** - Discovery guards migrated successfully:
- ✅ Analyzed `machine/guards/discoveryGuard.js` and all core exploration guards
- ✅ Migrated all guards used in evaluating: `hasBestTileForCollection`, `hasExploredEnoughTiles`, `shouldTransitionToCollection`, `hasUnexploredAreas`, `needsExploration`
- ✅ Implémentation XState pure, documentation, structure modulaire
- ✅ Updated `guards/index.js` to export discovery guards
- ✅ All guards follow XState syntax and structure

**Résultat** : ✅ Fichier `discovery.guards.js` avec syntaxe XState native - TERMINÉ

---

### **PROMPT 6 : Configuration des événements** ✅

**Objectif** : Définir les événements utilisés par l'état evaluating

**COMPLETED** - Events config migrated successfully:
- ✅ Listé tous les événements utilisés dans evaluatingState.js et la table de migration
- ✅ Créé une configuration claire et modulaire dans `machineX/config/events.config.js`
- ✅ Organisation par catégorie (système, mouvement, urgence, ressources, custom)
- ✅ Export global pour usage machine
- ✅ Compilation sans erreur

**Résultat** : ✅ Fichier `events.config.js` complet et documenté - TERMINÉ

### Phase 3 - Configuration (Prompts 6-8)
- [x] Événements configurés
- [x] Actions evaluating migrées
- [ ] État evaluating configuré

---

### **PROMPT 7 : Migration des actions evaluating** ✅

**Objectif** : Migrer les actions spécifiques à l'état evaluating

**COMPLETED** - Evaluating actions migrated successfully:
- ✅ Logique de décision (maintenance, collecte, exploration, idle) migrée dans `action_evaluating_entry`
- ✅ Logging de sortie dans `action_evaluating_exit`
- ✅ Structure modulaire, documentation, XState natif
- ✅ Export centralisé dans `actions/index.js`
- ✅ Compilation sans erreur

**Résultat** : ✅ Fichier `evaluating.actions.js` complet et documenté - TERMINÉ

### Phase 3 - Configuration (Prompts 6-8)
- [x] Événements configurés
- [x] Actions evaluating migrées
- [ ] État evaluating configuré

---

### **PROMPT 8 : Configuration de l'état evaluating** ✅

**Objectif** : Créer la configuration complète de l'état evaluating

**COMPLETED** - Evaluating state migrated successfully:
- ✅ Logique et transitions strictement issues de machine.xstate.js (pas d'EVALUATION_COMPLETE)
- ✅ Actions et guards centralisés, XState natif
- ✅ Export centralisé dans `states/index.js`
- ✅ Compilation sans erreur

**Résultat** : ✅ Fichier `evaluating.state.js` complet et documenté - TERMINÉ

### Phase 3 - Configuration (Prompts 6-8)
- [x] Événements configurés
- [x] Actions evaluating migrées
- [x] État evaluating configuré

---

### **PROMPT 9 : Intégration dans la machine XState** ✅

**Objectif** : Créer la machine XState principale avec l'état evaluating

**COMPLETED** - Main XState machine integrated successfully:
- ✅ Créé `machineX/machine.xstate.js` avec architecture XState modulaire
- ✅ Intégré l'état evaluating configuré
- ✅ Ajouté des états temporaires/simplifiés pour exploring, collecting, maintaining
- ✅ Actions et guards centralisés, XState natif
- ✅ Compilation sans erreur

**Résultat** : ✅ Fichier `machine.xstate.js` complet et documenté - TERMINÉ

### Phase 4 - Intégration (Prompts 9-10)
- [x] Machine XState créée
- [ ] Exports centralisés
- [ ] Documentation complète

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
- [x] Architecture de dossiers créée
- [x] Fichiers vides avec headers
- [x] Constantes essentielles migrées

### Phase 2 - Guards (Prompts 3-5)  
- [x] Guards de sécurité migrés
- [x] Guards d'efficacité migrés
- [x] Guards de découverte migrés

### Phase 3 - Configuration (Prompts 6-8)
- [x] Événements configurés
- [x] Actions evaluating migrées
- [x] État evaluating configuré

### Phase 4 - Intégration (Prompts 9-10)
- [x] Machine XState créée
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
