/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern Next.js 15 experimental features
  experimental: {
    // Latest performance optimizations
    optimizePackageImports: ['lucide-react', '@radix-ui/react-avatar'],
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'INP', 'TTFB'],
    
    // Latest Next.js 15 features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Modern caching - adjusted for development
    staleTimes: process.env.NODE_ENV === 'production' ? {
      dynamic: 30,
      static: 180,
    } : {
      dynamic: 0,
      static: 0,
    },
  },

  // Modern compiler options
  compiler: {
    // Remove console in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
    
    // Modern React optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-test']
    } : false,
  },

  // Modern image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 365 : 0, // Adjusted for dev
    dangerouslyAllowSVG: false,
    unoptimized: process.env.NODE_ENV === 'development',
    
    // Modern responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Modern build optimizations
  productionBrowserSourceMaps: false,
  generateEtags: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Modern compression
  compress: true,

  // Modern webpack 5 optimizations
  webpack: (config, { dev, isServer }) => {
    // Skip production optimizations in development
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        
        // Modern minification
        minimize: true,
        
        // Tree shaking
        usedExports: true,
        sideEffects: false,
        
        // Modern code splitting
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 30000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
              enforce: true,
            },
            
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              maxSize: 20000,
            },
            
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              maxSize: 15000,
            },
          },
        },
      }
    }

    // Modern module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }

    // Modern file handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Modern headers with latest security and performance
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          // Modern security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },

    ]

    // Add caching headers only in production
    if (process.env.NODE_ENV === 'production') {
      headers.push(
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/fonts/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        }
      )
    } else {
      // Development-specific headers to prevent caching
      headers[0].headers.push(
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        }
      )
    }

    return headers
  },

  // Add rewrite rules for OAuth2 callback
  async rewrites() {
    return [
      {
        source: '/oauth2/authorization/:path*',
        destination: 'http://localhost:8000/oauth2/authorization/:path*',
      },
      {
        source: '/login/oauth2/code/:path*',
        destination: 'http://localhost:8000/login/oauth2/code/:path*',
      },
      {
        source: '/transport/schedule/:path*',
        destination: 'http://localhost:8000/transport/schedule/:path*',
      }

    ]

    // Add caching headers only in production
    if (process.env.NODE_ENV === 'production') {
      headers.push(
        {
          source: '/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/fonts/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        }
      )
    } else {
      // Development-specific headers to prevent caching
      headers[0].headers.push(
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        }
      )
    }

    return headers
  },
}

module.exports = nextConfig 