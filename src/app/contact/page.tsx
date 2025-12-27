"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans">
      <nav className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition">
          <ArrowLeft size={14} /> Back to Studio
        </Link>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-3">Get in <span className="text-indigo-500">Touch</span></h1>
          <p className="text-zinc-500 text-sm font-medium">Have questions about the Imagynex Neural Engine?</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] backdrop-blur-3xl shadow-2xl">
          {status === 'sent' ? (
            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Message Received</h2>
              <p className="text-zinc-500 text-sm">Our neural processors are analyzing your inquiry.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Name</label>
                <input required type="text" className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-indigo-600/50 transition" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                <input required type="email" className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-indigo-600/50 transition" placeholder="hello@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Message</label>
                <textarea required rows={4} className="w-full bg-black/60 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-indigo-600/50 transition resize-none" placeholder="Describe your inquiry..." />
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
              >
                {status === 'sending' ? 'Transmitting...' : <><Send size={14} /> Send Message</>}
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="p-6 bg-white/5 border border-white/5 rounded-[32px] text-center">
            <Mail size={20} className="mx-auto mb-3 text-indigo-500" />
            <p className="text-[10px] font-black uppercase text-zinc-500">Email Us</p>
            <p className="text-xs font-bold mt-1">contact@imagynex.ai</p>
          </div>
          <div className="p-6 bg-white/5 border border-white/5 rounded-[32px] text-center">
            <MessageSquare size={20} className="mx-auto mb-3 text-blue-500" />
            <p className="text-[10px] font-black uppercase text-zinc-500">Support</p>
            <p className="text-xs font-bold mt-1">Discord Community</p>
          </div>
        </div>
      </main>
    </div>
  );
}