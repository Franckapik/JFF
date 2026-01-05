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
  # SCÉNARIO PROBLÉMATIQUE #5b: Blocage dans drone_deploying sans target
  # ============================================================================
  # OBSERVÉ: Le FSM reste bloqué dans drone_deploying avec targetDroneTile = unknown
  # après que assignDroneDeployingContext ne trouve aucune tuile à explorer
  # RÉSOLU: Ajout de l'event NO_TARGET_FOUND pour détecter et résoudre cette situation

  Scénario: Blocage drone_deploying sans cible (RÉSOLU - Option A)
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que assignDroneDeployingContext a retourné targetTile = "unknown"
    Et que le guard hasUnexploredTilesInRadius retourne false
    Et que toutes les tuiles dans exploringRadius sont explorées
    Quand le tracker détecte l'absence de targetDroneTile valide
    Alors le tracker envoie l'événement NO_TARGET_FOUND après 100ms
    Et le log "⚠️  No valid target tile → sending NO_TARGET_FOUND" est émis

  Scénario: Recovery avec NO_TARGET_FOUND vers relocating (PHASE 2)
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que targetDroneTile = "unknown"
    Quand l'événement NO_TARGET_FOUND est reçu
    Alors le FSM transite DIRECTEMENT vers "maintaining.relocating"
    # FIX: assignShipRelocatingContext N'EST PLUS sur la transition
    # Elle s'exécute uniquement via l'entry de relocating
    Et l'entry action assignShipRelocatingContext est appelée UNE FOIS
    Et le radius est incrémenté de 1 (sauf si déjà au max)
    Et les pénalités sont appliquées (score ÷2, damage +30%)
    Et après 500ms, RELOCATING_COMPLETE est envoyé
    Et le guard isAtMaxRadius/canIncreaseRadius détermine la suite

  Scénario: FIX - Double exécution de assignShipRelocatingContext (CORRIGÉ)
    # BUG AVANT: L'action était appelée 2 fois:
    # 1. Sur la transition NO_TARGET_FOUND (actions: 'assignShipRelocatingContext')
    # 2. Dans l'entry de relocating (entry: ['assignShipRelocatingContext', ...])
    Étant donné que le FSM reçoit NO_TARGET_FOUND
    Et que GameStore.explorationRadius = 1
    Quand la transition vers "maintaining.relocating" s'exécute
    # AVANT LE FIX:
    # Alors assignShipRelocatingContext s'exécute (transition)
    # Et radius passe de 1 à 2
    # Et assignShipRelocatingContext s'exécute ENCORE (entry)
    # Et radius passe de 2 à 3 (INCORRECT - saut d'étape)
    
    # APRÈS LE FIX:
    Alors assignShipRelocatingContext s'exécute UNE SEULE FOIS (entry)
    Et radius passe de 1 à 2 UNIQUEMENT
    Et la progression est correcte: 1 → 2 → 3 (étape par étape)

  Scénario: Validation progression radius sans saut d'étape
    Étant donné que le bot démarre avec explorationRadius = 1
    
    # Première relocation
    Quand NO_TARGET_FOUND est reçu (radius=1)
    Alors le FSM transite vers "maintaining.relocating"
    Et assignShipRelocatingContext s'exécute 1 fois
    Et explorationRadius passe à 2
    Et les logs montrent: "🔄 [RadiusSlice] bot-X increased exploration radius: 1 → 2"
    
    # Deuxième relocation
    Quand NO_TARGET_FOUND est reçu (radius=2)
    Alors le FSM transite vers "maintaining.relocating"
    Et assignShipRelocatingContext s'exécute 1 fois
    Et explorationRadius passe à 3
    Et les logs montrent: "🔄 [RadiusSlice] bot-X increased exploration radius: 2 → 3"
    
    # Troisième relocation = GAME OVER
    Quand NO_TARGET_FOUND est reçu (radius=3)
    Alors le FSM transite vers "maintaining.relocating"
    Et assignShipRelocatingContext détecte isAtMaxRadius = true
    Et explorationRadius reste à 3
    Et après 500ms, transition vers "game_over"

  Scénario: Race condition guard vs action résolu par NO_TARGET_FOUND + Option A
    Étant donné que le guard hasUnexploredTilesInRadius trouve 1 tuile non explorée
    Et que le FSM transite vers "exploring.drone_deploying"
    Mais que assignDroneDeployingContext trouve 0 tuiles (désync timing)
    Quand le tracker planifie les événements
    Alors aucun événement DRONE_REACHES_TILE n'est planifié
    Mais l'événement NO_TARGET_FOUND est planifié après 100ms
    Et le bot se rétablit automatiquement vers relocating

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

  # ============================================================================
  # 🆕 CAS LIMITES MULTI-BOT
  # ============================================================================

  Scénario: Deux bots ciblent simultanément la même tuile
    Étant donné que tile["5,5"].resources.total = 500
    Et que bot-0 transite vers "collecting.ship_moving_to_tile" avec target = "5,5"
    Et que bot-1 transite vers "collecting.ship_moving_to_tile" avec target = "5,5"
    Et que bot-0 atteint "5,5" en premier (timestamp T1)
    Quand bot-0 collecte tile["5,5"]
    Alors tile["5,5"].resources.total = 0
    Et tile["5,5"].collected = true
    Et tile["5,5"].collectedBy = "bot-0"
    Quand bot-1 atteint "5,5" (timestamp T2 > T1)
    Alors bot-1 détecte tile["5,5"].collected = true
    Et le warning "Target tile already collected by bot-0" est émis
    Et bot-1.context.targetVehicleTile = null
    Et bot-1 cherche une tuile alternative

  Scénario: Désynchronisation contexte multi-bot et TileStore partagé
    Étant donné que bot-0 et bot-1 partagent le même TileStore
    Et que bot-0.memory.knownTiles["3,3"] = {resources.total: 300, collected: false}
    Et que bot-1 collecte tile["3,3"] dans TileStore
    Alors TileStore.tiles["3,3"] = {resources.total: 0, collected: true, collectedBy: "bot-1"}
    Quand bot-0 évalue hasCollectibleTiles
    Alors bot-0 lit son context.memory.knownTiles (qui n'est pas à jour)
    Et bot-0 pense que "3,3" a encore 300 ressources
    # BUG: bot-0 ne synchronise pas avec TileStore avant d'évaluer le guard
    Et bot-0 cible "3,3" pour collection (INCORRECT)

  Scénario: Comportement attendu - synchronisation inter-bot via TileStore
    Étant donné que bot-0 et bot-1 partagent le même TileStore
    Et que bot-1 collecte tile["3,3"]
    Alors TileStore.tiles["3,3"].collected = true
    Quand bot-0 évalue hasCollectibleTiles
    Alors le guard doit lire TileStore.tiles["3,3"] (source de vérité)
    Et non pas context.memory.knownTiles (cache local)
    Et bot-0 détecte que "3,3" est collected = true
    Et bot-0 ignore "3,3" dans sa liste de cibles

  Scénario: Tuile de départ assignée doit être protégée
    Étant donné que startingTiles[0].assignedToBot = "bot-0"
    Et que startingTiles[0].type = "depart"
    Et que startingTiles[0].coord = "2,2"
    Quand bot-1 explore la zone et découvre "2,2"
    Alors bot-1 ajoute "2,2" à memory.knownTiles
    Quand bot-1 évalue hasCollectibleTiles
    Alors le guard doit filtrer les tuiles avec type = "depart"
    Et "2,2" est EXCLUE de la liste collectible pour bot-1
    Et bot-0 peut collecter sa propre base "2,2" si nécessaire

  Scénario: Gestion de collectedBy dans memory.knownTiles
    Étant donné que bot-0 collecte tile["7,7"]
    Alors TileStore.tiles["7,7"].collectedBy = "bot-0"
    Quand bot-0 met à jour memory.knownTiles["7,7"]
    Alors memory.knownTiles["7,7"].collectedBy = "bot-0"
    Quand bot-1 découvre tile["7,7"] (déjà collectée)
    Alors bot-1 ajoute "7,7" à son memory.knownTiles
    Et bot-1.memory.knownTiles["7,7"].collectedBy = "bot-0"
    Et bot-1.memory.knownTiles["7,7"].collected = true

  Scénario: Race condition - Deux bots à la même distance
    Étant donné que tile["4,4"].resources.total = 600
    Et que bot-0 et bot-1 sont à la même distance de "4,4"
    Quand les deux bots envoient SHIP_REACHES_TILE au même instant
    Alors TileStore résout la race condition via premier write
    Et le premier bot à écrire collectResources() gagne
    Et tile["4,4"].collectedBy = premier botId à écrire
    Et le deuxième bot détecte collected = true lors de SHIP_LOAD_RESOURCES

  Scénario: Logs multi-bot avec préfixe botId pour débogage
    Étant donné que bot-0 et bot-1 évoluent en parallèle
    Quand bot-0 collecte tile["5,5"]
    Alors le log contient "[bot-0] Ship collecting at 5,5"
    Quand bot-1 collecte tile["6,6"]
    Alors le log contient "[bot-1] Ship collecting at 6,6"
    Et les logs permettent de tracer les actions de chaque bot indépendamment
