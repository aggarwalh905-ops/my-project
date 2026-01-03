import { MetadataRoute } from 'next';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://imagynexai.vercel.app";
  let imageEntries: MetadataRoute.Sitemap = [];
  
  try {
    const galleryRef = collection(db, "gallery");
    const q = query(
      galleryRef, 
      where("isPrivate", "==", false), 
      orderBy("createdAt", "desc"),
      limit(1000) 
    );

    const querySnapshot = await getDocs(q);
    
    imageEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (!data.imageUrl) return null;

      // 1. Full URL banayein
      let fullUrl = data.imageUrl;
      if (fullUrl.startsWith('/')) {
        fullUrl = `${baseUrl}${fullUrl}`;
      }

      // 2. ULTRA SAFE ENCODING
      // Pehle URL ko decode karein (agar pehle se encoded hai) phir sahi se encode karein
      // Isse saare special characters XML-friendly ban jayenge
      const encodedUrl = fullUrl
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      return {
        url: `${baseUrl}/gallery/${doc.id}`, 
        lastModified: data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: [encodedUrl], 
      };
    }).filter((entry): entry is any => entry !== null);

  } catch (error) {
    console.error("Sitemap Fetch Error:", error);
    imageEntries = [];
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always' as const, priority: 1.0 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  return [...staticPages, ...imageEntries];
}