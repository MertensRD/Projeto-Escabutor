/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, X, Check } from 'lucide-react';
import { CommunityGroup } from '../types';

interface NewCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCommunity: (community: Omit<CommunityGroup, 'id' | 'memberCount' | 'isMember'>) => void;
}

const ICONS = ['🌱', '🌽', '🥬', '☕', '🚜', '🐄', '🐝', '🍅', '🌾'];

export const NewCommunityModal: React.FC<NewCommunityModalProps> = ({
  isOpen,
  onClose,
  onSaveCommunity
}) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [cropType, setCropType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🌱');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveCommunity({
      name: name.trim(),
      region: region.trim() || 'Região Local',
      cropType: cropType.trim() || 'Cultura Geral',
      description: description.trim() || 'Grupo de troca de conhecimento e escambo entre pequenos produtores.',
      avatarIcon: selectedIcon
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 bg-emerald-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Criar Nova Comunidade (RF07)</h3>
              <p className="text-[11px] text-emerald-100">Reúna vizinhos por região ou tipo de lavoura</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-200 hover:bg-emerald-700 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Ícone da Comunidade
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg transition-all ${
                    selectedIcon === icon
                      ? 'bg-emerald-100 ring-2 ring-emerald-600'
                      : 'bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome da Comunidade *
            </label>
            <input
              type="text"
              placeholder="Ex: Produtores de Mandioca & Derivados"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Região / Município
              </label>
              <input
                type="text"
                placeholder="Ex: Vale do Tietê"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tipo de Cultura / Atividade
              </label>
              <input
                type="text"
                placeholder="Ex: Fruticultura, Soja..."
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Objetivo e Descrição
            </label>
            <textarea
              placeholder="Descreva o propósito da comunidade, trocas focadas ou mutirões..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stone-300 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-800 active:scale-[0.98]"
            >
              <Check className="h-4 w-4" />
              Criar Comunidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
