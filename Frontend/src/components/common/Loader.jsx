import React from "react";
import { Sparkles } from "lucide-react";

export default function LuxuryRingLoader({ text = "LUMIÈRE" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-24 h-24 rounded-full border-2 border-stone-800 border-t-amber-400 animate-spin" />

        {/* Inner reverse spinning ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-stone-800 border-b-amber-200 animate-[spin_1.5s_linear_infinite_reverse]" />

        {/* Center Sparkle Icon */}
        <div className="absolute flex items-center justify-center text-amber-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="mt-6 flex flex-col items-center space-y-2">
        <span className="text-amber-200 font-serif tracking-[0.3em] uppercase text-sm font-semibold animate-pulse">
          {text}
        </span>
        <span className="text-xs text-stone-500 font-light tracking-widest uppercase">
          Preparing your experience...
        </span>
      </div>
    </div>
  );
}
