# JFF

Simulation de deux bots dans un monde hexagonal partage. Le moteur et l'horloge
sont detenus par un SharedWorker ; les vues Terrain et Diagnostic lisent les
memes snapshots. Le mode expert detaille les evenements et statistiques d'un bot.

## Demarrer

Node 22.12 ou plus recent est requis. Le depot indique Node 22 dans `.nvmrc`.
Avec `nvm`, lancer `nvm install && nvm use` avant `npm ci`. Les commandes `npm run`
activent automatiquement la version du depot si `nvm` est installe, y compris
dans un terminal non interactif. `npm ci` refuse une version incompatible.

```bash
npm ci
npm run dev
```

- `/vue1` : terrain, selection du bot et mode expert.
- `/vue2` : diagnostic de la session partagee.
- `npm run validate` : types, tests, scenarios Gherkin, lint et build.
- `npm run preview -- --host 127.0.0.1` : servir le build.

La barre de session permet de choisir de 2 à 8 couronnes avant de rejouer une
graine ou de créer une nouvelle carte. Le choix par défaut est de 5 couronnes,
soit 91 tuiles. La station de carburant est repérée dès le départ par les deux
bots afin qu'ils puissent planifier leur retour malgré la taille du plateau.

La vue Terrain présente six niveaux de relief : fond marin 0, terres basses 1,
terrasses 2 et 3, rampes 4, tour 5. Les creux côtiers restent cachés et
infranchissables. Leur placement symétrique et variable dessine une côte moins
géométrique. Les bots ne franchissent qu'un niveau à la fois ; les deux rampes
opposées donnent accès à la tour. Une dorsale au niveau 3 relie les bases et les
stations. La mer monte réellement pendant la partie : les niveaux 1 puis 2
deviennent impraticables et leurs ressources ne peuvent plus être collectées.
Un drone peut encore les explorer. Un bot surpris par la submersion est ramené
à sa base et perd sa cargaison. La tour ne change pas encore les conditions de
victoire. La proposition de mission associée figure dans
[Relief et mission de la tour](docs/RELIEF-ET-MISSION.md).

La vue Terrain contient aussi un atelier Rapier 3D indépendant des règles de la
partie, activable avec « Afficher ». Une pile de blocs apparaît près du bot affiché. Sélectionner une
autre tuile puis cliquer « Empiler ici » déplace la pile ; « Lancer une bille »
teste les collisions, « Onde de choc » la stabilité, et un clic direct sur un
bloc le pousse. « Caisses sur trajet » place des corps mobiles devant le bot
affiché ; mettre en pause avant de les placer facilite l'observation. Son
vaisseau possède un corps cinématique qui suit sa position animée,
pousse les caisses au passage et incrémente le compteur de contacts Rapier.
« Masquer » retire l'atelier. Ces collisions ne modifient pas encore les
décisions ni les scores des bots.

Le nuage électrique apparaît après chaque palier de six nouvelles tuiles
explorées, à deux tuiles au moins des deux vaisseaux, s'il n'est pas déjà
présent. Il dérive d'une tuile toutes les 2,4 secondes et se dissipe après
10 secondes, avec un fondu à l'apparition et à la disparition. Son effet ne
concerne que la tuile qu'il occupe : un vaisseau en contact subit des dégâts ;
un drone rebondit en sens inverse vers le bord du plateau, puis visite une
tuile aléatoire avant de revenir. Le détour peut conduire le drone sur une
tuile dangereuse. Le nuage reste caché hors de la vision actuelle du bot
sélectionné.

Chaque vaisseau dispose aussi d'un drone offensif. Quand un adversaire visible
se déplace, le bot peut poser une mine sur sa prochaine tuile traversable,
y compris une tuile de ressources ou de service. La mine se superpose au
terrain et s'arme en 800 ms. Pendant ce délai, l'adversaire la voit si elle
est dans son rayon et en mémorise la position. Une mine armée explose au
contact d'un vaisseau ou d'un drone d'exploration, puis disparaît ; le
vaisseau subit les dégâts d'une tuile dangereuse. Le bot contourne une mine
mémorisée si un trajet sûr existe ; il utilise le drone offensif pour la
neutraliser lorsqu'elle bloque son prochain pas. La neutralisation produit
une explosion contrôlée sans dégâts.

Les trois compteurs du bot sont les points, le budget et les actions. Les
« Provisions » (anciennement nourriture) déposées donnent les points de
victoire. Les débris déposés créditent le budget des achats et réparations.
Les ressources spéciales déposées donnent des actions ; la pose effective
d'une mine consomme une action. Chaque tuile ressource contient une seule
trouvaille de 1 unité, parfois 2 pour les provisions ou les débris. Les
provisions sont courantes, les débris moins fréquents et les cartes action
rares : sur la carte par défaut, ces dernières occupent deux paires
symétriques. Après un scan ou une arrivée du vaisseau, un symbole 3D flotte et tourne au-dessus de la
tuile ; il disparaît après la collecte. Les capacités sont de 8 provisions,
8 débris et 2 cartes action. Les dépôts cumulés restent dans le bilan interne,
mais ne figurent pas parmi les compteurs courants.

Les dégâts réduisent le rayon effectif d'un hexagone dès 50 %, puis doublent
la durée des pas du vaisseau dès 70 %. À 100 %, le vaisseau est immobilisé sur
sa tuile avec sa cargaison : le remorquage de cette panne reste à définir. La
réparation coûte 3 unités de budget, crédité uniquement par les débris déposés.
Elle n'est possible que sur la station dédiée, qui doit attendre 40 s après
chaque service avant de réparer à nouveau.

Le drone offensif peut aussi scanner une tuile : son rapport donne le nombre
de mines ennemies dans un rayon de deux hexagones et la distance de la plus
proche, sans révéler sa position exacte. Le joueur et le bot reçoivent le
même rapport. Le souvenir d'une mine ennemie expire après 10 s ; le bot peut
acheter à sa base deux améliorations de mémoire (20 puis 40 s, pour 3 puis
5 débris). Un avertissement signale une mine ennemie à un hexagone ou
moins. La pose coûte 4 unités de carburant, le scan et la neutralisation 2,
en plus du même coût de vol aller-retour que le drone d'exploration.

## References actuelles

- [Architecture et limites du socle](docs/SOCLE_ACTUEL.md)
- [Direction graphique du plateau](docs/DIRECTION-GRAPHIQUE-PLATEAU.md)
- [Relief et mission de la tour](docs/RELIEF-ET-MISSION.md)
- [Audit du jeu et vision créative](docs/AUDIT-ET-VISION-JEU.md)
- [Audit de l'agrandissement du plateau à deux couronnes](docs/AUDIT-AGRANDISSEMENT-PLATEAU.md)
- [Contrat metier valide](docs/bot-spec/03-contrat-et-questions.md)
- [Scenarios du socle](docs/bot-spec/scenarios/README.md)
- [Audit de la visibilite et du gameplay](docs/bot-spec/05-audit-visibilite-gameplay.md)
- [Extensions envisagees](docs/bot-spec/04-extensions.md)
- [Mode expert](docs/AUDIT-MODE-EXPERT-BOT.md)
- [Parametres des bots](docs/PARAMETRES_COMPORTEMENT_BOTS.md)
- [Commandes et mesures](scripts/README.md)

Les anciennes implementations et leurs analyses restent consultables dans
l'historique Git. Les fichiers presents constituent la reference de travail.
