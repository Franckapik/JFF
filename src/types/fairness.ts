/**
 * Fairness validation types
 * Used to track game setup fairness across multiple rules
 */

export interface FairnessRuleResult {
  rule: 'spawnDistance' | 'resourceBalance' | 'stationAccess' | 'terrainFairness' | 'fuelAccess' | 'repairAccess';
  status: 'PASS' | 'FAIL' | 'WARNING';
  value: number;
  threshold: number;
  message: string;
  details?: string; // Optional details for more context
}

export interface FairnessValidationResult {
  passed: boolean;
  valid: boolean; // Alias for passed (compatibility)
  rules: FairnessRuleResult[];
  timestamp: number;
  mapDimensions?: {
    radius: number;
    spacing: number;
  };
}
