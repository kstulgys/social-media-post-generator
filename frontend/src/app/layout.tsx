import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Social Media Post Generator",
  description: "Generate engaging social media posts for your products with AI",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {/* Ambient background glows */}
        <div className="ambient-glow ambient-glow-purple" />
        <div className="ambient-glow ambient-glow-pink" />
        <div className="ambient-glow ambient-glow-orange" />

        {/* Main content */}
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
