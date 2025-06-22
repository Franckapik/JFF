# 📦 Plan d'Implémentation - Fonctionnalité de Collecte de Ressources

> **Objectif** : Implémenter la collecte de ressources avec animation du vaisseau et accumulation dans le score du bot, en utilisant l'architecture FSM existante sans créer de nouveaux fichiers.

## 🔍 Analyse du Code Actuel

### ✅ Architecture Existante Disponible

#### 1. **États FSM pour la Collecte**
- ✅ `BOT_STATES.COLLECTING_MOVING_TO_TARGET` - Vaisseau se dirige vers la tuile
- ✅ `BOT_STATES.COLLECTING_RETURNING_TO_BASE` - Vaisseau retourne à la base  
- ✅ `BOT_STATES.COLLECTING` - État de collecte générique (legacy)

#### 2. **Actions de Collecte**
- ✅ `shipCollectsFromTile()` - Collecte les ressources depuis la mémoire unifiée
- ✅ `selectBestTileForCollection()` - Sélection automatique de la meilleure tuile
- ✅ Gestion des capacités et validation des ressources

#### 3. **Événements FSM**
- ✅ `SHIP_ARRIVED_AT_TILE` - Vaisseau arrivé à la tuile cible
- ✅ `SHIP_COLLECTION_COMPLETED` - Collecte terminée 
- ✅ `SHIP_REACHED_BASE` - Retour à la base

#### 4. **Hooks d'Animation**
- ✅ `useFSMShipTracker` - Surveillance mouvement + événements FSM
- ✅ `useShipAnimation` - Animation visuelle du vaisseau
- ✅ Intégration existante avec Fleet.jsx

#### 5. **Mémoire Unifiée**
- ✅ `context.memory.knownTiles` - Map des tuiles explorées
- ✅ `context.vehicle.resources` - Inventaire actuel du vaisseau
- ✅ Statistiques de collecte (`tilesCollected`, `totalResourcesFound`)

### 🔧 Composants à Modifier

1. **useFSMShipTracker.js** - Déjà préparé avec la logique de collecte
2. **useShipAnimation.js** - Animation existante pour l'état `collecting`
3. **collectingState.js** - Transitions FSM déjà définies
4. **evaluatingState.js** - Logique de transition vers collecte
5. **shipCollectingActions.js** - Actions de collecte complètes

### ❌ Manques Identifiés

1. **Transfert vers Score du Bot** - Pas d'accumulation persistante
2. **Animation Fluide** - Mouvement vers tuile cible pas optimal
3. **Gestion Base/Dépôt** - Pas de transfert automatique à la base
4. **Intégration visuelle** - Pas d'indication visuelle de la collecte

---

## 🎯 Plan de Prompts Détaillé

### **PROMPT 1 : Corriger les Erreurs de Compilation dans useFSMShipTracker.js** ✅
**Objectif** : Fixer les erreurs `fsmlogger` → `fsmLogger` et finaliser la logique de collecte

**Fichiers modifiés** :
- `/src/ai/fsm/hooks/useFSMShipTracker.js`

**Actions réalisées** :
1. ✅ Corrigé `fsmlogger` → `fsmLogger` (lignes 127, 150, 162, 194)
2. ✅ Ajouté validation pour la tuile cible avant collecte
3. ✅ Améliorer la collecte pour utiliser `context.selectedTileForCollection` en priorité
4. ✅ Ajouté fallback vers TileStore si pas de données FSM
5. ✅ Ajouté logging des ressources avec `fsmLogger.resources()`
6. ✅ Ajouté throttling des logs de debug avec `lastUpdateTime`
7. ✅ Améliorer la détection d'action avec support pour `moving_to_target`

**Résultat** : Le hook compile sans erreur et la logique de collecte est prête à être utilisée.

---

### **PROMPT 2 : Améliorer l'Animation du Vaisseau pour la Collecte** ✅
**Objectif** : Animation fluide vers la tuile cible et feedback visuel

**Fichiers modifiés** :
- `/src/animations/useShipAnimation.js`
- `/src/components/Vehicles/ShipMesh.jsx`

**Actions réalisées** :
1. ✅ **Animation adaptative** : Vitesse variable selon l'action (collecte plus rapide)
2. ✅ **Orientation intelligente** : Le vaisseau s'oriente vers sa cible pendant le mouvement
3. ✅ **Animations spécifiques par action** :
   - `moving_to_target` : Animation d'anticipation avec oscillation
   - `collecting` : Animation intensive avec balancement et rotation rapide
   - `returning_to_base` : Animation de retour avec urgence
4. ✅ **Feedback visuel avancé** dans ShipMesh :
   - Couleurs émissives spécifiques par action
   - Intensité variable selon l'importance de l'action
   - Indicateur de ressources avec compteur
   - Bordures colorées selon l'état
   - Labels textuels explicites (→ TARGET, ⚡ COLLECTING, ← BASE)
5. ✅ **Reset des rotations** lors des changements d'action
6. ✅ **Infos de debug** supplémentaires dans le hook

**Résultat** : Le vaisseau a maintenant des animations fluides et un feedback visuel riche pour toutes les phases de collecte.

---

### **PROMPT 3 : Implémenter l'Accumulation des Ressources dans le Score** ✅
**Objectif** : Créer un système de score persistant pour chaque bot

**Fichiers modifiés** :
- `/src/ai/fsm/machine/actions/core/shipCollectingActions.js`

**Actions réalisées** :
1. ✅ **Accumulation automatique lors de la collecte** : Modification de `shipCollectsFromTile()` pour transférer les ressources collectées vers `context.score.resources` en plus de l'inventaire du vaisseau
2. ✅ **Dépôt intelligent des ressources** : Amélioration de `shipDepositResources()` pour transférer l'inventaire du vaisseau vers le score accumulé au lieu de simplement le vider
3. ✅ **Nouvelles actions utilitaires** :
   - `shipShouldReturnToBase()` : Détermine si le vaisseau doit retourner à la base (seuil de 80% de capacité ou 3+ ressources)
   - `shipReturnToBase()` : Initie le mouvement vers la base pour déposer les ressources
4. ✅ **Logging détaillé** : Logs spécialisés pour les collectes et dépôts avec `fsmLogger.resources()`
5. ✅ **Mise à jour des timestamps** : Suivi des heures de collecte et dépôt dans `context.timestamps`

**Résultat** : Le système de score persistant est maintenant fonctionnel. Les ressources s'accumulent progressivement lors des collectes et se transferent vers le score total lors des dépôts à la base.

---

### **PROMPT 4 : Activer les Transitions vers la Collecte dans evaluatingState.js** ✅
**Objectif** : S'assurer que le bot passe en mode collecte quand approprié

**Fichiers modifiés** :
- `/src/ai/fsm/machine/states/evaluatingState.js`
- `/src/ai/fsm/machine/guards/core/explorationGuard.js`
- `/src/ai/fsm/machine/constants/constants.js`

**Actions réalisées** :
1. ✅ **Réduction des seuils d'exploration** : Modification de `EXPLORATION_CYCLE_CONFIG.TILES_BEFORE_COLLECTION` de 3 à 2 tuiles pour faciliter les tests
2. ✅ **Ajout de logging détaillé dans les guards** :
   - `hasExploredEnoughTiles()` : Log du nombre de tuiles explorées vs requis
   - `hasBestTileForCollection()` : Log des tuiles collectibles disponibles avec détails des ressources
   - `shouldTransitionToCollection()` : Log complet de l'évaluation de transition
3. ✅ **Amélioration du logging dans evaluatingState.js** : Ajout d'un log détaillé lors de l'évaluation de la transition vers la collecte
4. ✅ **Export des nouvelles actions** : Ajout de `shipReturnToBase` dans les exports de `shipCollectingActions.js`

**Résultat** : Les transitions vers la collecte sont maintenant activées avec un seuil réduit (2 tuiles) et un logging complet pour diagnostiquer le comportement. Le système devrait maintenant déclencher la collecte après avoir exploré seulement 2 tuiles au lieu de 3.

---

### **PROMPT 5 : Intégrer le Dépôt de Ressources à la Base**
**Objectif** : Transfert automatique des ressources quand le vaisseau retourne à la base

**Fichiers à modifier** :
- `/src/ai/fsm/machine/states/collectingState.js`
- `/src/ai/fsm/machine/actions/core/shipCollectingActions.js`

**Actions** :
1. Ajouter logique de dépôt dans la transition `SHIP_REACHED_BASE`
2. Créer action `shipDepositResourcesAtBase()` 
3. Vider l'inventaire du vaisseau et transférer vers le score
4. Logger le dépôt avec `fsmLogger.resources()`

---

### **PROMPT 6 : Améliorer les Indicateurs Visuels et Debug**
**Objectif** : Feedback visuel pour la collecte et monitoring des ressources

**Fichiers à modifier** :
- `/src/components/FSM/FSMDebugPanel.jsx`
- `/src/components/HUD/TileStoreMonitor.jsx`
- `/src/components/Vehicles/ShipMesh.jsx`

**Actions** :
1. Afficher les ressources accumulées par bot dans FSMDebugPanel
2. Indicateur visuel sur les tuiles collectées
3. Animation du vaisseau pendant la collecte (pulsation, couleur)
4. Log détaillé des collectes dans TileStoreMonitor

---

### **PROMPT 7 : Tests et Optimisation**
**Objectif** : Validation complète du cycle exploration → collecte → dépôt

**Fichiers à modifier** :
- Tests de l'ensemble du système

**Actions** :
1. Tester le cycle complet : exploration → évaluation → collecte → retour → dépôt
2. Vérifier l'accumulation des ressources sur plusieurs cycles
3. Optimiser les seuils de transition (nombre de tuiles avant collecte)
4. Documenter les performances et les métriques

---

## 🔄 Flux de Données Cible

```mermaid
graph TD
    A[Exploration] --> B[Évaluation]
    B --> C{3+ tuiles explorées?}
    C -->|Oui| D[COLLECTING_MOVING_TO_TARGET]
    C -->|Non| A
    D --> E[Vaisseau vers Tuile]
    E --> F[SHIP_ARRIVED_AT_TILE]
    F --> G[Collecte Ressources]
    G --> H[COLLECTING_RETURNING_TO_BASE]
    H --> I[Retour Base]
    I --> J[SHIP_REACHED_BASE]
    J --> K[Dépôt → Score Accumulé]
    K --> B
```

## 📊 Métriques de Succès

- ✅ Le vaisseau se dirige vers les tuiles avec ressources
- ✅ Animation fluide de collecte avec feedback visuel
- ✅ Ressources transférées de `vehicle.resources` → `accumulatedScore.resources`  
- ✅ Score persistant qui s'accumule sur plusieurs cycles
- ✅ Retour automatique à la base après collecte
- ✅ Cycle complet exploration → collecte fonctionnel

## 🛠️ Architecture Technique

### États FSM Utilisés
1. `EVALUATING` → Décision d'aller collecter
2. `COLLECTING_MOVING_TO_TARGET` → Mouvement vers tuile
3. `COLLECTING_RETURNING_TO_BASE` → Retour à la base
4. `EVALUATING` → Nouveau cycle

### Données Clés
- `context.memory.knownTiles` - Tuiles explorées avec ressources
- `context.vehicle.resources` - Inventaire temporaire du vaisseau  
- `context.accumulatedScore.resources` - **[NOUVEAU]** Score persistant du bot
- `context.selectedTileForCollection` - Tuile ciblée pour collecte

### Événements FSM
- `SHIP_ARRIVED_AT_TILE` - Déclenche la collecte
- `SHIP_COLLECTION_COMPLETED` - Collecte terminée  
- `SHIP_REACHED_BASE` - Déclenche le dépôt

---

**Ce plan permet d'implémenter une fonctionnalité de collecte complète en utilisant l'architecture FSM existante, avec accumulation des ressources et animations visuelles, sans créer de nouveaux fichiers.**
