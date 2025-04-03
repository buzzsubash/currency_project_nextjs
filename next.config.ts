/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // Enable static HTML export
  images: {
    domains: [
      'cdnjs.cloudflare.com',
      'cdn.corporatefinanceinstitute.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
        pathname: '/ajax/libs/flag-icon-css/**',
      },
    ],
    unoptimized: true, // Required for static export with images
  },
  // GitHub Pages deployment config
  basePath: process.env.GITHUB_ACTIONS ? '/currency-converter' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/currency-converter' : '',
};

module.exports = nextConfig;