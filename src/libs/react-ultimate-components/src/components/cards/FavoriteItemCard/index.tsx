"use client";
import { formatBRL } from "../../../utils/format";
import { HeartBreakIcon, ShareIcon } from "@phosphor-icons/react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  shareUrl?: string;
}

interface FavoriteItemCardProps {
  product: Product;
  onRemoveItem: (productId: string) => void;
  onShareItem: (shareUrl: string) => void;
}

export default function FavoriteItemCard({
  product,
  onRemoveItem,
  onShareItem,
}: FavoriteItemCardProps) {
  return (
    <div className="w-full flex items-center gap-4 text-background border border-border-card bg-bg-card rounded-md shadow-sm p-3 mb-4">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={56}
        height={56}
        className="w-14 aspect-square rounded-md object-cover"
      />
      <span className="flex-1 text-xs sm:text-sm text-foreground line-clamp-2 overflow-ellipsis">
        {product.name}
      </span>

      <span className="flex-1 text-xs sm:text-sm text-foreground line-clamp-2 overflow-ellipsis">
        {formatBRL(product.price)}
      </span>

      <button
        className="text-xs sm:text-sm text-destructive-600 hover:underline"
        onClick={() => onRemoveItem(product.id)}
      >
        <HeartBreakIcon className="h-5 w-5 text-foreground-500" />
      </button>
      <button
        className="text-xs sm:text-sm text-destructive-600 hover:underline"
        onClick={() => onShareItem(product.shareUrl!)}
      >
        <ShareIcon className="h-5 w-5 text-foreground-500" />
      </button>
    </div>
  );
}
