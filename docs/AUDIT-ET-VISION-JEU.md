# JFF : audit du jeu et vision créative

État observé le 27 septembre 2026 dans le code du dépôt. Ce document distingue
les fonctions présentes des propositions. Les règles du socle restent définies
par [le contrat métier](bot-spec/03-contrat-et-questions.md).

## Ce qui existe et ce que le joueur ressent

| Domaine | Fonction présente | Effet dans l'expérience |
| --- | --- | --- |
| Partie | Deux bots autonomes parcourent la même carte hexagonale symétrique de 37 cases, produite par une graine. | Les décisions des deux camps créent des courses et des rencontres imprévues. |
| Exploration | Chaque bot possède sa vision, son souvenir du terrain et ses scans. Les obstacles coupent la ligne de vue. | Le joueur découvre le monde par fragments et peut comparer deux points de vue. |
| Économie | Trois ressources, compartiments séparés, collecte partielle, dépôts, budget, extensions du drone. Le stock de la carte est partagé. | La compétition a des conséquences vérifiables : une ressource prise par un bot manque à l'autre. |
| Risques | Carburant commun au vaisseau et au drone, dégâts, réparation, perte du drone, remorquage et élimination. | Les trajets et les mauvais scans ont un coût ; le retour à la base compte. |
| Fin | Derniers dépôts avant le classement, égalité possible, état `blocked` sans vainqueur inventé. | Les comptes sont justes, même quand la situation est insoluble. |
| Interface | Terrain WebGL, inspection de tuile, changement de vision, pause, pas de 100 ms, vitesses 1 à 8, graine et nouvelle carte. Diagnostic et mode expert par bot. | Le système est observable et reproductible, avec une vraie richesse pour qui aime comprendre les bots. |
| Architecture | Un `SharedWorker` détient l'horloge et l'état pour les onglets d'une même origine. Les vues lisent ses snapshots. | Terrain et diagnostic racontent la même partie. Cela ne connecte pas deux personnes sur des appareils différents. |

### Les forces à préserver

- La carte symétrique, les graines et l'arbitrage des transactions fournissent
  une base solide pour des défis partageables.
- La vision individuelle et les événements structurés permettent de raconter
  *pourquoi* une action a eu lieu, sans inventer une histoire après coup.
- La conservation des ressources et la distinction score/budget rendent les
  résultats crédibles.
- Le format court de la carte actuelle se prête à une partie de 90 à 120 secondes
  avec un objectif immédiatement visible.

### Les freins de plaisir actuels

1. **Peu d'action du joueur.** Il choisit ce qu'il regarde et contrôle le temps,
   mais ne change aucune décision du bot pendant la partie. C'est une bonne
   simulation à regarder ; la boucle de jeu humain reste à créer.
2. **Enjeu peu incarné.** « Accumuler le plus de ressources » ne donne pas encore
   de raison affective de suivre un trajet ou de craindre la perte d'un drone.
   Le diagnostic explique beaucoup ; la scène raconte peu.
3. **Tension irrégulière.** Sur 37 cases, la réserve de 100 carburants et les
   retours fréquents rendent la panne rare en jeu normal. Le rapport
   [Paramètres des bots](PARAMETRES_COMPORTEMENT_BOTS.md) le relève déjà.
4. **Lecture simultanée limitée.** Le terrain montre une vision à la fois et le
   panneau principal suit le bot regardé. Les conflits pour une même tuile,
   les occasions manquées et le chemin vers la victoire demandent une lecture
   plus immédiate.
5. **Partage encore technique.** Le JSON exporté décrit un état, sans reprendre
   une partie ; il n'y a ni rejeu des choix humains, ni défi par lien, ni partie
   distante. Le `SharedWorker` ne résout que les onglets locaux.
6. **Une connaissance IA à clarifier.** Pour une case déjà connue mais hors du
   champ actuel, le planificateur lit encore son stock réel au lieu d'un
   souvenir daté. Le brouillard visuel cache bien ce stock au joueur ; la règle
   de connaissance de l'IA mérite un choix explicite avant un mode tactique.
7. **Budget de rendu à surveiller.** Le build passe, mais Vite signale le chunk
   `GameView` d'environ 911 ko avant compression. Une scène plus riche devra
   être mesurée sur des téléphones réels avant de fixer son ambition visuelle.

La validation locale avec Node 22.20.0 passe : types, 51 tests Vitest, syntaxe
des 10 fichiers Gherkin, lint et build. Les 67 scénarios existants produisent
78 cas après développement des exemples ; leurs étapes ne sont pas exécutées.
Aucun contrôle sur navigateur ou téléphone réel n'a été mené pour cet audit.

### Scénarios du socle à lire en premier

| Scénario existant | Ce qu'il protège | Lecture produit |
| --- | --- | --- |
| [`MULTI-02`](bot-spec/scenarios/multi-bot.feature) | Deux échéances concurrentes sont arbitrées par la même horloge. | Une course au même trésor a un résultat cohérent. |
| [`COL-03`](bot-spec/scenarios/collection.feature) | Deux collectes ne prennent pas deux fois le même stock. | La rivalité se voit dans le monde, sans duplication magique. |
| [`EXP-07`](bot-spec/scenarios/exploration.feature) | Inconnu, vision actuelle et souvenir sont distincts. | Le brouillard raconte ce que le bot a réellement vu. |
| [`DANGER-03`](bot-spec/scenarios/danger-tiles.feature) | Le drone est perdu dès son arrivée sur un danger. | Un scan risqué peut créer un moment dramatique immédiat. |
| [`END-01`](bot-spec/scenarios/game-over.feature) | Les cargaisons restantes sont déposées avant le classement. | Le résultat final ne coupe pas une action prometteuse. |
| [`END-05`](bot-spec/scenarios/game-over.feature) | Une impasse est signalée sans vainqueur artificiel. | Le jeu admet clairement une situation insoluble. |

## Le jeu à imaginer : « Les Éclaireurs de poche »

**Promesse :** transformer un objet du quotidien en minuscule île vivante,
guider deux robots curieux par de rares signaux, et sauver ensemble un phare
avant la nuit. Leurs scores personnels gardent une rivalité légère.

Le plateau ressemble à une maquette en papier et en bois posée sur un bureau.
Les drones sont de petits pliages lumineux. Chaque livraison redonne de la
couleur à une partie de l'île ; une réparation fait physiquement apparaître
une pièce du phare. La caméra s'approche brièvement d'un danger ou d'un dépôt,
puis rend la main. Les sons sont courts et informatifs : hélice, pièce qui
s'emboîte, signal de retour. Les chiffres précis restent accessibles en mode
expert.

### Une partie en 120 secondes à vitesse normale

1. **Créer.** Choisir une île prête à jouer ou photographier un objet. Une
   couleur, quelques formes et une graine déterminent la maquette. Une ville
   choisie peut donner sa météo de départ. Le but et les trois besoins du phare
   sont annoncés sur le plateau.
2. **Guider.** Les bots explorent et ramènent nourriture, débris et fragments
   spéciaux. Toutes les 15 secondes de temps logique, le joueur pose une balise
   sur une case visible : « explore ici » ou « collecte ici ». Le bot concerné
   en tient compte à sa prochaine décision, si l'ordre est encore faisable.
   Ses opérations en cours vont à leur terme.
3. **Conclure.** Les dépôts des deux bots alimentent le phare commun. La mission
   se termine quand ses besoins sont satisfaits ou lorsque le temps expire ;
   aucun dépôt n'est crédité à distance. Si le phare est complet, l'île
   s'allume et le meilleur score personnel donne le « portrait du héros ».
   Sinon, l'épilogue montre ce qui a manqué et propose de rejouer la même île.

La surprise mémorable tient dans la transformation : **la tasse, le livre ou
le morceau de tissu photographié devient une île de jeu**, puis une maquette
réparée. La caméra apporte une matière et une identité ; la stratégie reste
lisible sur la grille hexagonale.

### Pourquoi cette idée convient au moteur actuel

- Les bots autonomes gardent leur caractère. Une balise est une préférence
  ponctuelle dans `plan()`, pas une télécommande permanente.
- Les ressources et les dépôts existants nourrissent directement les trois
  besoins du phare. Le score et le budget actuels restent des comptes séparés.
- Un mode « mission courte » peut coexister avec la simulation libre et son
  classement actuel. Il possède ses propres règles de fin et fixe la vitesse à
  1x pour que son compte à rebours corresponde à l'expérience annoncée.
- La recette de partie est figée au départ : version des règles, graine, image
  réduite à des paramètres, météo relevée et commandes datées. C'est la base
  nécessaire à un rejeu exact, y compris si la météo change ensuite.

Pour l'implémenter, la balise doit devenir une commande validée par le
`SessionHost` avec l'identité de partie courante, un coût et une échéance
explicites. Le worker l'enregistre, puis `plan()` la consomme à une prochaine
décision légale ; la vue ne modifie pas le bot directement. La recette, les
balises acceptées et les résultats doivent apparaître dans le snapshot ou un
journal versionné avant de promettre un défi rejouable. Les seuils du phare
doivent être calculés sur une carte jouable et testés sur plusieurs graines.

## Web : des API qui changent quelque chose au jeu

| Interaction | Rôle concret | Premier usage raisonnable |
| --- | --- | --- |
| Caméra `getUserMedia` ou fichier image | Échantillonner localement une palette et des motifs pour générer l'apparence d'une île ; le relief peut rester symétrique pour préserver l'équité. | Bouton « Créer depuis un objet », une capture, puis fermeture du flux caméra. Un modèle prêt à jouer si l'accès est refusé. Aucun envoi de photo. |
| Météo via Open-Meteo | Donner une ambiance datée à l'île : pluie sur le carton, vent dans les hélices, lumière du ciel. Plus tard, une seule règle simple de vent peut influer sur le coût du vol. | Ville choisie par le joueur, relevé figé à la création et valeurs de repli si le service manque. Attribution et licence vérifiées avant diffusion. |
| Microphone + `AnalyserNode` | Un souffle ou un claquement devient le geste d'un unique « écho » qui révèle une couronne de cases. | Geste facultatif : le même pouvoir existe au clic ou au clavier ; seules des mesures sonores locales sont utilisées. |
| Lien de défi | Transmettre la recette de l'île et comparer deux fins sur la même matière. | Un lien contenant seulement des paramètres compacts, sans photo ni localisation précise. Le rejeu exact ajoute le journal des balises. |
| WebRTC `RTCDataChannel` | Deux personnes pilotent chacune un bot sur le même plateau. | Étape ultérieure : canal de commandes et d'événements, avec signalisation et hôte autoritaire à concevoir. Le canal seul n'assure pas la synchronisation du jeu. |

La caméra et le microphone demandent une permission et un contexte sécurisé.
Le joueur doit toujours pouvoir jouer avec souris, clavier ou tactile. Pour
une première version, **la caméra est l'expérience web distinctive** ; météo,
microphone et jeu distant viennent seulement après une partie courte réussie.

Sources de faisabilité : [MediaDevices/getUserMedia (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia),
[AnalyserNode (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode),
[API météo Open-Meteo](https://open-meteo.com/en/docs),
[conditions d'usage Open-Meteo](https://open-meteo.com/en/pricing),
[WebRTC Data Channels (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels).

## Scénarios Gherkin proposés pour une nouvelle tranche

Ces scénarios décrivent le **mode mission envisagé**. Ils ne figurent pas dans
les 67 scénarios du socle et ne prétendent pas être implémentés.

```gherkin
Fonctionnalité: Guider les éclaireurs dans une mission courte

  Scénario: Comprendre le but dès l'arrivée
    Étant donné une nouvelle mission de 120 secondes
    Quand le plateau apparaît
    Alors les trois besoins du phare et le temps restant sont visibles
    Et une action « poser une balise » est expliquée en une phrase
    Et les deux bots commencent à agir sans attendre une commande

  Scénario: Poser une balise sans interrompre une opération
    Étant donné qu'un bot collecte et qu'une balise est disponible
    Quand le joueur lui désigne une case visible et atteignable
    Alors la collecte en cours se termine normalement
    Et la balise influe sur la prochaine décision faisable de ce bot
    Et la balise est consommée une seule fois

  Scénario: Refuser un ordre devenu impossible
    Étant donné qu'un bot a reçu une balise de collecte
    Et que l'autre bot vide la case ciblée avant sa prochaine décision
    Quand le premier bot choisit sa prochaine action
    Alors il ne se dirige pas vers un stock inexistant
    Et l'interface explique que la balise est devenue caduque

  Scénario: Créer une île sans transmettre la photographie
    Étant donné que le joueur autorise une capture de caméra
    Quand il valide sa photographie
    Alors la palette et la graine sont calculées dans le navigateur
    Et le flux caméra est arrêté
    Et une nouvelle partie avec la même recette produit la même île

  Scénario: Jouer sans permission de caméra
    Étant donné que le joueur refuse la caméra
    Quand il choisit une île prête à jouer
    Alors la mission démarre avec les mêmes commandes et objectifs

  Scénario: Figer la météo d'une mission
    Étant donné qu'une ville et un relevé météo daté ont créé l'île
    Quand la météo réelle change pendant la partie
    Alors les règles et le rendu de cette partie restent fondés sur le relevé initial
    Et rejouer sa recette ne demande pas un nouveau relevé

  Scénario: Réparer le phare et expliquer le résultat
    Étant donné que les dépôts cumulés atteignent les trois besoins affichés
    Quand la mission se termine
    Alors le phare s'allume sur le plateau
    Et les contributions des deux bots et leur score personnel sont visibles
    Et le joueur peut rejouer la même recette
```

Les scénarios actuels les plus proches sont
[`COL-03`](bot-spec/scenarios/collection.feature),
[`EXP-07`](bot-spec/scenarios/exploration.feature),
[`DANGER-03`](bot-spec/scenarios/danger-tiles.feature) et
[`END-01`](bot-spec/scenarios/game-over.feature). La première étape qualité
reste le raccordement exécutable des scénarios prioritaires décrit par
[E01](bot-spec/04-extensions.md).

## Ordre de création conseillé

| Étape | Livrable montrable | Question à trancher en jouant |
| --- | --- | --- |
| 1. Partie courte | Objectif du phare, compte à rebours, une balise par bot, fin illustrée, trois événements mis en scène. Carte actuelle de 37 cases. | Est-ce qu'un joueur comprend son pouvoir et veut rejouer ? |
| 2. Matière vivante | Import d'image puis caméra facultative ; palette et motif calculés localement ; recette partageable. | Est-ce que l'objet photographié change vraiment l'attachement à l'île ? |
| 3. Monde du jour | Météo figée, ambiance et éventuellement une règle de vent testée sur les mêmes graines. | Est-ce que l'effet météo crée un choix intéressant ? |
| 4. Deux personnes | Défi asynchrone par recette, puis partie distante si le jeu court tient seul. | La présence d'un autre joueur améliore-t-elle la décision ? |

**Critère de la première vignette :** quelqu'un comprend l'objectif en dix
secondes, pose au moins une balise, voit une conséquence sur le plateau et
obtient une fin en deux minutes. Trois parties consécutives ne doivent pas
finir sur une impasse incompréhensible. C'est le point de passage avant
d'ajouter les API externes.
