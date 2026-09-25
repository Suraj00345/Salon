import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Loading from "../components/common/Loader";

import useAppointmentStore from "../store/appointment.store";
import useAuthStore from "../store/auth.store";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const appointments = useAppointmentStore((state) => state.appointments);

  const loading = useAppointmentStore((state) => state.loading);

  const error = useAppointmentStore((state) => state.error);

  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments,
  );

  const cancel = useAppointmentStore((state) => state.cancel);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      await cancel(id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-stone-500">Welcome back,</p>

              <h1 className="text-3xl font-bold">{user?.name}</h1>
            </div>

            <Link
              to="/services"
              className="rounded-xl bg-stone-900 px-6 py-3 text-center font-semibold text-white"
            >
              Book Appointment
            </Link>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold">My Appointments</h2>

            {loading && <Loading />}

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && appointments.length === 0 && (
              <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-stone-500">
                  You don't have any appointments yet.
                </p>

                <Link
                  to="/services"
                  className="mt-5 inline-block font-semibold text-amber-600"
                >
                  Book your first appointment →
                </Link>
              </div>
            )}

            {!loading && appointments.length > 0 && (
              <div className="mt-6 space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div>
                        <h3 className="text-xl font-bold">
                          {appointment.service?.name || "Salon Service"}
                        </h3>

                        <p className="mt-2 text-sm text-stone-500">
                          Stylist: {appointment.staff?.name || "Assigned Staff"}
                        </p>

                        <p className="mt-1 text-sm text-stone-500">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                          {appointment.status}
                        </span>

                        {appointment.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
