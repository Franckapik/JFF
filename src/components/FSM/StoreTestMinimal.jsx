import React from 'react';
// Import du store pour tester s'il cause des problèmes à l'import
import { useFSMStore } from '../../stores/useFSMStoreXState';

/**
 * Composant ultra-minimal pour tester si le store cause des problèmes
 * Version 1: Import seulement, aucune utilisation
 */
export default function StoreTestMinimal() {
  console.log('[StoreTestMinimal] render - NO STORE USAGE');
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#333',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Store Test 1: Import Only - NO USAGE
    </div>
  );
}
