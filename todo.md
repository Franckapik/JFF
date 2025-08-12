--TODO

Peut tu desormais corriger, refondre le calcul de chemin pour que ce dernier se fasse de tuile en tuile vers une position cible selectionnée au hasard parmis les tuiles walkables. Tu peux retirer toutes les solutions temporaires, ou les corrections simplifiées pour donner un code plus réel/dynamique. Le décalage de position du mesh lors de l'animation est toujours visible actuellement. Tu peux implementer le retour à la base pour le mode returning également. 

Pour que copilot puisse etudier un git diff :

git diff a9fd96bcf02b355d1fa77645ad78051549f48319...HEAD > old_vs_new.patch

L'animation ne se lance pas car il semblerait que le vaisseau ne met plus à jour sa position de depart dans le context. 
Log au survol de la souris sur la scene.

La logique de déplacement du vaisseau doit se refaire par la suppression des ancines fichiers d'animation (js). Il faut redemander de faire un deplacement selon BFS, en utilisant le store, pour atteindre la tuile cible lors de l'état correpondant. Le fonctionnement des drones pour certains aspects doit etre pris en référence. Mais peut-etre pas le systeme de position car pour le drone il depend de fleet ou surtout du vaisseau. On doit s'inspirer probableùent de selectTargetTileInRadiusForDrone qui Utilise un algorithme BFS basé sur les GridCoordinate et le système de voisins.



Les handlers pour le ship viennent d'etre créés. Il faut mainetannt que l'animation corresponde bien. Pour cela, les events doivent etre envoyés depuis le tracker et non pas par des timeout d'action d'effets. 
Il faut comprendre pourquoi le vaisseau ne bouge pas tout d'abord vers la position target lors de movetotile.
Ensuite , la reflexion devra porter sur l'utilisation des fonctions importées des actions d'effets utilisant les sends depuis les trackers pour que cela soit plus judicieux d'avoir les send que du meme coté. 

----DONE

La logique mise en place pour les actions se fait via le dossier domains. Les "actions" sont séparées selon :
- assign : maj du context
- actions : actions avec effets de bords (requetes api par exemple). Ici seulement des logs d'état.

Il reste donc la génération des fichiers à commencer par exploring pour que le drone effectuent tout les mouvements. Le dossier "actionold" contient logiquement le fonctionnement ancien de ces différentes fonctions.

Le cycle de mise a jour des etats du drone via les assign context fonctionne. 
Il faut desormais remplir les actions d'effets dans scanning et returning pour que les events soient bien envoyés. Ces actions doivent etre dans explorations/actions.effects.ts comme pour evaluation/actions.effects.ts !
