/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Filter,
  Plus,
  ArrowLeftRight,
  ShieldCheck,
  Package,
  Wrench,
  Sprout,
  Truck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { BarterItem, UserProfile } from '../types';
import { filterBarterItems } from '../utils/escamboRules';

interface EscamboScreenProps {
  items: BarterItem[];
  currentUser: UserProfile;
  onOpenNewItemModal: () => void;
  onOpenProposalModal: (item: BarterItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const CATEGORIES = [
  { id: 'todos', name: 'Todos os Itens', icon: Package },
  { id: 'ferramentas', name: 'Ferramentas', icon: Wrench },
  { id: 'sementes', name: 'Sementes & Mudas', icon: Sprout },
  { id: 'insumos', name: 'Insumos & Adubos', icon: Package },
  { id: 'servicos', name: 'Serviços do Campo', icon: Truck },
  { id: 'producao', name: 'Hortifruti', icon: Sprout }
];

export const EscamboScreen: React.FC<EscamboScreenProps> = ({
  items,
  currentUser,
  onOpenNewItemModal,
  onOpenProposalModal,
  onDeleteItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [maxDistance, setMaxDistance] = useState<number>(30);
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');

  const filteredItems = filterBarterItems(items, {
    search: searchTerm,
    category: selectedCategory,
    maxDistanceKm: viewMode === 'all' ? maxDistance : undefined
  });

  const displayedItems =
    viewMode === 'mine'
      ? items.filter((i) => i.userId === currentUser.id)
      : filteredItems.filter((i) => i.userId !== currentUser.id);

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto pb-6">
      {/* Search & Proximity Radius Filter Area (RF05) */}
      <div className="bg-white border-b border-stone-200 p-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-600" />
            <input
              type="text"
              placeholder="Buscar ferramentas, sementes, arado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 pl-9 pr-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onOpenNewItemModal}
            className="flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>+ Novo Item</span>
          </button>
        </div>

        {/* Proximity Slider & Toggle (RF05) */}
        <div className="flex items-center justify-between gap-3 text-xs text-stone-600 pt-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span className="font-semibold text-stone-800">Raio:</span>
            <span className="font-mono text-emerald-800 font-bold">{maxDistance} km</span>
          </div>

          <input
            type="range"
            min="2"
            max="100"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="h-1.5 flex-1 accent-emerald-600 cursor-pointer"
          />

          {/* Switch: Explorar Região vs Meus Itens */}
          <div className="flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                viewMode === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Na Região
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mine')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                viewMode === 'mine'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Meus Itens
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        {viewMode === 'all' && (
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pt-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sustainable Barter Philosophy Banner (RN05) */}
      <div className="mx-3 mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-200 text-xs text-emerald-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Escambo Solidário (RN05):</strong> Economia circular sem dinheiro. Troque insumos e ajude os vizinhos.
          </span>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="p-3 space-y-3">
        {displayedItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-xs text-stone-500">
            {viewMode === 'mine'
              ? 'Você ainda não cadastrou nenhum item disponível para troca.'
              : 'Nenhum item encontrado com esses filtros de busca e raio geográfico. Tente aumentar o raio em km!'}
          </div>
        ) : (
          displayedItems.map((item) => {
            const isMine = item.userId === currentUser.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Photo Container */}
                  <div className="relative h-44 sm:h-auto sm:w-48 shrink-0 bg-stone-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-md bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex-1 p-3.5 flex flex-col justify-between">
                    <div>
                      {/* Farmer info header */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.userAvatar}
                            alt={item.userName}
                            className="h-6 w-6 rounded-full object-cover border border-emerald-600"
                          />
                          <span className="text-xs font-semibold text-stone-800">{item.userName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          <span>{item.distanceKm} km</span>
                        </div>
                      </div>

                      {/* Title & Qty */}
                      <h3 className="text-sm font-bold text-stone-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        Quantidade: <strong className="text-stone-700">{item.quantity}</strong>
                      </p>

                      <p className="mt-2 text-xs text-stone-700 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Barter Target Return (What Neighbor Seeks) */}
                      <div className="mt-2.5 rounded-lg bg-emerald-50/70 p-2 border border-emerald-200/80 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Aceita em troca (Escambo):
                        </div>
                        <div className="mt-0.5 font-medium text-emerald-950">
                          {item.acceptsInReturn}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5">
                      <div className="text-[10px] text-stone-600 font-mono">
                        {item.userLocation}
                      </div>

                      {isMine ? (
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remover Item
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenProposalModal(item)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 active:scale-[0.98]"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                          Propor Escambo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
