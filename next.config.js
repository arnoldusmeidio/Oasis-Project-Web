const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "*.googleusercontent.com",
            port: "",
            pathname: "**",
         },
         {
            protocol: "https",
            hostname: "picsum.photos",
         },
         {
            protocol: "https",
            hostname: "images.unsplash.com",
         },
         {
            protocol: "https",
            hostname: "plus.unsplash.com",
         },
         {
            protocol: "https",
            hostname: "res.cloudinary.com",
         },
      ],
   },
   env: {
      _next_intl_trailing_slash: "", // Set this to the required string value if specified in your documentation
   },
};

module.exports = withNextIntl(nextConfig);
