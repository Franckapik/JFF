# language: fr
@socle @initialization
Fonctionnalité: Initialisation de la session partagée
  Le contrat validé du 26 septembre 2026 remplace les anciens événements d'initialisation.

  @INIT-01
  Scénario: Créer une seule partie pour deux bots
    Étant donné la graine 42 et une carte de rayon 3
    Quand la session est créée
    Alors la carte contient 37 tuiles et un seul stock partagé
    Et les bots "bot-0" et "bot-1" ont chacun leur acteur
    Et leurs bases respectives sont "-3,0" et "3,0"
    Et aucune base ne contient de ressources collectables

  @INIT-02
  Scénario: Initialiser les moyens et les comptes individuels
    Étant donné une nouvelle session
    Alors chaque bot est à sa base avec une réserve commune de 100 carburants et 0 dégât
    Et son drone est disponible avec un rayon de 1, sans réserve séparée
    Et sa cargaison, ses dépôts, son score, son budget et ses dépenses sont nuls
    Et ses compteurs et son registre de collecte sont vides
    Et sa connaissance individuelle contient initialement sa propre base
    Et aucune cible n'est initialement enregistrée comme scannée par son drone
    Et son souvenir initial du terrain couvre le rayon du vaisseau autour de sa base
    Et ses capacités sont définies indépendamment
      | ressource | capacité |
      | food      | 200      |
      | debris    | 1800     |
      | special   | 3        |

  @INIT-03
  Scénario: Connecter un second onglet sans recréer le monde
    Étant donné une session déjà initialisée dans un SharedWorker
    Quand un second onglet de même origine se connecte
    Alors il reçoit la même instance et la même partie
    Et ni la graine, ni les stocks, ni les acteurs ne sont réinitialisés

  @INIT-04
  Scénario: Réinitialiser entièrement une partie
    Étant donné une session ayant déjà collecté et acheté une extension
    Quand une nouvelle partie de graine 42 est demandée avec la bonne identité de partie
    Alors une nouvelle identité de partie est attribuée
    Et les deux bots, leurs opérations et leurs stocks repartent de l'état initial
    Et les positions des bases restent fixes pour cette taille de carte
    Et une commande portant l'ancienne identité est refusée

  @INIT-05
  Scénario: Refuser un ancien contrat de snapshot
    Étant donné un client attendant un snapshot de version 5
    Quand le worker fournit un snapshot de version 4
    Alors la connexion est fermée avec une erreur de version visible
    Et aucun monde local de remplacement n'est créé
    Et la reconnexion est possible après fermeture des anciens onglets
