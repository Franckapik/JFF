export const generateHexPositions = (radius, spacing = 0.1) => {
  const positions = [];
  const hexWidth = Math.sqrt(3) * radius + spacing;

  // Palette de couleurs réduite
  const palette = ["#3498db", "#2980b9", "#1abc9c", "#16a085", "#2ecc71", "#27ae60"];

  // Fonction pour choisir une couleur aléatoire dans la palette
  const getRandomColor = () => palette[Math.floor(Math.random() * palette.length)];

  // Position centrale
  positions.push({ position: [0, 0, 0], color: getRandomColor() });

  // Positions des 6 tuiles du premier anneau
  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
  const firstRing = angles.map((angle) => {
    const x = Math.cos(angle) * hexWidth;
    const z = Math.sin(angle) * hexWidth;
    return { position: [x, 0, z], color: getRandomColor() };
  });
  positions.push(...firstRing);

  // Positions des 12 tuiles du deuxième anneau
  const secondRing = [];
  firstRing.forEach(({ position: [x, _, z] }) => {
    angles.forEach((angle) => {
      const offsetX = Math.cos(angle) * hexWidth;
      const offsetZ = Math.sin(angle) * hexWidth;
      const newX = x + offsetX;
      const newZ = z + offsetZ;

      // Éviter les doublons en vérifiant si la position existe déjà
      if (!positions.some((p) => Math.abs(p.position[0] - newX) < 0.01 && Math.abs(p.position[2] - newZ) < 0.01)) {
        secondRing.push({ position: [newX, 0, newZ], color: getRandomColor() });
      }
    });
  });
  positions.push(...secondRing);

  return positions;
};
