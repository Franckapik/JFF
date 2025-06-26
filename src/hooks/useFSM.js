import { useCentralFSMStore } from '../stores/useCentralFSMStore';
import { useCallback, useMemo } from 'react';

/**
 * Hook minimal pour interagir avec une machine d'état XState via Zustand.
 * Cette version est simplifiée pour se concentrer sur la stabilité des références
 * et valider la correction de la boucle de rendu infinie.
 * @param {string} botId - L'ID du bot à contrôler (par défaut: 'main').
 */
export function useFSM(botId = 'main') {
  // Log pour tracer les rendus du hook. Si ce message apparaît en boucle,
  // le problème se situe en amont (store) ou en aval (composant).
  // console.log(`[useFSM Minimal] Hook rendering for botId: ${botId}`); // Debug log désactivé

  // 1. Sélecteur mémorisé pour l'état du bot.
  // useCallback garantit que la fonction sélecteur elle-même est stable entre les rendus.
  const botStateSelector = useCallback(
    (store) => store.getBotState(botId),
    [botId]
  );

  // 2. Sélecteur mémorisé pour la fonction d'envoi d'événements.
  const sendSelector = useCallback((store) => store.send, []);

  // 3. Utilisation du store avec les sélecteurs.
  // La fonction de comparaison `(a, b) => a === b` est cruciale. Elle demande à Zustand
  // de ne provoquer un re-rendu que si la référence de l'objet `fsmState` a changé.
  // C'est exactement ce que notre `useCentralFSMStore` corrigé garantit.
  const fsmState = useCentralFSMStore(botStateSelector, (a, b) => a === b);
  const sendEvent = useCentralFSMStore(sendSelector);

  // 4. Mémorisation de la fonction `send` pour garantir sa stabilité pour les composants enfants.
  // Elle ne sera recréée que si `sendEvent` (très stable) ou `botId` change.
  const send = useCallback(
    (event) => {
      // Le store gère l'envoi au bon bot.
      sendEvent(event, botId);
    },
    [sendEvent, botId]
  );

  // 5. Mémorisation des valeurs dérivées pour ne les recalculer que si `fsmState` change.
  const context = useMemo(() => fsmState?.context, [fsmState]);
  const isIn = useCallback(
    (stateValue) => {
      // Utilise l'optional chaining et le nullish coalescing pour la sécurité.
      return fsmState?.matches(stateValue) ?? false;
    },
    [fsmState]
  );

  // 6. Retourner une API de hook stable.
  // Les fonctions sont mémorisées et les objets ne changent de référence que si nécessaire.
  return { fsmState, context, send, isIn };
}
