import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import { getDashboardStats } from "../../api/admin.api";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardStats();

      setDashboard(data.dashboard);
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      setError(
        error.response?.data?.message || "Failed to load dashboard statistics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const stats = dashboard
    ? [
        {
          title: "Total Users",
          value: dashboard.totalUsers,
          description: "Registered customers",
          icon: "👥",
        },
        {
          title: "Total Services",
          value: dashboard.totalServices,
          description: "Active services",
          icon: "✂️",
        },
        {
          title: "Total Staff",
          value: dashboard.totalStaff,
          description: "Active staff members",
          icon: "👨‍💼",
        },
        {
          title: "Appointments",
          value: dashboard.totalAppointments,
          description: "All appointments",
          icon: "📅",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-stone-500">Administration</p>

            <h1 className="text-3xl font-bold text-stone-900 mt-1">
              Admin Dashboard
            </h1>

            <p className="text-stone-600 mt-2">
              Manage your salon operations from one place.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-white disabled:opacity-50 transition"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading && !dashboard ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
            <p className="text-stone-600">Loading dashboard...</p>
          </div>
        ) : dashboard ? (
          <>
            {/* Main statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-stone-500">{stat.title}</p>

                      <p className="text-3xl font-bold text-stone-900 mt-2">
                        {stat.value}
                      </p>

                      <p className="text-xs text-stone-500 mt-2">
                        {stat.description}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-xl">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Appointment statistics */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pending */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-500">
                      Pending Appointments
                    </p>

                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {dashboard.pendingAppointments}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
                    ⏳
                  </div>
                </div>

                <div className="mt-5 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width:
                        dashboard.totalAppointments > 0
                          ? `${Math.min(
                              (dashboard.pendingAppointments /
                                dashboard.totalAppointments) *
                                100,
                              100,
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-500">
                      Completed Appointments
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {dashboard.completedAppointments}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                    ✓
                  </div>
                </div>

                <div className="mt-5 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width:
                        dashboard.totalAppointments > 0
                          ? `${Math.min(
                              (dashboard.completedAppointments /
                                dashboard.totalAppointments) *
                                100,
                              100,
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Cancelled */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-stone-500">
                      Cancelled Appointments
                    </p>

                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {dashboard.cancelledAppointments}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
                    ✕
                  </div>
                </div>

                <div className="mt-5 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width:
                        dashboard.totalAppointments > 0
                          ? `${Math.min(
                              (dashboard.cancelledAppointments /
                                dashboard.totalAppointments) *
                                100,
                              100,
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Revenue */}
            <section className="mt-6">
              <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-stone-500">Total Revenue</p>

                    <p className="text-4xl font-bold text-stone-900 mt-2">
                      {formatCurrency(dashboard.totalRevenue)}
                    </p>

                    <p className="text-sm text-stone-500 mt-2">
                      Based on recorded paid payments
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                    ₹
                  </div>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Quick Actions
                  </h2>

                  <p className="text-sm text-stone-500 mt-1">
                    Manage the main areas of your salon.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Appointments */}
                <Link
                  to="/admin/appointments"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">📅</div>

                  <h3 className="font-semibold text-stone-900">Appointments</h3>

                  <p className="text-sm text-stone-500 mt-1">Manage bookings</p>
                </Link>

                {/* Services */}
                <Link
                  to="/admin/services"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">✂️</div>

                  <h3 className="font-semibold text-stone-900">Services</h3>

                  <p className="text-sm text-stone-500 mt-1">Manage services</p>
                </Link>

                {/* Staff */}
                <Link
                  to="/admin/staff"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">👨‍💼</div>

                  <h3 className="font-semibold text-stone-900">Staff</h3>

                  <p className="text-sm text-stone-500 mt-1">Manage staff</p>
                </Link>

                {/* Staff Applications */}
                <Link
                  to="/admin/staff/applications"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">📋</div>

                  <h3 className="font-semibold text-stone-900">
                    Staff Applications
                  </h3>

                  <p className="text-sm text-stone-500 mt-1">
                    Review professional applications
                  </p>
                </Link>

                {/* Working Hours */}
                <Link
                  to="/admin/working-hours"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">🕐</div>

                  <h3 className="font-semibold text-stone-900">
                    Working Hours
                  </h3>

                  <p className="text-sm text-stone-500 mt-1">
                    Manage schedules
                  </p>
                </Link>

                {/* Users */}
                <Link
                  to="/admin/users"
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className="text-2xl mb-3">👥</div>

                  <h3 className="font-semibold text-stone-900">Users</h3>

                  <p className="text-sm text-stone-500 mt-1">
                    Manage customers
                  </p>
                </Link>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
