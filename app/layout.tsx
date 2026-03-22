import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketa.app'

export function generateViewport(): Viewport {
  return {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ticketa - Event Ticketing Without the Drama',
    template: '%s | Ticketa',
  },
  description: 'The next-gen event ticketing platform with rotating QR security, instant mobile money payouts, and zero-scalping technology.',
  applicationName: 'Ticketa',
  authors: [{ name: 'Ticketa Team' }],
  generator: 'v0.app',
  keywords: ['ticketing', 'events', 'africa', 'mobile money', 'secure tickets', 'QR security'],
  referrer: 'origin-when-cross-origin',
  creator: 'Ticketa',
  publisher: 'Ticketa',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/images/ticketa-logo.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
    apple: '/images/ticketa-logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Ticketa - Secure Event Ticketing',
    description: 'The next-gen event ticketing platform with rotating QR security and instant mobile money payouts.',
    url: siteUrl,
    siteName: 'Ticketa',
    images: [
      {
        url: '/images/ticketa-logo.png', // Using the primary logo as requested
        width: 1200,
        height: 630,
        alt: 'Ticketa - Secure Ticketing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ticketa - Secure Event Ticketing',
    description: 'The next-gen event ticketing platform with rotating QR security and instant mobile money payouts.',
    images: ['/images/ticketa-logo.png'],
    creator: '@ticketa',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ticketa",
              "url": "https://ticketa.app",
              "logo": "https://ticketa.app/images/ticketa-logo.png",
              "description": "Secure event ticketing platform with rotating QR security and mobile money payouts.",
              "sameAs": [
                "https://twitter.com/ticketa",
                "https://linkedin.com/company/ticketa",
                "https://instagram.com/ticketa"
              ]
            })
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
