import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from 'next/font/google'
import "./globals.css"
import { AuthProvider } from "@/lib/auth"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "모던 커뮤니티 - 당신의 생각을 나누세요",
  description: "현대적인 디자인의 커뮤니티 게시판",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
