# language: fr
Fonctionnalité: Support Multi-Bot
  En tant que système de simulation
  Je veux gérer plusieurs bots simultanément sur la même matrice de tuiles
  Afin de permettre une compétition pour les ressources et des comparaisons de performances

  Contexte:
    Étant donné que le système supporte le mode multi-bot

  Scénario: Création de deux bots avec trackers séparés
    Étant donné que l'application démarre en mode multi-bot
    Quand useMultiSimulatedTracker est appelé avec botActors = [bot-0, bot-1]
    Alors chaque bot a son propre actor FSM indépendant
    Et chaque bot a ses propres timers de simulation
    Et les logs sont préfixés par le botId correspondant
    Et les deux bots évoluent en parallèle

  Scénario: Sélection de la vue d'affichage
    Étant donné que deux bots sont actifs (bot-0 et bot-1)
    Et que useBotSelectionStore.selectedView = "both"
    Quand l'utilisateur clique sur le bouton "Bot-0"
    Alors selectedView devient "bot-0"
    Et seuls les composants du bot-0 sont affichés
    Quand l'utilisateur clique sur "Both"
    Alors selectedView devient "both"
    Et les composants des deux bots sont affichés côte à côte

  Scénario: Génération de tuiles de départ multiples
    Étant donné que botCount = 2
    Et que la matrice contient 100 tuiles
    Quand placeStartingTiles est appelé
    Alors 2 tuiles aléatoires sont sélectionnées
    Et ces tuiles sont converties en type = "depart"
    Et chaque tuile de départ a resources = {food: 200, debris: 200, special: 0, total: 400}
    Et chaque tuile de départ est marquée hasResources = true
    Et leur couleur devient "#4CAF50" (vert)

  Scénario: Assignation des tuiles de départ aux bots
    Étant donné que placeStartingTiles a créé 2 tuiles de départ
    Et que activeBotIds = ["bot-0", "bot-1"]
    Quand assignStartingTilesToBots est appelé
    Alors startingTiles[0] est assignée à "bot-0"
    Et startingTiles[0].assignedToBot = "bot-0"
    Et startingTiles[1] est assignée à "bot-1"
    Et startingTiles[1].assignedToBot = "bot-1"
    Et chaque bot initialise sa basePosition à partir de sa tuile assignée

  Scénario: Initialisation complète de deux bots avec bases séparées
    Étant donné que le système a assigné les tuiles de départ
    Et que bot-0 a sa base à la position de startingTiles[0]
    Et que bot-1 a sa base à la position de startingTiles[1]
    Quand les FSM des deux bots s'initialisent
    Alors bot-0.context.vehicle.basePosition = startingTiles[0].position
    Et bot-1.context.vehicle.basePosition = startingTiles[1].position
    Et chaque bot explore et collecte indépendamment depuis sa propre base

  Scénario: Collection compétitive - Premier arrivé premier servi
    Étant donné que la tuile "5,5" contient {food: 300, debris: 400, total: 700}
    Et que bot-0 cible "5,5" pour collection
    Et que bot-1 cible également "5,5" pour collection
    Quand bot-0 atteint "5,5" en premier
    Et bot-0 collecte les ressources
    Alors tile["5,5"].resources.total devient 0
    Et tile["5,5"].collected = true
    Et tile["5,5"].collectedBy = "bot-0"
    Quand bot-1 atteint "5,5"
    Alors bot-1 détecte que la tuile est déjà collectée
    Et le guard hasCollectibleTiles ignore cette tuile pour bot-1

  Scénario: Affichage dual des composants UI
    Étant donné que selectedView = "both"
    Et que bot-0 et bot-1 sont actifs
    Quand ShipStatus est affiché
    Alors il affiche une grille à 2 colonnes
    Et colonne 1 affiche SingleBotStatus pour bot-0 (couleur verte)
    Et colonne 2 affiche SingleBotStatus pour bot-1 (couleur bleue)
    Quand DroneStatsDisplay est affiché
    Alors il affiche SingleDroneStats pour bot-0 et bot-1
    Quand CollectedTilesList est affiché
    Alors il filtre tiles.filter(t => t.collectedBy === "bot-0") pour bot-0
    Et tiles.filter(t => t.collectedBy === "bot-1") pour bot-1

  Scénario: FSMVisualization avec sélecteur de bot
    Étant donné que FSMVisualization est affiché
    Alors BotSelector est visible dans l'en-tête
    Et BotSelector affiche 3 boutons: "Bot-0", "Bot-1", "Both"
    Quand selectedView = "bot-0"
    Alors seul l'état FSM de bot-0 est affiché
    Quand selectedView = "both"
    Alors les états FSM des deux bots sont affichés en colonnes séparées

  Scénario: Logs multi-bot avec préfixe botId
    Étant donné que useMultiSimulatedTracker gère bot-0 et bot-1
    Quand bot-0 lance une exploration
    Alors les logs contiennent "[bot-0] Drone deploying to 3,4"
    Quand bot-1 collecte une tuile
    Alors les logs contiennent "[bot-1] Ship collecting at 2,3"
    Et les logs permettent de distinguer les actions de chaque bot

  Scénario: Isolation des contextes FSM
    Étant donné que bot-0 a fuel = 50 et damage = 20
    Et que bot-1 a fuel = 80 et damage = 10
    Quand bot-0 collecte une tuile et perd du fuel
    Alors bot-0.context.vehicle.fuel diminue
    Et bot-1.context.vehicle.fuel reste inchangé
    Quand bot-1 subit des dégâts
    Alors bot-1.context.vehicle.damage augmente
    Et bot-0.context.vehicle.damage reste inchangé

  Plan du Scénario: Modes d'affichage disponibles
    Étant donné que selectedView = <mode>
    Quand les composants UI s'affichent
    Alors le nombre de vues affichées = <vueCount>
    Et les bots visibles = <visibleBots>

    Exemples:
      | mode   | vueCount | visibleBots |
      | bot-0  | 1        | [bot-0]     |
      | bot-1  | 1        | [bot-1]     |
      | both   | 2        | [bot-0, bot-1] |

  Scénario: Statistiques agrégées et individuelles
    Étant donné que bot-0 a exploré 30 tuiles
    Et que bot-1 a exploré 25 tuiles
    Et que bot-0 a collecté 1500 ressources
    Et que bot-1 a collecté 1800 ressources
    Quand ScoreDisplay affiche les scores
    Alors il affiche les statistiques de chaque bot séparément
    Et permet de comparer les performances des deux bots

  Scénario: Tuiles de départ ne peuvent pas être collectées par l'autre bot
    Étant donné que startingTiles[0] est assignée à bot-0
    Et que startingTiles[0].type = "depart"
    Et que bot-1 explore la zone
    Quand bot-1 évalue hasCollectibleTiles
    Alors startingTiles[0] est EXCLUE (type = "depart")
    Et bot-1 ne peut pas collecter la base de bot-0

  Scénario: Restart et réinitialisation multi-bot
    Étant donné que bot-0 et bot-1 ont exploré et collecté pendant 5 minutes
    Quand l'utilisateur clique sur "Restart"
    Alors les deux acteurs FSM sont recréés
    Et de nouvelles tuiles de départ aléatoires sont générées
    Et les contextes des deux bots sont réinitialisés
    Et la simulation redémarre avec deux bots frais
