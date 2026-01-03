import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://imagynexai.vercel.app";

  return {
    rules: {
      userAgent: '*', 
      allow: '/',     
      disallow: [
        '/api/',              // Saari internal APIs ko block karta hai
        '/gallery?view=admin', // Specific admin view ko block karta hai
        '/admin',             // Agar koi /admin folder hai toh use block karta hai
        '/private',           // Private folders ke liye
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}