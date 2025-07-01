

reprendre le travail au niveau de la ligne 64 de la scnene pour la synchronisation avec les bots. => confusion de fonciton ici ? 


Le fichier vehicleConstant doit etre supprimé. Le contenu utilisé dans ce fichier peut etre placé dans le fichier constants.js. Mettre a jour les imports/exports dans le codebase.

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