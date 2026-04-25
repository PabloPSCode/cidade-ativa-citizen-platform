/* eslint-disable react/no-unescaped-entities */
"use client";

import clsx from "clsx";

type Aspect = "16:9" | "4:3" | "1:1" | "21:9";

function aspectToPadding(aspect: Aspect): string {
  const [w, h] = aspect.split(":").map(Number);
  return `${(h / w) * 100}%`;
}

// Extrai @-19.81,-43.17,16.68z
function parseAtCoords(url: string) {
  // exemplo: https://www.google.com/maps/@-19.8100231,-43.1708134,16.68z?...
  const m = url.match(/\/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
  if (!m) return null;
  const [, lat, lng, zoom] = m;
  return { lat: Number(lat), lng: Number(lng), zoom: Math.round(Number(zoom)) };
}

function buildEmbeddableUrl({
  raw,
  address,
  apiKey,
  zoom,
}: {
  raw?: string;
  address?: string;
  apiKey?: string;
  zoom?: number;
}) {
  // 1) Se já é um URL de /embed (copiado do "Incorporar um mapa"), usa direto
  if (raw && /\/maps\/embed/.test(raw)) return raw;

  // 2) Se veio um URL de navegação comum do Maps, tenta extrair @lat,lng,zoom
  if (raw && /google\.com\/maps\//.test(raw)) {
    const parsed = parseAtCoords(raw);
    if (parsed) {
      const z = zoom ?? parsed.zoom ?? 15;
      if (apiKey) {
        // Melhor experiência (controle de zoom preciso)
        return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(
          apiKey
        )}&center=${parsed.lat},${parsed.lng}&zoom=${z}`;
      }
      // Sem API key → fallback simples com q=lat,lng
      return `https://www.google.com/maps?q=${parsed.lat},${parsed.lng}&z=${z}&output=embed`;
    }
  }

  // 3) Se endereço foi informado (ou como fallback)
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      address
    )}&output=embed`;
  }

  // 4) Último recurso: se passou um raw qualquer, tenta adicionar output=embed
  if (raw && !raw.includes("output=embed")) {
    const url = new URL(raw);
    url.searchParams.set("output", "embed");
    return url.toString();
  }

  return raw;
}

export interface GoogleMapsRenderProps {
  /** URL de incorporação OU URL comum do Maps (o componente tenta normalizar). */
  embedUrl?: string;
  /** Endereço/lat,lng para montar um URL simples (usado se `embedUrl` não vier). */
  address?: string;
  /** (Opcional) Chave da Maps Embed API — habilita zoom/mode precisos. */
  apiKey?: string;
  /** Força o zoom quando possível (melhor com `apiKey`). */
  zoom?: number;

  /** Título do iframe para acessibilidade. */
  title?: string;
  /** Rótulo visível acima do mapa. */
  label?: string;
  /** Proporção do container. */
  aspect?: Aspect;
  /** Raio de borda do container. */
  borderRadius?: number;
  /** Classe extra do container externo. */
  containerClassName?: string;
  /** Altura mínima (segurança para telas estreitas). */
  minHeight?: number;
}

export default function GoogleMapsRender({
  embedUrl,
  address,
  apiKey,
  zoom,
  title = "Google Map",
  label,
  aspect = "16:9",
  borderRadius = 12,
  containerClassName,
  minHeight = 220,
}: GoogleMapsRenderProps) {
  const src = buildEmbeddableUrl({ raw: embedUrl, address, apiKey, zoom });

  if (!src) {
    return (
      <div
        className={clsx(
          "w-full bg-background text-foreground border border-foreground/15 rounded-md p-4",
          containerClassName
        )}
      >
        <p className="text-sm">
          <strong>GoogleMapsRender:</strong> informe <code>embedUrl</code> (pode
          ser o link comum do Google Maps) ou um endereço <code>address</code> exemplo: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP".
        </p>
      </div>
    );
  }

  return (
    <section className={clsx("min-w-xs", containerClassName)}>
      {label && (
        <h3 className="mb-2 text-xs sm:text-sm font-medium text-foreground">
          {label}
        </h3>
      )}
      <div
        className={clsx(
          "relative w-full overflow-hidden bg-background border border-foreground/10 shadow-sm"
        )}
        style={{ borderRadius, minHeight }}
      >
        <div style={{ paddingTop: aspectToPadding(aspect) }} />
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, borderRadius }}
        />
      </div>
    </section>
  );
}

