/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    //disable: process.env.NODE_ENV === "development",
  },
});

module.exports = {
  images: {
    domains: ['localhost:5000'] //alow images from this domains
  },
}
