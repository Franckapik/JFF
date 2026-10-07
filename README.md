# JFF

Simulation de deux bots dans un monde hexagonal partage. Le moteur et l'horloge
sont detenus par un SharedWorker ; les vues Terrain et Diagnostic lisent les
memes snapshots. Le mode expert detaille les evenements et statistiques d'un bot.

## Demarrer

Node 22.12 ou plus recent est requis.

```bash
npm ci
npm run dev
```

- `/vue1` : terrain, selection du bot et mode expert.
- `/vue2` : diagnostic de la session partagee.
- `npm run validate` : types, tests, scenarios Gherkin, lint et build.
- `npm run preview -- --host 127.0.0.1` : servir le build.

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
d'une mine consomme une action. Le plateau initial contient dix unités
spéciales, réparties en cinq paires symétriques. Les dépôts cumulés restent
dans le bilan interne, mais ne figurent pas parmi les compteurs courants.

Les dégâts réduisent le rayon effectif d'un hexagone dès 50 %, puis doublent
la durée des pas du vaisseau dès 70 %. À 100 %, le vaisseau est immobilisé sur
sa tuile avec sa cargaison : le remorquage de cette panne reste à définir. La
réparation coûte 30 unités de budget, crédité uniquement par les débris déposés.
Elle n'est possible que sur la station dédiée, qui doit attendre 40 s après
chaque service avant de réparer à nouveau.

Le drone offensif peut aussi scanner une tuile : son rapport donne le nombre
de mines ennemies dans un rayon de deux hexagones et la distance de la plus
proche, sans révéler sa position exacte. Le joueur et le bot reçoivent le
même rapport. Le souvenir d'une mine ennemie expire après 10 s ; le bot peut
acheter à sa base deux améliorations de mémoire (20 puis 40 s, pour 50 puis
100 points). Un avertissement signale une mine ennemie à un hexagone ou
moins. La pose coûte 4 unités de carburant, le scan et la neutralisation 2,
en plus du même coût de vol aller-retour que le drone d'exploration.

## References actuelles

- [Architecture et limites du socle](docs/SOCLE_ACTUEL.md)
- [Direction graphique du plateau](docs/DIRECTION-GRAPHIQUE-PLATEAU.md)
- [Audit du jeu et vision créative](docs/AUDIT-ET-VISION-JEU.md)
- [Contrat metier valide](docs/bot-spec/03-contrat-et-questions.md)
- [Scenarios du socle](docs/bot-spec/scenarios/README.md)
- [Audit de la visibilite et du gameplay](docs/bot-spec/05-audit-visibilite-gameplay.md)
- [Extensions envisagees](docs/bot-spec/04-extensions.md)
- [Mode expert](docs/AUDIT-MODE-EXPERT-BOT.md)
- [Parametres des bots](docs/PARAMETRES_COMPORTEMENT_BOTS.md)
- [Commandes et mesures](scripts/README.md)

Les anciennes implementations et leurs analyses restent consultables dans
l'historique Git. Les fichiers presents constituent la reference de travail.
