/**
 * Substitui a implementação vanilla de `getMiddlewareManifest` quando
 * patch-package não correu / falhou mas o projeto ainda está em Next 14.2.x com
 * o corpo esperado — evita ficar bloqueado com stack em next-server.js:932:26
 * (única linha do require).
 *
 * É idempotente: se já existir o comentário `thc-campus:middleware-manifest-missing-stub`, não mexe.
 */
"use strict";

const fs = require("fs");
const path = require("path");

/** Vanilla Next 14.2.x típico; aceita CRLF/\s+. */
const VANILLA_GET_MW_MANIFEST =
  /getMiddlewareManifest\(\)\s*\{\s*if\s*\(this\.minimalMode\)\s*return\s*null;\s*const\s+manifest\s*=\s*require\(this\.middlewareManifestPath\);\s*return\s+manifest;\s*\}/;

function alreadyPatched(contents) {
  return contents.includes("thc-campus:middleware-manifest-missing-stub");
}

const CJS_REPLACEMENT = `    getMiddlewareManifest() {
        if (this.minimalMode) return null;
        try {
            const manifest = require(this.middlewareManifestPath);
            return manifest;
        } catch (err) {
            const mPath = String(this.middlewareManifestPath || "");
            const msg = err && err.message ? String(err.message) : "";
            const isMwManifestMiss =
                mPath.includes("middleware-manifest") ||
                /middleware-manifest\.json/i.test(msg);
            const errCode = err && err.code;
            const missing =
                isMwManifestMiss &&
                err != null &&
                (errCode === "MODULE_NOT_FOUND" || errCode === "ENOENT");
            if (!missing) {
                throw err;
            }
            // thc-campus:middleware-manifest-missing-stub
            {
                // #region agent log
                try {
                    if (!global._thcMwFbLogTs || Date.now() - global._thcMwFbLogTs > 400) {
                        global._thcMwFbLogTs = Date.now();
                        const logPath = (0, _path.join)(process.env.USERPROFILE || process.env.HOME || "", ".cursor", "plans", "debug-2acee1.log");
                        const line = JSON.stringify({
                            sessionId: "2acee1",
                            hypothesisId: "H-repair-fallback",
                            location: "next-server.js:getMiddlewareManifest",
                            message: "fallback_empty_middleware_manifest",
                            data: { path: mPath, msgHit: /middleware-manifest\.json/i.test(msg) },
                            timestamp: Date.now(),
                            runId: process.env.DEBUG_RUN_ID || "repair",
                        }) + "\\n";
                        try {
                            _fs.default.mkdirSync((0, _path.dirname)(logPath), { recursive: true });
                        } catch (_m) {}
                        _fs.default.appendFileSync(logPath, line, "utf8");
                    }
                } catch (_e1) {}
                try {
                    if (!global._thcMwFbFetchTs || Date.now() - global._thcMwFbFetchTs > 400) {
                        global._thcMwFbFetchTs = Date.now();
                        fetch("http://127.0.0.1:7936/ingest/cdeab175-b2cf-4820-b65d-bd3d63b2a032", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Debug-Session-Id": "2acee1",
                            },
                            body: JSON.stringify({
                                sessionId: "2acee1",
                                hypothesisId: "H-repair-fallback",
                                location: "next-server.js:getMiddlewareManifest",
                                message: "fallback_empty_middleware_manifest",
                                data: { path: mPath, msgHit: /middleware-manifest\.json/i.test(msg) },
                                timestamp: Date.now(),
                                runId: process.env.DEBUG_RUN_ID || "repair",
                            }),
                        }).catch(()=>{});
                    }
                } catch (_e2) {}
                // #endregion
                return {
                    version: 3,
                    middleware: {},
                    functions: {},
                    sortedMiddleware: []
                };
            }
        }
    }`;

const ESM_REPLACEMENT = `    getMiddlewareManifest() {
        if (this.minimalMode) return null;
        try {
            const manifest = require(this.middlewareManifestPath);
            return manifest;
        } catch (err) {
            const mPath = String(this.middlewareManifestPath || "");
            const msg = err && err.message ? String(err.message) : "";
            const isMwManifestMiss =
                mPath.includes("middleware-manifest") ||
                /middleware-manifest\.json/i.test(msg);
            const errCode = err && err.code;
            const missing =
                isMwManifestMiss &&
                err != null &&
                (errCode === "MODULE_NOT_FOUND" || errCode === "ENOENT");
            if (!missing) {
                throw err;
            }
            // thc-campus:middleware-manifest-missing-stub
            {
                // #region agent log
                try {
                    var _global = typeof global !== "undefined" ? global : globalThis;
                    if (!_global._thcMwFbLogTsEsm || Date.now() - _global._thcMwFbLogTsEsm > 400) {
                        _global._thcMwFbLogTsEsm = Date.now();
                        const logPath = join(process.env.USERPROFILE || process.env.HOME || "", ".cursor", "plans", "debug-2acee1.log");
                        const line = JSON.stringify({
                            sessionId: "2acee1",
                            hypothesisId: "H-repair-fallback-esm",
                            location: "next-server.esm:getMiddlewareManifest",
                            message: "fallback_empty_middleware_manifest",
                            data: {
                                path: mPath,
                                msgHit: /middleware-manifest\.json/i.test(msg)
                            },
                            timestamp: Date.now(),
                            runId: process.env.DEBUG_RUN_ID || "repair"
                        }) + "\\n";
                        try {
                            fs.mkdirSync(dirname(logPath), { recursive: true });
                        } catch (_m) {}
                        fs.appendFileSync(logPath, line, "utf8");
                    }
                } catch (_e1) {}
                try {
                    var _g = typeof global !== "undefined" ? global : globalThis;
                    if (!_g._thcMwFbFetchTsEsm || Date.now() - _g._thcMwFbFetchTsEsm > 400) {
                        _g._thcMwFbFetchTsEsm = Date.now();
                        fetch("http://127.0.0.1:7936/ingest/cdeab175-b2cf-4820-b65d-bd3d63b2a032", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Debug-Session-Id": "2acee1"
                            },
                            body: JSON.stringify({
                                sessionId: "2acee1",
                                hypothesisId: "H-repair-fallback-esm",
                                location: "next-server.esm:getMiddlewareManifest",
                                message: "fallback_empty_middleware_manifest",
                                data: {
                                    path: mPath,
                                    msgHit: /middleware-manifest\.json/i.test(msg)
                                },
                                timestamp: Date.now(),
                                runId: process.env.DEBUG_RUN_ID || "repair"
                            })
                        }).catch(()=>{});
                    }
                } catch (_e2) {}
                // #endregion
                return {
                    version: 3,
                    middleware: {},
                    functions: {},
                    sortedMiddleware: []
                };
            }
        }
    }`;

/**
 * @param {string} projectRoot absoluto ao package da app (com node_modules/next)
 * @returns {boolean} true se pelo menos um ficheiro foi escrito
 */
function repairNextServerMiddlewareManifest(projectRoot) {
  const rels = [
    ["dist/server/next-server.js", CJS_REPLACEMENT],
    ["dist/esm/server/next-server.js", ESM_REPLACEMENT],
  ];
  let changed = false;
  for (const [rel, replacement] of rels) {
    const abs = path.join(projectRoot, "node_modules", "next", rel);
    if (!fs.existsSync(abs)) continue;
    let s = fs.readFileSync(abs, "utf8");
    if (alreadyPatched(s)) continue;
    if (!VANILLA_GET_MW_MANIFEST.test(s)) continue;
    const nextS = s.replace(VANILLA_GET_MW_MANIFEST, replacement);
    if (nextS === s) continue;
    fs.writeFileSync(abs, nextS, "utf8");
    changed = true;
  }
  return changed;
}

module.exports = { repairNextServerMiddlewareManifest };
