import React from "react";
import { Sparkles } from "lucide-react";

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div>
          <div className="flex items-center space-x-2 text-amber-200 font-serif text-xl tracking-widest mb-4">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span>LUMIÈRE</span>
          </div>
          <p className="text-sm text-stone-400">
            Redefining beauty with tailored wellness, expert styling, and serene
            luxury experiences.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-stone-200 font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                onClick={() => setCurrentView("home")}
                className="hover:text-amber-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/services"
                onClick={() => setCurrentView("home")}
                className="hover:text-amber-300"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="/stylists"
                onClick={() => setCurrentView("home")}
                className="hover:text-amber-300"
              >
                Stylists
              </a>
            </li>
            <li>
              <button
                onClick={() => setCurrentView("login")}
                className="hover:text-amber-300"
              >
                Account Login
              </button>
            </li>
          </ul>
        </div>

        {/* Operating Hours Column */}
        <div>
          <h4 className="text-stone-200 font-medium mb-3">Hours</h4>
          <ul className="space-y-2 text-sm">
            <li>Mon - Fri: 9:00 AM - 8:00 PM</li>
            <li>Saturday: 9:00 AM - 6:00 PM</li>
            <li>Sunday: 10:00 AM - 4:00 PM</li>
          </ul>
        </div>

        {/* Location Column */}
        <div>
          <h4 className="text-stone-200 font-medium mb-3">Location</h4>
          <p className="text-sm">
            124 Luxe Boulevard, Suite 400
            <br />
            New York, NY 10001
          </p>
          <p className="text-sm mt-2 text-amber-400">+1 (555) 234-5678</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Lumière Salon & Spa. All rights reserved.
      </div>
    </footer>
  );
}
