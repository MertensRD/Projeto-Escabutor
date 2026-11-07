/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Check, RotateCw, Sparkles, X, Sliders, Stamp, Image as ImageIcon } from 'lucide-react';

interface PhotoEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (photoUrl: string, caption?: string) => void;
  initialPhotoUrl?: string;
}

const PRESET_PHOTOS = [
  { label: 'Minhas Sementes', url: '/src/assets/images/escambo_sementes_1794017311208.jpg' },
  { label: 'Pulverizador', url: '/src/assets/images/escambo_pulverizador_1794017311348.jpg' },
  { label: 'Estufa & Horta', url: '/src/assets/images/farmer_maria_avatar_1794017310176.jpg' },
  { label: 'Milho & Roça', url: '/src/assets/images/farmer_joao_avatar_1794017308636.jpg' },
  { label: 'Cafezal & Sítio', url: '/src/assets/images/farmer_antonio_avatar_1794017309678.jpg' }
];

const FILTERS = [
  { id: 'normal', name: 'Natural', filterStyle: 'none' },
  { id: 'warm', name: 'Sol Dourado', filterStyle: 'sepia(0.2) saturate(1.3) contrast(1.05)' },
  { id: 'contrast', name: 'Alto Contraste', filterStyle: 'contrast(1.25) saturate(1.15)' },
  { id: 'sharp', name: 'Nitidez Rural', filterStyle: 'contrast(1.1) brightness(1.05) saturate(1.2)' },
  { id: 'earth', name: 'Tons Rústicos', filterStyle: 'sepia(0.35) contrast(1.1) brightness(0.95)' }
];

const STAMPS = [
  { id: 'org', text: '🌱 100% Orgânico', bg: 'bg-emerald-800 text-emerald-100' },
  { id: 'crioula', text: '🌾 Semente Crioula', bg: 'bg-amber-800 text-amber-100' },
  { id: 'rev', text: '🚜 Equipamento Revisado', bg: 'bg-blue-800 text-blue-100' },
  { id: 'fresca', text: '🍅 Colheita do Dia', bg: 'bg-rose-800 text-rose-100' },
  { id: 'mutua', text: '🤝 Ajuda Mútua', bg: 'bg-stone-800 text-stone-100' }
];

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  initialPhotoUrl
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    initialPhotoUrl || PRESET_PHOTOS[0].url
  );
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [selectedStamp, setSelectedStamp] = useState<string | null>('crioula');
  const [caption, setCaption] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'filter' | 'adjust' | 'stamp'>('filter');

  if (!isOpen) return null;

  const currentFilterObj = FILTERS.find((f) => f.id === activeFilter) || FILTERS[0];

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = () => {
    onSavePhoto(selectedPhoto, caption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <div className="flex h-full max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-stone-900 text-white shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-stone-100">Câmera & Editor do Sítio</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:text-white"
            aria-label="Fechar editor de fotos"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport Canvas Preview */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-stone-950 p-3">
          <div className="relative max-h-72 w-full max-w-xs overflow-hidden rounded-xl border border-stone-800 shadow-inner">
            <img
              src={selectedPhoto}
              alt="Foto do produto ou dúvida agrícola"
              className="h-64 w-full object-cover transition-all duration-200"
              style={{
                filter: `${currentFilterObj.filterStyle} brightness(${brightness}%) contrast(${contrast}%)`,
                transform: `rotate(${rotation}deg)`
              }}
            />

            {/* Stamp Overlay */}
            {selectedStamp && (
              <div className="absolute bottom-3 left-3 z-10">
                {(() => {
                  const stamp = STAMPS.find((s) => s.id === selectedStamp);
                  if (!stamp) return null;
                  return (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold shadow-md backdrop-blur-md ${stamp.bg}`}
                    >
                      {stamp.text}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Quick Sample Photos Bar */}
        <div className="border-t border-stone-800 bg-stone-900/90 px-3 py-2">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
            <span>Selecionar foto do sítio ou galeria:</span>
            <label className="flex cursor-pointer items-center gap-1 text-emerald-400 hover:text-emerald-300">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Enviar do celular</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomUpload}
              />
            </label>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {PRESET_PHOTOS.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedPhoto(photo.url)}
                className={`relative h-12 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedPhoto === photo.url
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-stone-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photo.url} alt={photo.label} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Tool Subtabs: Filters, Adjust, Stamps */}
        <div className="flex border-t border-stone-800 bg-stone-900">
          <button
            type="button"
            onClick={() => setActiveTab('filter')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'filter'
                ? 'border-b-2 border-emerald-400 text-emerald-400 bg-stone-800/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Filtros
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('adjust')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'adjust'
                ? 'border-b-2 border-emerald-400 text-emerald-400 bg-stone-800/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Ajustes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stamp')}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'stamp'
                ? 'border-b-2 border-emerald-400 text-emerald-400 bg-stone-800/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Stamp className="h-3.5 w-3.5" />
            Selos Rurais
          </button>
        </div>

        {/* Controls Container */}
        <div className="p-3 bg-stone-900">
          {activeTab === 'filter' && (
            <div className="grid grid-cols-5 gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex flex-col items-center rounded-lg p-1.5 text-center transition-all ${
                    activeFilter === f.id
                      ? 'bg-emerald-900/50 text-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <span className="text-[11px] font-medium leading-tight">{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'adjust' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="w-16 text-stone-400">Brilho</span>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="h-1.5 flex-1 accent-emerald-500"
                />
                <span className="w-8 text-right font-mono text-stone-300">{brightness}%</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="w-16 text-stone-400">Contraste</span>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="h-1.5 flex-1 accent-emerald-500"
                />
                <span className="w-8 text-right font-mono text-stone-300">{contrast}%</span>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex items-center gap-1.5 rounded-md bg-stone-800 px-3 py-1.5 text-xs text-stone-300 hover:bg-stone-700"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Girar 90°
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stamp' && (
            <div className="flex flex-wrap gap-1.5">
              {STAMPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStamp(selectedStamp === s.id ? null : s.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedStamp === s.id
                      ? `${s.bg} ring-2 ring-white/50`
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Caption Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Legenda da foto (ex: mudas selecionadas na estufa)..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 border-t border-stone-800 bg-stone-950 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-700 bg-transparent py-2.5 text-xs font-medium text-stone-300 hover:bg-stone-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-900/40 hover:bg-emerald-500 active:scale-[0.98]"
          >
            <Check className="h-4 w-4" />
            Usar Esta Foto
          </button>
        </div>
      </div>
    </div>
  );
};
