/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, XCircle, ArrowLeftRight, Clock, Star, AlertCircle, Shield } from 'lucide-react';
import { Conversation, TradeProposal, UserProfile } from '../types';
import { FarmerAvatar } from './FarmerAvatar';

interface ChatScreenProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onUpdateProposalStatus: (proposalId: string, newStatus: TradeProposal['status']) => void;
  onRequestReview: (neighborName: string, neighborAvatar: string, tradeSummary: string) => void;
  currentUser: UserProfile;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onUpdateProposalStatus,
  onRequestReview,
  currentUser
}) => {
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    onSendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const sendQuickPhrase = (phrase: string) => {
    if (!activeConversationId) return;
    onSendMessage(activeConversationId, phrase);
  };

  // 1. Conversation List View
  if (!activeConv) {
    return (
      <div className="flex flex-col h-full bg-stone-50">
        <div className="bg-white px-4 py-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-stone-900">Conversas & Negociações</h2>
          <p className="text-xs text-stone-500">Negocie escambos diretamente com os vizinhos rurais</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
          {conversations.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Nenhuma conversa ativa ainda. Navegue na aba "Trocas" e envie uma proposta para um vizinho!
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelectConversation(conv.id)}
                className="flex w-full items-center gap-3.5 rounded-xl bg-white p-3.5 text-left shadow-xs transition-all hover:bg-stone-50 mb-1.5"
              >
                <div className="relative shrink-0">
                  <FarmerAvatar
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    size="lg"
                    className="border-2 border-emerald-700"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {conv.participantName}
                    </h3>
                    <span className="text-[11px] text-stone-600 font-mono">
                      {conv.lastTimestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <span>{conv.participantLocation}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 truncate">
                    {conv.lastMessage}
                  </p>

                  {conv.activeProposal && (
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 rounded px-2 py-0.5 w-fit border border-emerald-100">
                      <ArrowLeftRight className="h-3 w-3" />
                      <span>
                        Proposta: {conv.activeProposal.status.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  // 2. Active Chat Conversation View
  const proposal = activeConv.activeProposal;

  return (
    <div className="flex flex-col h-full bg-stone-100">
      {/* Active Chat Header */}
      <div className="flex items-center gap-3 bg-white px-3.5 py-2.5 border-b border-stone-200 shrink-0">
        <button
          type="button"
          onClick={() => onSelectConversation(null)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
          aria-label="Voltar para conversas"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <FarmerAvatar
          src={activeConv.participantAvatar}
          alt={activeConv.participantName}
          size="md"
          className="border border-emerald-700 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-stone-900 truncate">
              {activeConv.participantName}
            </h3>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
              {activeConv.distanceKm} km
            </span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            {activeConv.participantLocation}
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {/* Security / Barter Policy Reminder */}
        <div className="mx-auto max-w-xs rounded-lg bg-stone-200/70 p-2 text-center text-[10px] text-stone-600">
          <Shield className="h-3 w-3 inline mr-1 text-emerald-700" />
          Acorde a entrega diretamente no sítio do vizinho. Escambo sustentável e gratuito.
        </div>

        {/* Trade Proposal Card if Active (RF04 / RN02 / RN05) */}
        {proposal && (
          <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ArrowLeftRight className="h-4 w-4 text-emerald-600" />
                <span>Proposta de Escambo em Andamento</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${
                  proposal.status === 'pendente'
                    ? 'bg-amber-100 text-amber-800'
                    : proposal.status === 'aceita'
                    ? 'bg-emerald-100 text-emerald-800'
                    : proposal.status === 'concluida'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {proposal.status === 'pendente' && '⏳ Aguardando Resposta'}
                {proposal.status === 'aceita' && '🤝 Proposta Aceita'}
                {proposal.status === 'concluida' && '⭐ Troca Concluída'}
                {proposal.status === 'recusada' && 'Recusada'}
                {proposal.status === 'cancelada' && 'Cancelada'}
              </span>
            </div>

            {/* Exchange Details Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-stone-50 p-2 border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">Item Oferecido</span>
                <span className="font-semibold text-stone-900 block truncate">{proposal.offeredItemTitle}</span>
                <span className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">{proposal.offeredItemDescription}</span>
              </div>
              <div className="rounded-lg bg-emerald-50/60 p-2 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Item Solicitado</span>
                <span className="font-semibold text-emerald-950 block truncate">{proposal.requestedItemTitle}</span>
                <span className="text-[11px] text-emerald-700 line-clamp-1 mt-0.5">Disponível no Sítio</span>
              </div>
            </div>

            {/* Proposal Actions depending on Status and Rule RN02 */}
            <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-stone-100">
              {proposal.status === 'pendente' && (
                <>
                  {proposal.receiverId === currentUser.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateProposalStatus(proposal.id, 'aceita')}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-700 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aceitar Proposta
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateProposalStatus(proposal.id, 'recusada')}
                        className="flex-1 rounded-lg border border-stone-300 bg-white py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                      >
                        Recusar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateProposalStatus(proposal.id, 'cancelada')}
                      className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                    >
                      <XCircle className="h-3 w-3 inline mr-1" />
                      Cancelar Minha Proposta (RN02)
                    </button>
                  )}
                </>
              )}

              {proposal.status === 'aceita' && (
                <div className="flex w-full items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateProposalStatus(proposal.id, 'concluida');
                      onRequestReview(
                        activeConv.participantName,
                        activeConv.participantAvatar,
                        `${proposal.offeredItemTitle} ⇄ ${proposal.requestedItemTitle}`
                      );
                    }}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-700 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Confirmar Troca Concluída (Avaliar)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateProposalStatus(proposal.id, 'cancelada')}
                    className="rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-xs text-stone-600 hover:text-rose-700"
                    title="Cancelar troca antes da efetivação (RN02)"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {proposal.status === 'concluida' && (
                <button
                  type="button"
                  onClick={() =>
                    onRequestReview(
                      activeConv.participantName,
                      activeConv.participantAvatar,
                      `${proposal.offeredItemTitle} ⇄ ${proposal.requestedItemTitle}`
                    )
                  }
                  className="flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  Avaliar Vizinho no Mural (RF06)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Message Bubbles */}
        {activeConv.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                  isMe
                    ? 'rounded-br-xs bg-emerald-800 text-white'
                    : 'rounded-bl-xs bg-white text-stone-900 border border-stone-200'
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-0.5 px-1 font-mono text-[10px] text-stone-600">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rural Quick Response Phrases */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-stone-200/60 px-3 py-1.5 border-t border-stone-200">
        <button
          type="button"
          onClick={() => sendQuickPhrase('Posso passar aí no sábado pela manhã para retirar?')}
          className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] text-stone-700 border border-stone-200 hover:bg-stone-50"
        >
          🚜 Passo aí sábado de manhã
        </button>
        <button
          type="button"
          onClick={() => sendQuickPhrase('O material está separado e bem ensacado.')}
          className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] text-stone-700 border border-stone-200 hover:bg-stone-50"
        >
          📦 Já está separado e limpo
        </button>
        <button
          type="button"
          onClick={() => sendQuickPhrase('Fechado compadre! Escambo confirmado.')}
          className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] text-stone-700 border border-stone-200 hover:bg-stone-50"
        >
          🤝 Fechado, escambo confirmado!
        </button>
      </div>

      {/* Input Message Area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 bg-white p-2.5 border-t border-stone-200">
        <input
          type="text"
          placeholder="Escreva sua mensagem ou proposta..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-xs text-stone-900 focus:border-emerald-600 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50"
          disabled={!inputText.trim()}
          aria-label="Enviar mensagem"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
