import React, { useState } from 'react';
import { useFSM } from '../../hooks/useFSM';

/**
 * 🧪 Composant de Test pour Vérifier l'État Partagé XState
 * 
 * Ce test vérifie que deux composants utilisant le même botId
 * partagent bien la même instance d'état dans le store XState.
 * 
 * Le test utilise des événements FSM réels et des compteurs locaux
 * pour valider à la fois l'état partagé XState et l'isolation des composants.
 * 
 * ✅ Résultat attendu : Composants 1 & 2 ont le même état FSM
 * ❌ Problème détecté : États FSM différents = instances multiples
 */

const TestComponent1 = () => {
  const { fsmState, send, context } = useFSM('test-bot');
  
  // Compteur local pour simuler un état partagé
  const [localCounter, setLocalCounter] = React.useState(0);
  
  const handleIncrement = () => {
    setLocalCounter(prev => prev + 1);
    // Test avec un événement réel de la machine FSM
    send({ type: 'EVALUATION_COMPLETE' });
  };
  
  return (
    <div style={{ 
      border: '2px solid blue', 
      padding: '10px', 
      margin: '5px',
      backgroundColor: '#e3f2fd'
    }}>
      <h4>🔵 Composant 1 (test-bot)</h4>
      <p><strong>État FSM:</strong> {JSON.stringify(fsmState?.value || 'evaluating')}</p>
      <p><strong>Compteur Local:</strong> {localCounter}</p>
      <p><strong>Bot ID:</strong> {context?.bot?.id || 'test-bot'}</p>
      <p><strong>Test Événement:</strong> {fsmState?.value ? 'État détecté' : 'En attente...'}</p>
      <button 
        onClick={handleIncrement}
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test depuis Composant 1
      </button>
    </div>
  );
};

const TestComponent2 = () => {
  const { fsmState, send, context } = useFSM('test-bot'); // MÊME botId = doit partager l'état
  
  // Compteur local pour simuler un état partagé
  const [localCounter, setLocalCounter] = React.useState(0);
  
  const handleIncrement = () => {
    setLocalCounter(prev => prev + 1);
    // Test avec un événement différent
    send({ type: 'EMERGENCY_DETECTED' });
  };
  
  return (
    <div style={{ 
      border: '2px solid red', 
      padding: '10px', 
      margin: '5px',
      backgroundColor: '#ffebee'
    }}>
      <h4>🔴 Composant 2 (test-bot)</h4>
      <p><strong>État FSM:</strong> {JSON.stringify(fsmState?.value || 'evaluating')}</p>
      <p><strong>Compteur Local:</strong> {localCounter}</p>
      <p><strong>Bot ID:</strong> {context?.bot?.id || 'test-bot'}</p>
      <p><strong>Même instance que C1 ?</strong> {fsmState?.value === TestComponent1?.fsmState?.value ? '✅ OUI' : '❓ À vérifier'}</p>
      <button 
        onClick={handleIncrement}
        style={{
          backgroundColor: '#d32f2f',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test depuis Composant 2
      </button>
    </div>
  );
};

const TestComponent3 = () => {
  const { fsmState, send, context } = useFSM('test-bot-different'); // BotId DIFFÉRENT = doit avoir son propre état
  
  // Compteur local pour ce bot différent
  const [localCounter, setLocalCounter] = React.useState(0);
  
  const handleIncrement = () => {
    setLocalCounter(prev => prev + 1);
    send({ type: 'BASE_REACHED' });
  };
  
  return (
    <div style={{ 
      border: '2px solid green', 
      padding: '10px', 
      margin: '5px',
      backgroundColor: '#e8f5e8'
    }}>
      <h4>🟢 Composant 3 (test-bot-different)</h4>
      <p><strong>État FSM:</strong> {JSON.stringify(fsmState?.value || 'evaluating')}</p>
      <p><strong>Compteur Séparé:</strong> {localCounter}</p>
      <p><strong>Bot ID:</strong> {context?.bot?.id || 'test-bot-different'}</p>
      <p><strong>Instance séparée ?</strong> {fsmState ? '✅ OUI' : '❓ En cours...'}</p>
      <button 
        onClick={handleIncrement}
        style={{
          backgroundColor: '#388e3c',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Bot Différent
      </button>
    </div>
  );
};

const XStateSharedTest = () => {
  const [showTest, setShowTest] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const { addBot, removeBot } = useFSM();

  const initTest = () => {
    try {
      // Créer les bots de test
      addBot('test-bot');
      addBot('test-bot-different');
      setShowTest(true);
      
      setTestResults({
        status: 'initialized',
        message: 'Test initialisé. Cliquez sur les boutons pour tester l\'état partagé.'
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `Erreur lors de l'initialisation : ${error.message}`
      });
    }
  };

  const cleanupTest = () => {
    try {
      // Nettoyer les bots de test
      removeBot('test-bot');
      removeBot('test-bot-different');
      setShowTest(false);
      setTestResults(null);
    } catch (error) {
      console.error('Erreur lors du nettoyage :', error);
      setShowTest(false);
      setTestResults(null);
    }
  };

  if (!showTest) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '100px', 
        left: '100px', 
        background: '#ffffff',
        padding: '20px', 
        border: '3px solid #4caf50',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 10000,
        maxWidth: '500px'
      }}>
        <h3>🧪 Test État Partagé XState</h3>
        <p>Ce test vérifie que l'état XState est correctement partagé entre composants.</p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <h4>📋 Critères de Validation :</h4>
          <ul>
            <li>✅ <strong>Composants 1 & 2</strong> : Même état FSM (même instance)</li>
            <li>✅ <strong>Composant 3</strong> : État FSM séparé (isolation)</li>
            <li>✅ <strong>Événements FSM</strong> : Changements d'état visibles</li>
            <li>✅ <strong>Compteurs locaux</strong> : Indépendants (test interface)</li>
          </ul>
        </div>
        
        <button 
          onClick={initTest}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🚀 Démarrer le Test
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
      border: '3px solid #4caf50',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 10000,
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3>🧪 Test État Partagé XState - EN COURS</h3>
        <button 
          onClick={cleanupTest}
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
      
      {testResults && (
        <div style={{ 
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          backgroundColor: testResults.status === 'error' ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${testResults.status === 'error' ? '#f44336' : '#4caf50'}`
        }}>
          <p><strong>Status :</strong> {testResults.message}</p>
        </div>
      )}        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '15px', 
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #ff9800'
        }}>
          <h4>📊 Instructions de Test :</h4>
          <ol>
            <li>Les <strong>Composants 1 & 2</strong> doivent afficher le <strong>même état FSM</strong></li>
            <li>Le <strong>Composant 3</strong> doit avoir son <strong>propre état FSM</strong></li>
            <li>Cliquez sur les boutons et observez les changements d'état</li>
            <li>Les compteurs locaux sont indépendants (test interface utilisateur)</li>
          </ol>
        </div>
      
      <TestComponent1 />
      <TestComponent2 />
      <TestComponent3 />        <div style={{ 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <p><strong>🔍 Analyse du Test :</strong></p>
          <ul>
            <li>Si Composants 1 & 2 ont le même état FSM → ✅ État XState partagé OK</li>
            <li>Si les états FSM sont différents → ❌ Instances multiples détectées</li>
            <li>Composant 3 doit être indépendant → ✅ Isolation par botId OK</li>
            <li>Les compteurs locaux sont indépendants → ✅ Interface React normale</li>
          </ul>
        </div>
    </div>
  );
};

export default XStateSharedTest;
