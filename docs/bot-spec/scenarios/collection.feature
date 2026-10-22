# language: fr
@socle @collection
Fonctionnalité: Collecte concurrente et compartiments indépendants

  @COL-01
  Scénario: Sélectionner une collecte faisable
    Étant donné un bot sans besoin de maintenance prioritaire
    Quand il recherche une collecte
    Alors la cible doit avoir été scannée par le drone, être de type ressource et posséder un stock transférable
    Et un chemin traversable et non mortel doit permettre de l'atteindre
    Et le carburant doit couvrir l'aller, l'accès ultérieur à un service et la réserve de 3
    Et une base, une station, un obstacle ou un danger n'est jamais une cible de collecte

  @COL-02
  Scénario: Respecter chaque compartiment séparément
    Étant donné les quantités suivantes avant transfert
      | ressource | stock | cargaison | capacité |
      | food      | 2     | 8         | 8        |
      | debris    | 2     | 7         | 8        |
      | special   | 1     | 1         | 2        |
    Quand le chargement se termine
    Alors le transfert vaut 0 nourriture, 1 débris et 1 spécial
    Et le stock restant vaut 2 nourritures, 1 débris et 0 spécial
    Et aucun compartiment n'a empêché le remplissage d'un autre

  @COL-03
  Scénario: Arbitrer deux chargements sur le même stock
    Étant donné deux bots sur une case contenant seulement 2 nourritures
    Et deux chargements se terminant à la même échéance
    Quand la session applique les transactions dans son ordre déterministe
    Alors le premier transfert prend 2 nourritures et le second 0
    Et aucun bot ne reçoit une copie du stock initial
    Et chacun compte une tentative, mais seul le premier compte une collecte non vide
    Et seul le premier enregistre cette tuile dans sa provenance

  @COL-04
  Scénario: Cumuler plusieurs prélèvements sur une même tuile
    Étant donné un seul bot actif devant une tuile de test contenant 18 nourritures
    Et sa capacité nourriture est de 8
    Quand il effectue les chargements et dépôts nécessaires
    Alors son score déposé atteint 18
    Et il compte 3 collectes non vides sur 1 tuile distincte
    Et la provenance de cette tuile conserve 18 nourritures après les dépôts

  @COL-05
  Scénario: Ne pas facturer de carburant pour le chargement
    Étant donné un chargement sur place de durée 1000 ms
    Quand 999 ms s'écoulent
    Alors la cargaison n'a pas encore reçu le transfert
    Quand la dernière milliseconde s'écoule
    Alors les ressources disponibles sont transférées dans les capacités restantes
    Et le chargement n'a pas consommé de carburant
    Et chaque pas de déplacement à l'aller ou au retour reste facturé séparément

  @COL-06
  Scénario: Décharger sans attendre que tous les compartiments soient pleins
    Étant donné une cargaison non vide avec le compartiment spécial plein
    Et aucune collecte faisable sur la position actuelle
    Et une base accessible
    Quand le bot évalue une collecte sur une autre case
    Alors la pression du compartiment plein provoque le retour à sa base
    Et ce retour n'exige pas un seuil global de remplissage à 80 pour cent

  @COL-07
  Scénario: Conserver les ressources sans compter deux fois la provenance
    Étant donné une succession de collectes, dépôts, achats et pertes explicites
    Quand le bilan de chaque ressource est calculé
    Alors stock restant plus cargaisons plus dépôts cumulés plus pertes égale stock initial
    Et la provenance des collectes n'est pas ajoutée à ce bilan physique
    Et les achats et les réparations débitent le budget issu des débris, pas le score ni les dépôts cumulés

  @COL-08
  Scénario: Représenter les ressources découvertes dans le champ de vision
    Étant donné deux tuiles ressources dans le rayon de vision du vaisseau
    Et aucune de ces tuiles n'a été scannée par le drone de ce bot
    Alors aucun objet de ressource n'apparaît sur ces tuiles
    Quand le drone termine un scan sur la première tuile
    Alors un symbole 3D correspondant à son unique catégorie apparaît et tourne au-dessus de cette cible
    Et la seconde tuile garde l'apparence du terrain sans montrer ses quantités
    Et les objets de la cible disparaissent lorsque celle-ci sort du rayon du vaisseau
    Et ce symbole disparaît de la tuile quand son stock atteint zéro

  @COL-11
  Scénario: Répartir les trouvailles avec une rareté lisible
    Étant donné une nouvelle carte symétrique
    Alors chaque tuile ressource contient une seule catégorie en quantité de 1 ou 2
    Et les provisions sont plus fréquentes que les débris, eux-mêmes plus fréquents que les cartes action
    Et une paire de débris est accessible près des bases

  @COL-09
  Scénario: Montrer l'acheminement jusqu'au dépôt
    Étant donné un vaisseau qui a chargé plusieurs catégories de ressources
    Quand il revient vers sa base
    Alors les objets correspondant à sa cargaison se déplacent avec le vaisseau sur le plateau
    Et ils restent visibles pendant le service de dépôt
    Quand le dépôt à la base se termine
    Alors ces objets disparaissent de la base et la cargaison devient vide

  @COL-10
  Scénario: Exiger un scan même après l'arrivée du vaisseau
    Étant donné une tuile ressource atteinte par le vaisseau sans scan préalable du drone
    Alors le bot connaît le terrain mais ne peut ni voir ni collecter le stock
    Quand le vaisseau se déplace sur une case voisine et que son drone scanne la tuile ressource
    Alors le stock et son symbole 3D deviennent visibles dans le champ du vaisseau
    Et le bot peut collecter le stock selon les règles de déplacement et de collecte
