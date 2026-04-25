"use client";
import { useParams, usePathname } from "next/navigation";
import Breadcrumb from "react-ultimate-components/src/components/navigation/BreadCrumb/index.tsx";
import {
  GenericProductDetails,
  TopMenu,
} from "../../../libs/react-ultimate-components/src/index.tsx";
import { buildTopMenuItems } from "../../constants/home.tsx";
import { useStore } from "../../providers/StoreProvider";

export default function Home() {
  const { products, categories } = useStore();
  const params = useParams();
  const pathname = usePathname();
  const normalizedPathname =
    pathname.replace(/^\/sites\/[^/]+/, "") || "/";
  const paramSlug = Array.isArray(params?.slug)
    ? params.slug[params.slug.length - 1]
    : params?.slug;
  const currentPath =
    paramSlug || normalizedPathname.replace("/produto/", "");
  const selectedProduct =
    products.find((product) => product.slug === currentPath) ?? products[0];
  const topMenuItems = buildTopMenuItems(categories);

  if (!selectedProduct) {
    return (
      <main className="w-full bg-background text-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground">
            Produto não encontrado
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-background text-foreground">
      {/* Top categories */}
      <div className="w-screen bg-gray-100 dark:bg-gray-900 px-2">
        <TopMenu
          menuItems={topMenuItems}
          className="w-full bg-gray-100 dark:bg-gray-900 text-background"
          itemClassName="text-sm font-semibold text-foreground hover:text-foreground"
        />
      </div>

      <div className=" w-full max-w-7xl flex items-center gap-2 mx-auto px-4 pt-4 text-sm text-foreground/70">
        <span className="min-w-[120px] line-clamp-1 font-semibold">
          Você está em:
        </span>
        <Breadcrumb currentPath={currentPath} />
      </div>

      {/* Products */}
      <section
        id="produto"
        className="bg-background pb-12 sm:pb-24 pt-6 sm:pt-12"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4">
          <GenericProductDetails
            product={{
              ...selectedProduct,
              price: selectedProduct.priceCents / 100,
              photos: selectedProduct.imageUrls.map((url) => ({
                src: url,
                alt: selectedProduct.name,
              })),
              description: selectedProduct.description || "",
              shareUrl: selectedProduct.shareUrl,
            }}
          />
        </div>
      </section>
    </main>
  );
}
