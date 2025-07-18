import type { Metadata, Viewport } from "next"
import { Open_Sans } from "next/font/google"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"
import { CacheCleanup } from "@/components/cache-cleanup"
import AdminRoute from "@/components/admin-route"
import ClientLayout from "./client-layout"
import "./globals.css"
import { ModalProvider } from "@/contexts/modal-context"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-opensans',
  preload: true,
})

export const metadata: Metadata = {
  title: "SST Transport Services | Campus Bus Schedules",
  description: "Access SST campus bus schedules and track real-time bus locations. Stay updated with departure times, routes, and transportation information.",
  keywords: ["SST", "transport", "bus", "schedule", "campus", "real-time", "tracking"],
  authors: [{ name: "SST Transport Team" }],
  creator: "SST Transport Services",
  publisher: "SST Campus Services",
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SST Transport',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'SST Transport',
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className={`${openSans.className} antialiased min-h-screen bg-light-blue dark:bg-[#161616]`}>
        <ErrorBoundary>
          <ThemeProvider>
            <ModalProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ModalProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <CacheCleanup />
      </body>
    </html>
  )
}