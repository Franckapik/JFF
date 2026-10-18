# Direction graphique du plateau — atlas crayonné

Le plateau emprunte le vocabulaire d'un carnet d'exploration : encre bleu ardoise, aplats de pigments et petits signes dessinés à la main. Les hexagones flottent dans un fond sombre dont la teinte suit discrètement le bot en tête du score. Les zones inconnues restent sombres pour rendre la découverte lisible. Les ressources et les dangers gardent des couleurs distinctes, même lorsque la carte est vue en entier.

## Recherche et choix

- [Maxime Heckel, *Moebius-style post-processing and other stylized shaders*](https://blog.maximeheckel.com/posts/moebius-style-post-processing/) détaille les contours par profondeur et normales, puis les hachures liées à l'ombre. Son rendu est une bonne référence pour le trait et les valeurs, mais un filtre plein écran accentuerait aussi les minuscules marqueurs de jeu et les contours des hexagones. Le plateau applique donc l'encre directement aux tuiles.
- [txstc55, *Moebius Effect in THREEJS*](https://github.com/txstc55/moebius-effect-threejs) montre comment intégrer les ombres et les accents clairs dans un shader de matériau. Le plateau retient cette logique de traitement par surface, avec une palette moins lumineuse et plus proche de pigments sur papier.
- [Maya Nedeljković Batić, *Sketchy Pencil Effect with Three.js Post-Processing*](https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/) associe détection de contours, bruit et textures pour sortir du trait numérique uniforme. Ici, un bruit de grain et deux directions de hachures sont intégrés au matériau des hexagones ; des pictogrammes au trait identifient les terrains.

## Réalisation

Le plateau conserve les interactions et les règles de visibilité existantes. Les hexagones ont un contour géométrique qui reste net à toute distance. Leurs surfaces reçoivent un grain et des hachures stables dans l'espace du monde, sans scintillement lié à la caméra. Le relief actuel est une étude visuelle déterministe, commune aux deux vues : il ne modifie pas le graphe de déplacement. Une surface d'eau animée passe entre les volumes et souligne les bords des tuiles qu'elle atteint. Son shader GLSL combine trois houles de directions et de vitesses différentes, des rides fines, une réflexion rasante et de faibles crêtes d'écume. La transparence varie avec la marée pour atténuer les volumes immergés.

Un champ de tuiles sous-marines prolonge la grille autour de l'île. Ses instances suivent la caméra tout en restant alignées aux coordonnées du monde, ce qui permet de déplacer la vue sans atteindre un bord visible dans le cadrage courant. Leur teinte froide et leur faible contraste signalent qu'elles ne sont pas jouables : elles ne participent ni au graphe, ni aux ressources, ni à la sélection, ni à la physique. Le fond prend une teinte bleu ardoise qui évolue discrètement vers la couleur du bot en tête. Les symboles sont générés localement en Canvas 2D ; aucun fichier d'image externe n'est requis.

La tour centrale est ajourée pour laisser voir la case et les vaisseaux qui la traversent. Deux nacelles reprennent les couleurs des bots ; leur balancement est purement visuel. Le bouton « Voir la marée haute » sert à comparer les volumes émergés et submergés. L'atelier Rapier reste activable séparément et ses colliders suivent le relief affiché.

La vision des bots garde ses trois états : inconnue sombre, souvenir assourdi et case actuellement visible. La vue développeur révèle les types de terrain. Les éléments de jeu urgents, notamment les mines et le nuage électrique, conservent leurs marqueurs colorés.
