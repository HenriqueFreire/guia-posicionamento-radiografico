import React, { useState } from 'react';
import { IncidenciaRadiografica, ParametrosCalculados } from '../types/radiologia';
import { Calculator, Target, User, CheckCircle2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface CardIncidenciaProps {
  incidencia: IncidenciaRadiografica;
  parametrosCustomizados?: {
    params: ParametrosCalculados;
    espessura: number;
  };
  constantePadrao: number;
  onAbrirCalculadora: (incidencia: IncidenciaRadiografica) => void;
}

export const CardIncidencia: React.FC<CardIncidenciaProps> = ({
  incidencia,
  parametrosCustomizados,
  constantePadrao,
  onAbrirCalculadora,
}) => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState<boolean>(false);

  // Valores calculados (ou base se ainda não customizado)
  const espessuraExibida = parametrosCustomizados 
    ? parametrosCustomizados.espessura 
    : incidencia.espessuraMediaCm;

  const kvExibido = parametrosCustomizados 
    ? parametrosCustomizados.params.kv 
    : 2 * incidencia.espessuraMediaCm + constantePadrao;

  const masExibido = parametrosCustomizados 
    ? parametrosCustomizados.params.mas 
    : incidencia.masBase;

  const usaGradeExibida = parametrosCustomizados 
    ? parametrosCustomizados.params.usaGrade 
    : (incidencia.gradeRecomendada || incidencia.espessuraMediaCm > 10);

  const foiCustomizado = !!parametrosCustomizados;

  return (
    <article className="bg-radiology-dark/90 border border-radiology-border rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:shadow-cyan-950/30 hover:border-cyan-500/40 transition-all duration-300">
      <div>
        {/* Badges de Categoria */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              {incidencia.regiao}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {incidencia.subregiao}
            </span>
          </div>

          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
            incidencia.tipo === 'Rotina'
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
              : 'bg-amber-950/70 text-amber-300 border-amber-800/50'
          }`}>
            {incidencia.tipo}
          </span>
        </div>

        {/* Título da Incidência */}
        <h3 className="text-base font-bold text-white mb-3 leading-snug">
          {incidencia.nome}
        </h3>

        {/* Box de Parâmetros Operacionais */}
        <div className={`grid grid-cols-4 gap-2 p-2.5 rounded-xl border mb-3 transition-colors ${
          foiCustomizado 
            ? 'bg-cyan-950/30 border-cyan-500/40' 
            : 'bg-radiology-darkest/80 border-radiology-border/60'
        }`}>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tensão</span>
            <span className="text-sm font-black text-cyan-400">{kvExibido} kV</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Carga</span>
            <span className="text-sm font-black text-amber-400">{masExibido} mAs</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Espessura</span>
            <span className="text-sm font-bold text-slate-200">{espessuraExibida} cm</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Técnica</span>
            <span className={`text-[11px] font-bold truncate ${usaGradeExibida ? 'text-amber-300' : 'text-emerald-300'}`}>
              {usaGradeExibida ? 'Grade Bucky' : 'Mesa Direta'}
            </span>
          </div>
        </div>

        {/* Dados Técnicos Essenciais */}
        <div className="space-y-2 text-xs text-slate-300 mb-3">
          <div className="flex items-start gap-2">
            <Target size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <p><strong className="text-slate-200">Raio Central:</strong> {incidencia.raioCentral}</p>
          </div>

          <div className="flex items-start gap-2">
            <User size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <p><strong className="text-slate-200">Posicionamento:</strong> {incidencia.posicionamento}</p>
          </div>

          <div className="text-[11px] text-slate-400 pl-5">
            <strong>Chassi:</strong> {incidencia.tamanhoChassi} • <strong>DFF:</strong> {incidencia.dffCm} cm
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
          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-md shadow-cyan-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Calculator size={15} />
          <span>Calcular c/ Espessômetro</span>
        </button>
      </div>
    </article>
  );
};
