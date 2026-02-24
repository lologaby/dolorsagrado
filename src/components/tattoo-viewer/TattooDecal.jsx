import { useRef } from 'react';
import { Decal } from '@react-three/drei';
import * as THREE from 'three';

export default function TattooDecal({ texture, position, rotation, scale }) {
  const meshRef = useRef();

  if (!texture) return null;

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.001, 1, 1]} />
      <meshBasicMaterial transparent opacity={0} />
      <Decal
        position={[0, 0, 0]}
        rotation={rotation}
        scale={scale}
        polygonOffsetFactor={-1}
      >
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.05}
          roughness={0.55}
          metalness={0.0}
          blending={THREE.NormalBlending}
          toneMapped={true}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-4}
          polygonOffsetUnits={-4}
        />
      </Decal>
    </mesh>
  );
}
