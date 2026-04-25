import type { Metadata } from "next";
import {
  Inter,
  Josefin_Sans,
  Montserrat,
  Poppins,
  Raleway,
  Roboto,
  Ubuntu,
  Work_Sans,
} from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { getStoreByDomain } from "../lib/store-data";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "400", "600", "700"],
  variable: "--font-poppins",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});
const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "400", "600", "700"],
  variable: "--font-inter",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["500", "400", "600", "700"],
  variable: "--font-work-sans",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "400", "600", "700"],
  variable: "--font-montserrat",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin-sans",
});


const fontVariables = [
  poppins.variable,
  raleway.variable,
  ubuntu.variable,
  roboto.variable,
  inter.variable,
  workSans.variable,
  montserrat.variable,
  josefinSans.variable
].join(" ");

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
    <html lang="en" className={fontVariables}>
      <body className="overflow-x-hidden">
        <StoreProvider value={storePayload}>
          <ThemeTokens />
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
