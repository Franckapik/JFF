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

  Scénario: Initialisation de la grille
    Étant donné que le FSM est en état "initializing"
    Quand l'événement TILES_UPDATED est reçu avec 100 tuiles
    Alors context.gridInfo.tiles contient les 100 tuiles
    Et context.gridInfo.spacing est défini
    Et context.gridInfo.radius est défini
    Et la grille est prête pour l'exploration

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
