import Image from "next/image";
import type { ICategory, IProduct, MediaImage } from "../../types";
import { sendMessageWhatsapp } from "../../utils/helpers.ts";

const normalizeMenuSegment = (value: string) => {
  const trimmed = value.trim().replace(/^#+/, "");
  const withoutPrefix = trimmed.replace(/^pneus?\s+/i, "");
  const base = withoutPrefix || trimmed;
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const buildSearchHref = (category: ICategory, subLabel?: string) => {
  const categorySlug = category.slug || normalizeMenuSegment(category.name);
  const queryLabel = subLabel ?? category.name;
  const subSlug = subLabel ? normalizeMenuSegment(subLabel) : "";
  const slug = subSlug ? `${categorySlug}-${subSlug}` : categorySlug;
  return `/pesquisa/${slug}?search=${encodeURIComponent(queryLabel)}`;
};

export const buildTopMenuItems = (categories: ICategory[]) =>
  categories.map((category) => ({
    label: category.name,
    href: buildSearchHref(category),
  }));

export const buildFeaturedProducts = (products: IProduct[]) =>
  products
    .filter((product) => product.isPromotional)
    .sort((a, b) => (a.featuredPosition ?? 0) - (b.featuredPosition ?? 0));

export const originalPrices: Record<string, number> = {
  "prod-scorpion-at": 799.99,
  "prod-terrains": 789.99,
  "prod-michelin-primacy": 809.99,
  "prod-dunlop": 779.99,
};

export const dealDeadline = new Date(
  Date.now() + 23 * 60 * 60 * 1000
).toISOString();

const buildBannerSlides = (
  mediaItems: MediaImage[],
  heightClassName: string
) => {
  const bannerItems = mediaItems.filter((item) => item.imageType === "banner");
  return bannerItems.map((banner, index) => (
    <div
      key={banner.id}
      onClick={() =>
        sendMessageWhatsapp(
          `Olá, tenho interesse na promoção: ${banner.altText ?? "sem descrição"}`,
          "5531985187963"
        )
      }
      className={`relative block ${heightClassName} cursor-pointer`}
    >
      <Image
        src={banner.imageUrl}
        alt={banner.altText ?? "Banner promocional"}
        fill
        className="object-cover"
        priority={index + 1 === 1}
        sizes="100vw"
      />
      {banner.promotionalText ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center">
          <div className="rounded-2xl bg-black/45 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4 lg:px-8 lg:py-5">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white drop-shadow">
              {banner.promotionalText}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  ));
};

export const buildStandardBannerSlides = (mediaItems: MediaImage[]) =>
  buildBannerSlides(mediaItems, "h-[220px] sm:h-[320px] md:h-[380px]");
export const buildHeroBannerSlides = (mediaItems: MediaImage[]) =>
  buildBannerSlides(mediaItems, "min-h-[60vh]");
