import type { NextConfig } from "next";

// When deployed as a GitHub *project* page (username.github.io/repo-name),
// assets must be served from a /repo-name subpath. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to "/<repo-name>" at build time. Local dev and a
// GitHub *user* page (username.github.io) leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
