/**
 * Resolve caminhos de assets relativos à base configurada no Vite,
 * garantindo compatibilidade tanto em desenvolvimento local quanto em subpastas
 * como GitHub Pages (/guia-posicionamento-radiografico/).
 */
export function resolveAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env?.BASE_URL || '/';
  const baseUrl = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
}
