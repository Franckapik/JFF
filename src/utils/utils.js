export function generateHexPositions(radius, spacing) {
  const hexPositions = [];
  const sqrt3 = Math.sqrt(3);

  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) <= radius) {
        const x = (q + r / 2) * (1.7 + spacing); // Further increase spacing to x
        const z = r * (sqrt3 / 2) * (1.7 + spacing); // Further increase spacing to z
        hexPositions.push({
          position: { x, y: 0, z }, // 3D position
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        });
      }
    }
  }

  return hexPositions;
}
