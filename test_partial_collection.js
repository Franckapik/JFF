// Test temporaire pour vérifier la collecte partielle
// Réduire temporairement les capacités pour forcer une collecte partielle

const originalCapacities = {
  food: 200,
  debris: 1800,
  special: 3
};

const testCapacities = {
  food: 25,    // Très réduit pour forcer une collecte partielle
  debris: 100, // Très réduit pour forcer une collecte partielle
  special: 1   // Très réduit pour forcer une collecte partielle
};

// Instructions pour tester :
// 1. Modifier temporairement DEFAULT_CAPACITIES dans constants.js
// 2. Lancer l'application
// 3. Observer les logs pour voir si la collecte partielle fonctionne
// 4. Vérifier que les tuiles montrent un pourcentage > 0 après collecte partielle
// 5. Restaurer les capacités originales

console.log("Test capacities:", testCapacities);
console.log("Pour forcer une collecte partielle, remplacez temporairement les capacités dans constants.js");
