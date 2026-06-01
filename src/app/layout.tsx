import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getStoreByDomain } from "../lib/store-data";
import Breadcrumb from "./components/Breadcrumb";
import Footer from "./components/footer";
import Header from "./components/header";
import ThemeTokens from "./components/ThemeTokens";
import { StoreProvider } from "./providers/StoreProvider";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = headers();
  const host =
    (await headerList).get("x-store-slug") ??
    (await headerList).get("x-forwarded-host") ??
    (await headerList).get("host");
  const { storeData } = await getStoreByDomain(host);

  return {
    title: storeData.store.name || "MostraLoja",
    description: storeData.store.slogan || "Loja virtual feita com MostraLoja",
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = headers();
  const host =
    (await headerList).get("x-store-slug") ??
    (await headerList).get("x-forwarded-host") ??
    (await headerList).get("host");
  const storePayload = await getStoreByDomain(host);

  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden">
        <StoreProvider value={storePayload}>
          <ThemeTokens />
          <Header />
          <Breadcrumb />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
