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
    Quand l'événement SHIP_DEPOSIT_COMPLETE est reçu
    Alors vehicle.resources = {food: 0, debris: 0, special: 0, total: 0}
    Et score.resources.food augmente de 800
    Et score.resources.debris augmente de 850
    Et score.resources.total = 1650

  Scénario: Refuel du véhicule
    Étant donné que vehicle.fuel = 25
    Et que le guard needsRefuel retourne true (25 < 30)
    Et que le FSM est en état "maintaining"
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Et le guard needsRefuel retourne false

  Scénario: Réparation du véhicule
    Étant donné que vehicle.damage = 75
    Et que le guard needsRepair retourne true (75 > 50)
    Et que le FSM est en état "maintaining"
    Quand l'événement SHIP_REPAIR_COMPLETE est reçu
    Alors vehicle.damage = 0
    Et le guard needsRepair retourne false

  Scénario: Maintenance complète automatique
    Étant donné que vehicle.resources.total = 1650
    Et que vehicle.fuel = 25
    Et que vehicle.damage = 60
    Et que le FSM est en état "maintaining"
    
    # Dépôt
    Quand l'événement SHIP_DEPOSIT_COMPLETE est reçu
    Alors vehicle.resources.total = 0
    Et le guard needsDeposit retourne false
    
    # Refuel
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Et le guard needsRefuel retourne false
    
    # Repair
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
    Et que le FSM est en état "maintaining"
    
    # Seulement needsRefuel = true
    Quand l'événement SHIP_REFUEL_COMPLETE est reçu
    Alors vehicle.fuel = 100
    Quand le guard maintenanceComplete est évalué
    Alors le guard retourne true (needsDeposit=false, needsRepair=false)
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
