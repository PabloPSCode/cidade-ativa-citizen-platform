"use client";
import { useCallback, useState } from "react";
import CartCardItem, { type Product } from "./components/CartItem";

interface CartCardProps {
  products: Product[];
  emptyCartCardMessage?: string;
}

export default function CartCard({
  products,
  emptyCartCardMessage,
}: CartCardProps) {
  const [cartItems, setCartCardItems] = useState<Product[]>(products);
  const uniqueCartCardItems = Array.from(
    new Map(cartItems.map((item) => [item.id, item])).values()
  );

  const handleDecreaseQuantity = useCallback((productId: string) => {
    setCartCardItems((prev) => {
      return prev.map((item) => {
        if (item.id === productId && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        } else {
          return item;
        }
      });
    });
  }, []);

  const handleIncreaseQuantity = useCallback((productId: string) => {
    setCartCardItems((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        } else {
          return item;
        }
      });
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartCardItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  return (
    <div className="flex flex-col bg-bg-card border border-bg-card shadow-sm text-foreground/70 p-4 rounded-md">
      <span className="mb-4 text-foreground">Seu carrinho</span>
      <div className="flex flex-col text-foreground/70 sm:pr-1 max-h-[50vh] overflow-y-auto">
        {uniqueCartCardItems.length > 0 ? (
          uniqueCartCardItems.map((product) => (
            <CartCardItem
              key={product.id}
              product={product}
              onDecreaseQuantity={() => handleDecreaseQuantity(product.id)}
              onIncreaseQuantity={() => handleIncreaseQuantity(product.id)}
              onRemoveItem={() => handleRemoveItem(product.id)}
            />
          ))
        ) : (
          <div className="rounded-xl border p-4 text-foreground">
            <p className="text-sm font-medium">Ops!</p>
            <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
              {emptyCartCardMessage || "Seu carrinho está vazio."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

