# language: fr
@socle @gameover
Fonctionnalité: Fin normale, immobilisation et blocage explicite

  @END-01
  Scénario: Solder les cargaisons avant le classement
    Étant donné que les dernières ressources accessibles viennent d'être chargées
    Et que les vaisseaux survivants peuvent rejoindre leurs bases
    Quand la session constate l'épuisement du stock accessible
    Alors elle passe en phase "returning"
    Et les survivants exécutent leurs trajets et derniers dépôts locaux
    Et aucun vainqueur n'est annoncé avant ces dépôts
    Et ensuite la session passe en phase "finished"

  @END-02
  Scénario: Ne pas finir au seul motif du rayon maximal
    Étant donné un bot qui vient d'acheter le rayon 3
    Et des ressources accessibles encore présentes
    Quand il reprend ses décisions
    Alors la session reste active
    Et le bot peut explorer et collecter avec ce rayon

  @END-03
  Scénario: Déclarer une égalité entre survivants
    Étant donné deux survivants ayant chacun déposé 10 ressources au terme de la partie
    Quand les vainqueurs sont calculés
    Alors les deux bots sont vainqueurs ex aequo
    Et aucune dépense d'achat ne diminue leurs scores déposés

  @END-04
  Scénario: Conserver une partie bloquée en attente d'un remorquage à définir
    Étant donné un bot immobilisé ayant déposé 500 et un bot actif ayant déposé 300
    Quand le bot actif termine ses actions
    Alors la session est bloquée en attente d'un remorquage à définir
    Et la cargaison et le score du bot immobilisé restent conservés
    Et aucun vainqueur n'est désigné avant une résolution future

  @END-05
  Scénario: Signaler l'absence d'objectif faisable sans inventer une victoire
    Étant donné du stock géométriquement accessible mais aucun objectif faisable pour les bots
    Quand toutes les possibilités de service, collecte, scan et trajet sont épuisées
    Alors la session passe en phase "blocked" sans vainqueur
    Et le temps, les cargaisons et les dégâts sont conservés
    Et aucun dépôt à distance ou secours exceptionnel n'est inventé
    Et le diagnostic, l'export et une nouvelle partie restent disponibles

  @END-06
  Scénario: Ne pas détruire un vaisseau dont le retour final est impossible
    Étant donné un stock accessible épuisé et un vaisseau avec une cargaison non déposée
    Et 90 dégâts et aucun retour à la base sans traverser un danger mortel
    Quand le dernier retour est évalué
    Alors la session est "blocked", pas terminée normalement
    Et le vaisseau conserve ses 90 dégâts et sa cargaison
    Et aucune perte ni aucun score ne sont ajoutés artificiellement
