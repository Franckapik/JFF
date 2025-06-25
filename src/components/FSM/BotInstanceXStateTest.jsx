import React from 'react';
import { useBotMachineXState } from '../../ai/fsm/hooks/useBotMachineXState';

/**
 * Composant test pour la machine XState d'un bot FSM
 */
export default function BotInstanceXStateTest({ botId = 'bot-xstate' }) {
  const [state, send] = useBotMachineXState();

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      background: '#222', color: '#fff', padding: 16, borderRadius: 8, margin: 8, fontFamily: 'monospace', minWidth: 220,
      zIndex: 3000
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>BotInstanceXStateTest</div>
      <div>Bot ID : <b>{botId}</b></div>
      <div>État courant : <b>{String(state.value)}</b></div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => send({ type: 'EVALUATION_COMPLETE' })}>EVALUATION_COMPLETE</button>
        <button onClick={() => send({ type: 'AREA_EXPLORED' })}>AREA_EXPLORED</button>
        <button onClick={() => send({ type: 'BASE_REACHED' })}>BASE_REACHED</button>
        <button onClick={() => send({ type: 'RESOURCE_COLLECTED' })}>RESOURCE_COLLECTED</button>
        <button onClick={() => send({ type: 'MANUAL_OVERRIDE' })}>MANUAL_OVERRIDE</button>
        <button onClick={() => send({ type: 'EMERGENCY_DETECTED' })}>EMERGENCY_DETECTED</button>
        <button onClick={() => send({ type: 'INVENTORY_FULL' })}>INVENTORY_FULL</button>
        <button onClick={() => send({ type: 'TILE_COLLECTED' })}>TILE_COLLECTED</button>
        <button onClick={() => send({ type: 'REFUEL_COMPLETE' })}>REFUEL_COMPLETE</button>
        <button onClick={() => send({ type: 'UNLOAD_COMPLETE' })}>UNLOAD_COMPLETE</button>
        <button onClick={() => send({ type: 'REPAIR_COMPLETE' })}>REPAIR_COMPLETE</button>
        <button onClick={() => send({ type: 'MAINTENANCE_COMPLETE' })}>MAINTENANCE_COMPLETE</button>
        <button onClick={() => send({ type: 'IDLE_TIMEOUT' })}>IDLE_TIMEOUT</button>
        <button onClick={() => send({ type: 'EXPLORATION_REQUESTED' })}>EXPLORATION_REQUESTED</button>
      </div>
    </div>
  );
}
