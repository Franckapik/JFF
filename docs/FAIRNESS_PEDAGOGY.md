# 📚 Pédagogie : Équité des Stations (Fuel Access & Repair Access)

## 🎯 Le Scenario Voulu

L'objectif est de placer les **stations de carburant (fuel)** et **stations de réparation (repair)** de manière **équitable** pour les deux bots.

**Équitable signifie :** Les deux bots doivent avoir à peu près la même distance jusqu'à leur station la plus proche respective.

---

## 📊 Exemple Concret sur la Grille Hexagonale

### Configuration Initiale
```
           ╔════════════════════════════════════╗
           ║        Grille Hexagonale (R=3)     ║
           ╚════════════════════════════════════╝

                    F U E L   S T A T I O N   ? 
                           ▲
                           │
                          [3]
                           │
     ┌─────────────┬────────○────────┬─────────────┐
     │             │      SPAWN-BOT-0 │             │
    [2]           [2]     @ (0,3)    [2]           [2]
     │             │                  │             │
     └────────[1]──┴──────[1]─────────┴──[1]────────┘
                    │                 │
                   [1]               [1]
                    │                 │
     ┌────────[2]───┼─────────────────┼───[2]──────┐
     │              │                 │             │
    [3]            [3]            @ (6,0)         [3]
     │              │            SPAWN-BOT-1       │
     └──────────────┴─────────────────┴─────────────┘
                                │
                               [3]
                                │
                        F U E L   S T A T I O N   ?
```

### Les Mesures

**Pour FUEL STATION (carburant):**

| Bot | Distance jusqu'à FUEL | Distance jusqu'à REPAIR |
|-----|----------------------|------------------------|
| Bot-0 @ (0,3) | 3 tuiles | 4 tuiles |
| Bot-1 @ (6,0) | 5 tuiles | 3 tuiles |
| **Différence** | **\|5 - 3\| = 2 tuiles** | **\|4 - 3\| = 1 tuile** |
| **Seuil** | **≤ 2 tuiles** | **≤ 2 tuiles** |
| **Résultat** | ✅ **PASS** | ✅ **PASS** |

---

## 🔍 Décryptage du Affichage

Quand vous voyez dans l'interface :

```
⛽ Fuel Access:
   Difference: 2 tiles
   Threshold:  ≤ 2 tiles
   Details:    Fuel access diff = 2 tuiles entre les deux spawns
   Status: ✅ PASS
```

### Cela signifie:
1. **"Difference: 2 tiles"** ← C'est la DIFFÉRENCE entre les distances des deux bots
   - Bot-0 peut atteindre carburant en 3 tuiles
   - Bot-1 peut atteindre carburant en 5 tuiles
   - Différence = |5 - 3| = **2 tuiles**

2. **"Threshold: ≤ 2 tiles"** ← La différence DOIT ÊTRE égale ou inférieure à 2
   - Notre différence = 2 tuiles
   - Seuil accepté = ≤ 2 tuiles
   - 2 ≤ 2 ? **OUI!** ✅

3. **"Status: PASS"** ← L'équité est respectée!

---

## ❌ Cas d'Équité Brisée

### Exemple: Stations mal placées

```
     SPAWN-BOT-0                SPAWN-BOT-1
            @ (0,3)                 @ (6,0)
            │                            │
            │                            │
        [1] │ FUEL STATION               │ [10]
            ├─────────────────────────────┤
            
Distance Bot-0 → FUEL = 1 tuile
Distance Bot-1 → FUEL = 10 tuiles
Différence = |10 - 1| = 9 tuiles

Seuil = ≤ 2 tuiles
9 ≤ 2 ? NON! ❌ FAIL
```

Affichage:
```
⛽ Fuel Access:
   Difference: 9 tiles
   Threshold:  ≤ 2 tiles
   Details:    Fuel access diff = 9 tuiles entre les deux spawns
   Status: ❌ FAIL → "Les stations ne sont pas équidistantes"
```

---

## 🔧 Cas Particulier : Stations Manquantes (999)

Si une station n'a **pas pu être placée** sur la grille:

```
⛽ Fuel Access:
   Difference: N/A
   Threshold:  ≤ 2 tiles
   Details:    Aucune station de carburant trouvée (zone encombrée?)
   Status: ❌ FAIL → "Station non placée ou inaccessible"
```

Le **999** signifie: **"Impossible à atteindre / n'existe pas"**

---

## 📐 Les 5 Règles d'Équité Expliquées

### 1️⃣ Spawn Distance (Distance de départ)
**Règle:** Les deux spawns doivent être suffisamment éloignés l'un de l'autre
- **Valeur:** Distance directe entre les deux spawns
- **Seuil:** ≥ 3.0 tuiles (par défaut)
- **Logique:** Sinon les bots explorent les mêmes zones

### 2️⃣ Resource Balance (Équilibre des ressources)
**Règle:** Chaque spawn doit avoir accès à à peu près le même total de ressources alentour
- **Valeur:** Différence de % entre les deux zones
- **Seuil:** ≤ 35% (par défaut)
- **Logique:** Un bot ne doit pas être "en richesse" par rapport à l'autre

### 3️⃣ Fuel Access (Accès carburant) ⛽
**Règle:** Les deux spawns doivent avoir à peu près la même distance jusqu'au carburant
- **Valeur:** **DIFFÉRENCE** de distance entre les deux chemins vers la station
- **Seuil:** ≤ 2 tuiles
- **Logique:** Personne ne doit être "trop loin" du carburant

### 4️⃣ Repair Access (Accès réparation) 🔧
**Règle:** Les deux spawns doivent avoir à peu près la même distance jusqu'à la réparation
- **Valeur:** **DIFFÉRENCE** de distance entre les deux chemins vers la station
- **Seuil:** ≤ 2 tuiles
- **Logique:** Personne ne doit être "trop loin" de la réparation

### 5️⃣ Terrain Fairness (Équité du terrain)
**Règle:** Les deux zones doivent avoir à peu près le même % de terrain walkable
- **Valeur:** Différence de % walkable entre les deux zones
- **Seuil:** ≤ 20% (par défaut)
- **Logique:** Un terrain ne doit pas être plus "accessible" que l'autre

---

## 🚀 Flux d'Initialisation (Ordre des Opérations)

```
1. Générer grille de base
   ↓
2. Placer SPAWNS (avec validation fairness)
   - Règle 1: spawnDistance ≥ 3.0 tiles
   ↓
3. Placer STATIONS (fuel + repair) ← AVANT validation finale
   ↓
4. Valider TOUTES les règles incluant les stations
   - Règle 2: resourceBalance ≤ 35%
   - Règle 3: fuelAccess ≤ 2 tiles (DIFFÉRENCE)
   - Règle 4: repairAccess ≤ 2 tiles (DIFFÉRENCE)
   - Règle 5: terrainFairness ≤ 20%
   ↓
5. Boucle: Si validation échoue, régénérer avec un seed différent
   (Jusqu'à 10 tentatives maximum)
   ↓
6. Placer empty/obstacle/danger tiles
   ↓
7. Assigner spawns aux bots
   ↓
8. ✅ JEU PRÊT!
```

---

## 💡 Conseils de Lecture de l'Interface

Quand vous voyez une carte avec des stations:

### ✅ Carte ÉQUITABLE:
```
SPAWN-0 -----[3]------ FUEL/REPAIR
         \            /
          \          /
           \        /
            \      /
             \    /
              \  /
              [5]
              /  \
             /    \
    SPAWN-1 ------[3]----- FUEL/REPAIR

✅ Distance Bot-0 → Fuel = 3 tuiles
✅ Distance Bot-1 → Fuel = 5 tuiles
✅ Différence = 2 tuiles (< 2 = OK, ou = 2 = OK border)
```

### ❌ Carte INÉQUITABLE:
```
SPAWN-0 -----[1]------ FUEL/REPAIR
  |
  |
  [20+]
  |
  |
SPAWN-1 ----[20+]---- FUEL/REPAIR (très loin!)

❌ Différence = 19+ tuiles (> 2 = FAIL)
```

---

## 🎓 Résumé: Ce que vous voyez affichée

| Métrique | Affichage | Signification |
|----------|-----------|---------------|
| **Spawn Distance** | Value: 4.5 tiles | Distance directe entre les 2 spawns |
| **Resource Balance** | Value: 12.5% | % de différence en ressources |
| **Fuel Access** | **Difference: 2 tiles** | **ÉCART entre les 2 distances au fuel** |
| **Repair Access** | **Difference: 1 tile** | **ÉCART entre les 2 distances à la réparation** |
| **Terrain Fairness** | Value: 15.0% | % de différence en terrain walkable |

---

C'est maintenant beaucoup plus clair! Les stations doivent être à peu près **équidistantes** des deux spawns. C'est pourquoi on affiche la **DIFFÉRENCE**, pas les distances individuelles.
