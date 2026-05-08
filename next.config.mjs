/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
