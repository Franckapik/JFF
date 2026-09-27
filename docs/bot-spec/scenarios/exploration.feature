# language: fr
@socle @exploration
Fonctionnalité: Exploration depuis le vaisseau mobile

  @EXP-01
  Scénario: Filtrer les cibles de scan
    Étant donné un drone disponible
    Quand le bot recherche des cibles inconnues dans son rayon
    Alors seules les cases traversables de type ressource, vide ou danger sont candidates
    Et les bases, stations, obstacles, cases connues, cases hors rayon et cases masquées par un obstacle sont exclues
    Et les services publics ne nécessitent pas de scan pour être identifiés une fois dans le champ de vision

  @EXP-02
  Scénario: Effectuer un scan normal et revenir au vaisseau
    Étant donné un vaisseau en "1,0" avec un rayon de 1
    Et sa seule cible de scan est la ressource inconnue "2,0"
    Quand le scan commence
    Alors son aller dure 400 ms, son scan 800 ms et son retour 400 ms
    Et à 1599 ms la connaissance ne contient pas encore cette cible
    Quand la dernière milliseconde s'écoule
    Alors la cible est connue de ce bot et son compteur de scans augmente de 1
    Et la cible est enregistrée comme scannée pour l'affichage de ses ressources
    Et le vaisseau est resté en "1,0"
    Et la réserve commune a perdu 2 unités pour l'aller-retour du drone sur un hexagone
    Et le drone est de nouveau disponible auprès du vaisseau
    Et la connaissance de l'autre bot n'a pas été enrichie

  @EXP-03
  Scénario: Déplacer le centre d'exploration
    Étant donné un vaisseau ayant quitté sa base
    Quand des cibles de scan sont sélectionnées
    Alors leur distance est calculée depuis le vaisseau et non depuis sa base
    Et le rayon individuel reste compris entre 1 et 3
    Et la vision actuelle couvre les cases situées dans ce rayon autour du vaisseau, y compris pendant le vol du drone

  @EXP-04
  Scénario: Continuer sans drone
    Étant donné un bot ayant perdu son drone et sans budget de remplacement
    Et une frontière inconnue accessible avec une réserve de retour suffisante
    Et aucune maintenance urgente ni collecte prioritaire
    Quand il cherche une nouvelle zone
    Alors il peut rejoindre une frontière proche par des pas voisins
    Et il découvre chaque case où arrive son vaisseau
    Et sans drone le rayon initial de vision 1 reste actif autour du vaisseau
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

  @EXP-07
  Scénario: Distinguer inconnu, vision actuelle et souvenir du terrain
    Étant donné une nouvelle partie avec la vision du Bot 0 sélectionnée
    Alors les cases hors de son rayon jamais explorées sont sombres, y compris les stations et obstacles
    Et les cases dans son rayon montrent leur terrain, les ressources déjà scannées et les vaisseaux présents
    Quand le vaisseau se déplace et qu'une case explorée sort de son rayon
    Alors cette case ne garde que le souvenir assombri de son terrain
    Et ses ressources et les vaisseaux adverses ne sont plus visibles ni détaillés dans l'inspecteur
    Quand la vision du Bot 1 est sélectionnée
    Alors seul son propre champ de vision et son souvenir du terrain sont affichés

  @EXP-08
  Scénario: Limiter les scans par le carburant commun
    Étant donné un bot avec 3 unités de carburant commun et une cible inconnue à deux hexagones
    Quand le bot évalue les cibles de scan
    Alors cette cible est exclue car l'aller-retour du drone coûte 4 unités
    Et le bot peut rejoindre une station carburant avec son vaisseau si le trajet de 2 unités reste faisable

  @EXP-09
  Scénario: Garder le brouillard centré sur le vaisseau pendant un vol
    Étant donné un drone qui quitte son vaisseau pour scanner une cible
    Quand il se déplace vers la cible puis revient
    Alors le champ de vision reste centré sur le vaisseau avec son rayon individuel
    Et le trajet du drone ne révèle aucune case hors de ce rayon
    Et seul le vaisseau en mouvement étend le souvenir du terrain

  @EXP-10
  Scénario: Un obstacle coupe la vision et les scans
    Étant donné un vaisseau en "0,0" avec un rayon de 2
    Et un obstacle en "1,0" devant une ressource inconnue en "2,0"
    Alors l'obstacle est visible mais la ressource reste sous le brouillard
    Et la ressource derrière l'obstacle n'est pas une cible de scan
    Quand le vaisseau rejoint une case avec une ligne de vue dégagée vers "2,0"
    Alors le terrain de "2,0" devient visible et peut être scanné
