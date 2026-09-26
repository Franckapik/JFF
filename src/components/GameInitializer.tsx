import React from 'react';

import { useSessionStore } from '../stores/useSessionStore';

export default function GameInitializer() {
  const connect = useSessionStore((state) => state.connect);
  const disconnect = useSessionStore((state) => state.disconnect);

  React.useEffect(() => {
    connect();
    window.addEventListener('pagehide', disconnect);
    window.addEventListener('pageshow', connect);
    return () => {
      window.removeEventListener('pagehide', disconnect);
      window.removeEventListener('pageshow', connect);
      disconnect();
    };
  }, [connect, disconnect]);

  return null;
}
