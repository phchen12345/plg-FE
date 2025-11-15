import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "../components/BootstrapClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import HeaderNav from "@/components/layout/HeaderNav";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import AuthInitializer from "@/components/layout/AuthInitializer";

// 載入字型
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"], // 加上字重
  variable: "--font-noto-sans-tc",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLG test",
  description: "Made with Next.js",
  icons: {
    icon: "/pleague_logo2.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSansTC.variable} ${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white antialiased`}
      >
        <CartProvider>
          <AuthInitializer />
          <HeaderNav />
          {children}
          <Footer />
        </CartProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
