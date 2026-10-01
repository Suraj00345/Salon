import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/common/Navbar";
import Loading from "../components/common/Loader";
import useAuthStore from "../store/auth.store";
import {
  getStaffDashboardStats,
  getStaffAppointments,
  updateStaffAppointmentStatus,
} from "../api/staffDashboard.api";

export default function StaffDashboard() {
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState({
    todayCount: 0,
    upcomingCount: 0,
    completedCount: 0,
    totalEarnings: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Load metrics and appointments concurrently
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, appointmentsRes] = await Promise.all([
        getStaffDashboardStats(),
        getStaffAppointments(),
      ]);

      setStats(statsRes.stats || statsRes.data || stats);
      setAppointments(
        appointmentsRes.appointments || appointmentsRes.data || [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load staff dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update Status handler
  const handleStatusChange = async (appointmentId, nextStatus) => {
    try {
      setActionLoadingId(appointmentId);
      await updateStaffAppointmentStatus(appointmentId, nextStatus);

      // Optimistically update appointment state in place
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointmentId ? { ...item, status: nextStatus } : item,
        ),
      );

      // Refresh stats to ensure counters reflect real data
      const statsRes = await getStaffDashboardStats();
      setStats(statsRes.stats || statsRes.data || stats);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter list by selected tab
  const filteredAppointments = useMemo(() => {
    if (selectedFilter === "all") return appointments;
    return appointments.filter((app) => app.status === selectedFilter);
  }, [appointments, selectedFilter]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.slice(0, 5).split(":");
    const d = new Date();
    d.setHours(Number(hours), Number(minutes));
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              Staff Portal
            </div>
            <h1 className="mt-2 text-3xl font-bold text-stone-900">
              Welcome, {user?.name || "Professional"}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Manage your daily appointments and track client visits.
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            className="self-start rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 sm:self-center"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-12">
            <Loading />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Today's Bookings
                </p>
                <p className="mt-2 text-3xl font-extrabold text-stone-900">
                  {stats.todayCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Upcoming
                </p>
                <p className="mt-2 text-3xl font-extrabold text-stone-900">
                  {stats.upcomingCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Completed Total
                </p>
                <p className="mt-2 text-3xl font-extrabold text-stone-900">
                  {stats.completedCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                  Service Volume / Revenue
                </p>
                <p className="mt-2 text-3xl font-extrabold text-stone-900">
                  ₹{stats.totalEarnings?.toLocaleString("en-IN") ?? 0}
                </p>
              </div>
            </div>

            {/* Appointment Section */}
            <div className="mt-10">
              <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-4 sm:flex-row sm:items-center">
                <h2 className="text-xl font-bold text-stone-900">
                  Assigned Appointments
                </h2>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "pending",
                    "confirmed",
                    "completed",
                    "cancelled",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedFilter(status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                        selectedFilter === status
                          ? "bg-stone-900 text-white"
                          : "bg-white text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
                  <p className="text-stone-500">
                    No {selectedFilter !== "all" ? selectedFilter : ""}{" "}
                    appointments assigned to you right now.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {filteredAppointments.map((appointment) => {
                    const isProcessing = actionLoadingId === appointment.id;
                    const customer = appointment.customer || appointment.user;
                    const service = appointment.service;

                    return (
                      <div
                        key={appointment.id}
                        className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
                      >
                        <div>
                          {/* Top Row: Service & Status */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                                Booking #{appointment.id}
                              </span>
                              <h3 className="mt-1 text-lg font-bold text-stone-900">
                                {service?.name || "Service Session"}
                              </h3>
                            </div>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusBadge(
                                appointment.status,
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>

                          {/* Client Information */}
                          <div className="mt-4 rounded-xl bg-stone-50 p-3 text-sm">
                            <p className="font-semibold text-stone-800">
                              Client: {customer?.name || "Guest Customer"}
                            </p>
                            {customer?.phone && (
                              <p className="text-xs text-stone-500">
                                📞 {customer.phone}
                              </p>
                            )}
                            {customer?.email && (
                              <p className="text-xs text-stone-500">
                                ✉️ {customer.email}
                              </p>
                            )}
                          </div>

                          {/* Schedule Details */}
                          <div className="mt-4 space-y-2 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span className="font-medium text-stone-800">
                                {formatDate(appointment.appointmentDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>🕐</span>
                              <span>
                                {formatTime(appointment.startTime)} -{" "}
                                {formatTime(appointment.endTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>💳</span>
                              <span className="capitalize">
                                Status:{" "}
                                <strong className="font-medium text-stone-800">
                                  {appointment.paymentStatus || "pending"}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Workflow Action Buttons */}
                        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                          {appointment.status === "pending" && (
                            <button
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(appointment.id, "confirmed")
                              }
                              className="flex-1 rounded-xl bg-stone-900 py-2 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Updating..."
                                : "Accept / Confirm"}
                            </button>
                          )}

                          {appointment.status === "confirmed" && (
                            <button
                              disabled={isProcessing}
                              onClick={() =>
                                handleStatusChange(appointment.id, "completed")
                              }
                              className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {isProcessing ? "Updating..." : "Mark Completed"}
                            </button>
                          )}

                          {appointment.status !== "cancelled" &&
                            appointment.status !== "completed" && (
                              <button
                                disabled={isProcessing}
                                onClick={() =>
                                  handleStatusChange(
                                    appointment.id,
                                    "cancelled",
                                  )
                                }
                                className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
