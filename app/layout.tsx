import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Philosophy - Personal Blog',
  description: 'A modern personal blog platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="theme-dark">{children}</body>
    </html>
  )
}

