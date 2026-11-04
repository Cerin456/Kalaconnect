import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import SplashProvider from '@/components/SplashProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'KalaConnect — Art · Identity · Opportunity',
  description:
    "KalaConnect gives India's traditional artists the tools to tell their story, build a digital identity, and reach customers across the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <SplashProvider />
        {children}
      </body>
    </html>
  );
}
