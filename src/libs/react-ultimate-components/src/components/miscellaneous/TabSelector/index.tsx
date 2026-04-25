"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import clsx from "clsx";
import React, { useEffect, useId, useMemo, useState } from "react";

export interface TabSelectorProps {
  /** Lista de abas (rótulos). */
  tabs: string[];
  /** Aba inicialmente/externamente selecionada. */
  selectedTab: string;
  /** Conteúdo renderizado para a aba ativa. */
  activeTabContent?: (tab: string) => React.ReactNode;

  /** Callback disparado ao trocar de aba. */
  onTabChange?: (tab: string) => void;

  /** Classes para o container externo. */
  className?: string;
  /** Classes extras aplicadas a **cada** botão de aba. */
  tabClassName?: string;
}

/**
 * TabSelector — seletor de abas responsivo (padrões BR).
 * - Visual consistente com o design system (bg/bg-card, border, dark-mode).
 * - Acessível: `role="tablist"`, `role="tab"`, `role="tabpanel"`, ARIA e roving tabIndex.
 * - Responsivo: barra de abas com `overflow-x-auto` em telas pequenas.
 */
export default function TabSelector({
  tabs,
  selectedTab,
  activeTabContent,
  onTabChange,
  className,
  tabClassName,
}: TabSelectorProps) {
  const baseId = useId();
  const safeTabs = useMemo(() => tabs ?? [], [tabs]);

  const [active, setActive] = useState(
    safeTabs.includes(selectedTab) ? selectedTab : safeTabs[0]
  );

  // Sincroniza quando selectedTab externo mudar
  useEffect(() => {
    if (safeTabs.includes(selectedTab)) setActive(selectedTab);
  }, [selectedTab, safeTabs]);

  if (!safeTabs.length) return null;

  const setActiveTab = (tab: string) => {
    setActive(tab);
    onTabChange?.(tab);
  };

  const activeIndex = Math.max(0, safeTabs.indexOf(active));

  // Navegação por teclado (setas) no tablist
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (activeIndex + 1) % safeTabs.length
        : (activeIndex - 1 + safeTabs.length) % safeTabs.length;
    const nextTab = safeTabs[next];
    setActiveTab(nextTab);
    const btn = document.getElementById(`${baseId}-tab-${next}`);
    btn?.focus();
  };

  return (
    <div
      className={clsx(
        "w-full rounded-md border border-border-card bg-bg-card text-foreground",
        "p-3 sm:p-4",
        className
      )}
    >
      {/* Tablist */}
      <div
        role="tablist"
        aria-label="Seletor de abas"
        onKeyDown={onKeyDown}
        className={clsx(
          "relative -mb-px flex items-center gap-1 sm:gap-2",
          "overflow-x-auto no-scrollbar border-b border-border-card"
        )}
      >
        {safeTabs.map((tab, idx) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              id={`${baseId}-tab-${idx}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${idx}`}
              tabIndex={isActive ? 0 : -1}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "whitespace-nowrap rounded-t-md px-3 sm:px-4 py-2",
                "text-xs sm:text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40",
                isActive
                  ? "text-foreground border-b-2 border-primary-600 bg-background"
                  : "text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5 border-b-2 border-transparent",
                tabClassName
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Painéis */}
      {safeTabs.map((tab, idx) => {
        const isActive = tab === active;
        return (
          <div
            key={`${tab}-panel`}
            id={`${baseId}-panel-${idx}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${idx}`}
            hidden={!isActive}
            className="pt-3 sm:pt-4"
          >
            {isActive && activeTabContent?.(tab)}
          </div>
        );
      })}
    </div>
  );
}

