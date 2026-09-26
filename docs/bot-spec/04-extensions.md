# Prochain travail avec Copilot

Le socle valide par Q01-Q20 est clos sur la cible locale. Aucune fonction
ci-dessous n'est implicitement livree ou autorisee pour cette cloture.
Ordre de travail propose : une extension a la fois, avec ses regles et ses
criteres acceptes avant implementation.

## E01. Rendre les scenarios executables

Prochaine tranche recommandee : relier progressivement les scenarios aux
tests existants, en commencant par `COL-02`, `COL-03`, `DANGER-03`, `END-05`
et `END-06`. La syntaxe Gherkin est deja controlee ; les etapes ne sont pas
encore executees.

Livrable : correspondance explicite scenario/test, fixtures reutilisables et
execution reproductible des premiers cas, sans doubler toutes les suites.
Acceptation : un changement volontaire de capacite ou de timing doit faire
echouer le cas correspondant ; les cas non relies restent signales comme tels.

## E02. Graphe de diagnostic de la machine active

Ajouter un graphe et des transitions observes, derives de `botMachine` et
des snapshots, avec choix du bot et details d'operation. Ne pas reutiliser
le graphe historique comme s'il representait le nouveau moteur.

Acceptation : aucun effet de gameplay depuis le graphe ; chaque etat affiche
correspond a l'acteur ; navigation clavier et mobile ; chargement a la demande.

## E03. Grandes cartes selectionnables

Exposer les rayons 2 a 8 dans les commandes de nouvelle partie. Le generateur
et le benchmark couvrent deja les limites, pas le workflow utilisateur.

A definir : parametres de partie dans le protocole, adaptation camera et
budgets par taille. Acceptation : reset partage, replay de la configuration,
carte entiere cadree et non vide, mesure 217 tuiles sur la cible retenue.

## E04. Sauvegarde et reprise

Definir la duree de retention, le lieu de stockage et l'arbitrage entre onglets.
Un export JSON de diagnostic n'est pas encore une sauvegarde restaurable.

Livrable : format versionne et valide comprenant monde, comptes, pertes,
connaissances, etats aleatoires, operations restantes, horloge et ordre
d'arbitrage. Recreer les acteurs, ne pas serialiser leurs references.
Acceptation : continuation identique avant/apres restauration, invariants,
rejet des formats incompatibles et migrations explicites.

## E05. Dangers mobiles

A trancher avant code : cadence, destinations autorisees, collisions,
effets sur un drone en vol ou un service en cours, protection des bases.

Contrainte : mouvements planifies par l'horloge de session. Le cache actuel
des chemins sans danger suppose un terrain fixe ; il devra etre invalide
ou remplace lors d'une modification de topologie. Acceptation : routes
recalculees, un seul effet par collision et replay deterministe en pause/pas.

## E06. Interruptions individuelles d'urgence

Definir les etats interruptibles et le sort de la cargaison, du trajet,
du drone, du temps restant et des transactions deja effectuees.
La pause globale actuelle ne remplit pas cette fonction.

Acceptation : aucune completion tardive d'une operation annulee, aucun
double transfert, conservation des ressources et priorites documentees.
Traiter avec E05 si les dangers mobiles doivent interrompre les operations.

## E07. Plusieurs drones par bot

Definir prix, capacites, rayons, missions concurrentes et politique de
remplacement. Ne pas multiplier les timers ni donner a chaque drone une
copie du stock partage.

Acceptation : transactions serialisees, missions identifiees, pertes et
retours rattaches au bon vaisseau, nouveaux budgets de snapshots et rendu.

## E08. Cartes arbitraires et equite mesurable

Seulement si l'import de cartes ou des departs variables est souhaite :
definir les tolerances de distance, ressources et acces aux services, ainsi
que le nombre maximal de tentatives. Ne pas reutiliser une boucle de
regeneration a contraintes progressivement relachees sans decision explicite.

Acceptation : rapport initial immutable, refus explicite d'une carte invalide,
pas de certification d'equite basee sur les ressources deja consommees.

## E09. Autres navigateurs et appareils reels

Definir une matrice precise, notamment la disponibilite de SharedWorker,
les pertes de contexte WebGL et le retour d'un onglet mis en veille.
Mesurer sur appareils physiques avant toute promesse de performance mobile.

Acceptation : budgets materiel, scenes cadrees, controles tactiles/clavier,
reconnexion multi-onglets et mesures de memoire longue duree. Les mesures
Linux/Chromium actuelles ne valent pas homologation de cette matrice.

## Demarrage de la prochaine session

Demande suggeree : "Implementer E01 sur les cinq scenarios prioritaires,
reutiliser les fixtures et tests du socle, signaler les scenarios non relies,
puis executer le controle complet. Ne pas commencer E02-E09."

Avant toute autre extension : nommer son identifiant, arreter ses regles,
mettre a jour le contrat et les scenarios, puis exiger `npm run validate`
et les controles visuels/performance pertinents. Ne pas reouvrir les
arbitrages deja valides sans demande du concepteur.
