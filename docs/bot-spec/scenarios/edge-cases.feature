# language: fr
Fonctionnalité: Cas Limites et Boucles Détectées
  En tant que développeur
  Je veux documenter les cas limites problématiques
  Afin de corriger les boucles infinies et comportements incohérents

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #1: Double collecte sur tuile déjà vidée
  # ============================================================================
  # OBSERVÉ: Après collecte réussie (tuile vidée), la FSM retourne immédiatement 
  # à ship_moving_to_tile avec la même tuile comme cible, puis tente une 2e collecte
  # CAUSE: Transition SHIP_LOAD_RESOURCES → ship_moving_to_tile au lieu de evaluating
  # lorsque noMoreCollectibleTiles devrait être true mais ne l'est pas
  
  Scénario: Double collecte sur tuile vidée (BUG IDENTIFIÉ)
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que targetVehicleTile = "2,4" avec resources.total = 429
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors les ressources sont collectées avec succès
    Et la tuile "2,4" a maintenant resources.total = 0
    Et tileCollectedFlag = true
    # BUG: Au lieu de transiter vers evaluating (noMoreCollectibleTiles = true)
    # Le FSM transite vers ship_moving_to_tile avec la MÊME tuile vide
    Et le FSM transite vers "collecting.ship_moving_to_tile"
    Et targetVehicleTile = "2,4" (INCORRECT - tuile déjà collectée)
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le FSM tente de collecter une tuile vide
    Et le warning "Target tile has no resources to collect" apparaît

  Scénario: Comportement attendu après collecte complète
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que targetVehicleTile = "2,4" avec resources.total = 429
    Et que memory.knownTiles ne contient QUE cette tuile avec ressources
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors les ressources sont collectées avec succès
    Et memory.knownTiles["2,4"].collected = true
    Et memory.knownTiles["2,4"].resources.total = 0
    Quand le guard noMoreCollectibleTiles est évalué
    Alors le guard retourne true (aucune tuile avec resources.total > 0 ET collected = false)
    Et le FSM transite vers "evaluating"

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #2: Désynchronisation contexte FSM / TileStore
  # ============================================================================
  # OBSERVÉ: memory.knownTiles contient des tuiles avec hasResources=true
  # alors que TileStore a déjà vidé ces tuiles (resources.total = 0)
  # CAUSE: Le contexte FSM n'est pas mis à jour immédiatement après collectResources()

  Scénario: Désynchronisation mémoire FSM et TileStore (BUG IDENTIFIÉ)
    Étant donné que memory.knownTiles contient:
      | coord | resources.total | collected | hasResources |
      | 2,4   | 429             | false     | true         |
    Et que TileStore.tiles["2,4"] a resources.total = 0 et collected = true
    Quand le guard hasCollectibleTiles est évalué
    Alors le guard lit memory.knownTiles (contexte FSM)
    Et le guard retourne true (il voit 429 ressources)
    # BUG: Le guard devrait synchroniser avec TileStore ou le contexte devrait être à jour
    Et le FSM envoie NEED_COLLECTING vers une tuile déjà vide

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #3: Exploration de tuile déjà explorée/collectée
  # ============================================================================
  # OBSERVÉ: Le drone explore une tuile qui était déjà explorée et collectée
  # CAUSE: explorationQueue ne filtre pas les tuiles déjà explorées ou collectées

  Scénario: Re-exploration de tuile déjà visitée (BUG POTENTIEL)
    Étant donné que la tuile "2,3" a été explorée et collectée précédemment
    Et que explorationQueue contient ["2,3", "3,4", "4,5"]
    Quand l'événement NEED_EXPLORING est reçu
    Alors le drone est envoyé vers "2,3"
    # BUG: La tuile était déjà explorée, le drone gaspille du fuel
    Et tilesExplored ne s'incrémente pas (ou ne devrait pas)

  Scénario: Comportement attendu - filtrage des tuiles déjà explorées
    Étant donné que la tuile "2,3" a été explorée (explored = true)
    Et que explorationQueue contient ["2,3", "3,4", "4,5"]
    Quand l'assignation assignDroneDeployingContext est appelée
    Alors la tuile "2,3" est EXCLUE de explorationQueue
    Et le drone est envoyé vers "3,4" (première tuile non explorée)

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #4: Tuile de départ (base) dans explorationQueue
  # ============================================================================
  # HYPOTHÈSE: La tuile de départ 3,3 (type="depart") pourrait être ajoutée
  # à explorationQueue et causer des comportements inattendus

  Scénario: Exclusion de la tuile de départ de l'exploration
    Étant donné que baseTile.coord = "3,3" avec type = "depart"
    Et que explorationQueue contient ["3,3", "3,4", "4,3"]
    Quand l'assignation assignDroneDeployingContext est appelée
    Alors la tuile "3,3" est EXCLUE (type = "depart")
    Et le drone est envoyé vers "3,4"

  Scénario: La tuile de départ ne doit jamais être collectée
    Étant donné que baseTile.coord = "3,3" avec type = "depart"
    Et que baseTile.resources = {food: 0, debris: 0, special: 0, total: 0}
    Quand le guard hasCollectibleTiles est évalué
    Alors la tuile "3,3" n'est PAS incluse dans les tuiles collectibles
    Et le guard ne compte que les tuiles de type "resource"

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #5: Blocage dans ship_moving_to_tile sans target
  # ============================================================================
  # OBSERVÉ: Le FSM reste bloqué dans ship_moving_to_tile avec targetVehicleTile = null
  # après synchronisation avec tuile vide quand aucune alternative n'existe

  Scénario: Blocage ship_moving_to_tile sans cible (BUG IDENTIFIÉ)
    Étant donné que le FSM est en état "collecting.ship_moving_to_tile"
    Et que targetVehicleTile était "2,3" mais maintenant null (après sync)
    Et que le warning "No alternative tiles found after synchronization" a été émis
    Quand le tracker tente de planifier SHIP_REACHES_TILE
    Alors aucun événement n'est planifié (0 events scheduled)
    Et le FSM reste bloqué indéfiniment dans ship_moving_to_tile

  Scénario: Comportement attendu - sortie quand pas de cible
    Étant donné que le FSM est en état "collecting.ship_moving_to_tile"
    Et que targetVehicleTile = null
    Quand le guard noMoreCollectibleTiles est évalué
    Alors le guard retourne true
    Et le FSM transite automatiquement vers "evaluating"
    Et le cycle peut continuer

  # ============================================================================
  # SCÉNARIO PROBLÉMATIQUE #6: Tuiles vides générées (hasResources = false)
  # ============================================================================
  # OBSERVÉ: Certaines tuiles sont générées avec resources.total = 0
  # mais sont quand même ajoutées à memory.knownTiles après exploration

  Scénario: Tuile explorée sans ressources ajoutée à knownTiles
    Étant donné que le drone explore la tuile "4,4"
    Et que la tuile "4,4" a resources.total = 0 (générée vide)
    Quand l'événement DRONE_HAS_SCANNED est reçu
    Alors la tuile "4,4" est ajoutée à memory.knownTiles
    Et hasCollectibleTiles doit retourner false pour cette tuile
    # OK: Ce comportement est correct si hasResources est bien = false

  Scénario: Compteur knownTilesCount vs tilesWithResources
    Étant donné que memory.knownTiles contient:
      | coord | resources.total | hasResources |
      | 3,2   | 0               | false        |
      | 4,3   | 258             | true         |
      | 4,4   | 0               | false        |
    Quand le log [Evaluating] Conditions est affiché
    Alors knownTilesCount = 3 (total des tuiles connues)
    Et hasCollectibleTiles = true (au moins une avec ressources)
    Et le FSM envoie NEED_COLLECTING uniquement vers "4,3"

  # ============================================================================
  # CORRECTIONS SUGGÉRÉES
  # ============================================================================
  
  # FIX #1: Synchroniser immédiatement memory.knownTiles après collectResources()
  #         → Déjà partiellement implémenté mais insuffisant
  
  # FIX #2: Ajouter une transition directe ship_collecting → evaluating
  #         quand la tuile collectée est la dernière avec ressources
  
  # FIX #3: Filtrer explorationQueue pour exclure tuiles explorées/collectées
  #         ET tuile de départ (type = "depart")
  
  # FIX #4: Ajouter un guard de sortie sur ship_moving_to_tile
  #         quand targetVehicleTile = null → transiter vers evaluating
  
  # FIX #5: Éviter le double envoi d'événements par le tracker
  #         quand le FSM change d'état pendant le transit
