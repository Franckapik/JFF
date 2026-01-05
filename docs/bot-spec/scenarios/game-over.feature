# language: fr
Fonctionnalité: Game Over - Fin de partie
  En tant que bot autonome
  Je veux atteindre un état final de game over
  Quand j'ai exploré toutes les tuiles disponibles dans le radius maximum

  Contexte:
    Étant donné que INITIAL_EXPLORATION_RADIUS = 1
    Et que MAX_EXPLORATION_RADIUS = 3
    Et que le GameStore gère le radius partagé

  # ============================================================================
  # PHASE 2: Radius dynamique avec Game Over
  # ============================================================================

  Scénario: Condition de Game Over - Radius maximum atteint
    Étant donné que GameStore.explorationRadius = 3
    Et que MAX_EXPLORATION_RADIUS = 3
    Et que toutes les tuiles dans radius=3 sont explorées
    Quand le FSM transite vers "maintaining.relocating"
    Et assignShipRelocatingContext est exécuté
    Alors le guard isAtMaxRadius retourne true
    Et les logs suivants sont émis:
      | Log                                                   |
      | 🏁 [bot-X] MAX RADIUS REACHED - GAME OVER incoming  |
      | 🏁 [bot-X] Final Score: XXXX                         |
    Quand RELOCATING_COMPLETE est reçu après 500ms
    Alors le FSM transite vers "game_over"
    Et le status du bot = "done"

  Scénario: État final game_over
    Étant donné que le FSM est en état "game_over"
    Alors le tracker schedule 0 événements
    Et aucune transition automatique n'existe
    Et le bot affiche ses statistiques finales:
      | Statistique          | Valeur                |
      | Score final          | score.resources.total |
      | Radius atteint       | 3 (MAX)               |
      | Damage véhicule      | vehicle.damage        |
      | Tuiles explorées     | memory.knownTiles     |
    Et les logs finaux sont émis:
      | Log                                                   |
      | 🏁🏁🏁 [bot-X] ====================================== |
      | 🏁 [bot-X] GAME OVER - Maximum radius reached!       |
      | 🏁 [bot-X] Final Score: XXXX                         |
      | 🏁 [bot-X] Exploration Radius: MAX (3)               |
      | 🏁 [bot-X] Vehicle Damage: XX%                       |
      | 🏁 [bot-X] Tiles Explored: XX                        |

  Scénario: Parcours complet jusqu'au Game Over
    Étant donné que le bot démarre avec explorationRadius = 1
    Et que le bot explore toutes les tuiles disponibles
    
    # Cycle 1: Radius = 1
    Quand toutes les tuiles radius=1 sont explorées/collectées
    Alors le FSM entre dans "maintaining.relocating"
    Et explorationRadius passe de 1 à 2
    Et pénalités appliquées: score ÷2, damage +30%
    Et le FSM retourne à "evaluating"
    
    # Cycle 2: Radius = 2
    Quand toutes les tuiles radius=2 sont explorées/collectées
    Alors le FSM entre dans "maintaining.relocating"
    Et explorationRadius passe de 2 à 3
    Et pénalités appliquées: score ÷2, damage +30% (cumulatif = 60%)
    Et le FSM retourne à "evaluating"
    
    # Cycle 3: Radius = 3 (MAX) → GAME OVER
    Quand toutes les tuiles radius=3 sont explorées/collectées
    Alors le FSM entre dans "maintaining.relocating"
    Et isAtMaxRadius = true
    Et explorationRadius reste à 3
    Après 500ms, RELOCATING_COMPLETE est envoyé
    Alors le FSM transite vers "game_over"
    Et le bot termine sa partie

  Scénario: Multi-bot - Game Over indépendant
    Étant donné que bot-0 et bot-1 explorent en parallèle
    Et que les deux bots partagent le même radius via GameStore
    
    Quand bot-0 épuise les tuiles radius=3 en premier
    Alors bot-0 transite vers "game_over"
    Et bot-0.status = "done"
    
    Quand bot-1 continue d'explorer (radius=3 déjà atteint)
    Et bot-1 épuise les tuiles radius=3
    Alors bot-1 transite vers "game_over"
    Et bot-1.status = "done"
    
    Alors les deux bots sont en état final "game_over"
    Et chaque bot affiche ses propres statistiques finales

  Scénario: Pénalités cumulatives avant Game Over
    Étant donné que score.resources.total = 10000
    Et que vehicle.damage = 0
    
    # Première relocation (radius 1→2)
    Quand assignShipRelocatingContext est appelé
    Alors score.resources.total = 5000 (÷2)
    Et vehicle.damage = 30 (+30%)
    
    # Deuxième relocation (radius 2→3)
    Quand assignShipRelocatingContext est appelé
    Alors score.resources.total = 2500 (÷2 encore)
    Et vehicle.damage = 60 (+30% encore = 30 + 30)
    
    # Game Over (radius = 3)
    Quand assignShipRelocatingContext détecte isAtMaxRadius
    Alors aucune pénalité supplémentaire n'est appliquée
    Et score final = 2500
    Et damage final = 60%

  Scénario: Validation guard isAtMaxRadius
    Étant donné que MAX_EXPLORATION_RADIUS = 3
    
    Quand GameStore.explorationRadius = 1
    Alors isAtMaxRadius({ context: botContext }) retourne false
    Et les logs montrent: "🔍 [isAtMaxRadius] bot-X: radius=1, max=3, result=false"
    
    Quand GameStore.explorationRadius = 2
    Alors isAtMaxRadius({ context: botContext }) retourne false
    Et les logs montrent: "🔍 [isAtMaxRadius] bot-X: radius=2, max=3, result=false"
    
    Quand GameStore.explorationRadius = 3
    Alors isAtMaxRadius({ context: botContext }) retourne true
    Et les logs montrent: "🔍 [isAtMaxRadius] bot-X: radius=3, max=3, result=true"

  Scénario: Validation guard canIncreaseRadius
    Étant donné que MAX_EXPLORATION_RADIUS = 3
    
    Quand GameStore.explorationRadius = 1
    Alors canIncreaseRadius({ context: botContext }) retourne true
    Et les logs montrent: "🔍 [canIncreaseRadius] bot-X: radius=1, max=3, result=true"
    
    Quand GameStore.explorationRadius = 2
    Alors canIncreaseRadius({ context: botContext }) retourne true
    Et les logs montrent: "🔍 [canIncreaseRadius] bot-X: radius=2, max=3, result=true"
    
    Quand GameStore.explorationRadius = 3
    Alors canIncreaseRadius({ context: botContext }) retourne false
    Et les logs montrent: "🔍 [canIncreaseRadius] bot-X: radius=3, max=3, result=false"

  # ============================================================================
  # Option A: Visibilité de l'état relocating avec délai 500ms
  # ============================================================================

  Scénario: Option A - RELOCATING_COMPLETE event pour visibilité UI
    Étant donné que le FSM entre dans "maintaining.relocating"
    Quand assignShipRelocatingContext s'exécute (entry)
    Alors onShipRelocatingEntry est aussi exécuté (entry effect)
    Et le tracker détecte l'état relocating
    Et schedule RELOCATING_COMPLETE dans 500ms:
      | Timestamp | Action                                    |
      | 0ms       | Entry dans relocating                     |
      | 0ms       | assignShipRelocatingContext exécuté       |
      | 0ms       | Radius incrémenté OU game_over détecté    |
      | 0ms       | Tracker schedule RELOCATING_COMPLETE      |
      | 1-499ms   | État visible: {"maintaining":"relocating"}|
      | 500ms     | RELOCATING_COMPLETE envoyé                |
      | 500ms     | Évaluation isAtMaxRadius/canIncreaseRadius|
      | 500ms     | Transition vers evaluating OU game_over   |
    
  Scénario: Délai 500ms permet observation de l'état
    Étant donné que le FSM est en "maintaining.relocating"
    Et que le délai de 500ms est en cours
    Quand un observateur externe lit l'état FSM
    Alors l'état actuel est {"maintaining":"relocating"}
    Et le counter UI peut s'incrémenter
    Et les outils de debug peuvent capturer l'état
    Et les logs montrent:
      | Log                                           |
      | 🔄 [FSM:bot-X] State: {"maintaining":"relocating"} |
      | 🔄 [TRACKER] Relocating (500ms)              |
    Après 500ms:
      | Log                                           |
      | 🤖 [TRACKER:bot-X] Sending: RELOCATING_COMPLETE |

  Scénario: RELOCATING_COMPLETE déclenche transition conditionnelle
    Étant donné que le FSM est en "maintaining.relocating"
    Et que RELOCATING_COMPLETE est reçu
    
    # Priority 1: isAtMaxRadius (game over)
    Quand isAtMaxRadius retourne true
    Alors le FSM transite vers "game_over"
    Et les logs montrent: "🏁 [bot-X] GAME OVER - Maximum radius reached!"
    
    # Priority 2: canIncreaseRadius (continuer)
    Quand isAtMaxRadius retourne false
    Et canIncreaseRadius retourne true
    Alors le FSM transite vers "evaluating"
    Et le bot continue l'exploration avec le nouveau radius

  Plan du Scénario: Séquence complète relocating → game_over
    Étant donné que explorationRadius = <radiusAvant>
    Et que toutes les tuiles sont explorées
    Quand le FSM entre dans "maintaining.relocating"
    Alors le radius devient <radiusApres>
    Et après 500ms, le FSM transite vers <etatFinal>

    Exemples:
      | radiusAvant | radiusApres | etatFinal  | commentaire                    |
      | 1           | 2           | evaluating | Première expansion             |
      | 2           | 3           | evaluating | Deuxième expansion             |
      | 3           | 3           | game_over  | Max atteint → fin de partie    |
