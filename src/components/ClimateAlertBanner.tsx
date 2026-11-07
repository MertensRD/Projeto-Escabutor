/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Snowflake, Bug, CloudRain, ThumbsUp, ThumbsDown, ShieldCheck, X } from 'lucide-react';
import { ClimateWarning } from '../types';
import { calculateWarningEffectiveness } from '../utils/escamboRules';

interface ClimateAlertBannerProps {
  warnings: ClimateWarning[];
  onVote: (warningId: string, type: 'useful' | 'unconfirmed') => void;
}

export const ClimateAlertBanner: React.FC<ClimateAlertBannerProps> = ({ warnings, onVote }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (warnings.length === 0 || isDismissed) return null;

  const activeWarning = warnings[currentIndex] || warnings[0];
  const { percentage, isHighConfidence, totalVotes } = calculateWarningEffectiveness(activeWarning);

  const getIcon = (type: string) => {
    switch (type) {
      case 'frost':
        return <Snowflake className="h-4 w-4 text-sky-700" />;
      case 'pest':
        return <Bug className="h-4 w-4 text-amber-700" />;
      case 'rain':
        return <CloudRain className="h-4 w-4 text-blue-700" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-700" />;
    }
  };

  const getBorderAndBg = (severity: string) => {
    switch (severity) {
      case 'emergencia':
        return 'bg-amber-50/95 border-amber-200 text-amber-950';
      case 'perigo':
        return 'bg-rose-50/95 border-rose-200 text-rose-950';
      default:
        return 'bg-amber-50/90 border-amber-200/80 text-amber-900';
    }
  };

  return (
    <div className={`mx-3 mb-3 rounded-xl border p-3 shadow-xs transition-all ${getBorderAndBg(activeWarning.severity)}`}>
      {/* Top Bar of Alert */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            {getIcon(activeWarning.iconType)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span>{activeWarning.severity === 'emergencia' ? '⚠️ Emergência Climática' : 'Alerta Rural'}</span>
              <span className="text-amber-500">·</span>
              <span className="text-[11px] font-normal lowercase text-stone-600">{activeWarning.targetRegion}</span>
            </div>
            <h4 className="text-xs font-bold leading-snug text-stone-900">
              {activeWarning.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-stone-600 hover:bg-amber-100 hover:text-stone-900"
            aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir orientações'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:bg-amber-100 hover:text-stone-800"
            aria-label="Dispensar alerta"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-1.5 text-xs text-stone-700 leading-relaxed">
        {activeWarning.description}
      </p>

      {/* Expanded Agronomic Mitigation Tips (RF08) */}
      {isExpanded && (
        <div className="mt-2.5 space-y-2 border-t border-amber-200/80 pt-2 text-xs">
          <div className="font-semibold text-stone-800">
            Medidas preventivas recomendadas para o sítio:
          </div>
          <ul className="space-y-1 text-stone-700 pl-1">
            {activeWarning.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-stone-500 italic">
            {activeWarning.validUntil}
          </div>
        </div>
      )}

      {/* Community Feedback Bar (RN04) */}
      <div className="mt-2.5 flex items-center justify-between border-t border-amber-200/60 pt-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-stone-600">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>
            {totalVotes > 0 ? (
              <>
                <strong className="font-semibold text-stone-800">{percentage}% dos vizinhos</strong> confirmaram este aviso ({totalVotes} relatos)
              </>
            ) : (
              'Aguardando primeiras confirmações'
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onVote(activeWarning.id, 'useful')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
              activeWarning.userVoted === 'useful'
                ? 'bg-emerald-600 text-white'
                : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Útil ({activeWarning.usefulVotes})</span>
          </button>
          <button
            type="button"
            onClick={() => onVote(activeWarning.id, 'unconfirmed')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
              activeWarning.userVoted === 'unconfirmed'
                ? 'bg-rose-600 text-white'
                : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>Não confere ({activeWarning.unconfirmedVotes})</span>
          </button>
        </div>
      </div>

      {/* Multiple Warnings Pager */}
      {warnings.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1">
          {warnings.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-4 bg-amber-700' : 'w-1.5 bg-amber-300'
              }`}
              aria-label={`Ver alerta ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
