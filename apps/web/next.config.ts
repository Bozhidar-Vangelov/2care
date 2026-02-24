import type { NextConfig } from "next";

const API_URL = process.env["API_URL"] ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ─── Images ──────────────────────────────────────────────────────────────
  // Allow next/image to optimise images from external origins used by the app.
  images: {
    remotePatterns: [
      // Supabase Storage — avatars & baby-photos buckets.
      // The hostname format is "<project-ref>.supabase.co".
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Supabase Storage via custom domain (self-hosted / Pro plan).
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
      // DiceBear — procedurally-generated avatar fallbacks.
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/7.x/**",
      },
    ],
    // Serve modern formats wherever the browser supports them.
    formats: ["image/avif", "image/webp"],
  },

  // ─── API Proxy (rewrites) ─────────────────────────────────────────────────
  // Forward /api/v1/* to the NestJS backend so client components never need
  // to know the API origin — they just call "/api/v1/...".
  //
  // Benefits:
  //  ✓ No CORS headers needed for browser-side fetches
  //  ✓ API_URL stays server-only (never sent to the client bundle)
  //  ✓ Works seamlessly across dev / staging / prod by swapping API_URL
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_URL}/api/v1/:path*`,
      },
    ];
  },

  // ─── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: ["camera=()", "microphone=()", "geolocation=()", "payment=()", "usb=()"].join(
              ", ",
            ),
          },
        ],
      },
      // Service worker must be served with the correct Content-Type and must
      // never be cached by the browser — always fetch the latest version.
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },

  // ─── Bundle Optimisation ─────────────────────────────────────────────────
  experimental: {
    // Tree-shake these packages at the module level — dramatically reduces
    // client bundle size for lucide-react (used by every shadcn component)
    // and date-fns (large utility library used only partially).
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  // ─── Dev Logging ─────────────────────────────────────────────────────────
  logging: {
    fetches: {
      // Show all fetch requests in the terminal during development, including
      // cache hits, so it's easy to verify caching behaviour.
      fullUrl: true,
    },
  },
};

export default nextConfig;
