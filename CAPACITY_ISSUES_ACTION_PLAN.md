# PLAN D'ACTION - Correction des problèmes de capacité et ressources

## 🚨 PROBLÈMES IDENTIFIÉS DANS LE LOG

### 1. **Capacité incorrecte du vaisseau**
- **Symptôme** : `(Infinity% full)` et `totalMaxCapacity: 0`
- **Cause** : `vehicle.maxCapacity` retourne `10` au lieu de `{ food: 200, debris: 1800, special: 3 }`
- **Impact** : Calculs de capacité faux, retour à la base prématuré ou tardif

### 2. **Double collecte mystérieuse**
- **Symptôme** : Deux logs "Collection successful" pour la même tuile avec des ressources différentes
- **Exemple** :
  ```
  Ligne 637: {"food":42,"debris":693,"special":0} -> Vehicle: {"food":42,"debris":693,"special":0}
  Ligne 643: {"food":42,"debris":693,"special":0} -> Vehicle: {"food":161,"debris":1273,"special":2}
  ```
- **Impact** : Ressources dupliquées, incohérence entre FSM et affichage

### 3. **Fallbacks obsolètes**
- **Localisation** : `shipCollectingActions.js` ligne 228, 677
- **Symptôme** : Utilisation de capacités obsolètes `{ food: 100, debris: 1000, special: 10 }`
- **Impact** : Calculs incorrects, affichage erroné

### 4. **Affichage FSM Debug Panel insuffisant**
- **Symptôme** : Pas de détail des pourcentages par type de ressource
- **Impact** : Difficile de diagnostiquer les problèmes de capacité

### 5. **Types de véhicules obsolètes**
- **Symptôme** : Confusion entre `VEHICLE_TYPES.SHIP` et `VEHICLE_TYPES.MAIN_SHIP`
- **Localisation** : 
  - `vehicleFactory.js` utilise `VEHICLE_TYPES.SHIP`
  - `constants.js` définit `VEHICLE_TYPES.MAIN_SHIP`
  - Potentiellement des références obsolètes dans d'autres stores
- **Impact** : Incohérence des capacités, confusion des types

### 6. **Bot Store potentiellement obsolète**
- **Symptôme** : Le bot store pourrait contenir de la logique obsolète
- **Impact** : Conflits avec la nouvelle logique FSM, doubles states, ressources incohérentes
- **Investigation nécessaire** : Vérifier si le bot store interfère avec la FSM

## 📋 PLAN D'ACTION PRIORITAIRE

### 🔥 **URGENT - Phase 1 : Correction de la capacité**

#### 1.1 Forcer l'utilisation des bonnes capacités
```javascript
// Dans shipCollectingActions.js - fonction shipShouldReturnToBase
const maxCapacity = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP]; // Forcer, pas de fallback
```

#### 1.2 Corriger les fallbacks obsolètes
```javascript
// Ligne 228 - remplacer
const defaultCapacities = DEFAULT_CAPACITIES[VEHICLE_TYPES.MAIN_SHIP];
// au lieu de { food: 100, debris: 1000, special: 10 }
```

#### 1.3 Mettre à jour vehicleFactory.js pour créer les véhicules avec les bonnes capacités
- S'assurer que `maxCapacity: DEFAULT_CAPACITIES[VEHICLE_TYPES.SHIP]` est correct

#### 1.4 Audit des types de véhicules
- Vérifier tous les usages de `VEHICLE_TYPES.SHIP` vs `VEHICLE_TYPES.MAIN_SHIP`
- Décider si on garde les deux ou on unifie sur un seul type
- Corriger toutes les références pour être cohérentes

#### 1.5 Investigation Bot Store obsolète
- Examiner `useBotStore` pour vérifier s'il interfère avec la FSM
- Identifier les doubles états ou conflits de ressources
- Désactiver ou supprimer le code obsolète si nécessaire

### ⚡ **IMPORTANT - Phase 2 : Affichage amélioré**

#### 2.1 Améliorer FSMDebugPanel.jsx
```javascript
// Affichage détaillé des ressources avec pourcentages
const renderResourceDetails = (resources, maxCapacity) => {
  return Object.entries(resources).map(([type, amount]) => {
    const max = maxCapacity[type] || 0;
    const percentage = max > 0 ? Math.round((amount / max) * 100) : 0;
    return `${type}: ${amount}/${max} (${percentage}%)`;
  }).join(', ');
};
```

#### 2.2 Corriger l'affichage de la capacité totale
```javascript
// Utiliser la même logique que resourcesGuard.js
const totalCapacity = Object.values(maxCapacity).reduce((sum, cap) => sum + cap, 0);
const totalResources = Object.values(resources).reduce((sum, res) => sum + res, 0);
const totalPercentage = Math.round((totalResources / totalCapacity) * 100);
```

### 🔍 **INVESTIGATION - Phase 3 : Double collecte**

#### 3.1 Ajouter des logs de debug détaillés
```javascript
// Dans shipCollectsFromTile - avant et après chaque étape
console.log('🔍 BEFORE collection:', {
  vehicleResourcesBefore: vehicle.resources,
  tileResources: tileData.resources,
  timestamp: Date.now()
});
```

#### 3.2 Vérifier la synchronisation FSM ↔ Store
- S'assurer qu'il n'y a qu'un seul update du véhicule par collecte
- Vérifier les événements FSM pour éviter les doublons

#### 3.3 Analyser les transitions d'état
- Vérifier que `SHIP_ARRIVED_AT_TILE` n'est déclenché qu'une fois
- S'assurer que la collecte ne se fait pas en double

## 🎯 **TESTS DE VALIDATION**

### Après Phase 1 (mise à jour) :
- [ ] Plus d'affichage `(Infinity% full)`
- [ ] Capacité totale = 2003 (200+1800+3)
- [ ] Pourcentage correct (ex: 812/2003 = 40%)
- [ ] **Types de véhicules cohérents** (SHIP = MAIN_SHIP)
- [ ] **Bot Store n'interfère plus** avec la FSM

### Après Phase 2 :
- [ ] FSM Debug Panel affiche : "food: 107/200 (54%), debris: 702/1800 (39%), special: 3/3 (100%)"
- [ ] Total affiché : "812/2003 (41%)"

### Après Phase 3 :
- [ ] Plus de double logs "Collection successful"
- [ ] Ressources du véhicule cohérentes
- [ ] Une seule collecte par tuile visitée

## 🚀 **ORDRE D'EXÉCUTION**

1. **Immédiat** : Corriger les capacités (Phase 1)
2. **Ensuite** : Améliorer l'affichage (Phase 2)  
3. **En parallèle** : Investiguer la double collecte (Phase 3)

## 📊 **MÉTRIQUES DE SUCCÈS**

- **Capacité** : Affichage correct du pourcentage (≠ Infinity%)
- **Collecte** : Une seule ligne "Collection successful" par tuile
- **Debug** : Affichage détaillé par type de ressource
- **Cohérence** : Ressources véhicule = somme des collectes
