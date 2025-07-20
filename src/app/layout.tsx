import type { Metadata, Viewport } from "next"
import { Open_Sans, Poppins, Roboto } from "next/font/google"
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CacheCleanup } from "@/components/providers/cache-cleanup"
import { AuthProvider } from "@/hooks/auth/use-auth"
import { ModalProvider } from "@/stores/ui/modal-context"

import "@/styles/globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-opensans',
  preload: true,
})

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
})

const roboto = Roboto({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500'],
  preload: true,
})

export const metadata: Metadata = {
  title: "SST Transport Services | Campus Bus Schedules",
  description: "Access SST campus bus schedules and track real-time bus locations. Stay updated with departure times, routes, and transportation information.",
  keywords: ["SST", "transport", "bus", "schedule", "campus", "real-time", "tracking"],
  authors: [{ name: "SST Transport Team" }],
  creator: "SST Transport Services",
  publisher: "SST Campus Services",
  
  // Modern meta optimizations
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://localhost:3002' : 'http://localhost:3002'),
  alternates: {
    canonical: '/',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'SST Transport Services - Campus Bus Schedules',
    description: 'Access SST campus bus schedules and track real-time bus locations',
    siteName: 'SST Transport Services',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SST Transport Services - Campus Bus Schedules',
    description: 'Access SST campus bus schedules and track real-time bus locations',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' },
  ],
}

// Client-side wrapper component for providers that need client context
function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${poppins.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SST Transport" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${openSans.className} antialiased min-h-screen bg-light-blue dark:bg-[#161616]`}>
        <CacheCleanup>
        <ErrorBoundary>
          <ThemeProvider>
            <ModalProvider>
              <ClientProviders>
                {children}
              </ClientProviders>
            </ModalProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </CacheCleanup>
      </body>
    </html>
  )
}