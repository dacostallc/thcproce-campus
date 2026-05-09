'use strict';

/**
 * Desenvolvimento: quando webpack apaga/regenera `middleware-manifest.json`, o
 * `require()` síncrono em `getMiddlewareManifest()` rebenta antes do ficheiro
 * voltar a existir — 500 nos handlers (ex. tRPC). É carregado com `--require`:
 * `npm run dev` usa `run-next-dev.cjs`, que põe esse flag em `NODE_OPTIONS`,
 * porque o Next CLI faz `fork()` do servidor HTTP (o pai não transmite `-r` ao filho).
 * Este preload envolve o método no prototype logo após o primeiro load de `next-server.js`.
 */
const Module = require('module');

const PATCH_MARK = '__thcMwFallbackHooked';

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
      const mPath = String(this.middlewareManifestPath || '');
      const msg = err && err.message ? String(err.message) : '';
      const isMwManifestMiss =
        mPath.includes('middleware-manifest') ||
        /middleware-manifest\.json/i.test(msg);
      const missing =
        isMwManifestMiss &&
        err != null &&
        (err.code === 'MODULE_NOT_FOUND' || err.code === 'ENOENT');
      const allowStub =
        process.env.TH_CAMPUS_MW_PRELOAD === '1' ||
        !!(this.renderOpts != null && this.renderOpts.dev) ||
        !!(this.serverOptions != null && this.serverOptions.dev) ||
        this.buildId === 'development' ||
        process.env.NODE_ENV === 'development';
      if (missing && allowStub) {
        return stubManifest();
      }
      throw err;
    }
  };

  proto[PATCH_MARK] = true;
  return true;
}

const _require = Module.prototype.require;
/** @type {boolean} */
let restored = false;

Module.prototype.require = function thcMwHookRequire(request) {
  const result = _require.apply(this, arguments);

  try {
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
