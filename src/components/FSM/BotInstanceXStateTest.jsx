import React from 'react';
import { useFSM } from '../../hooks/useFSM';

/**
 * Composant de test minimal pour valider le hook `useFSM` et le store `useCentralFSMStore`.
 * Affiche l'état actuel de la machine et un bouton pour envoyer un événement.
 * @param {{ botId: string, label: string }}
 */
function BotInstanceXStateTest({ botId, label }) {
  // Utilise le hook `useFSM` minimal.
  const { fsmState, context, send, isIn } = useFSM(botId);

  // Log pour vérifier les re-rendus du composant.
  // Si ce message apparaît en boucle, le problème persiste.
  // console.log(`[BotInstanceXStateTest] Rendering component for botId: ${botId}`); // Debug log désactivé

  // Gestionnaire d'événement simple pour tester l'envoi.
  const handleToggle = () => {
    // Envoie un événement simple. Assurez-vous que cet événement
    // est géré par votre machine d'état (par exemple, 'TOGGLE').
    // Adaptez si nécessaire à un événement qui existe dans votre machine.
    send({ type: 'TOGGLE' });
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h4>{label} (ID: {botId})</h4>
      {fsmState && typeof fsmState.matches === 'function' ? (
        <>
          <p>État actuel : <strong>{JSON.stringify(fsmState.value)}</strong></p>
          <p>Est dans l'état 'actif' ? <strong>{isIn('active') ? 'Oui' : 'Non'}</strong></p>
          <pre>Contexte : {JSON.stringify(context, null, 2)}</pre>
          <button onClick={handleToggle}>Envoyer l'événement 'TOGGLE'</button>
        </>
      ) : (
        <p>Chargement de l'état... (Bot non initialisé ou état invalide)</p>
      )}
    </div>
  );
}

export default BotInstanceXStateTest;
