import React, { useState } from 'react';
import { IncidenciaRadiografica, ParametrosCalculados } from '../types/radiologia';
import { Calculator, Target, User, CheckCircle2, Lightbulb, ChevronDown, ChevronUp, Ruler, Sparkles, Maximize2, Image as ImageIcon } from 'lucide-react';
import { ModalImagemPosicionamento } from './ModalImagemPosicionamento';
import { resolveAssetUrl } from '../utils/assets';

interface CardIncidenciaProps {
  incidencia: IncidenciaRadiografica;
  parametrosCustomizados?: {
    params: ParametrosCalculados;
    espessura: number;
  };
  onAbrirCalculadora: (incidencia: IncidenciaRadiografica) => void;
}

export const CardIncidencia: React.FC<CardIncidenciaProps> = ({
  incidencia,
  parametrosCustomizados,
  onAbrirCalculadora,
}) => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState<boolean>(false);
  const [mostrarModalImagem, setMostrarModalImagem] = useState<boolean>(false);
  const [imagemCarregada, setImagemCarregada] = useState<boolean>(false);
  const foiCustomizado = !!parametrosCustomizados;

  return (
    <>
      <article className="group bg-radiology-dark/90 border border-radiology-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg hover:shadow-cyan-950/40 hover:border-cyan-500/40 transition-all duration-300">
        <div>
          {/* Imagem Técnica de Posicionamento e Raio Central */}
          {incidencia.imagemPosicionamento ? (
            <div
              onClick={() => setMostrarModalImagem(true)}
              className="relative w-full h-44 sm:h-48 mb-3.5 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 cursor-pointer shadow-inner group/img"
              title="Clique para ampliar o atlas de posicionamento e raio-X"
            >
              <img
                src={resolveAssetUrl(incidencia.imagemPosicionamento)}
                alt={`Posicionamento - ${incidencia.nome}`}
                onLoad={() => setImagemCarregada(true)}
                className={`w-full h-full object-cover object-center transition-all duration-500 group-hover/img:scale-105 ${
                  imagemCarregada ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Shimmer/Placeholder enquanto carrega */}
              {!imagemCarregada && (
                <div className="absolute inset-0 bg-slate-900/90 animate-pulse flex items-center justify-center text-slate-600">
                  <ImageIcon size={24} className="animate-spin" />
                </div>
              )}

              {/* Gradiente de Fusão Visual */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20 pointer-events-none" />

              {/* Selo do Raio Central no Posicionamento */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md text-[11px] font-bold text-cyan-300 shadow-md">
                <Target size={13} className="text-cyan-400 shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-[210px]">Alvo & Raio Central</span>
              </div>

              {/* Botão de Ampliação / Inspecionar */}
              <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-cyan-600 transition-colors shadow-md backdrop-blur-sm">
                <Maximize2 size={13} />
              </div>

              {/* Indicador de Radiografia de Referência inclusa */}
              {incidencia.imagemRadiografia && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-emerald-950/85 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
                  RX Atlas
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-32 mb-3.5 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-xs">
              <span>Imagem de posicionamento em preparo</span>
            </div>
          )}

          {/* Badges de Categoria */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              {incidencia.regiao}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {incidencia.subregiao}
            </span>
          </div>

          {/* Título da Incidência */}
          <h3 className="text-base font-bold text-white mb-3 leading-snug">
            {incidencia.nome}
          </h3>

          {/* Parâmetros Operacionais: Somente exibido com valores após cálculo */}
          {foiCustomizado && (
            <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl border mb-3 bg-cyan-950/30 border-cyan-500/40 transition-all animate-in fade-in duration-300">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">kV</span>
                <span className="text-sm font-black text-cyan-400">{parametrosCustomizados.params.kv} kV</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">mAs</span>
                <span className="text-sm font-black text-amber-400">{parametrosCustomizados.params.mas} mAs</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">Espessura</span>
                <span className="text-sm font-bold text-slate-200">{parametrosCustomizados.espessura} cm</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-400">Técnica</span>
                <span className={`text-[11px] font-bold truncate ${parametrosCustomizados.params.usaGrade ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {parametrosCustomizados.params.usaGrade ? 'Grade Bucky' : 'Mesa Direta'}
                </span>
              </div>
            </div>
          )}

          {/* Dados Técnicos Essenciais: Chassi e DFF acima do Raio Central */}
          <div className="space-y-2 text-xs text-slate-300 mb-3">
            <div className="flex items-start gap-2">
              <Ruler size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-200">Chassi:</strong> {incidencia.tamanhoChassi} Sobre a mesa • <strong className="text-slate-200">DFF:</strong> {incidencia.dffCm} cm
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Target size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p><strong className="text-slate-200">Raio Central:</strong> {incidencia.raioCentral}</p>
            </div>

            <div className="flex items-start gap-2">
              <User size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p><strong className="text-slate-200">Posicionamento:</strong> {incidencia.posicionamento}</p>
            </div>
          </div>

          {/* Botão de Expandir Critérios Bontrager */}
          <button
            type="button"
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 transition-colors mb-3"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Critérios Bontrager & Dica</span>
            </span>
            {mostrarDetalhes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {mostrarDetalhes && (
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs mb-3 animate-in fade-in duration-200">
              <div>
                <strong className="text-emerald-400 block mb-1">🔍 Critérios de Aceitação (Bontrager):</strong>
                <p className="text-slate-300 leading-relaxed">{incidencia.criteriosBontrager}</p>
              </div>

              {incidencia.dicaPratica && (
                <div className="pt-2 border-t border-slate-800 flex items-start gap-1.5">
                  <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 italic"><strong className="text-amber-300 not-italic">Dica de Plantão:</strong> {incidencia.dicaPratica}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé com Botão da Calculadora */}
        <div className="pt-3 border-t border-radiology-border/60">
          <button
            type="button"
            onClick={() => onAbrirCalculadora(incidencia)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] ${
              foiCustomizado
                ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/20'
            }`}
          >
            {foiCustomizado ? <Sparkles size={15} /> : <Calculator size={15} />}
            <span>{foiCustomizado ? 'Recalcular Parâmetros' : 'Calcular Parâmetros'}</span>
          </button>
        </div>
      </article>

      {/* Modal Lightbox de Imagens de Alta Resolução */}
      <ModalImagemPosicionamento
        incidencia={incidencia}
        isOpen={mostrarModalImagem}
        onClose={() => setMostrarModalImagem(false)}
        onAbrirCalculadora={onAbrirCalculadora}
      />
    </>
  );
};
