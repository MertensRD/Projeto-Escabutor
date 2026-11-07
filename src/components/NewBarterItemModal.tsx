/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Camera, X, Check, ShieldCheck } from 'lucide-react';
import { BarterItem } from '../types';

interface NewBarterItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhotoEditor: () => void;
  currentEditedPhoto?: string;
  onSaveItem: (item: Omit<BarterItem, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userAvatar' | 'userLocation' | 'distanceKm'>) => void;
}

export const NewBarterItemModal: React.FC<NewBarterItemModalProps> = ({
  isOpen,
  onClose,
  onOpenPhotoEditor,
  currentEditedPhoto,
  onSaveItem
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BarterItem['category']>('sementes');
  const [description, setDescription] = useState('');
  const [acceptsInReturn, setAcceptsInReturn] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState<BarterItem['condition']>('Excelente');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !acceptsInReturn.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onSaveItem({
      title: title.trim(),
      category,
      description: description.trim(),
      imageUrl: currentEditedPhoto || '/src/assets/images/escambo_sementes_1794017311208.jpg',
      acceptsInReturn: acceptsInReturn.trim(),
      quantity: quantity.trim() || '1 lote',
      condition,
      tags: tags.length > 0 ? tags : [category, 'agroecologia']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-emerald-800 px-4 py-3.5 text-white">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Disponibilizar para Escambo</h3>
              <p className="text-[11px] text-emerald-100">Cadastre o que está sobrando no seu sítio</p>
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
          {/* Photo Picker with RF10 Photo Studio trigger */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Foto do Item ou Equipamento (RF10)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                <img
                  src={currentEditedPhoto || '/src/assets/images/escambo_sementes_1794017311208.jpg'}
                  alt="Prévia do item"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={onOpenPhotoEditor}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <Camera className="h-4 w-4 text-emerald-700" />
                  Tirar Foto / Editar Filtros
                </button>
                <p className="text-[11px] text-stone-500">
                  Fotos nítidas e com selos rurais aumentam a confiança dos vizinhos.
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome do Item, Insumo ou Serviço *
            </label>
            <input
              type="text"
              placeholder="Ex: 5 sacos de Milho Crioulo, Foice nova, 1 dia de trator..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Category & Condition Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BarterItem['category'])}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="sementes">Sementes & Mudas</option>
                <option value="ferramentas">Ferramentas & Maquinário</option>
                <option value="insumos">Insumos & Adubos</option>
                <option value="servicos">Serviços Agrícolas</option>
                <option value="producao">Hortifruti & Produção</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estado de Conservação
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as BarterItem['condition'])}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Orgânico Certificado">Orgânico / Agroecológico</option>
                <option value="Excelente">Excelente / Revisado</option>
                <option value="Novo">Novo / Sem Uso</option>
                <option value="Bom">Bom Estado</option>
                <option value="Usado">Usado Funcional</option>
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Quantidade Disponível
            </label>
            <input
              type="text"
              placeholder="Ex: 3 sacos de 40kg, 1 unidade, 2 diárias de 8h..."
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Accepts in Return (Barter target) */}
          <div>
            <label className="block text-xs font-semibold text-emerald-900 mb-1">
              O que você busca / aceita em troca? (RN05: Sem dinheiro) *
            </label>
            <input
              type="text"
              placeholder="Ex: Aceito esterco curtido, mudas de café, ajuda em cerca ou mandioca..."
              value={acceptsInReturn}
              onChange={(e) => setAcceptsInReturn(e.target.value)}
              className="w-full rounded-lg border border-emerald-400 bg-emerald-50/40 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
              required
            />
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Trocas solidárias fortalecem a economia familiar rural.</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Detalhes e Observações
            </label>
            <textarea
              placeholder="Descreva detalhes sobre armazenamento, variedade da semente ou necessidade de frete..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Palavras-chave (separadas por vírgula)
            </label>
            <input
              type="text"
              placeholder="milho, crioulo, adubo, brotas"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Actions */}
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
              Cadastrar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
