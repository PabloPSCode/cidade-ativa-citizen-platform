import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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

export default nextConfig;
