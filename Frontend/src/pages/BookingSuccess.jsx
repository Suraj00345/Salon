import { Link, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";

export default function BookingSuccess() {
  const location = useLocation();

  const appointment = location.state?.appointment;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-stone-900">
            Appointment Confirmed!
          </h1>

          <p className="mt-3 text-stone-500">
            Your salon appointment has been successfully booked.
          </p>

          {appointment && (
            <div className="mt-8 rounded-xl bg-stone-50 p-5 text-left">
              <p>
                <strong>Appointment ID:</strong> {appointment.id}
              </p>

              {appointment.date && (
                <p className="mt-2">
                  <strong>Date:</strong> {appointment.date}
                </p>
              )}

              {appointment.time && (
                <p className="mt-2">
                  <strong>Time:</strong> {appointment.time}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl bg-stone-900 py-3 font-semibold text-white"
            >
              View My Appointments
            </Link>

            <Link
              to="/services"
              className="rounded-xl border border-stone-300 py-3 font-semibold"
            >
              Book Another
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
