/**
 * Gera atributo `d` retangular no espaço do viewBox 0–100 (%).
 * Útil ao exportar bbox do editor para um path SVG de protótipo.
 */
export function rectPercentToSvgPath(zone: {
  x: number;
  y: number;
  width: number;
  height: number;
}): string {
  const x2 = zone.x + zone.width;
  const y2 = zone.y + zone.height;
  const x = Math.round(zone.x * 1000) / 1000;
  const y = Math.round(zone.y * 1000) / 1000;
  const rx = Math.round(x2 * 1000) / 1000;
  const ry = Math.round(y2 * 1000) / 1000;
  return `M ${x} ${y} L ${rx} ${y} L ${rx} ${ry} L ${x} ${ry} Z`;
}
