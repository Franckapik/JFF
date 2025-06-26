# 🚀 État des Lieux et Roadmap de Migration Robot3 → XState

## 📊 État Actuel de l'Architecture Hybride

### 🔄 Coexistence des Deux Systèmes

L'application fonctionne actuellement avec **deux systèmes FSM parallèles** :

#### 🟢 **Système XState v5 + Zustand (NOUVEAU)**
- **Store Principal :** `/src/stores/useFSMStore.js` 
- **Hook :** `/src/hooks/useFSM.js`
- **Status :** ✅ Fonctionnel, sans boucles infinies
- **Avantages :** État partagé, snapshots cachés, performance optimisée

#### 🟡 **Système Robot3 (ANCIEN)**
- **Store Principal :** `/src/stores/useFSMStore/` (dossier)
- **Status :** ✅ Stable mais legacy
- **Inconvénients :** Pas d'état partagé, logique distribuée

---

## 📁 Inventaire Détaillé des Fichiers

### 🆕 **Fichiers XState (À conserver)**

#### Core XState
```
/src/stores/
├── useFSMStore.js                    # ✅ Store XState principal
└── useFSMStoreXState.js              # 🔄 Version alternative (à fusionner)

/src/hooks/
├── useFSM.js                         # ✅ Hook principal XState
└── useFSMComplete.js                 # 🔄 Version étendue (à fusionner)

/src/ai/fsm/hooks/
├── useBotMachine.js                  # 🔄 Hook de compatibilité (à migrer)
├── useBotMachineCompat.js            # 🔄 Hook de compatibilité (à supprimer)
└── useCentralizedEventHistorySync.js # 🔄 Hook legacy (à adapter)
```

#### Composants XState
```
/src/components/FSM/
├── FSMHUDFixed.jsx                   # ✅ Version XState stable
├── FusedBotManagerHUDFixed.jsx       # ✅ Version XState stable
├── BotInstanceXStateTest.jsx         # ✅ Composant de test XState
└── StoreTestMinimal.jsx              # ✅ Test minimal

/src/components/HUD/
└── CentralFSMHudFixed.jsx            # ✅ Version XState stable
```

### 🔶 **Fichiers Robot3 (À migrer)**

#### Core Robot3
```
/src/stores/useFSMStore/
├── index.js                          # 🔶 Store Robot3 principal
├── useFSMBots.js                     # 🔶 Hook Robot3
└── useFSMEventHistory.js             # 🔶 Gestion d'historique Robot3

/src/stores/useOLDFSMROBOTStore/
├── index.js                          # 🔶 Ancienne version Robot3
└── useFSMBots.js                     # 🔶 Hook Robot3 ancien
```

#### Composants Robot3
```
/src/components/FSM/
├── FSMHUD.jsx                        # 🔶 Version Robot3 (DÉSACTIVÉE)
├── FusedBotManagerHUD.jsx            # 🔶 Version Robot3 (DÉSACTIVÉE)
└── FSMStateIndicator.jsx             # 🔶 Indicateur Robot3

/src/components/HUD/
└── CentralFSMHud.jsx                 # 🔶 Version Robot3 (DÉSACTIVÉE)
```

### 🔄 **Fichiers Hybrides (Utilisent les deux)**

```
/src/components/Scene.jsx             # 🔄 Utilise Robot3 (activeBots via useFSMStore ancien)
/src/stores/useTileStore/slices/
└── tileFilterSlice.js                # 🔄 Synchronisation avec Robot3
```

---

## 🧪 Test de Validation de l'État Partagé XState

### Test Simple : Vérification de l'Instance Unique

Créons un test minimal pour vérifier que l'état XState est bien partagé entre composants :

```jsx
// /src/components/Tests/XStateSharedTest.jsx
import React, { useState } from 'react';
import { useFSM } from '../../hooks/useFSM';

const TestComponent1 = () => {
  const { fsmState, send, context } = useFSM('test-bot');
  
  return (
    <div style={{ border: '2px solid blue', padding: '10px', margin: '5px' }}>
      <h4>Composant 1 (test-bot)</h4>
      <p>État: {JSON.stringify(fsmState?.value)}</p>
      <p>Compteur: {context?.sharedCounter || 0}</p>
      <button onClick={() => send({ type: 'INCREMENT' })}>
        Incrémenter depuis Composant 1
      </button>
    </div>
  );
};

const TestComponent2 = () => {
  const { fsmState, send, context } = useFSM('test-bot'); // MÊME botId
  
  return (
    <div style={{ border: '2px solid red', padding: '10px', margin: '5px' }}>
      <h4>Composant 2 (test-bot)</h4>
      <p>État: {JSON.stringify(fsmState?.value)}</p>
      <p>Compteur: {context?.sharedCounter || 0}</p>
      <button onClick={() => send({ type: 'INCREMENT' })}>
        Incrémenter depuis Composant 2
      </button>
    </div>
  );
};

const XStateSharedTest = () => {
  const [showTest, setShowTest] = useState(false);
  const { addBot } = useFSM();

  const initTest = () => {
    addBot('test-bot');
    setShowTest(true);
  };

  return (
    <div style={{ position: 'fixed', top: '100px', left: '100px', 
                  background: 'white', padding: '20px', border: '3px solid green',
                  zIndex: 10000 }}>
      <h3>🧪 Test État Partagé XState</h3>
      
      {!showTest ? (
        <button onClick={initTest}>Démarrer le Test</button>
      ) : (
        <>
          <p>✅ Si les deux composants affichent le MÊME compteur et état → État partagé OK</p>
          <p>❌ Si les compteurs sont différents → Problème d'instances multiples</p>
          
          <TestComponent1 />
          <TestComponent2 />
          
          <button onClick={() => setShowTest(false)}>Masquer le Test</button>
        </>
      )}
    </div>
  );
};

export default XStateSharedTest;
```

### Activation du Test

Dans `App.jsx`, ajouter temporairement :

```jsx
import XStateSharedTest from './components/Tests/XStateSharedTest';

// Dans le JSX, après les autres HUDs :
{/* Test temporaire - État partagé XState */}
{process.env.NODE_ENV === 'development' && <XStateSharedTest />}
```

---

## 🎯 Plan de Migration Progressive

### 📋 **Phase 1 : Préparation et Tests (ACTUEL)**
- [x] Architecture XState stable et fonctionnelle
- [x] Composants Fixed opérationnels
- [x] Documentation de l'état hybride
- [ ] Test de validation de l'état partagé
- [ ] Audit complet des dépendances Robot3

### 📋 **Phase 2 : Migration des Composants Critiques**

#### Étape 2.1 : Migration de Scene.jsx
**Objectif :** Faire fonctionner Scene.jsx avec XState

**Fichier à modifier :** `/src/components/Scene.jsx`

```jsx
// AVANT (Robot3)
const activeBots = useFSMStore((state) => state.activeBots);

// APRÈS (XState)
import { useFSMStore } from '../stores/useFSMStore'; // XState store
const activeBots = useFSMStore((state) => state.activeBots);
```

**Prompt pour LLM :**
```
Migrer Scene.jsx de Robot3 vers XState :
1. Remplacer l'import useFSMStore Robot3 par useFSMStore XState
2. Vérifier que activeBots fonctionne correctement
3. S'assurer que syncStartingTilesWithFSMBots continue de fonctionner
4. Tester que les tuiles de départ se synchronisent avec les bots XState
```

#### Étape 2.2 : Migration de tileFilterSlice.js
**Objectif :** Synchroniser les tuiles avec XState au lieu de Robot3

**Fichier à modifier :** `/src/stores/useTileStore/slices/tileFilterSlice.js`

**Prompt pour LLM :**
```
Migrer tileFilterSlice.js vers XState :
1. Remplacer l'import useFSMStore Robot3 par XState
2. Adapter syncDepartTilesWithActiveBots pour utiliser le nouveau store
3. Vérifier que getDepartTiles continue de fonctionner
4. Tester la synchronisation des tuiles avec les bots XState
```

### 📋 **Phase 3 : Consolidation des Hooks**

#### Étape 3.1 : Fusion des Hooks XState
**Objectifs :**
- Fusionner `useFSM.js` et `useFSMComplete.js`
- Fusionner `useFSMStore.js` et `useFSMStoreXState.js`
- Supprimer les hooks de compatibilité

**Prompt pour LLM :**
```
Consolider les hooks XState :
1. Analyser les différences entre useFSM.js et useFSMComplete.js
2. Créer une version unifiée avec toutes les fonctionnalités
3. Fusionner les stores useFSMStore.js et useFSMStoreXState.js
4. Supprimer les fichiers redondants
5. Mettre à jour tous les imports
```

#### Étape 3.2 : Suppression des Hooks Robot3
**Fichiers à supprimer :**
- `/src/ai/fsm/hooks/useBotMachineCompat.js`
- `/src/ai/fsm/hooks/useCentralizedEventHistorySync.js`
- Tous les hooks dans `/src/stores/useFSMStore/`

### 📋 **Phase 4 : Nettoyage Final**

#### Étape 4.1 : Suppression des Composants Robot3
**Fichiers à supprimer :**
```
/src/components/FSM/
├── FSMHUD.jsx                        # Robot3
├── FusedBotManagerHUD.jsx            # Robot3
└── FSMStateIndicator.jsx             # Robot3

/src/components/HUD/
└── CentralFSMHud.jsx                 # Robot3
```

#### Étape 4.2 : Suppression des Stores Robot3
**Dossiers à supprimer :**
```
/src/stores/useFSMStore/              # Entier dossier Robot3
/src/stores/useOLDFSMROBOTStore/      # Entier dossier Robot3 ancien
```

#### Étape 4.3 : Renommage et Finalisation
**Renommages :**
```
FSMHUDFixed.jsx          → FSMHUD.jsx
FusedBotManagerHUDFixed.jsx → FusedBotManagerHUD.jsx
CentralFSMHudFixed.jsx   → CentralFSMHud.jsx
```

---

## 🚨 Points d'Attention pour la Migration

### ⚠️ **Risques Identifiés**
1. **Boucles infinies** : Bien tester chaque étape
2. **Perte d'état** : Sauvegarder la configuration avant migration
3. **Dépendances cachées** : Vérifier tous les imports
4. **Tests de régression** : Valider que les fonctionnalités existantes marchent

### ✅ **Validation à chaque Étape**
1. **Test de l'état partagé** : Le test XStateSharedTest doit passer
2. **Test des HUDs** : Tous les HUDs doivent afficher les bonnes données
3. **Test de Scene.jsx** : Les bots doivent apparaître correctement
4. **Test de synchronisation** : Les tuiles doivent se synchroniser

### 🛠️ **Outils de Validation**
```bash
# Vérifier les imports/exports
npm run check-exports

# Tests automatisés
npm test

# Build de production
npm run build
```

---

## 📝 **Prompts Détaillés pour chaque Phase**

### Prompt Phase 2.1 - Scene.jsx
```
Je veux migrer Scene.jsx de Robot3 vers XState. Actuellement, Scene.jsx utilise :

```javascript
const activeBots = useFSMStore((state) => state.activeBots);
```

Ce useFSMStore provient du système Robot3. Je veux le faire pointer vers le nouveau store XState qui se trouve dans `/src/stores/useFSMStore.js`.

Actions requises :
1. Identifier le bon import pour useFSMStore XState
2. Remplacer l'import actuel
3. Vérifier que la propriété activeBots existe dans le nouveau store
4. S'assurer que syncStartingTilesWithFSMBots continue de fonctionner
5. Tester que les tuiles se synchronisent correctement avec les bots XState

Peux-tu effectuer cette migration en conservant toute la fonctionnalité existante ?
```

### Prompt Phase 3.1 - Consolidation
```
Je veux consolider les hooks XState qui sont actuellement dupliqués :

Fichiers à analyser :
- `/src/hooks/useFSM.js` (version actuelle)
- `/src/hooks/useFSMComplete.js` (version étendue)
- `/src/stores/useFSMStore.js` (store principal)
- `/src/stores/useFSMStoreXState.js` (store alternatif)

Objectifs :
1. Créer un hook useFSM unifié avec toutes les fonctionnalités
2. Créer un store useFSMStore unifié
3. Supprimer les doublons
4. Mettre à jour tous les imports dans l'application

Peux-tu analyser les différences et créer les versions consolidées ?
```

### Prompt Phase 4 - Nettoyage Final
```
Phase finale de migration Robot3 → XState. Je veux :

1. Supprimer tous les fichiers Robot3 restants :
   - `/src/stores/useFSMStore/` (dossier entier)
   - `/src/stores/useOLDFSMROBOTStore/` (dossier entier)
   - Composants Robot3 désactivés

2. Renommer les composants Fixed en versions finales :
   - FSMHUDFixed.jsx → FSMHUD.jsx
   - FusedBotManagerHUDFixed.jsx → FusedBotManagerHUD.jsx
   - CentralFSMHudFixed.jsx → CentralFSMHud.jsx

3. Nettoyer App.jsx pour supprimer les références Robot3

4. Mettre à jour la documentation

Peux-tu effectuer ce nettoyage final en t'assurant que l'application reste fonctionnelle ?
```

---

## 🎯 **Objectif Final**

À la fin de la migration, l'application aura :
- ✅ **Un seul système FSM** : XState v5 + Zustand
- ✅ **État partagé** : Tous les composants utilisent la même instance
- ✅ **Performance optimisée** : Snapshots cachés, pas de boucles infinies
- ✅ **Code simplifié** : Plus de doublons ni de compatibilité
- ✅ **Maintenabilité** : Architecture claire et documentée

---

## 📚 **Ressources et Documentation**

- **Architecture Actuelle :** `HYBRID_ARCHITECTURE.md`
- **Guide de Prévention :** `src/docs/import-export-prevention-guide.md`
- **Positionnement HUDs :** `HUD_POSITIONING_GUIDE.md`
- **Corrections Effectuées :** `CORRECTIONS_SUMMARY.md`

---

*Document mis à jour le 26 juin 2025*
*Status : Architecture hybride stable, prête pour migration progressive*
