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

  # ============================================================================
  # 🆕 SCÉNARIOS D'EXCLUSION DE TUILES
  # ============================================================================

  Scénario: Exclusion de la tuile de départ (base) de l'exploration
    Étant donné que baseTile.coord = "3,3" avec type = "depart"
    Et que gridInfo.tiles contient ["3,2", "3,3", "3,4", "4,3"]
    Quand assignDroneDeployingContext sélectionne une tuile cible
    Alors la tuile "3,3" est EXCLUE (type = "depart")
    Et le drone est envoyé vers une tuile de type "resource"
    Et la tuile de départ n'est JAMAIS explorée

  Scénario: Exclusion des tuiles déjà explorées
    Étant donné que memory.knownTiles contient:
      | coord | explored | collected |
      | 3,2   | true     | false     |
      | 3,4   | true     | true      |
    Et que gridInfo.tiles contient ["3,2", "3,3", "3,4", "4,3", "4,4"]
    Quand assignDroneDeployingContext sélectionne une tuile cible
    Alors les tuiles "3,2" et "3,4" sont EXCLUES (déjà explorées)
    Et le drone est envoyé vers "4,3" ou "4,4" (non explorées)

  Scénario: Exclusion des tuiles hors rayon d'exploration
    Étant donné que vehicle.coord = "3,3"
    Et que config.exploringRadius = 2
    Et que gridInfo.tiles contient des tuiles à distances variées
    Quand assignDroneDeployingContext sélectionne une tuile cible
    Alors seules les tuiles à distance <= 2 de "3,3" sont candidates
    Et les tuiles à distance > 2 sont EXCLUES

  Scénario: Aucune tuile disponible pour exploration
    Étant donné que toutes les tuiles dans le rayon sont explorées
    Et que vehicle.coord = "3,3"
    Et que config.exploringRadius = 2
    Quand assignDroneDeployingContext est appelé
    Alors targetDroneTile = null
    Et le FSM transite vers "evaluating"
    Et le log "No unexplored tiles in radius" est émis

  # ============================================================================
  # 🆕 SCÉNARIO: Tuile explorée mais sans ressources
  # ============================================================================

  Scénario: Tuile explorée avec resources.total = 0
    Étant donné que le drone atteint la tuile "4,4"
    Et que TileStore.tiles["4,4"].resources.total = 0
    Quand l'événement DRONE_HAS_SCANNED est reçu
    Alors la tuile "4,4" est marquée explored = true
    Et la tuile "4,4" est ajoutée à memory.knownTiles
    Mais hasResources = false (car resources.total = 0)
    Et la tuile "4,4" ne sera PAS ciblée pour collection
    Et le guard hasCollectibleTiles ignore cette tuile

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

  # ============================================================================
  # 🆕 SCÉNARIOS: DÉPLACEMENT DU NAVIRE POUR EXPLORATION COMPLÈTE (Bug #7)
  # ============================================================================

  Scénario: Toutes les tuiles locales explorées - Relocalisation du navire nécessaire
    Étant donné que vehicle.coord = "3,3" (tuile de départ)
    Et que config.exploringRadius = 1
    Et que toutes les tuiles dans le rayon de 1 sont explorées:
      | coord | explored | collected |
      | 2,2   | true     | true      |
      | 2,3   | true     | true      |
      | 3,2   | true     | true      |
      | 3,4   | true     | false     |
      | 4,2   | true     | false     |
      | 4,3   | true     | false     |
    Et que TileMatrix montre {"total":37,"explored":6,"collected":4}
    Quand le FSM évalue l'état dans "evaluating"
    Alors le guard canStartExploring retourne false (aucune tuile locale non explorée)
    Et le guard needsRelocation retourne true
    Et le FSM transite vers "ship_relocating"

  Scénario: Relocalisation du navire vers une zone non explorée
    Étant donné que le FSM est en état "evaluating"
    Et que toutes les tuiles dans exploringRadius sont explorées
    Et que config.collectingRadius = 3
    Et que des tuiles non explorées existent dans le collectingRadius:
      | coord | explored | distance_from_ship |
      | 6,3   | false    | 3                  |
      | 5,5   | false    | 2.8                |
      | 1,1   | false    | 2.8                |
    Quand le guard needsRelocation retourne true
    Et que l'action assignShipRelocatingContext est appelée
    Alors le centroïde des tuiles non explorées est calculé
    Et targetVehicleTile est défini vers la tuile la plus proche du centroïde
    Et le FSM transite vers "ship_relocating"
    Et vehicle commence à se déplacer vers targetVehicleTile

  Scénario: Le navire atteint la nouvelle position et reprend l'exploration
    Étant donné que le FSM est en état "ship_relocating"
    Et que vehicle.targetPosition = "5,5"
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors vehicle.coord = "5,5"
    Et le FSM transite vers "evaluating"
    Et canStartExploring retourne true (nouvelles tuiles dans le rayon)
    Et le FSM transite vers "exploring.drone_deploying"
    Et le drone est déployé vers une tuile non explorée autour de "5,5"

  Scénario: Calcul du centroïde des tuiles non explorées
    Étant donné que vehicle.coord = "3,3"
    Et que les tuiles non explorées sont:
      | coord | x   | z   |
      | 6,3   | 4.8 | 2.4 |
      | 6,4   | 4.8 | 3.2 |
      | 5,5   | 4.0 | 4.0 |
      | 5,6   | 4.0 | 4.8 |
    Quand assignShipRelocatingContext calcule le centroïde
    Alors centroïde ≈ (4.4, 3.6)
    Et la tuile la plus proche est "5,5" ou "6,4"
    Et targetVehicleTile est défini vers cette tuile

  Scénario: Toutes les tuiles de la matrice explorées - Arrêt de l'exploration
    Étant donné que TileMatrix montre {"total":37,"explored":37,"collected":15}
    Et que vehicle.coord = quelconque
    Quand le FSM évalue l'état dans "evaluating"
    Alors canStartExploring retourne false (aucune tuile non explorée)
    Et needsRelocation retourne false (aucune tuile non explorée même dans collectingRadius)
    Et hasCollectibleTiles retourne false (toutes collectées)
    Et le FSM transite vers "maintaining" (dépôt des ressources)
    Après maintenance, le FSM reste en "evaluating" (aucune action possible)
    Et le bot attend de nouvelles tuiles ou événements externes

  Scénario: Éviter la relocalisation inutile si tuiles collectibles existent
    Étant donné que vehicle.coord = "3,3"
    Et que toutes les tuiles dans exploringRadius sont explorées
    Mais que des tuiles collectibles existent:
      | coord | explored | collected | hasResources |
      | 2,2   | true     | false     | true         |
      | 3,2   | true     | false     | true         |
    Quand le FSM évalue l'état dans "evaluating"
    Alors hasCollectibleTiles retourne true
    Et le FSM transite vers "collecting" (priorité à la collecte)
    Et la relocalisation est reportée après la collecte

  Plan du Scénario: Validation du guard needsRelocation
    Étant donné que vehicle.coord = "3,3"
    Et que exploringRadius = 1
    Et que collectingRadius = 3
    Et que <unexplored_in_exploring> tuiles non explorées dans exploringRadius
    Et que <unexplored_in_collecting> tuiles non explorées dans collectingRadius
    Et que <collectible_tiles> tuiles collectibles existent
    Quand le guard needsRelocation est évalué
    Alors le guard retourne <result>

    Exemples:
      | unexplored_in_exploring | unexplored_in_collecting | collectible_tiles | result | commentaire                                    |
      | 0                       | 5                        | 0                 | true   | Relocalisation nécessaire (tuiles loin)       |
      | 0                       | 0                        | 0                 | false  | Toute la matrice explorée                     |
      | 2                       | 8                        | 0                 | false  | Encore des tuiles locales à explorer          |
      | 0                       | 5                        | 3                 | false  | Collecte prioritaire, relocalisation après    |
      | 0                       | 1                        | 0                 | true   | Dernière tuile loin, relocalisation utile     |

  Scénario: Performance - Exploration complète d'une matrice 7×7 avec relocalisation
    Étant donné que la matrice contient 37 tuiles réparties sur 7 lignes et 7 colonnes
    Et que vehicle.coord = "3,3" (centre)
    Et que exploringRadius = 1 (6 tuiles accessibles initialement)
    Et que vehicle.fuel = 100
    Quand le bot explore la matrice complète
    Alors le navire se relocalise au moins 4 fois
    Et toutes les 37 tuiles sont explorées
    Et memory.stats.tilesExplored = 37
    Et le temps d'exécution est < 10 minutes
    Et l'efficacité est >= 3.7 tiles/minute
    Et le fuel consommé est < 80 (optimisé par relocalisation)
