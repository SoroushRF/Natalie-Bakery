import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContentProvider } from "@/context/ContentContext";
import { getSiteContent } from "@/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Natalie Bakery | High-End Persian Pastries",
  description: "Experience the finest Persian luxury pastries, custom cakes, and artisanal bread.",
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ContentProvider initialContent={siteContent}>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
