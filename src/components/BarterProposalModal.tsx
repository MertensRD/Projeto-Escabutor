/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, AlertCircle, ShieldAlert } from 'lucide-react';
import { BarterItem, UserProfile } from '../types';
import { validateBarterProposal } from '../utils/escamboRules';

interface BarterProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: BarterItem | null;
  currentUser: UserProfile;
  userAvailableItems: BarterItem[];
  onSubmitProposal: (proposalData: {
    targetItem: BarterItem;
    offeredTitle: string;
    offeredDescription: string;
    offeredItemId?: string;
    offeredImage?: string;
  }) => void;
}

export const BarterProposalModal: React.FC<BarterProposalModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  userAvailableItems,
  onSubmitProposal
}) => {
  const [selectedOfferType, setSelectedOfferType] = useState<'item' | 'service'>('item');
  const [selectedItemId, setSelectedItemId] = useState<string>(userAvailableItems[0]?.id || '');
  const [customOfferTitle, setCustomOfferTitle] = useState('');
  const [customOfferDetails, setCustomOfferDetails] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    let offeredTitle = '';
    let offeredDesc = '';
    let offeredImg: string | undefined = undefined;
    let offeredId: string | undefined = undefined;

    if (selectedOfferType === 'item') {
      const myItem = userAvailableItems.find((i) => i.id === selectedItemId);
      if (!myItem) {
        setValidationError('Por favor selecione um dos seus itens cadastrados.');
        return;
      }
      offeredTitle = myItem.title;
      offeredDesc = `${myItem.description} (Quantidade: ${myItem.quantity})`;
      offeredImg = myItem.imageUrl;
      offeredId = myItem.id;
    } else {
      offeredTitle = customOfferTitle.trim();
      offeredDesc = customOfferDetails.trim();
    }

    const check = validateBarterProposal({
      offeredDescription: `${offeredTitle} - ${offeredDesc}`,
      offeredItemId: offeredId,
      requestedItemId: targetItem.id
    });

    if (!check.valid) {
      setValidationError(check.reason || 'Proposta inválida.');
      return;
    }

    onSubmitProposal({
      targetItem,
      offeredTitle,
      offeredDescription: offeredDesc,
      offeredItemId: offeredId,
      offeredImage: offeredImg
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-emerald-800 px-4 py-3.5 text-white">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-bold">Proposta de Escambo Direto</h3>
              <p className="text-[11px] text-emerald-100">Negociação solidária entre vizinhos</p>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Target Item Summary */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Você deseja obter de {targetItem.userName}:
            </span>
            <div className="mt-2 flex items-center gap-3">
              <img
                src={targetItem.imageUrl}
                alt={targetItem.title}
                className="h-16 w-16 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-stone-900 truncate">{targetItem.title}</h4>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  Quantidade: <span className="font-medium text-stone-800">{targetItem.quantity}</span>
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 border border-emerald-100">
                  <span className="font-semibold">O vizinho busca:</span> {targetItem.acceptsInReturn}
                </div>
              </div>
            </div>
          </div>

          {/* RN05 Barter Reminder Notice */}
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[11px] text-emerald-900">
            <ShieldAlert className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
            <span>
              <strong>Regra da Boa Vizinhança (RN05):</strong> O Escambutor é estritamente para trocas de insumos, sementes, produtos ou serviços rurais. Pagamentos em dinheiro ou Pix não são permitidos.
            </span>
          </div>

          {/* Select What to Offer */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">
              O que você oferece em troca?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setSelectedOfferType('item')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  selectedOfferType === 'item'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                📦 Meus Itens Cadastrados
              </button>
              <button
                type="button"
                onClick={() => setSelectedOfferType('service')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  selectedOfferType === 'service'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                🚜 Serviço Rural / Outro
              </button>
            </div>

            {selectedOfferType === 'item' ? (
              <div className="space-y-2">
                {userAvailableItems.length > 0 ? (
                  userAvailableItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer transition-all ${
                        selectedItemId === item.id
                          ? 'border-emerald-600 bg-emerald-50/70'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="offeredItem"
                        value={item.id}
                        checked={selectedItemId === item.id}
                        onChange={() => setSelectedItemId(item.id)}
                        className="text-emerald-600 accent-emerald-600"
                      />
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-10 w-10 rounded-md object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-stone-900 truncate">{item.title}</div>
                        <div className="text-[11px] text-stone-500">Qtd: {item.quantity}</div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-stone-300 p-3 text-center text-xs text-stone-500">
                    Você ainda não cadastrou itens próprios para escambo. Use a opção "Serviço Rural / Outro".
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <input
                    type="text"
                    placeholder="Título do que oferece (ex: 1 dia de trator, 2 caixas de abóbora)"
                    value={customOfferTitle}
                    onChange={(e) => setCustomOfferTitle(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Descreva detalhes: disponibilidade de dias, local de entrega ou retirada..."
                    value={customOfferDetails}
                    onChange={(e) => setCustomOfferDetails(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {validationError && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Footer Actions */}
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
              Enviar Proposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
