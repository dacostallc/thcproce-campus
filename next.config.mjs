/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Windows: o watcher por vezes tenta `lstat` ficheiros na raiz de C:\ (pagefile.sys, etc.)
   * e regista EINVAL — ignoramos esses caminhos para reduzir ruído e falhas do watcher.
   *
   * Nota: em Webpack 5, `watchOptions.ignored` em forma de array só aceita *strings* (globs).
   * O Next define `ignored` como um único `RegExp`; não podemos meter esse RegExp dentro de um
   * array misturado com globs (ValidationError + dump gigante do schema no terminal).
   * Mantemos um único RegExp: o do Next OR os ficheiros de sistema listados abaixo (equivalente aos globs pedidos).
   */
  webpack(config, { dev }) {
    if (!dev) return config;

    const prev = config.watchOptions?.ignored;
    const winRootSys =
      /(^|[\\/])(?:DumpStack\.log\.tmp|hiberfil\.sys|pagefile\.sys|swapfile\.sys)$/;

    /**
     * Webpack 5: `ignored` ou é um RegExp, uma string, ou um array *apenas de strings* (globs).
     * O Next.js injecta um único RegExp (node_modules / .git / .next). Nunca misturar RegExp
     * dentro desse array — gera ValidationError e o CLI imprime o schema inteiro no terminal.
     */
    if (prev instanceof RegExp) {
      const flags = [...new Set(prev.flags.split(""))].join("");
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: new RegExp(`(?:${prev.source})|(?:${winRootSys.source})`, flags)
      };
    } else if (Array.isArray(prev)) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          ...prev.filter((item) => typeof item === "string" && item.trim().length > 0),
          "**/DumpStack.log.tmp",
          "**/hiberfil.sys",
          "**/pagefile.sys",
          "**/swapfile.sys"
        ]
      };
    } else if (typeof prev === "string" && prev.trim().length > 0) {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          prev,
          "**/DumpStack.log.tmp",
          "**/hiberfil.sys",
          "**/pagefile.sys",
          "**/swapfile.sys"
        ]
      };
    } else {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: winRootSys
      };
    }

    return config;
  },
  /**
   * Prisma 5 + @prisma/instrumentation puxa OpenTelemetry. Manter estes pacotes fora do bundle
   * do servidor reduz artefactos tipo `vendor-chunks/@opentelemetry.js` em falta em `/api/trpc`.
   *
   * Não forçamos `optimization.splitChunks: false` em dev — isso quebrou a emissão de
   * `middleware-manifest.json` em algumas sequências (dev com `.next` apagado ou HMR estranho).
   */
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "prisma",
      "@prisma/instrumentation",
      "@opentelemetry/api",
      "@opentelemetry/instrumentation"
    ],
    /**
     * Garante que os arquivos Markdown de aulas sejam incluídos no bundle
     * do Vercel (serverless). `fs.readFileSync` com paths dinâmicos não é
     * detectado pelo tracing automático do Next.js.
     *
     * Cobre:
     *  - src/content/courses/**  ← Blueprint canónico
     *  - content/courses/**      ← legado (fallback até migração completa)
     */
    outputFileTracingIncludes: {
      "/api/trpc/[trpc]": [
        "./src/content/courses/**",
        "./content/courses/**",
      ],
    },
    // Exclui MP3s gerados localmente do bundle serverless (>300MB no Vercel).
    // Em produção o áudio é servido pelo Supabase Storage — esses arquivos
    // existem apenas no filesystem de dev e não devem ser empacotados.
    outputFileTracingExcludes: {
      "*": [
        "./public/audio/**",
      ],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
