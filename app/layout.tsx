import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/language-provider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
})

const siteUrl = 'https://kaajdentalclinic.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'KAAJ Dental Clinic | Kabul, Afghanistan',
    template: '%s | KAAJ Dental Clinic',
  },

  description:
    'KAAJ Dental Clinic provides comprehensive, modern, and professional dental care in Khair Khana, Kabul, Afghanistan.',

  keywords: [
    'KAAJ Dental Clinic',
    'Kaaj Dental Clinic Kabul',
    'Dental Clinic Kabul',
    'Dentist Kabul',
    'Dentistry Afghanistan',
    'Cosmetic Dentistry',
    'Dental Implants',
    'Orthodontics',
    'Teeth Whitening',
    'Veneers',
    'Root Canal Treatment',
    'Dental Care Kabul',
  ],

  authors: [{ name: 'KAAJ Dental Clinic' }],
  creator: 'KAAJ Dental Clinic',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'KAAJ Dental Clinic',
    title: 'KAAJ Dental Clinic | Kabul, Afghanistan',
    description:
      'Professional and comprehensive dental care in Khair Khana, Kabul, Afghanistan.',
    images: [
      {
        url: '/images/hero-clinic.png',
        width: 1200,
        height: 630,
        alt: 'KAAJ Dental Clinic',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'KAAJ Dental Clinic | Kabul, Afghanistan',
    description:
      'Professional and comprehensive dental care in Khair Khana, Kabul, Afghanistan.',
    images: ['/images/hero-clinic.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  // KAAJ Dental Clinic favicon
  icons: {
    icon: [
      {
        url: '/kaaj-logo.png',
        type: 'image/png',
      },
    ],
    shortcut: '/kaaj-logo.png',
    apple: '/kaaj-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f5ef',
  width: 'device-width',
  initialScale: 1,
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',

  name: 'KAAJ Dental Clinic',

  image: `${siteUrl}/kaaj-logo.png`,

  '@id': siteUrl,

  url: siteUrl,

  telephone: [
    '+93 700 848 348',
    '+93 784 042 121',
  ],

  priceRange: '$$',

  description:
    'KAAJ Dental Clinic provides comprehensive and professional dental care in Khair Khana, Kabul, Afghanistan.',

  address: {
    '@type': 'PostalAddress',
    streetAddress:
      'Khair Khana, Between Golai Park and Golai Khwaja Bughra',
    addressLocality: 'Kabul',
    addressCountry: 'AF',
  },

  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
      ],
      opens: '09:00',
      closes: '19:00',
    },
  ],

  medicalSpecialty: 'Dentistry',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <LanguageProvider>{children}</LanguageProvider>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}