# language: fr
Fonctionnalité: Exploration Autonome
  En tant que bot autonome
  Je veux explorer automatiquement un territoire inconnu
  Afin de découvrir des ressources sans intervention manuelle

  Contexte:
    Étant donné que le bot est initialisé
    Et que le FSM est en état "evaluating"

  Scénario: Exploration réussie d'une tuile
    Étant donné que explorationQueue contient ["5,5", "6,6", "7,7"]
    Et que vehicle.fuel = 50
    Et que vehicle.damage = 20
    Et que drone.visualState = "docked"
    Quand le guard shouldExplore est évalué
    Alors le guard retourne true
    Quand l'événement NEED_EXPLORING est reçu
    Alors le FSM transite vers "exploring.drone_deploying"
    Et drone.visualState devient "deploying"
    Et drone.targetPosition = "5,5"
    
  Scénario: Drone scanne une tuile et découvre des ressources
    Étant donné que drone.visualState = "deploying"
    Et que le drone a atteint la tuile cible "5,5"
    Quand l'événement DRONE_REACHES_TILE est reçu
    Alors le FSM transite vers "exploring.drone_scanning"
    Et drone.visualState devient "scanning"
    Quand l'événement DRONE_HAS_SCANNED est reçu
    Alors memory.stats.tilesExplored s'incrémente de 1
    Et la tuile "5,5" est marquée comme explored=true
    Et si la tuile a des ressources, elle est ajoutée à availableTiles
    
  Scénario: Drone retourne à la base après scan
    Étant donné que drone.visualState = "scanning"
    Et que le scan est terminé
    Quand l'événement DRONE_REACHES_BASE est reçu
    Alors le FSM transite vers "exploring.drone_docked"
    Et drone.visualState devient "docked"
    Et drone.targetPosition = basePosition
    Quand l'événement DRONE_READY_FOR_REDEPLOY est reçu
    Alors le FSM transite vers "evaluating"
    Et drone est prêt pour un nouveau déploiement

  Scénario: Exploration bloquée par fuel bas
    Étant donné que explorationQueue contient ["5,5"]
    Et que vehicle.fuel = 18
    Et que vehicle.damage = 20
    Quand le guard shouldExplore est évalué
    Alors le guard retourne false
    Et le FSM reste en "evaluating"
    
  Scénario: Exploration bloquée par damage élevé
    Étant donné que explorationQueue contient ["5,5"]
    Et que vehicle.fuel = 50
    Et que vehicle.damage = 85
    Quand le guard shouldExplore est évalué
    Alors le guard retourne false
    Et le FSM reste en "evaluating"
    
  Scénario: Exploration bloquée par queue vide
    Étant donné que explorationQueue est vide
    Et que vehicle.fuel = 50
    Et que vehicle.damage = 20
    Quand le guard shouldExplore est évalué
    Alors le guard retourne false
    Et le FSM reste en "evaluating"

  Plan du Scénario: Validation du guard shouldExplore
    Étant donné que explorationQueue contient <queue>
    Et que vehicle.fuel = <fuel>
    Et que vehicle.damage = <damage>
    Quand le guard shouldExplore est évalué
    Alors le guard retourne <result>

    Exemples:
      | queue       | fuel | damage | result | commentaire                          |
      | ["5,5"]     | 50   | 30     | true   | Toutes conditions satisfaites       |
      | []          | 50   | 30     | false  | Queue vide                          |
      | ["5,5"]     | 18   | 30     | false  | Fuel trop bas (< 20, stratégie prudente) |
      | ["5,5"]     | 50   | 85     | false  | Damage trop élevé (> 80)            |
      | ["5,5"]     | 20   | 80     | false  | Fuel et damage à la limite          |
      | ["5,5"]     | 21   | 79     | true   | Juste au-dessus des limites         |

  Scénario: Interruption de l'exploration par LOW_FUEL_WARNING
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que vehicle.fuel = 18
    Quand l'événement LOW_FUEL_WARNING est reçu
    Alors l'exploration en cours est interrompue
    Et le FSM transite vers "maintaining"
    Et explorationQueue est préservée pour plus tard

  Scénario: Cycle d'exploration complet avec plusieurs tuiles
    Étant donné que explorationQueue contient ["5,5", "6,6"]
    Et que vehicle.fuel = 50
    
    # Première tuile
    Quand l'événement NEED_EXPLORING est reçu
    Alors le FSM transite vers "exploring"
    Quand le drone explore "5,5"
    Alors memory.stats.tilesExplored = 1
    Et le drone retourne à la base
    Et le FSM transite vers "evaluating"
    
    # Deuxième tuile
    Et explorationQueue contient ["6,6"]
    Quand l'événement NEED_EXPLORING est reçu
    Alors le FSM transite vers "exploring"
    Quand le drone explore "6,6"
    Alors memory.stats.tilesExplored = 2
    Et le drone retourne à la base
    Et le FSM transite vers "evaluating"
    Et explorationQueue est vide

  Scénario: Drone détruit par une tuile danger
    Étant donné que explorationQueue contient ["4,4", "5,5"]
    Et que la tuile "4,4" est de type "danger"
    Et que drone.visualState = "docked"
    Et que vehicle.fuel = 50
    Quand l'événement NEED_EXPLORING est reçu
    Alors le FSM transite vers "exploring.drone_deploying"
    Et drone.visualState devient "deploying"
    Et drone.targetPosition = "4,4"
    Quand le drone atteint la tuile danger "4,4"
    Alors drone.visualState devient "failed"
    Et drone.isActive = false
    Et drone n'a collecté aucune information sur la tuile "4,4"
    Et la tuile "4,4" ne figure pas dans memory.exploredTiles
    Et explorationQueue reste ["5,5"]
    Quand l'événement DRONE_DESTROYED est reçu
    Alors le FSM transite vers "evaluating"
    Et le bot peut continuer avec la prochaine tuile d'exploration

  Scénario: Performance - Exploration de 100 tuiles
    Étant donné que explorationQueue contient 100 tuiles
    Et que vehicle.fuel = 100
    Et que vehicle.damage = 0
    Quand le bot explore toutes les tuiles
    Alors toutes les 100 tuiles sont marquées explored=true
    Et memory.stats.tilesExplored = 100
    Et le temps d'exécution est < 20 minutes
    Et l'efficacité est >= 5 tiles/minute

  Scénario: Synchronisation de la grille - TILES_UPDATED
    Étant donné que le FSM est en état "evaluating"
    Et que la grille contient 50 tuiles initialement
    Quand l'événement TILES_UPDATED est reçu avec:
      | spacing | 1.0 |
      | radius  | 5   |
      | tiles   | 75 tuiles mises à jour |
    Alors context.gridInfo.tiles est synchronisé avec les 75 tuiles
    Et la grille est à jour pour l'exploration
    Et les tuiles déjà explorées conservent leur statut explored=true