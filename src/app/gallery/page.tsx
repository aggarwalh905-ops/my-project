"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import Router
import { Download, Search, Filter, Sparkles, ArrowLeft, Image as ImageIcon, Share2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style?: string;
  seed?: string;
  createdAt?: any;
}

export default function Gallery() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Cinematic", "Anime", "Cyberpunk", "3D Render", "Oil Painting"];

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryImage[];
      setImages(docs);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // NEW: Remix Function (Redirect to home with data)
  const handleRemix = (img: GalleryImage) => {
    const params = new URLSearchParams({
      prompt: img.prompt,
      style: img.style || "Default",
      seed: img.seed || "",
      img: img.imageUrl,
      id: img.id
    });
    router.push(`/?${params.toString()}`);
  };

  const downloadImg = async (e: React.MouseEvent, url: string, filename: string) => {
    e.stopPropagation(); // Click image se remix na ho jaye
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Imagynex-${filename}.jpg`;
      link.click();
    } catch (e) {
      window.open(url, "_blank");
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || img.style === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [images, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Sparkles size={18} fill="currentColor" />
             </div>
             <span className="font-black text-xl tracking-tighter uppercase italic">
                Imagynex<span className="text-indigo-500 not-italic"> AI</span>
             </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition">
            <ArrowLeft size={14} /> Back to Studio
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
              Global <span className="text-indigo-500">Archive</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">The Neural Collective Knowledge</p>
          </div>

          <div className="w-full md:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-bold uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeFilter === cat ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Syncing Neurons...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredImages.map((img) => (
              <div 
                key={img.id} 
                onClick={() => handleRemix(img)} // Click to go to Studio
                className="group relative aspect-[3/4] rounded-[32px] md:rounded-[40px] overflow-hidden border border-white/5 bg-zinc-900/20 transition-all hover:border-indigo-500/40 cursor-pointer active:scale-95"
              >
                <img src={img.imageUrl} alt="AI" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                
                {/* MOBILE OVERLAY (Always visible on bottom) / DESKTOP (Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
                   <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 space-y-3">
                      <p className="text-[10px] text-zinc-100 font-bold leading-snug line-clamp-2 uppercase italic tracking-tight opacity-90">
                        "{img.prompt}"
                      </p>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-2">
                           <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-[7px] font-black uppercase tracking-widest">
                             {img.style || 'Custom'}
                           </span>
                        </div>
                        <button 
                          onClick={(e) => downloadImg(e, img.imageUrl, img.id)}
                          className="p-2 bg-white text-black rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                      
                      <div className="w-full py-2 bg-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        <Share2 size={10} /> Remix This Image
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}