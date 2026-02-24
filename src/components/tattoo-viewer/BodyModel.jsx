import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import TattooDecal from './TattooDecal';

const BODY_ZONES = {
  arm: { position: [0.35, 0.15, 0.08], rotation: [0, 0, -0.2], scale: [0.22, 0.30, 0.22] },
  chest: { position: [0, 0.35, 0.16], rotation: [0, 0, 0], scale: [0.30, 0.30, 0.30] },
  back: { position: [0, 0.35, -0.16], rotation: [0, Math.PI, 0], scale: [0.30, 0.30, 0.30] },
  leg: { position: [0.12, -0.45, 0.08], rotation: [0, 0, -0.05], scale: [0.22, 0.30, 0.22] },
};

function ProceduralBody({ tattooTexture, bodyZone, decalScale }) {
  const groupRef = useRef();

  const skinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x9a7055),
    roughness: 0.72,
    metalness: 0.0,
    sheen: 0.5,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(0xff8060),
    specularIntensity: 0.5,
    specularColor: new THREE.Color(0xffe8d0),
    clearcoat: 0.06,
    clearcoatRoughness: 0.5,
    envMapIntensity: 0.8,
  }), []);

  const zone = BODY_ZONES[bodyZone] || BODY_ZONES.arm;
  const finalScale = zone.scale.map(s => s * decalScale);

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh castShadow receiveShadow material={skinMat}>
        <capsuleGeometry args={[0.18, 0.50, 32, 48]} />
        <meshPhysicalMaterial {...skinMat} />
      </mesh>

      {/* Shoulders */}
      {[-1, 1].map(side => (
        <mesh key={`shoulder-${side}`} position={[side * 0.24, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.065, 24, 18]} />
          <meshPhysicalMaterial {...skinMat} />
        </mesh>
      ))}

      {/* Arms */}
      {[-1, 1].map(side => (
        <group key={`arm-${side}`}>
          <mesh position={[side * 0.30, 0.06, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.052, 0.28, 20, 32]} />
            <meshPhysicalMaterial {...skinMat} />
          </mesh>
          <mesh position={[side * 0.30, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.24, 18, 28]} />
            <meshPhysicalMaterial {...skinMat} />
          </mesh>
        </group>
      ))}

      {/* Neck */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 20]} />
        <meshPhysicalMaterial {...skinMat} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.09, 28, 22]} />
        <meshPhysicalMaterial {...skinMat} />
      </mesh>

      {/* Hips */}
      <mesh position={[0, -0.28, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.06, 24, 32]} />
        <meshPhysicalMaterial {...skinMat} />
      </mesh>

      {/* Legs */}
      {[-1, 1].map(side => (
        <group key={`leg-${side}`}>
          <mesh position={[side * 0.09, -0.52, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.062, 0.32, 22, 32]} />
            <meshPhysicalMaterial {...skinMat} />
          </mesh>
          <mesh position={[side * 0.09, -0.88, 0]} castShadow>
            <capsuleGeometry args={[0.048, 0.28, 18, 28]} />
            <meshPhysicalMaterial {...skinMat} />
          </mesh>
        </group>
      ))}

      {tattooTexture && (
        <TattooDecal
          texture={tattooTexture}
          position={zone.position}
          rotation={zone.rotation}
          scale={finalScale}
          parentRef={groupRef}
        />
      )}
    </group>
  );
}

function GLBBody({ url, tattooTexture, bodyZone, decalScale }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useEffect(() => {
    if (!scene) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.2 / maxDim;
    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));
    scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 0.8;
          child.material.roughness = Math.max(child.material.roughness ?? 0.7, 0.5);
        }
      }
    });
  }, [scene]);

  const zone = BODY_ZONES[bodyZone] || BODY_ZONES.arm;
  const finalScale = zone.scale.map(s => s * decalScale);

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
      {tattooTexture && (
        <TattooDecal
          texture={tattooTexture}
          position={zone.position}
          rotation={zone.rotation}
          scale={finalScale}
        />
      )}
    </group>
  );
}

export default function BodyModel({ modelUrl, tattooTexture, bodyZone, decalScale }) {
  if (modelUrl) {
    return <GLBBody url={modelUrl} tattooTexture={tattooTexture} bodyZone={bodyZone} decalScale={decalScale} />;
  }
  return <ProceduralBody tattooTexture={tattooTexture} bodyZone={bodyZone} decalScale={decalScale} />;
}

export { BODY_ZONES };
