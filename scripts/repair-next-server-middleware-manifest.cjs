/**
 * Substitui a implementação vanilla de `getMiddlewareManifest` quando o ficheiro
 * em disco ainda é o esperado (Next 14.2.x) — evita bloqueio com stack em
 * next-server.js no `require(middleware-manifest)` após clean `.next` ou estados inconsistentes.
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
            return {
                version: 3,
                middleware: {},
                functions: {},
                sortedMiddleware: []
            };
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
            return {
                version: 3,
                middleware: {},
                functions: {},
                sortedMiddleware: []
            };
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
