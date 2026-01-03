// Système de broadcast simple pour XState via BroadcastChannel
// Permet d'afficher le contexte XState en temps réel dans un autre onglet

export const CHANNEL_NAME = 'xstate-machine-channel';

export interface BroadcastMessage {
  type: 'STATE_UPDATE' | 'REQUEST_SYNC' | 'LOG';
  botId?: string;
  snapshot?: {
    value: unknown;
    context: Record<string, unknown>;
    status?: string;
  };
  level?: string;
  message?: string;
  data?: Record<string, unknown>;
  ts?: number;
}

/**
 * Crée un BroadcastChannel avec throttling simple
 */
export function createBroadcastChannel() {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
    return null;
  }

  const channel = new BroadcastChannel(CHANNEL_NAME);

  // Throttling simple via requestAnimationFrame
  let pending = false;
  let lastMessage: BroadcastMessage | null = null;

  function post(message: BroadcastMessage) {
    lastMessage = message;
    if (pending) return;
    
    pending = true;
    requestAnimationFrame(() => {
      try {
        if (lastMessage) {
          channel.postMessage(lastMessage);
        }
      } catch (_e) {
        // Silently ignore broadcast errors
      }
      pending = false;
    });
  }

  return {
    channel,
    post,
    close: () => channel.close()
  };
}
