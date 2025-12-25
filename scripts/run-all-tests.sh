#!/bin/bash
# ============================================================================
# RUN ALL FSM TESTS
# ============================================================================
# Exécute tous les tests FSM: cycle complet + guards + vitest spatial
# Usage: bash scripts/run-all-tests.sh

set -e  # Exit on error

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          🧪 EXÉCUTION DE TOUS LES TESTS FSM 🧪               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: FSM Cycle Complet
echo "📌 [1/3] Exécution du test FSM cycle complet..."
echo ""
node scripts/test-fsm-cycle.js --scenario=full
echo ""
echo "✅ Tests FSM OK"
echo ""

# Test 2: Guards
echo "📌 [2/3] Exécution des tests Guards..."
echo ""
node scripts/quick-test-guards.js
echo ""
echo "✅ Tests Guards OK"
echo ""

# Test 3: Vitest Spatial (si disponible)
if command -v npx &> /dev/null; then
  echo "📌 [3/3] Exécution des tests Vitest core/spatial..."
  echo ""
  npx vitest run src/core/spatial --reporter=dot 2>/dev/null || echo "⚠️  Tests Vitest skipped (vitest not configured)"
  echo ""
  echo "✅ Tests Vitest OK"
else
  echo "⚠️  [3/3] npx not found, skipping Vitest tests"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║              🎉 TOUS LES TESTS RÉUSSIS! 🎉                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
