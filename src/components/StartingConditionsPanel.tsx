import type { FairnessValidationResult, FairnessRuleResult } from '../stores/useTileStore/slices/tileFairnessSlice.ts';

import { useTileStore } from '../stores/useTileStore/index.ts';

/**
 * Component displaying starting conditions fairness analysis
 * Shows all 5 fairness metrics with visual indicators and margins
 */
export default function StartingConditionsPanel() {
  const fairnessData = useTileStore((state) => state.lastFairnessValidation);
  const tiles = useTileStore((state) => state.tiles);

  if (!fairnessData || !tiles) {
    return null;
  }

  const result = fairnessData as FairnessValidationResult;

  // Calculate overall fairness score (0-100) based on margins to thresholds
  const calculateFairnessScore = (): { score: number; stars: number } => {
    let totalMargin = 0;
    let ruleCount = 0;

    // Spawn distance: metric >= threshold means margin = (metric - threshold) / threshold * 100
    const spawnRule = result.rules.find(r => r.rule === 'spawnDistance');
    if (spawnRule && spawnRule.status === 'PASS') {
      const margin = ((spawnRule.value - spawnRule.threshold) / spawnRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    // For percentages (resource, terrain): margin = threshold - metric
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

    // Station access rules
    const fuelRule = result.rules.find(r => r.rule === 'fuelAccess');
    if (fuelRule && fuelRule.status === 'PASS') {
      const margin = ((fuelRule.threshold - fuelRule.value) / fuelRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const repairRule = result.rules.find(r => r.rule === 'repairAccess');
    if (repairRule && repairRule.status === 'PASS') {
      const margin = ((repairRule.threshold - repairRule.value) / repairRule.threshold) * 100;
      totalMargin += Math.min(margin, 100);
      ruleCount++;
    }

    const avgMargin = ruleCount > 0 ? totalMargin / ruleCount : 0;
    const score = Math.round(50 + (avgMargin / 2)); // Score 50-100 based on margin
    const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 45 ? 2 : 1;

    return { score: Math.min(score, 100), stars };
  };

  const { score: fairnessScore, stars } = calculateFairnessScore();

  const renderMarginBar = (value: number, threshold: number, isInverse: boolean = false) => {
    // For spawn distance: value >= threshold (higher is better)
    // For percentages: value <= threshold (lower is better)
    let percentage = 0;
    if (isInverse) {
      // For distances and other "lower is better" metrics
      percentage = Math.min((value / threshold) * 100, 100);
    } else {
      // For "higher is better" (margin above threshold)
      percentage = Math.min(((threshold - value) / threshold) * 100, 100);
    }

    const color =
      percentage >= 75
        ? '#4CAF50' // Green - excellent
        : percentage >= 50
          ? '#FFC107' // Yellow - good
          : percentage >= 25
            ? '#FF9800' // Orange - tight
            : '#F44336'; // Red - critical

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
        <div
          style={{
            width: '200px',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', minWidth: '60px', color: color, fontWeight: 'bold' }}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    );
  };

  const renderStatus = (rule: FairnessRuleResult): string => {
    if (rule.status !== 'PASS') return '❌ CRITICAL';

    const value = rule.value;
    const threshold = rule.threshold;

    // For spawn distance (higher is better)
    if (rule.rule === 'spawnDistance') {
      const margin = ((value - threshold) / threshold) * 100;
      return margin >= 50 ? '✅ EXCELLENT' : margin >= 25 ? '✅ FAVORABLE' : '⚠️ TIGHT';
    }

    // For percentages (lower is better)
    const margin = ((threshold - value) / threshold) * 100;
    return margin >= 50 ? '✅ EXCELLENT' : margin >= 25 ? '✅ FAVORABLE' : '⚠️ TIGHT';
  };

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#e0e0e0',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', color: '#4CAF50', fontSize: '16px' }}>
          🎯 STARTING CONDITIONS ANALYSIS
        </h2>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
          Seed: {result.seed} | Mode: BALANCED | Attempt: {result.attempt}/10
        </div>
      </div>

      {/* Each Rule */}
      {result.rules.map((rule: FairnessRuleResult, index: number) => (
        <div
          key={index}
          style={{
            marginBottom: '15px',
            paddingBottom: '15px',
            borderBottom:
              index < result.rules.length - 1 ? '1px solid #333' : 'none',
          }}
        >
          {/* Rule Title */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>
              {rule.rule === 'spawnDistance' && '📏 SPAWN DISTANCE'}
              {rule.rule === 'resourceBalance' && '💰 RESOURCE BALANCE'}
              {rule.rule === 'fuelAccess' && '⛽ FUEL STATION ACCESS'}
              {rule.rule === 'repairAccess' && '🔧 REPAIR STATION ACCESS'}
              {rule.rule === 'terrainFairness' && '🌍 TERRAIN FAIRNESS'}
            </span>
            <span style={{ marginLeft: '10px', color: '#888', fontSize: '11px' }}>
              {rule.details}
            </span>
          </div>

          {/* Metrics */}
          <div style={{ marginLeft: '10px', fontSize: '12px', marginBottom: '8px' }}>
            <div style={{ color: '#aaa' }}>
              Metric:{' '}
              <span style={{ color: '#fff' }}>
                {rule.value.toFixed(rule.rule.includes('Distance') ? 1 : rule.rule.includes('Access') ? 0 : 1)}
                {rule.rule.includes('Difference') ? '%' : rule.rule.includes('Access') ? ' tiles' : ' tiles'}
              </span>
              {' | Threshold: '}
              <span style={{ color: '#fff' }}>
                {rule.rule === 'spawnDistance' ? '≥' : '≤'}{' '}
                {rule.threshold.toFixed(rule.rule.includes('Difference') ? 0 : 1)}
                {rule.rule.includes('Difference') ? '%' : ' tiles'}
              </span>
            </div>

            {/* Progress Bar */}
            {renderMarginBar(
              rule.value,
              rule.threshold,
              rule.rule === 'spawnDistance',
            )}

            {/* Status */}
            <div style={{ marginTop: '5px', fontSize: '12px', fontWeight: 'bold' }}>
              Status: {renderStatus(rule)}
            </div>
          </div>
        </div>
      ))}

      {/* Fairness Score Summary */}
      <div
        style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '2px solid #4CAF50',
          backgroundColor: '#222',
          padding: '12px',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>📊 OVERALL FAIRNESS SCORE</span>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>
              Based on safety margins to thresholds
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: fairnessScore >= 75 ? '#4CAF50' : fairnessScore >= 50 ? '#FFC107' : '#F44336',
              }}
            >
              {fairnessScore}/100
            </div>
            <div style={{ fontSize: '18px', marginTop: '2px' }}>
              {'⭐'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      {result.valid && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#1b3a1b',
            borderLeft: '3px solid #4CAF50',
            fontSize: '12px',
            color: '#90EE90',
          }}
        >
          ✅ All fairness rules satisfied! Both bots start in balanced conditions.
        </div>
      )}
      {!result.valid && result.issues.length > 0 && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#3a1b1b',
            borderLeft: '3px solid #F44336',
            fontSize: '12px',
            color: '#FFB6B6',
          }}
        >
          ⚠️ Issues: {result.issues.join(' | ')}
        </div>
      )}
    </div>
  );
}
