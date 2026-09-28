# Contrat metier valide

Le concepteur a valide les decisions Q01-Q20 le 26 septembre 2026. Les
premieres evolutions du 27 septembre 2026 ajoutent le brouillard de guerre,
une reserve de carburant commune et les objets de ressources. La reference de cloture du
socle initial est le Linux/Chromium local ; l'affichage mobile a ete emule,
sans certification sur telephone.

## Monde, bots et ressources

- Deux bots concurrents partagent un monde unique. Connaissance, score, budget,
  cargaison et progression restent individuels. Les bases sont fixes,
  symetriques et vides de ressources au depart. La carte initiale garde des
  stocks et une accessibilite symetriques, avec un seul service de chaque type
  place selon la graine a distance de trajet presque egale des deux bases. Elle
  est connectee ; aucune validation generique de cartes arbitraires
  n'est promise.
- Le drone reste rattache au vaisseau mobile et son rayon de scan est centre
  sur le vaisseau.
  Ressources, cases vides et dangers inconnus sont scannables. Bases, stations
  et obstacles sont publics et exclus des objectifs de scan. Un vaisseau
  continue a decouvrir la case ou il arrive si son drone est perdu.
  Une station ne devient une destination de maintenance que lorsqu'elle est
  entree dans le champ de vision de ce bot et reste ensuite dans son souvenir.
- Le plateau affiche par defaut la vision du Bot 0 et permet de choisir celle
  du Bot 1 ou la vision developpeur sans brouillard. Le champ de vision actuel reste centre sur le vaisseau et utilise
  le rayon du drone (1 a 3), meme pendant son vol. Si le drone est perdu, ce
  rayon retombe a 1 autour du vaisseau ; le trajet du drone ne modifie ni le
  brouillard ni la memoire du terrain. Hors de ce champ, une case
  jamais exploree est sombre, meme si elle contient un service ou un
  obstacle ; une case exploree garde seulement le souvenir assombri du terrain.
  Les obstacles visibles coupent la ligne de vue hexagonale : les cases derriere
  eux restent masquees et ne peuvent pas etre ciblees par un scan. Le vaisseau
  peut retrouver la vue sur ces cases en changeant de position.
  Les vaisseaux adverses ne sont visibles que dans le champ actuel. Chaque bot
  conserve son propre terrain explore et ses propres cibles scannees. Les objets
  3D de ressources au sol apparaissent seulement sur les cibles deja scannees par
  le drone de ce bot et encore dans le champ du vaisseau. Une arrivee du
  vaisseau peut toujours identifier et collecter un stock sans creer ces objets
  au sol. Les objets charges suivent le vaisseau et disparaissent quand le
  depot a la base se termine.
  Les dangers dans le champ mais non encore decouverts apparaissent comme du
  terrain non identifie. Le bot ne tient compte dans ses trajets que des dangers
  deja decouverts par son drone ou son vaisseau ; la vision developpeur montre
  tous les dangers et tous les stocks.
- Les intentions realisables sont arbitrees avec un choix probabiliste, apres
  les urgences. Les collectes possibles sont classees notamment par quantite
  et longueur de trajet. Un compartiment plein peut declencher un retour meme
  si les autres ont encore de la place.
- Capacites independantes : nourriture 200, debris 1 800, special 3. Une
  collecte peut etre partielle. Les transactions du stock partage sont
  serialisees. Le depot a sa propre base credite score cumule et budget ; les
  achats ne debitent que le budget.

## Deplacements, services et dangers

- Le vaisseau et son drone utilisent la meme reserve de 100 carburants.
  Chaque pas du vaisseau consomme 2 carburants, aller comme retour. Le
  chargement consomme du temps, sans carburant supplementaire. Les trajets
  suivent des cases adjacentes praticables ; une cible sans chemin reste
  inaccessible.
- Un scan consomme 1 carburant commun par hexagone parcouru par le drone a
  l'aller et au retour ; une cible dont l'aller-retour depasse la reserve
  commune est exclue.
- Rayon initial du drone 1, extensions individuelles a 2 pour 50 puis 3 pour
  100 de budget. Un drone perdu fait retomber le rayon de visibilite a 1 ; le
  terrain deja explore reste en memoire. Son remplacement a la base coute 50
  de budget et repart au rayon 1. Chaque extension doit etre rachetee pour
  regagner les rayons 2 et 3.
- A sa base, un service gratuit de 1 200 ms combine depot et reparation, sans
  ravitaillement. Seules les stations carburant remplissent la reserve commune.
  Les stations publiques ne fournissent que leur service specialise. Le
  carburant urgent est a 20 ou sous le cout d'acces au service plus une
  reserve de 3 ; le service a une station carburant remplit toute reserve
  incomplete apres une duree egale a trois pas du vaisseau. La reparation devient
  prioritaire a 50 degats ; entre deux besoins distants, elle est recherchee
  avant le ravitaillement.
- Arrive sur un danger, le drone est perdu et la cible est revelee
  immediatement, sans scan ni retour fictif. Le vaisseau distant est indemne.
  Le vaisseau recoit 10 degats en entrant sur une case dangereuse ; a 100
  degats, il est elimine definitivement.
- Une reserve inferieure au cout d'un pas du vaisseau loin d'un service
  provoque un remorquage de 5 000 ms
  vers sa base avec perte explicite de la cargaison. Si le vaisseau y arrive
  avec zero carburant, il ne peut plus quitter la base. La pause est globale et
  reprend les operations sans les annuler ; aucune interruption individuelle
  d'urgence n'est incluse.

## Fin, comptages et invariants

- Fin normale : ressources accessibles epuisees, puis derniers retours et
  depots. Seuls les bots survivants peuvent gagner ; les meilleurs scores ex
  aequo gagnent ensemble. Aucun survivant ou session `blocked` : aucun
  vainqueur. `blocked` arrete le temps sans depot a distance, destruction ou
  victoire artificiels ; export et nouvelle partie restent possibles.
- Distinguer tentatives de collecte terminees, transferts non vides et tuiles
  distinctes ayant fourni des ressources. La provenance cumule les quantites
  par bot et tuile, meme apres depot ou perte.
- Invariant physique, pour chaque ressource : stock du monde + cargaisons +
  depots cumules + pertes explicites = stock initial. Invariant financier :
  budget + depenses = score depose. La provenance n'est pas un stock a
  additionner au bilan.

## Durees et interfaces

Pas 400 ms ; scan 800 ms hors trajet du drone ; collecte 1 000 ms ; plein
3 pas (1 200 ms actuellement) ; depot et reparation 1 200 ms ; achat ou
extension 1 000 ms ; remorquage 5 000 ms. Les vitesses
1x/2x/4x/8x accelerent la meme horloge. Le terrain, le diagnostic et le mode
expert montrent l'etat reel, la cible, les comptes et les evenements. Un graphe
anime complet des transitions reste une extension.

Le snapshot actif est en `schemaVersion: 5` ; le protocole de commandes reste
en version 1. Le moteur est dans [session.ts](../../src/engine/session.ts),
les valeurs dans [rules.ts](../../src/engine/rules.ts), les controles dans
[session.test.ts](../../src/engine/session.test.ts). Les dix fichiers
[`.feature`](scenarios/README.md) decrivent ces effets ; leur syntaxe et leurs
identifiants sont controles, mais leurs etapes ne sont pas executees.

## Decisions Q01-Q20

| ID | Decision confirmee |
| --- | --- |
| Q01 | Socle actuel ; fonctions absentes en extensions. |
| Q02 | Reference locale Linux/Chromium, mobile emule. |
| Q03 | Bases fixes et symetriques. |
| Q04 | Bases sans ressources initiales. |
| Q05 | Symetrie initiale sans validateur de cartes arbitraires. |
| Q06 | Services et obstacles publics non scannables. |
| Q07 | Decouverte possible par le vaisseau sans drone. |
| Q08 | Heuristiques actuelles de collecte et de retour. |
| Q09 | Seuils et priorites de maintenance ci-dessus. |
| Q10 | Service gratuit combine a sa base en 1 200 ms. |
| Q11 | Aucun carburant facture au chargement. |
| Q12 | Perte du drone et decouverte du danger des l'arrivee. |
| Q13 | Remplacement du drone a sa base pour 50 de budget. |
| Q14 | Pause globale ; interruptions individuelles differees. |
| Q15 | Blocage explicite sans vainqueur ou destruction artificielle. |
| Q16 | Survivants seuls eligibles ; egalites partagees. |
| Q17 | Durees et horloge unique ci-dessus. |
| Q18 | Tentatives, transferts non vides et tuiles distinctes separes. |
| Q19 | Diagnostic actuel ; graphe complet en extension. |
| Q20 | Aucune extension supplementaire dans cette cloture. |

Les fonctions futures sont decrites dans les [extensions](04-extensions.md).
Les deliberations et anciennes versions demeurent consultables dans Git.
