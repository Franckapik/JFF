/**
 * Test de débogage pour la synchronisation de position FSM
 */

// Simuler l'action updatePosition avec les corrections
const mockEvent = {
  position: { x: 5, y: 0, z: 5 },
  coord: "5,5",
  newCoord: "5,5"
};

const mockContext = {
  vehicle: {
    id: 'test-vehicle',
    type: 'main-ship'
  }
};

// Fonction updatePosition corrigée (version du fix)
function updatePosition(context, event) {
  if (!event.newCoord && !event.coord && !event.position) {
    return context;
  }

  const updatedVehicle = {
    ...context.vehicle,
    lastUpdate: Date.now()
  };

  // Mettre à jour la coordonnée
  if (event.newCoord || event.coord) {
    updatedVehicle.coord = event.newCoord || event.coord;
  }

  // Mettre à jour la position 3D
  if (event.position) {
    updatedVehicle.position = event.position;
  }

  return {
    ...context,
    vehicle: updatedVehicle
  };
}

// Test
console.log("=== Test de synchronisation de position ===");
console.log("Contexte initial:", JSON.stringify(mockContext, null, 2));
console.log("Événement:", JSON.stringify(mockEvent, null, 2));

const result = updatePosition(mockContext, mockEvent);
console.log("Résultat après updatePosition:", JSON.stringify(result, null, 2));

// Vérifications
console.log("\n=== Vérifications ===");
console.log("✓ Position mise à jour:", result.vehicle.position ? "OUI" : "NON");
console.log("✓ Coordonnée mise à jour:", result.vehicle.coord ? "OUI" : "NON");
console.log("✓ Position x correct:", result.vehicle.position?.x === 5 ? "OUI" : "NON");
console.log("✓ Coord correct:", result.vehicle.coord === "5,5" ? "OUI" : "NON");

if (result.vehicle.position && result.vehicle.coord) {
  console.log("🎉 La synchronisation de position fonctionne correctement !");
} else {
  console.log("❌ Il y a encore un problème avec la synchronisation.");
}
