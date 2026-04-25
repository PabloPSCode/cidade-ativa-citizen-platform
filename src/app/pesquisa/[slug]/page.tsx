"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductCard, TopMenu } from "react-ultimate-components";
import Breadcrumb from "react-ultimate-components/src/components/navigation/BreadCrumb/index.tsx";
import { sendMessageWhatsapp } from "../../../utils/helpers.ts";
import FilterControllerCard from "../../components/FilterControllerCard";
import { buildTopMenuItems } from "../../constants/home.tsx";
import { useStore } from "../../providers/StoreProvider";

type PriceRange = [number, number];

export default function Home() {
  const { categories, products } = useStore();
  const pathname = usePathname();
  const normalizedPathname =
    pathname.replace(/^\/sites\/[^/]+/, "") || "/";
  const currentPath = normalizedPathname;
  const topMenuItems = buildTopMenuItems(categories);

  const searchParams = useSearchParams();
  const query = searchParams.get("search")?.trim() ?? "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [queryCategoryId, setQueryCategoryId] = useState<string | null>(null);

  const MIN_SEARCH_LENGTH = 3;

  const priceBounds = useMemo<PriceRange>(() => {
    if (!products.length) return [0, 0];
    const prices = products.map((product) => product.priceCents / 100);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  const [priceRange, setPriceRange] = useState<PriceRange>(priceBounds);
  const [minPrice, maxPrice] = priceBounds;

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      setQueryCategoryId(null);
      setSelectedCategories([]);
      return;
    }

    const matchedCategory = categories.find((category) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      return name === normalizedQuery || slug === normalizedQuery;
    });

    const matchedId = matchedCategory?.id ?? null;
    setQueryCategoryId(matchedId);
    setSelectedCategories(matchedId ? [matchedId] : []);
  }, [categories, query]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setQueryCategoryId(null);
    setPriceRange([minPrice, maxPrice]);
  };

  useEffect(() => {
    console.log(selectedCategories);
    console.log(priceRange);
  }, [selectedCategories, priceRange]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const hasSearch =
      normalizedSearch.length >= MIN_SEARCH_LENGTH && !queryCategoryId;
    const selectedCategorySet = new Set(selectedCategories);

    return products.filter((product) => {
      const productPrice = product.priceCents / 100;
      const matchesPrice =
        productPrice >= priceRange[0] && productPrice <= priceRange[1];
      const matchesCategory =
        selectedCategorySet.size === 0 ||
        (product.categoryId && selectedCategorySet.has(product.categoryId));
      const matchesSearch =
        !hasSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description?.toLowerCase().includes(normalizedSearch);

      return matchesPrice && matchesCategory && matchesSearch;
    });
  }, [
    priceRange,
    queryCategoryId,
    searchTerm,
    selectedCategories,
    products,
  ]);

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

      <div className="max-w-7xl flex flex-col mx-auto items-start px-4 pt-6 pb-10 gap-2 text-foreground">
        <div className=" w-full  flex items-center gap-2 mx-auto text-sm">
          <span className="min-w-[120px] line-clamp-1 font-semibold">
            Você está em:
          </span>
          <Breadcrumb currentPath={currentPath} />
        </div>
        <span className="text-sm mt-4">
          Resultados encontrados para a busca: {searchTerm || "Todos"}
        </span>
      </div>

      <section className="max-w-7xl bg-background grid grid-cols-1 lg:grid-cols-4 mx-auto gap-4 px-4 pb-16">
        <div className="lg:col-span-1">
          <FilterControllerCard
            categories={categories}
            selectedCategoryIds={selectedCategories}
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onToggleCategory={handleToggleCategory}
            onPriceChange={setPriceRange}
            onResetFilters={handleResetFilters}
          />
        </div>
        <div className="lg:col-span-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  imageUrl={product.coverImageUrl ?? product.imageUrls[0]}
                  title={product.name}
                  price={product.priceCents / 100}
                  installments={10}
                  installmentValue={(product.priceCents ?? 0) / 1000}
                  ctaLabel="Tenho interesse"
                  shareLabel="Compartilhar"
                  className="h-full"
                  onAddToCart={() =>
                    sendMessageWhatsapp(
                      `Olá, tenho interesse no produto ${product.name} (Código: ${product.id}).`,
                      "5531985187963"
                    )
                  }
                />
              );
            })
          ) : (
            <span className="text-foreground/70 p-4 col-span-full">
              Nenhum produto encontrado para os filtros aplicados.
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
