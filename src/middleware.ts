import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Matcher sintético: mantém o pipeline de middleware activo (`middleware-manifest.json`)
 * sem interceptar rotas normais da app.
 *
 * Em dev, quando o manifesto está ausente, `npm run dev` define `NODE_OPTIONS`
 * `--require scripts/node-require-next-mw-fallback.cjs` (via `scripts/run-next-dev.cjs`)
 * porque o servidor real corre num processo forkado pelo Next CLI.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: "/__thc_campus_probe__/middleware_noop"
};
