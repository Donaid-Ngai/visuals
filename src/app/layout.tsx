import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visuals Library",
  description: "Reusable visual explainers, diagrams, and business visuals",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold hover:text-cyan-300">🎨 Visuals Library</Link>
            <nav className="flex gap-6 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/visuals/capabilities-showcase" className="hover:text-white">Capabilities</Link>
              <Link href="/visuals/marven-baseball-sim" className="hover:text-white">Marven Baseball Sim</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
