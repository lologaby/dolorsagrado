import { useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import BodyModel from './BodyModel';
import UploadPanel from './UploadPanel';

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
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
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.7}
        intensity={0.35}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.65} />
    </EffectComposer>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#b98a37" wireframe />
    </mesh>
  );
}

export default function TattooViewer({ modelUrl }) {
  const [tattooTexture, setTattooTexture] = useState(null);
  const [tattooPreview, setTattooPreview] = useState(null);
  const [bodyZone, setBodyZone] = useState('arm');
  const [decalScale, setDecalScale] = useState(1.0);

  const handleTattooUpload = useCallback((file) => {
    const url = URL.createObjectURL(file);
    setTattooPreview(url);

    const img = new Image();
    img.onload = () => {
      const tex = new THREE.Texture(img);
      tex.needsUpdate = true;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTattooTexture(tex);
    };
    img.src = url;
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[600px] lg:min-h-[700px] gap-0 bg-[#0a0a0a] rounded-2xl overflow-hidden border border-neutral-800/50">
      {/* Canvas area — 70% hero */}
      <div className="relative flex-[7] min-h-[400px] lg:min-h-0">
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
          <SceneLighting />
          <Environment preset="studio" background={false} />

          <Suspense fallback={<LoadingFallback />}>
            <BodyModel
              modelUrl={modelUrl}
              tattooTexture={tattooTexture}
              bodyZone={bodyZone}
              decalScale={decalScale}
            />
          </Suspense>

          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.5}
            scale={4}
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
            makeDefault
          />

          <PostFX />
        </Canvas>

        {/* Floating badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-neutral-700/50 rounded-lg px-3 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-[10px] font-bold tracking-[2px] uppercase text-gold">3D Viewer</span>
        </div>
      </div>

      {/* Side panel — 30% */}
      <div className="flex-[3] min-w-[260px] max-w-full lg:max-w-[320px] p-5 lg:p-6 border-t lg:border-t-0 lg:border-l border-neutral-800/50 bg-[#0c0c0c] overflow-y-auto">
        <div className="mb-5">
          <h3 className="text-white text-sm font-bold tracking-wide">Tattoo Visualizer</h3>
          <p className="text-neutral-500 text-[11px] mt-1">Preview your design on the body</p>
        </div>

        <UploadPanel
          bodyZone={bodyZone}
          setBodyZone={setBodyZone}
          decalScale={decalScale}
          setDecalScale={setDecalScale}
          onTattooUpload={handleTattooUpload}
          tattooPreview={tattooPreview}
        />
      </div>
    </div>
  );
}
