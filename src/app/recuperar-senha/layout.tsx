import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar senha — THCProce",
  description: "Defina uma nova senha para a sua conta THCProce sem refazer a matrícula."
};

export default function RecuperarSenhaLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
