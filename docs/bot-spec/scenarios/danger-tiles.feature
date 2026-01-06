# language: fr
Fonctionnalité: Tuiles de Danger et Dégâts au Ship
  En tant que système de jeu
  Je veux gérer les interactions avec les tuiles danger
  Afin d'équilibrer le gameplay entre exploration et risque

  Règles des tuiles danger:
  - walkable: true (le ship peut passer dessus)
  - explorable: true (le drone peut les explorer)
  - collectable: false (pas de ressources à collecter)
  - Drone: détruit instantanément lors de l'exploration
  - Ship: subit +10% de dégâts en passant dessus

  Contexte:
    Étant donné que le bot est initialisé
    Et que le FSM est en état "evaluating"

  Scénario: Propriétés de tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Alors la tuile a les propriétés:
      | propriété   | valeur  |
      | type        | danger  |
      | walkable    | true    |
      | explorable  | true    |
      | collectable | false   |
      | resources   | {0, 0, 0} |
      | isDynamicDanger | false (tuile statique par défaut) |
Ship peut traverser une tuile danger (avec dégâts)
    Étant donné que la tuile "5,5" est de type " (et est détruit)
    Étant donné que la tuile "5,5" est de type "danger"
    Et que tuile "5,5" a explorable=true et walkable=true
    Et que droneFleet.drones.explorer.isActive = true
    Quand le drone est déployé vers "5,5"
    Alors le drone peut atteindre la tuile (grâce à explorable=true)
    Et lors du scan, le guard shouldDestroyDroneOnDanger retourne true
    Et droneFleet.drones.explorer.isDestroyed = true
    Et le FSM transite vers "exploring.drone_destroyed"
    Et le ship peut continuer vers d'autres tuiles
    
  Scénario: Drone peut explorer une tuile danger (et est détruit)
  Scénario: Drone peut explorer une tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Et que tuile "5,5" a explorable=true
    Quand le drone est déployé vers "5,5"
    Alors le drone peut explorer la tuile
    Et memory.knownTiles["5,5"].explored = true
    Et le drone n'est pas affecté par le danger
    
  Scénario: Ship ne peut pas collecter une tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Et que tuile "5,5" a collectable=false
    Et que ship.targetVehicleTile = "5,5"
    Quand le guard canCollectTile est évalué
    Alors le guard retourne false
    Et le ship ne transition pas vers "ship_collecting"
    Et le ship reste en "ship_moving_to_tile"

  Scénario: Danger damage appliqué quand ship atteint tuile danger
    Étant donné que ship est en état "collecting.ship_moving_to_tile"
    Et que ship.targetVehicleTile est de type "danger"
    Et que vehicle.damage = 20
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true
    Et l'action assignDangerDamageContext est exécutée
    Et vehicle.damage augmente de 10% (20 → 30)
    Et ship.visualState = "docked" (retour à la base après danger)
    
  Scénario: Danger damage cumulé à 100%
    Étant donné que vehicle.damage = 95
    Et que ship.targetVehicleTile est de type "danger"
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true
    Et vehicle.damage = Math.min(100, 95 + 10) = 100
    Et vehicle.damage ne dépassse pas 100%

  Scénario: Danger dynamique se déplace et applique dégâts
    Étant donné que la tuile "5,5" contient un danger dynamique
    Et que danger.isDynamicDanger = true
    Et que danger.dangerId = "dynamic-danger-1"
    Et que vehicle.damage = 25
    Quand le danger se déplace vers "6,6"
    Et que ship.targetVehicleTile = "6,6"
    Et l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true (danger dynamique détecté)
    Et vehicle.damage augmente de 10% (25 → 35)
    
  Scénario: Danger dynamique n'apparaît pas sur départ
    Étant donné que la tuile "0,0" est de type "depart"
    Et que c'est la base du ship
    Quand un danger dynamique essaie de se déplacer à "0,0"
    Alors le danger est bloqué ou téléporté ailleurs
    Et ship ne reçoit pas de dégâts involontaires à la base

  Scénario: Interaction danger + maintenance
    Étant donné que vehicle.damage = 90
    Et que ship est en état "maintaining"
    Et qu'une action REPAIR est en cours
    Quand l'événement REPAIR_COMPLETE est reçu
    Alors vehicle.damage diminue de 10 points
    Et vehicle.damage = 80
    Quand un danger dynamique arrive sur la base
    Et que vehicle.damage = 80
    Et l'événement SHIP_COLLISION_WITH_DANGER est reçu
    Alors vehicle.damage = 80 + 10 = 90
    Et la réparation est interrompue

  Plan du Scénario: Validation du danger damage
    Étant donné que vehicle.damage = <initialDamage>
    Et que ship rencontre une tuile danger et collection
    Étant donné que la grille contient:
      | coord | type     | walkable | explorable | collectable |
      | 5,5   | resource | true     | true       | true        |
      | 6,6   | danger   | true     | true       | false       |
      | 7,7   | empty    | true     | true       | false       |
    Et que le drone est au centre
    Quand le guard hasUnexploredTilesInRadius est évalué pour exploration
    Alors toutes les tuiles (5,5, 6,6, 7,7) sont explorables par le drone
    Et quand le guard canCollectTile est évalué pour collection
    Alors seules les tuiles 5,5 sont collectables (danger et empty exclus   |
      | 95            | 100            | Cap atteint                   |

  Scénario: Filtre des tuiles danger dans l'exploration
    Étant donné que la grille contient:
      | coord | type     | explorable | collectable |
      | 5,5   | resource | true       | true        |
      | 6,6   | danger   | true       | false       |
      | 7,7   | empty    | true       | false       |
    Et que le drone est au centre
    Quand le guard hasUnexploredTilesInRadius est évalué
    Alors toutes les tuiles (5,5, 6,6, 7,7) sont explorables
    Et seules les tuiles 5,5 et 7,7 sont collectables (danger exclue)

  # ==========================================================================
  # 🆕 DRONE DESTRUCTION: Scénarios de destruction de drone sur tuile danger
  # ==========================================================================

  Scénario: Drone détruit sur tuile danger
    Étant donné que le FSM est en état "exploring.drone_scanning"
    Et que droneFleet.drones.explorer.targetDroneTile.type = "danger"
    Et que droneFleet.drones.explorer.isActive = true
    Et que droneFleet.drones.explorer.isDestroyed = false
    Quand l'événement DRONE_HAS_SCANNED est reçu
    Alors le guard shouldDestroyDroneOnDanger retourne true
    Et l'action assignDroneDestroyedContext est exécutée
    Et droneFleet.drones.explorer.isDestroyed = true
    Et droneFleet.drones.explorer.isActive = false
    Et droneFleet.drones.explorer.visualState = "failed"
    Et droneFleet.drones.explorer.health = 0
    Et droneFleet.stats.explorerDestroyed augmente de 1
    Et le FSM transite vers "exploring.drone_destroyed"
    Et le FSM transite ensuite vers "evaluating"

  Scénario: Drone non détruit sur tuile normale
    Étant donné que le FSM est en état "exploring.drone_scanning"
    Et que droneFleet.drones.explorer.targetDroneTile.type = "resource"
    Quand l'événement DRONE_HAS_SCANNED est reçu
    Alors le guard shouldDestroyDroneOnDanger retourne false
    Et le FSM transite vers "exploring.drone_returning"
    Et droneFleet.drones.explorer.isDestroyed = false

  Scénario: Achat de drone avec ressources suffisantes
    Étant donné que le FSM est en état "maintaining.purchasing_drone"
    Et que droneFleet.drones.explorer.isDestroyed = true
    Et que score.resources.total = 100
    Quand l'événement DRONE_PURCHASE_COMPLETE est reçu
    Alors le guard hasResourcesForDrone retourne true (100 >= 50)
    Et l'action assignPurchaseDroneContext est exécutée
    Et score.resources.total diminue de 50 (100 → ~50)
    Et droneFleet.drones.explorer.isActive = true
    Et droneFleet.drones.explorer.isDestroyed = false
    Et droneFleet.drones.explorer.health = 100
    Et droneFleet.drones.explorer.visualState = "docked"
    Et le FSM transite vers "evaluating"

  Scénario: Achat de drone sans ressources (pénalité dégâts)
    Étant donné que le FSM est en état "maintaining.purchasing_drone"
    Et que droneFleet.drones.explorer.isDestroyed = true
    Et que score.resources.total = 30
    Et que vehicle.damage = 25
    Quand l'événement DRONE_PURCHASE_COMPLETE est reçu
    Alors le guard hasResourcesForDrone retourne false (30 < 50)
    Et l'action assignDroneDamagePenaltyContext est exécutée
    Et score.resources.total reste inchangé (30)
    Et vehicle.damage augmente de 20% (25 → 45)
    Et droneFleet.drones.explorer.isActive = true
    Et droneFleet.drones.explorer.isDestroyed = false
    Et droneFleet.drones.explorer.health = 100
    Et le FSM transite vers "evaluating"

  Scénario: Transition evaluating → purchasing_drone si drone détruit
    Étant donné que le FSM est en état "evaluating"
    Et que droneFleet.drones.explorer.isDestroyed = true
    Et que droneFleet.drones.explorer.isActive = false
    Quand l'événement NEED_DRONE_PURCHASE est reçu
    Alors le guard needsDronePurchase retourne true
    Et le FSM transite vers "maintaining.purchasing_drone"

  Plan du Scénario: Coût d'achat de drone
    Étant donné que score.resources.total = <initialResources>
    Et que vehicle.damage = <initialDamage>
    Et que le drone est détruit
    Quand l'événement DRONE_PURCHASE_COMPLETE est reçu
    Alors score.resources.total = <expectedResources>
    Et vehicle.damage = <expectedDamage>
    Et droneFleet.drones.explorer.isActive = true

    Exemples:
      | initialResources | initialDamage | expectedResources | expectedDamage | commentaire                    |
      | 100              | 0             | ~50               | 0              | Achat normal avec ressources   |
      | 50               | 10            | ~0                | 10             | Exactement le coût             |
      | 49               | 20            | 49                | 40             | Pénalité dégâts (+20%)         |
      | 0                | 50            | 0                 | 70             | Sans ressources, pénalité      |
      | 0                | 90            | 0                 | 100            | Dégâts plafonnés à 100%        |
