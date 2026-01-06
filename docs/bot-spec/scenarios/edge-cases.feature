# language: fr
Fonctionnalité: Cas Limites et Boucles Détectées
  En tant que développeur
  Je veux documenter les cas limites problématiques
  Afin de corriger les boucles infinies et comportements incohérents

  # ============================================================================
  # SCÉNARIO RÉSOLU: Propriétés explorable/collectable sont maintenant obligatoires
  # ============================================================================
  # RÉSOLU: undefined values ont causé des bugs. Maintenant toutes les tuiles
  # ont explorable: boolean et collectable: boolean (non-optionnels)
  
  Scénario: Vérification que toutes les tuiles ont explorable/collectable définis
    Étant donné que la grille est initialisée
    Quand toutes les tuiles sont vérifiées
    Alors chaque tuile a:
      | propriété   | type   |
      | explorable  | bool   |
      | collectable | bool   |
    Et aucune tuile n'a explorable=undefined
    Et aucune tuile n'a collectable=undefined
    Et TypeScript force ces propriétés (non-optionnelles)
    Et les checks sont simplifiés: `if (!tile.explorable)` au lieu de `if (tile.explorable === false)`

  # ============================================================================
  # SCÉNARIO RÉSOLU: Filtrage des tuiles non-explorable
  # ============================================================================
  # RÉSOLU: Les guards utilisent maintenant les propriétés explicites
  
  Scénario: Filtrage des tuiles explorable=false dans l'exploration
    Étant donné que la grille contient:
      | coord | type     | explorable | collectable |
      | 5,5   | resource | true       | true        |
      | 6,6   | fuel     | false      | false       |
      | 7,7   | repair   | false      | false       |
      | 8,8   | depart   | false      | false       |
    Quand hasUnexploredTilesInRadius est évalué
    Alors seule la tuile "5,5" est considérée comme explorable
    Et le check utilise: `if (!tile.explorable) continue;`
    Et les tuiles fuel, repair, depart sont automatiquement exclues

  Scénario: Filtrage des tuiles collectable=false dans la collecte
    Étant donné que memory.knownTiles contient:
      | coord | type     | collectable | resources.total | explored |
      | 5,5   | resource | true        | 150             | true     |
      | 6,6   | danger   | false       | 0               | true     |
      | 7,7   | empty    | false       | 0               | true     |
    Quand shouldCollect est évalué
    Alors seule la tuile "5,5" est candidate
    Et le check utilise: `if (!tile.collectable) continue;`
    Et les tuiles danger et empty sont automatiquement exclues

  # ============================================================================
  # SCÉNARIO RÉSOLU: Danger damage appliqué correctement
  # ============================================================================
  # RÉSOLU: Tuiles danger avec collectable=false ne peuvent pas être collectées
  # mais appliquent des dégâts quand le ship y passe
  
  Scénario: Ship atteint tuile danger - dégâts appliqués correctement
    Étant donné que ship.targetVehicleTile est de type "danger"
    Et que targetVehicleTile.collectable = false
    Et que vehicle.damage = 20
    Quand le guard shouldApplyDangerDamage est évalué
    Alors le guard retourne true (type=danger OU isDynamicDanger=true)
    Quand l'action assignDangerDamageContext est exécutée
    Alors vehicle.damage = 20 + 10 = 30
    Et le cap 100% est respecté: Math.min(100, damage + 10)

  # ============================================================================
  # SCÉNARIO RÉSOLU: Double collecte sur tuile déjà vidée
  # ============================================================================
  # ✅ RÉSOLU (session 2026-01-06): Le guard hasMoreCollectibleTiles exclut maintenant
  # la tuile courante (targetVehicleTile) de la recherche pour éviter de re-sélectionner
  # une tuile qui vient d'être vidée. De plus, noMoreCollectibleTiles transite vers
  # evaluating au lieu de ship_moving_to_tile.
  
  Scénario: Double collecte sur tuile déjà vidée (RÉSOLU)
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que targetVehicleTile = "2,4" avec resources.total = 429
    Et que targetVehicleTile.collectable = true
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors les ressources sont collectées avec succès
    Et la tuile "2,4" a maintenant resources.total = 0
    Et tileCollectedFlag = true
    # ✅ FIX: Le guard hasMoreCollectibleTiles exclut la tuile courante
    # ✅ FIX: noMoreCollectibleTiles transite vers evaluating, pas ship_moving_to_tile
    Et le FSM transite vers "evaluating" (via guard noMoreCollectibleTiles)
    Et aucune tentative de re-collecte sur tuile vide

  Scénario: Comportement attendu après collecte complète
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que targetVehicleTile = "2,4" avec resources.total = 429
    Et que targetVehicleTile.collectable = true
    Et que memory.knownTiles ne contient QUE cette tuile avec ressources
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors les ressources sont collectées avec succès
    Et memory.knownTiles["2,4"].collected = true
    Et memory.knownTiles["2,4"].resources.total = 0
    Et memory.knownTiles["2,4"].collectable = true (inchangé)
    Quand le guard noMoreCollectibleTiles est évalué
    Alors le guard retourne true (aucune tuile avec resources.total > 0 ET collected = false)
    Et le FSM transite vers "evaluating"

  # ============================================================================
  # SCÉNARIO RÉSOLU: Tuiles de départ exclues correctement
  # ============================================================================
  
  Scénario: Exclusion de la tuile de départ de l'exploration
    Étant donné que baseTile.coord = "3,3" avec type = "depart"
    Et que baseTile.explorable = false
    Et que baseTile.collectable = false
    Et que explorationQueue contient ["3,3", "3,4", "4,3"]
    Quand assignDroneDeployingContext est appelée
    Alors la tuile "3,3" est EXCLUE via: `if (!tile.explorable) continue;`
    Et le drone est envoyé vers "3,4"
    Et aucun code spécial n'est nécessaire pour exclure le départ

  Scénario: La tuile de départ ne peut jamais être collectée
    Étant donné que baseTile.coord = "3,3" avec type = "depart"
    Et que baseTile.collectable = false
    Et que baseTile.resources = {food: 0, debris: 0, special: 0, total: 0}
    Quand le guard hasCollectibleTiles est évalué
    Alors le filter utilise: `tile?.collectable && tile?.resources?.total > 0`
    Et la tuile "3,3" est automatiquement exclue (collectable = false)
    Et aucun check spécial n'est nécessaire

  # ============================================================================
  # SCÉNARIO RÉSOLU: Blocage dans ship_moving_to_tile sans target
  # ============================================================================
  # ✅ RÉSOLU (session 2026-01-06): La machine FSM a maintenant une transition fallback
  # dans SHIP_REACHES_TILE qui retourne à evaluating si canCollectTile retourne false.
  # De plus, assignShipMovingToTileContext valide la cible avant de l'assigner.
  
  Scénario: Blocage ship_moving_to_tile sans cible (RÉSOLU)
    Étant donné que le FSM est en état "collecting.ship_moving_to_tile"
    Et que targetVehicleTile était "2,3" mais maintenant null (après sync)
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le guard canCollectTile retourne false (pas de cible)
    Et le fallback transite vers "evaluating" (Priority 3 dans la machine)
    Et le cycle peut continuer normalement

  # ============================================================================
  # SCÉNARIO RÉSOLU: Blocage dans drone_deploying sans target
  # ============================================================================
  
  Scénario: Blocage drone_deploying sans cible (RÉSOLU)
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que assignDroneDeployingContext a retourné targetTile = "unknown"
    Et que le guard hasUnexploredTilesInRadius retourne false
    Et que toutes les tuiles dans exploringRadius ont explorable=false OU explored=true
    Quand le tracker détecte l'absence de targetDroneTile valide
    Alors le tracker envoie l'événement NO_TARGET_FOUND après 100ms
    Et le log "⚠️  No valid target tile → sending NO_TARGET_FOUND" est émis
    Et le FSM transite vers "maintaining.relocating"

  # ============================================================================
  # SCÉNARIO RÉSOLU: Blocage dans evaluating (race condition guards)
  # ============================================================================
  # ✅ RÉSOLU (session 2026-01-06): Unification des guards d'exploration.
  # canStartExploring délègue maintenant à hasUnexploredTilesInRadius (source unique).
  # Un fallback "always → relocating" reste en sécurité si aucune action n'est possible.
  
  Scénario: Blocage dans evaluating par race condition (RÉSOLU)
    Étant donné que le FSM est en état "evaluating"
    Et que canStartExploring utilisait context.gridInfo.tiles (snapshot)
    Et que hasUnexploredTilesInRadius utilisait TileStore (état live)
    Et qu'un danger dynamique modifie TileStore entre les deux évaluations
    # AVANT: Les deux guards pouvaient diverger → boucle infinie NEED_EXPLORING
    # APRÈS: canStartExploring délègue à hasUnexploredTilesInRadius (source unique)
    Quand l'événement NEED_EXPLORING est reçu
    Alors canStartExploring vérifie hasUnexploredTilesInRadius en interne
    Et une seule source de vérité (TileStore + memory.knownTiles) est utilisée
    Et aucune race condition n'est possible
    
  Scénario: Fallback isStuckInEvaluating comme filet de sécurité
    Étant donné que le FSM est en état "evaluating"
    Et que canStartExploring retourne false
    Et que shouldCollect retourne false
    Et que shouldMaintain retourne false
    Quand la transition "always" est évaluée
    Alors le guard isStuckInEvaluating retourne true
    Et le FSM transite vers "maintaining.relocating"
    Et le cycle continue (pas de blocage)
