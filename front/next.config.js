/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // path: "localhost",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/api/**',
      },
    ],
  },
  // env: {
  //   API_URL: 'http://localhost:4000',
  //   CLIENT_URL: 'http://localhost:3000',
  // },
};

module.exports = nextConfig;
