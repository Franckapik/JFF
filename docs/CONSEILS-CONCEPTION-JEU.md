# 84 conseils pour concevoir un jeu

Ce guide propose des principes applicables à différents genres de jeux. Chaque conseil est illustré par **JFF / Le Phare des deux refuges**, le jeu en construction dans ce dépôt. Les exemples remplacent volontairement les citations de jeux connus : ils permettent de passer directement d'une idée générale à une décision concrète pour ce projet.

**Légende.** **Actuel** décrit une règle ou une fonction présente dans le projet au 22 octobre 2026. **À essayer** désigne une hypothèse de conception, pas une fonction promise ni déjà réalisée. Une bonne idée reste à valider en jouant.

## 1. Trouver la promesse du jeu

1. **Décrivez le jeu par ce que l'on fait, pas par sa technologie.** Une phrase comme « guider deux bots autonomes sur une île qui disparaît sous la marée » dit davantage au joueur que la liste des bibliothèques utilisées. **Actuel :** JFF réunit précisément ces trois éléments.
2. **Choisissez l'émotion dominante.** Curiosité, tension, maîtrise et attachement peuvent coexister, mais une émotion doit guider les premiers choix. **À essayer :** faire de la curiosité pour les décisions des bots le cœur de JFF, puis vérifier si les joueurs la ressentent vraiment.
3. **Donnez au jeu une particularité mémorisable.** La différence doit changer l'expérience, pas seulement la présentation. **Actuel :** le joueur observe des bots qui décident seuls et peut leur adresser une balise ponctuelle ; c'est une piste plus distinctive qu'un simple plateau hexagonal.
4. **Formulez le rôle du joueur sans ambiguïté.** « Je commande », « je conseille » et « j'observe » créent des attentes différentes. **Actuel :** la balise de JFF influence la prochaine décision faisable du bot, après ses urgences ; elle ne le télécommande pas.
5. **Rendez l'objectif compréhensible avant les sous-systèmes.** Le joueur doit savoir ce qu'il essaie d'obtenir avant de comprendre chaque règle. **Actuel :** les provisions déposées donnent les points de victoire. **À essayer :** afficher ce but avant les détails sur les mines et les améliorations.
6. **Faites correspondre fiction et règle.** Si la fiction annonce un phare à sauver, la victoire devrait dépendre du phare. **Actuel :** la tour est surtout un repère et le trésor n'ajoute pas de points. **À essayer :** réserver la mission du phare à un mode dont les conditions de réussite sont explicites.
7. **Définissez ce que le jeu ne contient pas encore.** Un périmètre net aide à terminer une version jouable. **À essayer :** pour la prochaine vignette de JFF, choisir une seule nouveauté centrale, par exemple une fin de partie plus parlante, avant d'ajouter météo, multijoueur ou éditeur.

## 2. Construire une boucle de jeu complète

8. **Écrivez la boucle principale en trois verbes.** Un joueur doit pouvoir la raconter après une partie. **Actuel :** dans JFF, les bots explorent, collectent puis déposent ; la balise donne au joueur une intervention au sein de cette boucle.
9. **Faites arriver une première conséquence rapidement.** Les débuts silencieux font croire que rien ne répond. **À essayer :** dans les premières secondes, montrer un scan, une ressource identifiée et la raison d'un déplacement, avant que le joueur ouvre le mode expert.
10. **Reliez chaque tour de boucle à un changement visible.** Explorer doit révéler, collecter doit vider une case, déposer doit faire progresser un compte. **Actuel :** ces changements existent dans le moteur ; leur mise en scène peut encore mieux raconter la progression.
11. **Donnez une raison de recommencer la boucle.** Une action répétée doit produire de nouvelles situations ou de nouveaux choix. **Actuel :** la carte à graine, le stock partagé et la marée modifient les opportunités au cours d'une session.
12. **Prévoyez un cycle court et un objectif de session.** Le cycle court procure du plaisir immédiat ; l'objectif de session donne une direction. **À essayer :** faire de « repérer puis ramener une trouvaille » le cycle court et du classement final l'objectif annoncé.
13. **Fermez la boucle par une réponse claire.** Après une action du joueur, montrez ce qu'elle a changé. **Actuel :** la balise affiche « en attente », « suivie » ou « caduque ». **À essayer :** relier visuellement la balise au trajet réellement choisi.
14. **Testez la boucle avant d'ajouter du contenu.** Une carte plus grande ne résout pas une action qui manque d'intérêt. **À essayer :** vérifier sur la carte de cinq couronnes si poser une balise est déjà satisfaisant avant de concevoir davantage de types de cases.

## 3. Créer de vraies décisions

15. **Proposez des choix aux conséquences différentes.** Deux boutons qui mènent presque au même résultat ne forment pas une décision. **Actuel :** la balise « Explorer ici » cherche de l'information ; « Collecter ici » tente de convertir une ressource déjà scannée en cargaison.
16. **Donnez un coût d'opportunité aux choix.** Choisir une cible doit parfois signifier en laisser passer une autre. **Actuel :** une seule balise est disponible par partie ; sa rareté rend le moment de pose important.
17. **Mettez le temps dans l'équation.** Une ressource vaut différemment selon le temps nécessaire pour l'atteindre. **Actuel :** la marée rend des niveaux impraticables ; une collecte lucrative peut donc devenir trop tardive.
18. **Évitez la stratégie toujours gagnante.** Si « viser les provisions » domine toute la partie, les autres ressources deviennent décoratives. **Actuel :** les débris financent réparations et améliorations, les ressources spéciales alimentent les actions ; testez si leur valeur indirecte se ressent assez.
19. **Opposez gain immédiat et capacité future.** Un bon dilemme demande parfois de retarder le score. **Actuel :** un bot peut consacrer son budget à améliorer son drone ou le garder pour une réparation.
20. **Laissez la situation modifier la valeur d'un choix.** Une règle simple devient profonde quand le contexte change. **Actuel :** une case proche peut devenir risquée à cause d'une mine, du nuage, du niveau d'eau ou de l'épuisement de son stock.
21. **Annoncez les décisions qui engagent longtemps.** Un choix irréversible mérite une meilleure explication qu'une simple sélection. **Actuel :** la balise est consommée une fois ; l'interface doit rendre cette dépense claire avant et après l'envoi.

## 4. Enseigner en faisant jouer

22. **Enseignez d'abord la prochaine action utile.** Un tutoriel exhaustif surcharge la mémoire. **À essayer :** commencer par « choisissez la vision d'un bot, sélectionnez une case, posez votre balise », puis présenter économie et mines au moment où elles comptent.
23. **Montrez une règle avant de la détailler.** Une animation de dépôt rend le score plus concret qu'un paragraphe. **Actuel :** le dépôt crédite des compteurs distincts ; **à essayer :** montrer brièvement quel compteur vient de changer.
24. **Introduisez une idée nouvelle à la fois.** Si marée, mine et nuage arrivent ensemble, le joueur ne sait plus attribuer les conséquences. **À essayer :** régler les premières minutes ou un scénario d'accueil pour isoler successivement ces systèmes.
25. **Prévoyez une première expérience peu punitive.** La découverte doit encourager l'essai. **À essayer :** proposer une première balise facile à suivre sur une case visible et sûre, sans faire croire que toutes les balises seront toujours exécutées.
26. **Expliquez les limites d'un ordre au moment de l'ordre.** La promesse de l'interface doit correspondre à la règle. **Actuel :** le bot termine son opération et traite ses urgences avant la balise ; ce délai mérite une explication courte près du bouton.
27. **Faites de l'échec une information.** « Impossible » n'aide pas à apprendre. **Actuel :** une balise peut devenir caduque ; **à essayer :** distinguer « ressource déjà prise », « case submergée » et « trajet impraticable » lorsqu'une raison précise est connue.
28. **Gardez une profondeur facultative.** Les curieux doivent pouvoir examiner les détails sans en faire un passage obligé. **Actuel :** le mode expert de JFF expose événements, route et statistiques ; la vue Terrain peut rester centrée sur les décisions utiles.

## 5. Dessiner un monde qui produit du jeu

29. **Dessinez les connexions avant les décorations.** La forme d'un niveau sert d'abord les déplacements et les rencontres. **Actuel :** JFF utilise des niveaux de relief et n'autorise qu'un pas de hauteur d'écart entre deux cases voisines.
30. **Faites du terrain une contrainte compréhensible.** Un obstacle intéressant pousse à choisir un détour identifiable. **Actuel :** les rampes opposées sont les accès à la tour ; le joueur peut comprendre pourquoi un bot n'y monte pas directement.
31. **Offrez plusieurs routes quand le choix de route compte.** Un passage unique peut produire une course, mais pas beaucoup de tactique. **À essayer :** comparer des graines où la dorsale offre deux détours de coûts différents, sans casser l'accès aux services.
32. **Placez les services pour créer des décisions.** Une station trop commode efface la gestion du carburant ; trop lointaine, elle crée des pannes arbitraires. **Actuel :** les stations sont placées à distance de trajet presque égale des deux bases.
33. **Utilisez des repères visuels pour orienter.** Un lieu reconnaissable facilite la lecture de la carte. **Actuel :** le phare central, la dorsale et les bases donnent déjà une géographie que l'on peut raconter sans coordonnées.
34. **Validez les niveaux générés par leurs propriétés jouables.** Une jolie graine peut être injuste ou bloquée. **Actuel :** la génération vérifie notamment la connexion initiale des cases praticables et l'accès aux services ; conservez ces vérifications si de nouvelles règles de carte apparaissent.
35. **Mesurez l'effet de la taille sur le rythme.** Agrandir une carte change les trajets, la fréquence des rencontres et la valeur du scan. **Actuel :** JFF propose de deux à huit couronnes ; chaque taille mérite un regard sur la durée et la densité de décisions, pas seulement sur le nombre de tuiles.

## 6. Concevoir une économie lisible

36. **Attribuez une fonction simple à chaque ressource.** Le joueur doit pouvoir dire pourquoi il la cherche. **Actuel :** provisions = points, débris = budget, ressources spéciales = actions.
37. **Séparez les comptes qui servent des buts différents.** Un score dépensable brouille la notion de victoire. **Actuel :** JFF crédite les points, le budget et les actions séparément lors du dépôt.
38. **Montrez d'où vient un gain et où part une dépense.** L'économie paraît juste quand ses transactions sont traçables. **Actuel :** les débris déposés financent achats et réparations ; le mode expert affiche les événements correspondants.
39. **Faites sentir la rareté sans affamer le joueur.** Une ressource doit être assez rare pour compter, assez présente pour susciter des plans. **Actuel :** les ressources spéciales occupent deux paires symétriques sur la carte par défaut ; observez si elles déclenchent réellement des décisions.
40. **Utilisez les capacités de transport pour rythmer les retours.** Une limite de cargaison peut rendre le dépôt stratégique. **Actuel :** les compartiments ont des capacités distinctes de 8, 8 et 2 ; un compartiment plein peut motiver un retour même si les autres sont vides.
41. **Conservez les pertes explicites.** Quand une cargaison disparaît, le joueur doit connaître la cause. **Actuel :** un bot surpris par la marée est replié à sa base et perd sa cargaison ; cette perte doit être racontée au moment de l'incident.
42. **Vérifiez la valeur des améliorations par des situations.** Un achat n'est intéressant que s'il change ce que l'on peut faire. **Actuel :** le rayon du drone peut augmenter ; testez des cartes où cette portée ouvre un scan utile, et d'autres où garder le budget pour réparer est préférable.

## 7. Faire jouer des personnages autonomes

43. **Donnez à une IA des intentions que l'on peut nommer.** « Va se ravitailler », « veut collecter » ou « évite une mine » est plus lisible qu'un changement de coordonnées. **Actuel :** les bots de JFF portent déjà un objectif et une décision dans leur état.
44. **Définissez la place exacte de l'intervention humaine.** Plus une IA est autonome, plus le joueur doit connaître son levier. **Actuel :** la balise exprime une préférence ponctuelle ; les besoins de sécurité restent prioritaires.
45. **Montrez pourquoi un bot ignore une demande.** Une IA silencieuse semble désobéir au hasard. **Actuel :** une balise infaisable expire avec une raison ; **à essayer :** afficher cette raison dans la scène au moment où le bot choisit autre chose.
46. **Limitez l'IA aux informations auxquelles elle a droit.** Le joueur accepte mieux une défaite contre une IA qui respecte les mêmes règles de connaissance. **Actuel :** chaque bot a sa propre vision et ses scans ; contrôlez les décisions fondées sur le souvenir des stocks hors du champ actuel.
47. **Faites émerger une personnalité par des priorités, pas seulement par un nom.** Deux bots identiques produisent peu d'attachement. **À essayer :** tester une légère différence de prudence ou de curiosité, à condition que le duel reste intelligible et équilibré.
48. **Rendez les surprises attribuables à une cause.** L'imprévu amuse s'il peut être raconté après coup. **Actuel :** le nuage peut détourner un drone vers une autre tuile ; l'événement mérite un signal visuel et une explication courte.
49. **Donnez une conséquence aux relations affichées.** Une jauge sociale peut raconter le passé, mais si elle promet une influence future, elle doit modifier une décision. **Actuel :** la confiance entre bots varie et apparaît à l'écran ; **à essayer :** soit préciser qu'elle est un indicateur narratif, soit prototyper un effet limité et testable.

## 8. Régler risque, difficulté et équité

50. **Annoncez les risques que le joueur peut raisonnablement anticiper.** Un danger caché peut surprendre, mais la punition ne doit pas paraître gratuite. **Actuel :** les mines en cours d'armement peuvent être repérées, puis mémorisées pendant une durée limitée.
51. **Laissez une réponse au danger.** Une menace devient un choix quand on peut contourner, attendre, neutraliser ou accepter la perte. **Actuel :** un bot peut éviter une mine connue ou envoyer son drone offensif la neutraliser lorsqu'elle bloque le prochain pas.
52. **Faites correspondre le gain au risque.** Traverser une case dangereuse doit parfois être défendable, jamais automatiquement optimal. **Actuel :** JFF peut accepter un raccourci risqué vers une ressource de valeur élevée si les dégâts connus restent supportables.
53. **Prévoyez des chemins de récupération.** Une erreur intéressante change le plan au lieu de terminer immédiatement la partie. **Actuel :** carburant, remplacement du drone et réparation offrent des reprises possibles, sous conditions de budget et de trajet.
54. **Distinguez défaite et impasse technique.** Une partie sans action possible mérite un état expliqué. **Actuel :** JFF peut terminer en état « bloqué » sans attribuer artificiellement un vainqueur.
55. **Augmentez la difficulté par des contraintes lisibles.** Une marée plus pressante est compréhensible si ses effets sont visibles ; une probabilité cachée de punition l'est moins. **À essayer :** tester des variantes de durée ou de relief avant d'ajouter de nouveaux dégâts.
56. **Vérifiez l'équité au départ, puis acceptez les écarts créés par le jeu.** L'équité n'exige pas des parties identiques. **Actuel :** les ressources initiales sont symétriques ; les choix, dangers et courses au stock partagé créent ensuite l'asymétrie intéressante.

## 9. Donner un rythme et une fin

57. **Choisissez une durée cible vécue, pas seulement une durée logique.** Une simulation rapide peut paraître longue si rien ne demande l'attention. **Actuel :** JFF permet pause et vitesses de 1× à 8× ; mesurez le temps pendant lequel le joueur regarde vraiment.
58. **Organisez la session en phases perceptibles.** Début, compétition pour les ressources et derniers retours aident à comprendre la progression. **Actuel :** la session passe déjà à une phase de retour quand les ressources accessibles sont épuisées.
59. **Laissez des respirations entre les incidents.** Si chaque instant est une alerte, aucune alerte ne ressort. **À essayer :** mesurer la fréquence des nuages, mines, collisions et pertes sur quelques graines, puis laisser des moments de simple exploration.
60. **Construisez un crescendo à partir d'une règle connue.** Une tension qui monte paraît juste quand sa cause était visible. **Actuel :** la mer monte et ferme progressivement les niveaux bas ; afficher les tuiles bientôt menacées rendrait cette montée plus lisible.
61. **Arrêtez la partie quand son enjeu est résolu.** Prolonger une fin acquise dilue le souvenir. **Actuel :** JFF attend les derniers dépôts avant le classement ; c'est cohérent avec un score qui ne compte que les ressources ramenées.
62. **Expliquez le résultat par quelques causes majeures.** Un simple « victoire » ne raconte pas la partie. **À essayer :** après la fin, montrer le score, le dépôt décisif et un ou deux tournants comme un drone perdu ou une ressource submergée.
63. **Faites du rejeu une nouvelle hypothèse.** « Recommencer » est plus tentant si l'on peut essayer autre chose. **Actuel :** la même graine et la même taille peuvent être rejouées ; **à essayer :** suggérer « placer la balise plus tôt » ou « suivre l'autre bot ».

## 10. Rendre l'état du jeu lisible et accessible

64. **Hiérarchisez l'information selon la décision du moment.** Une donnée n'a pas besoin d'être toujours visible pour être utile. **Actuel :** Terrain et Diagnostic sont séparés ; gardez le score, la balise et les urgences dans la vue de jeu, les statistiques détaillées dans le mode expert.
65. **Distinguez voir maintenant et se souvenir.** Une case connue mais hors du champ n'apporte pas la même certitude. **Actuel :** JFF sépare inconnu, souvenir assombri et champ visible ; ce langage visuel doit rester cohérent jusque dans l'inspecteur de tuile.
66. **Associez chaque changement important à un signal de cause.** Un compteur qui bouge sans explication oblige à chercher dans les journaux. **À essayer :** une courte annotation près de la base lors d'un dépôt et près du vaisseau lors d'un dégât.
67. **Affichez les nombres qui soutiennent une décision.** Trop de chiffres repoussent l'attention, trop peu rendent les choix arbitraires. **Actuel :** carburant et dégâts ont un effet direct sur les trajets ; leur niveau mérite davantage de place que les statistiques cumulées pendant le jeu.
68. **Ne codez pas un sens seulement par la couleur.** Les formes, textes et états doivent porter la même information. **À essayer :** garder des pictogrammes distincts pour danger, ressource et service, et une étiquette lisible pour les alertes de mine ou de nuage.
69. **Offrez des commandes de temps qui respectent l'observation.** Pause, pas à pas et accélération peuvent être des outils de compréhension. **Actuel :** JFF possède ces commandes ; vérifiez que le joueur sait quand utiliser 1× pour décider et 8× pour attendre.
70. **Testez sur la surface réelle visée.** Une interface lisible sur grand écran peut devenir obscure au toucher. **À essayer :** faire poser une balise et lire la fin de partie sur un vrai téléphone, avec zoom, doigts et orientation habituels.

## 11. Faire travailler ensemble récit et esthétique

71. **Choisissez une direction visuelle qui soutient la règle.** Le style sert à distinguer les hauteurs, les ressources et le danger. **Actuel :** JFF adopte un atlas crayonné ; ses contours et pictogrammes doivent rester lisibles quand la marée recouvre le terrain.
72. **Laissez les systèmes produire des histoires.** Une histoire émergente vient d'une suite d'actions causales. **Actuel :** deux bots peuvent viser la même ressource, l'un la prendre, l'autre changer de plan ; c'est déjà un récit court à mieux mettre en scène.
73. **Donnez au décor une fonction de mémoire.** Un lieu marquant aide le joueur à se rappeler ce qui s'est passé. **Actuel :** le phare peut servir de repère central pour raconter un détour, une course ou une montée des eaux.
74. **Gardez des métaphores cohérentes.** Une réparation, une amélioration et un dépôt doivent sembler appartenir au même monde. **À essayer :** si JFF s'oriente vers une maquette de papier et de bois, relier les effets visuels des trois opérations à cette matière.
75. **Réservez les animations aux changements utiles.** Un mouvement attire l'œil ; utilisez-le pour informer. **À essayer :** animer brièvement un chemin suivi après une balise et une case condamnée par l'eau, avant d'ajouter des particules décoratives.
76. **Employez le son pour confirmer une action.** Un son bref peut signaler découverte, dépôt ou urgence sans exiger la lecture d'un panneau. **À essayer :** prévoir aussi un équivalent visuel et un réglage de volume, afin que le jeu reste jouable sans son.
77. **Reliez les effets spectaculaires à la boucle principale.** Une interaction physique amusante peut rester un atelier séparé tant qu'elle ne modifie pas les choix. **Actuel :** les objets Rapier de JFF n'influent ni sur score ni sur décisions ; **à essayer :** n'en intégrer un aux règles qu'après avoir défini son effet sur une décision.

## 12. Tester et terminer sans perdre l'idée

78. **Écrivez une hypothèse avant un ajout.** « La balise donne l'impression de guider le bot » se vérifie mieux que « ajouter une meilleure IA ». **À essayer :** observer si les joueurs posent la balise, comprennent son délai et voient son effet.
79. **Fabriquez la plus petite version qui teste l'idée.** Une esquisse jouable révèle plus qu'une longue spécification. **À essayer :** tester une fin de partie avec trois faits saillants en texte avant de construire une cinématique du phare.
80. **Regardez quelqu'un jouer sans lui expliquer le jeu.** Ses hésitations révèlent les défauts d'interface et de promesse. **À essayer :** noter le premier regard, la première action et le moment où la personne peut expliquer le score.
81. **Mesurez les comportements, pas seulement les impressions.** Les retours verbaux gagnent à être complétés par des faits. **À essayer :** relever sur quelques parties la durée, le moment de la balise, les balises suivies ou caduques, les fins bloquées et les causes principales de perte.
82. **Rejouez les mêmes situations pour comparer.** Sans cas reproductibles, l'équilibrage repose sur des anecdotes. **Actuel :** les graines et les rapports de balance permettent de comparer des changements de règles sur les mêmes cartes.
83. **Séparez clairement règles présentes et idées futures.** Cela évite de tester une promesse que le jeu ne tient pas encore. **Actuel :** le trésor peut être découvert et déposé mais ne donne pas de score ; la mission de rallumer la tour est une proposition distincte.
84. **Fixez un critère de fin pour chaque version.** Un jeu en construction a besoin de jalons terminables. **À essayer :** considérer une vignette JFF « montrable » si une personne comprend le but, pose une balise, observe une conséquence et atteint une fin expliquée en une courte session.

## Pour utiliser ce guide sur JFF

Choisir **trois conseils maximum** pour la prochaine itération. Pour chacun, écrire une hypothèse, une modification jouable et un signe observable de réussite. Par exemple :

| Conseil | Hypothèse | Essai minimal | Signe à observer |
| --- | --- | --- | --- |
| 5 et 22 | Le but est compris avant les détails. | Une phrase de victoire près du plateau au début. | Le joueur peut expliquer ce qui donne des points sans ouvrir Diagnostic. |
| 13 et 45 | La balise paraît efficace même avec un délai. | Montrer l'état « en attente », puis la route suivie ou la raison d'expiration. | Le joueur sait raconter ce que sa balise a changé. |
| 60 et 62 | La marée donne une tension lisible. | Signaler les cases bientôt submergées et nommer une conséquence à la fin. | Le joueur anticipe une perte plutôt que de la découvrir après coup. |

### Références internes utilisées

- [Présentation et règles jouables](../README.md)
- [Règles chiffrées du moteur](../src/engine/rules.ts)
- [État de session et événements](../src/engine/model.ts)
- [Contrat métier](bot-spec/03-contrat-et-questions.md)
- [Relief et proposition de mission](RELIEF-ET-MISSION.md)
- [Direction graphique](DIRECTION-GRAPHIQUE-PLATEAU.md)
- [Carnet créatif](../todo.md)
