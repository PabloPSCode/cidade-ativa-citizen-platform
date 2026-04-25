"use client";
import type { Metadata } from "next";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import {
  ItemsSearchList,
  LandingHeader,
  SearchInput,
} from "../../libs/react-ultimate-components/src";
import { useStore } from "../providers/StoreProvider";

export const metadata: Metadata = {
  title: "MostraLoja",
  description: "Next.js 15 starter with TypeScript and TailwindCSS",
};

export default function Header() {
  const [search, setSearch] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const { storeData, categories, products } = useStore();

  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/sites\/[^/]+/, "") || "/";

  const MIN_SEARCH_LENGTH = 3;

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  const resolveHref = (href: string) => {
    if (href.startsWith("#")) {
      return normalizedPathname === "/" ? href : `/${href}`;
    }
    return href;
  };

  const handleToggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const menuItems = categories.map((category) => {
    const anchor = category.id ?? category.slug ?? category.name;
    return {
      label: category.name,
      name: category.name,
      href: `#${anchor}`,
      target: "_self",
    };
  });
  const logoUrl = storeData.store.companyLogoUrl || "/lets_encrypt.png";

  return (
    <LandingHeader.Root
      className="relative bg-background shadow-sm z-90"
      size="lg"
      bordered={false}
      sticky
      style={{ zIndex: 9999 }}
    >
      <LandingHeader.Left className="flex items-center">
        <div
          className="flex items-center"
          role="button"
          onClick={() => router.push("/")}
        >
          <Image
            src={logoUrl}
            alt={storeData.store.name || "MostraLoja"}
            width={612}
            height={408}
            className="h-12 w-auto sm:h-14 md:h-16 max-w-[120px] max-h-[40px] object-contain"
            quality={100}
            priority
          />
        </div>
      </LandingHeader.Left>

      <div className="flex flex-col flex-1 items-center justify-center mx-4 relative">
        {/* @ts-ignore */}
        <SearchInput
          search={search}
          setSearch={(e) => setSearch(e)}
          placeholder="Pesquise um produto"
          //@ts-ignore
          variant="button-highlight"
        />
        {search.length >= MIN_SEARCH_LENGTH && (
          <ItemsSearchList
            searchTerm={search}
            className="absolute bottom-[-160px] left-0 z-50"
            items={products as never}
            onItemClick={() => setSearch("")}
          />
        )}
      </div>
      <LandingHeader.Right className="flex items-center gap-6">
        <LandingHeader.MobileMenuToggle
          open={showMobileMenu}
          onToggle={handleToggleMobileMenu}
        />
      </LandingHeader.Right>
      <LandingHeader.MobileMenuPanel open={showMobileMenu}>
        <h2 className="text-lg sm:text-xl font-black uppercase text-foreground">
          Compre por categoria
        </h2>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="inline-block"
            onClick={handleToggleMobileMenu}
          >
            <a
              href={resolveHref(item.href)}
              target={item.target}
              rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              className="text-sm sm:text-base"
            >
              {item.label}
            </a>
          </li>
        ))}
      </LandingHeader.MobileMenuPanel>
    </LandingHeader.Root>
  );
}
