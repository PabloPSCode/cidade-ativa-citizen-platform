"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react"; // @phosphor-icons/react
import clsx from "clsx";
import Image from "next/image";

type Size = "sm" | "md" | "lg";

export interface LandingHeaderRootProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Tamanho do header */
  size?: Size;
  /** Adiciona borda inferior */
  bordered?: boolean;
  /** Classe adicional */
  sticky?: boolean;
  /** Largura máxima do container central (ex.: max-w-7xl) */
  maxWidthClassName?: string;
}

function Root({
  size = "md",
  bordered = false,
  sticky = true,
  className,
  children,
  ...rest
}: LandingHeaderRootProps) {
  return (
    <div
      className={clsx(
        "w-full flex justify-center bg-background text-background z-40 py-1",
        sticky && "sticky top-0",
        bordered && "border-b border-foreground/10",
        className
      )}
    >
      <header
        {...rest}
        className={clsx("w-full text-foreground", "px-3 max-w-7xl")}
      >
        <div
          className={clsx(
            "mx-auto flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between",
            size === "sm" && "md:h-14",
            size === "md" && "md:h-16",
            size === "lg" && "md:h-20"
          )}
        >
          {children}
        </div>
      </header>
    </div>
  );
}


/** Left / Center / Right rails */
export interface LeftProps {
  className?: string;
  children?: React.ReactNode;
}
function Left({ className, children, ...rest }: LeftProps) { return (
  <div {...rest} className={clsx("min-w-0 flex items-center gap-2", className)}>
    {children}
  </div>
); }


export interface CenterProps {
  className?: string;
  children?: React.ReactNode;
}
function Center({ className, children, ...rest }: CenterProps) { return (
  <nav
    {...rest}
    className={clsx(
      "flex w-full items-center justify-center md:min-w-0 md:flex-1 md:w-auto",
      className
    )}
    aria-label="Navegação principal"
  >
    {children}
  </nav>
); }


export interface RightProps {
  className?: string;
  children?: React.ReactNode;
}
function Right({ className, children, ...rest }: RightProps) { return (
  <div
    {...rest}
    className={clsx("absolute right-6 top-4 md:relative md:top-0 md:right-0 md:flex min-w-0 flex items-center justify-end gap-2", className)}
  >
    {children}
  </div>
); }


/** Logo */
export interface LogoProps {
  src: string;
  alt: string;
  className?: string;
}
function Logo({ src, alt, className }: LogoProps) { return (
  <Image
    src={src}
    alt={alt}
    width={160}
    height={48}
    className={clsx("block h-7 w-auto sm:h-8 lg:h-9 select-none", className)}
  />
); }


/** Nav + Nav.Item para links do centro */
type NavProps = { className?: string; children?: React.ReactNode };

type NavItemProps = {
  href?: string;
  target?: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
};

function Nav({ className, children }: NavProps) {
  return (
    <ul className={clsx("flex items-center gap-6 overflow-x-auto w-full", className)}>
      {children}
    </ul>
  );
}

function NavItem({ href = "#", target, onClick, children, active }: NavItemProps) {
  return (
    <li>
      <a
        href={href}
        target={target}
        onClick={onClick}
        className={clsx(
          "text-sm font-medium  whitespace-nowrap text-left",
          "text-foreground/90 hover:text-foreground",
          active && "text-primary"
        )}
      >
        {children}
      </a>
    </li>
  );
}

type NavComponent = typeof Nav & { Item: typeof NavItem };

const NavComponent: NavComponent = Object.assign(Nav, { Item: NavItem });

/** CTA (qualquer nó) */

interface CTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

function CTA({ className, label, ...rest }: CTAProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg",
        "bg-primary-500 font-primary hover:opacity-90",
        "px-4 py-2 text-xs sm:text-sm font-semibold text-white",
        className
      )}
    >
      {label}
    </button>
  );
}


/** Mobile: botão que mostra/oculta o menu */
function MobileMenuToggle({ open, onToggle, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open?: boolean;
    onToggle?: (open: boolean) => void;
  }) { return (
  <button
    aria-label="Abrir/fechar menu"
    onClick={() => onToggle?.(!open)}
    {...rest}
    className={clsx(
      "flex md:invisible h-9 w-9 md:w-0 md:h-0 items-center justify-center rounded-lg",
      "hover:bg-primary/10",
      className
    )}
  >
    {open ? <XIcon className="h-5 w-5" /> : <ListIcon className="h-5 w-5" />}
  </button>
); }


/** Mobile: painel simples com links + CTA */
function MobileMenuPanel({ open, children, cta }: {
  open?: boolean;
  children?: React.ReactNode;
  cta?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="md:hidden absolute left-0 right-0 top-full z-30 w-full border-b border-foreground/10 bg-background transition py-4">
      <div className="mx-auto max-w-7xl px-3 py-3">
        <ul className="flex flex-col items-center gap-3">{children}</ul>
        {cta && <div className="mt-3">{cta}</div>}
      </div>
    </div>
  );
}


type LandingHeaderExtras = {
  Root: typeof Root;
  Left: typeof Left;
  Center: typeof Center;
  Right: typeof Right;
  Logo: typeof Logo;
  Nav: typeof NavComponent;
  CTA: typeof CTA;
  MobileMenuToggle: typeof MobileMenuToggle;
  MobileMenuPanel: typeof MobileMenuPanel;
};

function LandingHeader(props: LandingHeaderRootProps) {
  return <Root {...props} />;
}

type LandingHeaderComponent = typeof LandingHeader & LandingHeaderExtras;

const LandingHeaderComponent: LandingHeaderComponent = Object.assign(LandingHeader, {
  Root,
  Left,
  Center,
  Right,
  Logo,
  Nav: NavComponent,
  CTA,
  MobileMenuToggle,
  MobileMenuPanel,
});

export default LandingHeaderComponent;
