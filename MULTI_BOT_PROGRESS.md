# Multi-Bot Implementation Progress

## Objectif
Afficher 2 bots simultanés sur la même matrice de tuiles en compétition pour les ressources.

## Configuration
- Mode par défaut: `'both'` (2 bots affichés simultanément)
- Modes alternatifs: `'bot-0'` ou `'bot-1'` (affichage individuel)
- Un seul tracker gérant les deux bots
- Chaque bot a sa propre base de départ fixe

---

## 🎉 IMPLÉMENTATION TERMINÉE !

### ✅ Step 1: Créer useBotSelectionStore
- [x] Store Zustand avec `selectedView: 'bot-0' | 'bot-1' | 'both'`
- [x] Action `setSelectedView`

### ✅ Step 2: Créer useMultiSimulatedTracker
- [x] Hook acceptant `BotActor[]` (botId + actor)
- [x] Timers séparés par botId
- [x] Logs préfixés par botId

### ✅ Step 3: Mettre à jour App.tsx
- [x] Créer deux acteurs (bot-0 et bot-1)
- [x] Passer `botActors` au multi-tracker

### ✅ Step 4: Créer BotSelector component
- [x] 3 boutons (Bot-0 vert, Bot-1 bleu, Both violet)
- [x] Connecté au store

### ✅ Step 5: Adapter ShipStatus dual-view
- [x] SingleBotStatus interne
- [x] Grid 2 colonnes en mode "both"

### ✅ Step 6: Adapter DroneStatsDisplay dual-view
- [x] SingleDroneStats interne
- [x] Mode compact pour "both"

### ✅ Step 7: Adapter CollectedTilesList dual-view
- [x] SingleBotCollected interne
- [x] Filtrage par `tile.collectedBy === botId`

### ✅ Step 8: Adapter FSMVisualization dual-view
- [x] BotSelector ajouté dans l'en-tête
- [x] Affichage conditionnel des états

### ✅ Step 9: Vérifier autres composants
- [x] ScoreDisplay adapté avec SingleBotScore
- [x] ExplorationIndicator utilise useTileStore global (OK)

---

## Composants Multi-Bot
| Composant | Description | Vue duale |
|-----------|-------------|-----------|
| TileMatrix | Grille hexagonale | S0, S1, D0E, D1E |
| ShipStatus | Fuel/Damage/Resources | 2 colonnes |
| DroneStatsDisplay | Deploy/Destroy stats | 2 colonnes compact |
| CollectedTilesList | Tuiles collectées | Filtrage par bot |
| FSMVisualization | États FSM | Sélecteur + dual |
| ScoreDisplay | Score overlay | 2 colonnes |
| ExplorationIndicator | Stats exploration | Global (pas par bot) |

---

## Notes
- TileMatrix déjà adapté pour multi-bots ✅
- Les tuiles sont partagées (compétition active)
