import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; // React optimized import
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "Imagynex AI | Neural Image Studio",
  description: "Next-generation AI image generation powered by the Imagynex Neural Engine. Imagine anything, create masterpieces instantly.",
  keywords: ["AI Image Generator", "Neural Art", "Imagynex", "FLUX AI", "Digital Art Studio", "AI Remix"],
  authors: [{ name: "Imagynex AI Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1", // Mobile responsive fix
  openGraph: {
    title: "Imagynex AI | Neural Image Studio",
    description: "The intersection of human creativity and machine intelligence. Imagine. Generate. Remix.",
    url: "https://imagynex-ai.vercel.app", // Check: agar ye exact URL hai toh sahi hai
    siteName: "Imagynex AI",
    images: [
      {
        url: "/og-image.jpg", // Agar aapke 'public' folder mein koi image hai toh uska path yahan dein
        width: 1200,
        height: 630,
        alt: "Imagynex AI Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagynex AI",
    description: "Create anything you can imagine with our Neural Engine.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico", // Ensure karein ki 'public' folder mein favicon hai
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased selection:bg-indigo-500/30">
        {children}
        
        {/* Vercel Analytics Component - Ise body ke end mein rakhna best hai */}
        <Analytics />

        {/* Google Analytics (Ise ab add karein) */}
        <GoogleAnalytics gaId="G-L8NKF8T60G" />
      </body>
    </html>
  );
}