# ============================================================================
# INITIALIZATION FAIRNESS - Règles d'équité pour le démarrage multi-bot
# ============================================================================
#
# Ce fichier définit les règles garantissant des conditions de départ équitables
# pour tous les bots dans une partie multi-joueurs.
#
# Version: 1.0.0
# Date: 2026-01-08

@initialization @fairness @multi-bot
Feature: Fair Multi-Bot Initialization
  As a game system
  I want to ensure fair starting conditions for all bots
  So that no bot has an unfair advantage at game start

  Background:
    Given gridRadius = 3
    And botCount = 2
    And seed is provided for deterministic generation

  # ============================================================================
  # RÈGLE 1: DISTANCE DE SPAWN
  # ============================================================================
  # Les tuiles de départ doivent être séparées d'une distance minimum
  # pour garantir des territoires initiaux équitables
  
  @spawn-distance
  Rule: Starting tiles must be separated by minimum distance
    Minimum distance = radius × 1.5 (soit 4.5 tuiles pour radius=3)
    
    Scenario: Valid spawn distance between two bots
      Given bot-0 starting tile at coord "3,5"
      And bot-1 starting tile at coord "8,6"
      When system calculates hex distance between spawns
      Then hexDistance >= radius * 1.5
      And spawn positions are accepted

    Scenario: Invalid spawn distance - too close
      Given bot-0 starting tile at coord "5,5"
      And bot-1 starting tile at coord "5,6"
      When system calculates hex distance between spawns
      Then hexDistance < radius * 1.5
      And spawn positions are rejected
      And system regenerates spawn positions with seed + 1

    Scenario: Spawn distance validation with regeneration loop
      Given maximum regeneration attempts = 10
      When system attempts to place starting tiles
      Then for each attempt:
        | attempt | action                                    |
        | 1-10    | validate distance, retry with seed+N if fail |
        | >10     | relax constraints by 10% and retry        |

  # ============================================================================
  # RÈGLE 2: DENSITÉ DE RESSOURCES
  # ============================================================================
  # La somme des ressources autour de chaque spawn doit être équilibrée
  # pour éviter qu'un bot démarre près d'un cluster riche
  
  @resource-density
  Rule: Resource density around spawns must be balanced within 30%
    Radius de calcul = 1 tuile (voisins immédiats uniquement)
    Différence maximum = 30%
    
    Scenario: Balanced resource density
      Given bot-0 spawn with neighbors total resources = 5000
      And bot-1 spawn with neighbors total resources = 4500
      When system calculates resource density difference
      Then difference = |5000 - 4500| / max(5000, 4500) = 10%
      And difference <= 30%
      And resource balance is accepted

    Scenario: Unbalanced resource density - rejected
      Given bot-0 spawn with neighbors total resources = 8000
      And bot-1 spawn with neighbors total resources = 3000
      When system calculates resource density difference  
      Then difference = |8000 - 3000| / max(8000, 3000) = 62.5%
      And difference > 30%
      And spawn positions are rejected
      And system regenerates spawn positions

    Scenario: Resource calculation includes all neighbor tiles
      Given spawn tile at coord "5,5"
      When system calculates neighbor resources in radius 1
      Then system sums resources from all 6 hex neighbors
      And total = sum(neighbor.resources.food + neighbor.resources.debris + neighbor.resources.special)
      And excludes non-resource tiles (stations, obstacles, danger)

  # ============================================================================
  # RÈGLE 3: ACCÈS AUX STATIONS
  # ============================================================================
  # Chaque bot doit avoir un accès équivalent aux stations fuel et repair
  # Distance pathfinding ±1 tuile vers la station la plus proche
  
  @station-access
  Rule: Station access must be equidistant (±1 tile) for all bots
    Stations are placed AFTER starting tiles are validated
    Each bot should have similar pathfinding distance to nearest fuel and repair
    
    Scenario: Equal station access
      Given bot-0 spawn with nearest fuel at distance 3
      And bot-1 spawn with nearest fuel at distance 4
      When system validates station access
      Then fuel distance difference = |3 - 4| = 1
      And difference <= 1 tile
      And station placement is accepted

    Scenario: Strategic station placement
      Given validated spawn positions for bot-0 and bot-1
      When system places fuel and repair stations
      Then stations are placed at similar pathfinding distance from both spawns
      And avoids placing stations adjacent to any spawn (min distance = 2)
      
    Scenario: Station placement chronology
      Given empty tile grid
      When system initializes game grid
      Then placement order is:
        | step | action                                           |
        | 1    | Generate base resource tiles                     |
        | 2    | Place and validate starting tiles (fairness)     |
        | 3    | Place empty tiles (avoiding spawn radius 1)      |
        | 4    | Place obstacle tiles (avoiding spawn radius 1)   |
        | 5    | Place danger tiles (avoiding spawn radius 1)     |
        | 6    | Place stations (strategic equidistant placement) |

  # ============================================================================
  # RÈGLE 4: ÉQUITÉ DU TERRAIN
  # ============================================================================
  # Le pourcentage de tuiles walkables autour de chaque spawn doit être similaire
  # pour éviter qu'un bot soit encerclé d'obstacles
  
  @terrain-fairness
  Rule: Walkable terrain percentage must be similar (±15%) around spawns
    Radius de calcul = 2 tuiles
    Différence maximum = 15%
    
    Scenario: Balanced terrain
      Given bot-0 spawn with 85% walkable tiles in radius 2
      And bot-1 spawn with 78% walkable tiles in radius 2
      When system validates terrain fairness
      Then walkability difference = |85 - 78| = 7%
      And difference <= 15%
      And terrain is accepted

    Scenario: Unbalanced terrain - too many obstacles near one spawn
      Given bot-0 spawn with 90% walkable tiles in radius 2
      And bot-1 spawn with 60% walkable tiles in radius 2
      When system validates terrain fairness
      Then walkability difference = |90 - 60| = 30%
      And difference > 15%
      And spawn positions are rejected

  # ============================================================================
  # RÈGLE 5: DÉTERMINISME PAR SEED
  # ============================================================================
  # Un seed fixe garantit la reproductibilité de la génération
  # pour les tests, debug, et tournois équitables
  
  @seeding @determinism
  Rule: Same seed produces identical map generation
    Seed is stored in GameStore for replay capability
    All random operations use seeded pseudo-random generator
    
    Scenario: Deterministic map generation
      Given seed = 12345
      When system generates map twice with same seed
      Then both maps are identical:
        | property           | match |
        | tile positions     | exact |
        | tile types         | exact |
        | resource values    | exact |
        | station positions  | exact |
        | starting positions | exact |
        | danger positions   | exact |

    Scenario: Seed storage and retrieval
      Given new game initialization
      When system generates seed
      Then seed = Date.now() or user-provided value
      And seed is stored in GameStore.mapSeed
      And seed is logged for debugging

    Scenario: Seed increment on regeneration
      Given initial seed = 42
      And first spawn attempt fails fairness validation
      When system regenerates
      Then new seed = 43
      And all generation functions use incremented seed

  # ============================================================================
  # VALIDATION ORCHESTRATION
  # ============================================================================
  
  @validation @orchestration
  Rule: Master validation checks all fairness rules
    validateMapFairness() returns comprehensive metrics
    
    Scenario: Full fairness validation pass
      Given generated map with spawns
      When system runs validateMapFairness()
      Then validation returns:
        | metric              | value   | threshold | status |
        | spawnDistance       | 5.2     | >= 4.5    | PASS   |
        | resourceDifference  | 18%     | <= 30%    | PASS   |
        | fuelAccessDiff      | 1 tile  | <= 1      | PASS   |
        | repairAccessDiff    | 0 tiles | <= 1      | PASS   |
        | terrainDifference   | 8%      | <= 15%    | PASS   |
      And overall result = VALID

    Scenario: Fairness validation failure with specific issue
      Given generated map with spawns
      When system runs validateMapFairness()
      And resourceDifference = 45%
      Then validation returns:
        | metric              | value | threshold | status |
        | resourceDifference  | 45%   | <= 30%    | FAIL   |
      And overall result = INVALID
      And issues = ["Resource density imbalance: 45% > 30% threshold"]

    Scenario: Regeneration loop with metrics logging
      Given maximum attempts = 10
      When system attempts map generation
      Then for each attempt:
        | attempt | seed  | action                     | log                          |
        | 1       | S     | validate all rules         | "Attempt 1: checking..."     |
        | N       | S+N-1 | validate if previous fail  | "Attempt N: resource fail"   |
        | success | S+K   | accept map                 | "Map valid after K attempts" |
