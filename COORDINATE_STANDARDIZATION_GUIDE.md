# 🔧 GUIDE DE MIGRATION - Standardisation des Coordonnées

## 📋 **OBJECTIF**

Éliminer les incohérences de format de coordonnées qui causent des erreurs dans le projet en adoptant un système unifié.

## 🚨 **PROBLÈMES ACTUELS IDENTIFIÉS**

### **1. Formats multiples conflictuels**
```javascript
// ❌ PROBLÉMATIQUE ACTUELLE
coord: { x: 0, z: 0 }           // Format objet dans initialContext.js
coord: "5,3"                    // Format string dans TileStore  
coord: "A5"                     // Format hex dans générateur
targetPosition: { x: 0, y: 0.5, z: 0 }  // Position 3D
```

### **2. Validations strictes qui échouent**
```javascript
// ❌ VALIDATION QUI ÉCHOUE avec les formats actuels
if (typeof tile.coord !== 'string') {
  throw new Error('Invalid coordinate format: expected "x,y" string');
}
```

## ✅ **SOLUTION STANDARDISÉE**

### **Format unique adopté :**
```javascript
// ✅ STANDARD UNIFIÉ
interface StandardFormats {
  coord: string;              // "x,z" pour TOUTES les coordonnées de tuile
  position: WorldPosition;    // {x, y, z} pour TOUTES les positions 3D
}

// Exemples concrets :
coord: "5,3"                  // Coordonnée de tuile
position: { x: 8.5, y: 0.5, z: 5.1 }  // Position 3D
```

## 🛠️ **ÉTAPES DE MIGRATION**

### **✅ Phase 1 : Contexte FSM (TERMINÉE)**
- [x] Correction de `initialContext.js`
- [x] Standardisation des formats de base
- [x] Création du fichier `coordinateStandards.js`

### **🔄 Phase 2 : Validation des actions**
```bash
# Fichiers à corriger en priorité :
src/ai/fsm/machineX/actions/core/shipCollectingActions.js
src/ai/fsm/machineX/actions/core/droneExploringActions.js
src/ai/fsm/machineX/actions/core/positionActions.js
```

### **🔄 Phase 3 : Hooks et trackers**
```bash
# Fichiers à vérifier :
src/ai/fsm/hooks/trackers/drone/droneTrackerEngine.js
src/animations/useDroneAnimation.js
src/animations/useShipAnimation.js
```

### **🔄 Phase 4 : Composants React**
```bash
# Fichiers à synchroniser :
src/components/Fleet.jsx
src/components/Scene.jsx
src/components/Tile.jsx
```

## 📝 **RÈGLES DE CONVERSION**

### **1. Coordonnées de tuiles → TOUJOURS string "x,z"**
```javascript
// ❌ AVANT
coord: { x: 5, z: 3 }

// ✅ APRÈS  
coord: "5,3"

// Conversion sécurisée :
import { objectToGridCoordinate } from '../constants/coordinateStandards.js';
const standardCoord = objectToGridCoordinate({ x: 5, z: 3 }); // → "5,3"
```

### **2. Positions 3D → TOUJOURS objet {x, y, z}**
```javascript
// ✅ TOUJOURS ce format
position: { x: 8.5, y: 0.5, z: 5.1 }

// Validation sécurisée :
import { isValidWorldPosition } from '../constants/coordinateStandards.js';
if (!isValidWorldPosition(position)) {
  throw new Error('Invalid position format');
}
```

### **3. Chemins → TOUJOURS array de coordonnées string**
```javascript
// ❌ AVANT
path: [{ x: 5, z: 3 }, { x: 6, z: 3 }]

// ✅ APRÈS
path: ["5,3", "6,3"]
```

## 🔧 **UTILITAIRES DISPONIBLES**

### **Import standardisé :**
```javascript
import {
  isValidGridCoordinate,
  isValidWorldPosition,
  objectToGridCoordinate,
  gridCoordinateToObject,
  normalizeToGridCoordinate,
  createStandardTile,
  createStandardTarget,
  COORDINATE_ERRORS
} from '../constants/coordinateStandards.js';
```

### **Fonctions TileStore (existantes) :**
```javascript
import { useTileStore } from '../stores/useTileStore';

const {
  gridToWorld,      // "5,3" → {x: 8.5, y: 0, z: 5.1}
  worldToGrid,      // {x: 8.5, y: 0, z: 5.1} → "5,3"
  hexToGridCoord,   // "A5" → "1,5"
  gridToHexCoord,   // "1,5" → "A5"
} = useTileStore();
```

## 🚦 **TESTS DE VALIDATION**

### **1. Test de cohérence des formats**
```javascript
// À ajouter dans chaque action/reducer :
import { isValidGridCoordinate } from '../constants/coordinateStandards.js';

if (!isValidGridCoordinate(tile.coord)) {
  throw new Error(`Invalid coord format: ${tile.coord}. Expected "x,z"`);
}
```

### **2. Test de conversion**
```javascript
// Vérifier que toutes les conversions fonctionnent :
const testCoord = "5,3";
const position = gridToWorld(testCoord);
const backToCoord = worldToGrid(position);
console.assert(testCoord === backToCoord, 'Conversion round-trip failed');
```

## 📊 **PRIORITÉS D'INTERVENTION**

### **🔴 CRITIQUE (Cause des erreurs actuellement)**
1. `shipCollectingActions.js` - Validation stricte échoue
2. `initialContext.js` - ✅ **CORRIGÉ**
3. Actions core FSM

### **🟡 IMPORTANT (Incohérences de données)**  
1. Hooks d'animation  
2. Trackers de position
3. Composants React

### **🟢 COSMÉTIQUE (Amélioration)**
1. Logs et debugging
2. Documentation
3. Types TypeScript

## ⚡ **COMMANDES RAPIDES**

### **Rechercher les formats problématiques :**
```bash
# Rechercher les coordonnées au format objet
grep -r "coord.*{.*x.*z.*}" src/

# Rechercher les validations de format
grep -r "typeof.*coord.*string" src/

# Rechercher les conversions manuelles
grep -r "coord.*split" src/
```

### **Valider après correction :**
```bash
# Tester l'application
npm run dev

# Vérifier les logs pour les erreurs de format
# Surveiller les erreurs "Invalid coordinate format"
```

## 📈 **BÉNÉFICES ATTENDUS**

1. **Élimination des erreurs de format** (ValidationError : expected "x,y" string)
2. **Code plus maintenable** (un seul format partout)
3. **Performance améliorée** (moins de conversions)
4. **Debugging facilité** (formats prévisibles)
5. **Évolutivité** (ajouts futurs plus simples)

---

**📞 Prochaine étape recommandée :** Corriger `shipCollectingActions.js` qui contient la validation stricte qui échoue actuellement.
