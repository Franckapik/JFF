# Relief et mission de la tour

## Règle jouable aujourd'hui

Le plateau démarre avec quatre niveaux logiques : creux côtier vide 0 ; terrain
nu, ressource, danger, base et stations 1 ; obstacle et rampe 2 ; tour centrale
3. Les creux sont des cases de fond marin, toujours cachées et infranchissables.
Un obstacle bloque toujours les vaisseaux et la ligne de vue. Une rampe est traversable et relie
les terrains de niveau 1 à la tour. Les deux rampes opposées préservent une
approche pour chaque bot. Un pas est légal seulement entre voisins traversables
dont les niveaux diffèrent de 0 ou 1. Le coût en carburant et la durée d'un pas
restent ceux du socle ; la hauteur change les chemins, pas la comptabilité.

La génération vérifie l'accès aux deux stations et à toutes les tuiles
traversables, garde dix ressources spéciales et garantit au moins une paire de
creux côtiers même sur les cartes de deux couronnes. Sur les grandes cartes,
quelques encoches s'avancent d'une case vers l'intérieur sans couper la terre.
La marée reste une animation
visuelle. Le score et la fin de partie restent ceux de la simulation libre.

## Proposition de gameplay : « Rallumer la tour »

Je propose un mode mission court, distinct de la simulation libre actuelle.
Les deux bots cherchent les mêmes trois ressources, mais alimentent un objectif
commun : restaurer le phare de la tour avant la fin du temps. Leurs points
personnels servent à désigner le bot le plus efficace si la mission réussit.

1. **Explorer les terres.** Les bots contournent les creux du niveau 0
   pour récolter les ressources du niveau 1, puis les déposent aux bases. Une
   livraison met à jour trois besoins visibles de la tour : provisions, débris
   de réparation et cartes action. Les seuils sont calculés à partir du stock accessible de la carte au
   départ, afin qu'une petite carte ne crée pas un objectif impossible.
2. **Ouvrir l'accès au sommet.** Dès que les trois besoins sont couverts, chaque
   base reçoit une charge lumineuse. Le bot doit l'acheminer jusqu'à la tour par
   un trajet légal. Les rampes de niveau 2 deviennent donc des passages clés :
   leur position détermine détour, carburant, exposition aux dangers et risque
   de mine.
3. **Allumer les deux nacelles.** Une charge posée à la tour active la nacelle
   de son bot. Les deux charges allument le phare et gagnent la mission. Si le
   temps expire, si les deux charges ne peuvent plus être apportées ou si les
   bots sont immobilisés, la fin explique précisément ce qui manque. Le score
   individuel départage la contribution des bots sans remplacer la réussite
   commune.

Pour garder la lecture simple, je limiterais d'abord les **niveaux de jeu** à
0–3. La tour, les falaises et les nacelles peuvent avoir davantage d'étages
visuels sans ajouter de nouveaux paliers de déplacement. Un niveau 4 ne serait
utile que s'il crée plus tard un choix nouveau, par exemple un refuge hors de
portée de la marée, accessible par une rampe supplémentaire. La même règle de
pas s'appliquerait alors, sans nouveau système de mouvement.

Cette mission est une proposition de règle ; elle ne modifie pas encore la fin
de partie actuelle. Son premier prototype devra montrer la progression commune,
réserver les charges aux bons bots, et tester la faisabilité des seuils et du
retour sur plusieurs graines et tailles de carte.
