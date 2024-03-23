/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
