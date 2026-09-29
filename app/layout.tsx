import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuiabá API Atlas",
  description: "Explorador unificado das APIs, endpoints e interfaces públicas mapeadas da Prefeitura de Cuiabá.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
