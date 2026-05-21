import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel'
})

export const metadata: Metadata = {
  title: 'SHUGO | Project Requests',
  description: 'Request your next digital project with SHUGO. We create websites, apps, and digital experiences with pixel art creativity.',
  keywords: ['web development', 'digital projects', 'freelance', 'pixel art', 'web design'],
}

export const viewport: Viewport = {
  themeColor: '#ff1b1b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${pressStart2P.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'var(--card)',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
            }
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
