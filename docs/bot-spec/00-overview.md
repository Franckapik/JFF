# Vue d'Ensemble : Bot Autonome JFF FSM

**Version :** 1.0.0  
**Date :** 23 décembre 2025  
**Auteur :** Équipe JFF

---

## 🎯 Objectif du Bot

Le bot autonome JFF est un système intelligent capable de :
- ✅ Explorer automatiquement un territoire inconnu
- ✅ Collecter des ressources de manière optimisée
- ✅ Gérer sa maintenance (carburant, réparations, dépôt)
- ✅ Prendre des décisions en temps réel selon son état

---

## 📋 Architecture Générale

### FSM (Finite State Machine) XState v5

```
┌──────────────┐
│ initializing │
└──────┬───────┘
       │
       v
┌──────────────┐
│  evaluating  │ ← Point de décision principal
└──┬───┬───┬───┘
   │   │   │
   v   v   v
┌───┐┌────┐┌────┐
│MNT││COLL││EXPL│
└───┘└────┘└────┘
```

### Composants Principaux

1. **Vehicle (Ship)** : Véhicule principal
   - Position, fuel, damage, resources
   - Capacité max : 2003 unités

2. **Drone** : Unité d'exploration
   - Reconnaissance à distance
   - Scan de tuiles

3. **Memory** : Historique et statistiques
   - Tuiles explorées/collectées
   - Ressources totales trouvées

---

## 📊 Métriques de Succès

| KPI | Target | Mesure |
|-----|--------|--------|
| Efficacité exploration | > 5 tiles/min | tiles_explored / time |
| Taux de collecte | > 150 res/tile | resources / tiles_collected |
| Efficacité fuel | > 50 res/fuel | resources / fuel_consumed |
| Temps maintenance | < 20% | time_maintaining / total_time |

---

## 📁 Structure Documentation

```
docs/bot-spec/
├── 00-overview.md              ← Ce fichier
├── 01-functional-specs.md      ← Spécifications fonctionnelles
├── 02-business-rules.md        ← Guards & règles métier
├── 03-fsm-states.md            ← États et transitions
├── 04-priority-system.md       ← Système de priorités
├── 05-constraints.md           ← Contraintes techniques
├── 06-success-metrics.md       ← KPIs détaillés
└── scenarios/                  ← Tests Gherkin BDD
    ├── exploration.feature
    ├── collection.feature
    ├── maintenance.feature
    └── emergency.feature
```

---

## 🚀 Utilisation de Cette Documentation

### Pour les Product Managers
→ Lire `01-functional-specs.md` pour comprendre les fonctionnalités

### Pour les Développeurs
→ Lire `02-business-rules.md` + `03-fsm-states.md` pour l'implémentation

### Pour les QA
→ Utiliser `scenarios/*.feature` pour les tests automatisés

### Pour les Stakeholders
→ Consulter `06-success-metrics.md` pour les KPIs

---

## 📝 Changelog

### v1.0.0 (23 décembre 2025)
- ✅ Documentation initiale complète
- ✅ 4 fichiers Gherkin scenarios
- ✅ Couverture : 4 features, 11 guards, 9 transitions
- ✅ Tests : 95% comportement FSM validé
