# 🎯 Guide des Logs d'Équité - Vérification des Règles

## 📋 Résumé

Les logs de validation d'équité sont **maintenant affichés en détail** lors de l'initialisation du jeu. Chaque règle est vérifiée avec des données chiffrées.

## 🔍 Où Voir les Logs

### Via la Console du Navigateur
1. Ouvrir le jeu: `npm run dev`
2. Ouvrir **DevTools** (F12 ou Cmd+Option+I)
3. Aller à l'onglet **Console**
4. Chercher les blocs avec bordures `━━━` qui affichent les métriques

### Via le Log Server
```bash
npm run dev:all
# ou démarrer séparément:
npm run log:server  # Terminal 1
npm run dev         # Terminal 2
```
Les logs s'affichent en temps réel dans le terminal du serveur.

---

## 📊 Structure des Logs de Validation

### 1️⃣ Initialisation Générale
```
🎲 [App] Map seed generated: 1704707123456
🎲 [App] Tiles generated: {tilesCount: 37, ...}
🎯 [App] Starting fairness-aware tile assignment...
```

### 2️⃣ Bloc Principal: Placement avec Validation

```
╔════════════════════════════════════════════════════════════════╗
║            STARTING FAIRNESS-AWARE MAP GENERATION              ║
║  Seed: 1704707123456 | Max Attempts: 10 | Bot Count: 2        ║
╚════════════════════════════════════════════════════════════════╝

[Fairness] Attempt 1/10: Testing seed=1704707123456, spawns=[1,3, 6,0]
```

### 3️⃣ Détails de Chaque Tentative

#### 📏 SPAWN DISTANCE
```
📏 SPAWN DISTANCE
  • Metric: 6.0 tiles                    ← Distance minimale entre spawns
  • Threshold: ≥ 4.5 tiles               ← Seuil requis (radius × 1.5)
  • Result: ✅ PASS
  • Details: Spawn distance 6.0 >= 4.5 threshold
```
**Acceptable si:** Distance ≥ 4.5 tuiles (radius 3 × 1.5)

#### 💰 RESOURCE BALANCE
```
💰 RESOURCE BALANCE (Radius 1)
  • Metric: 15.3% difference             ← Différence de ressources
  • Threshold: ≤ 30%                     ← Limite acceptable
  • Result: ✅ PASS
  • Details: Resources: 1200 vs 1040 (15.3% diff)
```
**Acceptable si:** Différence ≤ 30%

#### ⛽ FUEL STATION ACCESS
```
⛽ FUEL STATION ACCESS
  • Metric: 1 tiles difference           ← Différence d'accès
  • Threshold: ≤ 1 tiles                 ← Limite acceptable
  • Result: ✅ PASS
  • Details: fuel distances: 3 vs 4 (diff: 1)
```
**Acceptable si:** Différence ≤ 1 tuile

#### 🔧 REPAIR STATION ACCESS
```
🔧 REPAIR STATION ACCESS
  • Metric: 0 tiles difference
  • Threshold: ≤ 1 tiles
  • Result: ✅ PASS
  • Details: repair distances: 2 vs 2 (diff: 0)
```
**Acceptable si:** Différence ≤ 1 tuile

#### 🌍 TERRAIN FAIRNESS
```
🌍 TERRAIN FAIRNESS (Radius 2, Walkable %)
  • Metric: 8.5% difference              ← Différence en % walkable
  • Threshold: ≤ 15%                     ← Limite acceptable
  • Result: ✅ PASS
  • Details: Walkable %: 85.5 vs 77.0 (diff: 8.5%)
```
**Acceptable si:** Différence ≤ 15%

### 4️⃣ Résultat Final de Validation

```
✅ SUCCESS: Map validated after 1 attempt(s)!
Seed: 1704707123456
Spawns: [1,3, 6,0]
Metrics Summary:
  • Spawn Distance: 6.0 tiles
  • Resource Difference: 15.3%
  • Fuel Access Difference: 1 tiles
  • Repair Access Difference: 0 tiles
  • Terrain Difference: 8.5%
```

Ou si besoin de régénérer:
```
⚠️ MAX ATTEMPTS REACHED
Best result found with 1 issue(s)
Using seed: 1704707123455
Spawns: [2,2, 5,1]
Issues: Resource imbalance: 32.1% > 30%
```

### 5️⃣ Orchestration Détaillée des Tuiles

```
╔════════════════════════════════════════════════════════════════╗
║         TILE GENERATION ORCHESTRATION - DETAILED LOG            ║
╚════════════════════════════════════════════════════════════════╝
Initial Conditions:
  • Seed: 1704707123456
  • Grid Radius: 3
  • Active Bots: [bot-0, bot-1]
  • Total Tiles Before: 37

SPAWN PLACEMENT RESULTS:
  ✅ Spawns Placed: [1,3, 6,0]
  📊 Fairness Status: ✅ ALL RULES PASSED
  
KEY METRICS:
  • Spawn Min Distance: 6.0 tiles
  • Resource Balance: 15.3% difference
  • Fuel Access Diff: 1 tiles
  • Repair Access Diff: 0 tiles
  • Terrain Fairness: 8.5% difference

SPECIAL TILES PLACEMENT:
  1️⃣ Placing empty tiles (avoiding spawn radius 1)...
     ✓ Empty tiles placed: 8
  2️⃣ Placing obstacle tiles (avoiding spawn radius 1)...
     ✓ Obstacle tiles placed: 5
  3️⃣ Placing danger tiles (avoiding spawn radius 1)...
     ✓ Danger tiles placed: 2
  4️⃣ Placing stations (equidistant from spawns, avoiding spawn radius 2)...
     ✓ Fuel stations placed: 1
     ✓ Repair stations placed: 1

BOT ASSIGNMENT:
  Assigning spawn tiles to active bots:
    ✓ bot-0 → Coord: 1,3 | Pos: (0.80, 2.40) | Resources: 250 (F:100, D:100, S:50)
    ✓ bot-1 → Coord: 6,0 | Pos: (-0.60, -1.20) | Resources: 250 (F:100, D:100, S:50)

FINAL TILE COMPOSITION:
  • Total Tiles: 37
  • Depart (Spawn): 2
  • Resource: 17
  • Empty: 8
  • Obstacle: 5
  • Danger: 2
  • Fuel Station: 1
  • Repair Station: 1
  
✅ TILE GENERATION COMPLETE
```

### 6️⃣ Synthèse Finale d'Initialisation

```
╔════════════════════════════════════════════════════════════════╗
║           GAME INITIALIZATION COMPLETE - FAIRNESS SUMMARY       ║
╚════════════════════════════════════════════════════════════════╝

🎲 SEED & GENERATION
  • Map Seed: 1704707123456
  • Grid Radius: 3 tiles
  • Total Tiles Generated: 37
  • Total Tiles After Assignment: 37

🚀 SPAWN POSITIONS
  • Spawn Count: 2 (bot-0, bot-1)
  • Spawn Coordinates: [1,3, 6,0]
  • Starting Resources per Bot: Food=100, Debris=100, Special=50 (Total=250)

🎯 FAIRNESS VALIDATION
  ✅ All fairness rules have been validated during placement
  📊 See detailed validation logs above for full metrics
  
🗺️ MAP COMPOSITION
  • Total Tiles: 37
  • Starting Tiles (Depart): 2
  • Resource Tiles: 17
  • Obstacle Tiles: 5
  • Danger Tiles: 2
  • Station Tiles: 2

⚙️ GAME STATE
  • Bots Initialized: 2
  • Starting FSM State: Initialized
  • Ready for Gameplay: ✅ YES

╔════════════════════════════════════════════════════════════════╗
║                  GAME START - LET'S PLAY! 🎮                   ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 📈 Interprétation des Métriques

### Règles d'Équité et Seuils

| Métrique | Seuil | Signification |
|----------|-------|---------------|
| **Spawn Distance** | ≥ 4.5 tiles | Distance minimale entre spawns pour éviter les chevauchements |
| **Resource Balance** | ≤ 30% | Différence de ressources autour des spawns (rayon 1) |
| **Fuel Access** | ≤ 1 tile | Différence en distance vers la station fuel la plus proche |
| **Repair Access** | ≤ 1 tile | Différence en distance vers la station repair la plus proche |
| **Terrain Fairness** | ≤ 15% | Différence en % de tuiles walkables autour des spawns (rayon 2) |

### Codes de Couleur/Symboles

| Symbole | Signification |
|---------|---------------|
| ✅ PASS | Règle satisfaite |
| ❌ FAIL | Règle non satisfaite (sera régénérée) |
| ✨ | Toutes les règles sont satisfaites |
| ⚠️ | Attention (meilleure tentative si max atteint) |

---

## 🔄 Processus de Validation

```
Génération initiale (seed)
         ↓
Placement aléatoire des spawns
         ↓
Validation 5 règles
         ↓
    ✅ TOUTES OK?     ⚠️ RÈGLES ÉCHOUÉES?
         |                      |
         ✓                      ✓
    Utiliser cette              Seed +1, réessayer
    carte (Attempt=1)           (Attempt=2, 3, ... 10)
                                      |
                                  Max 10?
                                 /        \
                              NON        OUI
                               |          |
                            Réessai   Utiliser meilleure
                                      tentative trouvée
```

---

## 🧪 Test Pratique

1. **Lancer le jeu**
   ```bash
   npm run dev
   ```

2. **Ouvrir DevTools Console** (F12)

3. **Chercher ces éléments:**
   - `✅ SUCCESS:` → Validation réussie au premier coup
   - `FAIRNESS VALIDATION` → Bloc détaillé avec toutes les métriques
   - Chaque métrique affichera:
     - `Metric:` la valeur calculée
     - `Threshold:` le seuil acceptable
     - `Result:` ✅ PASS ou ❌ FAIL
     - `Details:` explication avec nombres

4. **Regarder la synthèse finale** pour voir le résumé complet

---

## 📝 Exemples de Logs Complets

### Cas 1: Validation Réussie au Premier Coup (Idéal)
```
[Fairness] Attempt 1/10: Testing seed=1704707123456, spawns=[1,3, 6,0]

━━━ FAIRNESS VALIDATION - Attempt 1 (Seed: 1704707123456) ━━━
Status: ✅ VALID

📏 SPAWN DISTANCE
  • Metric: 6.0 tiles
  • Threshold: ≥ 4.5 tiles
  • Result: ✅ PASS

💰 RESOURCE BALANCE (Radius 1)
  • Metric: 15.3% difference
  • Threshold: ≤ 30%
  • Result: ✅ PASS

⛽ FUEL STATION ACCESS
  • Metric: 1 tiles difference
  • Threshold: ≤ 1 tiles
  • Result: ✅ PASS

🔧 REPAIR STATION ACCESS
  • Metric: 0 tiles difference
  • Threshold: ≤ 1 tiles
  • Result: ✅ PASS

🌍 TERRAIN FAIRNESS (Radius 2, Walkable %)
  • Metric: 8.5% difference
  • Threshold: ≤ 15%
  • Result: ✅ PASS

✨ All fairness rules satisfied!

✅ SUCCESS: Map validated after 1 attempt(s)!
Seed: 1704707123456
Spawns: [1,3, 6,0]
Metrics Summary:
  • Spawn Distance: 6.0 tiles
  • Resource Difference: 15.3%
  • Fuel Access Difference: 1 tiles
  • Repair Access Difference: 0 tiles
  • Terrain Difference: 8.5%
```

### Cas 2: Plusieurs Tentatives Avant Succès
```
[Fairness] Attempt 1/10: Testing seed=1704707123456, spawns=[2,2, 5,1]
[Fairness] Attempt 2/10: Testing seed=1704707123457, spawns=[1,3, 6,0]

✅ SUCCESS: Map validated after 2 attempt(s)!
```

### Cas 3: Max Attempts Atteint (Utilisation de la Meilleure Tentative)
```
[Fairness] Attempt 10/10: Testing seed=1704707123465, spawns=[3,1, 4,2]

⚠️ MAX ATTEMPTS REACHED
Best result found with 1 issue(s)
Using seed: 1704707123463
Spawns: [2,2, 5,1]
Issues: Resource imbalance: 31.5% > 30%
```

---

## 🎮 Vérification du Jeu

Après avoir vu les logs, vérifiez dans le jeu:

1. **Positions des spawns** correspondent aux coordonnées loggées
2. **Distances visuelles** correspondent aux métriques
3. **Ressources** sont bien assignées (250 par bot)
4. **Stations** sont accessibles et visibles

---

## ✅ Checklist de Validation

Avant de confirmer l'implémentation:

- [ ] Les logs affichent `✅ SUCCESS` ou `⚠️ BEST EFFORT`
- [ ] Les 5 métriques sont affichées avec des nombres concrets
- [ ] Tous les seuils sont respectés (ou expliqués si non respectés)
- [ ] Les spawns sont à une bonne distance l'un de l'autre
- [ ] Les ressources sont équilibrées
- [ ] Le terrain est équitable
- [ ] Les stations sont accessibles

---

## 🐛 Dépannage

### Je n'ais pas vu les logs d'équité
- Vérifier que DevTools Console est ouverte
- Vérifier que le jeu a bien reloadé après la dernière build
- Regarder dans le terminal du log server si `npm run log:server` est actif

### Les métriques ne sont pas bonnes
- Vérifier que le seed est bien loggé (nombre à 10+ chiffres)
- Vérifier que les tentatives augmentent jusqu'à 10 max
- Regarder les "Issues" pour identifier le problème exact

### Je veux rejouer la même carte
- Copier le `Seed:` depuis les logs
- Modifier `App.tsx` pour utiliser ce seed au lieu de générer un nouveau
- Relancer le jeu

