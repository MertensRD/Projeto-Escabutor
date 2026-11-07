/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  MapPin,
  Shield,
  Sprout,
  Award,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  AlertTriangle,
  History,
  Star,
  Camera,
  LogOut
} from 'lucide-react';
import { UserProfile, NeighborReview, BarterItem } from '../types';

interface ProfileScreenProps {
  currentUser: UserProfile;
  reviews: NeighborReview[];
  userItems: BarterItem[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
  onOpenPhotoEditor: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  reviews,
  userItems,
  onUpdateUser,
  onDeleteAccount,
  onOpenPhotoEditor,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewPublic, setIsPreviewPublic] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form edit states
  const [name, setName] = useState(currentUser.name);
  const [farmName, setFarmName] = useState(currentUser.farmName);
  const [municipality, setMunicipality] = useState(currentUser.municipality);
  const [state, setState] = useState(currentUser.state);
  const [locationDetails, setLocationDetails] = useState(currentUser.locationDetails);
  const [farmSize, setFarmSize] = useState(currentUser.farmSizeHectares);
  const [whatProduces, setWhatProduces] = useState(currentUser.whatProduces);
  const [isLocationPrivate, setIsLocationPrivate] = useState(currentUser.isLocationPrivate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      farmName,
      municipality,
      state,
      locationDetails,
      farmSizeHectares: farmSize,
      whatProduces,
      isLocationPrivate
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto pb-6">
      {/* Top Banner & Avatar Header */}
      <div className="relative bg-gradient-to-b from-emerald-800 to-emerald-900 px-4 pt-6 pb-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-200">
            <Shield className="h-4 w-4 text-emerald-300" />
            <span>Perfil do Agricultor Familiar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewPublic(!isPreviewPublic)}
              className="flex items-center gap-1 rounded-lg bg-emerald-700/70 px-2.5 py-1 text-xs text-white hover:bg-emerald-700"
              title="Alternar entre modo edição e modo público"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{isPreviewPublic ? 'Modo Edição' : 'Ver Público'}</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 rounded-lg bg-emerald-950/50 px-2.5 py-1 text-xs text-emerald-200 hover:text-white"
              title="Sair da conta"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-20 w-20 rounded-full border-3 border-white object-cover shadow-md"
            />
            {!isPreviewPublic && (
              <button
                type="button"
                onClick={onOpenPhotoEditor}
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-500"
                aria-label="Trocar ou editar foto de perfil"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-white truncate">{currentUser.name}</h2>
            <div className="flex items-center gap-1 text-xs text-emerald-100">
              <MapPin className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">
                {currentUser.isLocationPrivate
                  ? `${currentUser.municipality} - ${currentUser.state} (Zona Rural Protegida)`
                  : `${currentUser.farmName}, ${currentUser.municipality} - ${currentUser.state}`}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-300" />
                <span>{currentUser.reputationAverage}</span>
              </div>
              <span className="text-emerald-300">·</span>
              <span className="text-emerald-100">{currentUser.totalRecommendations} recomendações de vizinhos</span>
            </div>
          </div>
        </div>

        {/* Farmer Trust Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {currentUser.badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-100"
            >
              <Award className="h-3 w-3 text-amber-300" />
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Farm & Production Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-stone-900">Dados da Propriedade & Cultivo (RF01, RF09)</h3>
            </div>
            {!isPreviewPublic && (
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Edit3 className="h-3.5 w-3.5" />
                {isEditing ? 'Cancelar' : 'Editar Dados'}
              </button>
            )}
          </div>

          {isEditing && !isPreviewPublic ? (
            <form onSubmit={handleSave} className="mt-3 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nome do Produtor</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nome do Sítio/Fazenda</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Área Total (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={farmSize}
                    onChange={(e) => setFarmSize(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Município</label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  O que você produz no sítio?
                </label>
                <textarea
                  value={whatProduces}
                  onChange={(e) => setWhatProduces(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* RNF02 Privacy Toggle */}
              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLocationPrivate}
                    onChange={(e) => setIsLocationPrivate(e.target.checked)}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div>
                    <span className="font-semibold text-emerald-950 block">
                      Proteção de Privacidade Rural (RNF02)
                    </span>
                    <span className="text-[11px] text-emerald-800 leading-tight block">
                      Oculta a localização exata das coordenadas da propriedade nos mapas e buscas públicas, exibindo apenas o município e a distância estimada.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
              >
                Salvar Alterações
              </button>
            </form>
          ) : (
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Propriedade:</span>
                <span className="font-semibold text-stone-800">{currentUser.farmName} ({currentUser.farmSizeHectares} ha)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Localização:</span>
                <span className="font-semibold text-stone-800">
                  {currentUser.isLocationPrivate
                    ? `${currentUser.municipality} - ${currentUser.state} (Distância aproximada)`
                    : `${currentUser.locationDetails}, ${currentUser.municipality} - ${currentUser.state}`}
                </span>
              </div>
              <div className="py-1">
                <span className="text-stone-500 block mb-1">O que produz:</span>
                <p className="font-medium text-stone-800 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  {currentUser.whatProduces}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-stone-500 block text-[11px] uppercase font-bold tracking-wider mb-1.5">
                  Práticas Sustentáveis Adotadas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.sustainablePractices.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700"
                    >
                      🌱 {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* My Registered Barter Items (RF02) */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <h3 className="text-sm font-bold text-stone-900">
              Meus Itens Cadastrados para Escambo ({userItems.length})
            </h3>
          </div>

          <div className="mt-3 space-y-2">
            {userItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-500">
                Nenhum item cadastrado no momento.
              </div>
            ) : (
              userItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 p-2.5"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-12 w-12 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-[11px] text-stone-600 truncate">Qtd: {item.quantity}</p>
                    <p className="text-[10px] text-emerald-700 truncate">Busca: {item.acceptsInReturn}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reviews from Rural Neighbors (RF06) */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-stone-900">
                Depoimentos & Avaliações da Vizinhança (RF06)
              </h3>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-stone-100 bg-stone-50/80 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.authorAvatar}
                      alt={rev.authorName}
                      className="h-8 w-8 rounded-full object-cover border border-emerald-600"
                    />
                    <div>
                      <div className="font-bold text-stone-900">{rev.authorName}</div>
                      <div className="text-[10px] text-stone-500">{rev.tradeSummary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {rev.badgesGiven.map((b) => (
                    <span
                      key={b}
                      className="rounded bg-white px-1.5 py-0.5 text-[10px] text-stone-600 border border-stone-200"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings & LGPD Exclusão Completa (RN03) */}
        {!isPreviewPublic && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-2">Privacidade e Dados (RN03)</h3>
            <p className="text-xs text-stone-600 mb-3">
              Você pode solicitar o encerramento da sua conta e a eliminação permanente de todo o seu histórico conforme a LGPD.
            </p>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-rose-300 bg-rose-50 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              Excluir Minha Conta e Apagar Todos os Dados
            </button>
          </div>
        )}
      </div>

      {/* Modal Confirm Delete (RN03) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mx-auto mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-center text-sm font-bold text-stone-900">
              Confirmar Exclusão de Conta (RN03)
            </h3>
            <p className="mt-2 text-center text-xs text-stone-600 leading-relaxed">
              Tem certeza? Todos os seus dados de perfil, histórico de trocas, sementes cadastradas e conversas serão permanentemente apagados do sistema Escambutor.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-stone-300 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteAccount();
                }}
                className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Sim, Excluir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
