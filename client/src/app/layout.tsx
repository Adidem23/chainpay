"use client"
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './AuthContext'
import {BrowserRouter} from 'react-router-dom'

// const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable:  '--font-mont'
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
      <BrowserRouter>
      <body className={mont.className}>
        {children}
        </body>
      </BrowserRouter>
        </AuthProvider>
    </html>
  )
}
