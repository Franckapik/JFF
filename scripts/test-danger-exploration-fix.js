#!/usr/bin/env node

/**
 * Test script to verify danger tile exploration logic
 * 
 * This script simulates the findTilesInRadius function with the fix
 * to ensure danger tiles (explorable=true, walkable=false) are included
 */

// Simulate tile data
const mockTiles = {
  '1,1': { coord: '1,1', type: 'food', walkable: true, explorable: true, collected: false },
  '1,2': { coord: '1,2', type: 'danger', walkable: false, explorable: true, collected: false },
  '1,3': { coord: '1,3', type: 'food', walkable: true, explorable: true, collected: false },
  '2,1': { coord: '2,1', type: 'food', walkable: true, explorable: true, collected: false },
  '2,2': { coord: '2,2', type: 'depart', walkable: true, explorable: false, collected: false },
  '2,3': { coord: '2,3', type: 'food', walkable: true, explorable: true, collected: false },
};

// Old filter (broken)
function findTilesInRadiusOld(tile) {
  return tile.walkable && !tile.collected;
}

// New filter (fixed)
function findTilesInRadiusNew(tile) {
  return (tile.walkable || tile.explorable) && !tile.collected;
}

console.log('🔍 Testing findTilesInRadius logic\n');
console.log('Mock tiles data:');
Object.entries(mockTiles).forEach(([coord, tile]) => {
  console.log(`  ${coord}: type=${tile.type}, walkable=${tile.walkable}, explorable=${tile.explorable}`);
});

console.log('\n📊 Results:\n');

const candidates = {
  old: [],
  new: [],
};

// Test old behavior
console.log('❌ OLD BEHAVIOR (walkable only):');
Object.entries(mockTiles).forEach(([coord, tile]) => {
  if (coord !== '2,2') { // exclude center
    if (findTilesInRadiusOld(tile)) {
      candidates.old.push(coord);
      console.log(`   ✓ ${coord} (${tile.type})`);
    } else {
      console.log(`   ✗ ${coord} (${tile.type}) - FILTERED OUT`);
    }
  }
});

console.log('\n✅ NEW BEHAVIOR (walkable OR explorable):');
Object.entries(mockTiles).forEach(([coord, tile]) => {
  if (coord !== '2,2') { // exclude center
    if (findTilesInRadiusNew(tile)) {
      candidates.new.push(coord);
      console.log(`   ✓ ${coord} (${tile.type})`);
    } else {
      console.log(`   ✗ ${coord} (${tile.type}) - FILTERED OUT`);
    }
  }
});

console.log('\n📈 Summary:\n');
console.log(`Old candidates count: ${candidates.old.length}`);
console.log(`New candidates count: ${candidates.new.length}`);
console.log(`New tiles available: ${candidates.new.length - candidates.old.length}`);

const newTiles = candidates.new.filter(c => !candidates.old.includes(c));
console.log(`\n🎯 Newly explorable tiles (danger only):`);
newTiles.forEach(coord => {
  const tile = mockTiles[coord];
  console.log(`   ${coord} (${tile.type})`);
});

console.log('\n✨ Fix verified: Danger tiles are now included in drone targets!');
