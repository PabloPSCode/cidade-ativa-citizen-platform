import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppChrome from "./components/AppChrome";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/footer";
import Header from "./components/header";
import ThemeTokens from "./components/ThemeTokens";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";

export const metadata: Metadata = {
  title: "Cidade Ativa",
  description: "Uma plataforma cidadã para uma cidade melhor. Registre, acompanhe e resolva situações do seu município.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden">
        <ThemeTokens />
        <AppChrome
          header={<Header />}
          breadcrumb={<Breadcrumb />}
          footer={<Footer />}
        >
          {children}
        </AppChrome>
      </body>
    </html>
  );
}
