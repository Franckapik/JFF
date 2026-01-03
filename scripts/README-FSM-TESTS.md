# FSM Test Scripts Documentation

## Test Autonome (Sans Événements)

**Objectif** : Tester la machine en pure autonomie, elle se gère entièrement elle-même sans événements externes.

### Utilisation

```bash
# Mode par défaut (30 secondes, logs compacts)
npm run test:fsm-autonomous

# Mode verbose avec logs détaillés (5 secondes)
npm run test:fsm-autonomous-verbose -- --duration=5000

# Durée personnalisée (10 secondes)
node scripts/test-fsm-autonomous.js --duration=10000

# Mode verbose + durée personnalisée
node scripts/test-fsm-autonomous.js --verbose --duration=8000
```

### Résumé du Test

Le test affiche :

1. **État initial** : État de départ et contexte (fuel, damage, capacité, drone)
2. **Changements d'état** : Chaque transition d'état (en mode verbose, avec détails du contexte)
3. **Health Check Report** : Analyse automatique pour détecter les dysfonctionnements
4. **Résumé final** : Nombre de transitions, durée totale, états initial/final

### Détection des Dysfonctionnements

Le système détecte automatiquement :

- ❌ **États invalides** : Exploration + Maintenance simultanée, Collecte + Exploration
- ❌ **Valeurs hors limites** : Fuel/Damage en dehors de 0-100%, Capacité négative
- ⚠️ **Machine bloquée** : Très peu de transitions, ou coincée dans le même état
- ⚠️ **Drone non déployé** : Reste `uninitialized` après plusieurs transitions
- ⚠️ **Pas de progression** : Contexte (fuel, damage, capacité) inchangé

### Exemples de Sortie

#### ✅ FSM fonctionnant correctement

```
🔍 HEALTH CHECK REPORT
════════════════════════════════════════════════════════════════════════════════
✅ No issues detected - FSM functioning normally
```

#### ⚠️ FSM bloqué ou dysfonctionnant

```
🔍 HEALTH CHECK REPORT
════════════════════════════════════════════════════════════════════════════════

⚠️  WARNINGS:
  ⚠️  Very few state transitions (1) - machine may be stuck or not progressing
  ⚠️  Stuck in drone_deploying - drone is not progressing through its lifecycle
```

---

## Test Cyclique (Avec Événements)

**Objectif** : Tester des cycles complets (initialisation → exploration → collection → maintenance)

### Utilisation

```bash
# Cycle complet (défaut)
npm run test:fsm-cycle

# Scénarios rapides
npm run test:fsm-quick
npm run test:fsm-explore
npm run test:fsm-collect
npm run test:fsm-maintain

# Mode verbose
npm run test:fsm-verbose
npm run test:fsm-cycle -- --scenario=full --verbose
```

### Scénarios

- `full` : Cycle complet avec toutes les étapes (défaut)
- `quick` : Test rapide avec moins de cycles
- `explore` : Test exploration uniquement
- `collect` : Test collection uniquement
- `maintain` : Test maintenance uniquement
- `edge-cases` : Tests de cas limites

---

## Comparaison

| Aspect | Autonome | Cyclique |
|--------|----------|----------|
| **Événements** | 0 (machine autonome) | Multiples (tests simulent des actions) |
| **Durée** | 5-30s (configurable) | Depend des scénarios (20-60s) |
| **Logs** | Compacts ou verbeux | Détaillés avec tableaux |
| **Cas d'usage** | Détecter blocages, boucles infinies | Tester les transitions et gardes |
| **Idéal pour** | Vérifier l'autonomie, CI/CD rapide | Validation complète du cycle |

---

## Tips pour Debugging

### 1. Mode Verbose
```bash
npm run test:fsm-autonomous-verbose -- --duration=10000
```
Affiche chaque changement d'état avec le contexte complet.

### 2. Durée Longue
```bash
node scripts/test-fsm-autonomous.js --duration=60000 --verbose
```
Laisse tourner 1 minute pour voir les patterns de long terme.

### 3. Associer les deux tests
```bash
# Vérifie que l'autonomie fonctionne
npm run test:fsm-autonomous

# Puis teste les cycles avec événements
npm run test:fsm-cycle -- --scenario=full
```

---

## Structure des Données

### StateHistory
```javascript
{
  state: { exploring: "drone_deploying" },
  timestamp: 118,
  contextSnapshot: {
    vehicleFuel: 100,
    vehicleDamage: 0,
    vehicleCapacity: 0,
    vehicleMaxCapacity: 2003,
    droneState: "uninitialized",
    fsmState: "evaluating"
  }
}
```

---

## Fichiers Importants

- **Scripts** : `scripts/test-fsm-autonomous.js`, `scripts/test-fsm-cycle.js`
- **Données mockées** : `scripts/fsm-mock-data.js`
- **Machine FSM** : `src/ai/fsm/machineX/machine.pure.v5.ts`
