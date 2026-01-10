# Fairness System - Restauration Documentation

## 📅 Date: 2026-01-09

## 🎯 Objectif

Restauration du système d'analyse de fairness (équité) dans la génération des tuiles et l'affichage dans FSMVisualization.

## ✅ Travaux Réalisés

### 1. **Création du module `core/spatial/fairness.ts`**

Un nouveau module de fonctions pures a été créé pour remplacer le `tileFairnessSlice` qui dépendait de l'ancien `useTileStore` (supprimé).

**Fonctions principales:**
- `validateMapFairness()` - Validation complète de l'équité d'une carte
- `validateSpawnDistance()` - Valide que les spawns sont suffisamment espacés
- `validateResourceBalance()` - Valide l'équilibre des ressources autour des spawns
- `validateStationAccess()` - Valide l'accès équitable aux stations fuel/repair
- `validateTerrainFairness()` - Valide l'équité du terrain walkable
- `calculateHexDistance()` - Calcule la distance hexagonale entre deux coordonnées
- `createSeededRandom()` - Générateur pseudo-aléatoire déterministe

**Configuration:**
- `DEFAULT_FAIRNESS_THRESHOLDS` - Seuils d'équité par défaut (plus permissifs)
- `STRICT_FAIRNESS_THRESHOLDS` - Seuils d'équité stricts (mode compétitif)

### 2. **Restauration du composant `StartingConditionsSection`**

Le composant d'affichage de l'analyse de fairness a été restauré dans `SharedFSMVisualization.tsx`.

**Caractéristiques:**
- ✅ Calcul du fairness score sur 100 avec système d'étoiles (1-5 ⭐)
- ✅ Affichage détaillé de chaque règle avec status (PASS/FAIL)
- ✅ Code couleur visuel (vert/orange/rouge) selon la marge
- ✅ Analyse du bot favorisé (Bot-0, Bot-1, ou Perfectly Balanced)
- ✅ Récupération des données depuis le contexte FSM du worker

**Règles d'équité affichées:**
1. 📏 **Spawn Distance** - Distance minimale entre spawns
2. 💰 **Resource Balance** - Équilibre des ressources autour des spawns
3. ⛽ **Fuel Access** - Accès équitable aux stations fuel
4. 🔧 **Repair Access** - Accès équitable aux stations repair
5. 🌍 **Terrain Fairness** - Équité du terrain walkable
6. ⚖️ **Starting Advantage** - Calcul du bot favorisé

### 3. **Exports et intégration**

- ✅ Exports ajoutés dans `core/spatial/index.ts`
- ✅ Types réutilisés depuis `types/fairness.ts` (déjà existant)
- ✅ Compatibilité maintenue avec les specs Gherkin dans `initialization-fairness.feature`

## 🔄 Différences par rapport à l'ancien système

### Avant (avec useTileStore)
```typescript
// Dans un slice Zustand
const fairness = useTileStore((s) => s.lastFairnessValidation);
```

### Maintenant (avec contexte FSM)
```typescript
// Directement depuis le contexte FSM du worker
const tileMap = bot0Context?.gridInfo?.tiles || {};
const spawns = Object.values(tileMap).filter(t => t.type === 'depart');
const fairnessResult = validateMapFairness(tileMap, spawns, radius);
```

**Avantages:**
- ✅ Plus de dépendance sur un store React externe
- ✅ Fonctions pures, facilement testables
- ✅ Utilisable depuis le worker ou depuis React
- ✅ Architecture plus claire et découplée

## 📊 Sources de données

Le composant récupère les données depuis:
1. **`useSharedWorkerStore.botStates`** - États FSM des bots
2. **`context.gridInfo.tiles`** - TileMap avec toutes les tuiles
3. **`context.gridInfo.radius`** - Rayon de la grille

Le fairness est calculé **à la demande** (pas pré-calculé et stocké).

## 🎨 Vue dans FSMVisualization

La section "Starting Conditions - Fairness Analysis" est maintenant visible et affiche:
- Score global sur 100 avec étoiles
- 6 cards détaillant chaque règle
- Status coloré (EXCELLENT / GOOD / TIGHT / FAIL)
- Valeur vs Threshold pour chaque règle
- Bot favorisé avec raisons

## 🧪 Tests recommandés

Pour tester le système fairness:
1. Lancer l'application: `npm run dev:all`
2. Ouvrir la vue FSMVisualization
3. Vérifier que la section "Starting Conditions" s'affiche
4. Observer les 6 cards de règles
5. Vérifier que le score est cohérent avec les règles

## 📝 Notes importantes

- Les seuils par défaut sont **plus permissifs** que les seuils stricts pour faciliter la génération
- Le système est compatible avec le mode multi-bot (bot-0 et bot-1)
- Les stations doivent être placées AVANT la validation pour éviter les erreurs 999
- Le calcul est déterministe si un seed est fourni

## 📚 Références

- Spec Gherkin: `docs/bot-spec/scenarios/initialization-fairness.feature`
- Types: `src/types/fairness.ts`
- Module fairness: `src/core/spatial/fairness.ts`
- Composant: `src/components/SharedFSMVisualization.tsx`

## ✨ Prochaines étapes possibles

1. Ajouter des tests unitaires pour `fairness.ts`
2. Permettre de choisir entre DEFAULT et STRICT thresholds depuis l'UI
3. Afficher l'historique des validations (tentatives multiples)
4. Logger le fairness dans les logs de jeu
