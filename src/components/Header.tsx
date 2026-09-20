import React from 'react';
import { Search, Bone, X } from 'lucide-react';

interface HeaderProps {
  busca: string;
  onMudarBusca: (termo: string) => void;
  totalFiltrados: number;
}

export const Header: React.FC<HeaderProps> = ({
  busca,
  onMudarBusca,
  totalFiltrados,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-radiology-darkest/95 border-b border-radiology-border/80 backdrop-blur-md pb-3 pt-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Topo com Título e Badges */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Bone size={22} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Guia de Posicionamento</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PWA
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Rotinas radiográficas & Espessômetro Digital (Bontrager / ALARA)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-400">{totalFiltrados}</strong> exames exibidos
            </span>
          </div>
        </div>

        {/* Barra de Busca Instantânea (Largura Total) */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => onMudarBusca(e.target.value)}
            placeholder="Buscar por incidência, estrutura ou epônimo (ex: escafoide, ombro y, mortise, farill, joelho)..."
            className="w-full pl-10 pr-10 py-2.5 bg-radiology-dark border border-radiology-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {busca && (
            <button
              onClick={() => onMudarBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
