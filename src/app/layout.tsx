/** biome-ignore-all assist/source/organizeImports: <explanation> */
import type { Metadata } from 'next'
import '@/styles/globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactQueryProvider } from '@/providers/react-query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Product Roadmap',
    default: 'Product Roadmap',
  },
  description: 'Follow the development progress of our entire platform.',
}

type RootLayoutProps = {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body className="bg-navy-950 text-navy-50 antialiased">
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
