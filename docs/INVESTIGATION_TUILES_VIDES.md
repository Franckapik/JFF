# 🔍 Investigation: Tuiles Collectées avec 0 Ressources

**Date**: 4 janvier 2026  
**Problème**: 4 tuiles sur 5 collectées ont 0 ressources (F:0 D:0 S:0)

---

## 📋 Liste Observée

```
📦 Tuiles collectées (5)
=====================================

0,5 [resource/grassland] ✓ - F:72 D:646 S:2   ← ✅ OK (720 total)
1,4 [resource/grassland] ✓ - F:0 D:0 S:0      ← ❌ VIDE
2,3 [resource/grassland] ✓ - F:0 D:0 S:0      ← ❌ VIDE  
3,4 [resource/grassland] ✓ - F:0 D:0 S:0      ← ❌ VIDE
4,4 [resource/grassland] ✓ - F:0 D:0 S:0      ← ❌ VIDE

-------------------------------------
TOTAUX: Food=72, Debris=646, Special=2, Total=720
```

**Statistiques** : 
- ✅ 1/5 tuile avec ressources (720 total)
- ❌ 4/5 tuiles VIDES
- 🏷️ Toutes typées `resource/grassland`

---

## 🔎 Analyse du Code

### 1️⃣ Guard `shouldCollect` ✅ CORRECT

[guards.pure.ts:356-363](src/ai/fsm/machineX/domains/evaluation/guards.pure.ts#L356-L363)

```typescript
const hasCollectibleTiles = knownTiles.some(tile => 
  tile?.explored === true &&
  tile?.hasResources && 
  !tile?.collected && 
  tile?.resources?.total > 0  // ✅ VÉRIFIE resources.total > 0
);
```

**Verdict** : Le guard vérifie correctement `resources.total > 0`. Pas de bug ici.

---

### 2️⃣ Action `assignShipMovingToTileContext` ✅ CORRECT

[actions.assign.ts:89-135](src/ai/fsm/machineX/domains/collection/actions.assign.ts#L89-L135)

**Priorité 1** : Tuiles explorées avec ressources
```typescript
const knownTilesWithResources = knownTiles.filter(tile => 
  tile?.resources && 
  tile.resources.total > 0 &&  // ✅ VÉRIFIE total > 0
  !tile.collected &&
  tile.hasResources
);
```

**Fallback** : Cherche dans un rayon aléatoire
```typescript
const tilesWithResources = exploredTiles.filter(tile => 
  tile?.resources && tile.resources.total > 0  // ✅ VÉRIFIE total > 0
);

targetVehicleTile = tilesWithResources.length > 0 
  ? selectRandomTile(tilesWithResources)
  : (exploredTiles.length > 0 ? selectRandomTile(exploredTiles) : null);  // ⚠️ PROBLÈME ICI !
```

**🚨 BUG IDENTIFIÉ** :

Si `tilesWithResources.length === 0` ET `exploredTiles.length > 0`, le code sélectionne **N'IMPORTE QUELLE tuile explorée**, même si elle n'a **PAS de ressources** !

---

### 3️⃣ Action `assignShipLoadResourcesContext` ✅ GÈRE BIEN LES VIDES

[actions.assign.ts:352-461](src/ai/fsm/machineX/domains/collection/actions.assign.ts#L352-L461)

```typescript
if (!currentTile || !currentTile.resources || currentTile.resources.total <= 0) {
  // ✅ FIX: Même si vide, SYNCHRONISER le contexte
  // Marque collected: true pour éviter la boucle
  // Cherche une nouvelle cible automatiquement
}
```

**Verdict** : L'action gère correctement les tuiles vides en :
1. Les marquant `collected: true`
2. Cherchant une nouvelle cible
3. Évitant la boucle infinie

Mais le **problème est en amont** : la tuile n'aurait jamais dû être ciblée !

---

## 🎯 Cause Racine

### **Fallback dans `assignShipMovingToTileContext`**

**Ligne problématique** :
```typescript
targetVehicleTile = tilesWithResources.length > 0 
  ? selectRandomTile(tilesWithResources)
  : (exploredTiles.length > 0 ? selectRandomTile(exploredTiles) : null);
  //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //  🚨 Sélectionne UNE TUILE EXPLORÉE SANS RESSOURCES !
```

**Scénario déclencheur** :
1. `memory.knownTiles` ne contient **aucune tuile avec ressources** (toutes collectées ou jamais eu)
2. Fallback activé → cherche dans un rayon `collectingRadius=3`
3. Trouve des `exploredTiles` (tuiles explorées, peu importe les ressources)
4. Trouve `tilesWithResources.length === 0` (aucune avec resources.total > 0)
5. 🚨 **Sélectionne une tuile explorée SANS ressources**

---

## 💡 Hypothèse Secondaire

**Pourquoi ces tuiles sont typées `resource/grassland` ?**

Peut-être que :
1. Les tuiles ont été **générées** avec `type: 'resource'` mais `resources.total === 0` dès l'initialisation
2. Ou les ressources ont été **consommées** avant l'exploration (peu probable)

**À vérifier** : 
- Initialisation des tuiles dans `useTileStore`
- Logs de création de la grille
- Si `type: 'resource'` implique automatiquement `hasResources: true` même avec 0 ressources

---

## 🔧 Solution Recommandée

### **Option 1** : Supprimer le fallback vers tuiles sans ressources

```typescript
// ❌ ANCIEN CODE
targetVehicleTile = tilesWithResources.length > 0 
  ? selectRandomTile(tilesWithResources)
  : (exploredTiles.length > 0 ? selectRandomTile(exploredTiles) : null);

// ✅ NOUVEAU CODE
targetVehicleTile = tilesWithResources.length > 0 
  ? selectRandomTile(tilesWithResources)
  : null;  // Pas de fallback si aucune ressource disponible
```

**Avantages** :
- Empêche la collection de tuiles vides
- Réduit le gaspillage de fuel
- Force la FSM à passer en exploration si pas de ressources

**Inconvénient** :
- Si toutes les tuiles explorées sont vides, le ship restera bloqué

---

### **Option 2** : Vérifier `hasResources` en plus de `explored`

```typescript
const exploredTiles = candidateTiles.filter(tile => 
  tile?.explored === true && 
  !tile?.collected &&
  tile?.hasResources === true  // ✅ AJOUT
);
```

**Avantages** :
- Plus de sécurité
- Garantit que seules les tuiles avec le flag `hasResources` sont ciblées

---

### **Option 3** : Ajouter un log d'avertissement

Si le fallback est conservé, au moins logger clairement :

```typescript
if (tilesWithResources.length === 0 && exploredTiles.length > 0) {
  fsmLogger.warn(`⚠️ [${context.entityId}] No tiles with resources found, selecting random explored tile (may be empty)`, {
    exploredTiles: exploredTiles.length
  });
}
```

---

## 📊 Recommandation Finale

**Appliquer Option 1 + Option 2** :
1. Supprimer le fallback vers tuiles sans ressources
2. Ajouter `tile?.hasResources === true` dans le filtre `exploredTiles`
3. Si aucune tuile avec ressources, retourner `null` → FSM passe en exploration

**Avantage combiné** :
- Zéro collection de tuiles vides
- Priorité absolue aux tuiles avec ressources
- Économie de fuel significative

---

## 🧪 Test de Validation

Après le fix, vérifier :
```
✅ Aucune tuile avec resources.total === 0 n'est collectée
✅ CollectedTilesList affiche UNIQUEMENT des tuiles avec ressources > 0
✅ Guard shouldCollect + Action assignShipMovingToTileContext synchronisés
✅ Pas de boucle ship_moving_to_tile → ship_collecting sur tuiles vides
```
