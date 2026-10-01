import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import { getAppointmentById } from "../api/appointment.api";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const appointmentId = location.state?.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch appointment details
  // --------------------------------------------------
  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      setError("Appointment information is missing.");
      return;
    }

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAppointmentById(appointmentId);

        setAppointment(data.appointment);
      } catch (error) {
        console.error("Get Appointment Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load appointment details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // --------------------------------------------------
  // Missing appointment ID
  // --------------------------------------------------
  if (!appointmentId) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
            <h1 className="text-2xl font-bold text-stone-900">
              Appointment information not found
            </h1>

            <p className="mt-3 text-stone-500">
              Please check your dashboard for your appointments.
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900" />

            <p className="mt-4 text-stone-500">
              Loading appointment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------
  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-stone-900">
              Unable to load appointment
            </h1>

            <p className="mt-3 text-stone-500">
              {error || "Appointment details could not be found."}
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Appointment data
  // --------------------------------------------------

  const service = appointment.service || appointment.Service;
  const staff = appointment.staff || appointment.Staff;

  const appointmentDate = appointment.appointmentDate || appointment.date;

  const startTime = appointment.startTime || appointment.time;

  const endTime = appointment.endTime;

  const paymentStatus = appointment.paymentStatus || "paid";

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

  let formattedDate = appointmentDate;

  if (appointmentDate) {
    formattedDate = new Date(`${appointmentDate}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-bold text-stone-900">
            Appointment Confirmed!
          </h1>

          <p className="mt-3 text-stone-500">
            Your payment was successful and your salon appointment has been
            confirmed.
          </p>

          {/* Appointment Details */}
          <div className="mt-8 rounded-2xl bg-stone-50 p-5 text-left">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-stone-500">Appointment ID</span>

              <span className="font-semibold text-stone-900">
                #{appointment.id}
              </span>
            </div>

            {service && (
              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-stone-500">Service</span>

                <span className="text-right font-semibold text-stone-900">
                  {service.name}
                </span>
              </div>
            )}

            {staff && (
              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-stone-500">Stylist</span>

                <span className="text-right font-semibold text-stone-900">
                  {staff.name}
                </span>
              </div>
            )}

            {appointmentDate && (
              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-stone-500">Date</span>

                <span className="text-right font-semibold text-stone-900">
                  {formattedDate}
                </span>
              </div>
            )}

            {startTime && (
              <div className="mt-4 flex justify-between gap-4">
                <span className="text-sm text-stone-500">Time</span>

                <span className="text-right font-semibold text-stone-900">
                  {startTime}
                  {endTime ? ` - ${endTime}` : ""}
                </span>
              </div>
            )}

            {/* Appointment Status */}
            <div className="mt-4 flex justify-between gap-4">
              <span className="text-sm text-stone-500">Appointment Status</span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold capitalize text-green-700">
                {appointment.status || "confirmed"}
              </span>
            </div>

            {/* Payment Status */}
            <div className="mt-4 flex justify-between gap-4">
              <span className="text-sm text-stone-500">Payment</span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold capitalize text-green-700">
                {paymentStatus}
              </span>
            </div>

            {/* Amount */}
            {service?.price !== undefined && (
              <div className="mt-5 border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900">
                    Amount Paid
                  </span>

                  <span className="text-xl font-bold text-amber-600">
                    ₹{Number(service.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl bg-stone-900 py-3 font-semibold text-white transition hover:bg-stone-800"
            >
              View My Appointments
            </Link>

            <Link
              to="/services"
              className="rounded-xl border border-stone-300 py-3 font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Book Another Appointment
            </Link>
          </div>

          <p className="mt-6 text-xs text-stone-400">
            Please keep your appointment ID for future reference.
          </p>
        </div>
      </div>
    </div>
  );
}
