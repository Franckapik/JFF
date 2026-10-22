export default function TreasureShape() {
  return <>
    <mesh castShadow receiveShadow><boxGeometry args={[0.42, 0.3, 0.36]} /><meshStandardMaterial color="#795138" roughness={0.55} metalness={0.1} /></mesh>
    <mesh position={[0, 0.09, 0]} castShadow><boxGeometry args={[0.45, 0.1, 0.39]} /><meshStandardMaterial color="#d9a94a" metalness={0.72} roughness={0.24} /></mesh>
    <mesh position={[0, 0.025, 0.198]}><boxGeometry args={[0.12, 0.14, 0.025]} /><meshStandardMaterial color="#f5da81" emissive="#7b571d" emissiveIntensity={0.35} metalness={0.7} /></mesh>
  </>;
}
