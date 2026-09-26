# language: fr
@socle @edgecases
Fonctionnalité: Limites, validation et reprise du transport

  @EDGE-01
  Scénario: Refuser un chemin inexistant
    Étant donné une origine ou une destination absente, bloquée ou non reliée
    Quand un chemin est recherché
    Alors aucun trajet n'est retourné
    Et le bot ne se téléporte pas et ne réutilise pas une ancienne route
    Et un autre objectif faisable est recherché ou un blocage explicite est signalé

  @EDGE-02
  Plan du scénario: Rejeter des quantités invalides
    Étant donné une transaction contenant <défaut>
    Quand la transaction est validée
    Alors elle est refusée avant de modifier les stocks
    Exemples:
      | défaut                             |
      | une quantité négative              |
      | une quantité fractionnaire         |
      | une cargaison dépassant sa capacité |

  @EDGE-03
  Scénario: Rejeter une commande invalide ou périmée
    Étant donné une session identifiée et un protocole de commandes de version 1
    Quand une commande porte une ancienne identité, une vitesse non autorisée ou un type mal formé
    Alors une erreur est retournée sans appliquer cette commande
    Et les vitesses acceptées sont les nombres 1, 2, 4 et 8

  @EDGE-04
  Scénario: Avancer d'un seul pas logique pendant la pause
    Étant donné une session active et en pause
    Quand la commande de pas est exécutée
    Alors au plus 100 ms de temps logique sont consommées
    Et la session reste en pause
    Et une fin ou un blocage survenu avant 100 ms n'est pas dépassé

  @EDGE-05
  Scénario: Permettre une reconnexion après erreur ou expiration
    Étant donné une connexion au worker expirée ou interrompue
    Quand le client reçoit la fermeture ou constate le délai dépassé
    Alors la connexion est nettoyée et une erreur récupérable est affichée
    Et une nouvelle tentative peut retrouver la session existante
    Et un worker qui ne répond pas à l'initialisation est signalé après 5000 ms

  @EDGE-06
  Scénario: Ne pas simuler localement si SharedWorker est indisponible
    Étant donné un navigateur ne permettant pas de créer le SharedWorker
    Quand le jeu essaie de se connecter
    Alors une erreur visible remplace le démarrage du jeu
    Et aucun moteur local indépendant n'est lancé

  @EDGE-07
  Scénario: Garder les commandes utilisables aux tailles de référence
    Étant donné la cible Chromium sur le poste Linux de référence
    Quand les vues sont affichées à 1280 par 800 puis à 390 par 844
    Alors les commandes restent accessibles sans chevauchement
    Et les tableaux larges défilent dans leur conteneur sans élargir la page
    Et le terrain reste visible et interactif
    Et cette vérification ne certifie pas les performances d'un téléphone physique