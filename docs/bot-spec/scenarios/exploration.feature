# language: fr
@socle @exploration
Fonctionnalité: Exploration depuis le vaisseau mobile

  @EXP-01
  Scénario: Filtrer les cibles de scan
    Étant donné un drone disponible
    Quand le bot recherche des cibles inconnues dans son rayon
    Alors seules les cases traversables de type ressource, vide ou danger sont candidates
    Et les bases, stations, obstacles, cases connues et cases hors rayon sont exclues
    Et les services publics restent visibles sans scan

  @EXP-02
  Scénario: Effectuer un scan normal et revenir au vaisseau
    Étant donné un vaisseau en "1,0" avec un rayon de 1
    Et sa seule cible de scan est la ressource inconnue "2,0"
    Quand le scan commence
    Alors son aller dure 400 ms, son scan 800 ms et son retour 400 ms
    Et à 1599 ms la connaissance ne contient pas encore cette cible
    Quand la dernière milliseconde s'écoule
    Alors la cible est connue de ce bot et son compteur de scans augmente de 1
    Et le vaisseau est resté en "1,0", sans perte de carburant
    Et le drone est de nouveau disponible auprès du vaisseau
    Et la connaissance de l'autre bot n'a pas été enrichie

  @EXP-03
  Scénario: Déplacer le centre d'exploration
    Étant donné un vaisseau ayant quitté sa base
    Quand des cibles de scan sont sélectionnées
    Alors leur distance est calculée depuis le vaisseau et non depuis sa base
    Et le rayon individuel reste compris entre 1 et 3

  @EXP-04
  Scénario: Continuer sans drone
    Étant donné un bot ayant perdu son drone et sans budget de remplacement
    Et une frontière inconnue accessible avec une réserve de retour suffisante
    Et aucune maintenance urgente ni collecte prioritaire
    Quand il cherche une nouvelle zone
    Alors il peut rejoindre une frontière proche par des pas voisins
    Et il découvre chaque case où arrive son vaisseau
    Et il ne lance aucune opération de scan sans drone

  @EXP-05
  Scénario: Choisir de manière probabiliste et reproductible
    Étant donné des collectes et des scans faisables sans maintenance urgente
    Quand le bot arbitre entre ces intentions
    Alors il utilise son état aléatoire issu de la graine
    Et les collectes sont classées par quantité disponible divisée par la longueur du trajet
    Et la préférence de collecte tient compte de la quantité et de la cargaison
    Et reproduire la même graine, configuration et commandes reproduit les décisions

  @EXP-06
  Scénario: Ne pas exiger l'exploration de toutes les cases pour finir
    Étant donné qu'il ne reste aucune ressource accessible
    Et que des cases vides sont encore inconnues
    Quand la session réévalue ses objectifs
    Alors elle passe aux derniers retours et dépôts
    Et elle n'attend pas un scan de toutes les cases vides