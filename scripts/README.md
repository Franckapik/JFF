# Outils de Prévention des Erreurs d'Import/Export

## 📋 Outils Disponibles

### 1. Script d'Analyse Automatique

```bash
# Analyser tous les imports/exports du projet
npm run check-exports

# ou directement
node scripts/check-exports.js
```

**Fonctionnalités :**
- Détecte automatiquement les incompatibilités import/export
- Génère un rapport détaillé
- Affiche les statistiques du projet

### 2. Script de Validation Pré-Commit

```bash
# Exécuter toutes les vérifications
./scripts/pre-commit.sh
```

**Vérifications :**
- Analyse des imports/exports
- Compilation du projet
- Validation automatique

### 3. Configuration ESLint

Le fichier `.eslintrc.json` contient des règles pour :
- Ordre des imports
- Détection des imports dupliqués
- Résolution des chemins d'import

## 🎯 Convention Établie

### Stores et Hooks : Export Nommé
```javascript
// ✅ CORRECT
export const useFSMStore = create(...);
export function useFSM() { ... }

// ✅ Import correspondant
import { useFSMStore } from "...";
import { useFSM } from "...";
```

### Composants React : Export Default
```javascript
// ✅ CORRECT
const Scene = () => { ... };
export default Scene;

// ✅ Import correspondant
import Scene from "...";
```

## 🚀 Utilisation

### Workflow Recommandé

1. **Avant de modifier du code :**
   ```bash
   npm run check-exports
   ```

2. **Après modification :**
   ```bash
   npm run check-exports
   ./scripts/pre-commit.sh
   ```

3. **En cas d'erreur :**
   - Vérifier le type d'export du module cible
   - Corriger l'import correspondant
   - Re-exécuter les vérifications

### Intégration Git (Optionnel)

Pour automatiser les vérifications :
```bash
# Copier le script comme hook git
cp scripts/pre-commit.sh .git/hooks/pre-commit
```

## 📖 Documentation Complète

Voir `/src/docs/import-export-prevention-guide.md` pour :
- Guide détaillé de prévention
- Exemples de correction
- Bonnes pratiques
- État actuel du projet

---

*Dernière mise à jour : ${new Date().toISOString()}*
