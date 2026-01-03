# 🧪 Guide des Tests FSM - Instructions pour Copilot

## ⚠️ RÈGLE IMPORTANTE: N'UTILISEZ JAMAIS `npm run test`

**Les tests dans ce projet ne s'exécutent PAS avec `npm run test` ou `npm test`!**

Utilisez **toujours** l'une des méthodes suivantes:

## 📋 Méthodes de Test Disponibles

### 1. 🎯 Menu Interactif (RECOMMANDÉ)
```bash
npm run menu
# ou
node scripts/menu.js
```

Le menu offre:
- **🎯 TOUS LES TESTS FSM** ← Exécute tous les tests FSM + Guards + Vitest core/spatial (~15s)
- Tests FSM par scénario (full, quick, explore, collect, maintain)
- Tests Guards (interactif ou rapide)
- Validation qualité (pre-commit, TypeScript)

### 2. 🚀 Scripts Directs (Terminal Node.js)

#### Tests FSM XState v5
```bash
# Test complet tous domaines
node scripts/test-fsm-cycle.js --scenario=full

# Test rapide validation
node scripts/test-fsm-cycle.js --scenario=quick

# Par domaine
node scripts/test-fsm-cycle.js --scenario=explore
node scripts/test-fsm-cycle.js --scenario=collect
node scripts/test-fsm-cycle.js --scenario=maintain

# Mode verbose (debug)
node scripts/test-fsm-cycle.js --verbose
```

#### Tests Guards
```bash
# Interactif
node scripts/test-guards-interactive.js

# Rapide
node scripts/quick-test-guards.js
```

### 3. ✅ Tests Vitest (Core/Spatial uniquement)

**UNIQUEMENT pour le module core/spatial** (fonctions pures):

```bash
# Tous les tests core/spatial
npx vitest run src/core/spatial

# Test spécifique
npx vitest run src/core/spatial/pathfinding.test.ts

# Avec pattern
npx vitest run src/core/spatial -t "findTilesInRadius"

# Mode watch
npx vitest src/core/spatial
```

**⚠️ NE PAS utiliser Vitest pour:**
- Tests FSM (utiliser `node scripts/test-fsm-cycle.js`)
- Tests Guards (utiliser `node scripts/test-guards-interactive.js`)
- Validation complète (utiliser `bash scripts/pre-commit.sh`)

## 📊 Quand Utiliser Quel Test?

| Situation | Commande |
|-----------|----------|
| Validation complète avant commit | `npm run menu` → "TOUS LES TESTS FSM" |
| Test rapide FSM après modification | `node scripts/test-fsm-cycle.js --scenario=quick` |
| Test d'un domaine spécifique (ex: exploration) | `node scripts/test-fsm-cycle.js --scenario=explore` |
| Test guards avec nouveau contexte | `node scripts/test-guards-interactive.js` |
| Test fonction pure core/spatial | `npx vitest run src/core/spatial -t "maFonction"` |
| Debug FSM avec logs détaillés | `node scripts/test-fsm-cycle.js --verbose` |
| Pre-commit validation | `bash scripts/pre-commit.sh` |

## 🏗️ Architecture des Tests

### Tests FSM (Node.js Terminal)
- **Fichier**: `scripts/test-fsm-cycle.js`
- **But**: Valider le FSM XState v5 sans navigateur
- **Durée**: 1-10s selon scénario
- **Coverage**: Tous les domaines FSM (exploration, collection, maintenance, etc.)

### Tests Guards (Node.js Terminal)
- **Fichiers**: `scripts/test-guards-interactive.js`, `scripts/quick-test-guards.js`
- **But**: Valider les règles métier (guards) du FSM
- **Durée**: <1s
- **Coverage**: shouldCollect, needsRefuel, etc.

### Tests Vitest (Module Core/Spatial)
- **Fichiers**: `src/core/spatial/*.test.ts`
- **But**: Tests unitaires des fonctions pures (distance, pathfinding, etc.)
- **Durée**: <1s
- **Coverage**: 234 tests, 100% des fonctions core/spatial

## 🔍 Cohérence Tests Core ↔ FSM

### Problème Résolu: Bot Bloqué en `evaluating`

**Symptôme dans les logs:**
```javascript
🔵 INFO [bot-0] assignDroneDeployingContext: No valid target tile found
🟠 ACTION [bot-0] Entrée dans l'état DRONE_DEPLOYING
  targetTile: "unknown"
```

**Cause**: `findTilesInRadius` retourne `[]` car le TileStore est vide au démarrage

**Solution**: Les tests `core/spatial` valident que `findTilesInRadius` fonctionne correctement:
```bash
npx vitest run src/core/spatial/pathfinding.test.ts -t "findTilesInRadius"
# ✓ 11 tests passed
```

**Vérification de cohérence**:
1. Tests unitaires core/spatial → ✅ 234/234 passing
2. Tests FSM utilisent les mêmes fonctions → ✅ Imports depuis `core/spatial`
3. Tests FSM avec TileMap fictif → ✅ Bot passe tous les états

**Conclusion**: Le bot fonctionne en test (avec TileMap), le problème en dev est le timing d'initialisation du TileStore.

## 🛠️ Flags Disponibles

### Scripts FSM
- `--scenario=<type>`: Sélectionne le scénario (full, quick, explore, collect, maintain)
- `--verbose`: Active les logs détaillés pour debug

### Vitest
- `-t "pattern"`: Filtre les tests par nom
- `--reporter=dot`: Affichage minimal (points)
- `--reporter=verbose`: Affichage détaillé
- `--run`: Mode one-shot (vs watch mode)
- `--coverage`: Génère un rapport de couverture

### Pre-commit
```bash
bash scripts/pre-commit.sh
# Exécute: ESLint → TypeScript check → Build Vite
```

## 📝 Exemples Pratiques

### Scénario 1: Modification d'une action FSM
```bash
# 1. Test rapide pour vérifier la syntaxe
node scripts/test-fsm-cycle.js --scenario=quick

# 2. Test du domaine modifié
node scripts/test-fsm-cycle.js --scenario=explore

# 3. Test complet avant commit
npm run menu
# → Choisir "TOUS LES TESTS FSM"
```

### Scénario 2: Ajout d'une fonction dans core/spatial
```bash
# 1. Créer le test unitaire dans src/core/spatial/*.test.ts

# 2. Lancer les tests Vitest
npx vitest run src/core/spatial

# 3. Vérifier l'intégration FSM
node scripts/test-fsm-cycle.js --scenario=full

# 4. Validation complète
bash scripts/pre-commit.sh
```

### Scénario 3: Debug d'un guard
```bash
# Mode interactif avec contexte personnalisé
node scripts/test-guards-interactive.js

# Ou test rapide si contexte connu
node scripts/quick-test-guards.js
```

## ⚡ Commande Ultime (Tout Tester)

Pour exécuter **tous les tests disponibles** en une seule commande:

```bash
npm run menu
# Puis sélectionner: "🎯 TOUS LES TESTS FSM"
```

**Ceci exécute:**
1. Tests FSM complets (10s)
2. Tests Guards rapides (<1s)
3. Tests Vitest core/spatial (<1s)

**Total: ~15s pour valider l'ensemble du projet**

## 🎯 Résumé pour Copilot

**RAPPEL IMPORTANT:**
- ❌ **JAMAIS** `npm run test` ou `npm test`
- ✅ **TOUJOURS** `npm run menu` ou `node scripts/...`
- ✅ **Vitest** uniquement pour `core/spatial`
- ✅ **Scripts Node.js** pour FSM et Guards

**Workflow recommandé:**
1. Modification code → `node scripts/test-fsm-cycle.js --scenario=quick`
2. Tests OK → `npm run menu` → "TOUS LES TESTS FSM"
3. Avant commit → `bash scripts/pre-commit.sh`

---

**Date:** 24 décembre 2025  
**Version:** 1.0.0  
**Maintenu par:** L'équipe JFF
