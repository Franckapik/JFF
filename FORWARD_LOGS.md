# 🔄 Browser Console → Terminal Log Forwarding

**Date**: 1 janvier 2026  
**Status**: ✅ Implémenté

## Résumé

Tous les `console.log/warn/error` du navigateur sont maintenant forwardés vers le terminal VS Code en mode développement, tout en restant visibles dans DevTools.

## Fichiers modifiés

1. **[scripts/log-server.mjs](scripts/log-server.mjs)** ✅  
   Serveur HTTP Node.js (port 5123) qui reçoit les logs via POST et les affiche dans le terminal avec le préfixe `[browser:pathname]`.

2. **[src/index.jsx](src/index.jsx)** ✅  
   Override de `console.log/warn/error` en mode dev (`import.meta.env.DEV`) pour envoyer les logs au serveur local. Sérialization safe avec fallback pour objets complexes.

3. **[package.json](package.json)** ✅  
   - Ajout du script `log:server` pour lancer le serveur de logs
   - Ajout du script `dev:all` pour exécution parallèle (log-server + vite)
   - Installation de `npm-run-all` en devDependency

## Utilisation

```bash
# Lancer Vite avec forwarding des logs
npm run dev:all
```

Les logs s'affichent maintenant dans le terminal avec le format :  
`[browser:/] log message here`  
`[browser:/game] warn something`  
`[browser:/admin] error details`

## Architecture

**Flow**: Browser console → fetch POST → log-server.mjs → terminal stdout

- ✅ Pas d'impact sur les logs DevTools (conservés)
- ✅ Sérialization safe des objets complexes
- ✅ Graceful fallback si le serveur n'est pas démarré
- ✅ Actif uniquement en mode dev (`import.meta.env.DEV`)

## Notes

- Les objets circulaires sont sérialisés avec fallback String()
- Le serveur est tolérant aux payloads invalides
- Compatible avec l'infrastructure de logging existante (fsmLogger)
