Il faut que collected : true et la logique associée pour les mouvement etc soit peut etre remplacée par un pourcentage de collecte d'une tuile pour que l'on puisse calculer et déduire plus facilement lors de la collecte.

Il faut supprimer tous les fichiers obsoletes et les docs md.


Il doit y avoir une confiusion dans les basePosition entre drone et ship. Essayer de savoir que faire de idleAtBAse et revoir le guard isNotATBase. Verifier que la position du ship est bien msie a jour egalement. Le tout est d'éviter l'état returning d'urgence.








COmprendre pourquoi plusieurs log sont envoyés pour les transitions et les actions. Revoir la synchronisation des bots et instances. Et essayer de finir le cycle returning vers evaluating par la suppression des fonctions .

Refuel et repair lents sur les bonnes stations.
Les drones ont des limites de deplacements.
Les tuiles peuvent regenerer de la nourriture et des cartes spéciales avec le temps. Les débris sont issus des anciennes batailles (depart) et des dégats eventuels liés au damage.
Le joueur doit alors se souvenir des tuiles explorées.

Je dois mettre a la place du bot.

Le jeu demarre, je dois avoir plus de ressources pour progresser, je vais :
- collecter une tuile :
    - se deplacer vers la tuile
    - collecter les ressources
    - mettre à jour certains états.
- mon deplacement à couter du carburant,  il me faut le plein :
    - je cherche où est la station
    - je bouge vers la station
    - je récupère le carburant
    - je mets à jour mes etats.

- mon carburant me permets de revenir à la base :
    - je cherche ma base
    - je me deplace vers la base
    - je verse mes ressources pour augmenter mon score.


Je souhaite creer un nouvel hud dans le style identique de BotHUD qui donnerait des informations sur une tuile lorsque celle ci est onHover. 



---TODO

Recommandations
Standardiser l'utilisation des types d'événements : Utiliser systématiquement les imports de constantes (RESOURCE_EVENT_TYPES, etc.) au lieu de chaînes littérales.

~~Unifier les définitions d'états : Choisir entre FSM_STATES et BOT_STATES et utiliser une seule source de vérité.~~ ✅ FAIT

Vérifier les transitions manquantes : S'assurer que tous les événements utilisés dans les transitions des états sont correctement définis dans les fichiers d'événements.

Standardiser l'utilisation des reducers : Éviter les mises à jour manuelles du contexte et utiliser systématiquement les reducers centralisés.

Standardiser la structure des guards : Choisir soit l'utilisation directe de guards spécifiques, soit l'utilisation des guards regroupés par catégorie, mais pas les deux approches mélangées.

Documenter les événements temporels : Assurez-vous que tous les événements liés aux timeouts (EXPLORATION_TIMEOUT, etc.) sont correctement définis et documentés.

Implémenter des vérifications automatisées : Créer des tests qui vérifient que tous les événements utilisés dans les transitions sont bien définis dans les fichiers d'événements correspondants.



Les drones doievtne etre placés selon la position definies dans le store et lorsque ces dernieres existent. 

- L'état returning et son action doit etre réécrite selon la structure des autres . 
- Peut etre que le player doit etre initialisé de maniere dynamique pour avoir plsuieurs bots ou plutot qu'un seul store pour deux joueurs (bot et reel)
- Messagerie pour le bot



