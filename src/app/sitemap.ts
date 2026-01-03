import { MetadataRoute } from 'next';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://imagynexai.vercel.app";
  let imageEntries: MetadataRoute.Sitemap = [];
  
  try {
    const galleryRef = collection(db, "gallery");
    // Is query ki wajah se Private images Sitemap mein kabhi nahi aayengi
    const q = query(
      galleryRef, 
      where("isPrivate", "==", false), 
      orderBy("createdAt", "desc"),
      limit(1000) 
    );

    const querySnapshot = await getDocs(q);
    
    imageEntries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/gallery/${doc.id}`, 
        lastModified: data.createdAt?.toDate() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: [data.imageUrl], 
      };
    });
  } catch (error) {
    console.error("Sitemap Image Fetch Error:", error);
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