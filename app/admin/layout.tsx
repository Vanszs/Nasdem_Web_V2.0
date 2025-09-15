import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import '@/src/index.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NasDem Admin Panel',
  description: 'Admin Panel DPD Partai NasDem Kabupaten Sidoarjo',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  )
}
