# 📖 Guia de Arquitetura e Especificação Técnica
# Guia de Posicionamento Radiográfico & Espessômetro Digital (PWA)

---

## 🎯 1. Visão Geral e Proposta de Valor

O **Guia de Posicionamento Radiográfico & Espessômetro Digital** é uma aplicação web progressiva (**PWA**) de alta performance, projetada para servir como uma ferramenta de cabeceira de leito, laboratório e sala de exames para técnicos, tecnólogos e estudantes de radiologia.

### 💡 O Problema que Resolve:
1. **Falta de Praticidade no Plantão:** Consultar livros pesados (ex.: Bontrager de 800+ páginas) durante o atendimento ou conferir tabelas de técnica impressas e desatualizadas é inviável na agilidade exigida pelo pronto-socorro.
2. **Ambiente Hostil à Conexão (Efeito Bunker):** Salas de raios X possuem blindagens de chumbo e argamassa baritada que bloqueiam ou degradam sinais móveis (4G/5G). O aplicativo precisa funcionar **100% offline**.
3. **Cálculo de Dose e Exposição Empírico:** Frequentemente os fatores de exposição são decididos "no olho", elevando a repetição de exames e a dose no paciente. O aplicativo oferece uma **Calculadora de Parâmetros Técnicos baseada no espessômetro ($kV = 2e + C$)** com compensações reais (grade Bucky, gesso, DFF).

---

## 👥 2. Público-Alvo e Cenários de Uso

* **Estudantes do Curso Técnico em Radiologia (Senac e congêneres):** Apoio em aulas práticas de laboratório, simulações de posicionamento e preparação para provas e estágios.
* **Estagiários e Técnicos Recém-Formados em Plantão:** Consulta rápida de incidências de rotina e especiais em ortopedia e trauma antes de disparar o feixe.
* **Docentes e Monitores:** Demonstração didática de como a variação milimétrica de espessura tecidual impacta diretamente o espectro de raios X e o Princípio ALARA (*As Low As Reasonably Achievable*).

---

## 🏗️ 3. Arquitetura Tecnológica (Stack Moderna)

A aplicação é construída com a stack padrão ouro de desenvolvimento web moderno:

| Camada | Tecnologia | Justificativa Técnica |
| :--- | :--- | :--- |
| **Bundler & Dev Server** | **Vite** | Inicialização instantânea (HMR em milissegundos) e geração de builds ultra-otimizados. |
| **Framework de UI** | **React 19** | Componentização modular e gerenciamento de estado reativo para os cálculos e filtros. |
| **Linguagem** | **TypeScript** | Blindagem contra erros de tipagem em parâmetros clínicos, fórmulas físicas e estruturas anatômicas. |
| **Estilização** | **Tailwind CSS** | Design responsivo *mobile-first*, utility-first e suporte nativo a Dark Mode (sala de laudo). |
| **Ícones** | **Lucide React** | Biblioteca vetorial médica/técnica leve e consistente. |
| **PWA & Offline** | **vite-plugin-pwa (Workbox)** | Service worker automático com estratégias de cache, manifesto e instalação na tela inicial. |
| **Ambiente Local** | **Nix Flake (`flake.nix`)** | Reprodutibilidade absoluta no NixOS sem atrito de binários dinâmicos. |
| **Hospedagem & CI/CD** | **GitHub Pages + Actions** | Build e deploy automatizados a cada push na nuvem, com HTTPS e zero custo de infraestrutura. |

---

## 🦴 4. Modelagem de Dados Radiológicos (TypeScript)

A estrutura de dados central que alimenta a aplicação é estritamente tipada:

```typescript
export type RegiaoAnatomica = 
  | 'MMSS' 
  | 'MMII' 
  | 'Cintura Escapular & Tórax' 
  | 'Bacia & Pelve' 
  | 'Coluna Vertebral' 
  | 'Crânio & Face';

export type TipoIncidencia = 'Rotina' | 'Especial / Trauma';

export interface IncidenciaRadiografica {
  id: string;
  nome: string;
  regiao: RegiaoAnatomica;
  subregiao: string; // Ex: "Mão e Dedos", "Punho", "Joelho", "Quadril"
  tipo: TipoIncidencia;
  
  // Parâmetros de Aquisição Padrão
  espessuraMediaCm: number;
  masBase: number;
  dffCm: number; // 100 cm, 180 cm
  tamanhoChassi: string; // Ex: "24×30 cm longitudinal"
  gradeRecomendada: boolean;
  
  // Técnica de Posicionamento
  raioCentral: {
    direcao: string;
    angulacao: string;
    pontoIncidencia: string;
  };
  posicionamentoPaciente: string;
  posicionamentoEstrutura: string;
  
  // Critérios Radiológicos Canônicos (Bontrager / Biasoli)
  criteriosAceitacao: string[];
  
  // Biossegurança e Proteção Radiológica (RDC 611 / ALARA)
  cuidadosProtecao: string[];
  
  // Metadados
  eponimos?: string[]; // Ex: ["Neer", "Stecher", "Farill", "Cleaves"]
  postBlogUrl?: string; // Link de aprofundamento teórico no Blog de Estudos
}
```

---

## ⚡ 5. Motor de Cálculo Radiográfico (Espessômetro Digital)

A lógica operacional implementa as fórmulas consagradas da física radiológica:

### 1. Tensão ($kV$ — Fórmula de Biagio):
$$kV = (2 \times e) + C + \Delta_{gesso}$$
* $e$: Espessura medida com espessômetro (em cm).
* $C$: Constante do gerador de raios X (configurável pelo usuário; padrão $25$).
* $\Delta_{gesso}$: $+4\text{ a }+6\text{ kV}$ se houver imobilização gessada úmida/seca.

### 2. Carga ($mAs$ Dinâmico):
$$mAs_{ajustado} = mAs_{base} \times \left[ 1 + (e - e_{media}) \times 0.10 \right] \times F_{gesso}$$
* Ajuste de atenuação tecidual proporcional à espessura anatômica.

### 3. Regra de Proteção e Seleção de Grade Antidifusora:
* **Se $e \le 10\text{ cm}$ e $kV \le 60$**: Exame em mesa direta (**Sem Grade**), minimizando a dose no paciente (*ALARA*).
* **Se $e > 10\text{ cm}$ ou $kV > 60$**: **Com Grade Bucky** obrigatória para absorver a radiação secundária gerada por espalhamento Compton.

---

## 📱 6. Sistema de Design & Experiência de Uso (UX)

* **Mobile-First Real:** Projetado para navegação com o polegar em smartphones de 5.5" a 6.7".
* **Dark Mode por Padrão (Tema "Radiology Dark"):**
  * Fundo em tons de *Slate/Zinc* escuros (`#090d16` / `#131b2e`).
  * Acentos em *Ciano Radiológico* (`#06b6d4` / `#0ea5e9`) e verde âmbar para doses e status.
  * Protege a adaptação visual do profissional em ambientes de penumbra (sala de exames e câmara escura).
* **Barra de Pesquisa Fuzzy:** Busca instantânea por qualquer fragmento (ex.: digitar *"faril"* acha *"Escanometria de Farill"*; digitar *"y"* acha *"Perfil em Y de Ombro"*).
* **Modal / Bottom-Sheet da Calculadora:** Abre de baixo para cima com controles de toque largos (`+` e `-` para uso com luvas cirúrgicas).
* **Persistência Local:** A constante $C$ do aparelho do plantonista e a lista de exames favoritos ficam salvas no `localStorage`.

---

## 📁 7. Estrutura de Diretórios Proposta

```text
guia_de_posicionamento/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions (Build e Deploy no GitHub Pages)
├── public/
│   ├── favicon.svg
│   ├── icon-192.png            # Ícone PWA
│   ├── icon-512.png            # Ícone PWA Splash
│   └── robots.txt
├── src/
│   ├── assets/                 # Imagens e diagramas anatômicos
│   ├── components/
│   │   ├── Header.tsx          # Barra de topo com busca, favoritos e seletor de tema
│   │   ├── FiltrosBar.tsx      # Pílulas de filtro por região (MMSS, MMII, Bacia)
│   │   ├── CardIncidencia.tsx  # Card visual de cada posicionamento
│   │   ├── ModalCalculadora.tsx# Popup do Espessômetro Digital e kV/mAs
│   │   └── DicaALARA.tsx       # Alertas de proteção radiológica
│   ├── data/
│   │   └── incidencias.ts      # Base tipada completa de todos os posicionamentos
│   ├── hooks/
│   │   ├── useCalculadora.ts   # Hook customizado com as fórmulas de física
│   │   └── useFavoritos.ts     # Hook de persistência de exames favoritados
│   ├── types/
│   │   └── radiologia.ts       # Interfaces TypeScript estritas
│   ├── utils/
│   │   └── formatadores.ts     # Formatador de strings e números
│   ├── App.tsx
│   ├── index.css               # Diretivas do Tailwind CSS
│   └── main.tsx
├── flake.nix                   # Ambiente Nix reprodutível (Node 22, PNPM)
├── index.html                  # Ponto de entrada com meta tags PWA
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts              # Configuração do Vite + vite-plugin-pwa
```

---

## 🚀 8. Pipeline de Deploy (GitHub Pages)

O deploy ocorre automaticamente a cada `git push` na branch `main`:
1. O GitHub Actions provisiona um runner Ubuntu.
2. Instala dependências com cache rápido.
3. Roda `npm run build` gerando a pasta otimizada `dist/`.
4. Publica instantaneamente no endereço `https://henriquefreire.github.io/guia-posicionamento/`.
