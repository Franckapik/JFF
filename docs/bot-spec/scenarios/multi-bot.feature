# language: fr
@socle @multibot
Fonctionnalité: Compétition partagée et lectures individuelles

  @MULTI-01
  Scénario: Partager les ressources sans partager les progrès
    Étant donné deux bots dans la même session
    Quand un bot découvre, collecte, dépose ou achète une extension
    Alors ses connaissances, son score, son budget et son rayon évoluent individuellement
    Et les ressources collectées disparaissent du stock partagé pour les deux bots
    Et aucune copie indépendante du monde n'est simulée par un bot ou un onglet

  @MULTI-02
  Scénario: Sérialiser les échéances concurrentes avec une seule horloge
    Étant donné deux opérations se terminant à la même échéance logique
    Quand la session applique leurs effets
    Alors elle les traite en transactions successives dans son ordre déterministe alterné
    Et une même ressource physique ne peut pas être attribuée deux fois
    Et le nombre de frames de rendu ne change pas le résultat métier

  @MULTI-03
  Scénario: Basculer entre les visions individuelles
    Étant donné la vue du terrain
    Quand la vision "Bot 0" est choisie
    Alors seul son panneau individuel est affiché
    Et seules les ressources de ses cibles scannées dans le rayon de son vaisseau sont matérialisées
    Et les bases, stations et obstacles hors du rayon jamais explorés sont masqués
    Quand la vision "Bot 1" est choisie
    Alors son champ et sa mémoire individuels remplacent ceux du Bot 0
    Et changer la vision ne modifie ni les compteurs ni la connaissance des bots

  @MULTI-04
  Scénario: Afficher une provenance indépendante des visites
    Étant donné des prélèvements effectués par les deux bots
    Quand le diagnostic affiche leur activité
    Alors il distingue tentatives, collectes non vides, tuiles distinctes, pas et carburant utilisé
    Et il présente les quantités prélevées par bot et par tuile
    Et un changement de sélection ou une nouvelle frame n'ajoute aucune collecte
    Et le journal borné identifie le bot concerné ou la session

  @MULTI-05
  Scénario: Partager pause, vitesse et reset entre onglets
    Étant donné deux onglets connectés au même worker
    Quand un onglet met en pause, change la vitesse ou réinitialise la partie
    Alors les deux onglets observent la même session résultante
    Et aucun onglet ne fait avancer une simulation locale supplémentaire
