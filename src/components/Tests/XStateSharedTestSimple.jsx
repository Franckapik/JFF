import React from 'react';
import { useFSMStore } from '../../stores/useFSMStore';

/**
 * 🧪 Test Simple d'État Partagé XState
 * 
 * Ce test vérifie directement que le store XState est bien partagé
 * entre plusieurs composants en utilisant un compteur dans le store.
 */

// Fonction utilitaire pour ajouter un compteur au store
const addTestCounter = () => {
  const store = useFSMStore.getState();
  if (!store.testCounter) {
    useFSMStore.setState({ testCounter: 0 });
  }
};

const incrementTestCounter = () => {
  const currentCounter = useFSMStore.getState().testCounter || 0;
  useFSMStore.setState({ testCounter: currentCounter + 1 });
};

const TestDisplay1 = () => {
  const testCounter = useFSMStore((state) => state.testCounter || 0);
  const activeBots = useFSMStore((state) => state.activeBots || []);
  
  return (
    <div style={{ 
      border: '2px solid blue', 
      padding: '15px', 
      margin: '10px',
      backgroundColor: '#e3f2fd',
      borderRadius: '8px'
    }}>
      <h4>🔵 Affichage Test 1</h4>
      <p><strong>Compteur Partagé:</strong> {testCounter}</p>
      <p><strong>Bots Actifs:</strong> {activeBots.join(', ')}</p>
      <button 
        onClick={incrementTestCounter}
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        +1 depuis Affichage 1
      </button>
    </div>
  );
};

const TestDisplay2 = () => {
  const testCounter = useFSMStore((state) => state.testCounter || 0);
  const activeBots = useFSMStore((state) => state.activeBots || []);
  
  return (
    <div style={{ 
      border: '2px solid red', 
      padding: '15px', 
      margin: '10px',
      backgroundColor: '#ffebee',
      borderRadius: '8px'
    }}>
      <h4>🔴 Affichage Test 2</h4>
      <p><strong>Compteur Partagé:</strong> {testCounter}</p>
      <p><strong>Bots Actifs:</strong> {activeBots.join(', ')}</p>
      <button 
        onClick={incrementTestCounter}
        style={{
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        +1 depuis Affichage 2
      </button>
    </div>
  );
};

export default function XStateSharedTestSimple() {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const initTest = () => {
    addTestCounter();
    setIsVisible(true);
  };
  
  const resetTest = () => {
    useFSMStore.setState({ testCounter: 0 });
  };
  
  const closeTest = () => {
    setIsVisible(false);
    // Nettoyer le compteur de test
    const state = useFSMStore.getState();
    if (state.testCounter !== undefined) {
      const { testCounter, ...restState } = state;
      useFSMStore.setState(restState);
    }
  };
  
  if (!isVisible) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '200px', 
        left: '50px', 
        background: '#ffffff',
        padding: '20px', 
        border: '3px solid #2196f3',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        maxWidth: '400px'
      }}>
        <h3>🧪 Test Simple État Partagé</h3>
        <p>Ce test vérifie directement que le store XState est partagé entre composants.</p>
        
        <button 
          onClick={initTest}
          style={{
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🚀 Lancer le Test
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '50px', 
      left: '50px', 
      background: '#ffffff',
      padding: '20px', 
      border: '3px solid #2196f3',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 9999,
      maxWidth: '500px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3>🧪 Test État Partagé en Cours</h3>
        <button 
          onClick={closeTest}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ❌ Fermer
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#fff3e0', 
        padding: '15px', 
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #ff9800'
      }}>
        <h4>📊 Validation :</h4>
        <p>Si les deux affichages montrent le <strong>même compteur</strong> et se mettent à jour ensemble, l'état XState est bien partagé ✅</p>
      </div>
      
      <TestDisplay1 />
      <TestDisplay2 />
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={resetTest}
          style={{
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Reset Compteur
        </button>
      </div>
    </div>
  );
}
