# language: fr
@socle @mine @drone-offensif
Fonctionnalité: Mines, drone offensif et mémoire individuelle

  @MINE-01
  Scénario: Équiper chaque vaisseau d'un drone offensif
    Étant donné une nouvelle partie à deux bots
    Alors chaque vaisseau possède un drone offensif disponible
    Et ce drone est distinct de son drone d'exploration
    Et les deux drones et le vaisseau utilisent le même réservoir de carburant

  @MINE-02
  Scénario: Arbitrer entre exploration et embuscade
    Étant donné un adversaire visible qui se déplace vers une tuile voisine traversable
    Et le bot possède au moins une action issue d'une ressource spéciale déposée
    Et cette tuile est dans le rayon et la ligne de vue du drone offensif
    Et le bot n'a ni collecte ni maintenance prioritaire
    Quand le bot choisit une opération
    Alors il peut poser une mine sur la prochaine tuile de cet adversaire
    Et une cible de mine admissible passe avant une collecte ordinaire
    Et si aucun déplacement adverse visible n'offre une cible faisable, il continue son exploration
    Et la même graine et le même état produisent la même décision

  @MINE-03
  Plan du scénario: Superposer une mine sans remplacer le terrain
    Étant donné une tuile traversable de type <terrain> à portée du drone offensif
    Quand le drone y pose une mine
    Alors la tuile conserve son type <terrain>, ses ressources et sa fonction de service éventuelles
    Et une mine en armement est ajoutée par-dessus cette tuile
    Et aucune condition de tuile vide n'est exigée
    Exemples:
      | terrain   |
      | vide      |
      | ressource |
      | carburant |
      | réparation |
      | danger    |

  @MINE-04
  Scénario: Poser à l'arrivée du drone puis armer pendant 800 ms
    Étant donné une cible à un hexagone du vaisseau
    Quand le drone offensif atteint la cible après 400 ms
    Alors la mine est posée immédiatement et son armement commence
    Et à 1199 ms depuis le départ elle est encore en armement
    Quand 1 ms supplémentaire s'écoule
    Alors la mine est armée et l'événement d'armement est enregistré

  @MINE-05
  Scénario: Exiger rayon, ligne de vue et carburant suffisants
    Étant donné une cible hors rayon, masquée par un obstacle ou trop coûteuse en carburant
    Quand le bot évalue la pose, le scan et la neutralisation par drone offensif
    Alors cette cible n'est pas retenue pour l'opération impossible
    Et aucune opération impossible ne prélève de carburant

  @MINE-06
  Scénario: Prélever le vol et le coût de chaque action offensive
    Étant donné une cible à deux hexagones et un drone offensif disponible
    Quand une pose de mine, un scan ou une neutralisation se termine
    Alors le vol aller-retour coûte 4 carburants, comme pour le drone d'exploration
    Et la pose ajoute 4 carburants, le scan 2 et la neutralisation 2
    Et ces coûts sont prélevés sur le réservoir commun

  @MINE-07
  Scénario: Ne pas limiter globalement les mines par vaisseau
    Étant donné un bot disposant du carburant et des actions requis ainsi que de plusieurs cibles admissibles
    Quand il pose successivement des mines sur des tuiles distinctes
    Alors chaque pose effective consomme une action
    Et aucune autre limite globale de mines posées ne bloque une nouvelle pose
    Et une tuile déjà minée ne reçoit pas une seconde mine simultanée

  @MINE-26
  Scénario: Ne pas créer de mine sans action disponible
    Étant donné un bot sans action disponible après ses dépôts et ses dépenses
    Quand il évalue une cible de mine admissible
    Alors il ne lance pas de pose de mine
    Et ses scans et neutralisations restent disponibles selon leur coût en carburant

  @MINE-08
  Scénario: Montrer l'armement à l'adversaire dans son rayon actuel
    Étant donné une mine ennemie posée dans le rayon et la ligne de vue du vaisseau
    Quand la mine est encore en armement
    Alors sa position exacte est visible pour cet adversaire
    Et elle est enregistrée dans sa mémoire individuelle
    Et le propriétaire conserve la position de sa mine sans péremption
    Et l'autre bot ne reçoit pas de mémoire hors de sa propre vision

  @MINE-09
  Scénario: Cacher une mine armée non aperçue pendant l'armement
    Étant donné une mine ennemie posée hors du rayon ou derrière un obstacle
    Quand ses 800 ms d'armement se terminent sans qu'elle ait été vue
    Alors sa position exacte ne figure pas dans la mémoire de l'adversaire
    Et le terrain connu sous la mine reste connu sans révéler la mine armée

  @MINE-10
  Scénario: Faire expirer la position mémorisée d'une mine ennemie
    Étant donné un bot de mémoire niveau 1 ayant vu une mine ennemie en armement
    Quand 10 secondes se sont écoulées depuis sa dernière observation
    Alors la position est oubliée et un événement d'oubli est enregistré
    Et une mine encore présente ne redevient pas visible par sa seule existence armée
    Et le bot ne l'évite plus grâce à cette ancienne position

  @MINE-11
  Plan du scénario: Acheter une mémoire plus longue à la base
    Étant donné un bot à sa base ayant déjà repéré une mine et assez de budget
    Quand son amélioration de mémoire de 1000 ms se termine au niveau <avant>
    Alors son niveau devient <après> et sa durée de souvenir vaut <durée> secondes
    Et son budget diminue de <prix> sans changer son score
    Et la prochaine observation d'une mine utilise cette durée
    Exemples:
      | avant | après | durée | prix |
      | 1     | 2     | 20    | 50   |
      | 2     | 3     | 40    | 100  |

  @MINE-12
  Scénario: Donner une alerte de proximité sans position exacte
    Étant donné une mine ennemie à un hexagone ou moins du vaisseau
    Quand son détecteur de proximité est actualisé
    Alors une alerte de mine proche est disponible au bot et au joueur
    Et cette alerte seule n'ajoute pas la position exacte à la mémoire

  @MINE-13
  Scénario: Produire le même rapport de scan imprécis pour le bot et le joueur
    Étant donné des mines ennemies dans un rayon de deux hexagones autour de la cible scannée
    Quand le drone offensif termine son scan
    Alors le rapport indique le nombre de ces mines et la distance de la plus proche
    Et il ne révèle pas les coordonnées exactes des mines non repérées
    Et le bot utilise le même rapport que celui affiché au joueur
    Et si aucune mine n'est dans ce rayon, le nombre vaut zéro et la distance est absente

  @MINE-14
  Scénario: Contourner une mine mémorisée quand un trajet sûr existe
    Étant donné une mine connue sur le trajet direct vers un objectif
    Et un autre trajet traversable sans mine connue vers cet objectif
    Quand le bot planifie son prochain pas
    Alors il choisit le détour sûr sans neutraliser cette mine

  @MINE-15
  Scénario: Laisser en place une mine proche qui ne gêne pas le prochain pas
    Étant donné une mine ennemie mémorisée à un hexagone du vaisseau
    Et un prochain pas vers l'objectif sur une autre tuile sûre
    Quand le bot choisit son opération
    Alors il effectue ce déplacement sans neutraliser la mine voisine

  @MINE-16
  Scénario: Neutraliser une mine qui bloque la prochaine case choisie
    Étant donné une mine mémorisée sur la prochaine case nécessaire vers un objectif
    Et aucun détour sûr retenu par le calcul de trajet
    Et le drone offensif et son carburant sont disponibles
    Quand le bot prépare ce déplacement
    Alors il envoie d'abord le drone offensif neutraliser cette case
    Et l'explosion contrôlée retire la mine sans infliger de dégâts au drone ni aux vaisseaux
    Et après le retour du drone, le bot peut reprendre son trajet

  @MINE-17
  Scénario: Vérifier sans boucle une position mémorisée devenue vide
    Étant donné une position mémorisée qui bloque le prochain pas mais dont la mine a déjà disparu hors de vue
    Quand le drone offensif termine sa tentative de neutralisation sur cette position
    Alors aucun événement de neutralisation réussie n'est émis
    Et le carburant de l'opération est consommé
    Et la position obsolète est retirée de la mémoire
    Et le bot ne recommence pas indéfiniment la même neutralisation

  @MINE-18
  Scénario: Infliger des dégâts et retirer une mine armée au contact du vaisseau
    Étant donné une mine armée sur une tuile traversable
    Quand un vaisseau entre sur cette tuile
    Alors la mine explose une fois et disparaît
    Et le vaisseau reçoit 40 dégâts dus à la mine
    Et l'impact est identifié comme lié à une mine dans les événements
    Et la ressource ou le service sous la mine reste sur la tuile

  @MINE-19
  Scénario: Ne pas déclencher une mine encore en armement
    Étant donné une mine posée depuis moins de 800 ms
    Quand un vaisseau entre sur sa tuile
    Alors la mine reste en place et ce contact ne cause aucun dégât de mine
    Et rester sur la tuile après l'armement ne répète pas un impact sans nouvelle entrée

  @MINE-20
  Scénario: Perdre le drone d'exploration sur une mine armée
    Étant donné un drone d'exploration arrivant sur une mine armée
    Quand il atteint cette tuile
    Alors la mine explose et disparaît
    Et le drone d'exploration est perdu comme sur une tuile dangereuse
    Et le vaisseau distant ne reçoit aucun dégât de cette explosion

  @MINE-21
  Scénario: Exclure déclenchement à distance et réactivation
    Étant donné une mine armée sans contact avec un vaisseau ni un drone d'exploration
    Quand du temps logique s'écoule ou que son propriétaire lance une autre opération
    Alors la mine ne se déclenche pas à distance
    Et une mine explosée ou neutralisée n'est pas réactivable
    Et une nouvelle mine exige une nouvelle pose et son coût complet

  @MINE-22
  Scénario: Signaler visuellement une mine certaine ou seulement mémorisée
    Étant donné une mine dans le rayon du vaisseau pendant l'armement
    Alors le joueur voit le marqueur d'armement
    Quand cette tuile sort du rayon après avoir été aperçue
    Alors le joueur voit une position mémorisée présentée comme incertaine
    Et la disparition réelle de la mine hors de vue n'est pas révélée par ce marqueur
    Et le marqueur s'efface à l'expiration de la mémoire

  @MINE-23
  Scénario: Appliquer le danger d'une mine aussi à son propriétaire
    Étant donné une mine armée posée par un vaisseau
    Quand ce même vaisseau entre plus tard sur la tuile minée
    Alors la mine explose et lui inflige les mêmes 40 dégâts
    Et son drone offensif peut aussi la neutraliser si elle bloque son prochain pas

  @MINE-24
  Scénario: Scanner sans déclencher avec le drone offensif
    Étant donné une mine armée sur la tuile scannée par le drone offensif
    Quand ce drone termine son scan
    Alors le drone offensif revient disponible sans subir de dégâts
    Et la mine reste armée jusqu'à un contact ou une neutralisation distincte

  @MINE-25
  Scénario: Distinguer l'impact après oubli d'une mine jamais repérée
    Étant donné un bot ayant aperçu et mémorisé une mine ennemie encore active
    Et une route sûre de contournement tant que ce souvenir est valide
    Quand sa mémoire expire puis qu'il reprend le trajet direct
    Alors il peut entrer sur la mine et subir un impact après oubli
    Et cet impact reste distinguable d'un impact sans repérage préalable dans le balayage de graines
