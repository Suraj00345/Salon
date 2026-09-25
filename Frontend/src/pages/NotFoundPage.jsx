import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Scissors } from "lucide-react";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-stone-950 px-6 text-stone-100">
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-amber-300/5 blur-[120px]" />

        {/* Decorative Grid Lines / Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

        <div className="relative z-10 max-w-lg text-center space-y-6">
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-stone-900/80 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-amber-300 uppercase">
              Sanctuary Not Found
            </span>
          </div>

          {/* Big Stylized 404 Header */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-serif font-extrabold tracking-widest bg-gradient-to-b from-stone-100 via-stone-300 to-amber-400/40 bg-clip-text text-transparent select-none">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-amber-100">
              A Lost Destination in Luxury
            </h2>
            <p className="text-sm font-light text-stone-400 max-w-md mx-auto leading-relaxed">
              The suite or treatment room you are looking for has been relocated
              or does not exist in our current catalog.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20"
            >
              <ArrowLeft size={16} />
              <span>Return Home</span>
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/80 px-7 py-3.5 text-sm font-medium text-stone-300 hover:border-amber-400/40 hover:text-amber-200 transition-all backdrop-blur-md"
            >
              <Scissors size={16} className="text-amber-400" />
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
