# Direction graphique du plateau — atlas crayonné

Le plateau emprunte le vocabulaire d'un carnet d'exploration : encre bleu ardoise, aplats de pigments et petits signes dessinés à la main. Les hexagones flottent dans un fond sombre dont la teinte suit discrètement le bot en tête du score. Les zones inconnues restent sombres pour rendre la découverte lisible. Les ressources et les dangers gardent des couleurs distinctes, même lorsque la carte est vue en entier.

## Recherche et choix

- [Maxime Heckel, *Moebius-style post-processing and other stylized shaders*](https://blog.maximeheckel.com/posts/moebius-style-post-processing/) détaille les contours par profondeur et normales, puis les hachures liées à l'ombre. Son rendu est une bonne référence pour le trait et les valeurs, mais un filtre plein écran accentuerait aussi les minuscules marqueurs de jeu et les contours des hexagones. Le plateau applique donc l'encre directement aux tuiles.
- [txstc55, *Moebius Effect in THREEJS*](https://github.com/txstc55/moebius-effect-threejs) montre comment intégrer les ombres et les accents clairs dans un shader de matériau. Le plateau retient cette logique de traitement par surface, avec une palette moins lumineuse et plus proche de pigments sur papier.
- [Maya Nedeljković Batić, *Sketchy Pencil Effect with Three.js Post-Processing*](https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/) associe détection de contours, bruit et textures pour sortir du trait numérique uniforme. Ici, un bruit de grain et deux directions de hachures sont intégrés au matériau des hexagones ; des pictogrammes au trait identifient les terrains.

## Réalisation

Le plateau conserve les interactions et les règles de visibilité existantes. Les hexagones ont un contour géométrique qui reste net à toute distance. Leurs surfaces reçoivent un grain et des hachures stables dans l'espace du monde, sans scintillement lié à la caméra. Aucun plan ne se trouve sous les tuiles. Le fond prend une teinte neutre en début de partie, puis évolue doucement vers la couleur du bot qui prend l'avantage ; en cas d'égalité, il garde la dernière teinte. Les symboles sont générés localement en Canvas 2D ; aucun fichier d'image externe n'est requis.

La vision des bots garde ses trois états : inconnue sombre, souvenir assourdi et case actuellement visible. La vue développeur révèle les types de terrain. Les éléments de jeu urgents, notamment les mines et le nuage électrique, conservent leurs marqueurs colorés.
