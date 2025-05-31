/**
 * Test de diagnostic pour comprendre pourquoi les guards retournent true
 */
import React, { useEffect } from 'react';
import { useBotMachineFixed } from '../hooks/useBotMachineFixed.js';
import { SYSTEM_EVENT_TYPES } from '../machine/events/systemEvents.js';
import { safetyGuards, efficiencyGuards, baseGuards, discoveryGuards } from '../machine/guards/index.js';

const DiagnosticGuards = ({ botId = 'bot-test' }) => {
  const { context, entity, vehicle, state, current, send } = useBotMachineFixed(botId);

  useEffect(() => {
    if (context) {
      console.log('\n=== DIAGNOSTIC GUARDS ===');
      console.log('📋 Context complet:', context);
      console.log('🚗 Vehicle:', vehicle);
      console.log('📱 Entity:', entity);
      console.log('🎯 State:', state);
      
      // Test des guards de sécurité
      console.log('\n🛡️ SAFETY GUARDS:');
      const criticalFuel = safetyGuards.isCriticalFuel(context);
      const lowFuel = safetyGuards.isLowFuel(context);
      const needsEmergency = safetyGuards.needsEmergencyReturn(context);
      
      console.log('  - isCriticalFuel:', criticalFuel);
      console.log('  - isLowFuel:', lowFuel);
      console.log('  - needsEmergencyReturn:', needsEmergency);
      
      // Test des guards d'efficacité
      console.log('\n⚡ EFFICIENCY GUARDS:');
      const atMaxCapacity = efficiencyGuards.isAtMaxCapacity(context);
      const shouldReturn = efficiencyGuards.shouldReturnForEfficiency(context);
      
      console.log('  - isAtMaxCapacity:', atMaxCapacity);
      console.log('  - shouldReturnForEfficiency:', shouldReturn);
      
      // Test des guards de base
      console.log('\n🏠 BASE GUARDS:');
      const isAtBase = baseGuards.isAtBase(context);
      const notAtBase = !baseGuards.isAtBase(context);
      
      console.log('  - isAtBase:', isAtBase);
      console.log('  - !isAtBase (causes RETURNING):', notAtBase);
      console.log('  - vehicle.position:', context.vehicle?.position);
      console.log('  - vehicle.basePosition:', context.vehicle?.basePosition);
      
      // Test des guards de découverte
      console.log('\n🔍 DISCOVERY GUARDS:');
      try {
        const hasUnexploredAreas = discoveryGuards.hasUnexploredAreas(context);
        console.log('  - hasUnexploredAreas:', hasUnexploredAreas);
        console.log('  - hasUnexploredAreas would go to EXPLORING:', hasUnexploredAreas);
      } catch (error) {
        console.log('  - hasUnexploredAreas ERROR:', error.message);
        console.log('  - This could explain why EXPLORING transition fails!');
      }
      
      // Détails du véhicule
      console.log('\n🔍 VEHICLE DETAILS:');
      console.log('  - Vehicle exists:', !!context.vehicle);
      console.log('  - Vehicle fuel:', context.vehicle?.fuel);
      console.log('  - Vehicle resources:', context.vehicle?.resources);
      console.log('  - Vehicle maxCapacity:', context.vehicle?.maxCapacity);
      
      // Test de la condition complète
      const safetyCondition = needsEmergency || shouldReturn;
      const baseCondition = notAtBase;
      console.log('\n📊 TRANSITION CONDITIONS:');
      console.log('  - Safety condition (needsEmergencyReturn || shouldReturnForEfficiency):', safetyCondition);
      console.log('  - Base condition (!isAtBase):', baseCondition);
      console.log('  - SAFETY condition would go to RETURNING:', safetyCondition);
      console.log('  - BASE condition would go to RETURNING:', baseCondition);
      console.log('  - Discovery guard might be broken, check logs above!');
      console.log('  - This explains why bot goes to RETURNING!');
    }
  }, [context, vehicle, entity, state]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#1a1a1a', 
      color: '#fff', 
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <h3>🔍 Guard Diagnostic</h3>
      <div>Bot ID: {botId}</div>
      <div>State: {state}</div>
      <div>Vehicle fuel: {vehicle?.fuel || 'N/A'}</div>
      <div>Context véhicule: {context?.vehicle ? 'OK' : 'MANQUANT'}</div>
      <button 
        onClick={() => {
          console.log('\n🔥 MANUAL ASSESSMENT_COMPLETE TRIGGER');
          console.log('  - Current state before:', state);
          send(SYSTEM_EVENT_TYPES.ASSESSMENT_COMPLETE);
          console.log('  - Event sent manually');
        }}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '10px'
        }}
      >
        🚀 Force Assessment
      </button>
      <div style={{ marginTop: '10px', fontSize: '10px' }}>
        Vérifiez la console pour les détails complets
      </div>
    </div>
  );
};

export default DiagnosticGuards;
