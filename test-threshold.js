/**
 * Test rapide de la logique de seuil de retour à la base
 */

// Simulation des imports
const RESOURCE_CONSTANTS = { RETURN_TO_BASE_THRESHOLD: 0.8 };
const DEFAULT_CAPACITIES = { main_ship: { food: 200, debris: 1800, special: 3 } };

function shipShouldReturnToBase(vehicle) {
  const currentResources = vehicle.resources || { food: 0, debris: 0, special: 0 };
  const maxCapacity = DEFAULT_CAPACITIES.main_ship;
  const threshold = RESOURCE_CONSTANTS.RETURN_TO_BASE_THRESHOLD;
  
  // Vérifier si une des capacités individuelles atteint le seuil
  const capacityChecks = {
    food: (currentResources.food || 0) >= (maxCapacity.food || 200) * threshold,
    debris: (currentResources.debris || 0) >= (maxCapacity.debris || 1800) * threshold,
    special: (currentResources.special || 0) >= (maxCapacity.special || 3) * threshold
  };
  
  const anyCapacityNearFull = Object.values(capacityChecks).some(isFull => isFull);
  
  if (anyCapacityNearFull) {
    const individualPercentages = {
      food: Math.round(((currentResources.food || 0) / (maxCapacity.food || 200)) * 100),
      debris: Math.round(((currentResources.debris || 0) / (maxCapacity.debris || 1800)) * 100),
      special: Math.round(((currentResources.special || 0) / (maxCapacity.special || 3)) * 100)
    };
    
    console.log(`✅ Should return to base: F:${individualPercentages.food}% D:${individualPercentages.debris}% S:${individualPercentages.special}% (Threshold: ${Math.round(threshold * 100)}%)`);
  }
  
  return anyCapacityNearFull;
}

// Tests
console.log("=== TEST DU SEUIL DE RETOUR À LA BASE ===\n");

const testCases = [
  { name: "Vaisseau vide", resources: { food: 0, debris: 0, special: 0 } },
  { name: "Food à 79%", resources: { food: 158, debris: 100, special: 0 } },
  { name: "Food à 80% (SEUIL)", resources: { food: 160, debris: 100, special: 0 } },
  { name: "Debris à 79%", resources: { food: 50, debris: 1422, special: 0 } },
  { name: "Debris à 80% (SEUIL)", resources: { food: 50, debris: 1440, special: 0 } },
  { name: "Special à 79%", resources: { food: 50, debris: 100, special: 2.37 } },
  { name: "Special à 80% (SEUIL)", resources: { food: 50, debris: 100, special: 2.4 } },
  { name: "Toutes ressources moyennes", resources: { food: 100, debris: 900, special: 1 } },
  { name: "Vaisseau presque plein", resources: { food: 190, debris: 1700, special: 2.9 } }
];

testCases.forEach(testCase => {
  const vehicle = { resources: testCase.resources };
  const result = shipShouldReturnToBase(vehicle);
  
  console.log(`${result ? '🔴' : '🟢'} ${testCase.name}:`, 
    `F:${testCase.resources.food} D:${testCase.resources.debris} S:${testCase.resources.special}`,
    result ? '→ RETOUR BASE' : '→ CONTINUE');
});

console.log("\n=== RÉSULTATS ===");
console.log("🔴 = Retour à la base requis");
console.log("🟢 = Peut continuer à collecter");
console.log("Seuil configuré: 80% d'un seul type de ressource");
