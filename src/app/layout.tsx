import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const baseUrl = "https://imagynex-ai.vercel.app";

// Viewport must be exported separately in newer Next.js versions
export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Imagynex AI | Neural Image Studio",
  description: "Next-generation AI image generation powered by the Imagynex Neural Engine. Imagine anything, create masterpieces instantly.",
  keywords: ["AI Image Generator", "Neural Art", "Imagynex", "FLUX AI", "Digital Art Studio", "AI Remix"],
  authors: [{ name: "Imagynex AI Team" }],
  metadataBase: new URL(baseUrl), // Helpful for resolving relative paths automatically
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "Imagynex AI | Neural Image Studio",
    description: "The intersection of human creativity and machine intelligence. Imagine. Generate. Remix.",
    url: baseUrl,
    siteName: "Imagynex AI",
    images: [
      {
        url: "/og-image.jpg", // MetadataBase helps resolve this to absolute URL
        width: 1200,
        height: 630,
        alt: "Imagynex AI - Create Art with Neural Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter (X)
  twitter: {
    card: "summary_large_image",
    title: "Imagynex AI | Neural Image Studio",
    description: "Create anything you can imagine with our Neural Engine.",
    images: ["/og-image.jpg"],
    creator: "@ImagynexAI", // Agar aapka twitter handle hai toh yahan badal dein
  },

  // Search Engine & Icons
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Puter.js integration */}
        <Script 
          src="https://js.puter.com/v2/" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className="bg-black antialiased selection:bg-indigo-500/30">
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-L8NKF8T60G" />
      </body>
    </html>
  );
}