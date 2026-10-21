# Relief et mission de la tour

## Règle jouable aujourd'hui

Le plateau comporte six niveaux : fond marin 0, terres basses 1, terrasses 2 et
3, rampes d'accès 4 et tour centrale 5. Les creux côtiers restent cachés et
infranchissables. Les obstacles bloquent les vaisseaux et la ligne de vue. Un
bot peut passer seulement entre deux voisins secs dont les niveaux diffèrent
au plus de 1. Deux rampes opposées ménagent les derniers pas vers la tour.

La mer monte de -0,12 à 0,78 unité de hauteur pendant les 180 premières
secondes de temps de jeu. Les terres basses puis les terrasses de niveau 2
disparaissent du réseau de déplacement. Une case dont la surface atteint le
niveau de l'eau ne peut plus être parcourue ni collectée. Elle peut toujours
être explorée par drone ; les ressources découvertes restent connues mais
perdues pour la collecte. Un trajet déjà lancé est annulé si son prochain pas
se retrouve sous l'eau. Si la marée rattrape un bot, un repli d'urgence le
ramène à sa base et sa cargaison est perdue.

Les bases, la tour et une dorsale reliant les deux refuges restent au-dessus
de la marée finale. Les stations de carburant et de réparation y sont
raccordées. La génération vérifie la connexion de toutes les cases praticables
au départ, l'accès équilibré aux services et la présence de dix ressources
spéciales. La carte se rétrécit ensuite : la partie s'achève lorsque les
ressources encore accessibles sont épuisées et les cargaisons déposées. Les
ressources sous l'eau restent comptées dans le stock initial, sans empêcher la
fin normale de la partie.

## Proposition de gameplay : « Rallumer la tour »

Je propose de faire de cette marée un compte à rebours lisible pour une mission
commune. Les deux bots restaurent la tour avant la disparition des terres
basses. Leurs points personnels départagent leur contribution si la mission
réussit.

1. **Prélever sur les terres basses.** Les bots explorent et récoltent les
   ressources des niveaux 1 et 2 tant qu'elles émergent, puis les déposent aux
   bases. Les trois besoins de la tour — provisions, débris et cartes action —
   sont visibles. Leurs seuils dépendent du stock accessible au départ.
2. **Gagner les terrasses.** Une fois les besoins remplis, chaque base reçoit
   une charge lumineuse. Un bot doit l'acheminer sur la dorsale de niveau 3,
   franchir une rampe de niveau 4, puis atteindre la tour de niveau 5. Le
   relief impose une route claire, alors que la marée supprime les raccourcis
   bas. Les dangers, mines, détours et réserves de carburant gardent leur rôle.
3. **Allumer les deux nacelles.** Chaque charge active la nacelle de son bot.
   Les deux charges allument le phare. Si le temps expire ou si une charge ne
   peut plus parvenir à la tour, la fin indique ce qui manque.

Cette mission reste une proposition. La fin de partie actuelle conserve le
score individuel et ne demande pas encore d'acheminer des charges à la tour.
