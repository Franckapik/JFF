# Architecture Hybride FSM

Cette application utilise temporairement **deux systèmes FSM en parallèle** pour permettre une migration progressive sans boucles infinies.

## Nouveau Système (XState v5 + Zustand)

**Store :** `/src/stores/useFSMStoreXState.js`
- Export : `useFSMStore` (fonction)
- Basé sur XState v5 + Zustand
- Gestion des snapshots avec cache pour éviter les boucles infinies

**Hook :** `/src/hooks/useFSM.js`
- Export : `useFSM(botId)`
- Interface simple et stable pour les composants

**Composants utilisant le nouveau système :**
- `FSMHUD.jsx` (ex-FusedBotManagerHUD)
- `BotInstanceXStateTest.jsx`
- `App.jsx` (pour la création de bots)

## Ancien Système (robot3)

**Store :** `/src/stores/useFSMStore/` (dossier)
- Export : `useFSMStore` (objet store)
- Basé sur robot3
- Ancien système stable

**Composants utilisant l'ancien système :**
- `Scene.jsx`
- `tileFilterSlice.js`
- Tous les autres composants non migrés

## Migration Progressive

1. **Phase actuelle :** Coexistence des deux systèmes
2. **Prochaines étapes :** Migrer progressivement composant par composant vers le nouveau système
3. **Phase finale :** Suppression de l'ancien système une fois la migration terminée

## Notes Importantes

- Ne pas mélanger les deux systèmes dans un même composant
- Bien identifier quel store utilise quel composant avant modification
- Tester chaque migration individuellement pour éviter les régressions
