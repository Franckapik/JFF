# language: fr
Fonctionnalité: Collection de Ressources
  En tant que bot autonome
  Je veux collecter des ressources découvertes
  Afin d'optimiser la collecte et de ramener les ressources à la base

  Contexte:
    Étant donné que le bot est initialisé
    Et que le FSM est en état "evaluating"

  Scénario: Collection simple d'une tuile
    Étant donné que availableTiles contient [tileA]
    Et que tileA.resources = {food: 100, debris: 50, special: 0, total: 150}
    Et que vehicle.resources.total = 75
    Et que vehicle.fuel = 60
    Et que vehicle.damage = 20
    Quand le guard shouldCollect est évalué
    Alors le guard retourne true
    Quand l'événement NEED_COLLECTING est reçu
    Alors le FSM transite vers "collecting.ship_moving_to_tile"
    Et ship.visualState devient "moving"
    Et ship.targetVehicleTile = tileA
    
  Scénario: Chargement de ressources depuis une tuile
    Étant donné que ship est en état "collecting.ship_collecting"
    Et que ship est à targetVehicleTile
    Et que vehicle.resources.total = 75
    Et que vehicle.fuel = 60
    Quand l'événement SHIP_LOAD_RESOURCES est reçu avec amount={food: 100, debris: 50, special: 0}
    Alors vehicle.resources.food augmente de 100
    Et vehicle.resources.debris augmente de 50
    Et vehicle.resources.total = 75 + 150 = 225
    Et vehicle.fuel diminue de 1% (60 → 59)
    Et memory.stats.tilesCollected s'incrémente de 1

  Scénario: Détection de surcharge après collection
    Étant donné que vehicle.resources.total = 1550
    Et que vehicle.maxCapacity.total = 2003
    Et que le seuil d'overload = 80% * 2003 = 1602.4
    Quand l'événement SHIP_LOAD_RESOURCES est reçu avec amount={food: 300, debris: 400}
    Alors vehicle.resources.total = 1550 + 700 = 2250
    Quand le guard isVehicleOverloaded est évalué
    Alors le guard retourne true (2250 >= 1602.4)
    Et le FSM transite automatiquement vers "collecting.ship_returning"
    Et ship.visualState devient "returning"

  Scénario: Collection multiple de tuiles sans surcharge
    Étant donné que availableTiles contient [tileA, tileB, tileC]
    Et que vehicle.resources.total = 100
    Et que vehicle.maxCapacity.total = 2003
    
    # Première collection
    Quand le ship collecte tileA (amount={food: 300, debris: 400})
    Alors vehicle.resources.total = 800
    Et le guard hasMoreCollectibleTiles retourne true
    Et le FSM transite vers "collecting.ship_moving_to_tile"
    
    # Deuxième collection
    Quand le ship collecte tileB (amount={food: 300, debris: 400})
    Alors vehicle.resources.total = 1500
    Et le guard hasMoreCollectibleTiles retourne false (1500 proche de 1602.4)
    Et le FSM transite vers "collecting.ship_returning"

  Scénario: Retour à la base quand overload
    Étant donné que ship est en état "collecting.ship_returning"
    Et que vehicle.resources.total = 1650
    Quand l'événement SHIP_REACHES_BASE est reçu
    Alors le FSM transite vers "maintaining"
    Et le ship est prêt pour le dépôt

  Scénario: Collection bloquée par surcharge existante
    Étant donné que vehicle.resources.total = 1650
    Et que availableTiles contient [tileA]
    Quand le guard shouldCollect est évalué
    Alors le guard isVehicleOverloaded retourne true
    Et le guard shouldCollect retourne false
    Et le FSM ne transite PAS vers "collecting"
    Et le FSM reste en "evaluating"

  Scénario: Collection bloquée par fuel bas
    Étant donné que vehicle.fuel = 15
    Et que availableTiles contient [tileA]
    Quand le guard shouldCollect est évalué
    Alors le guard retourne false (fuel <= 20)
    Et le FSM reste en "evaluating"

  Scénario: Collection bloquée par damage élevé
    Étant donné que vehicle.damage = 75
    Et que availableTiles contient [tileA]
    Quand le guard shouldCollect est évalué
    Alors le guard retourne false (damage >= 70)
    Et le FSM reste en "evaluating"

  Plan du Scénario: Validation du guard isVehicleOverloaded
    Étant donné que vehicle.maxCapacity.total = <maxCapacity>
    Et que vehicle.resources.total = <resources>
    Quand le guard isVehicleOverloaded est évalué
    Alors le threshold calculé = <threshold>
    Et le guard retourne <result>

    Exemples:
      | maxCapacity | resources | threshold | result | commentaire                 |
      | 2003        | 1600      | 1602.4    | false  | En-dessous du seuil         |
      | 2003        | 1602      | 1602.4    | false  | Juste en-dessous            |
      | 2003        | 1603      | 1602.4    | true   | Juste au-dessus             |
      | 2003        | 2000      | 1602.4    | true   | Largement au-dessus         |
      | 1000        | 799       | 800.0     | false  | En-dessous                  |
      | 1000        | 800       | 800.0     | true   | Exactement au seuil         |
      | 1000        | 801       | 800.0     | true   | Au-dessus                   |

  Plan du Scénario: Validation du guard hasMoreCollectibleTiles
    Étant donné que vehicle.resources.total = <resources>
    Et que vehicle.maxCapacity.total = 2003
    Et que availableTiles.length = <tilesCount>
    Quand le guard hasMoreCollectibleTiles est évalué
    Alors le guard retourne <result>

    Exemples:
      | resources | tilesCount | result | raison                          |
      | 1700      | 5          | false  | Overload priority               |
      | 1000      | 0          | false  | Pas de tuiles disponibles       |
      | 1000      | 1          | false  | Dernière tuile (length <= 1)    |
      | 1000      | 2          | true   | Plusieurs tuiles, pas overload  |
      | 1000      | 5          | true   | Beaucoup de tuiles disponibles  |

  Scénario: Consommation fuel progressive pendant collection
    Étant donné que vehicle.fuel = 50
    Et que vehicle.resources.total = 100
    
    # Collection 1
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors vehicle.fuel = 49 (50 - 1)
    
    # Collection 2
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors vehicle.fuel = 48 (49 - 1)
    
    # Collection 3
    Quand l'événement SHIP_LOAD_RESOURCES est reçu
    Alors vehicle.fuel = 47 (48 - 1)
    
    Et la consommation fuel totale = 3%

  Scénario: Performance - Collection de 50 tuiles
    Étant donné que availableTiles contient 50 tuiles
    Et que chaque tuile a 150 resources en moyenne
    Et que vehicle.fuel = 100
    Et que vehicle.maxCapacity.total = 2003
    Quand le bot collecte toutes les tuiles (avec dépôts intermédiaires)
    Alors le total de resources collectées >= 7500
    Et le taux de collecte >= 150 resources/tile
    Et l'efficacité fuel >= 50 resources/fuel

  Scénario: Interruption collection par EMERGENCY_STOP
    Étant donné que ship est en état "collecting.ship_collecting"
    Et que vehicle.resources.total = 500
    Quand l'événement EMERGENCY_STOP est reçu
    Alors la collection en cours est interrompue
    Et le FSM transite vers "maintaining"
    Et les resources déjà collectées sont préservées
