"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";
import SocialRibbon, {
  type SocialRibbonProps,
} from "./components/SocialRibbon";

/**
 * Footer – composto por três áreas empilhadas (flex-col):
 * 1) Top (grid responsivo 2–6 colunas) – links, contatos, etc.
 * 2) Social (faixa de redes sociais) – usa SocialRibbon por padrão ou children.
 * 3) Bottom (rodapé final) – copyright, CNPJ, selos, etc.
 *
 * Todos os nós aceitam className para customização.
 */

type Columns = 2 | 3 | 4 | 5 | 6;

/* ================================= Root ================================= */

export interface FooterRootProps extends React.HTMLAttributes<HTMLElement> {
  /** Cor de fundo / contexto vem do design system (suporta dark mode). */
  bordered?: boolean;
}

function Root({
  bordered = true,
  className,
  children,
  ...rest
}: FooterRootProps) {
  return (
    <footer
      {...rest}
      className={clsx(
        // Container pai em colunas
        "w-full flex flex-col items-center bg-background text-foreground",
        bordered && "border-t border-foreground/10 dark:border-border-card",
        className
      )}
    >
      {children}
    </footer>
  );
}

/* ================================ Top (Grid) ================================ */

export interface TopGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Número máximo de colunas no desktop (2 a 6). Default: 4 */
  columns?: Columns;
  /** Conteúdo do grid (Coluna ou qualquer children) */
  children?: React.ReactNode;
  /** Adiciona borda inferior */
  bordered?: boolean;
}

function Top({
  columns = 4,
  bordered = false,
  className,
  children,
  ...rest
}: TopGridProps) {
  // mapeia columns -> classes tailwind na quebra lg
  const colClass =
    columns === 6
      ? "lg:grid-cols-6"
      : columns === 5
      ? "lg:grid-cols-5"
      : columns === 4
      ? "lg:grid-cols-4"
      : columns === 3
      ? "lg:grid-cols-3"
      : "lg:grid-cols-2";

  return (
    <div
      {...rest}
      className={clsx(
        "mx-auto w-full max-w-7xl px-4 sm:px-6",
        "py-8 sm:py-10",
        "grid grid-cols-1 gap-6 sm:grid-cols-2",
        bordered && "border-t border-foreground/10 dark:border-border-card",
        colClass,
        className
      )}
    >
      {children}
    </div>
  );
}

/* ================================ Column ================================= */

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título da coluna (opcional) */
  title?: string;
  /** Itens simples (texto + link). Use children para conteúdo livre. */
  items?: Array<{
    label: string;
    href?: string;
    target?: string;
    imageUrl?: string;
  }>;
}

function Column({ title, items, className, children, ...rest }: ColumnProps) {
  return (
    <div
      {...rest}
      className={clsx("flex flex-col items-center sm:items-start", className)}
    >
      {title && (
        <h4 className="mb-3 text-xs sm:text-sm font-semibold tracking-wide text-foreground opacity-80">
          {title}
        </h4>
      )}
      {items && items.length > 0 ? (
        <ul className="sm:space-y-2 text-sm text-center sm:text-left">
          {items.map((it, idx) => (
            <li key={idx}>
              {it.href ? (
                <a
                  href={it.href}
                  target={it.target}
                  className="text-foreground/80 opacity-80 text-xs sm:text-sm hover:text-foreground underline-offset-4 hover:underline"
                >
                  {it.label}
                </a>
              ) : it.label ? (
                <span className="text-foreground/70 text-xs sm:text-sm opacity-80">
                  {it.label}
                </span>
              ) : it.imageUrl ? (
                <Image
                  src={it.imageUrl}
                  alt={it.label}
                  width={120}
                  height={90}
                  className="max-w-full h-auto -mt-8 -ml-4"
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}

/* =============================== Social Row =============================== */

export interface SocialRowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Partial<SocialRibbonProps> {
  /** Se children for passado, ele substitui o SocialRibbon. */
  bordered?: boolean;
  children?: React.ReactNode;
  title?: string;
}

function SocialRow({
  items,
  iconsClassName,
  iconsWeight = "regular",
  title,
  bordered,
  className,
  children,
  ...rest
}: SocialRowProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "w-full",
        "bg-muted/20",
        bordered && "border-t border-foreground/10 dark:border-border-card",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl  justify-between gap-4 px-4 py-4 sm:px-6 flex-col items-center sm:flex-row">
        {/* Conteúdo à esquerda (opcional) passado como children */}
        <div className="min-w-0 flex-1">
          {children ? (
            children
          ) : items ? (
            <SocialRibbon
              items={items}
              iconsClassName={clsx("text-primary-500", iconsClassName)}
              iconsWeight={iconsWeight}
              title={title}
            />
          ) : null}
        </div>
        {/* Espaço para selos/apps, se desejar (pode ser sobrescrito por style externo) */}
      </div>
    </div>
  );
}

/* ================================ Bottom ================================= */

export interface BottomProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Conteúdo livre: copyright, CNPJ, selos, etc. */
  children?: React.ReactNode;
  bordered?: boolean;
}

function Bottom({ className, children, bordered, ...rest }: BottomProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "w-full",
        bordered && "border-t border-foreground/10 dark:border-border-card",
        className
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 text-sm sm:px-6 flex flex-col items-center sm:flex-row">
        {children}
      </div>
    </div>
  );
}

/* ============================== Namespace ============================== */

type FooterExtras = {
  Root: typeof Root;
  Top: typeof Top;
  Column: typeof Column;
  SocialRow: typeof SocialRow;
  Bottom: typeof Bottom;
};

function Footer(props: FooterRootProps) {
  return <Root {...props} />;
}

type FooterComponent = typeof Footer & FooterExtras;

const FooterComponent: FooterComponent = Object.assign(Footer, {
  Root,
  Top,
  Column,
  SocialRow,
  Bottom,
});

export default FooterComponent;
export {
  Bottom as FooterBottom,
  Column as FooterColumn,
  Root as FooterRoot,
  SocialRow as FooterSocialRow,
  Top as FooterTop,
};
