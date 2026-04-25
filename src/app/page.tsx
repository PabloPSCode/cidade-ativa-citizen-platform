"use client";
import { useRouter } from "next/navigation";
import {
  BannerCarousel,
  CategoryCard,
  ImageLink,
  ProductCard,
  TopMenu,
} from "../libs/react-ultimate-components/src";
import { sendMessageWhatsapp } from "../utils/helpers.ts";
import {
  buildFeaturedProducts,
  buildHeroBannerSlides,
  buildTopMenuItems,
  dealDeadline,
  originalPrices,
} from "./constants/home";
import { useStore } from "./providers/StoreProvider";

export default function Home() {
  const router = useRouter();
  const { categories, products, mediaItems } = useStore();
  const topMenuItems = buildTopMenuItems(categories);
  const featuredProducts = buildFeaturedProducts(products);
  const heroBannerSlides = buildHeroBannerSlides(mediaItems);
  const promotionalItems = mediaItems.filter(
    (item) => item.imageType === "promotional"
  );

  return (
    <main className="w-full min-h-screen bg-background text-foreground">
      {/* Top categories */}
      <div className="w-screen bg-gray-100 dark:bg-gray-900 px-2">
        <TopMenu
        
          menuItems={topMenuItems}
          className="w-full bg-gray-100 dark:bg-gray-900 text-background"
          itemClassName="text-sm font-semibold text-foreground hover:text-foreground"
        />
      </div>

      {/* Banner */}
      <section className="bg-background mx-auto">
        <div className="block">
          <BannerCarousel
            items={heroBannerSlides}
            showDots={false}
            loop
            className="overflow-hidden w-full"
          />
        </div>
      </section>

      {/* Products */}
      <section id="promocoes" className="bg-background py-12 sm:py-14">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4">
          {featuredProducts.length > 0 && (
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground">
              Produtos em promoção
            </h2>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.length > 0 &&
              featuredProducts.map((product) => {
                const salePrice = (product.priceCents ?? 0) / 100;
                const originalPrice =
                  originalPrices[product.id] ?? salePrice * 1.12;

                return (
                  <ProductCard
                    key={product.id}
                    imageUrl={product.coverImageUrl ?? product.imageUrls[0]}
                    title={product.name}
                    price={originalPrice}
                    showDeal
                    dealPrice={salePrice}
                    dealEndsWithIn={dealDeadline}
                    installments={3}
                    installmentValue={salePrice / 3}
                    ctaLabel="Tenho interesse"
                    onAddToCart={() => router.push(`/produto/${product.slug}`)}
                  />
                );
              })}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section id="categorias" className="bg-background pb-14 sm:pb-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground">
            Compre por categoria
          </h2>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const categoryKey = category.id ?? category.slug ?? category.name;
              return (
                <CategoryCard
                  key={categoryKey}
                  name={category.name}
                  iconName={category.iconName}
                  onSeeCategory={() =>
                    router.push(
                      `/pesquisa/${category.slug}?search=${category.name}`
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="promocoes" className="bg-background ">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground">
            Todos os produtos
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const salePrice = (product.priceCents ?? 0) / 100;
              const originalPrice =
                originalPrices[product.id] ?? salePrice * 1.12;

              return (
                <ProductCard
                  key={product.id}
                  imageUrl={product.coverImageUrl ?? product.imageUrls[0]}
                  title={product.name}
                  price={originalPrice}
                  dealPrice={salePrice}
                  installments={3}
                  installmentValue={salePrice / 3}
                  ctaLabel="Tenho interesse"
                  onAddToCart={() => router.push(`/produto/${product.slug}`)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Images */}
      <section id="promocoes" className="bg-background py-12 sm:py-14">
        <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4">
          {promotionalItems.length > 0 && (
            <h2 className="text-xl sm:text-2xl font-black uppercase text-foreground">
              Confira nossas Promoções
            </h2>
          )}
          <div className="gap-6  grid grid-cols-2 sm:grid-cols-3 ">
            {promotionalItems.length > 0 &&
              promotionalItems.map((promo) => (
                <ImageLink
                  key={promo.id}
                  width={promo.width}
                  height={promo.height}
                  imgUrl={promo.imageUrl}
                  alt={
                    promo.altText ??
                    promo.promotionalText ??
                    "Banner promocional"
                  }
                  onSeePromotion={() =>
                    sendMessageWhatsapp(
                      `Olá, tenho interesse na promoção: ${
                        promo.promotionalText ??
                        promo.altText ??
                        "sem descrição"
                      }`,
                      "5531985187963"
                    )
                  }
                />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
