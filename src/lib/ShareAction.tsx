"use client";

import { Share2 } from "lucide-react";

interface ShareProps {
  imageUrl: string;
  prompt: string;
}

export default function ShareAction({ imageUrl, prompt }: ShareProps) {
  const handleShare = async () => {
    try {
      // 1. Image fetch karna
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Original image draw karna
        ctx.drawImage(img, 0, 0);

        // --- WATERMARK SETTINGS ---
        const padding = img.width * 0.02; // 2% margin
        const fontSize = Math.max(img.width * 0.04, 20); // Responsive size
        
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 15;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        
        // Drawing text: Imagynex.AI
        ctx.fillText("Imagynex.AI", img.width - padding, img.height - padding);

        // 2. Shareable file banana
        canvas.toBlob(async (shareBlob) => {
          if (!shareBlob) return;
          const file = new File([shareBlob], "imagynex-ai-art.png", { type: "image/png" });

          if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "AI Art by Imagynex",
              text: `Prompt: ${prompt}`,
            });
          } else {
            // Fallback: Copy Link
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied! Image sharing is not supported on this browser.");
          }
        }, "image/png");
      };
    } catch (err) {
      console.error("Share error:", err);
      alert("Failed to process image for sharing.");
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="p-4 rounded-2xl bg-zinc-800 border border-white/10 hover:bg-zinc-700 transition-all active:scale-90"
    >
      <Share2 size={20} />
    </button>
  );
}