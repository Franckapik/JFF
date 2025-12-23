# 🧪 FSM Terminal Testing System

## Vue d'ensemble

Ce système permet de tester le FSM XState v5 de manière autonome en environnement Node.js, **sans aucune dépendance à React Three Fiber (R3F)**.

## Architecture

### 1. Machine Terminal (`machine.terminal.v5.ts`)

Version spéciale du FSM où toutes les actions avec effets de bord R3F sont remplacées par des logs console:

```typescript
// Au lieu de:
onExploringEntry: () => { /* animations R3F */ }

// On a:
onExploringEntry: () => console.log('🔍 [FSM] → EXPLORING')
```

**Avantages:**
- ✅ Tests rapides sans navigateur
- ✅ Debugging facile avec logs structurés
- ✅ CI/CD friendly
- ✅ Évolution du code orientée terminal

### 2. Script de Test (`scripts/test-fsm-cycle.js`)

Script Node.js complet avec:

- **EventSimulator**: Classe pour simuler les événements FSM
- **Scénarios de test**: Cycles prédéfinis (exploration, collection, maintenance)
- **Statistiques**: Métriques de performance et taux de succès

## Utilisation

### Commandes NPM

```bash
# Test cycle complet (défaut)
npm run test:fsm-cycle

# Test rapide
npm run test:fsm-quick

# Tests spécifiques par domaine
npm run test:fsm-explore   # Exploration uniquement
npm run test:fsm-collect   # Collection uniquement
npm run test:fsm-maintain  # Maintenance uniquement

# Mode verbose (logs détaillés)
npm run test:fsm-verbose
```

### Commandes Node directes

```bash
# Cycle complet
node scripts/test-fsm-cycle.js

# Avec options
node scripts/test-fsm-cycle.js --scenario=quick
node scripts/test-fsm-cycle.js --scenario=explore --verbose
node scripts/test-fsm-cycle.js -v
```

## Scénarios Disponibles

### 🎯 Full Cycle (`--scenario=full`)

Teste le cycle complet:
1. Initialisation (ship + drone)
2. Exploration (deploy → scan → return)
3. Collection (move → collect → return)
4. Maintenance (deposit → refuel → repair)

### ⚡ Quick Cycle (`--scenario=quick`)

Version rapide pour validation:
- Initialisation + exploration basique
- Idéal pour CI/CD

### 🔍 Explore Only (`--scenario=explore`)

Test uniquement le cycle d'exploration:
- Déploiement du drone
- Scan de tuile
- Retour à la base

### ⛏️ Collect Only (`--scenario=collect`)

Test uniquement le cycle de collection:
- Déplacement vers tuile
- Collecte de ressources
- Retour à la base

### 🔧 Maintain Only (`--scenario=maintain`)

Test uniquement le cycle de maintenance:
- Dépôt de ressources
- Ravitaillement
- Réparation

## EventSimulator API

```javascript
const simulator = new EventSimulator(actor, { verbose: true });

// Envoyer un événement avec délai
await simulator.send({ type: 'NEED_EXPLORING' }, 100);

// Attendre un état spécifique
await simulator.waitForState('exploring.drone_scanning', 5000);

// Afficher les statistiques
simulator.printStats();
```

### Méthodes principales

- `send(event, delay)`: Envoie un événement au FSM
- `waitForState(statePath, timeout)`: Attend qu'un état soit atteint
- `matchesState(stateValue, statePath)`: Vérifie si l'état correspond
- `printStats()`: Affiche les statistiques du test

## Exemple de sortie

```
╔═══════════════════════════════════════════════════════════════╗
║         TEST FSM CYCLE COMPLET - Terminal Mode              ║
╚═══════════════════════════════════════════════════════════════╝

📋 Scénario: full
🔍 Verbose: OFF

🚀 Creating FSM actor...

🎬 [FSM] → INITIALIZING
✅ [FSM] ← INITIALIZING → EVALUATING

🔍 Testing EXPLORATION cycle...

🤔 [FSM] → EVALUATING
   Ship: {"x":0,"y":0,"z":0}, Fuel: 45%
   Drone: {"x":0,"y":0,"z":0}, Status: docked
✅ [FSM] ← EVALUATING → EXPLORING

🔍 [FSM] → EXPLORING
  🚁 [Drone] Deploying to tile {"x":5,"y":0,"z":5}
  ✅ [Drone] Deployed
  📡 [Drone] Scanning at {"x":5,"y":0,"z":5}
  ✅ [Drone] Scan complete
  🔙 [Drone] Returning to base from {"x":5,"y":0,"z":5}
  ✅ [Drone] Returned to base
✅ [FSM] ← EXPLORING

...

╔═══════════════════════════════════════════════════════════════╗
║                      TEST STATISTICS                         ║
╚═══════════════════════════════════════════════════════════════╝
⏱️  Duration: 2847ms
📨 Total events: 15
🔄 State transitions: 15
❌ Errors: 0
✅ Success rate: 100.0%

╔═══════════════════════════════════════════════════════════════╗
║                   🎉 ALL TESTS PASSED! 🎉                    ║
╚═══════════════════════════════════════════════════════════════╝
```

## Structure des fichiers

```
src/ai/fsm/machineX/
├── machine.pure.v5.ts      # Machine production (avec R3F)
└── machine.terminal.v5.ts  # Machine terminal (sans R3F) ← NOUVEAU

scripts/
├── test-fsm-cycle.js       # Script de test complet ← NOUVEAU
├── test-guards-interactive.js
└── quick-test-guards.js
```

## Intégration CI/CD

Ajoutez dans votre pipeline:

```yaml
# .github/workflows/test.yml
- name: Test FSM Cycle
  run: npm run test:fsm-quick
```

## Développement

### Ajouter un nouveau scénario

1. Créer une fonction de test dans `test-fsm-cycle.js`:

```javascript
async function testMyScenario(simulator) {
  console.log('\n🎯 Testing MY scenario...\n');
  
  // Votre logique de test
  await simulator.send({ type: 'MY_EVENT' });
  await simulator.waitForState('my_state');
  
  console.log('✅ My scenario completed!\n');
}
```

2. Ajouter le scénario au switch:

```javascript
switch (scenario) {
  case 'my-scenario':
    await testMyScenario(simulator);
    break;
  // ...
}
```

3. Ajouter le script NPM dans `package.json`:

```json
"test:fsm-my": "node scripts/test-fsm-cycle.js --scenario=my-scenario"
```

### Modifier les actions terminal

Éditez `machine.terminal.v5.ts`:

```typescript
const terminalEffects = {
  onMyEntry: ({ context }) => {
    console.log('🎯 [FSM] → MY_STATE');
    console.log(`   Custom data: ${context.myData}`);
  },
  // ...
};
```

## Bonnes pratiques

1. **Toujours tester après modification du FSM**
   ```bash
   npm run test:fsm-quick
   ```

2. **Utiliser verbose pour débugger**
   ```bash
   npm run test:fsm-verbose
   ```

3. **Tester chaque domaine individuellement**
   ```bash
   npm run test:fsm-explore
   npm run test:fsm-collect
   npm run test:fsm-maintain
   ```

4. **Vérifier les statistiques**
   - Success rate devrait être 100%
   - Pas d'erreurs dans les logs

## Troubleshooting

### ❌ Timeout waiting for state

**Cause**: L'état attendu n'est jamais atteint

**Solution**: 
- Vérifier que le guard correspondant retourne `true`
- Utiliser `--verbose` pour voir les transitions
- Augmenter le timeout si nécessaire

### ❌ TypeError: Cannot read property 'x' of null

**Cause**: Position non initialisée

**Solution**:
- Vérifier que les événements `INITIALIZE_REQUEST` sont envoyés
- S'assurer que le contexte initial est correctement configuré

### ❌ Module not found

**Cause**: Import TypeScript non résolu

**Solution**:
- Vérifier les exports dans les domaines
- S'assurer que Node.js supporte les imports ESM
- Vérifier `"type": "module"` dans `package.json`

## Ressources

- [XState v5 Documentation](https://stately.ai/docs/xstate)
- [Machine Production](../src/ai/fsm/machineX/machine.pure.v5.ts)
- [Types d'événements](../src/ai/fsm/machineX/events.pure.v5.ts)
- [Instructions Copilot](../.github/copilot-instructions.md)

## Contribution

Pour ajouter de nouveaux tests ou améliorer le système:

1. Suivre les conventions du projet (voir `copilot-instructions.md`)
2. Tester avec `npm run test:fsm-verbose`
3. Mettre à jour cette documentation
4. Commit avec message descriptif

---

**Note**: Ce système est conçu pour l'évolution du code orientée terminal. Il garantit que le FSM reste testable et maintenable sans dépendances à l'environnement graphique.
