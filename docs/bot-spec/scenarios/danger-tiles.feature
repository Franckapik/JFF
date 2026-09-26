# language: fr
@socle @danger
Fonctionnalité: Dangers statiques et perte du drone à l'arrivée

  @DANGER-01
  Scénario: Appliquer les dégâts à chaque arrivée du vaisseau
    Étant donné un trajet faisable passant par une case dangereuse
    Quand le vaisseau arrive sur cette case après son pas de 400 ms
    Alors il consomme 1 carburant et reçoit exactement 10 dégâts
    Et le temps passé ensuite sur la case ne répète pas les dégâts
    Et cette case n'a aucune ressource collectable

  @DANGER-02
  Scénario: Préférer un trajet sans danger et refuser un trajet mortel
    Étant donné plusieurs routes vers un objectif
    Quand le bot planifie son trajet
    Alors une route sans danger est préférée si elle existe
    Et sinon une route dangereuse reste possible si les dégâts prévus restent strictement inférieurs à 100
    Et un objectif exigeant des dégâts mortels n'est pas déclaré faisable
    Et un simple refus de trajet ne détruit pas le vaisseau

  @DANGER-03
  Plan du scénario: Détruire le drone et révéler le danger dès son arrivée
    Étant donné un drone envoyé sur une cible dangereuse inconnue à distance <distance>
    Et cette cible est dans le rayon du vaisseau
    Quand <avant> ms se sont écoulées
    Alors le drone est encore disponible et la cible n'est pas encore découverte
    Quand 1 ms supplémentaire s'écoule
    Alors le drone est perdu et le danger est connu de ce bot
    Et les compteurs de scans et de pertes de drone augmentent chacun de 1
    Et le vaisseau distant conserve sa position, son carburant et ses dégâts
    Et l'opération de scan se termine sans attendre un scan ou retour fictif
    Exemples:
      | distance | avant |
      | 1        | 399   |
      | 2        | 799   |
      | 3        | 1199  |

  @DANGER-04
  Scénario: Ne pas déplacer les dangers dans le socle
    Étant donné une carte dont les dangers sont statiques
    Quand du temps logique s'écoule
    Alors leurs coordonnées et leur type restent inchangés
    Et aucune collision due au déplacement d'un danger n'est émise
    Et aucune base ou station n'est transformée spontanément en danger