import React from 'react';

import { useTileStore } from '../stores/useTileStore/index.ts';
import type { FairnessValidationResult } from '../stores/useTileStore/slices/tileFairnessSlice.ts';

function StartingConditionsDisplay({ compact = false }: { compact?: boolean }) {
  const fairnessData = useTileStore((state) => state.lastFairnessValidation);

  if (!fairnessData) {
    return null;
  }

  const result = fairnessData as FairnessValidationResult;

  const calculateFairnessScore = (): { score: number; stars: number } => {
    let totalMargin = 0;
    let ruleCount = 0;

    const spawnRule = result.rules.find(r => r.rule === 'spawnDistance');
    if (spawnRule && spawnRule.status === 'PASS') {
      const margin = ((spawnRule.value - spawnRule.threshold) / spawnRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const resourceRule = result.rules.find(r => r.rule === 'resourceBalance');
    if (resourceRule && resourceRule.status === 'PASS') {
      const margin = ((resourceRule.threshold - resourceRule.value) / resourceRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const terrainRule = result.rules.find(r => r.rule === 'terrainFairness');
    if (terrainRule && terrainRule.status === 'PASS') {
      const margin = ((terrainRule.threshold - terrainRule.value) / terrainRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const fuelRule = result.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.status === 'PASS' && fuelRule.value !== 999) {
      const margin = ((fuelRule.threshold - fuelRule.value) / fuelRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const repairRule = result.rules.find(r => r.rule === 'repairAccess');
    if (repairRule && repairRule.status === 'PASS' && repairRule.value !== 999) {
      const margin = ((repairRule.threshold - repairRule.value) / repairRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const avgMargin = ruleCount > 0 ? totalMargin / ruleCount : 0;
    const score = Math.round(50 + (avgMargin / 2));
    const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 45 ? 2 : 1;

    return { score: Math.min(score, 100), stars };
  };

  const { score: fairnessScore, stars } = calculateFairnessScore();
  const passedRules = result.rules.filter(r => r.status === 'PASS').length;
  const totalRules = result.rules.length;

  return (
    <div style={{
      padding: compact ? '8px' : '12px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderLeft: `3px solid #4CAF50`,
      borderRadius: '6px',
      flex: 1,
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: compact ? '11px' : '12px', color: '#4CAF50' }}>
        🎯 Starting Conditions
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '4px' : '6px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: compact ? '9px' : '11px',
          padding: '2px 4px',
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '3px',
        }}>
          <span>Fairness Score</span>
          <span style={{ color: fairnessScore >= 75 ? '#4CAF50' : fairnessScore >= 50 ? '#FFC107' : '#F44336', fontWeight: 'bold' }}>
            {fairnessScore}/100
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: compact ? '9px' : '11px',
          padding: '2px 4px',
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '3px',
        }}>
          <span>Rules Passed</span>
          <span style={{ color: passedRules === totalRules ? '#4CAF50' : '#FFC107', fontWeight: 'bold' }}>
            {passedRules}/{totalRules}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: compact ? '9px' : '11px',
          padding: '2px 4px',
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '3px',
        }}>
          <span>Seed</span>
          <span style={{ fontWeight: 'bold' }}>{result.seed}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: compact ? '9px' : '11px',
          padding: '2px 4px',
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
          borderRadius: '3px',
        }}>
          <span>Status</span>
          <span style={{ color: result.valid ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
            {result.valid ? '✅ VALID' : '❌ ISSUES'}
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '6px',
        paddingTop: '6px',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: compact ? '9px' : '10px',
      }}>
        <span>Rating:</span>
        <span>{('⭐'.repeat(stars)) + ('☆'.repeat(5 - stars))}</span>
      </div>
    </div>
  );
}

export const StartingConditionsPanel = () => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎯 Starting Conditions</h3>
      <StartingConditionsDisplay />
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 20,
    left: 400,
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#333',
    padding: '12px',
    borderRadius: '8px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    minWidth: '200px',
    maxWidth: '350px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    border: '1px solid #e0e0e0',
  } as React.CSSProperties,
  title: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    color: '#4CAF50',
  } as React.CSSProperties,
};

export default StartingConditionsPanel;
