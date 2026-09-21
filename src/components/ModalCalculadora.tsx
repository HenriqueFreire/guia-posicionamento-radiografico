import React, { useState, useEffect } from 'react';
import { IncidenciaRadiografica, ParametrosCalculados } from '../types/radiologia';
import { X, Copy, Check, Shield, Feather, Sparkles } from 'lucide-react';

interface ModalCalculadoraProps {
  incidencia: IncidenciaRadiografica | null;
  isOpen: boolean;
  onClose: () => void;
  onAplicarParametros?: (incidenciaId: string, params: ParametrosCalculados, espessura: number) => void;
}

export const ModalCalculadora: React.FC<ModalCalculadoraProps> = ({
  incidencia,
  isOpen,
  onClose,
  onAplicarParametros,
}) => {
  // Constante C recuperada do localStorage (ou padrão 25)
  const [constanteC, setConstanteC] = useState<number>(() => {
    const salva = localStorage.getItem('rx_constante_c');
    return salva ? parseInt(salva, 10) : 25;
  });

  const [espessura, setEspessura] = useState<number>(10);
  const [comGesso, setComGesso] = useState<boolean>(false);
  const [copiado, setCopiado] = useState<boolean>(false);

  // Inicializa a espessura com o valor padrão da incidência
  useEffect(() => {
    if (incidencia) {
      setEspessura(incidencia.espessuraMediaCm);
      setComGesso(false);
      setCopiado(false);
    }
  }, [incidencia]);

  // Salva a constante no localStorage quando alterada
  const handleMudarConstante = (novaC: number) => {
    setConstanteC(novaC);
    localStorage.setItem('rx_constante_c', novaC.toString());
  };

  if (!isOpen || !incidencia) return null;

  // ==========================================
  // FÓRMULAS DE FÍSICA RADIOLÓGICA
  // ==========================================
  // 1. Tensão (kV): kV = 2e + C + compensação de gesso
  let kvCalculado = 2 * espessura + constanteC;
  if (comGesso) {
    kvCalculado += 4;
  }

  // 2. Carga (mAs): Ajuste fino por variação de espessura (~10% por cm de desvio)
  const deltaE = espessura - incidencia.espessuraMediaCm;
  let fatorAjuste = 1 + deltaE * 0.1;
  if (fatorAjuste < 0.4) fatorAjuste = 0.4;

  let masCalculado = incidencia.masBase * fatorAjuste;
  if (comGesso) {
    masCalculado *= 1.3;
  }
  masCalculado = Math.round(masCalculado * 10) / 10;
  if (masCalculado < 1.0) masCalculado = 1.0;

  // 3. Regra de ouro da Grade Bucky: e > 10 cm ou kV > 60
  const usaGrade = espessura > 10 || kvCalculado > 60 || incidencia.gradeRecomendada;

  // Sugestão de mA e tempo (s)
  const maSugerido = masCalculado >= 10 ? 200 : 100;
  const tempoS = Math.round((masCalculado / maSugerido) * 100) / 100;

  const params: ParametrosCalculados = {
    kv: kvCalculado,
    mas: masCalculado,
    maSugerido,
    tempoS,
    usaGrade,
    formulaKv: `(2 × ${espessura}) + ${constanteC}${comGesso ? ' + 4 (Gesso)' : ''} = ${kvCalculado} kV`,
  };

  const handleCopiar = () => {
    const texto = `${incidencia.nome}\n• Tensão: ${kvCalculado} kV [${params.formulaKv}]\n• Carga: ${masCalculado} mAs (~${maSugerido} mA @ ${tempoS} s)\n• Técnica: ${usaGrade ? 'Com Grade Bucky' : 'Mesa Direta (Sem Grade)'}\n• DFF: ${incidencia.dffCm} cm\n• Chassi: ${incidencia.tamanhoChassi}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleAplicar = () => {
    if (onAplicarParametros) {
      onAplicarParametros(incidencia.id, params, espessura);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-radiology-dark border border-radiology-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between p-5 border-b border-radiology-border bg-radiology-surface/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {incidencia.regiao}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {incidencia.subregiao}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {incidencia.nome}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fechar (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-sm">
          {/* Grid de Inputs: Espessura e Constante C */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Espessura (e) com Stepper */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>📐 Espessura do Paciente (e):</span>
              </label>
              <div className="flex items-center border border-radiology-border rounded-xl bg-radiology-darkest overflow-hidden">
                <button
                  type="button"
                  onClick={() => setEspessura((prev) => Math.max(1, prev - 1))}
                  className="w-12 h-11 flex items-center justify-center bg-slate-800/80 hover:bg-cyan-600/30 text-slate-200 text-lg font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="0.5"
                  value={espessura}
                  onChange={(e) => setEspessura(parseFloat(e.target.value) || 1)}
                  className="w-full text-center bg-transparent font-bold text-lg text-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setEspessura((prev) => prev + 1)}
                  className="w-12 h-11 flex items-center justify-center bg-slate-800/80 hover:bg-cyan-600/30 text-slate-200 text-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-400">
                Média anatômica: ~{incidencia.espessuraMediaCm} cm
              </span>
            </div>

            {/* Constante do Aparelho (C) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>⚙️ Constante do Aparelho (C):</span>
              </label>
              <input
                type="number"
                min="10"
                max="50"
                step="1"
                value={constanteC}
                onChange={(e) => handleMudarConstante(parseInt(e.target.value, 10) || 20)}
                className="w-full h-11 text-center border border-radiology-border rounded-xl bg-radiology-darkest font-bold text-lg text-cyan-400 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-400">
                Salva no navegador (Padrão: 20-30)
              </span>
            </div>
          </div>

          {/* Modificador: Gesso */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={comGesso}
              onChange={(e) => setComGesso(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-800 border-slate-700 cursor-pointer"
            />
            <span className="text-xs font-medium text-slate-300">
              Membro imobilizado com <strong className="text-white">gesso / tala</strong> (+4 kV e compensação)
            </span>
          </label>

          {/* Painel de Resultados Físicos */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Tensão (kV) */}
              <div className="p-2.5 rounded-lg bg-radiology-darkest/70 border border-radiology-border/60">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Tensão (kV)
                </span>
                <div className="text-2xl font-black text-cyan-400 my-0.5">
                  {kvCalculado} <span className="text-sm font-semibold">kV</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {params.formulaKv}
                </div>
              </div>

              {/* Carga (mAs) */}
              <div className="p-2.5 rounded-lg bg-radiology-darkest/70 border border-radiology-border/60">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Carga (mAs)
                </span>
                <div className="text-2xl font-black text-amber-400 my-0.5">
                  {masCalculado} <span className="text-sm font-semibold">mAs</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  ~{maSugerido} mA @ {tempoS} s
                </div>
              </div>
            </div>

            {/* Badge de Grade Bucky & ALARA */}
            <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold border ${
              usaGrade 
                ? 'bg-amber-950/40 border-amber-800/50 text-amber-300' 
                : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
            }`}>
              {usaGrade ? (
                <>
                  <Shield size={16} className="text-amber-400 shrink-0" />
                  <span>Grade Bucky Recomendada (Espessura &gt; 10 cm ou kV &gt; 60 para conter espalhamento Compton)</span>
                </>
              ) : (
                <>
                  <Feather size={16} className="text-emerald-400 shrink-0" />
                  <span>Mesa Direta / Sem Grade (Espessura &le; 10 cm — Menor Dose ao Paciente ALARA)</span>
                </>
              )}
            </div>

            {/* Geometria e Receptor */}
            <div className="text-xs text-slate-300 flex justify-between pt-1 border-t border-slate-800/80">
              <span><strong>Receptor:</strong> {incidencia.tamanhoChassi}</span>
              <span><strong>DFF:</strong> {incidencia.dffCm} cm</span>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-radiology-border bg-radiology-surface/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopiar}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              copiado
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            {copiado ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiado ? 'Copiado!' : 'Copiar Parâmetros'}</span>
          </button>

          <button
            type="button"
            onClick={handleAplicar}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Aplicar ao Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
