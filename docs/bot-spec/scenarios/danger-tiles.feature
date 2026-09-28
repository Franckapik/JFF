# language: fr
@socle @danger
Fonctionnalité: Dangers statiques et perte du drone à l'arrivée

  @DANGER-01
  Scénario: Appliquer les dégâts à chaque arrivée du vaisseau
    Étant donné un trajet faisable passant par une case dangereuse
    Quand le vaisseau arrive sur cette case après son pas de 400 ms
    Alors il consomme 2 carburants communs et reçoit exactement 10 dégâts
    Et le temps passé ensuite sur la case ne répète pas les dégâts
    Et cette case n'a aucune ressource collectable

  @DANGER-02
  Scénario: Préférer un trajet sans danger et refuser un trajet mortel
    Étant donné plusieurs routes vers un objectif et des dangers déjà découverts par ce bot
    Quand le bot planifie son trajet
    Alors une route sans danger est préférée si elle existe
    Et sinon une route dangereuse reste possible si les dégâts prévus restent strictement inférieurs à 100
    Et un objectif exigeant des dégâts mortels n'est pas déclaré faisable
    Et un simple refus de trajet ne détruit pas le vaisseau

  @DANGER-06
  Scénario: Cacher la nature d'un danger jusqu'à sa découverte
    Étant donné une case dangereuse dans le rayon du vaisseau et encore inconnue du bot
    Quand le bot observe le terrain sans avoir envoyé de drone ni atteint cette case
    Alors la case apparaît comme terrain non identifié dans sa vision
    Et le bot ne l'évite pas grâce à sa nature réelle lors du calcul de trajet
    Quand le drone est détruit sur cette case ou que le vaisseau y arrive
    Alors le danger est connu de ce bot et apparaît comme danger dans sa vision
    Et l'autre bot ne reçoit pas cette découverte
    Et la vision développeur révèle le danger indépendamment des deux bots

  @DANGER-03
  Plan du scénario: Détruire le drone et révéler le danger dès son arrivée
    Étant donné un drone envoyé sur une cible dangereuse inconnue à distance <distance>
    Et cette cible est dans le rayon du vaisseau
    Quand <avant> ms se sont écoulées
    Alors le drone est encore disponible et la cible n'est pas encore découverte
    Quand 1 ms supplémentaire s'écoule
    Alors le drone est perdu et le danger est connu de ce bot
    Et les compteurs de scans et de pertes de drone augmentent chacun de 1
    Et le vaisseau distant conserve sa position et ses dégâts
    Et la réserve commune perd seulement le coût de l'aller du drone jusqu'au danger
    Et l'opération de scan se termine sans attendre un scan ou retour fictif
    Et le rayon de visibilité retombe à 1 autour du vaisseau
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

  @DANGER-05
  Scénario: Perdre les extensions avec le drone sans effacer le terrain mémorisé
    Étant donné un drone de rayon 3 et une case dangereuse visible au-delà du rayon initial
    Quand le drone atteint ce danger et est détruit
    Alors le rayon de vision autour du vaisseau vaut immédiatement 1
    Et les cases explorées hors de ce rayon ne gardent que le souvenir assombri du terrain
    Et les ressources et vaisseaux présents sur ces cases ne sont plus visibles
