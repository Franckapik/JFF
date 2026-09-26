# language: fr
@socle @maintenance
Fonctionnalité: Services locaux et achats individuels

  @MAINT-01
  Scénario: Combiner les services à sa base
    Étant donné un bot à sa base avec 10 carburants et 60 dégâts
    Et une cargaison de 20 nourritures, 30 débris et 1 spécial
    Quand 1199 ms de service se sont écoulées
    Alors aucun effet du service n'est encore appliqué
    Quand la dernière milliseconde s'écoule
    Alors sa cargaison est vide, son carburant vaut 100 et ses dégâts valent 0
    Et son score et son budget augmentent chacun de 51
    Et aucun coût de service n'est prélevé

  @MAINT-02
  Plan du scénario: Limiter une station à son service
    Étant donné un bot sur une station <station> avec 10 carburants et 60 dégâts
    Et une cargaison non vide
    Quand son service de 1200 ms se termine
    Alors son carburant vaut <carburant> et ses dégâts valent <dégâts>
    Et sa cargaison, son score et son budget n'ont pas changé
    Exemples:
      | station | carburant | dégâts |
      | fuel    | 100       | 60     |
      | repair  | 10        | 0      |

  @MAINT-03
  Scénario: Voyager avant de réparer
    Étant donné un bot à distance d'une station avec 60 dégâts
    Quand il choisit une réparation
    Alors ses dégâts restent inchangés pendant le trajet hors danger
    Et chaque pas consomme 1 carburant
    Et la réparation complète exige l'arrivée puis 1200 ms de service

  @MAINT-04
  Scénario: Utiliser les seuils validés
    Étant donné un bot qui ne bénéficie pas déjà d'un service local
    Quand ses besoins sont évalués
    Alors une réparation est recherchée dès 50 dégâts inclus
    Et le carburant est urgent sous ou au seuil maximal entre 20 et le coût d'accès au service augmenté de 3
    Et un service carburant est automatique sur sa station si le carburant est strictement inférieur à 30
    Et à sa base toute cargaison, tout dégât ou tout carburant manquant déclenche le service combiné

  @MAINT-05
  Plan du scénario: Acheter une extension utile à sa base
    Étant donné un bot à sa base avec un drone disponible et un rayon de <avant>
    Et assez de budget, le rayon courant exploré et une nouvelle couronne inconnue utile
    Quand son achat de 1000 ms se termine
    Alors son rayon vaut <après> et son budget a diminué de <prix>
    Et son score et ses dégâts n'ont pas changé
    Et le rayon et le budget de l'autre bot n'ont pas changé
    Et atteindre le rayon 3 ne termine pas la partie
    Exemples:
      | avant | après | prix |
      | 1     | 2     | 50   |
      | 2     | 3     | 100  |

  @MAINT-06
  Scénario: Remplacer seulement un drone perdu
    Étant donné un bot à sa base sans drone et avec au moins 50 de budget
    Quand son achat de 1000 ms se termine
    Alors son drone est disponible et son budget diminue de 50
    Et son score et ses dégâts restent inchangés
    Et un bot possédant déjà un drone ne rachète pas un second drone

  @MAINT-07
  Scénario: Ne pas remplacer gratuitement un drone
    Étant donné un bot sans drone avec un budget inférieur à 50
    Quand il cherche un remplacement
    Alors aucun drone gratuit n'est créé
    Et aucun échange contre des dégâts n'est appliqué
    Et les déplacements et découvertes par le vaisseau restent possibles s'ils sont faisables