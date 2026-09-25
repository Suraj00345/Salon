import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Loading from "../../components/common/Loader";
import { getAdminDashboard } from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <p className="mt-2 text-stone-500">
            Manage your salon from one place.
          </p>

          {loading && <Loading />}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {stats && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Users"
                value={stats.users ?? stats.totalUsers ?? 0}
              />

              <StatCard
                title="Appointments"
                value={stats.appointments ?? stats.totalAppointments ?? 0}
              />

              <StatCard
                title="Services"
                value={stats.services ?? stats.totalServices ?? 0}
              />

              <StatCard
                title="Revenue"
                value={`₹${stats.revenue ?? stats.totalRevenue ?? 0}`}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-stone-900">{value}</p>
    </div>
  );
}
