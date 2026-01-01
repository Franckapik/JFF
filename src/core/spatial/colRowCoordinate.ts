/**
 * ============================================================================
 * COLROW COORDINATE SYSTEM
 * ============================================================================
 * 
 * Converts between ColRow format (A1, B2, AA5, etc.) and other coordinate formats.
 * 
 * ColRow is a human-readable format with:
 * - Column: Letters (A-Z, AA-AZ, BA-BZ, etc.)
 * - Row: Numbers (1, 2, 3, etc.)
 * 
 * Usable for:
 * - UI display and user input
 * - Debugging and logging
 * - Game board references
 */

import type { ColRowCoordinate, GridCoordinate } from '../../types/coordinates.d';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert column number to letter(s): 0→A, 1→B, 26→AA, etc.
 * @example colNumberToLetters(0) → 'A'
 * @example colNumberToLetters(26) → 'AA'
 */
function colNumberToLetters(col: number): string {
  let result = '';
  let n = col;
  while (n >= 0) {
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26) - 1;
    if (n < 0) break;
  }
  return result;
}

/**
 * Convert letter(s) to column number: A→0, B→1, AA→26, etc.
 * @example lettersToColNumber('A') → 0
 * @example lettersToColNumber('AA') → 26
 */
function lettersToColNumber(letters: string): number {
  let result = 0;
  for (const char of letters) {
    result = result * 26 + (char.charCodeAt(0) - 64);
  }
  return result - 1;
}

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert GridCoordinate (q,r) to ColRowCoordinate (A1, B2, ...)
 * 
 * Requires the grid bounds (minQ, maxQ, minR, maxR) to calculate correct positions.
 * 
 * @param coord - GridCoordinate in format "q,r"
 * @param bounds - { minQ, maxQ, minR, maxR } to position the grid
 * @returns ColRowCoordinate like "A1", "B2", "AA5"
 * @throws If coordinate is invalid or out of bounds
 */
export function gridToColRow(
  coord: GridCoordinate,
  bounds: { minQ: number; maxQ: number; minR: number; maxR: number }
): ColRowCoordinate {
  const [qStr, rStr] = coord.split(',');
  const q = parseInt(qStr, 10);
  const r = parseInt(rStr, 10);

  if (isNaN(q) || isNaN(r)) {
    throw new Error(`Invalid GridCoordinate format: ${coord}`);
  }

  // Validate bounds
  if (q < bounds.minQ || q > bounds.maxQ || r < bounds.minR || r > bounds.maxR) {
    throw new Error(
      `Coordinate ${coord} out of bounds: q[${bounds.minQ}-${bounds.maxQ}], r[${bounds.minR}-${bounds.maxR}]`
    );
  }

  // Calculate column and row in grid
  const col = q - bounds.minQ;
  const row = r - bounds.minR + 1; // Rows are 1-indexed

  const colLetters = colNumberToLetters(col);
  return `${colLetters}${row}` as ColRowCoordinate;
}

/**
 * Convert ColRowCoordinate (A1, B2, ...) to GridCoordinate (q,r)
 * 
 * Requires the grid bounds to reconstruct the q,r values.
 * 
 * @param colRow - ColRowCoordinate like "A1", "B2", "AA5"
 * @param bounds - { minQ, maxQ, minR, maxR } to position the grid
 * @returns GridCoordinate in format "q,r"
 * @throws If ColRow format is invalid or out of bounds
 */
export function colRowToGrid(
  colRow: ColRowCoordinate,
  bounds: { minQ: number; maxQ: number; minR: number; maxR: number }
): GridCoordinate {
  // Parse ColRow format: letters + numbers
  const match = colRow.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid ColRowCoordinate format: ${colRow}. Expected format like A1, B2, AA5`);
  }

  const [, letters, rowStr] = match;
  const col = lettersToColNumber(letters);
  const row = parseInt(rowStr, 10);

  if (isNaN(row) || row < 1) {
    throw new Error(`Invalid row number in ColRowCoordinate: ${colRow}`);
  }

  // Calculate q, r
  const q = bounds.minQ + col;
  const r = bounds.minR + row - 1; // Convert from 1-indexed to 0-indexed

  // Validate bounds
  if (q < bounds.minQ || q > bounds.maxQ || r < bounds.minR || r > bounds.maxR) {
    throw new Error(
      `ColRowCoordinate ${colRow} maps out of bounds: q=${q}, r=${r}. ` +
      `Expected q[${bounds.minQ}-${bounds.maxQ}], r[${bounds.minR}-${bounds.maxR}]`
    );
  }

  return `${q},${r}` as GridCoordinate;
}

/**
 * Generate ColRow label for display on grid, without needing full bounds.
 * 
 * This is a simple version used just for UI display when you don't need
 * the inverse conversion back to GridCoordinate.
 * 
 * @param q - q coordinate (column offset)
 * @param r - r coordinate (row offset)
 * @param minQ - minimum q value in grid
 * @param minR - minimum r value in grid
 * @returns ColRowCoordinate like "A1", "B2"
 */
export function getColRowLabel(q: number, r: number, minQ: number, minR: number): ColRowCoordinate {
  const col = q - minQ;
  const row = r - minR + 1; // Rows are 1-indexed
  const colLetters = colNumberToLetters(col);
  return `${colLetters}${row}` as ColRowCoordinate;
}

/**
 * Parse a ColRowCoordinate into parts: { letters, row }
 * @example parseColRow('A1') → { letters: 'A', row: 1 }
 * @example parseColRow('AA5') → { letters: 'AA', row: 5 }
 */
export function parseColRow(colRow: ColRowCoordinate): { letters: string; row: number } {
  const match = colRow.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid ColRowCoordinate format: ${colRow}`);
  }
  return { letters: match[1], row: parseInt(match[2], 10) };
}

// ============================================================================
// BATCH CONVERSION UTILITIES
// ============================================================================

/**
 * Convert multiple GridCoordinates to ColRow format
 * Useful for batch processing or logging multiple coordinates
 */
export function gridListToColRow(
  coords: GridCoordinate[],
  bounds: { minQ: number; maxQ: number; minR: number; maxR: number }
): ColRowCoordinate[] {
  return coords.map((coord) => gridToColRow(coord, bounds));
}

/**
 * Convert multiple ColRow coordinates to GridCoordinate format
 */
export function colRowListToGrid(
  colRows: ColRowCoordinate[],
  bounds: { minQ: number; maxQ: number; minR: number; maxR: number }
): GridCoordinate[] {
  return colRows.map((colRow) => colRowToGrid(colRow, bounds));
}
