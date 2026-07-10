import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ErrorBoundary from "../components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Mizen — ميزان",
  description: "Algerian Food Intelligence Platform",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1b5e20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans min-h-screen bg-gray-50 text-gray-900 bg-[url('/patterns/cubes.png')]">
        <LanguageProvider>
          <main className="max-w-md mx-auto bg-white/80 backdrop-blur-xl min-h-screen shadow-2xl border-x border-gray-100 flex flex-col">
            <header className="p-4 flex justify-end border-b border-gray-100">
              <LanguageSwitcher />
            </header>
            <div className="p-4 flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}

