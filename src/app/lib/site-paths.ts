export const getSiteRoutePrefix = (pathname: string) => {
  const cleanPath = pathname.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments[0] === "sites" && segments[1]) {
    return `/sites/${segments[1]}`;
  }

  return "";
};

export const buildScopedHref = (pathname: string, href: string) => {
  const sitePrefix = getSiteRoutePrefix(pathname);

  if (!sitePrefix) {
    return href;
  }

  if (href === "/") {
    return sitePrefix;
  }

  if (href.startsWith("/#")) {
    return `${sitePrefix}${href.slice(1)}`;
  }

  if (href.startsWith("/")) {
    return `${sitePrefix}${href}`;
  }

  return `${sitePrefix}/${href}`;
};
