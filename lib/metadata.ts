import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://asianshippingthai.com'),
  title: {
    default: 'Asian Shipping Thailand | International Air & Sea Freight Logistics',
    template: '%s | Asian Shipping Thailand',
  },
  description: 'Leading logistics company in Thailand offering air freight, sea freight FCL/LCL, warehousing, and customs clearance. 99.5% on-time delivery to 200+ global destinations.',
  keywords: [
    'Thailand logistics',
    'air freight Bangkok',
    'sea freight Thailand',
    'FCL shipping',
    'LCL cargo',
    'international shipping',
    'customs clearance Thailand',
    'warehousing Bangkok',
    'freight forwarder',
  ],
  authors: [{ name: 'Asian Shipping Thailand' }],
  creator: 'Asian Shipping Thailand',
  publisher: 'Asian Shipping Thailand',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Asian Shipping Thailand | International Air & Sea Freight Logistics',
    description: 'Leading logistics company in Thailand offering air freight, sea freight FCL/LCL, warehousing, and customs clearance. 99.5% on-time delivery to 200+ global destinations.',
    siteName: 'Asian Shipping Thailand',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Asian Shipping Thailand - Global Logistics Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asian Shipping Thailand | International Air & Sea Freight Logistics',
    description: 'Leading logistics company in Thailand offering air freight, sea freight FCL/LCL, warehousing, and customs clearance.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Asian Shipping Thailand',
  alternateName: 'Asian Shipping Thai',
  url: 'https://asianshippingthai.com',
  logo: 'https://asianshippingthai.com/logo.png',
  description: 'Leading logistics company in Thailand offering air freight, sea freight FCL/LCL, warehousing, and customs clearance services.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'TH',
    addressLocality: 'Bangkok',
    addressRegion: 'Bangkok',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+66-2-249-3889',
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['en', 'th'],
    },
  ],
  email: 'asian@asianshippingthai.com',
  telephone: '+66-2-249-3889',
  faxNumber: '+66-2-249-3778',
  sameAs: [
    // Add your social media profiles here
    // 'https://www.facebook.com/asianshipping',
    // 'https://www.linkedin.com/company/asianshipping',
  ],
};
