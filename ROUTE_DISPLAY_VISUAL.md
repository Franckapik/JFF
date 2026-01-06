# 🎨 Visualisation des changements UI

## Avant → Après

### Structure de la colonne droite

#### AVANT
```
┌─────────────────────────┐
│ CollectedTilesList      │
│                         │
│ • Tuile 1               │
│ • Tuile 2               │
│ • Tuile 3               │
│ ...                     │
└─────────────────────────┘
```

#### APRÈS
```
┌─────────────────────────┐
│ CollectedTilesList      │
│                         │
│ • Tuile 1               │
│ • Tuile 2               │
│ • Tuile 3               │
│ ...                     │
├─────────────────────────┤
│ RouteDisplay ⭐ NOUVEAU  │
│                         │
│ 🛣️ Itinéraire Bot-0     │
│ ████████░░░░ 75% complé│
│ 📍 Position: 0,0        │
│                         │
│ ✓ Tuiles visitées (3)   │
│ [0,0] [0,1] [1,1]       │
│                         │
│ → Tuiles à venir (1)    │
│ [1,2]                   │
│                         │
│ 0,0 → 0,1 → 1,1 → 1,2   │
└─────────────────────────┘
```

---

## Améliorations de la matrice hexagonale

### Chemins SVG

#### Style des lignes
```
Visitées : ──────────  (trait continu, opacité 0.4)
          Couleur du bot

En cours : ═════════  (trait épais, opacité 1.0)
          Couleur du bot, flèche solide →

Futures  : - - - - -  (pointillé, opacité 1.0)
          Couleur du bot, flèche semi-transparente →
```

#### Exemple avec deux bots
```
Bot-0 (vert)           Bot-1 (bleu)
──────────────────────────────────

       ⭕ S0                ⭕ S1
       │  \                /  │
       ├──→ ⬟ ← ─ ─ ─ ← ⬟ ←─┤
       │      \  /          │
       ├──→ ⬟  ⬟  ⬟ ─────→ ⬟
       │                     │
       ⭕ Base             ⭕ Base

Legend:
─────  = Chemin Bot-0 visitée
━━━━  = Chemin Bot-0 en cours (épais)
─ ─ ─  = Chemin Bot-0 futur
━━━━━  = Chemin Bot-1 visitée
┏━━━┓  = Chemin Bot-1 en cours
╌ ╌ ╌  = Chemin Bot-1 futur
⭕    = Ship
⬟    = Tuile
```

### Indicateurs sur les tuiles

#### Tuile sur le chemin
```
┌─────────┐
│    ✓    │  Visitée (checkmark)
│ Glow    │  Aura colorée
└─────────┘
Bordure solide 3px

Futur:
┌─────────┐
│    →    │  À venir (arrow)
│ Glow    │  Aura colorée
└─────────┘
Bordure pointillée 3px
```

---

## Légende améliorée (TileMatrix)

### Organisation

```
┌─ ENTITÉS ─────────────────────┐
│ ⬜ Base/Départ                 │
│ 🟢 🚢 Ship Bot-0 (S0)          │
│ 🔵 🚢 Ship Bot-1 (S1)          │
│ 🟠 🛰️ Drones (D)               │
├─ CHEMINS ────────────────────┤
│ ⬜ 🛤️ Chemin actif             │
│ ⬜ → Chemin futur              │
│ ✓ = Tuile visitée | → = À venir│
├─ TUILES ─────────────────────┤
│ 🟣 ✨ Collectée                │
│ 🔵 🔍 Explorée                 │
│ ⬜ ⬜ Vide                      │
│ 💗 ⛽ Carburant                 │
│ 💜 🔧 Réparation                │
│ 🔴 ⚠️ Danger                    │
│ ⬛ 🚫 Obstacle                  │
└──────────────────────────────┘
```

---

## Composant RouteDisplay en détail

### Structure interne

```
┌─────────────────────────────────────┐
│ 🗺️ Détail des Itinéraires           │
├─────────────────────────────────────┤
│                                     │
│ 🛣️ Itinéraire Bot-0         2 / 5   │
│ ████████░░░░░░░░░ 40% complé       │
│                                     │
│ 📍 Position: [0,0]                  │
│                                     │
│ ✓ Tuiles visitées (2)               │
│ ┌────────┬────────┐                │
│ │ [0,0]  │ [1,0]  │                │
│ └────────┴────────┘                │
│                                     │
│ → Tuiles à venir (3)                │
│ ┌────────┬────────┬────────┐       │
│ │ [1,1]  │ [2,1]  │ [2,0]  │       │
│ └────────┴────────┴────────┘       │
│                                     │
│ Chemin complet:                     │
│ [0,0] → [1,0] → [1,1] → [2,1] → ..│
│                                     │
└─────────────────────────────────────┘
```

### États affichés

#### Avec chemin
- Affiche le nom du bot
- Barre de progression colorée
- Position courante
- Sections visitées/futures
- Chemin linéaire avec flèches

#### Sans chemin
```
🛣️ Itinéraire Bot-0

Aucun itinéraire actuellement
```

#### Filtrage par selectedView
- `bot-0` : affiche uniquement Bot-0
- `bot-1` : affiche uniquement Bot-1
- `both` : affiche les deux bots
- Réactif aux changements de filtre

---

## Palettes de couleurs

### Bot-0 (Vert)
- Principal: `#22c55e`
- Arrière-plan: `rgba(34, 197, 94, 0.08)`
- Texte: blanc sur fond vert, vert sur fond transparent

### Bot-1 (Bleu)
- Principal: `#3b82f6`
- Arrière-plan: `rgba(59, 130, 246, 0.08)`
- Texte: blanc sur fond bleu, bleu sur fond transparent

### Tuiles
- Collectée: `#8b5cf6` (violet)
- Explorée: `#3b82f6` (bleu)
- Vide: `#9ca3af` (gris)
- Carburant: `#f32ad1` (rose)
- Réparation: `#bd259c` (violet foncé)
- Danger: `#ef4444` (rouge)
- Obstacle: `#000000` (noir)

---

## Interactions utilisateur

### MouseOver sur tuile
```
Affiche dans le titre (title attribute):
"A1 (0,0) [ON PATH]"
```

### Sélection du bot
- Change le filtre `selectedView`
- RouteDisplay se met à jour automatiquement
- TileMatrix met en évidence le chemin du bot sélectionné

### Scroll dans RouteDisplay
- MaxHeight sur le chemin linéaire (100px)
- Scrollable si chemin très long
- Lisibilité maintenue

---

## Performance

### Optimisations
- Memoization des calculs de chemin
- Subscription au FSM au lieu de polling
- Render conditionnel basé sur selectedView
- Pas de re-render inutile

### Ressources utilisées
- TileMatrix: lignes SVG pour chemins
- RouteDisplay: HTML/CSS uniquement, pas de canvas
- État minimaliste (currentPath, pathIndex, shipCoord)

