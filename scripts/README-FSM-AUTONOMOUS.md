# Test FSM Autonome avec Tracker Simulé

## 🎯 Objectif

Ce document décrit le test FSM autonome (`test-fsm-autonomous.js`) qui permet de tester la machine à états XState v5 **sans interface R3F** et **sans envoi manuel d'événements**.

Le test utilise un **SimulatedTracker** qui observe l'état de la machine et envoie automatiquement les événements requis en fonction des distances et durées calculées.

---

## 📁 Fichiers Concernés

### Scripts de Test
- **`scripts/test-fsm-autonomous.js`** : Script principal de test autonome
- **`scripts/simulated-tracker.js`** : Tracker simulé qui envoie les événements automatiquement
- **`scripts/fsm-mock-data.js`** : Données mockées (tiles, positions, contexte initial)

### Commandes NPM
```bash
# Test autonome (non-verbose)
npm run test:fsm-autonomous -- --duration=20000

# Test autonome (verbose avec logs détaillés)
npm run test:fsm-autonomous-verbose -- --duration=30000
```

---

## ⚙️ Comment Ça Fonctionne

### 1. **Création du Contexte Initial**
Le test crée un contexte FSM avec :
- Position initiale du vaisseau : `(0, 0, 0)`
- 5 tiles mockées : `0,0` (départ), `1,1`, `2,0`, `3,3`, `7,7`
- Configuration : `exploringRadius: 2`
- Tiles avec propriétés `neighbors`, `walkable`, `collected`, `hasResources`

### 2. **Lancement du SimulatedTracker**
Le tracker s'abonne aux changements d'état de la machine et :
- **Détecte l'état courant** (ex: `drone_deploying`, `ship_moving_to_tile`)
- **Calcule la distance** entre position actuelle et position cible
- **Calcule le temps de trajet** = `distance / vitesse`
- **Programme un événement** après ce délai

### 3. **Événements Envoyés Automatiquement**
Le tracker envoie ces événements :

#### États d'Exploration (Drone)
- **`drone_deploying`** → `DRONE_REACHES_TILE` après `distance / DRONE_SPEED`
- **`drone_scanning`** → `DRONE_HAS_SCANNED` après `800ms`
- **`drone_returning`** → `DRONE_REACHES_BASE` après `distance / DRONE_SPEED`

#### États de Collecte (Ship)
- **`ship_moving_to_tile`** → `SHIP_REACHES_TILE` après `distance / SHIP_SPEED`
- **`ship_collecting`** → `SHIP_LOAD_RESOURCES` après `1200ms`
- **`ship_returning`** → `SHIP_REACHES_BASE` après `distance / SHIP_SPEED`

---

## 📊 Résultats Typiques

### Test de 30 secondes
```
Total State Changes │ 23
Initial State       │ '{"exploring":"drone_deploying"}'
Final State         │ '{"collecting":"ship_moving_to_tile"}'
```

### Séquence d'États
1. **Phase d'exploration** (3 cycles drone)
   - `evaluating` → `exploring.drone_deploying` → `exploring.drone_scanning` → `exploring.drone_returning` → `evaluating`

2. **Transition vers collecte**
   - `evaluating` → `collecting.ship_moving_to_tile`

3. **Phase de collecte** (boucle infinie actuellement)
   - `ship_moving_to_tile` ↔ `ship_collecting` (répété)

---

## 🔧 Constantes de Durée

Définies dans `simulated-tracker.js` :

```javascript
const DURATIONS = {
  DRONE_SPEED: 2.0,          // unités/seconde (rapide)
  SHIP_SPEED: 1.5,           // unités/seconde (moyen)
  SCAN_DURATION: 800,        // ms (scan rapide pour tests)
  COLLECT_DURATION: 1200,    // ms (collecte rapide)
  REFUEL_DURATION: 1500,     // ms
  REPAIR_DURATION: 2000,     // ms
};
```

Ces valeurs sont **volontairement courtes** pour que les tests s'exécutent rapidement (quelques secondes par cycle au lieu de minutes).

---

## ✅ Points Forts

1. ✅ **Aucune dépendance R3F** : Fonctionne en pur Node.js
2. ✅ **Aucun événement manuel** : Tout est automatique
3. ✅ **Calculs réalistes** : Distance euclidienne + temps de trajet
4. ✅ **Logs détaillés** : Mode verbose pour debugging
5. ✅ **Health Check** : Détection automatique de problèmes (stuck states, no progress, etc.)

---

## ⚠️ Limitations Actuelles

### 1. Position du Ship Non Mise à Jour
**Problème** : `Ship position: N/A` dans les logs  
**Cause** : Le contexte FSM ne met pas à jour `context.vehicle.position` pendant le mouvement  
**Impact** : Le calcul de distance utilise la position initiale (0,0)

### 2. Boucle Infinie en Collection
**Problème** : Le ship fait des allers-retours entre la même tile infiniment  
**Cause** : 
- Les tiles ne sont jamais marquées `collected: true` après collecte
- Le guard `hasMoreCollectibleTiles` retourne toujours `true`
- Le ship retourne donc toujours à `ship_moving_to_tile` au lieu de `ship_returning`

**Solution possible** :
- Modifier `assignShipLoadResourcesContext` pour marquer la tile comme `collected: true`
- Ou améliorer `hasMoreCollectibleTiles` pour vérifier si la tile courante a déjà été collectée

### 3. Maintenance Non Testée
**Problème** : Le test ne va pas jusqu'à la phase `maintaining`  
**Cause** : Fuel et damage sont toujours à 100% et 0% dans les mocks  
**Solution** : Ajouter un mode de test où fuel/damage évoluent au fil du temps

---

## 🚀 Améliorations Futures

1. **Simuler l'usure** : Diminuer fuel/damage progressivement
2. **Corriger la boucle de collection** : Marquer tiles comme `collected`
3. **Mettre à jour position du ship** : Interpoler la position pendant le mouvement
4. **Ajouter statistiques** : Ressources collectées, tiles explorées, etc.
5. **Mode stress test** : Tester avec 100+ tiles et plusieurs bots

---

## 📖 Utilisation

### Test Simple
```bash
npm run test:fsm-autonomous -- --duration=20000
```

### Test Verbose avec Logs
```bash
npm run test:fsm-autonomous-verbose -- --duration=30000
```

### Paramètres
- `--duration=<ms>` : Durée du test en millisecondes (défaut: 10000)
- `--verbose` : Active les logs détaillés du tracker

---

## 🧑‍💻 Développeur

Pour modifier le comportement du tracker, éditez `scripts/simulated-tracker.js` :
- **Durées** : Modifiez les constantes `DURATIONS`
- **Événements** : Ajoutez de nouveaux handlers dans `handleExploringState()`, `handleCollectingState()`, etc.
- **Calculs** : Modifiez `calculateDistance()` ou `calculateTravelTime()`

Pour modifier les données de test, éditez `scripts/fsm-mock-data.js` :
- **Tiles** : Ajoutez/modifiez `mockTiles`
- **Contexte** : Modifiez `makeInitialContext()`

---

**Date de création** : 2025-01-XX  
**Auteur** : Copilot + User  
**Version** : 1.0.0
