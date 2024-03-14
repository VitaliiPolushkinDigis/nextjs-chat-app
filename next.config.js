/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["fakestoreapi.com"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
