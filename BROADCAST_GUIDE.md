# 🔗 Système de Broadcast XState - Guide d'utilisation

Le système de broadcast permet d'afficher en temps réel le contexte et l'état de la machine XState dans un onglet séparé du navigateur.

## 🚀 Utilisation

1. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

2. **Ouvrir le viewer** :
   - Aller sur l'URL principale de l'app (ex: http://localhost:5174/)
   - Ouvrir un nouvel onglet sur : http://localhost:5174/xstate-viewer.html

3. **Observer les mises à jour** :
   - Le viewer se connecte automatiquement via BroadcastChannel
   - Les changements d'état XState apparaissent en temps réel
   - Cliquer sur "🔄 Refresh" pour synchroniser manuellement

## 🛠️ Fonctionnalités

- **Affichage en temps réel** : État et contexte de la machine XState
- **Multi-bot support** : Gère plusieurs bots (botId dans les messages)
- **Throttling intelligent** : Évite le spam avec requestAnimationFrame
- **Interface claire** : État actuel, statut, et contexte JSON formaté
- **Reconnexion** : Bouton refresh pour resynchroniser

## 🔧 Architecture

### Fichiers ajoutés/modifiés :

1. **`src/ai/fsm/broadcast.ts`** :
   - Utilitaires BroadcastChannel
   - Types des messages de broadcast
   - Throttling des mises à jour

2. **`src/stores/useXFSMStore/index.ts`** :
   - Intégration du broadcast dans les subscriptions XState
   - Gestion des requêtes REQUEST_SYNC du viewer

3. **`public/xstate-viewer.html`** :
   - Interface web standalone pour visualiser les états
   - Connexion BroadcastChannel et affichage temps réel

### Messages BroadcastChannel :

- **STATE_UPDATE** : Envoyé par l'app principale à chaque changement d'état
- **REQUEST_SYNC** : Envoyé par le viewer pour demander l'état actuel

## 🐛 Dépannage

- **"Disconnected"** : L'app principale n'est pas démarrée ou pas sur la même origine
- **"Waiting for updates"** : Aucun bot actif dans l'app principale
- **Onglets multiples** : Chaque onglet viewer reçoit les mêmes mises à jour

## 🎯 Prochaines améliorations possibles

- Filtrage par botId spécifique
- Historique des transitions d'état
- Export des données en JSON
- Intégration avec XState DevTools
