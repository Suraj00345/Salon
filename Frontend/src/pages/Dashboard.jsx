import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Loading from "../components/common/Loader";

import useAppointmentStore from "../store/appointment.store";
import useAuthStore from "../store/auth.store";

import { getMyStaffApplication } from "../api/staffApplication.api";

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

  // Application state
  const [application, setApplication] = useState(null);
  const [checkingApp, setCheckingApp] = useState(true);

  const normalizedRole = user?.role?.toLowerCase();

  // 1. Redirect staff or admin away from the customer dashboard
  useEffect(() => {
    if (normalizedRole === "staff") {
      navigate("/staff/dashboard", { replace: true });
    } else if (normalizedRole === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [normalizedRole, navigate]);

  // 2. Fetch customer appointments ONLY if the user is a customer
  useEffect(() => {
    if (normalizedRole === "customer") {
      fetchAppointments();
    }
  }, [fetchAppointments, normalizedRole]);

  // 3. Fetch application status ONLY for customers
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (normalizedRole === "admin" || normalizedRole === "staff") {
        setCheckingApp(false);
        return;
      }

      try {
        setCheckingApp(true);
        const res = await getMyStaffApplication();
        const appData = res?.application || (res?.id ? res : null);

        if (appData && appData.id) {
          setApplication(appData);
        } else {
          setApplication(null);
        }
      } catch (err) {
        setApplication(null);
      } finally {
        setCheckingApp(false);
      }
    };

    if (user && normalizedRole === "customer") {
      fetchApplicationStatus();
    } else {
      setCheckingApp(false);
    }
  }, [user, normalizedRole]);

  // If user is staff or admin, don't render customer UI while redirect is in flight
  if (normalizedRole === "staff" || normalizedRole === "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loading />
      </div>
    );
  }

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

  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Time not available";
    const [hours, minutes] = time.slice(0, 5).split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const getPaymentStatusClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((appointment) => {
    if (appointment.status === "cancelled") return false;
    if (!appointment.appointmentDate) return false;
    const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);
    return appointmentDate >= today;
  });

  const pastAppointments = appointments.filter((appointment) => {
    if (appointment.status === "cancelled") return true;
    if (!appointment.appointmentDate) return false;
    const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);
    return appointmentDate < today;
  });

  const canApplyAsProfessional =
    !checkingApp &&
    !application &&
    normalizedRole !== "staff" &&
    normalizedRole !== "admin";

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-stone-500">Welcome back,</p>

              <h1 className="text-3xl font-bold text-stone-900">
                {user?.name || "Customer"}
              </h1>

              <p className="mt-1 text-sm text-stone-500">
                Manage your salon appointments from here.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* APPLICATION STATUS BADGE (IF ALREADY SUBMITTED) */}
              {application?.status && (
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Staff Application: {application.status}
                </span>
              )}

              {/* APPLY AS PROFESSIONAL BUTTON */}
              {canApplyAsProfessional && (
                <button
                  onClick={() => navigate("/apply-professional")}
                  className="rounded-xl border border-stone-300 bg-white px-5 py-3 font-semibold text-stone-800 transition hover:bg-stone-100"
                >
                  Apply as Professional
                </button>
              )}

              <Link
                to="/services"
                className="rounded-xl bg-stone-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-stone-800"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && <Loading />}

          {!loading && !error && (
            <>
              {/* UPCOMING APPOINTMENTS */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-stone-900">
                    Upcoming Appointments
                  </h2>

                  <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-stone-700">
                    {upcomingAppointments.length}
                  </span>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-2xl">
                      ✂
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-stone-900">
                      No upcoming appointments
                    </h3>

                    <p className="mt-2 text-stone-500">
                      You don't have any upcoming appointments.
                    </p>

                    <Link
                      to="/services"
                      className="mt-5 inline-block font-semibold text-amber-600 hover:text-amber-700"
                    >
                      Book an appointment →
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    {upcomingAppointments.map((appointment) => {
                      const service = appointment.service;
                      const staff = appointment.staff;

                      return (
                        <div
                          key={appointment.id}
                          className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                        >
                          {/* TOP */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-amber-600">
                                Appointment #{appointment.id}
                              </p>

                              <h3 className="mt-1 text-xl font-bold text-stone-900">
                                {service?.name || "Salon Service"}
                              </h3>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>

                          {/* DETAILS */}
                          <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">👤</span>
                              <div>
                                <p className="text-xs text-stone-400">
                                  Stylist
                                </p>
                                <p className="font-medium text-stone-800">
                                  {staff?.name || "Assigned Staff"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-lg">📅</span>
                              <div>
                                <p className="text-xs text-stone-400">Date</p>
                                <p className="font-medium text-stone-800">
                                  {formatDate(appointment.appointmentDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-lg">🕐</span>
                              <div>
                                <p className="text-xs text-stone-400">Time</p>
                                <p className="font-medium text-stone-800">
                                  {formatTime(appointment.startTime)} -{" "}
                                  {formatTime(appointment.endTime)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-lg">💳</span>
                              <div>
                                <p className="text-xs text-stone-400">
                                  Payment
                                </p>
                                <span
                                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                                    appointment.paymentStatus,
                                  )}`}
                                >
                                  {appointment.paymentStatus || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-100 pt-5">
                            <button
                              onClick={() =>
                                navigate(
                                  `/booking/${appointment.id}/reschedule`,
                                )
                              }
                              disabled={appointment.status === "completed"}
                              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Reschedule
                            </button>

                            <button
                              onClick={() => handleCancel(appointment.id)}
                              disabled={
                                appointment.status === "cancelled" ||
                                appointment.status === "completed"
                              }
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Cancel
                            </button>

                            <Link
                              to={`/booking/${appointment.id}`}
                              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PAST APPOINTMENTS */}
              <div className="mt-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-stone-900">
                    Past Appointments
                  </h2>

                  <span className="rounded-full bg-stone-200 px-3 py-1 text-sm font-semibold text-stone-700">
                    {pastAppointments.length}
                  </span>
                </div>

                {pastAppointments.length === 0 ? (
                  <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="text-stone-500">No past appointments.</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {pastAppointments.map((appointment) => {
                      const service = appointment.service;
                      const staff = appointment.staff;

                      return (
                        <div
                          key={appointment.id}
                          className="rounded-2xl bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="font-bold text-stone-900">
                                  {service?.name || "Salon Service"}
                                </h3>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                    appointment.status,
                                  )}`}
                                >
                                  {appointment.status}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-stone-500">
                                {staff?.name || "Assigned Staff"} •{" "}
                                {formatDate(appointment.appointmentDate)}
                              </p>

                              <p className="mt-1 text-sm text-stone-500">
                                {formatTime(appointment.startTime)} -{" "}
                                {formatTime(appointment.endTime)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {appointment.status === "completed" && (
                                <Link
                                  to={`/appointments/${appointment.id}/review`}
                                  className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                                >
                                  Leave Review
                                </Link>
                              )}

                              <Link
                                to={`/booking/summary`}
                                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
