import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Perfil campus (offline) — THCProce",
  description: "Avatar, souvenirs e XP guardados só neste browser."
};

export default function CampusPerfilLayout({ children }: { children: ReactNode }) {
  return children;
}
