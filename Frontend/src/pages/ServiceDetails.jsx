// src/pages/ServiceDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import { getServiceById } from "../api/service.api";
import { getServiceReviews } from "../api/review.api";

// IMPORT BOOKING STORE
import useBookingStore from "../store/booking.store";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // GET SETTERS FROM BOOKING STORE
  const setService = useBookingStore((state) => state.setService);
  const setStaff = useBookingStore((state) => state.setStaff);
  const setDate = useBookingStore((state) => state.setDate);
  const setTime = useBookingStore((state) => state.setTime);

  const [service, setServiceState] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getServiceById(id);

        if (!data?.service) {
          setError("Service not found.");
          return;
        }

        setServiceState(data.service);
      } catch (err) {
        console.error("Fetch Service Error:", err);
        setError(
          err.response?.data?.message || "Failed to load service details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError("");
        const data = await getServiceReviews(id);
        setReviews(data?.reviews || []);
      } catch (err) {
        console.error("Fetch Reviews Error:", err);
        setReviewsError(
          err.response?.data?.message || "Failed to load reviews.",
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
    return total / reviews.length;
  }, [reviews]);

  const formattedAverageRating = averageRating.toFixed(1);

  // 3. SET SERVICE DIRECTLY INTO ZUSTAND BEFORE NAVIGATING
  const handleBookNow = () => {
    if (!service) return;
    // Use either service.id or service._id (depending on your database)
    const serviceId = service.id || service._id;

    // Reset previous booking states and set the current service
    setService(service);
    setStaff(null);
    setDate(null);
    setTime(null);

    // Now navigate safely
    navigate(`/booking`);
  };

  // ... (keep the rest of your JSX as is)

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-stone-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>

            <h1 className="text-2xl font-semibold text-stone-900">
              Service Not Found
            </h1>

            <p className="mt-3 text-stone-600">
              {error || "The requested service could not be found."}
            </p>

            <Link
              to="/services"
              className="inline-block mt-6 px-5 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          to="/services"
          className="text-sm text-stone-600 hover:text-stone-900"
        >
          ← Back to Services
        </Link>

        {/* Service information */}
        <section className="mt-6 bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-stone-900">
                    {service.name}
                  </h1>

                  {service.isActive !== false && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Available
                    </span>
                  )}
                </div>

                <p className="mt-4 text-stone-600 leading-7">
                  {service.description ||
                    "No description available for this service."}
                </p>

                {/* Rating */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= Math.round(averageRating)
                            ? "text-yellow-400 text-xl"
                            : "text-stone-300 text-xl"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="font-semibold text-stone-900">
                    {formattedAverageRating}
                  </span>

                  <span className="text-sm text-stone-500">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="md:text-right">
                <p className="text-sm text-stone-500">Price</p>

                <p className="text-3xl font-bold text-stone-900 mt-1">
                  ₹{service.price}
                </p>

                <p className="text-sm text-stone-500 mt-2">
                  {service.duration} minutes
                </p>
              </div>
            </div>

            {/* Service metadata */}
            <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <p className="text-sm text-stone-500">Duration</p>

                <p className="font-semibold text-stone-900 mt-1">
                  {service.duration} minutes
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Price</p>

                <p className="font-semibold text-stone-900 mt-1">
                  ₹{service.price}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Customer Reviews</p>

                <p className="font-semibold text-stone-900 mt-1">
                  {reviews.length}
                </p>
              </div>
            </div>

            {/* Book */}
            <div className="mt-8">
              <button
                onClick={handleBookNow}
                disabled={service.isActive === false}
                className="w-full md:w-auto px-8 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {service.isActive === false
                  ? "Currently Unavailable"
                  : "Book This Service"}
              </button>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                Customer Reviews
              </h2>

              <p className="text-stone-600 mt-1">
                See what customers say about this service.
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="text-sm text-stone-500">
                Average rating:{" "}
                <span className="font-semibold text-stone-900">
                  {formattedAverageRating}/5
                </span>
              </div>
            )}
          </div>

          {reviewsLoading ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center">
              <p className="text-stone-600">Loading reviews...</p>
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
              {reviewsError}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center">
              <div className="text-4xl mb-3">☆</div>

              <h3 className="text-lg font-semibold text-stone-900">
                No reviews yet
              </h3>

              <p className="text-stone-600 mt-2">
                Be the first customer to review this service.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
                >
                  {/* Review header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-stone-900">
                        {review.user?.name || "Customer"}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-stone-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <span className="text-sm text-stone-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <span className="text-xs text-stone-500">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="mt-4 text-stone-700 leading-7">
                      {review.comment}
                    </p>
                  )}

                  {/* Staff response */}
                  {review.staffResponse && (
                    <div className="mt-5 ml-4 border-l-4 border-stone-300 pl-4">
                      <p className="text-sm font-semibold text-stone-900">
                        Response from staff
                      </p>

                      <p className="mt-2 text-sm text-stone-600 leading-6">
                        {review.staffResponse}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
