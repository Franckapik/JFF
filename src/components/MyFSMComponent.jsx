import React, { useEffect, useState } from 'react';
import { useMachine } from 'react-robot';
import { createMachine, state, transition, reduce } from 'robot3'; // Added reduce

// Constants for states, similar to botConstants.js
const BOT_STATES = {
  IDLE: 'idle',
  EXPLORING: 'exploring',
  COLLECTING: 'collecting',
  RETURNING: 'returning',
};

const stateDescriptions = {
  [BOT_STATES.IDLE]: "En attente d'instructions ou d'évaluation.",
  [BOT_STATES.EXPLORING]: "Exploration de la carte à la recherche de ressources ou d'informations.",
  [BOT_STATES.COLLECTING]: "Collecte de ressources.",
  [BOT_STATES.RETURNING]: "Retour à la base.",
};

// Guard function - now reads from machine context
const canStartExploringGuard = (ctx, event) => {
  console.log(`[Guard] Checking machine context ctx.canExplore: ${ctx.canExplore}`);
  return ctx.canExplore === true;
};

// Machine definition
const machine = createMachine(
  BOT_STATES.IDLE, // 1. Initial state name
  { // 2. States object (anciennement la valeur de la propriété 'states')
    [BOT_STATES.IDLE]: state(
      transition('explore', BOT_STATES.EXPLORING, {
        guard: canStartExploringGuard
      }),
      transition('collect', BOT_STATES.COLLECTING),
      transition('returnHome', BOT_STATES.RETURNING),
      // Event to update the canExplore flag in context
      transition('SET_CAN_EXPLORE', BOT_STATES.IDLE, {
        reduce: (ctx, ev) => ({ ...ctx, canExplore: ev.value })
      })
    ),
    [BOT_STATES.EXPLORING]: state(
      transition('foundResource', BOT_STATES.COLLECTING),
      transition('exploredArea', BOT_STATES.IDLE),
      transition('explorationTimeout', BOT_STATES.IDLE),
      transition('decide', BOT_STATES.COLLECTING), // This 'decide' is for EXPLORING -> COLLECTING
      // Event to update the canExplore flag in context (self-transition)
      transition('SET_CAN_EXPLORE', BOT_STATES.EXPLORING, {
        reduce: (ctx, ev) => ({ ...ctx, canExplore: ev.value })
      })
    ),
    [BOT_STATES.COLLECTING]: state(
      transition('inventoryFull', BOT_STATES.RETURNING),
      transition('resourceDepleted', BOT_STATES.IDLE),
      transition('decide', BOT_STATES.RETURNING),
      // Event to update the canExplore flag in context (self-transition)
      transition('SET_CAN_EXPLORE', BOT_STATES.COLLECTING, {
        reduce: (ctx, ev) => ({ ...ctx, canExplore: ev.value })
      })
    ),
    [BOT_STATES.RETURNING]: state(
      transition('atBase', BOT_STATES.IDLE),
      transition('decide', BOT_STATES.IDLE),
      // Event to update the canExplore flag in context (self-transition)
      transition('SET_CAN_EXPLORE', BOT_STATES.RETURNING, {
        reduce: (ctx, ev) => ({ ...ctx, canExplore: ev.value })
      })
    ),
  },
  () => ({ // 3. Context function
    canExplore: true, // Initial value for the guard flag in machine's context
    // other context properties if needed
  })
);


const MyFSMComponent = () => {
  // Component state for the UI representation of canExplore, still useful for immediate UI updates
  const [uiCanExplore, setUiCanExplore] = useState(true);
  const [current, send] = useMachine(machine); // Machine manages its own context now

  useEffect(() => {
    let timerId;
    if (current.name === BOT_STATES.EXPLORING) {
      console.log('Starting exploration timer (5s)...');
      timerId = setTimeout(() => {
        console.log('Exploration timeout! Returning to IDLE.');
        send('explorationTimeout');
      }, 5000);
    }

    return () => {
      if (timerId) {
        console.log('Clearing exploration timer.');
        clearTimeout(timerId);
      }
    };
  }, [current.name, send]);

  const handleToggleCanExplore = () => {
    const newValue = !uiCanExplore;
    setUiCanExplore(newValue); // Update UI state
    send({ type: 'SET_CAN_EXPLORE', value: newValue }); // Update machine context
    console.log(`[UI Toggle] Set canExplore to: ${newValue}. Sent SET_CAN_EXPLORE to machine.`);
  };

  const handleDecide = () => {
    if (current.name === BOT_STATES.IDLE) {
      console.log(`[handleDecide - IDLE] Attempting to send 'explore' event. Machine context should be checked by guard.`);
      send('explore'); // Event no longer needs to carry the flag
    } else if (current.name === BOT_STATES.EXPLORING) {
      send('foundResource');
    } else if (current.name === BOT_STATES.COLLECTING) {
      send('inventoryFull');
    } else if (current.name === BOT_STATES.RETURNING) {
      send('atBase');
    }
  };

  return (
    <div style={{ border: '1px solid white', padding: '10px', marginTop: '10px', color: 'white', backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <h3>Bot FSM Simulation (Contextual Guard)</h3>
      <p><strong>Current State:</strong> {current.name} (Machine Can Explore: {current.context.canExplore ? "Yes" : "No"})</p>
      <p><em>{stateDescriptions[current.name]}</em></p>

      <div>
        <button onClick={handleToggleCanExplore} style={{marginBottom: '10px'}}>
          Toggle Can Explore ({uiCanExplore ? 'Allowed' : 'Blocked'})
        </button>
      </div>
      
      <button onClick={handleDecide} style={{marginRight: '5px'}}>
        Decide Next Action
      </button>

      {/* Example transitions - in a real app, these would be triggered by game events or conditions */}
      {current.name === BOT_STATES.IDLE && (
        <>
          <button onClick={() => {
            console.log(`[Button - Start Exploring] Attempting to send 'explore' event.`);
            send('explore');
          }} style={{marginRight: '5px'}}>
            Start Exploring (Guard uses machine context: {current.context.canExplore ? 'Pass' : 'Fail'})
          </button>
          <button onClick={() => send('collect')} style={{marginRight: '5px'}}>Start Collecting</button>
          <button onClick={() => send('returnHome')}>Return to Base</button>
        </>
      )}
      {current.name === BOT_STATES.EXPLORING && (
        <>
          <button onClick={() => send('foundResource')} style={{marginRight: '5px'}}>Found Resource</button>
          <button onClick={() => send('exploredArea')}>Area Explored (Idle)</button>
        </>
      )}
      {current.name === BOT_STATES.COLLECTING && (
        <>
          <button onClick={() => send('inventoryFull')} style={{marginRight: '5px'}}>Inventory Full (Return)</button>
          <button onClick={() => send('resourceDepleted')}>Resource Depleted (Idle)</button>
        </>
      )}
      {current.name === BOT_STATES.RETURNING && (
        <button onClick={() => send('atBase')}>Arrived at Base (Idle)</button>
      )}
    </div>
  );
};

export default MyFSMComponent;
