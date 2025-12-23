# 🛠️ Scripts du Projet - Guide Complet

## 📋 Table des Matières

1. [Tests FSM Terminal](#-tests-fsm-terminal-nouveaux)
2. [Validation](#-validation)
3. [Tests Guards](#-tests-guards)
4. [Workflow Recommandé](#-workflow-recommandé)

---

## 🧪 Tests FSM Terminal (NOUVEAUX!)

### `test-fsm-cycle.js`
**Test de cycle complet du FSM en mode terminal Node.js**

Système de test complet pour valider le FSM XState v5 sans dépendances à R3F.

**Commandes Rapides:**
```bash
npm run test:fsm-cycle      # Cycle complet
npm run test:fsm-quick      # Test rapide
npm run test:fsm-explore    # Exploration uniquement
npm run test:fsm-collect    # Collection uniquement  
npm run test:fsm-maintain   # Maintenance uniquement
npm run test:fsm-verbose    # Mode debug détaillé
```

**Exemple de Sortie:**
```
🎬 [FSM] → INITIALIZING
✅ [FSM] ← INITIALIZING → EVALUATING
🔍 [FSM] → EXPLORING
  🚁 [Drone] Deploying to tile {"x":5,"y":0,"z":5}
  ✅ [Drone] Deployed
  📡 [Drone] Scanning at {"x":5,"y":0,"z":5}
  ✅ [Drone] Scan complete
  ...
📊 Success rate: 100.0%
```

**Documentation:** [FSM_TERMINAL_TESTING.md](../docs/FSM_TERMINAL_TESTING.md)

---

## ✅ Validation

### `check-exports.js`
Valide les conventions d'export:
- Stores/hooks: **named exports** uniquement
- Composants React: **default export** uniquement

```bash
npm run check-exports
```

### `pre-commit.sh`
Validation complète avant commit:
1. ESLint
2. Check exports
3. TypeScript type-check
4. Build

```bash
./scripts/pre-commit.sh
```

---

## 🔍 Tests Guards

### `test-guards-interactive.js`
Interface interactive pour tester les guards FSM.

```bash
npm run validate-guards
```

### `quick-test-guards.js`
Test rapide avec contextes prédéfinis.

```bash
npm run quick-test-guards
```

---

## 📁 Structure

```
scripts/
├── test-fsm-cycle.js           ⭐ NOUVEAU: Tests FSM terminal
├── check-exports.js
├── pre-commit.sh
├── test-guards-interactive.js
├── quick-test-guards.js
├── validate-migration-v5.js
├── README-SCRIPTS.md           ⭐ Ce fichier
├── README.md                   # Documentation guards originale
└── validate-guards/
    ├── context-fixtures.js
    ├── guard-runner.js
    ├── index.js
    └── reporters.js
```

---

## 🔄 Workflow Recommandé

### Avant un Commit
```bash
./scripts/pre-commit.sh
```

### Après Modification du FSM
```bash
npm run test:fsm-quick      # Test rapide (< 1s)
npm run test:fsm-cycle      # Test complet si OK
```

### En Cas de Problème
```bash
npm run test:fsm-verbose    # Voir tous les détails
```

### Pour CI/CD
```bash
npm run test:fsm-quick && npm run check-exports
```

---

## 🎯 Avantages du Système de Test Terminal

### Pourquoi?
- ✅ **Rapide**: Tests en < 1 seconde
- ✅ **Indépendant**: Pas de navigateur requis
- ✅ **Déterministe**: Résultats reproductibles
- ✅ **CI/CD**: Intégration facile
- ✅ **Debug**: Logs structurés et colorés

### Architecture

**1. Machine Terminal** (`machine.terminal.v5.ts`)
```typescript
// Version FSM sans R3F
const terminalEffects = {
  onExploringEntry: () => console.log('🔍 [FSM] → EXPLORING'),
  // ...
};
```

**2. Event Simulator** (dans `test-fsm-cycle.js`)
```javascript
const simulator = new EventSimulator(actor);
await simulator.send({ type: 'NEED_EXPLORING' });
await simulator.waitForState('exploring.drone_scanning');
```

**3. Scénarios de Test**
- `full`: Tous les domaines
- `quick`: Validation rapide
- `explore`, `collect`, `maintain`: Tests spécifiques

---

## 📊 Commandes NPM Disponibles

| Commande | Description | Durée |
|----------|-------------|-------|
| `npm run test:fsm-cycle` | Cycle complet | ~10s |
| `npm run test:fsm-quick` | Test rapide | <1s |
| `npm run test:fsm-explore` | Exploration seule | ~2s |
| `npm run test:fsm-collect` | Collection seule | ~3s |
| `npm run test:fsm-maintain` | Maintenance seule | ~3s |
| `npm run test:fsm-verbose` | Mode debug | Variable |
| `npm run validate-guards` | Guards interactif | Interactif |
| `npm run quick-test-guards` | Guards rapide | <1s |
| `npm run check-exports` | Validation exports | <1s |

---

## 🆕 Ajouter un Nouveau Test

### 1. Dans `test-fsm-cycle.js`

```javascript
async function testMyFeature(simulator) {
  console.log('\n🎯 Testing MY FEATURE...\n');
  
  await simulator.send({ type: 'MY_EVENT' });
  await simulator.waitForState('my_state');
  
  console.log('✅ My feature completed!\n');
}
```

### 2. Ajouter au Switch

```javascript
switch (scenario) {
  case 'my-feature':
    await testMyFeature(simulator);
    break;
  // ...
}
```

### 3. Ajouter Commande NPM

```json
{
  "scripts": {
    "test:fsm-my": "node scripts/test-fsm-cycle.js --scenario=my-feature"
  }
}
```

---

## 🐛 Troubleshooting

### Timeout waiting for state
**Cause**: État jamais atteint
**Solution**: 
- Vérifier les guards
- Utiliser `--verbose`
- Augmenter timeout si nécessaire

### Module not found
**Cause**: Import TypeScript non résolu
**Solution**:
- Ajouter `.ts` aux imports
- Vérifier `"type": "module"` dans package.json

### Actions pas appliquées
**Cause**: Actions assign mal configurées
**Solution**:
- Utiliser `assign()` de XState
- Vérifier immutabilité du context

---

## 📚 Ressources

- [FSM Terminal Testing](../docs/FSM_TERMINAL_TESTING.md) - Documentation complète
- [Copilot Instructions](../.github/copilot-instructions.md) - Conventions projet
- [XState v5 Docs](https://stately.ai/docs/xstate) - Documentation officielle
- [Guards Testing README](./README.md) - Documentation guards originale

---

## ✨ Highlights

> **"Le système de test terminal permet de valider le FSM XState v5 en moins d'une seconde, sans navigateur, avec des logs clairs et structurés."**

**Principales Nouveautés:**
- 🚀 Tests < 1s avec `npm run test:fsm-quick`
- 🔍 Logs colorés et structurés
- 🎯 Scénarios prédéfinis par domaine
- 📊 Statistiques détaillées
- 🔄 CI/CD ready

---

**Dernière mise à jour**: 23 décembre 2025
