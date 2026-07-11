import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import ErrorBoundary from "../components/ErrorBoundary";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../contexts/AuthContext";

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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-gray-50 dark:bg-[#0b1912] text-gray-900 dark:text-emerald-50 transition-colors duration-300`}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
              <main className="w-full max-w-5xl mx-auto glass min-h-screen shadow-2xl border-x border-emerald-900/40 flex flex-col relative overflow-hidden">
                {/* Top ambient glow for whole app */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 bg-emerald-500/10 blur-[60px] pointer-events-none z-0"></div>
                
                <div className="p-4 flex-1 relative z-10">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </main>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

