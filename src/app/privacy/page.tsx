"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, Lock, EyeOff, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Lock size={20} />,
      title: "Data Security",
      content: "Your prompts and generated images are processed via encrypted channels. We do not store personal biological data or private metadata from your local device."
    },
    {
      icon: <EyeOff size={20} />,
      title: "Privacy First",
      content: "Imagynex AI utilizes the Pollinations API. Images generated are public by nature of the engine, but we do not link your identity to your creations unless explicitly signed in."
    },
    {
      icon: <Shield size={20} />,
      title: "Usage Policy",
      content: "We advocate for responsible AI use. Users are responsible for the content they generate and must adhere to ethical standards in the creative community."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans">
      <nav className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition">
          <ArrowLeft size={14} /> Return to Home
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Privacy <span className="text-indigo-500">Protocol</span></h1>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-12">Last Updated: October 2025</p>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600/10 rounded-lg text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {section.icon}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">{section.title}</h2>
              </div>
              <p className="text-zinc-400 leading-relaxed pl-12 border-l border-white/5 ml-5">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            Imagynex AI Security Division
          </p>
        </footer>
      </main>
    </div>
  );
}