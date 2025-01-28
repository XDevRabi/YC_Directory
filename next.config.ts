import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // To allow images from any domain
      },
    ],
  },
  experimental: { // since ppr is an experimental feature right now
    ppr: "incremental", // to enable incremental build
  },
  devIndicators: { // to enable additional feature to visualize build activity on ppr. 
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

export default nextConfig;
