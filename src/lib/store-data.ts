import type {
  ICategory,
  IProduct,
  MediaImage,
  StoreData,
  StorePayload,
} from "../types";

const STORE_SOURCES = {
  skatestore: {
    storeData:
      "https://gist.githubusercontent.com/PabloPSCode/b892723de5a7d08ce140892074d9637a/raw/skate_store_store-data.json",
    products:
      "https://gist.githubusercontent.com/PabloPSCode/4786b34c7732eea951a50e07795fd70d/raw/skate_store_products.json",
    categories:
      "https://gist.githubusercontent.com/PabloPSCode/a5efafcd3b6b05db94d5350e65feac73/raw/skate_store_categories.json",
    mediaItems:
      "https://gist.githubusercontent.com/PabloPSCode/d027d7ecc17f91b7836c2656df705aaa/raw/skate_store_media.json",
  },
  tirestore: {
    storeData:
      "https://gist.githubusercontent.com/PabloPSCode/51993c1319c04e71e0dd15bb0909e480/raw/tire_store_store-data.json",
    products:
      "https://gist.githubusercontent.com/PabloPSCode/f19340ab55615b78b809e595ffcdf990/raw/tire_store_products.json",
    categories:
      "https://gist.githubusercontent.com/PabloPSCode/94c8d1377420b82e4c54493c887d2e06/raw/tire_store_categories.json",
    mediaItems:
      "https://gist.githubusercontent.com/PabloPSCode/ceae3c4f397c72f0828ecd7bb45c13a7/raw/tire_store_media.json",
  },
  womanstore: {
    storeData:
      "https://gist.githubusercontent.com/PabloPSCode/708a5e93ac6006421d7f6ad2d9db549b/raw/woman_store_store-data.json",
    products:
      "https://gist.githubusercontent.com/PabloPSCode/08eb9b8ecd02aa19df2b855ad369e402/raw/woman_store_products.json",
    categories:
      "https://gist.githubusercontent.com/PabloPSCode/294e457b84dbd03325e2ec55aea972cb/raw/woman_store_categories.json",
    mediaItems:
      "https://gist.githubusercontent.com/PabloPSCode/127d9132e834db826d291db6477feef3/raw/woman_store_media.json",
  },
  manstore: {
    storeData:
      "https://gist.githubusercontent.com/PabloPSCode/701a55248dcf778eec895bbdda1cf3a7/raw/man_store_store-data.json",
    products:
      "https://gist.githubusercontent.com/PabloPSCode/45e0adf27b800a40455921aba8bcd4dd/raw/man_store_products.json",
    categories:
      "https://gist.githubusercontent.com/PabloPSCode/4b58e14f679aab241fbbf2038c4567fe/raw/man_store_categories.json",
    mediaItems:
      "https://gist.githubusercontent.com/PabloPSCode/16b28b4861d574410aa7d77ad31c5ebd/raw/man_store_media.json",
  },
} as const;

type StoreSlug = keyof typeof STORE_SOURCES;

const DEFAULT_STORE_SLUG: StoreSlug = "manstore";

const DEFAULT_STORE_DATA: StoreData = {
  store: {
    name: "MostraLoja",
    slogan: null,
    operation: {
      mondayToFriday: null,
      saturday: null,
      sunday: null,
    },
    deliveryMethods: {
      pickOnStore: null,
      motoBoy: null,
      ownVehicle: null,
    },
    companyLogoUrl: null,
  },
  design: {
    primaryColor: "#2700dd",
    secondaryColor: "#f4f4f4",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  legal: {
    cnpj: null,
  },
  address: {
    street: null,
    city: null,
    state: null,
    zipCode: null,
  },
  contact: {
    phone: null,
    email: null,
    whatsapp: null,
  },
  social_medias: {
    instagram: null,
    facebook: null,
  },
};

const resolveStoreSlug = (hostname?: string | null): StoreSlug => {
  if (!hostname) return DEFAULT_STORE_SLUG;
  const normalized = hostname.toLowerCase().split(":")[0];
  const withoutWww = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;
  const candidate = withoutWww.split(".")[0];
  return (
    candidate in STORE_SOURCES ? candidate : DEFAULT_STORE_SLUG
  ) as StoreSlug;
};

const normalizeList = <T>(data: unknown, keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of keys) {
      const value = record[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
};

const mergeStoreData = (data?: StoreData | null): StoreData => ({
  store: {
    ...DEFAULT_STORE_DATA.store,
    ...(data?.store ?? {}),
    operation: {
      ...DEFAULT_STORE_DATA.store.operation,
      ...(data?.store?.operation ?? {}),
    },
    deliveryMethods: {
      ...DEFAULT_STORE_DATA.store.deliveryMethods,
      ...(data?.store?.deliveryMethods ?? {}),
    },
  },
  design: {
    ...DEFAULT_STORE_DATA.design,
    ...(data?.design ?? {}),
  },
  legal: {
    ...DEFAULT_STORE_DATA.legal,
    ...(data?.legal ?? {}),
  },
  address: {
    ...DEFAULT_STORE_DATA.address,
    ...(data?.address ?? {}),
  },
  contact: {
    ...DEFAULT_STORE_DATA.contact,
    ...(data?.contact ?? {}),
  },
  social_medias: {
    ...DEFAULT_STORE_DATA.social_medias,
    ...(data?.social_medias ?? {}),
  },
});

const normalizeStoreData = (data: unknown): StoreData => {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (record.store && typeof record.store === "object") {
      return mergeStoreData(record as unknown as StoreData);
    }
    if (record.storeData && typeof record.storeData === "object") {
      return mergeStoreData(record.storeData as StoreData);
    }
  }
  return mergeStoreData(null);
};

const safeFetchJson = async (url: string) => {
  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
};

export const getStoreByDomain = async (
  hostname?: string | null
): Promise<StorePayload> => {
  const storeSlug = resolveStoreSlug(hostname);
  const sources = STORE_SOURCES[storeSlug];

  const [storeResponse, productsResponse, categoriesResponse, mediaResponse] =
    await Promise.all([
      safeFetchJson(sources.storeData),
      safeFetchJson(sources.products),
      safeFetchJson(sources.categories),
      safeFetchJson(sources.mediaItems),
    ]);

  const storeData = normalizeStoreData(storeResponse);
  const products = normalizeList<IProduct>(productsResponse, ["products"]);
  const categories = normalizeList<ICategory>(categoriesResponse, [
    "categories",
  ]);
  const mediaItems = normalizeList<MediaImage>(mediaResponse, [
    "mediaItems",
    "media",
  ]);

  return {
    storeData,
    products,
    categories,
    mediaItems,
  };
};
