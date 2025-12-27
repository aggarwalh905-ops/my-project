"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, Sparkles, Loader2, Image as ImageIcon, 
  Zap, Maximize, MessageSquareText, RefreshCw,
  MousePointer2, LayoutGrid, Menu, X, Hash,
  History, Sliders, Ban, Copy, Check, Trash2
} from 'lucide-react';

// --- CUSTOM COMPONENTS ---

const ImagynexLogo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 group-hover:opacity-50 transition-all"></div>
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 p-1.5 rounded-xl border border-white/20 shadow-xl">
        <Sparkles size={18} className="text-white" fill="currentColor" />
      </div>
    </div>
    <span className="font-black text-lg md:text-xl tracking-tighter uppercase italic">
      Imagynex<span className="text-indigo-500 not-italic"> AI</span>
    </span>
  </div>
);

const VisionaryLoader = () => (
  <div className="flex flex-col items-center justify-center gap-6">
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      <div className="absolute inset-0 border-t-2 border-r-2 border-indigo-500 rounded-full animate-spin"></div>
      <div className="absolute inset-3 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-full animate-pulse blur-sm opacity-50"></div>
      <div className="absolute inset-5 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
        <Zap size={18} className="text-indigo-500 animate-bounce" fill="currentColor" />
      </div>
    </div>
    <div className="text-center px-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white animate-pulse">
        Synthesizing Vision
      </p>
    </div>
  </div>
);

export default function AIStudio() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seed, setSeed] = useState<number | string>(""); 
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [model, setModel] = useState("flux");
  const [ratio, setRatio] = useState("1:1");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState<{url: string, prompt: string}[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("Default");

  const styles = [
    { name: "Default", suffix: "" },
    { name: "Cinematic", suffix: ", cinematic lighting, 8k, highly detailed, masterpiece" },
    { name: "Anime", suffix: ", anime style, vibrant colors, studio ghibli aesthetic" },
    { name: "Cyberpunk", suffix: ", neon lights, futuristic, synthwave palette, tech" },
    { name: "3D Render", suffix: ", octane render, unreal engine 5, volumetric lighting" },
    { name: "Oil Painting", suffix: ", textured canvas, heavy brushstrokes, classical art" }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('imagynex_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const [communityImages, setCommunityImages] = useState<string[]>([]);
  useEffect(() => {
    const samples = Array.from({ length: 6 }).map((_, i) => 
      `https://image.pollinations.ai/prompt/${['cyberpunk', 'nature', 'portrait', 'space', 'anime', 'architecture'][i]}_masterpiece?nologo=true&seed=${i + 800}`
    );
    setCommunityImages(samples);
  }, []);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enhancePrompt = async () => {
    if (!prompt) return;
    setEnhancing(true);
    try {
      const response = await fetch(`https://text.pollinations.ai/Improve this image prompt for AI generation: ${prompt}`);
      const data = await response.text();
      setPrompt(data.trim());
    } catch (error) { console.error(error); }
    finally { setEnhancing(false); }
  };

  const downloadImage = async (imgUrl: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Imagynex-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(imgUrl, '_blank');
    }
  };

  const removeFromHistory = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem('imagynex_history', JSON.stringify(updatedHistory));
  };

  const generateImage = async (overrideSeed?: number) => {
    if (!prompt) return;
    setLoading(true);
    const finalSeed = overrideSeed || (seed !== "" ? Number(seed) : Math.floor(Math.random() * 1000000));
    let w = 1024, h = 1024;
    if (ratio === "16:9") { w = 1280; h = 720; }
    if (ratio === "9:16") { w = 720; h = 1280; }

    const styleSuffix = styles.find(s => s.name === selectedStyle)?.suffix || "";
    const negPart = negativePrompt ? `&negative=${encodeURIComponent(negativePrompt)}` : "";
    const fullPrompt = `${prompt}${styleSuffix}`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${w}&height=${h}&model=${model}&seed=${finalSeed}&nologo=true${negPart}`;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImage(url);
      setLoading(false);
      const newHistory = [{url, prompt: fullPrompt}, ...history].slice(0, 12);
      setHistory(newHistory);
      localStorage.setItem('imagynex_history', JSON.stringify(newHistory));
      
      // Auto scroll to image on mobile
      const canvas = document.getElementById('canvas');
      if (canvas && window.innerWidth < 768) {
        canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-indigo-600/50">
      
      {/* 1. BACKGROUND */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-5 h-16 flex items-center justify-between">
          <Link href="/">
             <ImagynexLogo />
          </Link>
          
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="/" className="hover:text-white transition">Create</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-400">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 border-b border-white/10 p-6 flex flex-col gap-4 z-50 animate-in fade-in slide-in-from-top-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Studio</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">About</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Contact</Link>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-5 pt-8 md:pt-16 pb-32">
        
        {/* 3. HERO SECTION */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 md:mb-6">
            Imagynex Neural Engine v2
          </div>
          <h1 className="text-4xl md:text-8xl font-black leading-tight md:leading-[0.9] tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent italic">
            IMAGINE <br className="hidden md:block" /> ANYTHING.
          </h1>
        </div>

        {/* 4. MAIN GENERATOR INTERFACE */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          
          {/* CONTROL PANEL */}
          <div className="bg-zinc-900/40 border border-white/10 p-5 md:p-8 rounded-[24px] md:rounded-[48px] backdrop-blur-3xl shadow-2xl space-y-6">
            
            {/* Style Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Art Style</label>
              <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth snap-x">
                {styles.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStyle(s.name)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border snap-center ${selectedStyle === s.name ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Input Prompt</label>
                <div className="flex gap-3 md:gap-4">
                  <button onClick={handleCopy} disabled={!prompt} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white disabled:opacity-20 transition">
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    <span className="hidden xs:inline">{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button onClick={enhancePrompt} disabled={enhancing || !prompt} className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 disabled:opacity-20 transition">
                    {enhancing ? <Loader2 className="animate-spin" size={12} /> : <MessageSquareText size={12} />}
                    Enhance
                  </button>
                </div>
              </div>
              <textarea 
                className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 md:p-5 text-sm md:text-lg outline-none focus:border-indigo-600/50 focus:ring-4 focus:ring-indigo-600/5 transition h-32 md:h-28 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your wildest imagination..."
              />
            </div>

            {/* Advanced & Settings Area */}
            <div className="space-y-4">
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                <Sliders size={12} /> {showAdvanced ? "Hide" : "Show"} Advanced Settings
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-black/40 rounded-2xl border border-white/5 animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-1"><Ban size={10} /> Negative</label>
                    <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-indigo-500/50" placeholder="e.g. text, blurry" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase flex items-center gap-1"><Hash size={10} /> Seed</label>
                    <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-indigo-500/50" placeholder="Random" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Engine</label>
                   <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-black/60 border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-600 appearance-none cursor-pointer">
                      <option value="flux">FLUX.1 (Ultra Detail)</option>
                      <option value="turbo">TURBO (Lightning Fast)</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Canvas</label>
                   <div className="flex gap-2">
                      {["1:1", "16:9", "9:16"].map(r => (
                        <button key={r} onClick={() => setRatio(r)} className={`flex-1 p-4 rounded-2xl text-[10px] font-black border transition-all ${ratio === r ? 'bg-white text-black border-white' : 'bg-black/60 border-white/5 hover:border-white/20'}`}>{r}</button>
                      ))}
                   </div>
                </div>
              </div>

              <button 
                onClick={() => generateImage()} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl md:rounded-[24px] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                 {loading ? "Synthesizing..." : "Create Masterpiece"}
              </button>
            </div>
          </div>

          {/* CANVAS AREA */}
          <div id="canvas" className="relative rounded-[24px] md:rounded-[48px] overflow-hidden border border-white/5 bg-zinc-900/30 aspect-square md:aspect-video flex items-center justify-center group shadow-2xl transition-all">
            {image ? (
              <div className="w-full h-full relative">
                <img src={image} className={`w-full h-full object-contain transition-all duration-1000 ${loading ? 'blur-3xl opacity-50' : 'blur-0 opacity-100'}`} alt="Result" />
                
                {!loading && (
                  <div className="absolute inset-0 bg-black/40 md:opacity-0 group-hover:opacity-100 transition-all flex flex-col md:flex-row items-center justify-center gap-3 p-6">
                    <button onClick={() => downloadImage(image)} className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-full font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition shadow-2xl uppercase">
                      <Download size={18}/> Download
                    </button>
                    <button onClick={() => generateImage(Math.floor(Math.random()*999999))} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition shadow-2xl backdrop-blur-md uppercase">
                      <RefreshCw size={16}/> New Variant
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon size={32} className="text-zinc-700" />
                </div>
                <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Imagynex Canvas Ready</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-3xl z-20">
                <VisionaryLoader />
              </div>
            )}
          </div>

          {/* HISTORY SECTION */}
          {history.length > 0 && (
            <section className="mt-4 space-y-4">
               <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Creations</h3>
                </div>
                <button onClick={() => {setHistory([]); localStorage.removeItem('imagynex_history');}} className="text-[10px] font-black text-zinc-500 hover:text-white transition uppercase">Clear Vault</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
                {history.map((item, idx) => (
                  <div key={idx} onClick={() => setImage(item.url)} className="aspect-square rounded-xl md:rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-indigo-500 transition group relative">
                    <img src={item.url} className="w-full h-full object-cover" alt="History" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg text-white">
                        <Maximize size={14} />
                      </div>
                      <button onClick={(e) => removeFromHistory(e, idx)} className="bg-red-600 p-1.5 md:p-2 rounded-lg text-white hover:bg-red-500 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 6. COMMUNITY FEED */}
        <section className="mt-20">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic">Discover</h2>
              <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Inspiration from the cloud</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {communityImages.map((src, i) => (
              <div key={i} className="aspect-[4/5] rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/5 relative group hover:border-indigo-500/50 transition">
                <img src={src} className="w-full h-full object-cover" alt="Feed" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/40 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition">
                  <p className="text-[8px] font-bold text-white truncate uppercase tracking-tighter">Imagynex Neural #{i+400}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-black/60 border-t border-white/5 pt-16 md:pt-20 pb-44 px-5 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-zinc-900/50 border border-dashed border-white/10 rounded-[32px] p-8 md:p-12 text-zinc-700 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
            Imagynex AI Neural Creative Suite
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="md:col-span-2">
               <ImagynexLogo />
               <p className="text-zinc-600 text-xs leading-relaxed mt-4 max-w-xs">Pioneering the intersection of human creativity and machine intelligence.</p>
            </div>
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Platform</h4>
               <ul className="text-zinc-500 text-[10px] space-y-2 font-bold uppercase tracking-wider">
                  <li><Link href="/privacy">Privacy</Link></li>
                  <li><Link href="/about">About</Link></li>
               </ul>
            </div>
            <div className="space-y-3">
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Connect</h4>
               <ul className="text-zinc-500 text-[10px] space-y-2 font-bold uppercase tracking-wider">
                  <li><Link href="#">Discord</Link></li>
                  <li><Link href="#">Twitter</Link></li>
               </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE ACTION DOCK - Hidden on desktop */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-full flex items-center gap-10 shadow-2xl z-50 transition-all border-b-indigo-500/50">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-zinc-400"><MousePointer2 size={20} /></button>
        <button onClick={() => generateImage()} className="text-indigo-500 scale-125"><Zap size={24} fill="currentColor" /></button>
        <button onClick={() => {
            const el = document.getElementById('canvas');
            if(el) el.scrollIntoView({ behavior: 'smooth' });
        }} className="text-zinc-400"><LayoutGrid size={20} /></button>
      </div>
    </div>
  );
}