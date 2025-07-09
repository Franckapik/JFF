# Guide de Prévention des Erreurs d'Import/Export

## 🎯 Objectif

Ce document établit une méthode systématique pour éviter les erreurs récurrentes d'import/export dans le projet React Three Vite, particulièrement les erreurs du type "does not provide an export named 'default'".

## 🔍 Problème Identifié

### Symptômes Fréquents

```bash
# Erreur courante
Module '"../stores/useFSMStore"' has no exported member 'default'
Module '"../hooks/useFSM"' does not provide an export named 'default'
```

### Causes Racines

1. **Incohérence Export Default vs Named Export**
   - Un module exporte : `export const useFSMStore = create(...)`
   - Un autre importe : `import useFSMStore from "..."`
   - **Résultat** : Erreur car aucun export par défaut n'existe

2. **Conventions Mixtes**
   - Certains stores utilisent `export default`
   - D'autres utilisent `export const`
   - Aucune convention uniforme appliquée

3. **Imports Automatiques IDE**
   - L'IDE peut suggérer le mauvais type d'import
   - Copy-paste depuis d'autres fichiers sans vérification

## 📋 Convention Établie

### 1. Stores Zustand : Export Nommé

```javascript
// ✅ CORRECT - stores/useFSMStore.js
export const useFSMStore = create((set, get) => {
  // ...
});

// ✅ CORRECT - Import correspondant
import { useFSMStore } from "../stores/useFSMStore";
```

### 2. Hooks Personnalisés : Export Nommé

```javascript
// ✅ CORRECT - hooks/useFSM.js
export function useFSM(botId = 'main') {
  // ...
}

// ✅ CORRECT - Import correspondant
import { useFSM } from "../hooks/useFSM";
```

### 3. Composants React : Export Default

```javascript
// ✅ CORRECT - components/Scene.jsx
const Scene = () => {
  // ...
};

export default Scene;

// ✅ CORRECT - Import correspondant
import Scene from "../components/Scene";
```

### 4. Utilitaires/Loggers : Export Default

```javascript
// ✅ CORRECT - logger/fsmLogger.ts
const fsmLogger = {
  // ...
};

export default fsmLogger;

// ✅ CORRECT - Import correspondant
import fsmLogger from "../logger/fsmLogger.ts";
```

## 🛠️ Outils de Prévention

### 1. Script d'Analyse Automatique

Le script `/scripts/check-exports.js` permet de :
- Analyser tous les exports/imports du projet
- Détecter les incompatibilités automatiquement
- Générer un rapport détaillé

```bash
# Exécution du script
node scripts/check-exports.js
```

### 2. Checklist Avant Commit

- [ ] Vérifier le type d'export du module cible
- [ ] Utiliser l'import correspondant (named vs default)
- [ ] Tester la compilation après modification
- [ ] Exécuter le script d'analyse si incertain

### 3. Template de Vérification Rapide

```bash
# Vérifier rapidement les exports d'un fichier
grep -n "export" src/stores/useFSMStore.js

# Vérifier les imports d'un export spécifique
grep -r "useFSMStore" src/ --include="*.js" --include="*.jsx"
```

## 📖 Exemples de Correction

### Cas 1 : Store avec Export Nommé

```javascript
// ❌ AVANT - Import incorrect
import useFSMStore from "../stores/useFSMStore";

// ✅ APRÈS - Import correct
import { useFSMStore } from "../stores/useFSMStore";
```

### Cas 2 : Hook avec Export Nommé

```javascript
// ❌ AVANT - Import incorrect
import useFSM from "../hooks/useFSM";

// ✅ APRÈS - Import correct
import { useFSM } from "../hooks/useFSM";
```

### Cas 3 : Double Export (Named + Default)

```javascript
// Si un module a les deux types d'export
export const useFSMStore = create(...);
export default useFSMStore;

// Les deux imports fonctionnent
import { useFSMStore } from "../stores/useFSMStore"; // Named
import useFSMStore from "../stores/useFSMStore";     // Default
```

## 🎯 Recommandations

### Immédiat

1. **Standardiser les Stores** : Tous en export nommé
2. **Standardiser les Hooks** : Tous en export nommé  
3. **Standardiser les Components** : Tous en export default
4. **Exécuter le script d'analyse** après chaque modification importante

### Long Terme

1. **Configuration ESLint** : Règles pour forcer la cohérence
2. **Script Pre-commit** : Validation automatique avant commit
3. **Documentation IDE** : Snippets avec les bonnes conventions

## 🔧 Script de Migration Rapide

```bash
# Rechercher tous les imports problématiques de stores
grep -r "import.*useFSMStore.*from" src/ --include="*.js" --include="*.jsx"

# Rechercher tous les imports problématiques de hooks
grep -r "import.*useFSM.*from" src/ --include="*.js" --include="*.jsx"
```

## 📊 État Actuel des Modules

### Stores (Export Nommé Requis)

- ✅ `useFSMStore` : `export const useFSMStore`
- ✅ `useFSMStoreXState` : `export const useFSMStore`
- ✅ `useTileStore` : `export const useTileStore`
- ⚠️ `useGameStore` : `export default` (à vérifier)

### Hooks (Export Nommé Requis)

- ✅ `useFSM` : `export function useFSM`
- ⚠️ `useMessageManager` : `export default` (à vérifier)

### Utilitaires (Export Default OK)

- ✅ `fsmLogger` : `export default fsmLogger`

## 🚀 Prochaines Étapes

1. Exécuter le script d'analyse complet
2. Corriger les incompatibilités détectées
3. Mettre à jour cette documentation avec les résultats
4. Implémenter les règles ESLint pour la prévention
5. Former l'équipe sur ces conventions

---

*Document créé le : ${new Date().toISOString()}*
*Dernière mise à jour : ${new Date().toISOString()}

## 🔧 Corrections Récentes (Juin 2025)

### Ajout de la propriété `activeBots` au store useFSMStore

**Problème détecté :**
```
Cannot read properties of undefined (reading 'length') at Scene.jsx:66
```

**Cause :**
Le store `useFSMStore.js` n'exposait pas la propriété `activeBots` requise par le composant `Scene.jsx`.

**Solution appliquée :**
```javascript
// ✅ AVANT - État manquant
return {
  botStates: { main: mainActor.getSnapshot() }
};

// ✅ APRÈS - État complet
return {
  botStates: { main: mainActor.getSnapshot() },
  activeBots: ['main']  // Nouvelle propriété ajoutée
};
```

**Actions mises à jour :**
- `addBot` : Ajoute le botId à `activeBots` s'il n'y est pas déjà
- `removeBot` : Supprime le botId de `activeBots`

---
