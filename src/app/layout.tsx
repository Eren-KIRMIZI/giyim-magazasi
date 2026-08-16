import type { Metadata } from "next";
import { Anton, Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
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
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${geist.variable} ${anton.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("last-dance-theme");var d=s? s==="dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <AuthProvider>
          <ScrollProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <CartSync />
            <Analytics />
          </ScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
