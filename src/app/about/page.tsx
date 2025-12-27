"use client";
import React from 'react';
import Link from 'next/link';
import { Sparkles, BrainCircuit, Rocket, ShieldCheck, ArrowLeft } from 'lucide-react';

const ImagynexLogo = () => (
  <div className="flex items-center gap-2 group cursor-pointer">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 group-hover:opacity-50 transition-all"></div>
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-500 p-1.5 rounded-xl border border-white/20 shadow-xl">
        <Sparkles size={18} className="text-white" fill="currentColor" />
      </div>
    </div>
    <span className="font-black text-xl tracking-tighter uppercase italic text-white">
      Imagynex<span className="text-indigo-500 not-italic"> AI</span>
    </span>
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-indigo-600/50">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <nav className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition">
          <ArrowLeft size={14} /> Back to Studio
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-20 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-8">
            The Future of <br /> <span className="text-indigo-500">Neural Creativity.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Imagynex AI is more than a tool; it's a bridge between human imagination and machine intelligence, designed to turn thoughts into masterpieces instantly.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {[
            { icon: <BrainCircuit className="text-indigo-500" />, title: "Neural Core", desc: "Powered by the latest FLUX and Turbo engines for unparalleled detail." },
            { icon: <Rocket className="text-blue-500" />, title: "Hyper Fast", desc: "Synthesizing high-resolution visions in seconds, not minutes." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Open Access", desc: "Empowering creators worldwide with unrestricted creative freedom." }
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[32px] backdrop-blur-3xl">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-black uppercase tracking-widest text-sm mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <section className="border-t border-white/5 pt-20 text-center">
          <ImagynexLogo />
          <p className="mt-8 text-zinc-500 text-sm italic font-medium">© 2025 Imagynex AI Neural Systems.</p>
        </section>
      </main>
    </div>
  );
}