"use client";

import clsx from "clsx";
import Link from "next/link";
import React, { useMemo } from "react";

export interface BreadcrumbProps {
  /**
   * Caminho atual (ex.: "/home/job/job-details").
   * Se não for informado, o componente usa `window.location.pathname`.
   */
  currentPath?: string;
  /** Rótulo do item raiz (primeiro nível). */
  rootLabel?: string;
  /**
   * Mapeia segmentos de URL para rótulos amigáveis.
   * Ex.: `{ "job-details": "Job Details" }`
   */
  labelMap?: Record<string, string>;
  /**
   * Função para transformar rótulos gerados a partir da URL.
   * Útil para capitalizar, remover hífens etc.
   */
  transformLabel?: (segment: string) => string;
  /** Separador visual entre os itens (padrão: "/"). */
  separator?: React.ReactNode;
  /** Classe opcional aplicada ao contêiner externo. */
  className?: string;
}

/**
 * # Breadcrumb
 * Trilha de navegação baseada no endereço atual (pathname).
 * - **Responsivo** e com **dark mode** (usa tokens `text-foreground`, etc.).
 * - **Acessível**: navegação semântica com `<nav aria-label="breadcrumb">` e `<ol>`.
 * - **Navegação real**: cada item (exceto o atual) é um link `<a href="/...">`.
 */
export default function Breadcrumb({
  currentPath,
  rootLabel = "Home",
  labelMap,
  transformLabel = defaultTransform,
  separator = "/",
  className,
}: BreadcrumbProps) {
  const path =
    typeof window !== "undefined"
      ? currentPath ?? window.location.pathname
      : currentPath ?? "/";

  const items = useMemo(() => {
    // normaliza e remove query/hash
    const clean = path.split("?")[0].split("#")[0];
    const segments = clean
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);

    // monta itens cumulativos para href
    const acc: { href: string; key: string; label: string }[] = [];
    segments.forEach((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const key = seg.toLowerCase();
      const label = labelMap?.[key] ?? transformLabel(seg);
      acc.push({ href, key, label });
    });
    return acc;
  }, [path, labelMap, transformLabel]);

  return (
    <nav aria-label="breadcrumb" className={clsx("w-full", className)}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs sm:text-sm">
        {/* Raiz */}
        <li className="shrink-0">
          {items.length ? (
            <Link
              href="/"
              className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline transition"
            >
              {rootLabel}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{rootLabel}</span>
          )}
        </li>

        {/* Demais níveis */}
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={it.href}>
              {/* Separador */}
              <li
                aria-hidden="true"
                className="px-1 text-foreground/40 select-none"
              >
                {separator}
              </li>

              <li className="shrink-0">
                {isLast ? (
                  <span className="font-semibold text-foreground">
                    {it.label}
                  </span>
                ) : (
                  <Link
                    href={it.href}
                    className="text-foreground/70 hover:text-foreground underline-offset-4 hover:underline transition"
                  >
                    {it.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}


/** Transforma "job-details" -> "Job Details" */
function defaultTransform(segment: string) {
  return segment
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
