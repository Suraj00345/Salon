import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useBookingStore from "../store/booking.store";
import useAppointmentStore from "../store/appointment.store";

export default function BookingSummary() {
  const navigate = useNavigate();

  const { service, staff, date, time, clearBooking } = useBookingStore();

  const {
    bookAppointment,
    loading,
    error: appointmentError,
  } = useAppointmentStore();

  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Make sure booking information exists
  // --------------------------------------------------
  useEffect(() => {
    if (!service || !staff || !date || !time) {
      navigate("/booking", { replace: true });
    }
  }, [service, staff, date, time, navigate]);

  if (!service || !staff || !date || !time) {
    return null;
  }

  // --------------------------------------------------
  // Calculate end time from service duration
  // --------------------------------------------------
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    const totalMinutes = hours * 60 + minutes + Number(duration);

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0",
    )}`;
  };

  const endTime = calculateEndTime(time, service.duration);

  // --------------------------------------------------
  // Format date for display
  // --------------------------------------------------
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  // --------------------------------------------------
  // Confirm booking
  // --------------------------------------------------
  const handleConfirmBooking = async () => {
    try {
      setError("");

      const bookingData = {
        staffId: staff.id,
        serviceId: service.id,
        appointmentDate: date,
        startTime: time,
        endTime,
        notes: notes.trim(),
      };

      const data = await bookAppointment(bookingData);

      /*
       * Backend should return:
       *
       * {
       *   success: true,
       *   appointment: {
       *      id: 1,
       *      ...
       *   }
       * }
       */

      const appointmentId = data?.appointment?.id;

      if (!appointmentId) {
        setError(
          "Appointment was created but appointment ID was not returned.",
        );
        return;
      }

      /*
       * For now, move to the payment page.
       *
       * We will connect Razorpay in the next step.
       */
      navigate(`/booking/payment/${appointmentId}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          appointmentError ||
          "Failed to create appointment.",
      );
    }
  };

  // --------------------------------------------------
  // Go back
  // --------------------------------------------------
  const handleBack = () => {
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div>
          <p className="font-semibold uppercase tracking-widest text-amber-600">
            Booking Summary
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            Review your appointment
          </h1>

          <p className="mt-2 text-stone-500">
            Check everything before confirming your appointment.
          </p>
        </div>

        {/* Error */}
        {(error || appointmentError) && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error || appointmentError}
          </div>
        )}

        {/* Summary Card */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
          {/* Service */}
          <div className="border-b border-stone-100 p-6">
            <p className="text-sm text-stone-500">Service</p>

            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {service.name}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {service.duration} minutes
                </p>
              </div>

              <p className="text-xl font-bold text-amber-600">
                ₹{Number(service.price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Staff */}
          <div className="border-b border-stone-100 p-6">
            <p className="text-sm text-stone-500">Stylist</p>

            <h2 className="mt-2 text-lg font-bold text-stone-900">
              {staff.name}
            </h2>

            {staff.specialization && (
              <p className="mt-1 text-sm text-stone-500">
                {staff.specialization}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid gap-6 border-b border-stone-100 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">Date</p>

              <p className="mt-2 font-semibold text-stone-900">
                {formattedDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-stone-500">Time</p>

              <p className="mt-2 font-semibold text-stone-900">
                {time} - {endTime}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="p-6">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-stone-700"
            >
              Additional Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you'd like us to know?"
              rows={4}
              maxLength={500}
              className="mt-3 w-full resize-none rounded-xl border border-stone-300 p-4 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />

            <p className="mt-1 text-right text-xs text-stone-400">
              {notes.length}/500
            </p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-bold text-stone-900">Payment Summary</h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">{service.name}</span>

              <span className="font-medium text-stone-800">
                ₹{Number(service.price).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t border-stone-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">Total</span>

                <span className="text-xl font-bold text-amber-600">
                  ₹{Number(service.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="rounded-xl border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={loading}
            className="rounded-xl bg-stone-900 px-8 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Appointment..." : "Confirm & Pay"}
          </button>
        </div>

        {/* Payment notice */}
        <p className="mt-4 text-center text-xs text-stone-400">
          You will be redirected to secure payment after confirming your
          appointment.
        </p>
      </div>
    </div>
  );
}
