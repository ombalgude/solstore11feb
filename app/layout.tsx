import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/navbar'
import { Providers } from './providers'
import { Suspense } from 'react'

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SolStore - Web3 Digital Content Marketplace',
  description: 'Buy and sell digital content using Solana',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Preload critical assets */}
        <link 
          rel="preload" 
          href="https://cryptologos.cc/logos/solana-sol-logo.png" 
          as="image"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <Suspense fallback={<div className="flex-1 bg-background" />}>
                <main className="flex-1">{children}</main>
              </Suspense>
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}