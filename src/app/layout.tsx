import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { siteCanonicalOrigin } from "@/config/sitePublic";

export const metadata: Metadata = {
  title: "THCProce — Escola Aberta de Cannabis",
  description:
    "Campus virtual da Escola PROCBD: cultivo, extrações, medicina canabinoide, culinária, indústria e legislação. 11 cursos com certificado.",
  metadataBase: new URL(siteCanonicalOrigin()),
  openGraph: {
    title: "THCProce — Escola Aberta de Cannabis",
    description:
      "Caminhe pelo nosso campus interativo. Aprenda cultivo, extrações, medicina, culinária e indústria da cannabis.",
    type: "website"
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "THCProce", statusBarStyle: "black-translucent" }
};

export const viewport: Viewport = {
  themeColor: "#050a07",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-ink-900 text-canna-50 antialiased"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
