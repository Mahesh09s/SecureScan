import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'SecureScan | Enterprise Vulnerability Command Center',
  description: 'Elite cybersecurity vulnerability assessment and management platform for engineering teams.',
  keywords: ['cybersecurity', 'vulnerability scanner', 'threat intelligence', 'compliance', 'GRC', 'AI security'],
  openGraph: {
    title: 'SecureScan Enterprise',
    description: 'Protect your infrastructure with AI-driven security assessments.',
    type: 'website',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#0a0a0a] text-foreground selection:bg-primary/40 selection:text-white overflow-x-hidden">
        <div className="relative min-h-screen">
          {children}
        </div>
        <Toaster />
        <FirebaseErrorListener />
      </body>
    </html>
  );
}