/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/twitter",
        destination: "https://twitter.com/airoadmapgen",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/2rMV53UqYB",
        permanent: true,
      },
    ];
  },
  experimental: {
    typedRoutes: true,
  },
  output: "standalone",
};

export default nextConfig;
