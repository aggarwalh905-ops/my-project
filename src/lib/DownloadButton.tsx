"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  imageUrl: string;
  watermarkText: string;
}

export default function DownloadButton({ imageUrl, watermarkText }: DownloadButtonProps) {
  const handleDownload = async () => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure Watermark Style
      const fontSize = Math.floor(canvas.width * 0.04); // Responsive font size
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Semi-transparent white
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";

      // Add text shadow for visibility on light backgrounds
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;

      // Draw text at bottom right (with 20px padding)
      ctx.fillText(watermarkText, canvas.width - 20, canvas.height - 20);

      // Trigger Download
      const link = document.createElement("a");
      link.download = `imagynex-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Cleanup
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <button
      onClick={handleDownload}
      className="flex-[2] bg-white text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
    >
      <Download size={18} /> Download Art
    </button>
  );
}