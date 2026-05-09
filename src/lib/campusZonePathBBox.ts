/**
 * Calcula bounding box (espaço viewBox 0–100) de um `d` SVG.
 * Executar apenas no cliente (precisa de DOM).
 */
export function pathDToBBoxPercent(d: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (typeof document === "undefined") {
    return { x: 0, y: 0, width: 20, height: 20 };
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("width", "100");
  svg.setAttribute("height", "100");
  svg.style.cssText =
    "position:absolute;left:-99999px;top:0;width:100px;height:100px;visibility:hidden;pointer-events:none";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  document.body.appendChild(svg);
  try {
    const bb = path.getBBox();
    return {
      x: bb.x,
      y: bb.y,
      width: Math.max(0.01, bb.width),
      height: Math.max(0.01, bb.height)
    };
  } finally {
    document.body.removeChild(svg);
  }
}
