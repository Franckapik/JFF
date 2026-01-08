* il y a un bloacage en EVAL a diagnostiquer. Visible sur main actuellement. D'ou provient-il ? Comment le resoudre via le log ? Est-ce lié a explorable undefined? NOn  peut-etre pas mais plutot au danger dynamique.

* Le cloud donne-il des damages en fonction du bot desormais?

* Le bot evite-il les dangers ? PLus maintenant mais le drone destroyed est à mettre en place.
  ✅ RÉSOLU : Architecture achat drone asynchrone documentée dans docs/DRONE_PURCHASE_ARCHITECTURE.md
  - Achat instantané avec compteur dronesInConstruction
  - Tracker gère délai de construction (3s) en arrière-plan
  - Bot continue à agir pendant construction (collecte, maintenance)
  - Drone activé après construction via événement DRONE_CONSTRUCTION_COMPLETE
  
  📋 TODO: Implémenter l'architecture (voir checklist dans doc) 

* Pathfinding à remettre en place. (BFS) EN cours : meilleurs visualisation à faire, vérifier la logique et ajouter un composant montrant les paths sous forme de liste.

* Le bot doit choisir/utiliser la station repair ou refuel

* assurer les memes conditions de départ.

* est-il possible d'avoir un mode ultra rapide? 

* comment dynamiser la vue pour faire un affichage de battle avec un bot qui gagne ou non ? 

* avoir un meilleur log beaucoup moins verbeux.


Le danger dynamique pourrait renvoyer plutot un drone vers une tuile aléatoire ? C'est plus fun et serait considéré comme un brouillard electromagnetique. Cela peut avoir des conséquences positives et negatives. Ce nuage pourrait etre plus gros (6 tuiles?). Avec une logique peut-etre differente vis a vis du changement des propriétés des tuiles car j'ai l'impression que cela absorbe certaines tuiles comme les stations par exemple. 

Une possibilité de modifier le terrain ? 

Un module de perception des mines serait vraiment interessant. Serais-ce une carte techno?
Une téléportation serais interressante peut-etre ? Quel interet finalement ? Une augmentation de vitesse de vaisseau/drone serais plus sympa.





Quel objectif final pour le jeu?
- montrer aux autres
- pouvoir jouer moi meme
- le décliner en jeu réel
- proposer un multijoueur