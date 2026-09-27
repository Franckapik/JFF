# Audit de la visibilite et des ressources

Etat du 27 septembre 2026, apres la clarification sur le rayon du drone et
les cibles du scan.

| Regle | Etat du gameplay |
| --- | --- |
| Brouillard individuel | Le menu Terrain affiche le Bot 0 ou le Bot 1. Chaque bot garde son propre souvenir du terrain. |
| Rayon | La vision reste centree sur le vaisseau et utilise le rayon du drone (1 a 3), y compris pendant son vol. Sa destruction ramene aussitot ce rayon a 1 ; le trajet du drone ne revele pas de terrain. |
| Remplacement | Le nouveau drone achete a la base revient avec un rayon de 1. Les extensions 2 et 3 doivent etre rachetees dans l'ordre. Le terrain deja explore reste en memoire assombrie hors du rayon actuel. |
| Obstacles | Un obstacle dans le rayon reste visible, mais bloque la ligne de vue hexagonale vers les cases derriere lui. Ces cases ne sont ni revelees ni scannables avant qu'un autre point de vue ne les expose. |
| Trois etats visuels | Une case jamais exploree est sombre ; une case exploree hors rayon conserve uniquement le terrain assombri ; une case dans le rayon affiche le terrain et les vaisseaux presents. |
| Ressources au sol | Les objets 3D et les quantites dans l'inspecteur apparaissent seulement pour une cible scannee par le drone du bot affiche, encore dans le rayon du vaisseau et avec un stock non nul. Une case seulement atteinte par le vaisseau n'a pas d'objets au sol. |
| Collecte | Le vaisseau peut toujours decouvrir et collecter des ressources sur une case atteinte sans scan. Les objets de cargaison suivent le vaisseau et disparaissent apres le depot a la base. |
| Carburant | Le vaisseau et le drone utilisent une reserve commune de 100. Un pas du vaisseau coute 2 ; le drone coute 1 par hexagone effectivement parcouru. Une perte sur danger ne facture que l'aller. Le plein est limite aux stations carburant et dure trois fois un pas, soit 1 200 ms actuellement. |

Corrections de l'audit : le champ de vision suivait le drone en vol et se
reduisait a la case du vaisseau apres sa perte ; les objets au sol apparaissaient
sur toutes les tuiles ressources dans le rayon ; les arrivees du vaisseau et
les scans etaient confondus dans la connaissance ; une perte de drone facturait
un retour qui n'avait pas eu lieu. Ces quatre ecarts sont corriges dans le
moteur, la vue et les scenarios Gherkin.

Limites connues : le planificateur utilise encore le stock reel des cases deja
connues pour choisir ses collectes, meme lorsqu'elles sont hors du rayon visuel.
Le brouillard masque ces valeurs dans la vue de jeu, mais ne constitue pas encore
une memoire de stock datee pour l'IA.
Les fichiers Gherkin sont valides syntaxiquement ; leurs etapes ne sont pas
executees automatiquement.
