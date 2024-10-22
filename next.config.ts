import { type NextConfig } from "next";

const config: NextConfig = {
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
};

export default config;
