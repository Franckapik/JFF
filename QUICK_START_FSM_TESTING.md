# 🚀 Quick Start - FSM Terminal Testing

## Installation

Aucune installation nécessaire! Le système utilise les dépendances existantes du projet.

## Usage Rapide

```bash
# Test rapide (< 1s)
npm run test:fsm-quick

# Test complet (~10s)
npm run test:fsm-cycle

# Tests par domaine
npm run test:fsm-explore
npm run test:fsm-collect
npm run test:fsm-maintain

# Mode debug
npm run test:fsm-verbose
```

## Ce que ça teste

✅ **Initialisation**: Ship + Drone + Base  
✅ **Exploration**: Deploy → Scan → Return  
✅ **Collection**: Move → Collect → Return  
✅ **Maintenance**: Deposit → Refuel → Repair  

## Exemple de sortie

```
🎬 [FSM] → INITIALIZING
✅ [FSM] ← INITIALIZING → EVALUATING
🔍 [FSM] → EXPLORING
  🚁 [Drone] Deploying to tile {"x":5,"y":0,"z":5}
  ✅ [Drone] Deployed
...
✅ Success rate: 100.0%
```

## Documentation

- **Guide complet**: [docs/FSM_TERMINAL_TESTING.md](docs/FSM_TERMINAL_TESTING.md)
- **Résumé implémentation**: [FSM_TERMINAL_IMPLEMENTATION_SUMMARY.md](FSM_TERMINAL_IMPLEMENTATION_SUMMARY.md)
- **Scripts disponibles**: [scripts/README-SCRIPTS.md](scripts/README-SCRIPTS.md)

## Avantages

- 🚀 Tests < 1 seconde
- 🔧 Sans navigateur
- 📊 Logs structurés
- ✅ CI/CD ready
- 🎯 100% déterministe

---

**Prêt à tester?** → `npm run test:fsm-quick`
