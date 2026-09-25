import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  Star,
  MapPin,
  Sparkles,
  TrendingUp,
  Download,
  ChevronLeft,
  Quote,
  Scissors,
  Globe2,
  Store,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  nearbySalons,
  trendingSalons,
  newServices,
  reviews,
} from "../../assets/data";

export default function Home() {
  const navigate = useNavigate();

  // ==================== REVIEW CAROUSEL ====================

  const [activeReview, setActiveReview] = useState(0);

  const prevReview = () => {
    setActiveReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // ==================== STATS COUNTER ====================

  const [counts, setCounts] = useState({
    stores: 0,
    countries: 0,
    stylists: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;

    const targetStores = 450;
    const targetCountries = 28;
    const targetStylists = 3500;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;

      const progress = currentStep / steps;

      setCounts({
        stores: Math.min(Math.floor(targetStores * progress), targetStores),
        countries: Math.min(
          Math.floor(targetCountries * progress),
          targetCountries,
        ),
        stylists: Math.min(
          Math.floor(targetStylists * progress),
          targetStylists,
        ),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // ==================== RENDER ====================

  return (
    <div className="bg-stone-50 overflow-hidden">
      {/* ==================== HERO ==================== */}

      <section className="relative min-h-[90vh] bg-stone-950 text-stone-100 flex items-center justify-center overflow-hidden py-24">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-300/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT */}

          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-stone-900/80 border border-amber-400/30 px-4 py-2 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />

              <span className="text-xs font-semibold tracking-widest text-amber-300 uppercase">
                Redefining Glamour & Luxury
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-serif leading-[1.1] tracking-tight">
              Elegance is{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent italic">
                an art form.
              </span>
            </h1>

            <p className="text-stone-300 text-lg sm:text-xl font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Step into curated sanctuaries of pampering. Discover elite
              artists, instant real-time bookings, and tailor-made luxury
              experiences tailored specifically to you.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-amber-400/20 hover:scale-[1.02] flex items-center justify-center space-x-3"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Experience</span>
              </Link>

              <a
                href="#recommended"
                className="w-full sm:w-auto bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800 font-medium px-8 py-4 rounded-2xl backdrop-blur-md transition-all text-center"
              >
                Explore Nearby
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-stone-400 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Instant Confirmation</span>
              </div>

              <span>•</span>

              <div className="flex items-center space-x-1 text-amber-300">
                <Star className="w-4 h-4 fill-amber-300" />
                <span className="font-semibold text-stone-200">4.9/5</span>
                <span className="text-stone-400">(10k+ reviews)</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
                  alt="High End Salon Styling"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-4 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800">
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                    Featured Salon
                  </p>

                  <p className="text-lg font-serif text-stone-100">
                    Lumière Flagship Suites
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 z-20 hidden sm:flex items-center space-x-3 bg-stone-900/90 backdrop-blur-md border border-stone-800 p-4 rounded-2xl shadow-2xl">
                <div className="p-3 bg-amber-400/20 text-amber-300 rounded-xl">
                  <Scissors className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-xs text-stone-400">Top Rated Service</p>

                  <p className="text-sm font-semibold text-stone-100">
                    Balayage & Styling
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== RECOMMENDED ==================== */}

      <section
        id="recommended"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 font-semibold text-xs uppercase tracking-widest mb-2">
              <MapPin className="w-4 h-4" />
              <span>Location Aware</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
              Recommended Near You
            </h2>
          </div>

          <p className="text-stone-500 text-sm mt-2 md:mt-0 max-w-md">
            Handpicked premium beauty destinations based on top ratings and
            proximity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nearbySalons.map((salon) => (
            <div
              key={salon.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />

                  <span>{salon.dist}</span>
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-serif text-stone-900">
                    {salon.name}
                  </h3>

                  <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 text-xs font-semibold text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />

                    <span>{salon.rating}</span>
                  </div>
                </div>

                <p className="text-stone-500 text-xs mb-6">
                  {salon.location} • ({salon.reviews} reviews)
                </p>

                <Link
                  to="/register"
                  className="mt-auto w-full py-3 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Book Spot</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== TRENDING ==================== */}

      <section className="py-20 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 text-amber-600 font-semibold text-xs uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" />
              <span>Hot & Rising</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
              Trending & New Additions
            </h2>

            <div className="w-12 h-0.5 bg-amber-400 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingSalons.map((salon) => (
              <div
                key={salon.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-60 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {salon.tag}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-serif text-stone-900">
                    {salon.name}
                  </h3>

                  <div className="flex items-center space-x-1 text-xs font-bold text-stone-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                    <span>{salon.rating}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                  {salon.desc}
                </p>

                <Link
                  to="/register"
                  className="block w-full py-2.5 rounded-xl border border-stone-900 text-stone-900 font-medium text-sm hover:bg-stone-900 hover:text-amber-300 transition-all text-center"
                >
                  Explore Salon
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEW SERVICES ==================== */}

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-amber-600 font-semibold text-xs uppercase tracking-widest">
            Innovation In Pampering
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
            Newly Introduced Services
          </h2>

          <p className="text-stone-500 text-sm">
            Experience cutting-edge spa treatments newly launched across partner
            salons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <span className="absolute top-3 right-3 bg-stone-900/90 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {service.tag}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-serif text-stone-900 mb-1">
                  {service.title}
                </h3>

                <p className="text-xs text-stone-400 mb-4">
                  {service.duration} Session
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xl font-bold text-stone-900">
                    {service.price}
                  </span>

                  <Link
                    to="/register"
                    className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-medium text-xs px-4 py-2.5 rounded-lg transition-colors"
                  >
                    Reserve Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== DOWNLOAD APP ==================== */}

      <section className="py-24 bg-stone-950 text-stone-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20 inline-block">
              Salon In Your Pocket
            </span>

            <h2 className="text-4xl sm:text-5xl font-serif text-stone-100 leading-tight">
              Download our{" "}
              <span className="text-amber-300 italic">Android App</span>
            </h2>

            <p className="text-stone-300 text-base sm:text-lg font-light max-w-xl mx-auto lg:mx-0">
              Get real-time appointment tracking, exclusive app-only luxury
              discounts, instant stylist chat, and seamless one-click rebooking.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold px-6 py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-3">
                <Download className="w-5 h-5" />

                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none">
                    Get it on
                  </p>

                  <p className="text-sm font-bold">Google Play Store</p>
                </div>
              </button>
            </div>
          </div>

          {/* PHONE */}

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-72 sm:w-80 h-[560px] bg-stone-900 border-[8px] border-stone-800 rounded-[48px] shadow-2xl p-4 flex flex-col animate-bounce-slow hover:rotate-1 transition-transform duration-500">
              <div className="w-28 h-4 bg-stone-800 rounded-full mx-auto mb-4" />

              <div className="bg-stone-950 rounded-[32px] p-4 flex-grow flex flex-col justify-between border border-stone-800/80 overflow-hidden text-left relative">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />

                    <span className="text-xs font-serif tracking-widest text-amber-200">
                      LUMIÈRE
                    </span>
                  </div>

                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                <div className="space-y-3 my-auto">
                  <div className="bg-stone-900/90 border border-stone-800 p-3 rounded-2xl space-y-2 transform hover:scale-105 transition-transform">
                    <p className="text-[10px] text-amber-400 uppercase font-semibold">
                      Appointment Today
                    </p>

                    <p className="text-xs font-serif text-stone-100">
                      Japanese Head Spa Ritual
                    </p>

                    <p className="text-[10px] text-stone-400">
                      4:30 PM • Lumière Downtown
                    </p>
                  </div>

                  <div className="bg-amber-400 text-stone-950 p-3 rounded-2xl text-center space-y-1">
                    <p className="text-xs font-bold">App Discount Applied!</p>

                    <p className="text-[10px]">20% OFF next booking</p>
                  </div>
                </div>

                <div className="w-full py-2.5 bg-stone-900 text-center rounded-xl text-stone-300 text-xs font-medium border border-stone-800">
                  Tap to Confirm Booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS ==================== */}

      <section className="py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-amber-100 text-amber-800 rounded-full mb-6">
            <Quote className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-12">
            Client Stories
          </h2>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-lg relative min-h-[260px] flex flex-col justify-between">
            <p className="text-stone-700 text-lg sm:text-xl font-serif italic leading-relaxed mb-8">
              "{reviews[activeReview].text}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
              <div className="flex items-center space-x-4">
                <img
                  src={reviews[activeReview].avatar}
                  alt={reviews[activeReview].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                />

                <div className="text-left">
                  <h4 className="text-base font-serif text-stone-900">
                    {reviews[activeReview].name}
                  </h4>

                  <p className="text-xs text-stone-400">
                    {reviews[activeReview].role}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={prevReview}
                  className="p-3 bg-stone-100 hover:bg-stone-900 hover:text-amber-300 rounded-full transition-colors text-stone-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextReview}
                  className="p-3 bg-stone-100 hover:bg-stone-900 hover:text-amber-300 rounded-full transition-colors text-stone-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}

      <section className="py-20 bg-stone-900 text-stone-100 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-stone-950/60 rounded-3xl border border-stone-800 space-y-2">
              <div className="inline-flex p-3 bg-amber-400/10 text-amber-400 rounded-2xl mb-2">
                <Store className="w-8 h-8" />
              </div>

              <p className="text-4xl sm:text-5xl font-serif font-bold text-amber-200">
                {counts.stores}+
              </p>

              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium">
                Partner Stores
              </p>
            </div>

            <div className="p-8 bg-stone-950/60 rounded-3xl border border-stone-800 space-y-2">
              <div className="inline-flex p-3 bg-amber-400/10 text-amber-400 rounded-2xl mb-2">
                <Globe2 className="w-8 h-8" />
              </div>

              <p className="text-4xl sm:text-5xl font-serif font-bold text-amber-200">
                {counts.countries}
              </p>

              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium">
                Available Countries
              </p>
            </div>

            <div className="p-8 bg-stone-950/60 rounded-3xl border border-stone-800 space-y-2">
              <div className="inline-flex p-3 bg-amber-400/10 text-amber-400 rounded-2xl mb-2">
                <Users className="w-8 h-8" />
              </div>

              <p className="text-4xl sm:text-5xl font-serif font-bold text-amber-200">
                {counts.stylists}+
              </p>

              <p className="text-sm uppercase tracking-widest text-stone-400 font-medium">
                Stylist Professionals
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
