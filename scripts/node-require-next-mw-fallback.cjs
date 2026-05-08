'use strict';

// #region agent log
(function preloadBootNdjson() {
  try {
    const fsBoot = require('fs');
    const pathBoot = require('path');
    const logPath = pathBoot.join(
      process.env.USERPROFILE || process.env.HOME || '',
      '.cursor',
      'plans',
      'debug-2acee1.log',
    );
    fsBoot.mkdirSync(pathBoot.dirname(logPath), { recursive: true });
    fsBoot.appendFileSync(
      logPath,
      JSON.stringify({
        sessionId: '2acee1',
        hypothesisId: 'H-preload-loaded',
        location: 'node-require-next-mw-fallback.cjs:boot',
        message: 'preload_boot',
        data: {
          preloadMarker: !!process.env.TH_CAMPUS_MW_PRELOAD,
          nodeEnv: process.env.NODE_ENV || null,
          argvSnippet: JSON.stringify(process.argv.slice(0, 4)),
        },
        timestamp: Date.now(),
        runId: process.env.DEBUG_RUN_ID || 'preload',
      }) + '\n',
      'utf8',
    );
  } catch (_) {}
})();
// #endregion

/**
 * Desenvolvimento: quando webpack apaga/regenera `middleware-manifest.json`, o
 * `require()` síncrono em `getMiddlewareManifest()` rebenta antes do ficheiro
 * voltar a existir — 500 nos handlers (ex. tRPC). É carregado com `--require`:
 * `npm run dev` usa `run-next-dev.cjs`, que põe esse flag em `NODE_OPTIONS`,
 * porque o Next CLI faz `fork()` do servidor HTTP (o pai não transmite `-r` ao filho).
 * Este preload envolve o método no prototype logo após o primeiro load de `next-server.js`.
 */
const Module = require('module');
const fs = require('fs');
const path = require('path');

const PATCH_MARK = '__thcMwFallbackHooked';

// #region agent log
const INGEST =
  'http://127.0.0.1:7936/ingest/cdeab175-b2cf-4820-b65d-bd3d63b2a032';
let _lastLog = 0;
function agentDebug(message, extra, hypothesisId) {
  const now = Date.now();
  if (now - _lastLog < 500 && message !== 'hook_installed') return;
  _lastLog = now;
  const payload = {
    sessionId: '2acee1',
    hypothesisId: hypothesisId || 'H-require-hook-fallback',
    location: 'node-require-next-mw-fallback.cjs',
    message,
    data: extra || {},
    timestamp: now,
    runId: process.env.DEBUG_RUN_ID || 'preload',
  };
  fetch(INGEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '2acee1',
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  try {
    const logPath = path.join(
      process.env.USERPROFILE || process.env.HOME || '',
      '.cursor',
      'plans',
      'debug-2acee1.log'
    );
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(payload) + '\n', 'utf8');
  } catch (_) {}
}
// #endregion

function stubManifest() {
  return {
    version: 3,
    middleware: {},
    functions: {},
    sortedMiddleware: [],
  };
}

/** @param {object} exported */
function patchNextServerModule(exported) {
  const Ctor = exported && exported.default;
  if (typeof Ctor !== 'function' || !Ctor.prototype) return false;
  const proto = Ctor.prototype;
  if (proto[PATCH_MARK]) return true;

  const orig = proto.getMiddlewareManifest;
  if (typeof orig !== 'function') return false;

  proto.getMiddlewareManifest = function thcMwSafeGetMiddlewareManifest() {
    if (this.minimalMode) return null;
    try {
      return orig.call(this);
    } catch (err) {
      const msg = err && err.message ? String(err.message) : '';
      const missing =
        !!(err != null &&
          (err.code === 'MODULE_NOT_FOUND' || err.code === 'ENOENT')) ||
        (msg.includes('Cannot find module') &&
          msg.includes('middleware-manifest'));
      const allowStub =
        process.env.TH_CAMPUS_MW_PRELOAD === '1' ||
        !!(this.renderOpts != null && this.renderOpts.dev) ||
        !!(this.serverOptions != null && this.serverOptions.dev) ||
        this.buildId === 'development' ||
        process.env.NODE_ENV === 'development';
      if (missing && allowStub) {
        agentDebug(
          'fallback_stub_returned',
          {
            middlewareManifestPath: String(this.middlewareManifestPath),
            errCode: err && err.code,
            buildId: this.buildId,
          },
          'H-hook-fallback'
        );
        return stubManifest();
      }
      throw err;
    }
  };

  proto[PATCH_MARK] = true;
  agentDebug('hook_installed', { ok: true }, 'H-hook-installed');
  return true;
}

const _require = Module.prototype.require;
/** @type {boolean} */
let restored = false;

Module.prototype.require = function thcMwHookRequire(request) {
  const result = _require.apply(this, arguments);

  try {
    /**
     * O argumento pode ser `./next-server` etc. Por isso fazemos fingerprint do
     * export (prototype com getMiddlewareManifest + getEdgeFunctionsPages).
     */
    if (
      !restored &&
      result &&
      typeof result === 'object' &&
      typeof result.default === 'function'
    ) {
      const Proto = result.default.prototype;
      if (
        Proto &&
        typeof Proto.getMiddlewareManifest === 'function' &&
        typeof Proto.getEdgeFunctionsPages === 'function' &&
        !Proto[PATCH_MARK]
      ) {
        if (patchNextServerModule(result)) {
          Module.prototype.require = _require;
          restored = true;
        }
      }
    }
  } catch (_) {}

  return result;
};
