import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-900 text-stone-100">
          <h3 className="text-xl font-serif text-amber-200">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-stone-700">{children}</div>
      </div>
    </div>
  );
}
