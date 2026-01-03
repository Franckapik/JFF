/**
 * ==========================================================================
 * Test Reporters - Format and Display Guard Test Results
 * ==========================================================================
 * 
 * Provides formatted output for terminal display (tables, JSON, summaries)
 */

/**
 * Format test results as a readable table
 * 
 * @param results Array of test results
 * @returns Formatted table string
 */
export function formatResultsTable(results) {
  if (results.length === 0) {
    return '(No results)';
  }

  // Calculate column widths
  const guards = results.map((r) => r.guardName);
  const maxGuardLen = Math.max(...guards.map((g) => g.length), 'Guard'.length);
  const maxResultLen = Math.max(
    ...results.map((r) => String(r.result).length),
    'Result'.length
  );
  const maxErrorLen = Math.max(
    ...results.map((r) => (r.error ? r.error.length : 0)),
    5
  );

  const headerSeparator = '-'.repeat(
    maxGuardLen + maxResultLen + maxErrorLen + 20
  );

  let table = `\n${headerSeparator}\n`;
  table += `${'Guard'.padEnd(maxGuardLen + 2)}${'Status'.padEnd(10)}${'Result'.padEnd(
    maxResultLen + 2
  )}${'Duration'.padEnd(10)}${'Error'.padEnd(10)}\n`;
  table += `${headerSeparator}\n`;

  results.forEach((result) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const guardCell = result.guardName.padEnd(maxGuardLen + 2);
    const statusCell = status.padEnd(10);
    const resultCell = String(result.result ?? 'N/A').padEnd(
      maxResultLen + 2
    );
    const durationCell = result.duration.padEnd(10);
    const errorCell = result.error ? result.error.slice(0, 50) : '-';

    table += `${guardCell}${statusCell}${resultCell}${durationCell}${errorCell}\n`;
  });

  table += `${headerSeparator}\n`;

  return table;
}

/**
 * Format test results as JSON
 * 
 * @param results Array of test results
 * @param pretty Whether to pretty-print (default: true)
 * @returns JSON string
 */
export function formatResultsJSON(results, pretty = true) {
  return pretty
    ? JSON.stringify(results, null, 2)
    : JSON.stringify(results);
}

/**
 * Format test summary statistics
 * 
 * @param stats Object from getTestStats()
 * @returns Formatted summary string
 */
export function formatTestSummary(stats) {
  const { total, passed, failed, passRate } = stats;

  let summary = '\n📊 TEST SUMMARY\n';
  summary += '═'.repeat(40) + '\n';
  summary += `Total tests: ${total}\n`;
  summary += `Passed: ${passed} ✅\n`;
  summary += `Failed: ${failed} ❌\n`;
  summary += `Pass rate: ${passRate}%\n`;
  summary += '═'.repeat(40) + '\n';

  return summary;
}

/**
 * Format a single test result for detailed display
 * 
 * @param result Single test result object
 * @returns Formatted detailed result string
 */
export function formatDetailedResult(result) {
  const status = result.passed ? '✅ PASSED' : '❌ FAILED';
  const resultValue = result.result !== null ? String(result.result) : 'N/A';

  let output = `\n${result.guardName.toUpperCase()}: ${status}\n`;
  output += `- Duration: ${result.duration}\n`;
  output += `- Result: ${resultValue}\n`;

  if (result.error) {
    output += `- Error: ${result.error}\n`;
  }

  return output;
}

/**
 * Format context for display in error messages
 * 
 * @param context FSMContext object
 * @returns Formatted context string
 */
export function formatContext(context) {
  return JSON.stringify(
    {
      fuel: context.vehicle?.fuel,
      damage: context.vehicle?.damage,
      resources: context.vehicle?.resources,
      position: context.vehicle?.position,
      basePosition: context.vehicle?.basePosition,
    },
    null,
    2
  );
}

/**
 * Format header for guard test output
 * 
 * @param domainName Domain being tested (e.g., 'maintenance')
 * @param guardNames Array of guard names being tested
 * @returns Formatted header string
 */
export function formatHeader(domainName, guardNames) {
  let header = '\n';
  header += '═'.repeat(60) + '\n';
  header += `🧪 GUARD VALIDATION: ${domainName.toUpperCase()}\n`;
  header += '═'.repeat(60) + '\n';
  header += `Guards: ${guardNames.join(', ')}\n`;
  header += `Timestamp: ${new Date().toISOString()}\n`;
  header += '═'.repeat(60) + '\n\n';

  return header;
}

/**
 * Format a colored status indicator for terminal
 * 
 * @param passed Whether test passed
 * @returns Status string with emoji
 */
export function formatStatus(passed) {
  return passed ? '✅ PASS' : '❌ FAIL';
}
