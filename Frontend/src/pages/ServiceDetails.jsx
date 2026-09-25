import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loader";

import useServiceStore from "../store/service.store";
import useBookingStore from "../store/booking.store";

export default function ServiceDetails() {
  const { id } = useParams();

  const service = useServiceStore((state) => state.selectedService);

  const loading = useServiceStore((state) => state.loading);

  const error = useServiceStore((state) => state.error);

  const fetchServiceById = useServiceStore((state) => state.fetchServiceById);

  const setService = useBookingStore((state) => state.setService);

  useEffect(() => {
    fetchServiceById(id);
  }, [id, fetchServiceById]);

  const handleBook = () => {
    setService(service);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          {loading && <Loading />}

          {error && (
            <div className="rounded-lg bg-red-50 p-5 text-red-600">{error}</div>
          )}

          {!loading && service && (
            <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
              <div className="flex min-h-[400px] items-center justify-center bg-stone-900">
                <span className="text-8xl">✨</span>
              </div>

              <div className="p-8 md:p-12">
                <p className="font-semibold uppercase tracking-widest text-amber-600">
                  Salon Service
                </p>

                <h1 className="mt-3 text-4xl font-bold text-stone-900">
                  {service.name}
                </h1>

                <p className="mt-6 leading-7 text-stone-600">
                  {service.description}
                </p>

                <div className="mt-8 flex gap-10">
                  <div>
                    <p className="text-sm text-stone-400">Price</p>

                    <p className="text-2xl font-bold text-amber-600">
                      ₹{service.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-stone-400">Duration</p>

                    <p className="text-2xl font-bold text-stone-900">
                      {service.duration} min
                    </p>
                  </div>
                </div>

                <Link
                  to="/booking"
                  onClick={handleBook}
                  className="mt-10 block rounded-xl bg-stone-900 px-6 py-4 text-center font-semibold text-white transition hover:bg-stone-800"
                >
                  Book This Service
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
