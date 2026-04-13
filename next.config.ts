import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // 【ここが重要】両方の設定を組み合わせて、jsdomを完全に外部扱いにする
  serverExternalPackages: ["jsdom"],
  transpilePackages: ["jsdom"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "avataaars.io" },
      { protocol: "https", hostname: "w1980.blob.core.windows.net" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
