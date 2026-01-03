import React from 'react';

import useXFSMStore from '../stores/useXFSMStore';
import type { FSMContext } from '../types/fsm.d';

/**
 * Type guard pour vérifier si un snapshot a un contexte valide
 */
function hasValidContext(snapshot: unknown): snapshot is { context: FSMContext } {
  return (
    snapshot !== null &&
    typeof snapshot === 'object' &&
    'context' in snapshot &&
    typeof (snapshot as { context: unknown }).context === 'object'
  );
}

/**
 * Composant pour afficher les statistiques des drones
 * Affiche les compteurs de déploiement et destruction par type de drone
 */
export const DroneStatsDisplay: React.FC = () => {
  const botStates = useXFSMStore((state) => state.botStates);
  const botSnapshot = botStates['bot-0'];

  let droneStats = {
    explorerDeployed: 0,
    explorerDestroyed: 0,
    combatDeployed: 0,
    combatDestroyed: 0,
    specialDeployed: 0,
    specialDestroyed: 0,
  };
  let totalDestroyed = 0;

  if (hasValidContext(botSnapshot)) {
    const ctx = botSnapshot.context;
    droneStats = ctx.droneFleet?.stats || droneStats;
    totalDestroyed = ctx.memory?.stats?.dronesDestroyed || 0;
  }

  const droneTypes = [
    { key: 'explorer', label: '🛰️ Explorer', emoji: '🛰️' },
    { key: 'combat', label: '🎯 Combat', emoji: '🎯' },
    { key: 'special', label: '✨ Special', emoji: '✨' },
  ] as const;

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      left: 20,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '220px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      zIndex: 1000
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#FF6B6B' }}>🤖 Drone Stats</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {droneTypes.map((drone) => {
          const deployedKey = `${drone.key}Deployed` as keyof typeof droneStats;
          const destroyedKey = `${drone.key}Destroyed` as keyof typeof droneStats;
          const deployed = droneStats[deployedKey] || 0;
          const destroyed = droneStats[destroyedKey] || 0;
          const survival = deployed > 0 ? ((deployed - destroyed) / deployed * 100).toFixed(0) : 0;

          return (
            <div key={drone.key} style={{
              padding: '8px',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderLeft: '3px solid #FF6B6B',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{drone.label}</span>
                <span style={{ color: destroyed > 0 ? '#FF6B6B' : '#4CAF50' }}>
                  {destroyed > 0 ? `💥 ${destroyed}` : '✓'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                <span>Déployés: <span style={{ color: '#90CAF9' }}>{deployed}</span></span>
                <span>Survie: <span style={{ color: survival === '100' ? '#4CAF50' : '#FFA726' }}>{survival}%</span></span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #555',
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold'
      }}>
        <span>Drones Totaux Détruits:</span>
        <span style={{ color: totalDestroyed > 0 ? '#FF6B6B' : '#4CAF50', fontSize: '14px' }}>
          {totalDestroyed}
        </span>
      </div>
    </div>
  );
};

export default DroneStatsDisplay;
