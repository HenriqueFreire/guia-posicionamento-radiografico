import React, { useState, useEffect } from 'react';
import { IncidenciaRadiografica } from '../types/radiologia';
import { X, Target, Sparkles, CheckCircle2, Ruler, Eye, SplitSquareHorizontal } from 'lucide-react';
import { resolveAssetUrl } from '../utils/assets';

interface ModalImagemPosicionamentoProps {
  incidencia: IncidenciaRadiografica | null;
  isOpen: boolean;
  onClose: () => void;
  onAbrirCalculadora?: (incidencia: IncidenciaRadiografica) => void;
}

export const ModalImagemPosicionamento: React.FC<ModalImagemPosicionamentoProps> = ({
  incidencia,
  isOpen,
  onClose,
  onAbrirCalculadora
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'posicionamento' | 'radiografia' | 'ladoAlado'>('posicionamento');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !incidencia) return null;

  const temRx = !!incidencia.imagemRadiografia;
  const temPos = !!incidencia.imagemPosicionamento;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {incidencia.regiao}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {incidencia.subregiao}
              </span>
              <span className="text-[10px] font-medium text-amber-300/90 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                Atlas Bontrager / Clark
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {incidencia.nome}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 shrink-0"
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Seletor de Abas / Visualização */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            {temPos && (
              <button
                onClick={() => setAbaAtiva('posicionamento')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  abaAtiva === 'posicionamento'
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Target size={14} />
                <span>Posicionamento & Raio Central</span>
              </button>
            )}

            {temRx && (
              <button
                onClick={() => setAbaAtiva('radiografia')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  abaAtiva === 'radiografia'
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Eye size={14} />
                <span>Radiografia de Referência</span>
              </button>
            )}

            {temPos && temRx && (
              <button
                onClick={() => setAbaAtiva('ladoAlado')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  abaAtiva === 'ladoAlado'
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <SplitSquareHorizontal size={14} />
                <span>Comparativo Lado a Lado</span>
              </button>
            )}
          </div>

          <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
            Clique na imagem para inspecionar detalhes
          </span>
        </div>

        {/* Corpo com Imagens */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Visualização de Imagem */}
          {abaAtiva === 'posicionamento' && incidencia.imagemPosicionamento && (
            <div className="flex flex-col items-center">
              <div className="relative group max-h-[48vh] rounded-xl overflow-hidden border border-cyan-500/30 bg-black/60 shadow-inner flex items-center justify-center">
                <img
                  src={resolveAssetUrl(incidencia.imagemPosicionamento)}
                  alt={`Posicionamento - ${incidencia.nome}`}
                  className="max-h-[48vh] w-auto object-contain rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 backdrop-blur-sm text-[11px] font-medium text-cyan-300 flex items-center gap-1.5">
                  <Target size={12} className="text-cyan-400" />
                  <span>Feixe Central e Ponto de Entrada</span>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'radiografia' && incidencia.imagemRadiografia && (
            <div className="flex flex-col items-center">
              <div className="relative group max-h-[48vh] rounded-xl overflow-hidden border border-emerald-500/30 bg-black/80 shadow-inner flex items-center justify-center">
                <img
                  src={resolveAssetUrl(incidencia.imagemRadiografia)}
                  alt={`Radiografia - ${incidencia.nome}`}
                  className="max-h-[48vh] w-auto object-contain rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 backdrop-blur-sm text-[11px] font-medium text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>Anatomia Radiográfica e Estruturas Demonstradas</span>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'ladoAlado' && incidencia.imagemPosicionamento && incidencia.imagemRadiografia && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-cyan-400 mb-1.5 flex items-center gap-1">
                  <Target size={13} />
                  <span>1. Posicionamento & Feixe (RC)</span>
                </span>
                <div className="relative w-full max-h-[44vh] rounded-xl overflow-hidden border border-cyan-500/30 bg-black/60 shadow-inner flex items-center justify-center p-1">
                  <img
                    src={resolveAssetUrl(incidencia.imagemPosicionamento)}
                    alt={`Posicionamento - ${incidencia.nome}`}
                    className="max-h-[42vh] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>2. Radiografia de Referência</span>
                </span>
                <div className="relative w-full max-h-[44vh] rounded-xl overflow-hidden border border-emerald-500/30 bg-black/80 shadow-inner flex items-center justify-center p-1">
                  <img
                    src={resolveAssetUrl(incidencia.imagemRadiografia)}
                    alt={`Radiografia - ${incidencia.nome}`}
                    className="max-h-[42vh] w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ficha Técnica Rápida de Orientação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Target size={14} />
                <span>Raio Central & Alinhamento</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {incidencia.raioCentral}
              </p>
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-3 text-slate-400 text-[11px]">
                <span><strong>Chassi:</strong> {incidencia.tamanhoChassi}</span>
                <span>•</span>
                <span><strong>DFF:</strong> {incidencia.dffCm} cm</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 size={14} />
                <span>Critérios de Aceitação (Bontrager)</span>
              </div>
              <p className="text-slate-300 leading-relaxed line-clamp-3">
                {incidencia.criteriosBontrager}
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Ruler size={14} className="text-cyan-400" />
            <span>Espessura média: <strong className="text-white">{incidencia.espessuraMediaCm} cm</strong></span>
          </div>

          <div className="flex items-center gap-2">
            {onAbrirCalculadora && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAbrirCalculadora(incidencia);
                }}
                className="py-2 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all"
              >
                <Sparkles size={14} />
                <span>Calcular Parâmetros (kV/mAs)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
