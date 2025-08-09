# Génération du Plateau, Propriétés des Tuiles et Système de Voisinage

## 1. Génération du Plateau Hexagonal

La génération du plateau est gérée par la fonction `initializeGameGrid` (voir `tileGenerationSlice.ts`). Elle crée une grille hexagonale de tuiles selon un rayon donné (ex : 3) et un espacement. Chaque tuile est positionnée en coordonnées 3D (x, y, z) selon sa place dans la grille hexagonale.

- **Coordonnées hexagonales** : chaque tuile est identifiée par un couple (q, r) transformé en string (`GridCoordinate`), et possède aussi une propriété `tileCoord` (objet `{x, z}`) pour la compatibilité.
- **Position 3D** : la position réelle dans l'espace est calculée à partir de (q, r) pour obtenir `{x, y, z}`.
- **Voisins** : chaque tuile connaît ses voisins directs (6 max) via la propriété `neighbors` (array de `GridCoordinate`).
- **Types de tuiles** : food, fuel, repair, danger, depart (départ).
- **Ressources** : chaque tuile possède un objet `resources` (food, debris, special, total).
- **Propriétés diverses** : walkable, explored, collected, hasResources, color, biome, etc.

## 2. Propriétés d'une Tuile

Exemple de structure d'une tuile :
```ts
{
  coord: "3,2", // GridCoordinate
  tileCoord: { x: 3, z: 2 },
  position: { x: 1.2, y: 0, z: 2.4 }, // WorldPosition
  type: "food", // ou "fuel", "repair", "danger", "depart"
  biome: "grassland",
  walkable: true,
  explored: false,
  collected: false,
  neighbors: ["3,1", "2,2", ...], // GridCoordinate[]
  resources: { food: 10, debris: 20, special: 0, total: 30 },
  hasResources: true,
  color: "#abcdef"
}
```

## 3. Système de Voisinage

- **Calcul** : Pour chaque tuile, les 6 directions hexagonales sont testées pour générer la liste des voisins (dans les bornes du rayon).
- **Utilité** : Permet le pathfinding (BFS), la sélection de tuiles proches, et la navigation logique sur le plateau.

## 4. Sélection de Tuiles dans un Rayon (selectTargetTileInRadiusForDrone) - VERSION CORRIGÉE

La fonction `selectTargetTileInRadiusForDrone(shipPosition, range, tiles)` utilise maintenant un algorithme BFS (Breadth-First Search) basé sur les GridCoordinate :

### Étapes de l'algorithme :
1. **Localisation du vaisseau** : Trouve la tuile correspondant à la position du vaisseau avec `findTileAtPosition`
2. **Recherche BFS** : Explore les tuiles voisines niveau par niveau jusqu'au rayon spécifié
3. **Filtrage des candidats** : Collecte uniquement les tuiles valides (walkable, non collectées, distance > 0)
4. **Sélection aléatoire** : Choisit une tuile parmi les candidats valides
5. **Conversion** : Retourne la WorldPosition de la tuile sélectionnée

### Avantages de cette approche :
- ✅ **Respect du plateau** : Ne peut jamais sélectionner une position hors du plateau généré
- ✅ **Utilisation des voisins** : Exploite le système de voisinage hexagonal existant
- ✅ **Distance hexagonale** : Le `range` correspond au nombre réel de tuiles (distance de Manhattan hexagonale)
- ✅ **Pas de fallback aléatoire** : Retourne `null` si aucune tuile valide n'est trouvée
- ✅ **Performance** : BFS garantit une exploration optimale des tuiles proches d'abord

### Différences avec l'ancienne version :
- **Avant** : Calculait la distance euclidienne en WorldPosition (imprécis, pouvait sortir du plateau)
- **Maintenant** : Utilise la distance hexagonale sur les GridCoordinate (précis, respect du plateau)

## 5. Solution Implémentée

La fonction `selectTargetTileInRadiusForDrone` a été complètement refondue pour utiliser :

### Algorithme BFS (Breadth-First Search) :
```
1. Partir de la tuile du vaisseau (GridCoordinate)
2. Explorer les voisins niveau par niveau
3. Collecter les tuiles valides dans le rayon
4. Sélectionner aléatoirement parmi les candidats
5. Convertir en WorldPosition pour le retour
```

### Critères de sélection :
- **Distance** : <= range (en nombre de tuiles, pas en unités monde)
- **Validité** : walkable = true, collected = false
- **Exclusion** : ne pas sélectionner la tuile de départ du vaisseau
- **Sécurité** : retourne null si aucune tuile valide (pas de fallback aléatoire)

### Exemple visuel :
```
Range = 2 autour du vaisseau (V) :

  . . . . .
 . 2 2 2 2 .
. 2 1 1 1 2 .
 . 2 1 V 1 2 .
. 2 1 1 1 2 .
 . 2 2 2 2 .
  . . . . .

1 = tuiles à distance 1 (candidats)
2 = tuiles à distance 2 (candidats)
. = tuiles hors rayon
```

## 6. Résumé visuel

```
[Plateau hexagonal]
   o o o o o
  o o o o o o
 o o o o o o o
  o o o o o o
   o o o o o

Chaque "o" = une tuile, chaque tuile connaît ses 6 voisins.
```

## 7. Exemple de plateau hexagonal (rayon 3) avec coordonnées de grille

Ci-dessous, chaque case représente une tuile et affiche sa coordonnée de grille (GridCoordinate) sous la forme "q,r" (q = colonne, r = ligne) pour un rayon 3 :

```
      0,3   1,2   2,1   3,0
    0,4   1,3   2,2   3,1   4,0
  0,5   1,4   2,3   3,2   4,1   5,0
    1,5   2,4   3,3   4,2   5,1
      2,5   3,4   4,3   5,2
        3,5   4,4   5,3
```

**Remarques :**
- Le centre du plateau est la tuile "3,3" (q=3, r=3)
- Les coordonnées vont de 0 à 6 (pour un rayon 3, car il y a 2*rayon+1 tuiles par axe)
- Ce schéma correspond à l'encodage utilisé dans le code (`encodeHexCoord(q, r, radius)`) où chaque coordonnée est décalée de +rayon pour éviter les indices négatifs.

---

**Bug corrigé :**
- ✅ **Localisation précise** : Utilise `findTileAtPosition` pour localiser le vaisseau sur le plateau
- ✅ **Recherche par voisinage** : BFS sur les GridCoordinate garantit de rester dans le plateau
- ✅ **Distance hexagonale** : Le range correspond au nombre réel de tuiles hexagonales
- ✅ **Pas de génération aléatoire** : Seules les tuiles existantes du TileMap sont sélectionnées
- ✅ **Gestion d'erreur robuste** : Retourne null en cas de problème (pas de position hors plateau)
