import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Providers from '@/components/Providers'
import { fonts } from './fonts'
import './globals.css'


export const metadata: Metadata = {
  title: 'DOTA - DOT20 inscription',
  description: '',
}

export const dynamicParams = true

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fonts.comfortaa.className}>
        <Providers>
          <Header />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  )
}
