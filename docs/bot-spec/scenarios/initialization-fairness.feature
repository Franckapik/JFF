# language: fr
@socle @fairness
Fonctionnalité: Équité de la carte initiale générée
  L'équité du socle protège les ressources et les trajets vers les services, pas des scores égaux.

  @FAIR-01
  Scénario: Conserver la symétrie des ressources et de l'accessibilité
    Étant donné une carte générée avec une graine déterminée
    Alors chaque tuile de coordonnées axiales "q,r" possède une tuile miroir "-q,-r"
    Et ces deux tuiles ont la même accessibilité et les mêmes quantités par ressource
    Et leurs types sont identiques sauf si l'une accueille un service unique
    Et les propriétaires des deux bases sont distincts

  @FAIR-02
  Scénario: Garantir des départs et services accessibles
    Étant donné la carte de rayon 3
    Alors les bases sont "-3,0" et "3,0", à une distance hexagonale de 6
    Et les cases voisines protégées des bases contiennent des ressources
    Et les cases traversables sont reliées
    Et chaque base peut rejoindre un service de carburant et de réparation
    Et la carte ne contient qu'une station de carburant et une station de réparation
    Et les trajets de chaque base vers un même service diffèrent d'au plus un pas
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

  @FAIR-06
  Scénario: Varier les stations sans favoriser une base
    Étant donné deux cartes de même rayon générées avec des graines différentes
    Alors les emplacements des deux services peuvent varier
    Et chaque carte possède exactement un service de chaque type
    Et les stations ne sont pas placées dans le rayon initial d'une base
