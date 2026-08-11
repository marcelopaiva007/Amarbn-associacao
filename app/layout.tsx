import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AMARBN | Associação dos Moradores e Agricultores Rurais do Bairro do Nordeste",
  description: "Portal Oficial da AMARBN — Gestão Comunitária, Portal do Associado e Transparência",
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="pt-BR"><body>{children}</body></html>; }
