import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuiabá Dados — Hub Municipal",
  description: "Finanças, contratos, pessoas, patrimônio, Diário Oficial e serviços públicos de Cuiabá em uma única interface.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
