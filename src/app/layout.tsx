import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AItix | Agentic Commerce Platform",
  description: "Autonomous ticket purchasing platform powered by AI agents on the ARC network using AP2 protocol",
  keywords: ["tickets", "AI", "agents", "blockchain", "ARC", "AP2"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background grid-bg`}>
        {children}
      </body>
    </html>
  );
}
