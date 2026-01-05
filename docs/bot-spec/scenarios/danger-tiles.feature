# language: fr
Fonctionnalité: Tuiles de Danger et Dégâts au Ship
  En tant que système de jeu
  Je veux appliquer des dégâts quand le ship rencontre une tuile danger
  Afin de pénaliser les mouvements vers des zones dangereuses

  Contexte:
    Étant donné que le bot est initialisé
    Et que le FSM est en état "evaluating"

  Scénario: Propriétés de tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Alors la tuile a les propriétés:
      | propriété   | valeur  |
      | type        | danger  |
      | explorable  | true    |
      | collectable | false   |
      | resources   | {0, 0, 0} |
      | isDynamicDanger | false (tuile statique par défaut) |

  Scénario: Drone peut explorer une tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Et que tuile "5,5" a explorable=true
    Quand le drone est déployé vers "5,5"
    Alors le drone peut explorer la tuile
    Et memory.knownTiles["5,5"].explored = true
    Et le drone n'est pas affecté par le danger
    
  Scénario: Ship ne peut pas collecter une tuile danger
    Étant donné que la tuile "5,5" est de type "danger"
    Et que tuile "5,5" a collectable=false
    Et que ship.targetVehicleTile = "5,5"
    Quand le guard canCollectTile est évalué
    Alors le guard retourne false
    Et le ship ne transition pas vers "ship_collecting"
    Et le ship reste en "ship_moving_to_tile"

  Scénario: Danger damage appliqué quand ship atteint tuile danger
    Étant donné que ship est en état "collecting.ship_moving_to_tile"
    Et que ship.targetVehicleTile est de type "danger"
    Et que vehicle.damage = 20
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true
    Et l'action assignDangerDamageContext est exécutée
    Et vehicle.damage augmente de 10% (20 → 30)
    Et ship.visualState = "docked" (retour à la base après danger)
    
  Scénario: Danger damage cumulé à 100%
    Étant donné que vehicle.damage = 95
    Et que ship.targetVehicleTile est de type "danger"
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true
    Et vehicle.damage = Math.min(100, 95 + 10) = 100
    Et vehicle.damage ne dépassse pas 100%

  Scénario: Danger dynamique se déplace et applique dégâts
    Étant donné que la tuile "5,5" contient un danger dynamique
    Et que danger.isDynamicDanger = true
    Et que danger.dangerId = "dynamic-danger-1"
    Et que vehicle.damage = 25
    Quand le danger se déplace vers "6,6"
    Et que ship.targetVehicleTile = "6,6"
    Et l'événement SHIP_REACHES_TILE est reçu
    Alors le guard shouldApplyDangerDamage retourne true (danger dynamique détecté)
    Et vehicle.damage augmente de 10% (25 → 35)
    
  Scénario: Danger dynamique n'apparaît pas sur départ
    Étant donné que la tuile "0,0" est de type "depart"
    Et que c'est la base du ship
    Quand un danger dynamique essaie de se déplacer à "0,0"
    Alors le danger est bloqué ou téléporté ailleurs
    Et ship ne reçoit pas de dégâts involontaires à la base

  Scénario: Interaction danger + maintenance
    Étant donné que vehicle.damage = 90
    Et que ship est en état "maintaining"
    Et qu'une action REPAIR est en cours
    Quand l'événement REPAIR_COMPLETE est reçu
    Alors vehicle.damage diminue de 10 points
    Et vehicle.damage = 80
    Quand un danger dynamique arrive sur la base
    Et que vehicle.damage = 80
    Et l'événement SHIP_COLLISION_WITH_DANGER est reçu
    Alors vehicle.damage = 80 + 10 = 90
    Et la réparation est interrompue

  Plan du Scénario: Validation du danger damage
    Étant donné que vehicle.damage = <initialDamage>
    Et que ship rencontre une tuile danger
    Quand l'événement SHIP_REACHES_TILE est reçu
    Alors vehicle.damage = <expectedDamage>

    Exemples:
      | initialDamage | expectedDamage | commentaire                    |
      | 0             | 10             | Aucun dégât antérieur          |
      | 10            | 20             | Cumul normal                  |
      | 50            | 60             | Dégât moyen                   |
      | 90            | 100            | Plafond à 100%                |
      | 95            | 100            | Cap atteint                   |

  Scénario: Filtre des tuiles danger dans l'exploration
    Étant donné que la grille contient:
      | coord | type     | explorable | collectable |
      | 5,5   | resource | true       | true        |
      | 6,6   | danger   | true       | false       |
      | 7,7   | empty    | true       | false       |
    Et que le drone est au centre
    Quand le guard hasUnexploredTilesInRadius est évalué
    Alors toutes les tuiles (5,5, 6,6, 7,7) sont explorables
    Et seules les tuiles 5,5 et 7,7 sont collectables (danger exclue)
