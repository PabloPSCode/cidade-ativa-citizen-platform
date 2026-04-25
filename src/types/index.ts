export type ID = string;
export type ISODateString = string;
export type IProductStatus = "draft" | "active" | "archived";

export interface ICategory {
  id?: ID;
  companyId?: ID;
  name: string;
  slug: string;
  iconName?: string;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface IProduct {
  id: ID;
  companyId: ID;

  categoryId?: ID | null;

  name: string;
  slug: string; // unique per company
  description?: string;

  status: IProductStatus;

  priceCents: number; // store as integer to avoid float issues
  currency?: "BRL";

  // Inventory / availability (optional for vitrine MVP)
  isAvailable?: boolean;

  // Images
  coverImageUrl?: string;
  imageUrls: string[]; // additional images

  // Promotion (optional)
  isPromotional?: boolean;
  featuredPosition?: number;
  shareUrl?: string;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type MediaImageType = "banner" | "promotional" | "logo";

export interface MediaImage {
  id: ID;
  companyId: ID;
  imageUrl: string;
  altText?: string;
  promotionalText?: string;
  linkUrl?: string;
  imageType: MediaImageType;
  width: number;
  height: number;
}

export interface StoreOperation {
  mondayToFriday?: string | null;
  saturday?: string | null;
  sunday?: string | null;
}

export interface StoreDeliveryMethods {
  pickOnStore?: boolean | null;
  motoBoy?: boolean | null;
  ownVehicle?: boolean | null;
}

export interface StoreIdentity {
  name: string;
  slogan?: string | null;
  operation: StoreOperation;
  deliveryMethods: StoreDeliveryMethods;
  companyLogoUrl?: string | null;
}

export interface StoreDesign {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontFamily?: string | null;
}

export interface StoreLegal {
  cnpj?: string | null;
}

export interface StoreAddress {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface StoreContact {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export interface StoreSocialMedias {
  instagram?: string | null;
  facebook?: string | null;
}

export interface StoreData {
  store: StoreIdentity;
  design?: StoreDesign;
  legal?: StoreLegal;
  address?: StoreAddress;
  contact?: StoreContact;
  social_medias?: StoreSocialMedias;
}

export interface StorePayload {
  storeData: StoreData;
  categories: ICategory[];
  products: IProduct[];
  mediaItems: MediaImage[];
}
