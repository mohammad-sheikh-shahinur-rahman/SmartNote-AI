
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1749068316640.cluster-nzwlpk54dvagsxetkvxzbvslyi.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;

    