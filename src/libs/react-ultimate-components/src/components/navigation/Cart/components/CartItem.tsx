"use client";

import { formatBRL } from "../../../../utils/format";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartItemProps {
  product: Product;
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartItem({
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}: CartItemProps) {
  const calProductTotal = (price: number, quantity: number) => {
    const totalPrice = price * quantity;
    return formatBRL(totalPrice);
  };

  return (
    <div className="w-full flex items-center gap-4 border bg-background/50 border-foreground/10 rounded-md p-4">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={56}
        height={56}
        className="w-14 aspect-square rounded-md object-cover"
      />
      <div className="w-full flex flex-col gap-2">
        <span className="text-xs sm:text-sm text-foreground">
          {product.name}
        </span>
        <div className="w-full flex gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => onDecreaseQuantity(product.id)}>
              {" "}
              <MinusCircleIcon className="h-5 w-5 text-foreground font-bold" />
            </button>
            <span className="text-xs sm:text-sm text-foreground">
              {product.quantity}
            </span>
            <button onClick={() => onIncreaseQuantity(product.id)}>
              {" "}
              <PlusCircleIcon className="h-5 w-5 text-foreground font-bold" />
            </button>
          </div>
          <span className="text-xs sm:text-sm text-foreground/80">
            {calProductTotal(product.price, product.quantity)}
          </span>
        </div>
      </div>
      <button
        className="text-xs sm:text-sm text-destructive-600 hover:underline"
        onClick={() => onRemoveItem(product.id)}
      >
        <TrashIcon className="h-5 w-5 text-red-500" />
      </button>
    </div>
  );
}
