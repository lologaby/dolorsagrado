import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import PieceModel from './PieceModel';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
      />
      <pointLight position={[-3, 2, 3]} color="#ffccaa" intensity={0.8} />
      <pointLight position={[2, -1, -2]} color="#8090c0" intensity={0.3} />
    </>
  );
}

function PostFX() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.7} intensity={0.3} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.6} />
    </EffectComposer>
  );
}

function Spinner() {
  return (
    <mesh>
      <torusGeometry args={[0.12, 0.015, 12, 48]} />
      <meshStandardMaterial color="#b98a37" wireframe />
    </mesh>
  );
}

function PieceCanvas({ piece }) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-neutral-800/50 bg-black shadow-[0_16px_48px_rgba(0,0,0,0.8)] hover:border-gold/30 transition-all duration-300 group">
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.2, 2.5], fov: 38, near: 0.01, far: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: '#0a0a0a' }}
        >
          <Lights />
          <Environment preset="studio" background={false} />

          <Suspense fallback={<Spinner />}>
            <PieceModel url={piece.model} />
          </Suspense>

          <ContactShadows
            position={[0, -1.1, 0]}
            opacity={0.45}
            scale={3}
            blur={2.5}
            far={3}
            color="#000"
          />

          <OrbitControls
            minDistance={1}
            maxDistance={4}
            autoRotate
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI * 0.82}
          />

          <PostFX />
        </Canvas>

        {/* 3D badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-neutral-700/50 rounded-md px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-[8px] font-extrabold tracking-[1.5px] uppercase text-gold">3D</span>
        </div>
      </div>

      {/* Info strip */}
      <div className="px-4 py-3 border-t border-neutral-800/50">
        <p className="text-white text-[13px] font-semibold tracking-wide">{piece.title}</p>
        <p className="text-neutral-500 text-[10px] mt-0.5">{piece.style}</p>
      </div>
    </div>
  );
}

export default function TattooViewer({ pieces }) {
  const parsedPieces = typeof pieces === 'string' ? JSON.parse(pieces) : pieces;

  return (
    <div className="grid gap-5" style={{
      gridTemplateColumns: parsedPieces.length === 1
        ? '1fr'
        : 'repeat(auto-fill, minmax(280px, 1fr))'
    }}>
      {parsedPieces.map((piece) => (
        <PieceCanvas key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
