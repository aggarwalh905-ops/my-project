"use client";
import React, { useEffect, useState } from 'react';
import { db, auth } from "@/lib/firebase"; 
import { collection, query, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot, DocumentData, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Trophy, Medal, User, ArrowLeft, Heart, Zap, Star, Crown, Flame, ExternalLink, ShieldCheck, ChevronDown, Loader2, Target, Sparkles, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Artist {
  id: string;
  displayName: string;
  totalLikes: number;
  totalCreations: number;
}

export default function GlobalLeaderboard() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [shared, setShared] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<Artist | null>(null);
  const [userRank, setUserRank] = useState<number | string>("...");

  const BATCH_SIZE = 20;

  useEffect(() => {
    setMounted(true);
    const savedUid = localStorage.getItem('imagynex_uid');
    if (savedUid) {
      fetchUserSpecificData(savedUid);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('userUid', user.uid);
        fetchUserSpecificData(user.uid);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    fetchLeaderboard();
    return () => unsubscribe();
  }, []);

  const fetchUserSpecificData = async (uid: string) => {
    try {
      const userDocs = await getDocs(query(collection(db, "users"), where("__name__", "==", uid)));
      if (!userDocs.empty) {
        const data = userDocs.docs[0].data() as Artist;
        setUserData({ ...data, id: uid });
        const rankQ = query(collection(db, "users"), where("totalLikes", ">", data.totalLikes || 0));
        const rankSnapshot = await getDocs(rankQ);
        setUserRank(rankSnapshot.size + 1);
      }
    } catch (e) {
      console.error("Error fetching user rank:", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("totalLikes", "desc"), limit(BATCH_SIZE));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        const fetchedArtists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Artist[];
        setArtists(fetchedArtists);
        if (querySnapshot.docs.length < BATCH_SIZE) setHasMore(false);
      }
    } catch (error) {
      console.error("Leaderboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lastVisible || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextQ = query(collection(db, "users"), orderBy("totalLikes", "desc"), startAfter(lastVisible), limit(BATCH_SIZE));
      const querySnapshot = await getDocs(nextQ);
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        const nextArtists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Artist[];
        setArtists(prev => [...prev, ...nextArtists]);
        if (querySnapshot.docs.length < BATCH_SIZE) setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My AI Studio Ranking',
      text: `I am currently ranked #${userRank} in the Global Hall of Fame with ${userData?.totalLikes} likes! Check out my artifacts.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const viewArtistGallery = (artistId: string) => {
    router.push(`/gallery?user=${artistId}`);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-indigo-500/30 pb-44 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(0.98); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 3s ease-in-out infinite; }
      `}} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 md:py-12 relative z-10">
        
        {/* Header - Updated to Global Ranking */}
        <div className="flex items-center justify-between mb-8 md:mb-20">
          <Link href="/gallery" className="group p-2.5 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90">
            <ArrowLeft size={18} className="md:size-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          
          <div className="text-center flex-1 mx-2">
            <div className="flex items-center justify-center gap-1.5 mb-1 md:mb-2">
                <Sparkles size={10} className="text-indigo-400 animate-bounce md:size-4" />
                {/* Changed text here */}
                <span className="text-[7px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.5em] text-indigo-500 uppercase">Live Leaderboard</span>
                <Sparkles size={10} className="text-indigo-400 animate-bounce md:size-4" />
            </div>
            {/* Changed text here */}
            <h1 className="text-2xl md:text-7xl font-black uppercase italic tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-none">
              GLOBAL RANKING
            </h1>
          </div>

          <div className="relative group cursor-pointer" onClick={handleShare}>
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900 rounded-xl md:rounded-2xl border border-white/10 relative overflow-hidden">
                {shared ? <Check size={18} className="text-green-500" /> : <Share2 size={18} className="md:size-8 text-indigo-400 group-hover:scale-110 transition-transform" />}
              </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 animate-pulse">Scanning Neural Network...</p>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            
            {/* Top 3 Podium */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8 items-end mb-12 md:mb-20 px-2">
              {artists[1] && (
                <div onClick={() => viewArtistGallery(artists[1].id)} className="w-full order-2 md:order-1 relative p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group h-[160px] md:h-[280px]">
                  <Medal size={30} className="md:size-10 text-zinc-400 absolute top-4 right-4 md:top-6 md:right-6" />
                  <div className="absolute -top-4 -left-2 md:-top-6 text-5xl md:text-7xl font-black italic text-zinc-500/10">#2</div>
                  <div className="mt-4 md:mt-8">
                    <h3 className="text-xl md:text-2xl font-black uppercase italic truncate text-zinc-300">{artists[1].displayName}</h3>
                    <div className="flex items-center gap-2 mt-2 md:mt-4 bg-zinc-800/50 w-fit px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span className="font-black text-sm md:text-lg">{artists[1].totalLikes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {artists[0] && (
                <div onClick={() => viewArtistGallery(artists[0].id)} className="w-full order-1 md:order-2 relative p-8 md:p-10 rounded-[35px] md:rounded-[50px] border-2 border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-transparent backdrop-blur-2xl hover:scale-105 transition-all duration-700 cursor-pointer group shadow-[0_0_50px_rgba(234,179,8,0.15)] h-[220px] md:h-[340px] animate-bounce-slow">
                  <Crown size={40} className="md:size-16 text-yellow-500 absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                  <div className="absolute top-4 right-6 md:top-8 md:right-10 text-6xl md:text-8xl font-black italic text-yellow-500/10">#1</div>
                  <div className="mt-6 md:mt-12 text-center">
                    <ShieldCheck size={24} className="md:size-8 text-yellow-500 mx-auto mb-2 md:mb-4" />
                    <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-2">{artists[0].displayName}</h3>
                    <div className="flex items-center justify-center gap-2 bg-yellow-500/20 w-fit mx-auto px-4 md:px-6 py-2 md:py-3 rounded-full border border-yellow-500/30">
                        <Heart size={16} className="text-yellow-500 fill-yellow-500 md:size-5" />
                        <span className="font-black text-lg md:text-2xl text-yellow-500">{artists[0].totalLikes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {artists[2] && (
                <div onClick={() => viewArtistGallery(artists[2].id)} className="w-full order-3 relative p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-pointer group h-[150px] md:h-[250px] animate-pulse-subtle">
                  <Flame size={30} className="md:size-10 text-orange-600 absolute top-4 right-4 md:top-6 md:right-6" />
                  <div className="absolute -top-4 -left-2 md:-top-6 text-5xl md:text-7xl font-black italic text-orange-600/10">#3</div>
                  <div className="mt-4 md:mt-8">
                    <h3 className="text-lg md:text-xl font-black uppercase italic truncate text-zinc-400">{artists[2].displayName}</h3>
                    <div className="flex items-center gap-2 mt-2 md:mt-4 bg-zinc-800/50 w-fit px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
                        <Heart size={14} className="text-red-500 fill-red-500" />
                        <span className="font-black text-sm md:text-lg">{artists[2].totalLikes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* List View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 md:px-8 mb-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Global Ranking Queue</span>
                 <div className="h-px flex-1 mx-6 bg-gradient-to-r from-zinc-800 to-transparent" />
              </div>

              {artists.slice(3).map((artist, index) => {
                const position = index + 4;
                const isMe = artist.id === (currentUser?.uid || userData?.id);
                return (
                  <div 
                    key={artist.id} 
                    onClick={() => viewArtistGallery(artist.id)}
                    className={`group relative flex items-center gap-3 md:gap-6 p-2 rounded-[25px] md:rounded-[30px] transition-all duration-500 cursor-pointer
                    ${isMe ? 'bg-indigo-500/20 border border-indigo-500/50 scale-[1.01] shadow-lg' : 'hover:bg-white/5'}`}
                  >
                    <div className="w-10 md:w-20 text-center">
                        <span className={`text-lg md:text-2xl font-black italic ${isMe ? 'text-indigo-400' : 'text-zinc-800 group-hover:text-zinc-600'}`}>
                            {position.toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex-1 flex items-center gap-3 md:gap-4 py-2 md:py-3">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-colors
                            ${isMe ? 'bg-indigo-500 border-indigo-400 shadow-lg' : 'bg-zinc-900 border-white/5 group-hover:border-white/20'}`}>
                            <User size={18} className={isMe ? "text-white" : "text-zinc-600 group-hover:text-indigo-400"} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-black text-xs md:text-lg uppercase italic tracking-tight flex items-center gap-2 truncate">
                                {artist.displayName}
                                {isMe && <span className="px-1.5 py-0.5 bg-indigo-500 text-[6px] md:text-[8px] rounded-md text-white not-italic shrink-0">YOU</span>}
                            </h4>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-[7px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                                <Zap size={8} className="md:size-2.5" /> {artist.totalCreations || 0} Artifacts
                            </div>
                        </div>
                    </div>

                    <div className="pr-3 md:pr-10">
                        <div className={`flex items-center gap-1.5 md:gap-3 px-3 md:px-6 py-1.5 md:py-3 rounded-xl md:rounded-2xl border transition-all
                            ${isMe ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/5 group-hover:border-indigo-500/50'}`}>
                            <Heart size={12} className={isMe ? "text-white" : "text-red-500"} fill="currentColor" />
                            <span className="font-black text-sm md:text-xl">{artist.totalLikes.toLocaleString()}</span>
                        </div>
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-6 md:py-10 flex flex-col items-center gap-4 group"
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                  <div className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-zinc-900 rounded-xl md:rounded-2xl border border-white/5 group-hover:border-indigo-500/50 transition-all">
                     {loadingMore ? <Loader2 className="animate-spin text-indigo-500" /> : <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />}
                     <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Sync More Agents</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {(currentUser || userData) && (
        <div className="fixed bottom-4 md:bottom-10 left-0 right-0 z-[100] px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-[25px] md:rounded-[35px] p-1.5 md:p-2 shadow-2xl">
              <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 gap-2 md:gap-4">
                
                <div className="flex items-center gap-2.5 md:gap-4 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                        <Target size={20} className="text-white md:size-6" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full animate-pulse" />
                  </div>
                  
                  <div className="truncate">
                    <p className="text-[6px] md:text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                    <h4 className="text-xs md:text-xl font-black text-white italic truncate leading-none uppercase tracking-tighter">
                      {userData ? userData.displayName : (currentUser?.displayName || "Anonymous Agent")}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-8 px-1 md:px-6">
                    <div className="text-center">
                        <p className="text-[6px] md:text-[8px] font-black text-zinc-500 uppercase mb-0.5 md:mb-1">Likes</p>
                        <div className="flex items-center gap-1 justify-center">
                            <Heart size={8} className="text-red-500 md:size-2.5" fill="currentColor" />
                            <span className="text-xs md:text-lg font-black text-white">
                                {userData?.totalLikes?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[6px] md:text-[8px] font-black text-indigo-400 uppercase mb-0.5 md:mb-1">Rank</p>
                        <p className="text-lg md:text-3xl font-black italic bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent leading-none">
                            #{userRank}
                        </p>
                    </div>
                </div>

                <button 
                  onClick={() => viewArtistGallery(currentUser?.uid || userData?.id)}
                  className="group flex items-center justify-center bg-white text-black w-10 h-10 md:w-auto md:h-14 md:px-6 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shrink-0"
                >
                  <span className="hidden md:inline mr-2">Portal</span>
                  <ExternalLink size={14} className="group-hover:rotate-45 transition-transform md:size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}