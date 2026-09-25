import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Clock,
  ArrowRight,
  RotateCw,
  Search,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loader";
import useServiceStore from "../store/service.store";

export default function Services() {
  const services = useServiceStore((state) => state.services) || [];
  const loading = useServiceStore((state) => state.loading);
  const error = useServiceStore((state) => state.error);
  const fetchServices = useServiceStore((state) => state.fetchServices);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Extract unique categories dynamically if available
  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [services]);

  // Filtered services based on search and category
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
      <Navbar />

      <main className="relative flex-grow px-4 py-16 sm:px-6 lg:px-8">
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-96 w-[32rem] rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-72 w-72 rounded-full bg-amber-400/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-stone-900/80 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.25em] text-amber-300 uppercase">
                Boutique Collection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight bg-gradient-to-b from-stone-100 via-stone-200 to-amber-200/70 bg-clip-text text-transparent">
              Signature Rituals & Services
            </h1>

            <p className="text-sm sm:text-base font-light text-stone-400 leading-relaxed max-w-xl mx-auto">
              Indulge in tailored hair styling, restorative scalp therapy, and
              transformative skin rituals designed for ultimate relaxation.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          {!loading && !error && services.length > 0 && (
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-y border-stone-800/80 py-6">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20"
                        : "bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-amber-200 hover:border-amber-400/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search treatments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex min-h-[50vh] items-center justify-center">
              <Loading />
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-rose-500/30 bg-rose-950/30 p-6 text-center text-rose-300 backdrop-blur-md flex flex-col items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-rose-400" />
              <p className="text-sm font-medium">{error}</p>
              <button
                onClick={() => fetchServices()}
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl bg-rose-900/50 border border-rose-700/50 text-xs font-semibold hover:bg-rose-900 transition-all"
              >
                <RotateCw size={14} /> Try Again
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && filteredServices.length > 0 && (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <div
                  key={service.id || service._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  {/* Card Visual Header / Image Placeholder */}
                  <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-stone-900">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950">
                        <div className="p-4 rounded-full border border-amber-400/20 bg-stone-950/80 text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      </div>
                    )}

                    {/* Category Badge overlay */}
                    {service.category && (
                      <span className="absolute top-4 left-4 rounded-full border border-stone-800 bg-stone-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-md">
                        {service.category}
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                        {service.name}
                      </h2>

                      <p className="mt-3 line-clamp-3 text-sm font-light text-stone-400 leading-relaxed">
                        {service.description ||
                          "A bespoke treatment crafted with premium organic botanicals to restore balance and harmony."}
                      </p>
                    </div>

                    {/* Price, Duration & Action Link */}
                    <div className="mt-8 flex items-end justify-between border-t border-stone-800/80 pt-5">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-amber-400 font-serif">
                            ₹{service.price}
                          </span>
                        </div>

                        {service.duration && (
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400 font-medium">
                            <Clock size={13} className="text-amber-400/80" />
                            <span>{service.duration} mins</span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/services/${service.id || service._id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-stone-800/80 border border-stone-700/80 px-4 py-2.5 text-xs font-semibold text-stone-200 transition-all hover:bg-amber-400 hover:text-stone-950 hover:border-amber-400 shadow-md group-hover:shadow-amber-400/10"
                      >
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State / No Services Found */}
          {!loading && !error && filteredServices.length === 0 && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-stone-800/60 bg-stone-900/40 p-12 text-center backdrop-blur-md relative overflow-hidden my-8">
              {/* Ambient Glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />

              {/* Luxury Icon */}
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-800 bg-stone-950/80 text-amber-400 shadow-xl">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-serif text-amber-100 mb-2">
                {searchTerm ? "No Matching Services" : "No Services Available"}
              </h3>
              <p className="max-w-md text-sm font-light text-stone-400 leading-relaxed mb-6">
                {searchTerm
                  ? `We couldn't find any treatments matching "${searchTerm}". Try resetting your filters.`
                  : "Our boutique menu is currently being curated. Please check back shortly or explore our other offerings."}
              </p>

              {/* Quick Action */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  fetchServices();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:border-amber-400/40 hover:bg-stone-800 transition-all shadow-lg"
              >
                <RotateCw size={14} />
                <span>Reset Menu</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
