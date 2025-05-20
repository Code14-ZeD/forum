import type { Metadata } from "next"

import Header from "@/components/header"
import { InnerProvider, OuterProvider } from "@/app/providers"

import "./globals.css"

export const metadata: Metadata = {
  title: "Forum",
  description: "An online discussion platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <OuterProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-dvh antialiased">
          <main className="mx-auto min-h-dvh max-w-screen-lg space-y-6 p-4 sm:p-5">
            <InnerProvider>
              <Header />
              {children}
            </InnerProvider>
          </main>
        </body>
      </html>
    </OuterProvider>
  )
}
