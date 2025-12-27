"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Link from 'next/link';
import { Download, Search, Filter, Sparkles, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  style?: string;
  createdAt?: any;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Style categories for filtering
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

  // Filter and Search Logic
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = img.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || img.style === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [images, searchQuery, activeFilter]);

  const downloadImg = async (url: string, filename: string) => {
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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* HEADER SECTION */}
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
        {/* TITLE & SEARCH BLOCK */}
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

        {/* FILTERS */}
        <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-zinc-500">
             <Filter size={12} /> <span className="text-[9px] font-black uppercase">Filter:</span>
          </div>
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

        {/* GRID AREA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Accessing Data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredImages.map((img) => (
                <div key={img.id} className="group relative aspect-[3/4] rounded-[40px] overflow-hidden border border-white/5 bg-zinc-900/20 transition-all hover:border-indigo-500/40 hover:-translate-y-2">
                  <img src={img.imageUrl} alt="AI" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  
                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-8 flex flex-col justify-end gap-4">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-white text-black rounded-full text-[8px] font-black uppercase tracking-widest">{img.style || 'Custom'}</span>
                      <button 
                        onClick={() => downloadImg(img.imageUrl, img.id)}
                        className="p-3 bg-indigo-600 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Prompt Logic</p>
                      <p className="text-[11px] text-zinc-100 font-bold leading-snug line-clamp-3 uppercase italic tracking-tight opacity-90">
                        "{img.prompt}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-32 space-y-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-dashed border-white/10 text-zinc-700">
                  <ImageIcon size={32} />
                </div>
                <p className="font-black uppercase tracking-[0.2em] text-xs text-zinc-600">No matches found in the archive</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 text-center">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
          Imagynex AI &copy; 2024 • Neural Creative Engine
        </p>
      </footer>
    </div>
  );
}