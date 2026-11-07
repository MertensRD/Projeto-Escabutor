/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sprout, ArrowRight, ShieldCheck, Users, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
  onRegister: (newUser: Partial<UserProfile>) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('João Silva');
  const [farmName, setFarmName] = useState('Sítio Boa Vista');
  const [municipality, setMunicipality] = useState('Brotas - SP');
  const [whatProduces, setWhatProduces] = useState('Milho, Feijão e Hortaliças');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister({
        name,
        farmName,
        municipality: municipality.split('-')[0].trim(),
        state: municipality.split('-')[1]?.trim() || 'SP',
        whatProduces
      });
    } else {
      onLogin();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-stone-900 p-4 sm:p-6 text-stone-100">
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-950 p-6 shadow-2xl">
        {/* Logo and Brand */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-emerald-100 shadow-lg shadow-emerald-950">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="font-serif-brand text-2xl font-bold tracking-tight text-white">
            Escambutor
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Rede de Trocas & Comunidade para Pequenos Agricultores
          </p>
        </div>

        {/* Value Proposition Pills */}
        <div className="mb-6 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded-xl bg-stone-900 p-2 border border-stone-800">
            <RefreshCw className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
            <span className="text-stone-300">Escambo Sem Dinheiro</span>
          </div>
          <div className="rounded-xl bg-stone-900 p-2 border border-stone-800">
            <Users className="h-4 w-4 mx-auto text-amber-400 mb-1" />
            <span className="text-stone-300">Comunidades Rurais</span>
          </div>
          <div className="rounded-xl bg-stone-900 p-2 border border-stone-800">
            <ShieldCheck className="h-4 w-4 mx-auto text-sky-400 mb-1" />
            <span className="text-stone-300">Alertas Climáticos</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegistering ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nome do Sítio ou Chácara
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Município e Estado
                </label>
                <input
                  type="text"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  O que você produz no sítio?
                </label>
                <input
                  type="text"
                  value={whatProduces}
                  onChange={(e) => setWhatProduces(e.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  E-mail ou Telefone do Produtor
                </label>
                <input
                  type="text"
                  defaultValue="joao.silva@rural.org.br"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            <span>{isRegistering ? 'Concluir Cadastro Rural' : 'Entrar no Escambutor'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-center text-xs text-stone-400 hover:text-emerald-400 pt-1"
          >
            {isRegistering ? 'Já possui conta? Clique para entrar' : 'Não tem conta? Criar cadastro de agricultor'}
          </button>
        </form>

        <div className="mt-6 border-t border-stone-800/80 pt-4 text-center text-[10px] text-stone-500">
          Protegido pelas diretrizes de agricultura familiar e LGPD. Sem custos ou taxas financeiras.
        </div>
      </div>
    </div>
  );
};
