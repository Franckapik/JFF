# language: fr
Fonctionnalité: Initialisation du Bot
  En tant que système FSM
  Je veux initialiser correctement le bot avec tous ses composants
  Afin de démarrer dans un état cohérent et prêt pour l'action

  Contexte:
    Étant donné que le système démarre

  Scénario: Boot initial du FSM
    Étant donné que le FSM est en cours de création
    Quand le FSM démarre
    Alors le FSM entre en état "initializing"
    Et le contexte est vide ou à valeurs par défaut
    Et aucun drone n'est actif
    Et aucun navire n'est en mouvement

  Scénario: Initialisation du véhicule (ship)
    Étant donné que le FSM est en état "initializing"
    Quand l'événement SHIP_INITIALIZE_REQUEST est reçu avec:
      | shipType         | collector          |
      | initialPosition  | {x: 0, y: 0.5, z: 0} |
    Alors le contexte vehicle est créé avec:
      | position       | {x: 0, y: 0.5, z: 0} |
      | basePosition   | {x: 0, y: 0.5, z: 0} |
      | fuel           | 100                   |
      | damage         | 0                     |
      | resources      | {food: 0, debris: 0, special: 0, total: 0} |
      | maxCapacity    | 2003                  |
      | visualState    | docked                |

  Scénario: Initialisation du drone
    Étant donné que le FSM est en état "initializing"
    Quand l'événement DRONE_INITIALIZE_REQUEST est reçu avec:
      | droneType        | explorer          |
      | initialPosition  | {x: 0, y: 0.5, z: 0} |
    Alors le contexte droneFleet.drones.explorer est créé avec:
      | position       | {x: 0, y: 0.5, z: 0} |
      | visualState    | docked                |
      | isActive       | false                 |
      | isMoving       | false                 |
      | targetDroneTile| null                  |

  Scénario: Initialisation de la grille avec propriétés explorable/collectable
    Étant donné que le FSM est en état "initializing"
    Quand l'événement TILES_UPDATED est reçu avec 100 tuiles
    Alors context.gridInfo.tiles contient les 100 tuiles
    Et chaque tuile a les propriétés obligatoires:
      | propriété   | type   | valeur possible        |
      | explorable  | bool   | true ou false          |
      | collectable | bool   | true ou false          |
    Et context.gridInfo.spacing est défini
    Et context.gridInfo.radius est défini
    Et la grille est prête pour l'exploration
    
  Scénario: Initialisation des types de tuiles avec bonnes capacités
    Étant donné que le FSM crée une grille avec 7 types de tuiles
    Quand les tuiles sont initialisées
    Alors les tuiles ont les propriétés correctes:
      | type     | explorable | collectable | description                      |
      | resource | true       | true        | Peut être explorée et collectée  |
      | danger   | true       | false       | Peut être explorée mais pas collectée |
      | empty    | true       | false       | Peut être explorée mais vide    |
      | fuel     | false      | false       | Station, pas explorée ni collectée |
      | repair   | false      | false       | Station, pas explorée ni collectée |
      | obstacle | false      | false       | Non traversable                 |
      | depart   | false      | false       | Base, non explorée              |

  Scénario: Transition complète d'initialisation vers évaluation
    Étant donné que le FSM est en état "initializing"
    Quand les événements d'initialisation s'exécutent dans l'ordre:
      | SHIP_INITIALIZE_REQUEST |
      | DRONE_INITIALIZE_REQUEST |
      | TILES_UPDATED |
    Alors tous les contextes sont prêts
    Et le FSM transite vers "evaluating"
    Et le bot est prêt à prendre des décisions (exploration/collection/maintenance)

  Scénario: Vérification de la cohérence après initialisation
    Étant donné que le bot s'est initialisé complètement
    Et que le FSM est en état "evaluating"
    Quand une vérification de cohérence est effectuée
    Alors context.vehicle.fuel est valide (0-100)
    Et context.vehicle.damage est valide (0-100)
    Et context.vehicle.position est une coordonnée valide
    Et context.droneFleet.drones.explorer.visualState est 'docked'
    Et context.memory.knownTiles est un tableau
    Et context.memory.stats.tilesExplored est >= 0
    Et context.gridInfo.tiles contient au moins 1 tuile

  Scénario: Ré-initialisation après crash
    Étant donné que le bot a crashé
    Et que le système redémarre
    Quand le FSM redémarre
    Alors le FSM entre en état "initializing"
    Et tous les contextes précédents sont réinitialisés
    Et aucune donnée de session précédente n'est conservée
    Quand l'initialisation complète s'effectue
    Alors le bot est prêt pour un nouveau cycle

  Scénario: Génération de tuile de départ aléatoire depuis TileStore
    Étant donné que TileStore contient 100 tuiles générées
    Et que aucune tuile de départ n'existe encore
    Quand placeStartingTiles est appelé avec botCount = 1
    Alors une tuile aléatoire est sélectionnée parmi les 100 tuiles
    Et cette tuile est convertie en type = "depart"
    Et cette tuile a resources = {food: 200, debris: 200, special: 0, total: 400}
    Et cette tuile.hasResources = true
    Et cette tuile.color = "#4CAF50" (vert)

  Scénario: Tuile de départ assignée à un botId spécifique
    Étant donné que placeStartingTiles a créé une tuile de départ à "3,3"
    Et que activeBotIds = ["bot-0"]
    Quand assignStartingTilesToBots est appelé
    Alors tile["3,3"].assignedToBot = "bot-0"
    Et bot-0 initialise sa basePosition depuis tile["3,3"].position
    Et context.vehicle.basePosition = {x: tile["3,3"].position.x, y: 0.5, z: tile["3,3"].position.z}

  Scénario: Initialisation multi-bot avec bases séparées
    Étant donné que botCount = 2
    Et que activeBotIds = ["bot-0", "bot-1"]
    Quand le système initialise les bots
    Alors placeStartingTiles crée 2 tuiles de départ aléatoires
    Et assignStartingTilesToBots assigne startingTiles[0] à bot-0
    Et assignStartingTilesToBots assigne startingTiles[1] à bot-1
    Quand bot-0 s'initialise
    Alors bot-0.context.vehicle.basePosition = startingTiles[0].position
    Quand bot-1 s'initialise
    Alors bot-1.context.vehicle.basePosition = startingTiles[1].position
    Et les deux bots ont des bases différentes et indépendantes

  Scénario: Tuile de départ contient des ressources initiales
    Étant donné qu'une tuile de départ est créée à "2,4"
    Alors tile["2,4"].type = "depart"
    Et tile["2,4"].resources = {food: 200, debris: 200, special: 0, total: 400}
    Et tile["2,4"].hasResources = true
    Et le bot peut collecter ces ressources initiales si nécessaire

  Scénario: Randomisation des tuiles de départ entre sessions
    Étant donné qu'une session 1 est lancée
    Quand placeStartingTiles génère une tuile de départ
    Alors la coordonnée peut être par exemple "3,3"
    Étant donné qu'une session 2 est relancée (restart)
    Quand placeStartingTiles génère une nouvelle tuile de départ
    Alors la coordonnée peut être différente, par exemple "7,2"
    Et chaque session démarre depuis une position aléatoire sur la grille

  Plan du Scénario: Validation des positions initiales
    Étant donné que le ship s'initialise à la position <shipPos>
    Et que le drone s'initialise à la position <dronePos>
    Quand l'initialisation est terminée
    Alors context.vehicle.basePosition = <shipPos>
    Et context.vehicle.position = <shipPos>
    Et context.droneFleet.drones.explorer.position = <dronePos>

    Exemples:
      | shipPos             | dronePos            | commentaire |
      | {x: 0, y: 0.5, z: 0}  | {x: 0, y: 0.5, z: 0}  | Même position (acceptable) |
      | {x: 0, y: 0.5, z: 0}  | {x: 1, y: 0.5, z: 1}  | Drone décalé (acceptable) |
      | {x: 5, y: 1, z: 5}    | {x: 5, y: 1, z: 5}    | Position personnalisée |
