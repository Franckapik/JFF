import { Canvas } from "@react-three/fiber";
import React from "react";

const Box: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

const TestR3F: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 5] }}>
    <gridHelper args={[10, 10]} />
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <Box />
  </Canvas>
);

export default TestR3F;