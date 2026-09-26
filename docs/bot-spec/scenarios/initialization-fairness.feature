# language: fr
@socle @fairness
Fonctionnalité: Équité de la carte initiale générée
  L'équité du socle est une symétrie initiale, pas une garantie de scores égaux.

  @FAIR-01
  Scénario: Conserver la symétrie centrale
    Étant donné une carte générée avec une graine déterminée
    Alors chaque tuile de coordonnées axiales "q,r" possède une tuile miroir "-q,-r"
    Et ces deux tuiles ont le même type, la même accessibilité et les mêmes quantités par ressource
    Et les propriétaires des deux bases sont distincts

  @FAIR-02
  Scénario: Garantir des départs et services accessibles
    Étant donné la carte de rayon 3
    Alors les bases sont "-3,0" et "3,0", à une distance hexagonale de 6
    Et les cases voisines protégées des bases contiennent des ressources
    Et les cases traversables sont reliées
    Et chaque base peut rejoindre un service de carburant et de réparation
    Et le bilan initial est conservé indépendamment des collectes futures

  @FAIR-03
  Plan du scénario: Reproduire les graines limites
    Étant donné la graine <graine>
    Quand deux cartes de même rayon sont générées
    Alors elles sont identiques
    Et aucune quantité de ressource n'est négative ou fractionnaire
    Exemples:
      | graine     |
      | 0          |
      | 1          |
      | 42         |
      | 4294967295 |

  @FAIR-04
  Plan du scénario: Respecter les tailles prises en charge par le générateur
    Quand une carte de rayon <rayon> est générée
    Alors elle contient <tuiles> tuiles
    Et les bases et la symétrie restent valides
    Exemples:
      | rayon | tuiles |
      | 2     | 19     |
      | 3     | 37     |
      | 8     | 217    |

  @FAIR-05
  Scénario: Ne pas confondre équité et résultat de compétition
    Étant donné une carte initialement symétrique
    Quand les bots prennent des décisions individuelles et se disputent les mêmes stocks
    Alors leurs scores finaux peuvent différer
    Et aucun mécanisme de compensation ne modifie artificiellement leurs ressources