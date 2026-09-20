{
  description = "Ambiente de desenvolvimento do Guia de Posicionamento Radiográfico & Espessômetro Digital";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSupportedSystem = f:
        nixpkgs.lib.genAttrs supportedSystems (system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              config.allowUnfree = true;
            };
          });
    in
    {
      devShells = forEachSupportedSystem ({ pkgs }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_22
            pnpm
            typescript
            typescript-language-server
            git
          ];

          shellHook = ''
            echo "═══════════════════════════════════════════════════════════════"
            echo "  ☢️  GUIA DE POSICIONAMENTO RADIOGRÁFICO & ESPESSÔMETRO DIGITAL"
            echo "  Ambiente de Desenvolvimento Nix carregado com sucesso!"
            echo "  Node.js: $(node --version) | NPM: $(npm --version)"
            echo "═══════════════════════════════════════════════════════════════"
          '';
        };
      });
    };
}
