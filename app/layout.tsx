import type { Metadata } from "next";
import { Anton, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProvider from "@/components/providers/ScrollProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import CartSync from "@/components/cart/CartSync";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LAST DANCE | Official Store",
    template: "%s | LAST DANCE",
  },
  description:
    "Unapologetic streetwear. Brutalist design. Official store of LAST DANCE — secure the archive before it's gone.",
  openGraph: {
    title: "LAST DANCE | Official Store",
    description:
      "Unapologetic streetwear. Brutalist design. This is your last chance to secure the archive.",
    siteName: "LAST DANCE",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${anton.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
        <AuthProvider>
          <ScrollProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSync />
          </ScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
