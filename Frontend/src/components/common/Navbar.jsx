import React, { useState } from "react";
import {
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  CalendarDays,
  LayoutDashboard,
  Scissors,
  Home,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/auth.store";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-800/80 bg-stone-950/90 text-stone-100 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-stone-900 border border-stone-800 group-hover:border-amber-400/50 transition-colors shadow-inner">
            <Sparkles className="h-5 w-5 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-amber-400/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-widest text-stone-100 group-hover:text-amber-200 transition-colors">
            LUMIÈRE
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
              isActive("/")
                ? "text-amber-300"
                : "text-stone-300 hover:text-amber-300"
            }`}
          >
            Home
            {isActive("/") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
            )}
          </Link>

          <Link
            to="/services"
            className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
              isActive("/services")
                ? "text-amber-300"
                : "text-stone-300 hover:text-amber-300"
            }`}
          >
            Services
            {isActive("/services") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
            )}
          </Link>

          <Link
            to="/stylists"
            className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
              isActive("/stylists")
                ? "text-amber-300"
                : "text-stone-300 hover:text-amber-300"
            }`}
          >
            Stylists
            {isActive("/stylists") && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
            )}
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-stone-800" />

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isActive("/admin")
                      ? "bg-amber-400/10 border-amber-400/40 text-amber-300"
                      : "border-stone-800 text-stone-300 hover:border-amber-400/30 hover:text-amber-200"
                  }`}
                >
                  <LayoutDashboard size={16} className="text-amber-400" />
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isActive("/dashboard")
                      ? "bg-amber-400/10 border-amber-400/40 text-amber-300"
                      : "border-stone-800 text-stone-300 hover:border-amber-400/30 hover:text-amber-200"
                  }`}
                >
                  <CalendarDays size={16} className="text-amber-400" />
                  Dashboard
                </Link>
              )}

              {/* Profile Badge */}
              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-full bg-stone-900 border border-stone-800 px-3.5 py-1.5 text-sm text-stone-200 hover:border-amber-400/40 hover:text-amber-200 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-stone-950">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="font-medium max-w-[120px] truncate">
                  {user?.name || "Profile"}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-stone-300 hover:text-amber-300 transition-colors px-3 py-2"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="relative inline-flex items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-stone-950 hover:bg-amber-300 shadow-md shadow-amber-400/10 hover:shadow-amber-400/20 transition-all active:scale-[0.98]"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="p-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-200 hover:text-amber-300 md:hidden transition-colors"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-800 bg-stone-950/95 backdrop-blur-2xl px-6 py-6 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4">
            {/* Primary Nav Links */}
            <div className="space-y-1 pb-4 border-b border-stone-800/80">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Home size={18} className="text-amber-400" />
                  Home
                </span>
                <ChevronRight size={16} className="text-stone-600" />
              </Link>

              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Scissors size={18} className="text-amber-400" />
                  Services
                </span>
                <ChevronRight size={16} className="text-stone-600" />
              </Link>

              <Link
                to="/stylists"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <User size={18} className="text-amber-400" />
                  Stylists
                </span>
                <ChevronRight size={16} className="text-stone-600" />
              </Link>
            </div>

            {/* Auth Specific Section */}
            {isAuthenticated ? (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-900/80 border border-stone-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-bold text-stone-950 text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-stone-100">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">
                      {user?.role || "Client"}
                    </span>
                  </div>
                </div>

                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all text-sm font-medium"
                  >
                    <LayoutDashboard size={18} className="text-amber-400" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all text-sm font-medium"
                  >
                    <CalendarDays size={18} className="text-amber-400" />
                    My Appointments
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl text-stone-300 hover:bg-stone-900 hover:text-amber-300 transition-all text-sm font-medium"
                >
                  <User size={18} className="text-amber-400" />
                  Account Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium mt-2"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-stone-800 text-stone-200 font-medium text-sm hover:border-amber-400/40 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-amber-400 text-stone-950 font-semibold text-sm hover:bg-amber-300 transition-colors"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
