import React, { useState } from 'react';
import { RegiaoAnatomica } from '../types/radiologia';

interface HumanSilhouetteProps {
  regiaoSelecionada: RegiaoAnatomica | 'TODOS';
  onSelecionarRegiao: (regiao: RegiaoAnatomica | 'TODOS') => void;
}

export const HumanSilhouette: React.FC<HumanSilhouetteProps> = ({
  regiaoSelecionada,
  onSelecionarRegiao,
}) => {
  const [hoverRegiao, setHoverRegiao] = useState<string | null>(null);

  const isMMSS = regiaoSelecionada === 'MMSS';
  const isMMII = regiaoSelecionada === 'MMII';
  const isCinturaTorax = regiaoSelecionada === 'Cintura & Tórax';
  const isBaciaPelve = regiaoSelecionada === 'Bacia & Pelve';

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-radiology-dark/80 to-radiology-darkest border border-radiology-border/60 rounded-2xl shadow-2xl backdrop-blur-md">
      {/* Indicador de Cabeçalho / Hover */}
      <div className="w-full flex items-center justify-between mb-3 px-2 border-b border-radiology-border/40 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
            Mapa Anatômico Interativo
          </span>
        </div>

        <div className="text-xs font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-0.5 rounded-full min-h-[22px] flex items-center">
          {hoverRegiao || (regiaoSelecionada === 'TODOS' ? 'Selecione uma região no corpo' : `Filtrado por: ${regiaoSelecionada}`)}
        </div>
      </div>

      {/* Container SVG da Silhueta */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[1/1.9] flex items-center justify-center">
        {/* Linhas de Mira Radiológica de Fundo (Colimação) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full border border-dashed border-cyan-500/40 rounded-xl"></div>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/30"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyan-400/30"></div>
        </div>

        <svg
          viewBox="-30 0 260 380"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.15)] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradientes para Efeito Radiográfico */}
            <linearGradient id="grad-padrao" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="grad-ativo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="grad-hover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.85" />
            </linearGradient>

            {/* Filtro de Brilho */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================
              1. CRÂNIO E PESCOÇO (HEAD & NECK)
             ======================================================== */}
          <g
            className="cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoverRegiao('Crânio & Cervical (Em Breve)')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            {/* Cabeça */}
            <ellipse
              cx="100"
              cy="28"
              rx="17"
              ry="21"
              fill="url(#grad-padrao)"
              stroke="#64748b"
              strokeWidth="1.2"
              className="hover:stroke-cyan-400 transition-colors"
            />
            {/* Pescoço */}
            <path
              d="M 94 48 L 94 60 L 106 60 L 106 48 Z"
              fill="url(#grad-padrao)"
              stroke="#64748b"
              strokeWidth="1"
            />
          </g>

          {/* ========================================================
              2. TRONCO / CINTURA ESCAPULAR & TÓRAX
             ======================================================== */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelecionarRegiao(isCinturaTorax ? 'TODOS' : 'Cintura & Tórax')}
            onMouseEnter={() => setHoverRegiao('Cintura Escapular & Tórax (Clavícula, AC, Esterno)')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            <path
              d="M 80 60 L 120 60 L 128 115 L 122 135 L 78 135 L 72 115 Z"
              fill={isCinturaTorax ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isCinturaTorax ? '#22d3ee' : '#64748b'}
              strokeWidth={isCinturaTorax ? '2.5' : '1.2'}
              filter={isCinturaTorax ? 'url(#glow-cyan)' : undefined}
              className="hover:fill-cyan-700/60 hover:stroke-cyan-300 transition-all"
            />
            {/* Clavículas e Esterno Esboçados */}
            <path d="M 82 64 Q 100 68 118 64" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="1 1" />
            <line x1="100" y1="67" x2="100" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 1" />
          </g>

          {/* ========================================================
              3. BACIA & PELVE / QUADRIL
             ======================================================== */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelecionarRegiao(isBaciaPelve ? 'TODOS' : 'Bacia & Pelve')}
            onMouseEnter={() => setHoverRegiao('Bacia & Pelve (Panorâmica, Rã, Cross-Table, Inlet/Outlet)')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            <path
              d="M 76 135 L 124 135 L 128 165 L 115 180 L 85 180 L 72 165 Z"
              fill={isBaciaPelve ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isBaciaPelve ? '#22d3ee' : '#64748b'}
              strokeWidth={isBaciaPelve ? '2.5' : '1.2'}
              filter={isBaciaPelve ? 'url(#glow-cyan)' : undefined}
              className="hover:fill-cyan-700/60 hover:stroke-cyan-300 transition-all"
            />
            {/* Forames Obturatórios e Sínfise */}
            <circle cx="90" cy="162" r="4" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="110" cy="162" r="4" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
          </g>

          {/* ========================================================
              4. MEMBROS SUPERIORES (MMSS) — BRAÇOS ESQUERDO E DIREITO
             ======================================================== */}
          {/* Braço Direito do Paciente (Esquerda de quem olha) */}
          <g
            className="cursor-pointer transition-all duration-300 group"
            onClick={() => onSelecionarRegiao(isMMSS ? 'TODOS' : 'MMSS')}
            onMouseEnter={() => setHoverRegiao('Membros Superiores (MMSS) — Dedos, Mão, Punho, Cotovelo, Ombro')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            {/* Ombro e Braço Superior */}
            <path
              d="M 79 62 Q 62 68 56 95 L 52 140 Q 50 148 53 155 L 59 154 Q 63 145 64 135 L 70 95 Q 73 75 79 62 Z"
              fill={isMMSS ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMSS ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMSS ? '2.5' : '1.2'}
              filter={isMMSS ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
            {/* Antebraço e Mão */}
            <path
              d="M 52 145 L 43 195 Q 40 205 38 218 L 47 220 Q 52 205 55 195 L 61 148 Z"
              fill={isMMSS ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMSS ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMSS ? '2.5' : '1.2'}
              filter={isMMSS ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
          </g>

          {/* Braço Esquerdo do Paciente (Direita de quem olha) */}
          <g
            className="cursor-pointer transition-all duration-300 group"
            onClick={() => onSelecionarRegiao(isMMSS ? 'TODOS' : 'MMSS')}
            onMouseEnter={() => setHoverRegiao('Membros Superiores (MMSS) — Dedos, Mão, Punho, Cotovelo, Ombro')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            {/* Ombro e Braço Superior */}
            <path
              d="M 121 62 Q 138 68 144 95 L 148 140 Q 150 148 147 155 L 141 154 Q 137 145 136 135 L 130 95 Q 127 75 121 62 Z"
              fill={isMMSS ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMSS ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMSS ? '2.5' : '1.2'}
              filter={isMMSS ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
            {/* Antebraço e Mão */}
            <path
              d="M 148 145 L 157 195 Q 160 205 162 218 L 153 220 Q 148 205 145 195 L 139 148 Z"
              fill={isMMSS ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMSS ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMSS ? '2.5' : '1.2'}
              filter={isMMSS ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
          </g>

          {/* ========================================================
              5. MEMBROS INFERIORES (MMII) — PERNAS ESQUERDA E DIREITA
             ======================================================== */}
          {/* Perna Direita do Paciente (Esquerda de quem olha) */}
          <g
            className="cursor-pointer transition-all duration-300 group"
            onClick={() => onSelecionarRegiao(isMMII ? 'TODOS' : 'MMII')}
            onMouseEnter={() => setHoverRegiao('Membros Inferiores (MMII) — Pé, Tornozelo, Perna, Joelho, Patela, Fêmur')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            {/* Coxa (Fêmur) */}
            <path
              d="M 75 175 L 85 180 L 89 250 Q 89 256 87 262 L 72 262 Q 71 254 70 245 L 68 185 Z"
              fill={isMMII ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMII ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMII ? '2.5' : '1.2'}
              filter={isMMII ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
            {/* Joelho e Perna (Tíbia/Fíbula e Pé) */}
            <path
              d="M 71 264 L 87 264 L 88 335 Q 89 348 94 365 L 75 365 Q 73 350 71 335 L 68 275 Z"
              fill={isMMII ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMII ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMII ? '2.5' : '1.2'}
              filter={isMMII ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
          </g>

          {/* Perna Esquerda do Paciente (Direita de quem olha) */}
          <g
            className="cursor-pointer transition-all duration-300 group"
            onClick={() => onSelecionarRegiao(isMMII ? 'TODOS' : 'MMII')}
            onMouseEnter={() => setHoverRegiao('Membros Inferiores (MMII) — Pé, Tornozelo, Perna, Joelho, Patela, Fêmur')}
            onMouseLeave={() => setHoverRegiao(null)}
          >
            {/* Coxa (Fêmur) */}
            <path
              d="M 125 175 L 115 180 L 111 250 Q 111 256 113 262 L 128 262 Q 129 254 130 245 L 132 185 Z"
              fill={isMMII ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMII ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMII ? '2.5' : '1.2'}
              filter={isMMII ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
            {/* Joelho e Perna (Tíbia/Fíbula e Pé) */}
            <path
              d="M 129 264 L 113 264 L 112 335 Q 111 348 106 365 L 125 365 Q 127 350 129 335 L 132 275 Z"
              fill={isMMII ? 'url(#grad-ativo)' : 'url(#grad-padrao)'}
              stroke={isMMII ? '#22d3ee' : '#64748b'}
              strokeWidth={isMMII ? '2.5' : '1.2'}
              filter={isMMII ? 'url(#glow-cyan)' : undefined}
              className="group-hover:fill-cyan-500/70 group-hover:stroke-cyan-300 transition-all"
            />
          </g>

          {/* ========================================================
              RÓTULOS VISUAIS COM LINHAS GUIA (CALLOUTS)
             ======================================================== */}
          {/* Callout MMSS */}
          <g className="cursor-pointer" onClick={() => onSelecionarRegiao(isMMSS ? 'TODOS' : 'MMSS')}>
            <line x1="40" y1="130" x2="15" y2="130" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="40" cy="130" r="2.5" fill="#38bdf8" />
            <text x="12" y="125" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">MMSS</text>
            <text x="12" y="137" fill="#94a3b8" fontSize="7.5" textAnchor="end">Superiores</text>
          </g>

          {/* Callout MMII */}
          <g className="cursor-pointer" onClick={() => onSelecionarRegiao(isMMII ? 'TODOS' : 'MMII')}>
            <line x1="72" y1="310" x2="15" y2="310" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="72" cy="310" r="2.5" fill="#38bdf8" />
            <text x="12" y="305" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">MMII</text>
            <text x="12" y="317" fill="#94a3b8" fontSize="7.5" textAnchor="end">Inferiores</text>
          </g>

          {/* Callout Pelve */}
          <g className="cursor-pointer" onClick={() => onSelecionarRegiao(isBaciaPelve ? 'TODOS' : 'Bacia & Pelve')}>
            <line x1="126" y1="155" x2="185" y2="155" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 1" />
            <circle cx="126" cy="155" r="2.5" fill="#38bdf8" />
            <text x="188" y="152" fill="#38bdf8" fontSize="8.5" fontWeight="bold" textAnchor="start">Bacia / Pelve</text>
            <text x="188" y="163" fill="#94a3b8" fontSize="7" textAnchor="start">Quadril</text>
          </g>
        </svg>
      </div>

      {/* Botões de Ação Rápida sob a Silhueta */}
      <div className="w-full flex items-center justify-center gap-2 mt-3 pt-2 border-t border-radiology-border/40">
        <button
          type="button"
          onClick={() => onSelecionarRegiao(isMMSS ? 'TODOS' : 'MMSS')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
            isMMSS
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-radiology-surface text-slate-300 border-radiology-border hover:border-cyan-500/50'
          }`}
        >
          💪 Braços (MMSS)
        </button>

        <button
          type="button"
          onClick={() => onSelecionarRegiao(isMMII ? 'TODOS' : 'MMII')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
            isMMII
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'bg-radiology-surface text-slate-300 border-radiology-border hover:border-cyan-500/50'
          }`}
        >
          🦵 Pernas (MMII)
        </button>

        {regiaoSelecionada !== 'TODOS' && (
          <button
            type="button"
            onClick={() => onSelecionarRegiao('TODOS')}
            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-500 transition-all"
            title="Mostrar todas as incidências"
          >
            ↺ Todos
          </button>
        )}
      </div>
    </div>
  );
};
