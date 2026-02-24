import { useState, useRef, useCallback } from 'react';

const ZONES = [
  { id: 'arm', label: 'Brazo', icon: '💪' },
  { id: 'chest', label: 'Pecho', icon: '🫁' },
  { id: 'back', label: 'Espalda', icon: '🔙' },
  { id: 'leg', label: 'Pierna', icon: '🦵' },
];

export default function UploadPanel({ bodyZone, setBodyZone, decalScale, setDecalScale, onTattooUpload, tattooPreview }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    onTattooUpload(file);
  }, [onTattooUpload]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Upload */}
      <div>
        <label className="text-[10px] font-bold tracking-[2px] uppercase text-neutral-500 mb-2 block">
          Tattoo Design
        </label>
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer
            transition-all duration-200 group
            ${dragOver
              ? 'border-gold bg-gold/10'
              : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/60'
            }
          `}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          {tattooPreview ? (
            <div className="flex items-center gap-3">
              <img
                src={tattooPreview}
                alt="Tattoo preview"
                className="w-14 h-14 object-contain rounded-lg bg-neutral-800 p-1"
              />
              <div className="text-left flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">Design loaded</p>
                <p className="text-neutral-500 text-[10px] mt-0.5">Click to replace</p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2 opacity-40 group-hover:opacity-70 transition-opacity">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-neutral-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-neutral-400 text-xs font-medium">Upload PNG tattoo</p>
              <p className="text-neutral-600 text-[10px] mt-1">Transparent background recommended</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/webp,image/jpeg"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {/* Body zone */}
      <div>
        <label className="text-[10px] font-bold tracking-[2px] uppercase text-neutral-500 mb-2 block">
          Body Zone
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setBodyZone(z.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold
                transition-all duration-150 border
                ${bodyZone === z.id
                  ? 'bg-gold/15 border-gold text-gold'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
                }
              `}
            >
              <span className="text-sm">{z.icon}</span>
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scale slider */}
      <div>
        <label className="text-[10px] font-bold tracking-[2px] uppercase text-neutral-500 mb-2 flex items-center justify-between">
          <span>Decal Scale</span>
          <span className="text-gold font-mono text-[11px]">{decalScale.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.3"
          max="3.0"
          step="0.1"
          value={decalScale}
          onChange={(e) => setDecalScale(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
            bg-neutral-800 accent-gold
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(185,138,55,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer
          "
        />
      </div>

      {/* Info */}
      <div className="mt-1 p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/50">
        <p className="text-neutral-500 text-[10px] leading-relaxed">
          Drag to rotate the model. Scroll to zoom. Upload a PNG with transparent background for best results.
        </p>
      </div>
    </div>
  );
}
