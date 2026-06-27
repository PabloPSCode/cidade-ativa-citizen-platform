"use client";

import { CaretRightIcon, HouseLineIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    getCitizenById,
    getCitizenLegalActionByIds,
} from "../constants/citizen-legal";

interface BreadcrumbProps {
  className?: string;
}

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

const segmentLabels: Record<string, string> = {
  acoes: "Ações",
  "cadastrar-situacao": "Cadastrar solicitação",
  "cidadao-legal": "Cidadão Legal",
  "minhas-solicitacoes": "Minhas solicitações",
  pesquisa: "Pesquisa",
  produto: "Produto",
  solicitacoes: "Solicitações",
};

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const formatSegmentLabel = (segment: string) =>
  safeDecode(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const resolveSegmentLabel = (
  segment: string,
  index: number,
  segments: string[]
) => {
  if (segments[0] === "solicitacoes" && index === 1) {
    return `Solicitação ${formatSegmentLabel(segment)}`;
  }

  if (segments[0] === "cidadao-legal") {
    if (segment === "cidadao-legal") {
      return segmentLabels[segment];
    }

    if (index === 1) {
      return getCitizenById(segment)?.fullName ?? formatSegmentLabel(segment);
    }

    if (segment === "acoes") {
      return segmentLabels[segment];
    }

    if (index === 3) {
      const citizenId = segments[1] ?? "";
      const action = getCitizenLegalActionByIds(citizenId, segment);

      return action
        ? `Ação ${action.protocolNumber}`
        : formatSegmentLabel(segment);
    }
  }

  return segmentLabels[segment] ?? formatSegmentLabel(segment);
};

const buildBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const path = pathname.split("?")[0].split("#")[0];
  const rawSegments = path.split("/").filter(Boolean);

  if (rawSegments.length === 0) {
    return [{ href: "/", label: "Início", current: true }];
  }

  const isStoreRoute = rawSegments[0] === "sites" && Boolean(rawSegments[1]);
  const routePrefix = isStoreRoute ? rawSegments.slice(0, 2) : [];
  const visibleSegments = isStoreRoute ? rawSegments.slice(2) : rawSegments;
  const rootHref = isStoreRoute ? `/${routePrefix.join("/")}` : "/";
  const items: BreadcrumbItem[] = [{ href: rootHref, label: "Início" }];
  const segmentAccumulator = [...routePrefix];

  visibleSegments.forEach((segment, index) => {
    segmentAccumulator.push(segment);
    items.push({
      href: `/${segmentAccumulator.join("/")}`,
      label: resolveSegmentLabel(segment, index, visibleSegments),
    });
  });

  items[items.length - 1].current = true;

  return items;
};

export default function Breadcrumb({ className }: BreadcrumbProps) {
  const pathname = usePathname();
  const items = buildBreadcrumbItems(pathname);

  return (
    <div
      className={clsx(
        "sticky top-[7.75rem] z-40 border-b border-border-card bg-white md:top-20",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-foreground/60">
            {items.map((item, index) => (
              <li key={item.href} className="flex min-w-0 items-center gap-2">
                {index > 0 ? (
                  <CaretRightIcon
                    size={14}
                    weight="bold"
                    className="shrink-0 text-foreground/35"
                    aria-hidden="true"
                  />
                ) : null}

                {item.current ? (
                  <span className="inline-flex min-w-0 items-center gap-2 rounded-sm bg-foreground/5 px-3 py-1.5 font-medium text-foreground dark:bg-white/5">
                    {index === 0 ? (
                      <HouseLineIcon
                        size={15}
                        weight="fill"
                        className="shrink-0"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex min-w-0 items-center gap-2 rounded-sm px-3 py-1.5 font-medium transition hover:bg-foreground/5 hover:text-foreground dark:hover:bg-white/5"
                  >
                    {index === 0 ? (
                      <HouseLineIcon
                        size={15}
                        weight="fill"
                        className="shrink-0"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
