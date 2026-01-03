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

      // 1. Full URL banayein (Absolute Path)
      let fullUrl = data.imageUrl;
      if (fullUrl.startsWith('/')) {
        fullUrl = `${baseUrl}${fullUrl}`;
      }

      // 2. XML SAFE CONVERSION (IMPORTANT)
      // Sabhi '&' ko '&amp;' se replace karna zaroori hai warna XML break ho jayega
      const safeImageUrl = fullUrl.replace(/&/g, '&amp;');

      return {
        url: `${baseUrl}/gallery/${doc.id}`, 
        lastModified: data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: [safeImageUrl], // Yahan safe image URL jayega
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