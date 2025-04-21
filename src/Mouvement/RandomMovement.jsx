import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

const RandomMovement = ({ initialPosition, children }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random offset for movement
      const offsetX = (Math.random() - 0.5) * 2;
      const offsetZ = (Math.random() - 0.5) * 2;
      setPosition((prev) => ({
        x: prev.x + offsetX,
        y: prev.y,
        z: prev.z + offsetZ,
      }));
    }, 1000); // Update position every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useFrame(() => {
    // Optionally, smooth the movement using frame updates
  });

  return <group position={[position.x, position.y, position.z]}>{children}</group>;
};

export default RandomMovement;
