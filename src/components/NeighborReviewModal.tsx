/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Check, X, Award } from 'lucide-react';
import { NeighborReview } from '../types';

interface NeighborReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetNeighborName: string;
  targetNeighborAvatar: string;
  tradeSummary: string;
  onSubmitReview: (review: Omit<NeighborReview, 'id' | 'date' | 'authorId' | 'authorName' | 'authorAvatar' | 'targetUserId'>) => void;
}

const AVAILABLE_BADGES = [
  '🤝 Pontual no Encontro',
  '🌱 Insumo de Alta Qualidade',
  '🌾 Sementes Selecionadas',
  '🚜 Cuidado com Ferramenta',
  '✨ Boa Comunicação',
  '⭐ Vizinho Exemplar'
];

export const NeighborReviewModal: React.FC<NeighborReviewModalProps> = ({
  isOpen,
  onClose,
  targetNeighborName,
  targetNeighborAvatar,
  tradeSummary,
  onSubmitReview
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>([
    '🤝 Pontual no Encontro',
    '✨ Boa Comunicação'
  ]);

  if (!isOpen) return null;

  const toggleBadge = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview({
      rating,
      comment: comment.trim() || 'Troca concluída com sucesso na boa vizinhança.',
      tradeSummary,
      badgesGiven: selectedBadges
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-emerald-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold">Recomendação do Vizinho (RF06)</h3>
              <p className="text-[11px] text-emerald-100">Avaliação pós-escambo</p>
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
          {/* Target Profile Snippet */}
          <div className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-3">
            <img
              src={targetNeighborAvatar}
              alt={targetNeighborName}
              className="h-12 w-12 rounded-full object-cover border-2 border-emerald-600"
            />
            <div>
              <h4 className="text-xs font-bold text-stone-900">{targetNeighborName}</h4>
              <p className="text-[11px] text-stone-600">Troca: {tradeSummary}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center py-1">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Como foi sua experiência de troca?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${star} estrelas`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      (hoverRating !== null ? star <= hoverRating : star <= rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-1 text-xs font-medium text-amber-800">
              {rating === 5 && 'Excepcional! Recomendo a todos'}
              {rating === 4 && 'Muito boa, vizinho confiável'}
              {rating === 3 && 'Tudo certo'}
              {rating <= 2 && 'Poderia melhorar'}
            </div>
          </div>

          {/* Badges to Give */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Reconhecimentos rurais para o vizinho:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_BADGES.map((b) => {
                const isSelected = selectedBadges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white ring-1 ring-emerald-600'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Comment */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Depoimento para o mural de confiança:
            </label>
            <textarea
              placeholder="Escreva como o vizinho cumpriu a troca, qualidade do produto ou pontualidade..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

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
              Publicar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
