/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sprout, Smartphone, Monitor, Bell, Shield } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  isSmartphoneFramed: boolean;
  onToggleFrame: () => void;
  unreadMessagesCount: number;
  activeAlertsCount: number;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isSmartphoneFramed,
  onToggleFrame,
  unreadMessagesCount,
  activeAlertsCount,
  onTabChange
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'forum':
        return 'Mural & Comunidade';
      case 'escambo':
        return 'Balcão de Trocas';
      case 'chat':
        return 'Negociações';
      case 'perfil':
        return 'Meu Perfil Rural';
      default:
        return 'Escambutor';
    }
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-emerald-900/10 bg-emerald-800 px-4 text-white shadow-xs shrink-0"
      style={{
        paddingTop: 'calc(max(env(safe-area-inset-top, 0px), 1.75rem) + 0.25rem)',
        paddingBottom: '0.75rem'
      }}
    >
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/80 text-emerald-200">
          <Sprout className="h-5 w-5" />
        </div>
        <span className="font-serif-brand text-lg font-bold tracking-tight text-white whitespace-nowrap">
          Escambutor
        </span>
      </div>

      {/* Zone 2: Section Indicator */}
      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-100">
        <span className="rounded-md bg-emerald-900/60 px-2 py-0.5">
          {getTabTitle()}
        </span>
      </div>

      {/* Zone 3: Actions & Device Frame Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle between smartphone mock frame vs full responsive width on desktop */}
        <button
          type="button"
          onClick={onToggleFrame}
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-emerald-700/60 px-2.5 py-1 text-xs font-medium text-emerald-100 hover:bg-emerald-700 transition-colors"
          title={isSmartphoneFramed ? 'Ver em tela cheia' : 'Ver em moldura de celular'}
        >
          {isSmartphoneFramed ? (
            <>
              <Monitor className="h-3.5 w-3.5" />
              <span>Expandir</span>
            </>
          ) : (
            <>
              <Smartphone className="h-3.5 w-3.5" />
              <span>Modo Celular</span>
            </>
          )}
        </button>

        {/* Quick Chat Shortcut Badge */}
        <button
          type="button"
          onClick={() => onTabChange('chat')}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/50 text-emerald-100 hover:bg-emerald-700"
          aria-label="Ir para o Chat de Trocas"
        >
          <Bell className="h-4 w-4" />
          {(unreadMessagesCount > 0 || activeAlertsCount > 0) && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-stone-900">
              {unreadMessagesCount + activeAlertsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
