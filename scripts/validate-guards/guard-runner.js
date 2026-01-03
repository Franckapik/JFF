/**
 * ==========================================================================
 * Guard Runner - Execute Guards with Mock Context and Capture Results
 * ==========================================================================
 * 
 * Executes pure guards in Node.js environment without R3F or Zustand.
 * Handles guard execution, error catching, and result formatting.
 */

/**
 * Execute a single guard with given context and event
 * 
 * @param guardName Name of the guard being tested (for logging)
 * @param guardFn The guard function (XStateV5Guard)
 * @param mockContext Mock FSMContext object
 * @param mockEvent Mock event object (usually {})
 * @returns Object with execution result
 * 
 * @example
 * // Test a guard
 * const result = await testGuard(
 *   'needsRefuel',
 *   needsRefuel,
 *   { vehicle: { fuel: 20 } },
 *   {}
 * );
 * console.log(result);
 * // { passed: true, guardName: 'needsRefuel', result: true, ... }
 */
export async function testGuard(
  guardName,
  guardFn,
  mockContext,
  mockEvent = {}
) {
  const startTime = performance.now();

  try {
    if (typeof guardFn !== 'function') {
      throw new Error(`Guard ${guardName} is not a function`);
    }

    // Execute guard with mocked arguments
    const result = guardFn({ context: mockContext, event: mockEvent });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return {
      passed: true,
      guardName,
      result,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return {
      passed: false,
      guardName,
      result: null,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Execute multiple guards sequentially
 * 
 * @param guards Array of [guardName, guardFn] tuples
 * @param mockContext Mock FSMContext
 * @param mockEvent Mock event
 * @returns Array of test results
 * 
 * @example
 * const results = await testGuards(
 *   [
 *     ['needsRefuel', needsRefuel],
 *     ['needsRepair', needsRepair],
 *   ],
 *   mockContext,
 *   {}
 * );
 */
export async function testGuards(guards, mockContext, mockEvent = {}) {
  const results = [];

  for (const [guardName, guardFn] of guards) {
    const result = await testGuard(guardName, guardFn, mockContext, mockEvent);
    results.push(result);
  }

  return results;
}

/**
 * Get statistics about test results
 * 
 * @param results Array of test results from testGuards()
 * @returns Object with pass/fail counts and summary
 */
export function getTestStats(results) {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  return {
    total,
    passed,
    failed,
    passRate: ((passed / total) * 100).toFixed(1),
    timestamp: new Date().toISOString(),
  };
}
