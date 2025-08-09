La logique mise en place pour les actions se fait via le dossier domains. Les "actions" sont séparées selon :
- assign : maj du context
- actions : actions avec effets de bords (requetes api par exemple). Ici seulement des logs d'état.

Il reste donc la génération des fichiers à commencer par exploring pour que le drone effectuent tout les mouvements. Le dossier "actionold" contient logiquement le fonctionnement ancien de ces différentes fonctions.

Le cycle de mise a jour des etats du drone via les assign context fonctionne. 
Il faut desormais remplir les actions d'effets dans scanning et returning pour que les events soient bien envoyés. Ces actions doivent etre dans explorations/actions.effects.ts comme pour evaluation/actions.effects.ts !
