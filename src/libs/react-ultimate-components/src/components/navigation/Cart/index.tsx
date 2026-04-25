"use client";

import { formatBRL } from "../../../utils/format";
import { clsx } from "clsx";
import { useCallback, useMemo, useState } from "react";
import CartItem, { type Product } from "./components/CartItem";

interface CartProps {
  onToggleOpen: () => void;
  isOpen?: boolean;
  products: Product[];
  emptyCartMessage?: string;
  onProceedToCheckout?: () => void;
  checkoutButtonText?: string;
  keepBuyingButtonText?: string;
}

export default function Cart({
  onToggleOpen,
  isOpen = false,
  products,
  emptyCartMessage,
  onProceedToCheckout,
  checkoutButtonText,
  keepBuyingButtonText,
}: CartProps) {
  const [cartItems, setCartItems] = useState<Product[]>(products);
  const uniqueCartItems = Array.from(
    new Map(cartItems.map((item) => [item.id, item])).values()
  );

  const handleDecreaseQuantity = useCallback((productId: string) => {
    setCartItems((prev) => {
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
    setCartItems((prev) => {
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
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-300 z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onToggleOpen}
      />

      <nav
        className={clsx(
          "fixed top-0 right-0 z-50 flex h-screen w-full max-w-full flex-col bg-background/95 text-foreground shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-500 ease-out sm:border-l sm:border-white/10 sm:px-6 sm:py-8",
          "px-4 py-6 gap-5 sm:gap-6",
          "sm:w-[28rem]",
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/60 text-xs">
              Carrinho
            </p>
            <h2 className="text-sm sm:text-lg font-semibold leading-tight mt-2">
              Seus itens
            </h2>
          </div>
          <button
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            onClick={onToggleOpen}
          >
            Fechar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-foreground/70 sm:pr-1">
          {uniqueCartItems.length > 0 ? (
            uniqueCartItems.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                onDecreaseQuantity={() => handleDecreaseQuantity(product.id)}
                onIncreaseQuantity={() => handleIncreaseQuantity(product.id)}
                onRemoveItem={() => handleRemoveItem(product.id)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-foreground">
              <p className="text-sm font-medium">Ops!</p>
              <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                {emptyCartMessage || "Seu carrinho está vazio."}
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex justify-end">
          <h3 className="text-sm sm:text-base font-semibold text-foreground/80">Total: {formatBRL(totalAmount)}</h3>
        </div>

        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center font-medium px-4 py-3 rounded-lg bg-primary-500 cursor-pointer text-white hover:bg-primary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={onProceedToCheckout}
            disabled={!products.length}
          >
            {checkoutButtonText || "Finalizar compra"}
          </button>
          <button
            className="w-full font-medium px-4 py-3"
            onClick={onToggleOpen}
          >
            {keepBuyingButtonText || "Continuar comprando"}
          </button>
        </div>
      </nav>
    </>
  );
}

