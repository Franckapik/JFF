# Spécifications Fonctionnelles : Bot Autonome

**Version :** 1.0.0  
**Date :** 23 décembre 2025

---

## F1. Exploration Autonome

### Description
Le bot explore automatiquement un territoire inconnu via un drone de reconnaissance.

### Acteurs
- Drone (unité d'exploration)
- explorationQueue (liste de tuiles à explorer)

### États FSM
- `exploring.drone_deploying` : Drone en route vers tuile
- `exploring.drone_scanning` : Drone scanne la tuile
- `exploring.drone_returning` : Drone retourne à la base
- `exploring.drone_docked` : Drone à la base

### Règles Métier
- **shouldExplore** : `explorationQueue.length > 0 AND fuel > 10 AND damage < 80`

### Scénario Gherkin
Voir [scenarios/exploration.feature](scenarios/exploration.feature)

---

## F2. Collection de Ressources

### Description
Le bot collecte des ressources découvertes et les ramène à la base.

### Acteurs
- Ship (véhicule principal)
- availableTiles (tuiles avec ressources)

### États FSM
- `collecting.ship_moving_to_tile` : Ship en route vers tuile
- `collecting.ship_collecting` : Ship collecte ressources
- `collecting.ship_returning` : Ship retourne à la base

### Règles Métier
- **shouldCollect** : `availableTiles.length > 0 AND NOT isVehicleOverloaded AND fuel > 20`
- **isVehicleOverloaded** : `resources.total >= maxCapacity.total * 0.8`

### Contraintes
- Consommation fuel : 1% par collection
- Seuil overload : 80% de maxCapacity (1602.4 / 2003)

### Scénario Gherkin
Voir [scenarios/collection.feature](scenarios/collection.feature)

---

## F3. Maintenance

### Description
Le bot gère sa maintenance à la base (dépôt, refuel, réparations).

### Acteurs
- Ship (véhicule principal)
- Score (comptabilité ressources)

### États FSM
- `maintaining` : État de maintenance

### Règles Métier
- **shouldMaintain** : `needsRefuel OR needsRepair OR needsDeposit`
- **needsRefuel** : `fuel < 30`
- **needsRepair** : `damage > 50`
- **needsDeposit** : `resources.total > 100`

### Actions
- **Deposit** : `resources → 0, score++`
- **Refuel** : `fuel → 100`
- **Repair** : `damage → 0`

### Scénario Gherkin
Voir [scenarios/maintenance.feature](scenarios/maintenance.feature)

---

## F4. Évaluation et Décision

### Description
Le bot évalue sa situation et décide de la prochaine action optimale.

### Acteurs
- FSM (machine d'états)
- Guards (règles de décision)

### État FSM
- `evaluating` : Point de décision

### Système de Priorités
1. **P1** : shouldMaintain (maintenance critique)
2. **P2** : shouldCollect (optimisation ressources)
3. **P3** : shouldExplore (découverte territoire)

### Règle de Décision
```
IF shouldMaintain THEN → maintaining
ELSE IF shouldCollect THEN → collecting
ELSE IF shouldExplore THEN → exploring
ELSE → idle (rester en evaluating)
```

---

## F5. Gestion d'Urgence

### Description
Le bot réagit aux événements critiques (fuel bas, urgence).

### Événements Globaux
- `EMERGENCY_STOP` : Interruption immédiate → maintaining
- `LOW_FUEL_WARNING` : Alerte fuel bas → maintaining

### Priorité
**MAXIMALE** : Interrompt toute action en cours

### Scénario Gherkin
Voir [scenarios/emergency.feature](scenarios/emergency.feature)

---

## Résumé des Features

| Feature | Priority | Guards | States | Events |
|---------|----------|--------|--------|--------|
| F1. Exploration | P3 | shouldExplore | 4 | 3 |
| F2. Collection | P2 | shouldCollect, isVehicleOverloaded | 3 | 3 |
| F3. Maintenance | P1 | shouldMaintain | 1 | 3 |
| F4. Évaluation | - | All guards | 1 | 3 |
| F5. Urgence | P0 | None | - | 2 |

**Total :** 5 features, 11 guards, 9 états, 14 événements
