/**
 * Arranca `next dev` com `NODE_OPTIONS` a incluir o preload que envolve
 * `getMiddlewareManifest`.
 *
 * O CLI do Next faz `fork()` do processo HTTP (`start-server`) — esse filho não
 * herda `-r`/execArgv do processo pai, mas sim `process.env.NODE_OPTIONS`, que o
 * `next-dev.js` propaga ao worker.
 */
const path = require("path");
const fs = require("fs");
const net = require("net");
const { spawn, spawnSync } = require("child_process");

const DEV_PORT = 3030;

/** Before spawning `next dev`, fail fast when the dev port is already bound (otherwise Next prints a terse EADDRINUSE). */
function checkDevPortAvailable() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once("error", (err) => {
      if (err.code === "EADDRINUSE") resolve({ ok: false });
      else reject(err);
    });
    srv.listen(DEV_PORT, () => {
      srv.close(() => resolve({ ok: true }));
    });
  });
}

/** `npm run dev` chama `predev` com este flag: só valida/repara disco e sai (evita arrancar com vanilla em cache). */
const checkOnly = process.argv.includes("--check-only");

const root = path.join(__dirname, "..");
const nextServerPath = path.join(
  root,
  "node_modules",
  "next",
  "dist",
  "server",
  "next-server.js",
);

/** O worker do Next carrega esta cópia no arranque: se não tiver o patch (try/catch + NEXT_PRIVATE_WORKER), os 500 com stack em `932:26` aparecem (linha vanilla do require). */
function nextMiddlewarePatchPresent() {
  try {
    const s = fs.readFileSync(nextServerPath, "utf8");
    return (
      s.includes("thc-campus:middleware-manifest-missing-stub") &&
      s.includes("fallback_empty_middleware_manifest")
    );
  } catch (_) {
    return false;
  }
}

function ensureNextMiddlewarePatch() {
  if (nextMiddlewarePatchPresent()) return true;
  const patchPkgCli = path.join(root, "node_modules", "patch-package", "index.js");
  if (!fs.existsSync(patchPkgCli)) {
    console.error(
      "[thc-campus] patch-package absent — só repararemos vanilla em disco ou abortamos.",
    );
  } else {
    console.warn(
      "[thc-campus] Applying patches/next+*.patch via patch-package before dev …",
    );
    spawnSync(process.execPath, [patchPkgCli], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
  }
  if (nextMiddlewarePatchPresent()) return true;

  const { repairNextServerMiddlewareManifest } = require(
    "./repair-next-server-middleware-manifest.cjs",
  );
  const repaired = repairNextServerMiddlewareManifest(root);
  if (repaired) {
    console.warn(
      "[thc-campus] Repaired vanilla getMiddlewareManifest directly in node_modules/next (patch-package incompleto / CRLF / --ignore-scripts).",
    );
  }

  return nextMiddlewarePatchPresent();
}

console.warn("[thc-campus] Dev launcher: run-next-dev.cjs (middleware-manifest guard).");
if (!ensureNextMiddlewarePatch()) {
  console.error(
    "[thc-campus] next-server.js is still missing safeguards after patch-package + repair.",
  );
  process.exit(1);
}
if (checkOnly) {
  console.warn("[thc-campus] --check-only ok (next-server safeguards present on disk).");
  process.exit(0);
}

const preload = path.resolve(__dirname, "node-require-next-mw-fallback.cjs");
/** Sem aspas aninhadas: em Windows NODE_OPTIONS atravessa spawn/fork e `--require "...\"` pode não ser interpretado pelo Node neste worker. `--require=R:/posix/path` é o formato mais estável (Node aceita). */
const preloadFlag = `--require=${preload.replace(/\\/g, "/")}`;
const prev = (process.env.NODE_OPTIONS || "").trim();
process.env.NODE_OPTIONS = prev
  ? `${preloadFlag} ${prev}`.trim()
  : preloadFlag;
/** Herdado pelo `fork()` do Next (CLI → worker); usado pelo preload quando `renderOpts.dev` ainda não está fiável. */
process.env.TH_CAMPUS_MW_PRELOAD = "1";

const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");

(async () => {
  try {
    const portCheck = await checkDevPortAvailable();
    if (!portCheck.ok) {
      console.error(
        `[thc-campus] Port ${DEV_PORT} is already in use — another dev server or app is listening. Stop it, then run npm run dev again.`,
      );
      console.error(
        "[thc-campus] PowerShell — list numeric PIDs (run this line):",
      );
      console.error(
        `  Get-NetTCPConnection -LocalPort ${DEV_PORT} | Select-Object -ExpandProperty OwningProcess -Unique`,
      );
      console.error(
        `[thc-campus] Kill one PID: Stop-Process -Id <coloque_o número> -Force  (avoid taskkill /IM node.exe unless you intend to kill every Node process.)`,
      );
      process.exit(1);
    }
  } catch (e) {
    console.warn(
      "[thc-campus] Could not verify port availability (proceeding anyway):",
      e && e.message,
    );
  }

  const child = spawn(process.execPath, [nextCli, "dev", "-p", String(DEV_PORT)], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    windowsHide: true,
  });

  child.on("exit", (code, signal) => {
    process.exit(signal ? 1 : code == null ? 0 : code);
  });
})();
