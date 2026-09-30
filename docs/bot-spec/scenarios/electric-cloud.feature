# language: fr
@socle @nuage
Fonctionnalité: Nuage électrique mobile et perturbations sur sa seule tuile

  @CLOUD-01
  Scénario: Faire apparaître le nuage après six nouvelles tuiles explorées
    Étant donné une session sans nuage et cinq nouvelles tuiles explorées depuis le début
    Quand un vaisseau explore une sixième tuile
    Alors un nuage apparaît sur une tuile praticable
    Et sa tuile est à au moins deux hexagones de chacun des deux vaisseaux
    Et elle n'est ni une base ni une tuile adjacente à une base
    Et l'apparition ne modifie pas la nature de la tuile sous le nuage

  @CLOUD-02
  Scénario: Garder un seul nuage et attendre un prochain palier
    Étant donné un nuage présent au palier de six nouvelles tuiles explorées
    Quand le total atteint douze nouvelles tuiles explorées
    Alors aucun second nuage n'apparaît
    Quand le nuage se dissipe et que le total atteint dix-huit nouvelles tuiles explorées
    Alors un nouveau nuage peut apparaître sur une tuile admissible
    Et s'il n'existe aucune tuile admissible, aucun nuage n'est créé à ce palier

  @CLOUD-03
  Scénario: Faire dériver lentement puis dissiper le nuage
    Étant donné un nuage nouvellement apparu
    Quand 2400 ms de temps logique s'écoulent
    Alors il se déplace d'au plus une tuile vers une voisine praticable autorisée
    Et il évite de revenir immédiatement sur sa tuile précédente lorsqu'une autre voisine est possible
    Et le terrain et les dangers statiques sous son trajet ne se déplacent pas
    Quand 10000 ms se sont écoulées depuis son apparition
    Alors le nuage disparaît

  @CLOUD-04
  Scénario: Masquer le nuage dans le brouillard et animer son opacité
    Étant donné un nuage présent sur une tuile hors de la vision actuelle du bot sélectionné
    Alors ni le nuage ni son alerte ne sont visibles dans cette vision, même si la tuile a déjà été explorée
    Quand la tuile entre dans la vision actuelle du bot
    Alors le nuage et son alerte deviennent visibles sans étendre le champ de vision
    Et son opacité croît progressivement pendant les 800 premières ms après l'apparition
    Et elle décroît progressivement pendant les 800 dernières ms avant la disparition
    Quand la vision développeur est sélectionnée
    Alors le nuage actif est visible indépendamment des visions individuelles

  @CLOUD-05
  Scénario: Endommager le vaisseau qui arrive sur la tuile du nuage
    Étant donné un vaisseau qui suit un trajet dont une étape intermédiaire ou la cible est occupée par le nuage
    Quand il arrive sur cette tuile après son pas de 400 ms
    Alors il reçoit 15 dégâts dus au nuage et paie le carburant normal de ce pas
    Et rester sur cette tuile ne répète pas les dégâts du même contact
    Mais traverser une tuile voisine du nuage ne cause aucun dégât dû au nuage

  @CLOUD-06
  Scénario: Endommager le vaisseau immobile rejoint par le nuage
    Étant donné un vaisseau immobile sur une tuile praticable
    Quand le nuage se déplace sur cette même tuile
    Alors ce vaisseau reçoit 15 dégâts dus au nuage une seule fois pour ce contact
    Et le vaisseau subit l'impact même s'il n'avait pas prévu de se déplacer
    Et si ses dégâts atteignent 100, le vaisseau est éliminé

  @CLOUD-07
  Scénario: Cumuler les dangers sur une même tuile
    Étant donné une tuile dangereuse occupée par le nuage et un vaisseau sans dégâts
    Quand le vaisseau arrive sur cette tuile
    Alors il reçoit 10 dégâts dus à la tuile dangereuse et 15 dus au nuage
    Et les deux impacts sont identifiables séparément

  @CLOUD-08
  Scénario: Perturber le drone seulement sur la tuile du nuage
    Étant donné un drone envoyé vers une cible dont le trajet passe par la tuile du nuage
    Quand le drone atteint cette tuile en chemin ou comme cible
    Alors une perturbation électromagnétique interrompt sa destination initiale
    Et le drone commence un rebond au lieu d'être détruit par le nuage
    Mais passer seulement sur une tuile voisine du nuage ne perturbe pas le drone

  @CLOUD-09
  Scénario: Rebondir vers le bord puis visiter une tuile aléatoire
    Étant donné un drone ayant avancé puis été perturbé sur la tuile du nuage
    Quand son trajet est recalculé
    Alors il repart dans une direction inverse vers une tuile du bord du plateau
    Et arrivé au bord, il rebondit vers une tuile tirée parmi toutes les tuiles du plateau, connue ou inconnue
    Et après cette visite il revient vers son vaisseau si aucun danger ne le détruit
    Et le mode expert rend lisibles la cible initiale et les étapes du détour
    Et le détour ajoute du temps sans coût de carburant supplémentaire par rapport au scan initial

  @CLOUD-10
  Scénario: Perturber un drone déjà sur sa cible
    Étant donné un drone en train de scanner sa cible
    Quand le nuage se déplace sur cette même tuile pendant le scan
    Alors le drone commence son rebond depuis cette tuile
    Et la cible initiale ne compte pas comme un scan terminé

  @CLOUD-11
  Scénario: Perturber le drone sur le trajet de retour
    Étant donné un drone qui revient d'une visite sans avoir touché le nuage
    Quand son trajet de retour traverse la tuile actuellement occupée par le nuage
    Alors il entame un rebond depuis cette tuile
    Et le seul fait que sa cible initiale soit ailleurs n'empêche pas la perturbation

  @CLOUD-12
  Scénario: Perdre le drone sur la destination aléatoire dangereuse
    Étant donné un drone repoussé par le nuage vers le bord
    Et que sa destination tirée au hasard est une tuile dangereuse
    Quand le drone atteint cette destination
    Alors le danger de la tuile détruit le drone avant son scan ou son retour
    Et cette perte est imputée à la tuile dangereuse, non au nuage

  @CLOUD-13
  Scénario: Conserver un résultat reproductible avec la même graine
    Étant donné deux sessions de même graine, carte et commandes
    Quand elles explorent les mêmes tuiles et rencontrent le nuage aux mêmes instants logiques
    Alors les apparitions, déplacements et destinations aléatoires du drone sont identiques
