import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const STORE_SUBDOMAINS = new Set(["skatestore", "tirestore" , "womanstore", "manstore"]);

const resolveStoreFromHost = (host: string | null) => {
  if (!host) return null;
  const normalized = host.toLowerCase().split(":")[0];
  const withoutWww = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;
  const candidate = withoutWww.split(".")[0];
  return STORE_SUBDOMAINS.has(candidate) ? candidate : null;
};

const resolveStoreFromPath = (pathname: string) => {
  const parts = pathname.split("/");
  if (parts[1] !== "sites") return null;
  const candidate = parts[2];
  return STORE_SUBDOMAINS.has(candidate) ? candidate : null;
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const store =
    resolveStoreFromHost(request.headers.get("host")) ??
    resolveStoreFromPath(url.pathname);
  if (!store) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-store-slug", store);

  if (url.pathname.startsWith("/sites/")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  url.pathname =
    url.pathname === "/"
      ? `/sites/${store}`
      : `/sites/${store}${url.pathname}`;

  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
