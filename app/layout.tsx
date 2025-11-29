import './styles/globals.css'
import { ReactNode } from 'react'
import ClientNavbar from '../components/ClientNavbar'
import Footer from '../components/Footer'
import GlobalErrorHandler from '../components/GlobalErrorHandler'
import { Providers } from "./providers";
import { defaultMetadata, organizationSchema } from '../lib/metadata'

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Asian Shipping" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <GlobalErrorHandler />
        {/* ALL providers now live INSIDE this Client Component */}
        <Providers>
          <ClientNavbar />
          <main id="main-content" className="min-h-[calc(100vh-120px)]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
