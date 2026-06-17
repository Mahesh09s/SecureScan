import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * @fileOverview Root layout with SEO metadata and production global listeners.
 */

export const metadata: Metadata = {
  title: 'SecureScan | Enterprise Vulnerability Assessment',
  description: 'Automated cybersecurity vulnerability scanner, AI-powered remediation, and strategic security dashboard.',
  keywords: ['cybersecurity', 'vulnerability scanner', 'threat intelligence', 'compliance', 'GRC', 'AI security'],
  authors: [{ name: 'SecureScan Engineering' }],
  openGraph: {
    title: 'SecureScan Enterprise',
    description: 'Protect your infrastructure with AI-driven security assessments.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30 selection:text-white">
        {children}
        <Toaster />
        <FirebaseErrorListener />
      </body>
    </html>
  );
}
