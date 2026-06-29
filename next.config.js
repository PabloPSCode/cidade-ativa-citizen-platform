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
        hostname: "lh3.googleusercontent.com",
      },
      // Imagens enviadas para o Firebase Cloud Storage pela API.
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  // Proxy reverso para o backend. O browser fala apenas com `/api/backend/*`
  // (mesma origem) e o Next encaminha para a URL real, lida do env server-only
  // `API_URL`. Assim a URL do backend nunca é embutida no bundle do client.
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:3337"}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
