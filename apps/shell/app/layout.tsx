import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteHeader, Footer } from '@poke/ui'

import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Pokemon Explorer', template: '%s · Pokemon Explorer' },
  description: 'Browse and search Pokemon and Berries, and add your own.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col bg-surface-muted font-sans text-content antialiased">
        <SiteHeader activeHref="/" />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
