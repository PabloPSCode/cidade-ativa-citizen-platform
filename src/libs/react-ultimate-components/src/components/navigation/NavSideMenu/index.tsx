"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ---------- types ---------- */
interface SubItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}
interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
}

export interface NavSideMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Array de elementos do menu */
  menuItems: MenuItem[];
  /** Caminho ativo (para destacar o item correspondente) */
  activePath?: string;
  /** Largura do menu quando recolhido (px) */
  collapsedWidth?: number;
  /** Largura do menu quando expandido (px) */
  expandedWidth?: number;
  /** Classe CSS para destacar o item ativo */
  highlightClassName?: string;
  /** Classe CSS adicional para o menu */
  className?: string;
  /** Altura do cabeçalho acima do menu (px). Usado se stickyUnderHeader=true */
  headerHeight?: number; // px
  /** Se true, o menu fica sticky abaixo do cabeçalho. Default: true */
  stickyUnderHeader?: boolean;
  /** Conteúdo adicional a ser renderizado no topo do menu (ex: campo de busca) */
  children?: React.ReactNode;
  /** Breakpoint (px) para colapso automático */
  collapseAt?: number;
  /** Chamado quando o usuário clica no botão de expandir em telas estreitas. */
  onExpand?: () => void;
}

/* ---------- utilities ---------- */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setMatches("matches" in e ? e.matches : (e as MediaQueryList).matches);
    setMatches(mql.matches);
    // Support old/new APIs
    mql.addEventListener
      ? mql.addEventListener("change", handler)
      : mql.addListener(handler);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", handler)
        : mql.removeListener(handler);
    };
  }, [query]);
  return matches;
};

/* ---------- tiny portal label to avoid clipping when collapsed ---------- */
function CollapsedHoverLabel({ anchorRef, text, show }: {
  anchorRef: React.RefObject<HTMLElement | null>;
  text: string;
  show: boolean;
}) {
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  useEffect(() => {
    if (!show) return;
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.top + r.height / 2, left: r.right + 8 });
  }, [show, anchorRef]);
  if (!show) return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        transform: "translateY(-50%)",
        zIndex: 9999,
      }}
      className={clsx(
        "whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-lg",
        "bg-foreground text-background dark:bg-foreground dark:text-background"
      )}
    >
      {text}
    </div>,
    document.body
  );
}


/* ---------- component ---------- */
export default function NavSideMenu({
  menuItems,
  activePath,
  collapsedWidth = 80,
  expandedWidth = 320,
  highlightClassName,
  className,
  headerHeight = 64,
  stickyUnderHeader = true,
  children,
  collapseAt = 1024, // <= this controls automatic collapse
  ...rest
}: NavSideMenuProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const isNarrow = useMediaQuery(`(max-width: ${collapseAt}px)`);
  const [manualExpand, setManualExpand] = useState(false);

  // If screen becomes wide, clear manual expand
  useEffect(() => {
    if (!isNarrow) setManualExpand(false);
  }, [isNarrow]);

  const collapsed = isNarrow && !manualExpand;

  useEffect(() => {
    if (!activePath) return;
    const found = menuItems.find((m) =>
      (m.subItems ?? []).some((s) => s.href === activePath)
    );
    if (found) setOpenKey(found.label);
  }, [activePath, menuItems]);

  const railW = collapsed ? collapsedWidth : expandedWidth;
  const isActive = (href?: string) => (href ? activePath === href : false);
  const highlight =
    highlightClassName ??
    "flex items-center border-l border-foreground/50 font rounded-none bg-foreground/5 rounded-r-md";

  return (
    <nav
      aria-label="Menu lateral"
      {...rest}
      className={clsx(
        "relative",
        "overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-gutter-stable",
        "flex-shrink-0 select-none",
        stickyUnderHeader && "sticky",
        "bg-foreground/5",
        "backdrop-blur-sm border-r border-foreground/10",
        "text-foreground",
        "pb-12",
        "transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        width: railW,
        height: `calc(100vh - ${headerHeight}px)`,
        top: stickyUnderHeader ? headerHeight : undefined,
      }}
    >
      {children && !collapsed && <div className="px-3 mt-3">{children}</div>}

      <ul>
        {menuItems.map((item) => {
          const hasChildren = !!item.subItems?.length;
          const opened = openKey === item.label;

          const btnRef = useRef<HTMLButtonElement>(null);
          const [hoverRoot, setHoverRoot] = useState(false);

          const RootButton = (
            <>
              <button
                ref={btnRef}
                type="button"
                onClick={() =>
                  hasChildren
                    ? setOpenKey((k) => (k === item.label ? null : item.label))
                    : item.href && (window.location.href = item.href)
                }
                onMouseEnter={() => setHoverRoot(true)}
                onMouseLeave={() => setHoverRoot(false)}
                aria-expanded={hasChildren ? opened : undefined}
                className={clsx(
                  "group relative w-full px-2 sm:px-3 transition-colors",
                  "flex justify-center sm:justify-start items-center gap-3",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
                  "hover:bg-foreground/5 rounded-md",
                  isActive(item.href) && !hasChildren && highlight
                )}
              >
                <div className="h-10 sm:h-11 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center text-foreground">
                    {item.icon}
                  </span>
                  <span
                    className={clsx(
                      collapsed
                        ? "hidden"
                        : "flex-1 text-left text-sm font-medium truncate"
                    )}
                  >
                    {item.label}
                  </span>
                  {hasChildren && !collapsed && (
                    <span className="inline-flex items-center pr-1 text-foreground/70">
                      {opened ? (
                        <CaretDownIcon size={14} weight="bold" />
                      ) : (
                        <CaretRightIcon size={14} weight="bold" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* tooltip via portal when collapsed */}
              {collapsed && (
                <CollapsedHoverLabel
                  anchorRef={btnRef}
                  text={item.label}
                  show={hoverRoot}
                />
              )}
            </>
          );

          return (
            <li key={item.label} className="px-2 sm:px-3 py-1">
              {RootButton}

              {hasChildren && (
                <div
                  className={clsx(
                    "overflow-y-hidden overflow-x-hidden transition-[max-height,opacity] duration-300 ease-out",
                    opened ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <ul className={clsx("pl-5", collapsed && "pl-3")}>
                    {item.subItems!.map((sub) => {
                      const active = isActive(sub.href);
                      const linkRef = useRef<HTMLAnchorElement>(null);
                      const [hoverSub, setHoverSub] = useState(false);

                      return (
                        <li key={sub.label} className="py-0.5">
                          <a
                            ref={linkRef}
                            href={sub.href}
                            onMouseEnter={() => setHoverSub(true)}
                            onMouseLeave={() => setHoverSub(false)}
                            className={clsx(
                              collapsed
                                ? "h-6"
                                : " gap-3 min-h-10 px-3 border-l border-foreground/20",
                              "relative group flex items-centermb-1",
                              "text-sm text-foreground/80 hover:text-foreground/90 hover:font-medium",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
                              active && highlight
                            )}
                          >
                            {collapsed ? (
                              <CaretRightIcon />
                            ) : (
                              <span className={clsx(collapsed && "opacity-0")}>
                                {sub.label}
                              </span>
                            )}
                          </a>

                          {collapsed && (
                            <CollapsedHoverLabel
                              anchorRef={linkRef}
                              text={sub.label}
                              show={hoverSub}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

