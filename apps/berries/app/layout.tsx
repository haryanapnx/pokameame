import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { QueryProvider } from '@poke/core/queries'
import { SiteHeader, Footer } from '@poke/ui'

import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Berries', template: '%s · Berries' },
  description: 'Browse, search and create berries.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col bg-surface-muted font-sans text-content antialiased">
        <SiteHeader activeHref="/berries" />
        <main className="flex-1">
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Footer />
      </body>
    </html>
  )
}
