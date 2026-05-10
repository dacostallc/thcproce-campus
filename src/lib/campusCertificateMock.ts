import type { Area } from "@/data/courses";
import { evaluateCampusAreaCertificateEligibility } from "@/lib/campusCertificateEligibility";

/** Certificado HTML imprimível — mock local até integração PDF servidor. */
export function openCampusCertificateMockWindow(area: Area, studentDisplayName: string): void {
  if (typeof window === "undefined") return;
  const ev = evaluateCampusAreaCertificateEligibility(area);
  if (!ev.eligible) return;

  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;

  const safeName = studentDisplayName.trim().slice(0, 80) || "Aluno THC";
  const title = area.name.replace(/</g, "");

  w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>Certificado THCProce — ${title}</title>
<style>
  body { font-family: system-ui,Segoe UI,Roboto,sans-serif; margin: 48px; color: #0f172a; background: #f8fafc; }
  .card { max-width: 720px; margin: auto; padding: 48px; border: 2px solid #34d399; border-radius: 16px; background: white; box-shadow: 0 12px 40px rgba(15,23,42,.08); }
  h1 { font-size: 1.35rem; letter-spacing: .08em; text-transform: uppercase; color: #059669; margin-bottom: 8px; }
  h2 { font-size: 1.85rem; margin: 12px 0 24px; }
  p { line-height: 1.55; color: #334155; }
  footer { margin-top: 36px; font-size: .85rem; color: #64748b; }
  @media print { body { background: white; } .noprint { display: none; } }
</style>
</head>
<body>
  <div class="card">
    <h1>Certificado de conclusão (demo local)</h1>
    <h2>${title}</h2>
    <p>Certificamos que <strong>${safeName}</strong> concluiu, neste navegador, todas as aulas do percurso acima,
    respeitando tempo mínimo de permanência e quizzes obrigatórios — conforme regras académicas THCProce Campus.</p>
    <p class="noprint">Use <strong>Ctrl+P</strong> para guardar em PDF (função do navegador).</p>
    <footer>Emitido por THCProce Campus · cópia local · não substitui registo oficial sem validação escolar.</footer>
  </div>
</body>
</html>`);
  w.document.close();
}
