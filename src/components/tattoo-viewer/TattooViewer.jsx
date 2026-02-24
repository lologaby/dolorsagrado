import { useState, Suspense, useEffect } from 'react';
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

// Static preview for grid — no OrbitControls; canvas wrapper has pointer-events: none so scroll doesn't move the model
function PiecePreview({ piece }) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border border-neutral-800/50 bg-black shadow-[0_16px_48px_rgba(0,0,0,0.8)] hover:border-amber-400/40 transition-all duration-300 cursor-pointer group"
      style={{ aspectRatio: '3/4' }}
    >
      <div className="relative w-full h-full pointer-events-none select-none" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.2, 2.5], fov: 38, near: 0.01, far: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ background: '#0a0a0a', pointerEvents: 'none' }}
        >
          <Lights />
          <Environment preset="studio" background={false} />
          <Suspense fallback={<Spinner />}>
            <PieceModel url={piece.model} />
          </Suspense>
          <ContactShadows position={[0, -1.1, 0]} opacity={0.45} scale={3} blur={2.5} far={3} color="#000" />
          <PostFX />
        </Canvas>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-neutral-600/50 rounded-md px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-[8px] font-extrabold tracking-[1.5px] uppercase text-amber-400">3D</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white/90 text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Expandir
          </span>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-neutral-800/50">
        <p className="text-white text-[13px] font-semibold tracking-wide">{piece.title}</p>
        <p className="text-neutral-500 text-[10px] mt-0.5">{piece.style}</p>
      </div>
    </div>
  );
}

// Full interactive viewer in modal
function PieceModal({ piece, onClose }) {
  useEffect(() => {
    const onEscape = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Ver ${piece.title} en 3D`}
      onClick={onClose}
    >
      <div className="absolute top-0 right-0 left-0 h-14 flex items-center justify-between px-4 z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div>
          <p className="text-white font-semibold text-sm">{piece.title}</p>
          <p className="text-neutral-400 text-xs">{piece.style}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors pointer-events-auto"
          aria-label="Cerrar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 w-full min-h-0 mt-14 relative z-20" onClick={(e) => e.stopPropagation()}>
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
          style={{ background: '#0a0a0a', touchAction: 'none' }}
        >
          <Lights />
          <Environment preset="studio" background={false} />
          <Suspense fallback={<Spinner />}>
            <PieceModel url={piece.model} />
          </Suspense>
          <ContactShadows position={[0, -1.1, 0]} opacity={0.5} scale={4} blur={2.5} far={3} color="#000" />
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
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-500 text-[10px] uppercase tracking-widest z-20">
        Arrastra para rotar · Scroll para zoom
      </p>
    </div>
  );
}

export default function TattooViewer({ pieces }) {
  const [openId, setOpenId] = useState(null);
  const parsedPieces = typeof pieces === 'string' ? JSON.parse(pieces) : pieces;
  const openPiece = parsedPieces.find((p) => p.id === openId);

  return (
    <>
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: parsedPieces.length === 1 ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
        }}
      >
        {parsedPieces.map((piece) => (
          <div
            key={piece.id}
            data-piece-id={piece.id}
            role="button"
            tabIndex={0}
            onClick={() => setOpenId(piece.id)}
            onKeyDown={(e) => e.key === 'Enter' && setOpenId(piece.id)}
            className="outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050405] rounded-2xl"
          >
            <PiecePreview piece={piece} />
          </div>
        ))}
      </div>

      {openPiece && (
        <PieceModal piece={openPiece} onClose={() => setOpenId(null)} />
      )}
    </>
  );
}
