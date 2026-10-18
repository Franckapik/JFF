# Audit de l'agrandissement du plateau à deux couronnes

Le périmètre retenu est un hexagone de rayon **5** au lieu de **3** : **91 tuiles** au lieu de **37** (`1 + 3r(r + 1)`). Les mesures ci-dessous décrivent le code **avant** la mise en œuvre et servent de référence de comparaison. Le rayon est désormais choisi à la création d'une partie, entre 2 et 8 couronnes, avec 5 par défaut.

La mise en œuvre rend la station de carburant connue des deux bots dès le départ, adapte le cadrage, le fond sous-marin et la côte au rayon, et transmet la taille dans le snapshot partagé. Sur les mêmes 30 graines de rayon 5, les parties bloquées sont passées de **11 à 2** ; les deux restantes concernent le remorquage d'un vaisseau immobilisé, encore à définir. Le contenu des tuiles centrales n'est pas conservé lorsqu'on change le rayon d'une graine.

## Résultat

Changer uniquement `RULES.mapRadius` de 3 à 5 ne suffit pas. La génération et les calculs de distance acceptent déjà le rayon 5, mais le rendu masquerait une partie du plateau et l'équilibre actuel produit davantage de parties bloquées. Il faut traiter ensemble le cadrage, le fond décoratif, la présentation des bases, le ravitaillement et les contrats de test.

| Vérification | Rayon 3 | Rayon 5 | Lecture |
| --- | ---: | ---: | --- |
| Tuiles | 37 | 91 | +54, soit 2,46 fois la taille actuelle. |
| Bases | `-3,0` et `3,0` | `-5,0` et `5,0` | Distance directe entre bases : 6 puis 10 pas. |
| Cartes valides sur les graines 0 à 199 | 200/200 | 200/200 | Aucun échec de génération, de connexité, d'équité des trajets vers les services ni de conservation des 10 unités spéciales. |
| Tuiles de ressources moyennes sur ces 200 graines | 23,71 | 61,08 | La quantité de nourriture et de débris croît aussi fortement ; les ressources spéciales restent fixes. |
| Parties terminées avec vainqueur sur les graines 0 à 29 | 26/30 | 19/30 | Simulation à règles identiques, arrêt à 1 000 000 ms logiques. |
| Parties bloquées sur ces 30 graines | 4/30 | 11/30 | 9 blocages avec ressources restantes, réserve faible et station jamais découverte ; 2 avec vaisseau immobilisé. Échantillon exploratoire, pas une estimation fiable du taux global. |

Les simulations ont été lancées sur les mêmes graines avec `generateWorld(seed, radius)`, `GameSession`, `advance(1_000_000)` et `assertInvariants()`. Les cartes étaient déterministes, les ressources conservées et aucune simulation ne lançait d'exception. Les mesures de performance ou de rendu ci-dessous sont locales et ne remplacent pas un essai en navigateur.

## Placement et calculs qui s'adaptent déjà

- [`world.ts`](../src/engine/world.ts) construit les coordonnées axiales jusqu'au rayon demandé, les six voisins, les bases à `±radius,0`, les paires de terrain et de ressources symétriques, puis vérifie la connexité avant de retenir les obstacles. `hexDistance`, `hexLine`, `worldPosition`, les parcours BFS et les trajets vers les services ne dépendent pas d'une liste fixe de tuiles. Le générateur accepte les rayons 2 à 8.
- Les candidats aux stations sont calculés depuis les deux bases et le rayon. Une seule station de carburant et une seule station de réparation sont placées ; la différence de trajet depuis les bases reste d'au plus un pas. Sur les 200 graines vérifiées, le trajet le plus long vers un service atteint 7 pas au rayon 5, contre 5 au rayon 3 dans les 30 premières graines.
- [`visibility.ts`](../src/engine/visibility.ts) borne la vision par le monde présent et tient compte des obstacles. Le rayon d'exploration maximal de 3 est une capacité du bot, distincte du rayon de la carte : il peut rester à 3 si l'on veut conserver la progression actuelle. Les scans, mines et chemins de drone utilisent des distances hexagonales et les coordonnées existantes.
- [`session.ts`](../src/engine/session.ts) calcule les stocks initiaux depuis le monde, vérifie leur conservation, cherche les tuiles et les bords réellement présents, et détermine la fin à partir des ressources accessibles. Les marqueurs, la sélection et les instances des tuiles dans [`GameView.tsx`](../src/components/session/GameView.tsx) prennent la taille de `world`. L'atelier Rapier crée aussi un collider par tuile.

## Constats relevés avant la mise en œuvre

### 1. Rendu et sélection des nouvelles tuiles

Le fond sous-marin de [`EndlessSeabed.tsx`](../src/components/session/EndlessSeabed.tsx) retire uniquement les coordonnées de rayon 3 de son champ décoratif. Au rayon 5, il créerait 54 hexagones décoratifs sous les nouvelles tuiles jouables. La découpe doit provenir des coordonnées réelles de `world`, ou du rayon de la carte, et ne doit jamais intercepter les clics sur le plateau.

La caméra de [`GameView.tsx`](../src/components/session/GameView.tsx) part d'une position fixe et `OrbitControls` limite la distance à 26. Une projection géométrique avec le cadrage actuel montre que, pour un canevas de 900 × 650 pixels, 19 des 91 centres de tuiles de rayon 5 sortent du champ initial ; pour 320 × 450 pixels, 28 en sortent. Ces tailles sont des cas d'essai, pas des captures du navigateur. Calculer le cadrage initial et la distance maximale depuis les bornes du monde et le rapport largeur/hauteur ; vérifier ensuite les tuiles extrêmes, le clic, les panneaux et le zoom sur ordinateur et mobile.

[`terrainPresentation.ts`](../src/engine/terrainPresentation.ts) réserve un niveau visuel particulier aux anciennes bases `q = ±3, r = 0`. Les nouvelles bases `±5,0` perdraient ce relief. Il faut dériver cette présentation des tuiles `base` ou du rayon actif. Les transitions de couleur de l'eau dans [`FloodStage.tsx`](../src/components/session/FloodStage.tsx) sont également réglées sur des distances mondiales fixes (3,5 à 13 et 4,2 à 8,5) ; inspecter leur rendu à la nouvelle côte et les ajuster si l'eau devient visuellement trop profonde sur les tuiles extérieures. Le nombre d'instances du rivage s'adapte déjà à `world`.

### 2. Carburant, objectifs et fin de partie

Le bot consomme 2 unités par pas et le drone 1 par hexagone aller-retour ; la base ne ravitaille pas. [`affordableRoute()`](../src/engine/session.ts) vérifie un retour vers la station seulement si le bot l'a déjà découverte, sinon vers la base. [`plan()`](../src/engine/session.ts) peut alors ramener le bot à sa base avec trop peu de carburant pour atteindre la station ou une nouvelle frontière. Sur les 30 graines de rayon 5, 9 blocages laissent encore des ressources sur la carte avec les deux bots finis à leur base, à 0–13 unités de carburant, sans qu'aucun ait découvert la station. Les graines 6, 9, 12, 13, 16, 20, 23, 26 et 27 reproduisent ce cas. Les graines 11 et 21 finissent bloquées après immobilisation d'un vaisseau à 100 % de dégâts ; ce remorquage est déjà hors du contrat actuel.

Avant d'activer le rayon 5, revoir la découverte du carburant, le trajet de retour exigé par `affordableRoute()`, et la décision prise à la base lorsque la réserve est faible. Garder les invariants de stock et de budget. Mesurer ensuite les parties par graine avec [`balance-session.mjs`](../scripts/balance-session.mjs) et comparer les causes de blocage, les réparations, les pertes de drone, la durée et les ressources restantes. Le simple passage du rayon 3 au rayon 5 porte les ressources moyennes de 1 431 à 3 677 unités de nourriture et de 859 à 2 223 débris sur 200 graines ; les 10 unités spéciales ne changent pas. La durée et la densité d'actions doivent donc être acceptées ou rééquilibrées explicitement.

### 3. Contrats, mesures et transition de session

La partie utilise `RULES.mapRadius`, mais l'argument par défaut de `generateWorld(seed)` reste codé à 3. Clarifier ce contrat lors de l'implémentation : aligner le défaut sur la taille active et rendre les tests de petites cartes explicites, ou conserver ce défaut comme outil de test clairement nommé. Pour la graine 42, générer le rayon 5 change le contenu de **34 des 37** coordonnées de l'ancien plateau, car l'ordre des tirages dépend du rayon ; les bases se déplacent aussi. Une carte agrandie ne conserve donc pas le centre existant. Si cette conservation est voulue, il faut revoir la méthode de génération, pas seulement son rayon.

Les tests de [`session.test.ts`](../src/engine/session.test.ts) et les scénarios [`initialization.feature`](bot-spec/scenarios/initialization.feature) et [`initialization-fairness.feature`](bot-spec/scenarios/initialization-fairness.feature) contiennent `37`, `±3,0` et des limites de trajet de rayon 3. Ajouter des vérifications du rayon 5 pour plusieurs graines, les voisins extérieurs, le nombre de tuiles, les services, les ressources, les trajets et une session qui termine ; conserver les cas de rayon 3 comme tests explicites si utiles. Le validateur Gherkin ne joue pas les scénarios, il en contrôle uniquement la syntaxe et les identifiants.

Le benchmark [`benchmark-session.mjs`](../scripts/benchmark-session.mjs) compare les rayons 3 et 8 ; ajouter le rayon 5, car c'est la nouvelle taille de production. Sur une mesure locale indicative de la graine 42, le snapshot initial passe d'environ 8,3 à 17,5 ko ; sur au plus 1 000 ticks de 100 ms, le p95 `advance + snapshot + JSON` passe de 2,8 à 3,7 ms. Ce relevé ne mesure ni le GPU ni les appareils mobiles. Les glyphes, le rivage et les colliders Rapier croissent avec le nombre de tuiles ; vérifier aussi les images par seconde lorsque l'atelier physique est activé.

La session vit dans un `SharedWorker` partagé entre onglets. Une mise à jour du code ne redimensionne pas la partie déjà en cours : prévoir un reset ou une nouvelle session pour voir le nouveau rayon, et contrôler le cas d'onglets ouverts pendant la transition. Le format du snapshot reste identique si seule la taille du monde change ; une migration de sauvegarde n'est pas en jeu ici.

## Plan issu de l'audit

1. Décider si le nouveau plateau peut être régénéré entièrement ou doit conserver les 37 tuiles centrales. Définir si les 10 unités spéciales et l'unique station de chaque type restent souhaitées sur 91 tuiles.
2. Passer la taille active au rayon 5, aligner la génération par défaut, puis protéger la géométrie, la symétrie, les services et les ressources avec des tests ciblés.
3. Corriger le trou du fond décoratif, le relief des bases et le cadrage adaptatif ; vérifier le rendu et la sélection aux six extrémités du plateau, y compris sur mobile.
4. Corriger ou rééquilibrer les décisions de carburant, puis comparer un lot de graines identiques avec le script de balance. Consigner séparément les blocages dus au carburant et ceux dus à l'immobilisation, puisque cette dernière mécanique reste à définir.
5. Ajouter le rayon 5 au benchmark, mettre à jour les scénarios et la documentation de la taille active, lancer `npm run validate`, puis essayer `/vue1` et `/vue2` avec deux onglets et une nouvelle session.
