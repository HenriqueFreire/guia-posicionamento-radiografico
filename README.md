# ☢️ Guia de Posicionamento Radiográfico & Espessômetro Digital (PWA)

Aplicativo web progressivo (**PWA**) moderno, responsivo e 100% offline-first desenvolvido com **React 19, TypeScript, Tailwind CSS e Vite**, projetado para servir como ferramenta de cabeceira de leito e sala de exames para estudantes e técnicos em radiologia.

---

## 🚀 Principais Funcionalidades

* 🧍 **Mapa Anatômico Interativo (Silhueta Humana)**:
  * Clique nos **braços** para filtrar e acessar diretamente as incidências de **Membros Superiores (MMSS)**.
  * Clique nas **pernas** para filtrar e acessar diretamente as incidências de **Membros Inferiores (MMII)**.
  * Clique na **pelve** ou use as pílulas para navegar entre Bacia, Cintura Escapular e Tórax.
* 📐 **Espessômetro Digital & Calculadora de Fatores de Exposição**:
  * Cálculo dinâmico de **$kV$ (Fórmula de Biagio: $kV = 2e + C$)**.
  * Cálculo ajustado de **$mAs$**, sugerindo corrente (mA) e tempo de exposição em segundos ($s$).
  * Persistência da **Constante do Aparelho ($C$)** no navegador (`localStorage`).
  * **Alerta Inteligente ALARA / Grade Bucky**: indicação de mesa direta ($e \le 10\text{ cm}$) vs grade antidifusora ($e > 10\text{ cm}$ ou $kV > 60$).
* 📋 **32 Protocolos Radiográficos Canônicos (Bontrager 10ª Edição)**:
  * Atlas fotográfico de posicionamento com indicação precisa do Raio Central (RC) e radiografia de controle.
  * Raio central (ponto anatômico e angulação), posicionamento do paciente, DFF, receptor de imagem e critérios de qualidade radiográfica.
* ⚡ **PWA Offline-First**:
  * Funciona dentro de salas de comando blindadas e bunkers (efeito bunker) sem depender de conexão de internet.
  * Instalável na tela inicial do celular como app nativo.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** React 19 + TypeScript
* **Estilização:** Tailwind CSS (Dark Mode Radiológico)
* **Ícones:** Lucide React
* **Build & Bundler:** Vite 6 + `vite-plugin-pwa` (Workbox)
* **Ambiente de Desenvolvimento:** Nix Flake (`flake.nix` com Node 22 e PNPM)
* **CI/CD:** GitHub Actions (Deploy automático no GitHub Pages)

---

## 💻 Como Rodar Localmente

### Com Nix Flake (NixOS):
```bash
# Entrar no ambiente com Node 22 e PNPM prontos
nix develop

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Com Node.js convencional:
```bash
pnpm install
pnpm dev
```

---

## 📦 Build e Publicação no GitHub Pages

O build é automatizado via GitHub Actions a cada `git push` na branch `main`.

Para compilar manualmente:
```bash
pnpm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.
