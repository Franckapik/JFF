--TODO
L'initialisation se fait dpeuis la scene avec un guard de controle avant de passer à evaluating. FAIT
Le travail en cours est la position du vehicle en WorldGridPosition. Cela permet une comprehension dans le viewer des deplacements. Attention a bien surveiller les perf. FAIT

A faire : 
- recherche d etuiles pour l'explorzation en fonction d'un radius réel indiqué depuis le store. FAIT

Je suis rendu là. J'ai commenté la fonction tileInRadius afin de comprendre comment elle fonctionne et si cette derniere utilise bien la compraison range et distance.

Déja :
shipPosition peut desormais changer de type car la position du vaisseau est de type WolrdGrid desormais. FAIT

- regarder le systeme de comptage de tuiles explorées. A indiquer dans le viewzer. FAIT
- permettre la collection en fonction du compte d'exploration selon un chiffre deifnis dans le store. FAIT
- s'assurer que le score soit bien en place et visible depuis le viwer egalement.
- le chemin doit ensuite vraiment se faire de tuiles en tuile pour le vehicle.

Refondre la fonction permettant de calculer le chemin en fonction des tuiles pour essayer de resoudre ce probleme de decalage et eviter de donner la possibilité de faire du direct path mais plutot une erreur bloquante.


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

✅ EXPLORATION DOMAIN MIGRATION COMPLETE (Phase 11 - 23 déc 2025):
- actions.assign.ts : ✅ Toutes les actions assign complètes (assignDroneDeployingContext, assignDroneScanningContext, assignDroneReturningContext, assignDroneDockedContext)
- actions.effects.ts : ✅ Nettoyées pour ne contenir que des logs (plus de setTimeout)
- guards.ts : ✅ AUCUN GUARD (BY DESIGN - processus séquentiel event-driven, pas de branchements conditionnels)
  * Le guard shouldExplore() existe dans evaluation/guards.pure.ts (décision d'ENTRER dans l'exploration)
  * DANS l'exploration: transitions automatiques basées sur events physiques (position/timer)
  * Pattern: Event-driven (DRONE_REACHES_TILE, DRONE_HAS_SCANNED, DRONE_REACHES_BASE) pas condition-driven
- handlers/ : ✅ Tous les handlers complétés:
  * deployingHandler → envoie DRONE_REACHES_TILE
  * scanningHandler → envoie DRONE_HAS_SCANNED après 2s (logique métier)
  * returningHandler → envoie DRONE_REACHES_BASE
- ARCHITECTURE: Les events sont maintenant envoyés depuis les TRACKERS, pas depuis les actions d'effets
- SEPARATION: FSM indépendant de R3F, testable en terminal
- Pattern établi: Effect Zone (logs only) → Tracker Zone (send events) → Guard Zone (pure decisions)



-----MEMOIRE-------

Le vaisseau apparaît au bon endroit lorsque tu utilises { x: 0, y: 0, z: 0 } pour initialPosition car :

Le <group> parent positionne le Fleet à la position de la tuile de départ :
Dans Fleet, si tu utilises initialPosition={x: 0, y: 0, z: 0}, le mesh du vaisseau est placé à l'origine locale du <group>, donc il hérite directement de la position du parent (la tuile de départ).
Si tu mets une valeur différente dans initialPosition, tu ajoutes un offset relatif à la position du <group>, ce qui décale le mesh.
En résumé :
La position réelle du vaisseau dans la scène = position du <group> + position locale du Fleet.
Mettre { x: 0, y: 0, z: 0 } garantit qu’il n’y a pas de décalage supplémentaire : le vaisseau est exactement sur la tuile de départ.

Si tu observes un offset avec d’autres valeurs, c’est parce que tu combines la position du parent et celle du Fleet, ce qui crée un doublon de translation.
Pour éviter tout décalage, garde initialPosition à zéro et utilise uniquement la position du <group> pour placer le vaisseau sur la tuile.

Je disposes d'un FSM géré avec xstate. Un monitor (xstate-viewer) avec un brodacast me permets de voir les états et évolution des valeurs. La console dans le navigateur web me permets de voir les logs que je peux copier ici. Le visuel de r3f me permets de controler le comportement. Mais, je reste insatisfait vis à vis de la manière d'avanacer au fur et à mesure de la complexité du projet. Des branches postérieures m'ont permis de trouver mes besoins réels :

les guards doivent etre purs et 100% testables : les corriger.
les stores doivent etre utilisés aux bons endroits pour laisser plus de pouvoir aux tests.
les résultats doivent etre visibles dans le terminal de VScode pour povoir laisser plus d'autonomie à copilot : le but ultime est de pouvoir tester les guards et les cycles complets depuis le terminal. Attention à ne pas inserer trop de complexité ou de code sur lequel je n'aurais plus aucun controle.
peut-on envisager une certaine independance de xstate vis à vis de react three fiber ? Je comprends que les positions et interactions seront issues de r3f, mais comment pouvoir faire évoluer le code avec copilot en terminal, selon des tests très rapides sans trop intervenir sur r3f ?
contraindre au maximum avec ES lint et TS.
le worflow devrait etre j'observe, je passe dans Xstate, je recoit une commande ? J'ai peur de refaire la meme erreur en ajoutant une couche d'abstraction complexe.
EN résumé, il faut contraindre, sécuriser, rendre le FSM independant, et visible depuis le terminal vscode.
Les fichiers readme pourraient etre distribués egalement lorsqu'il y a des pratiques de generation de code à suivre pour diriger l'écriture systematiquement. Les commentaires pourraient/devraient aussi pouvoir aider.
Un fichier copilot instruction bien evidemment.


Que faire des liens guards et xtstaes ? 
Options pour Phase 2:

Soit injecter availableTiles: Tile[] dans le contexte FSM
Soit créer un service externe qui gère les queries spatiales
Soit utiliser un actor XState dédié pour les queries de tiles
Pour l'instant, on la garde deprecated mais fonctionnelle.

Le contexte FSM doit etre clair vis à vis de la séparation avec les stores Zustand. Comment le contraindre, quelle limite choisir?


Je dois faire une liste permettant de comprendre les poitn sobligatoire pour le bon déroulement d'un cycle :

App : Scene :
