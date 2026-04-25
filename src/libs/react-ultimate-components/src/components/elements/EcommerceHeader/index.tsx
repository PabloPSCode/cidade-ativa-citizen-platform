"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import {
  HeartIcon,
  ListIcon,
  MapPinIcon,
  ShoppingCartIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CepPopOverInput from "./components/CepPopOverInput";
import SearchInput, { type SearchInputProps } from "./components/SearchInput";

/**
 * Sizes & Density (mesmo padrão do SystemHeader)
 */
type Size = "sm" | "md" | "lg";
type Density = "comfortable" | "compact";

/* ========================= Root (igual ao SystemHeader) ========================= */

export interface EcommerceHeaderRootProps
  extends React.HTMLAttributes<HTMLElement> {
  size?: Size;
  density?: Density;
  bordered?: boolean;
  sticky?: boolean;
}

function Root({
  size = "md",
  bordered = true,
  sticky = true,
  className,
  children,
  ...rest
}: EcommerceHeaderRootProps) {
  return (
    <div
      className={clsx(
        bordered && "border-b border-border/60",
        "w-full flex justify-center bg-background",
        sticky &&
          "sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:backdrop-blur",
        className
      )}
    >
      <header
        {...rest}
        className={clsx("w-full max-w-7xl text-card-foreground")}
      >
        <div
          className={clsx(
            "relative mx-auto flex w-full items-center justify-between gap-3 px-3",
            size === "sm" && "h-14",
            size === "md" && "h-16",
            size === "lg" && "h-20"
          )}
        >
          {children}
        </div>
      </header>
    </div>
  );
}


/* ========================= Rails (Left / Center / Right) =========================
   Mantém o padrão do SystemHeader: Left e Right ocupam espaço; Center é absoluto,
   centralizado matematicamente para permitir barra de busca larga.
*/

export interface LeftContainerProps {
  className?: string;
  children?: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
  onOpenMenu?: () => void;
}
function LeftContainer({
  className,
  children,
  logoAlt,
  logoSrc,
  onOpenMenu,
  ...rest
}: LeftContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isMobileListener = () => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 720) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
  };

  useEffect(() => {
    isMobileListener();
  }, []);
  return (
    <div
      {...rest}
      className={clsx(
        "min-w-0 flex flex-1 items-center gap-1.5 sm:gap-2 relative",
        className
      )}
    >
      {isMobile ? (
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-5 sm:gap-2"
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={logoAlt || "Logo"}
              className="block h-7 w-auto sm:h-8 lg:h-9 select-none"
              width={160}
              height={48}
            />
          ) : null}
          <ListIcon />
        </button>
      ) : (
        <div className="w-full flex items-center gap-1.5 sm:gap-2">
          {children}
        </div>
      )}
    </div>
  );
}


export interface RightContainerProps {
  className?: string;
  children?: React.ReactNode;
}
function RightContainer({
  className,
  children,
  ...rest
}: RightContainerProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "min-w-0 flex flex-1 items-center justify-end gap-1.5 sm:gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}


/* ================================== Logo ================================== */
export interface LogoProps {
  src: string;
  alt: string;
  className?: string;
}
function Logo({ src, alt, className }: LogoProps) { return (
  <Image
    src={src}
    alt={alt}
    className={clsx("block h-7 w-auto sm:h-8 lg:h-9 select-none", className)}
    width={160}
    height={48}
  />
); }


/* ============================ Search (reuso) ============================ */
export interface EcommerceSearchProps extends SearchInputProps {
  onSearch?: (term: string) => void;
}
function EcommerceSearch({
  onSearch,
  onKeyDown,
  ...rest
}: EcommerceSearchProps) {
  return (
    <div className="relative w-full">
      <SearchInput
        {...rest}
        className={clsx(
          "w-full rounded-xl border border-border/60 bg-background",
          "h-10 sm:h-11"
        )}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value ?? "";
            onSearch?.(value);
          }
        }}
      />
    </div>
  );
}


/* ============================== Icon Buttons ============================== */

function IconButton({ badge, className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    badge?: number;
    "aria-label": string;
  }) {
  return (
    <button
      {...rest}
      className={clsx(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-lg",
        className
      )}
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive-500 px-1.5 text-[10px] font-semibold text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}


export interface FavoritesButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}
function FavoritesButton({
  count = 0,
  ...rest
}: FavoritesButtonProps) { return (
  <IconButton aria-label="Favoritos" badge={count} {...rest}>
    <HeartIcon className="h-5 w-5" />
  </IconButton>
); }


export interface CartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}
function CartButton({ count = 0, ...rest }: CartButtonProps) { return (
  <IconButton aria-label="Carrinho" badge={count} {...rest}>
    <ShoppingCartIcon className="h-5 w-5" />
  </IconButton>
); }


interface InformCepButtonProps {
  onClick?: () => void;
}

function InformCepButton({ onClick }: InformCepButtonProps) {
  return (
    <button
      aria-label="Informar CEP"
      className="flex items-center gap-1 w-fit"
      onClick={onClick}
    >
      <span className=" text-xs font-medium whitespace-nowrap">
        Informe o cep
      </span>
      <MapPinIcon
        className="h-5 w-5 sm:w-6 sm:h-6 text-destructive-500"
        weight="fill"
      />
    </button>
  );
}


/* ============================== User Menu (variação auth) ============================== */

export interface UserMenuProps {
  isAuthenticated?: boolean;
  userName?: string;
  greetingText?: string; // "Olá," etc
  signInLabel?: string; // "Entre"
  signUpLabel?: string; // "Cadastre-se"
  onSignIn?: () => void;
  onSignUp?: () => void;
  onMyAccount?: () => void;
  onSignOut?: () => void;
}

function UserMenu({
  isAuthenticated = false,
  userName = "Visitante",
  greetingText = "Olá,",
  signInLabel = "Entre",
  signUpLabel = "Cadastre-se",
  onSignIn,
  onSignUp,
  onMyAccount,
  onSignOut,
}: UserMenuProps) {
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className={clsx(
          "hidden sm:flex items-center gap-2 rounded-full bg-background px-3 py-1.5",
          "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
        )}
      >
        <UserIcon className="h-6 w-6 text-muted-foreground" />
        <div className="flex flex-col leading-tight text-left">
          <span className="text-xs text-muted-foreground">{greetingText}</span>
          <span className="text-xs">
            <span
              className="cursor-pointer font-semibold hover:underline"
              onClick={onSignIn}
            >
              {signInLabel}
            </span>{" "}
            ou{" "}
            <span
              className="cursor-pointer font-semibold hover:underline"
              onClick={onSignUp}
            >
              {signUpLabel}
            </span>
          </span>
        </div>
      </button>
    );
  }

  // autenticado
  return (
    <div
      className={clsx(
        "hidden sm:flex items-center gap-2 rounded-full bg-background px-3 py-1.5",
        "hover:bg-primary/10"
      )}
    >
      <UserIcon className="h-6 w-6 text-muted-foreground" />
      <div className="flex flex-col leading-tight text-left">
        <span className="text-xs text-muted-foreground">{greetingText}</span>
        <button
          className="text-xs font-semibold hover:underline text-left"
          onClick={onMyAccount}
        >
          {userName}
        </button>
      </div>
      <button
        className="ml-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] hover:bg-primary/10"
        onClick={onSignOut}
        title="Sair"
      >
        <SignOutIcon className="h-4 w-4" /> Sair
      </button>
    </div>
  );
}


/* ============================== Namespace export ============================== */

type EcommerceHeaderExtras = {
  Root: typeof Root;
  LeftContainer: typeof LeftContainer;
  RightContainer: typeof RightContainer;
  Logo: typeof Logo;
  Search: typeof EcommerceSearch;
  CepPopOverInput: typeof CepPopOverInput;
  FavoritesButton: typeof FavoritesButton;
  CartButton: typeof CartButton;
  InformCepButton: typeof InformCepButton;
  UserMenu: typeof UserMenu;
};

function EcommerceHeader(props: EcommerceHeaderRootProps) {
  return <Root {...props} />;
}

type EcommerceHeaderComponent = typeof EcommerceHeader & EcommerceHeaderExtras;

const EcommerceHeaderComponent: EcommerceHeaderComponent = Object.assign(EcommerceHeader, {
  Root,
  LeftContainer,
  RightContainer,
  Logo,
  Search: EcommerceSearch,
  CepPopOverInput,
  FavoritesButton,
  CartButton,
  InformCepButton,
  UserMenu,
});

export default EcommerceHeaderComponent;
