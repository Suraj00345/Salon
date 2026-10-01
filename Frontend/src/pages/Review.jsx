import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAppointmentById } from "../api/appointment.api";
import { createReview } from "../api/review.api";

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAppointmentById(id);

        if (!data?.appointment) {
          setError("Appointment not found.");
          return;
        }

        const appointmentData = data.appointment;

        // Review is allowed only for completed appointments
        if (appointmentData.status !== "completed") {
          setError(
            "You can leave a review only after the appointment is completed.",
          );
          return;
        }

        // Appointment already has a review
        if (appointmentData.review) {
          setError("You have already reviewed this appointment.");
          return;
        }

        setAppointment(appointmentData);
      } catch (error) {
        console.error("Fetch Appointment Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load appointment details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await createReview({
        appointmentId: appointment.id,
        rating,
        comment: comment.trim(),
      });

      setSuccess(data.message || "Review submitted successfully.");

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate(`/booking/${appointment.id}`, {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      console.error("Create Review Error:", error);

      setError(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-600">Loading appointment...</div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>

            <h1 className="text-2xl font-semibold text-stone-900">
              Unable to Leave Review
            </h1>

            <p className="mt-3 text-stone-600">{error}</p>

            <Link
              to="/dashboard"
              className="inline-block mt-6 px-5 py-3 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const service = appointment.service;
  const staff = appointment.staff;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/booking/${appointment.id}`}
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            ← Back to Appointment
          </Link>

          <h1 className="text-3xl font-bold text-stone-900 mt-5">
            Leave a Review
          </h1>

          <p className="text-stone-600 mt-2">Tell us about your experience.</p>
        </div>

        {/* Appointment information */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-5">
            Your Appointment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-stone-500">Service</p>

              <p className="font-medium text-stone-900 mt-1">
                {service?.name || "Service"}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Staff</p>

              <p className="font-medium text-stone-900 mt-1">
                {staff?.name || "Staff member"}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Date</p>

              <p className="font-medium text-stone-900 mt-1">
                {appointment.appointmentDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Time</p>

              <p className="font-medium text-stone-900 mt-1">
                {appointment.startTime?.slice(0, 5)} -{" "}
                {appointment.endTime?.slice(0, 5)}
              </p>
            </div>
          </div>
        </div>

        {/* Review form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-stone-900">
            How was your experience?
          </h2>

          {/* Rating */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Your Rating
            </label>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-stone-300 hover:text-yellow-300"
                  }`}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="text-sm text-stone-500 mt-2">
              {rating === 0 ? "Select a rating" : `${rating} out of 5`}
            </p>
          </div>

          {/* Comment */}
          <div className="mt-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-stone-700 mb-2"
            >
              Your Review
            </label>

            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={6}
              maxLength={1000}
              placeholder="Tell us about your experience..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />

            <div className="text-right text-xs text-stone-500 mt-1">
              {comment.length}/1000
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* Submit */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-stone-900 text-white py-3 px-5 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            <Link
              to={`/booking/${appointment.id}`}
              className="sm:w-auto text-center px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
