/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "iili.io",
      },
      {
        protocol: "https",
        hostname: "rgpneus.com.br",
      },
      {
        protocol: "https",
        hostname: "acdn-us.mitiendanube.com",
      },
      {
        protocol: "https",
        hostname: "lojamorenarosa.vtexassets.com",
      },
      {
        protocol: "https",
        hostname: "clubemorenarosa.vtexassets.com",
      },
      {
        protocol: "https",
        hostname: "www.camisariacolombo.com.br",
      },
    ],
  },
};

module.exports = nextConfig;
