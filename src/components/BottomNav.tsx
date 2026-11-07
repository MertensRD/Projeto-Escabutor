/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, ArrowLeftRight, MessageCircle, User } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  unreadCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadCount
}) => {
  const tabs: { id: AppTab; label: string; icon: typeof MessageSquare; badge?: number }[] = [
    { id: 'forum', label: 'Comunidade', icon: MessageSquare },
    { id: 'escambo', label: 'Trocas', icon: ArrowLeftRight },
    { id: 'chat', label: 'Conversas', icon: MessageCircle, badge: unreadCount },
    { id: 'perfil', label: 'Meu Perfil', icon: User }
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 w-full border-t border-stone-200 bg-white/95 backdrop-blur-md shadow-lg shrink-0"
      aria-label="Navegação Principal"
    >
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex min-h-[48px] min-w-[64px] flex-col items-center justify-center transition-colors ${
                isActive ? 'text-emerald-800' : 'text-stone-600 hover:text-stone-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`mt-1 text-[11px] font-medium tracking-tight ${
                  isActive ? 'font-bold text-emerald-800' : 'text-stone-600'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-1 h-1 w-6 rounded-full bg-emerald-700" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
