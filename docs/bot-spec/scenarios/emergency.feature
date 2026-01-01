# language: fr
Fonctionnalité: Gestion d'Urgence
  En tant que bot autonome
  Je veux réagir aux situations d'urgence
  Afin de préserver mon intégrité et éviter les pannes

  Contexte:
    Étant donné que le bot est initialisé

  Scénario: EMERGENCY_STOP interrompt l'exploration
    Étant donné que le FSM est en état "exploring.drone_deploying"
    Et que drone.visualState = "deploying"
    Quand l'événement EMERGENCY_STOP est reçu avec raison="Test urgence"
    Alors l'exploration en cours est interrompue
    Et le FSM transite vers "maintaining"
    Et explorationQueue est préservée pour plus tard

  Scénario: EMERGENCY_STOP interrompt la collection
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que vehicle.resources.total = 500
    Quand l'événement EMERGENCY_STOP est reçu avec raison="Obstacle détecté"
    Alors la collection en cours est interrompue
    Et le FSM transite vers "maintaining"
    Et les resources déjà collectées sont préservées

  Scénario: LOW_FUEL_WARNING priorité maximale
    Étant donné que le FSM est en état "collecting.ship_moving_to_tile"
    Et que vehicle.fuel = 8
    Quand l'événement LOW_FUEL_WARNING est reçu
    Alors la collection en cours est interrompue
    Et le FSM transite vers "maintaining"
    Et le refuel s'exécute en priorité

  Scénario: Gestion fuel critique pendant exploration
    Étant donné que le FSM est en état "exploring.drone_scanning"
    Et que vehicle.fuel = 5
    Quand l'événement LOW_FUEL_WARNING est reçu
    Alors l'exploration en cours est terminée
    Et le drone retourne immédiatement à la base
    Et le FSM transite vers "maintaining"
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Et le bot peut reprendre ses opérations

  Scénario: EMERGENCY_STOP depuis état evaluating
    Étant donné que le FSM est en état "evaluating"
    Quand l'événement EMERGENCY_STOP est reçu
    Alors le FSM transite vers "maintaining"
    Et le bot attend instructions de maintenance

  Scénario: Multiple urgences simultanées
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que vehicle.fuel = 8
    Et que vehicle.damage = 55
    Quand l'événement LOW_FUEL_WARNING est reçu
    Alors le FSM transite vers "maintaining"
    Quand le guard shouldMaintain est évalué
    Alors needsRefuel retourne true
    Et needsRepair retourne true
    Quand les maintenances s'exécutent
    Alors le refuel ET le repair sont effectués
    Et le bot revient à un état opérationnel

  Plan du Scénario: EMERGENCY_STOP depuis tous les états
    Étant donné que le FSM est en état "<état>"
    Quand l'événement EMERGENCY_STOP est reçu
    Alors le FSM transite vers "maintaining"
    Et l'opération en cours est interrompue
    Et le contexte est préservé

    Exemples:
      | état                             |
      | evaluating                       |
      | exploring.drone_deploying        |
      | exploring.drone_scanning         |
      | exploring.drone_returning        |
      | collecting.ship_moving_to_tile   |
      | collecting.ship_collecting       |
      | collecting.ship_returning        |

  Scénario: Recovery après EMERGENCY_STOP
    Étant donné que le FSM est en état "collecting.ship_collecting"
    Et que vehicle.resources.total = 800
    Quand l'événement EMERGENCY_STOP est reçu
    Alors le FSM transite vers "maintaining"
    
    # Résolution de l'urgence
    Quand les maintenances nécessaires sont effectuées
    Et le guard maintenanceComplete retourne true
    Alors le FSM transite vers "evaluating"
    
    # Reprise des opérations
    Et vehicle.resources.total est toujours 800 (préservé)
    Et le bot peut reprendre la collection ou exploration

  Scénario: Fuel critique empêche toute opération
    Étant donné que vehicle.fuel = 5
    Et que explorationQueue contient ["5,5"]
    Et que availableTiles contient [tileA]
    Quand le cycle d'évaluation s'exécute
    Alors shouldExplore retourne false (fuel <= 10)
    Et shouldCollect retourne false (fuel <= 20)
    Et shouldMaintain retourne true (fuel < 30)
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    Et le refuel est obligatoire avant toute autre opération

  Scénario: Damage critique empêche toute opération
    Étant donné que vehicle.damage = 85
    Et que explorationQueue contient ["5,5"]
    Et que availableTiles contient [tileA]
    Quand le cycle d'évaluation s'exécute
    Alors shouldExplore retourne false (damage >= 80)
    Et shouldCollect retourne false (damage >= 70)
    Et shouldMaintain retourne true (damage > 50)
    Quand l'événement NEED_MAINTAINING est reçu
    Alors le FSM transite vers "maintaining"
    Et le repair est obligatoire avant toute autre opération

  Plan du Scénario: Validation priorités d'urgence
    Étant donné que vehicle.fuel = <fuel>
    Et que vehicle.damage = <damage>
    Quand le cycle d'évaluation s'exécute
    Alors shouldMaintain retourne <maintain>
    Et shouldCollect retourne <collect>
    Et shouldExplore retourne <explore>
    Et l'action prioritaire est <action>

    Exemples:
      | fuel | damage | maintain | collect | explore | action     | raison                    |
      | 5    | 20     | true     | false   | false   | maintain   | Fuel critique             |
      | 50   | 85     | true     | false   | false   | maintain   | Damage critique           |
      | 15   | 75     | true     | false   | false   | maintain   | Fuel ET damage critiques  |
      | 50   | 30     | false    | true    | true    | collect    | Conditions normales       |

  Scénario: Test robustesse - FSM ne crash jamais
    Étant donné que le bot est en opération normale
    Quand 100 événements EMERGENCY_STOP sont envoyés rapidement
    Alors le FSM gère tous les événements sans crash
    Et le FSM reste dans un état valide
    Et le dernier état est "maintaining"
    Et le contexte n'est pas corrompu

  Scénario: Graceful degradation - Opération en mode dégradé
    Étant donné que vehicle.fuel = 15
    Et que vehicle.damage = 60
    Quand le bot tente d'opérer
    Alors shouldExplore retourne false
    Et shouldCollect retourne false
    Et shouldMaintain retourne true
    Quand les maintenances sont effectuées
    Alors le bot revient en mode opérationnel normal
    Et shouldExplore retourne true
    Et shouldCollect retourne true
