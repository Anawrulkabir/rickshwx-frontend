import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SocketProvider } from "@/context/SocketContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CUET RickshawkX - Future of Campus Transportation",
  description:
    "Connect with tech-savvy rickshaw pullers on CUET smart campus. Fast, reliable, and sustainable rides at your fingertips.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          {children}
          <Toaster />
        </SocketProvider>
      </body>
    </html>
  )
}
