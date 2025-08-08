IA arrétée. Reprendre le travail selon historique. Import des actions dans la machine avec untype qui respecte.

APres cete migrtaion en v5, la logique de depart est encore cassée. L'utilisation de always dans evaluating serait peut etre interessante. COmprendre comment le dorne passe de initialised a docked pour le debut. S'assurer que les actions sont bien lancées. 

L'action udpateContext doit avoir un autre nom pour l'evaluation et doit etre située sur le fichier action de evaluating ? Cette fonction permet d'évaluer et d'envoyer un event needQqchose en fonciton des conditions diverses. Ces conditions ne pourraient-elles pas figurer dans les guards de la machine par ailleurs ? Chaque fonction action entry exit devrait etre un .service.ts composés de plusieurs fonctions actions définies dans les actions cores .actions.ts. Chaque service doit juste mettre a jour le contexte pour faire une nouvelle target qui declanche les animations. 

Je dois m'assurer que les actions envoyées soit sur les bons fichiers pour tout les handlers. La modification du contexte par l'établissement d'une nouvelle target position doit etre dans les fichiers.actions.


Le travail dans scanning doit etre de marquer la tuile, transferer les ressources au vaisseau, etc... Je ne sais pas si l'IA peut regarder le backup pour remettre cela en place rapidement ? La logique est simple a demander, et l'on doit utiliser la bonne syntaxe et les types. Elle doit utiliser un radius. ce radisu devrait etre définis dans initial Context comme d'autres valeurs inhérentes au joueur. 

la tuile prise au hasard doit etre une tuile visible. La fonction associée doit etre bien étudiée.

COntinuer d'écrire le fichier initialisation a la main.FInir par arriver à getWalkableTilesInRadius qui doit etre bien nettoyée et contrainte par les types

Exploration du drone selon un radius. 
Afficher dans un hud les tuiles explorées avec leur ressources. 
Ajouter dans evaluating une nouvelle condition pour passer a la collecte.
Travailler sur les lgiques de la collecte.



Le chemin du vaisseau lors des deplacements liés a la collecte doivent utiliser les fonctions utilitaires du fichier tilePathSlice. L'animation du vaisseau doit alors emprunter un chemin calculé qui passe de tuile en tuiles selon les tuiles walkables et voisines. Ainsi, le chemin calculé montre un déplacement réaliste entre les tuiles. 

Je souhaiterais fusionner les deux hud FSM debug panel et FSM bot manager . Le style des deux huds me plait et je te laisse choisir ce qui semble le plus clair et lisible. Je souhaiterais preserver les fonctionnalités suivantes :
- Pouvoir ajouter ou supprimer des bots. 
- status du bot, actif ou non. 
- -compter le nombre d'explorations, de collectepour chaque bot. 
- affiche le fuel, la cible du vaisseau/drone.
- l'heure de derniere MAJ
- le nom du bot, son état actuel, les ressources du vaisseau, la position actuelle du drone/vaisseau et le score du bot.

Les elements suivants sont visibles lorsque l'on clique sur un bouton details :
-La flotte de drones, leurs status et leurs positions.
-les debug data : contexte FSM et historique des evenements. Je souhaite que event et etat soit biens visibles dans cet historique. Pas de taille de police différente mais des couleurs, cicones pour identifier les deux.

Ce nouveau HUD fusioné doit etre positionné sur la droite. Il faut supprimer ensuite les deux huds anciens. 