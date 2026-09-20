import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HumanSilhouette } from './components/HumanSilhouette';
import { CardIncidencia } from './components/CardIncidencia';
import { ModalCalculadora } from './components/ModalCalculadora';
import { INCIDENCIAS } from './data/incidencias';
import { RegiaoAnatomica, IncidenciaRadiografica, ParametrosCalculados } from './types/radiologia';
import { Sparkles, Layers } from 'lucide-react';

export function App() {
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<RegiaoAnatomica | 'TODOS'>('TODOS');
  const [busca, setBusca] = useState<string>('');

  // Estado do Modal da Calculadora
  const [incidenciaAtiva, setIncidenciaAtiva] = useState<IncidenciaRadiografica | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Parâmetros customizados por exame aplicados pelo usuário
  const [customParams, setCustomParams] = useState<Record<string, { params: ParametrosCalculados; espessura: number }>>({});

  // Constante padrão recuperada do localStorage
  const constantePadrao = parseInt(localStorage.getItem('rx_constante_c') || '25', 10);

  // Filtragem dos exames
  const incidenciasFiltradas = useMemo(() => {
    return INCIDENCIAS.filter((item) => {
      // Filtro de Região (selecionado via silhueta anatômica)
      const matchRegiao = regiaoSelecionada === 'TODOS' || item.regiao === regiaoSelecionada;

      // Busca textual
      const termo = busca.toLowerCase().trim();
      const matchTexto =
        !termo ||
        item.nome.toLowerCase().includes(termo) ||
        item.subregiao.toLowerCase().includes(termo) ||
        item.posicionamento.toLowerCase().includes(termo) ||
        item.raioCentral.toLowerCase().includes(termo) ||
        item.criteriosBontrager.toLowerCase().includes(termo);

      return matchRegiao && matchTexto;
    });
  }, [regiaoSelecionada, busca]);

  const handleAbrirCalculadora = (incidencia: IncidenciaRadiografica) => {
    setIncidenciaAtiva(incidencia);
    setIsModalOpen(true);
  };

  const handleAplicarParametros = (id: string, params: ParametrosCalculados, espessura: number) => {
    setCustomParams((prev) => ({
      ...prev,
      [id]: { params, espessura },
    }));
  };

  return (
    <div className="min-h-screen bg-radiology-darkest text-slate-100 flex flex-col">
      {/* Cabeçalho Fixo */}
      <Header
        busca={busca}
        onMudarBusca={setBusca}
        totalFiltrados={incidenciasFiltradas.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================
              COLUNA ESQUERDA: SILHUETA HUMANA INTERATIVA
             ======================================================== */}
          <aside className="lg:col-span-4 xl:col-span-4 sticky lg:top-36 space-y-4">
            <HumanSilhouette
              regiaoSelecionada={regiaoSelecionada}
              onSelecionarRegiao={setRegiaoSelecionada}
            />

            {/* Banner de Dica ALARA */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Dica de Proteção (ALARA):</strong>
                <p className="text-slate-400 leading-relaxed">
                  Espessuras &le; 10 cm são realizadas diretamente no chassi (sem grade). Economiza dose no paciente e preserva o tubo.
                </p>
              </div>
            </div>
          </aside>

          {/* ========================================================
              COLUNA DIREITA: CATÁLOGO DE INCIDÊNCIAS
             ======================================================== */}
          <section className="lg:col-span-8 xl:col-span-8 space-y-4">
            {/* Barra de Status do Filtro Atual */}
            <div className="flex items-center justify-between pb-2 border-b border-radiology-border/60">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  {regiaoSelecionada === 'TODOS' ? 'Todas as Incidências' : `Exames de ${regiaoSelecionada}`}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                  {incidenciasFiltradas.length}
                </span>
              </div>

              {regiaoSelecionada !== 'TODOS' && (
                <button
                  type="button"
                  onClick={() => setRegiaoSelecionada('TODOS')}
                  className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  Limpar filtro &times;
                </button>
              )}
            </div>

            {/* Grid de Cards */}
            {incidenciasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incidenciasFiltradas.map((item) => (
                  <CardIncidencia
                    key={item.id}
                    incidencia={item}
                    parametrosCustomizados={customParams[item.id]}
                    constantePadrao={constantePadrao}
                    onAbrirCalculadora={handleAbrirCalculadora}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-dashed border-radiology-border bg-radiology-dark/50 space-y-2">
                <p className="text-base font-bold text-slate-300">
                  Nenhuma incidência encontrada para os filtros atuais.
                </p>
                <p className="text-xs text-slate-500">
                  Tente buscar por outro termo ou clique em "Todas as Regiões".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBusca('');
                    setRegiaoSelecionada('TODOS');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
                >
                  Restaurar Todos os Exames
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal da Calculadora (Espessômetro Digital) */}
      <ModalCalculadora
        incidencia={incidenciaAtiva}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAplicarParametros={handleAplicarParametros}
      />
    </div>
  );
}
export default App;
