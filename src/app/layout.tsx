import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const baseUrl = "https://imagynexai.vercel.app";

export const viewport: Viewport = {
  themeColor: "#020202",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  // SEO Update: Main keyword ko title ke shuruat mein rakha hai
  title: "AI Image Generator | Free Neural Art Studio - Imagynex AI",
  description: "Create stunning AI images for free with Imagynex AI. The best neural engine for flux AI art, image remixing, and instant digital masterpieces. Imagine and generate now!",
  keywords: [
    "AI Image Generator", 
    "Free AI Image Generator", 
    "Neural Art Studio", 
    "Flux AI Online", 
    "Text to Image AI", 
    "AI Art Creator", 
    "Imagynex AI",
    "Best AI Art Generator"
  ],
  authors: [{ name: "Imagynex AI Team" }],
  metadataBase: new URL(baseUrl), 
  
  openGraph: {
    // Social media par clicks badhane ke liye title change kiya
    title: "Free AI Image Generator | Create Neural Art with Imagynex AI",
    description: "Generate high-quality AI art instantly. The intersection of human creativity and machine intelligence. Imagine. Generate. Remix.",
    url: baseUrl,
    siteName: "Imagynex AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imagynex AI Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Best AI Image Generator | Imagynex AI",
    description: "Create anything you can imagine with our Neural Engine. Fast, free, and high-quality AI art.",
    images: ["/og-image.jpg"],
    creator: "@ImagynexAI",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large', // Google Search mein badi image dikhegi
      'max-snippet': -1,
    },
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