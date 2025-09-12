/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const path = require("path");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

module.exports = withNextIntl(nextConfig);
