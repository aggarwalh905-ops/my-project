import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script';

// Define the base URL to avoid repetition
const baseUrl = "https://imagynex-ai.vercel.app";

export const metadata: Metadata = {
  title: "Imagynex AI | Neural Image Studio",
  description: "Next-generation AI image generation powered by the Imagynex Neural Engine. Imagine anything, create masterpieces instantly.",
  keywords: ["AI Image Generator", "Neural Art", "Imagynex", "FLUX AI", "Digital Art Studio", "AI Remix"],
  authors: [{ name: "Imagynex AI Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  
  // High-performance theme color for mobile browsers
  themeColor: "#020202",

  openGraph: {
    title: "Imagynex AI | Neural Image Studio",
    description: "The intersection of human creativity and machine intelligence. Imagine. Generate. Remix.",
    url: baseUrl,
    siteName: "Imagynex AI",
    images: [
      {
        url: `${baseUrl}/og-image.png`, // Using absolute URL for better compatibility
        width: 1200,
        height: 630,
        alt: "Imagynex AI Leaderboard Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagynex AI",
    description: "Create anything you can imagine with our Neural Engine.",
    images: [`${baseUrl}/og-image.png`], // Absolute URL
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Recommended: 180x180px image in /public
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