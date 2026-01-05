# language: fr
Fonctionnalité: Maintenance
  En tant que bot autonome
  Je veux gérer ma maintenance automatiquement
  Afin de déposer des ressources, refaire le plein et réparer les dégâts

  Contexte:
    Étant donné que le bot est initialisé
    Et que le FSM est en état "evaluating"

  Scénario: Dépôt de ressources à la base
    Étant donné que vehicle est à la base
    Et que vehicle.resources = {food: 800, debris: 850, special: 0, total: 1650}
    Et que score.resources.total = 0
    Et que le FSM est en état "maintaining"
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining.depositing"
    Quand l'événement SHIP_DEPOSIT_COMPLETE est reçu
    Alors vehicle.resources = {food: 0, debris: 0, special: 0, total: 0}
    Et score.resources.food augmente de 800
    Et score.resources.debris augmente de 850
    Et score.resources.total = 1650
    Et le FSM transite vers l'état de maintenance suivant ou "evaluating"

  Scénario: Refuel du véhicule
    Étant donné que vehicle.fuel = 25
    Et que le guard needsRefuel retourne true (25 < 30)
    Et que le FSM est en état "maintaining"
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining.refueling"
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Et le guard needsRefuel retourne false
    Et le FSM transite vers l'état de maintenance suivant ou "evaluating"

  Scénario: Réparation du véhicule
    Étant donné que vehicle.damage = 75
    Et que le guard needsRepair retourne true (75 > 50)
    Et que le FSM est en état "maintaining"
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining.repairing"
    Quand l'événement SHIP_REPAIR_COMPLETE est reçu
    Alors vehicle.damage = 0
    Et le guard needsRepair retourne false
    Et le FSM transite vers l'état de maintenance suivant ou "evaluating"

  Scénario: Maintenance complète automatique
    Étant donné que vehicle.resources.total = 1650
    Et que vehicle.fuel = 25
    Et que vehicle.damage = 60
    Et que le FSM est en état "evaluating"
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    
    # Phase 1: Dépôt
    Alors le FSM transite vers "maintaining.depositing"
    Quand l'événement SHIP_DEPOSIT_COMPLETE est reçu
    Alors vehicle.resources.total = 0
    Et le guard needsDeposit retourne false
    
    # Phase 2: Refuel
    Alors le FSM transite vers "maintaining.refueling"
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Et le guard needsRefuel retourne false
    
    # Phase 3: Repair
    Alors le FSM transite vers "maintaining.repairing"
    Quand l'événement SHIP_REPAIR_COMPLETE est reçu
    Alors vehicle.damage = 0
    Et le guard needsRepair retourne false
    
    # Completion automatique
    Quand le guard maintenanceComplete est évalué
    Alors le guard retourne true
    Et le FSM transite automatiquement vers "evaluating"

  Scénario: Maintenance partielle - Seulement refuel
    Étant donné que vehicle.fuel = 20
    Et que vehicle.damage = 30
    Et que vehicle.resources.total = 50
    Et que le FSM est en état "evaluating"
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    
    # Seulement needsRefuel = true (autres guards false)
    Alors le FSM transite vers "maintaining.refueling"
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Quand le guard maintenanceComplete est évalué
    Alors le guard retourne true (needsDeposit=false, needsRepair=false, needsRefuel=false)
    Et le FSM transite automatiquement vers "evaluating"

  Plan du Scénario: Validation du guard needsRefuel
    Étant donné que vehicle.fuel = <fuel>
    Quand le guard needsRefuel est évalué
    Alors le guard retourne <result>

    Exemples:
      | fuel | result | commentaire                    |
      | 0    | true   | Fuel vide                      |
      | 10   | true   | Fuel très bas                  |
      | 29   | true   | Juste en-dessous du seuil      |
      | 30   | false  | Au seuil (n'active pas)        |
      | 50   | false  | Fuel moyen                     |
      | 100  | false  | Fuel plein                     |

  Plan du Scénario: Validation du guard needsRepair
    Étant donné que vehicle.damage = <damage>
    Quand le guard needsRepair est évalué
    Alors le guard retourne <result>

    Exemples:
      | damage | result | commentaire                    |
      | 0      | false  | Pas de dégâts                  |
      | 25     | false  | Dégâts légers                  |
      | 50     | false  | Au seuil (n'active pas)        |
      | 51     | true   | Juste au-dessus du seuil       |
      | 75     | true   | Dégâts importants              |
      | 100    | true   | Dégâts critiques               |

  Plan du Scénario: Validation du guard needsDeposit
    Étant donné que vehicle.resources.total = <total>
    Quand le guard needsDeposit est évalué
    Alors le guard retourne <result>

    Exemples:
      | total | result | commentaire                    |
      | 0     | false  | Pas de ressources              |
      | 50    | false  | Peu de ressources              |
      | 100   | false  | Au seuil (n'active pas)        |
      | 101   | true   | Juste au-dessus du seuil       |
      | 500   | true   | Beaucoup de ressources         |
      | 1650  | true   | Inventaire presque plein       |

  Scénario: Priorité maintenance sur exploration
    Étant donné que vehicle.fuel = 25
    Et que explorationQueue contient ["5,5"]
    Quand le cycle d'évaluation s'exécute
    Alors le guard shouldMaintain retourne true
    Et le guard shouldMaintain est évalué EN PREMIER
    Et le guard shouldExplore n'est PAS évalué
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    Et l'exploration est reportée

  Scénario: Priorité maintenance sur collection
    Étant donné que vehicle.damage = 60
    Et que availableTiles contient [tileA]
    Quand le cycle d'évaluation s'exécute
    Alors le guard shouldMaintain retourne true
    Et le guard shouldCollect n'est PAS évalué
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    Et la collection est reportée

  Plan du Scénario: Validation du guard shouldMaintain
    Étant donné que vehicle.fuel = <fuel>
    Et que vehicle.damage = <damage>
    Et que vehicle.resources.total = <resources>
    Quand le guard shouldMaintain est évalué
    Alors le guard retourne <result>

    Exemples:
      | fuel | damage | resources | result | raison               |
      | 25   | 30     | 50        | true   | needsRefuel=true     |
      | 50   | 60     | 50        | true   | needsRepair=true     |
      | 50   | 30     | 150       | true   | needsDeposit=true    |
      | 25   | 60     | 150       | true   | Les trois=true       |
      | 50   | 30     | 50        | false  | Aucun besoin         |

  Scénario: Maintenance automatique complète en moins de 2 secondes
    Étant donné que vehicle.resources.total = 1500
    Et que vehicle.fuel = 20
    Et que vehicle.damage = 70
    Et que le FSM est en état "maintaining"
    Quand les événements de maintenance sont envoyés
    Alors le FSM revient à "evaluating" en moins de 2 secondes
    Et vehicle.resources.total = 0
    Et vehicle.fuel = 100
    Et vehicle.damage = 0

  Scénario: Cycle complet maintenance après overload
    Étant donné que le ship collecte jusqu'à overload
    Et que vehicle.resources.total = 1650
    Quand le ship retourne à la base
    Et que l'événement SHIP_REACHES_BASE est reçu
    Alors le FSM transite vers "maintaining"
    Quand les maintenances s'exécutent
    Alors le dépôt se termine (resources → 0)
    Et le refuel se termine si nécessaire (fuel → 100)
    Et le repair se termine si nécessaire (damage → 0)
    Et le FSM transite vers "evaluating"
    Et le bot est prêt pour un nouveau cycle

  # ============================================================================
  # 🆕 PHASE 2: RELOCATING - Radius dynamique et Game Over
  # ============================================================================
  
  Règle: Configuration du système de radius
    Étant donné que INITIAL_EXPLORATION_RADIUS = 1
    Et que MAX_EXPLORATION_RADIUS = 3
    Et que le GameStore gère le radius partagé entre tous les bots
    Alors tous les bots démarrent avec explorationRadius = 1
    Et le radius peut être incrémenté jusqu'à 3 maximum
    Et atteindre le radius max déclenche GAME_OVER

  Scénario: Transition NO_TARGET_FOUND vers relocating
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que assignDroneDeployingContext retourne targetTile = "unknown"
    Et que toutes les tuiles locales dans radius actuel sont explorées
    Quand le tracker détecte l'absence de targetDroneTile valide
    Alors le tracker envoie l'événement NO_TARGET_FOUND après 100ms
    Et le FSM transite vers "maintaining.relocating"
    # FIX: L'action assignShipRelocatingContext N'EST PLUS sur la transition
    # Elle est uniquement dans l'entry du state relocating

  Scénario: PHASE 2 - Incrémentation du radius (radius < 3)
    Étant donné que le FSM transite vers "maintaining.relocating"
    Et que GameStore.explorationRadius = 1
    Et que MAX_EXPLORATION_RADIUS = 3
    Quand l'action assignShipRelocatingContext est exécutée (entry action)
    Alors GameStore.incrementRadius() est appelé
    Et explorationRadius passe de 1 à 2
    Et les pénalités sont appliquées:
      | Pénalité           | Calcul                          |
      | Score              | score.resources ÷ 2             |
      | Damage             | vehicle.damage + 30%            |
    Et context.config.exploringRadius = 2 (sync avec GameStore)
    Et les logs suivants sont émis:
      | Log                                                   |
      | 🔄 [bot-X] RELOCATING - Checking radius expansion   |
      | 🔄 [bot-X] Current radius: 1, Max: 3                 |
      | 🔄 [RadiusSlice] bot-X increased exploration radius: 1 → 2 |
      | 💥 [bot-X] PENALTIES APPLIED:                        |
      |    - Score: XXXX → YYYY (÷2)                         |
      |    - Damage: XX% → YY% (+30%)                        |
      |    - Radius: 1 → 2                                   |
    Quand le tracker envoie RELOCATING_COMPLETE après 500ms
    Et le guard canIncreaseRadius retourne true (radius 2 < 3)
    Alors le FSM transite vers "evaluating"
    Et le bot continue l'exploration avec le nouveau radius

  Scénario: PHASE 2 - Game Over (radius = 3)
    Étant donné que le FSM transite vers "maintaining.relocating"
    Et que GameStore.explorationRadius = 3
    Et que MAX_EXPLORATION_RADIUS = 3
    Quand l'action assignShipRelocatingContext est exécutée
    Alors le guard isAtMaxRadius retourne true
    Et aucun incrementRadius() n'est appelé
    Et les logs suivants sont émis:
      | Log                                                   |
      | 🔄 [bot-X] RELOCATING - Checking radius expansion   |
      | 🔄 [bot-X] Current radius: 3, Max: 3                 |
      | 🏁 [bot-X] MAX RADIUS REACHED - GAME OVER incoming  |
      | 🏁 [bot-X] Final Score: XXXX                         |
    Et context.lastAction = 'game_over_pending'
    Quand le tracker envoie RELOCATING_COMPLETE après 500ms
    Et le guard isAtMaxRadius retourne true (priorité 1)
    Alors le FSM transite vers "game_over" (état final)
    Et le status du bot devient "done"
    Et les logs finaux sont émis:
      | Log                                                   |
      | 🏁🏁🏁 [bot-X] ====================================== |
      | 🏁 [bot-X] GAME OVER - Maximum radius reached!       |
      | 🏁 [bot-X] Final Score: XXXX                         |
      | 🏁 [bot-X] Exploration Radius: MAX (3)               |
      | 🏁 [bot-X] Vehicle Damage: XX%                       |
      | 🏁 [bot-X] Tiles Explored: XX                        |

  Scénario: Option A - État relocating visible avec délai 500ms
    Étant donné que le FSM entre dans "maintaining.relocating"
    Quand assignShipRelocatingContext est exécuté (entry)
    Et onShipRelocatingEntry est exécuté (entry effect)
    Alors le tracker détecte l'état relocating
    Et schedule RELOCATING_COMPLETE dans 500ms
    Et pendant ces 500ms:
      - L'état {"maintaining":"relocating"} est visible dans les logs FSM
      - Le counter UI peut incrémenter
      - Les outils de debug peuvent observer l'état
    Quand les 500ms sont écoulés
    Alors l'événement RELOCATING_COMPLETE est envoyé
    Et les guards isAtMaxRadius/canIncreaseRadius sont évalués
    Et la transition appropriée est déclenchée

  Scénario: Progression radius par étapes (1 → 2 → 3)
    Étant donné que le bot démarre avec explorationRadius = 1
    
    # Première relocation
    Quand toutes les tuiles radius=1 sont explorées
    Et le FSM entre dans "maintaining.relocating"
    Alors explorationRadius passe à 2
    Et le FSM retourne à "evaluating"
    
    # Deuxième relocation
    Quand toutes les tuiles radius=2 sont explorées
    Et le FSM entre dans "maintaining.relocating"
    Alors explorationRadius passe à 3
    Et le FSM retourne à "evaluating"
    
    # Troisième relocation = GAME OVER
    Quand toutes les tuiles radius=3 sont explorées
    Et le FSM entre dans "maintaining.relocating"
    Alors isAtMaxRadius = true
    Et le FSM transite vers "game_over"
    Et le bot termine sa partie

  Scénario: FIX - Une seule exécution de assignShipRelocatingContext
    Étant donné que le FSM reçoit NO_TARGET_FOUND
    Quand la transition vers "maintaining.relocating" est déclenchée
    Alors assignShipRelocatingContext est exécuté UNE SEULE FOIS (entry)
    Et incrementRadius() est appelé UNE SEULE FOIS
    Et le radius n'augmente QUE de 1 (par exemple 1→2, pas 1→3)
    # AVANT LE FIX: L'action était sur la transition ET dans l'entry = 2 exécutions
    # APRÈS LE FIX: L'action est uniquement dans l'entry = 1 exécution

  Scénario: Multi-bot convergence vers game_over
    Étant donné que bot-0 et bot-1 explorent indépendamment
    Et que les deux bots partagent le même explorationRadius via GameStore
    Quand bot-0 incrémente le radius de 1 à 2
    Alors bot-1 voit aussi explorationRadius = 2
    Quand bot-1 incrémente le radius de 2 à 3
    Alors bot-0 voit aussi explorationRadius = 3
    Quand bot-0 atteint l'état "maintaining.relocating" avec radius=3
    Alors bot-0 transite vers "game_over"
    Quand bot-1 atteint l'état "maintaining.relocating" avec radius=3
    Alors bot-1 transite vers "game_over"
    Et les deux bots sont en état final "game_over"

  Plan du Scénario: Calcul des pénalités de relocation
    Étant donné que score.resources.total = <scoreAvant>
    Et que vehicle.damage = <damageAvant>
    Quand le bot entre dans "maintaining.relocating"
    Et le radius est incrémenté
    Alors score.resources.total = <scoreApres>
    Et vehicle.damage = <damageApres>

    Exemples:
      | scoreAvant | damageAvant | scoreApres | damageApres | commentaire           |
      | 1000       | 0           | 500        | 30          | Pénalités standards   |
      | 2500       | 20          | 1250       | 50          | Damage cumulatif      |
      | 0          | 0           | 0          | 30          | Pas de score          |
      | 1440       | 0           | 720        | 30          | Score impair (÷2)     |
      | 500        | 80          | 250        | 100         | Damage plafonné à 100 |
