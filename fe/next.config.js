/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-1517365830460-955ce3ccd263",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/player/:walletAddress",
        destination: "/player/:walletAddress/votes-cast",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
