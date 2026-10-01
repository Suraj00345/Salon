import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";

import useAdminAppointmentStore from "../../store/adminAppointment.store";

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStyles = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function AdminAppointments() {
  const appointments = useAdminAppointmentStore((state) => state.appointments);

  const loading = useAdminAppointmentStore((state) => state.loading);

  const updating = useAdminAppointmentStore((state) => state.updating);

  const error = useAdminAppointmentStore((state) => state.error);

  const fetchAppointments = useAdminAppointmentStore(
    (state) => state.fetchAppointments,
  );

  const updateStatus = useAdminAppointmentStore((state) => state.updateStatus);

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFilter = async () => {
    await fetchAppointments({
      ...(statusFilter && {
        status: statusFilter,
      }),
      ...(dateFilter && {
        date: dateFilter,
      }),
    });
  };

  const handleClearFilters = async () => {
    setStatusFilter("");
    setDateFilter("");

    await fetchAppointments();
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);

      await updateStatus(appointmentId, newStatus);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update appointment status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentAmount = (appointment) => {
    if (!appointment.payments?.length) {
      return appointment.service?.price;
    }

    const paidPayment = appointment.payments.find(
      (payment) => payment.status === "paid",
    );

    return paidPayment?.amount || appointment.service?.price;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-stone-500">Admin Panel</p>

            <h1 className="text-3xl font-bold text-stone-900 mt-1">
              Appointments
            </h1>

            <p className="text-stone-600 mt-2">
              Manage customer appointments and booking statuses.
            </p>
          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-white transition"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Filters */}
        <section className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-stone-400"
              >
                <option value="">All statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3">
              <button
                onClick={handleFilter}
                disabled={loading}
                className="flex-1 bg-stone-900 text-white px-4 py-2.5 rounded-lg hover:bg-stone-800 disabled:opacity-50 transition"
              >
                Apply Filters
              </button>

              <button
                onClick={handleClearFilters}
                disabled={loading}
                className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-500">Total</p>

            <p className="text-2xl font-bold text-stone-900 mt-1">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-500">Pending</p>

            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {
                appointments.filter(
                  (appointment) => appointment.status === "pending",
                ).length
              }
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-500">Confirmed</p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {
                appointments.filter(
                  (appointment) => appointment.status === "confirmed",
                ).length
              }
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-500">Completed</p>

            <p className="text-2xl font-bold text-green-600 mt-1">
              {
                appointments.filter(
                  (appointment) => appointment.status === "completed",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Appointments */}
        <section className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-stone-900">Appointment List</h2>

              <p className="text-sm text-stone-500 mt-1">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => fetchAppointments()}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-stone-600">Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📅</div>

              <h3 className="font-semibold text-stone-900">
                No appointments found
              </h3>

              <p className="text-sm text-stone-500 mt-2">
                Try changing your filters.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Customer
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Service
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Staff
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Date & Time
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Payment
                      </th>

                      <th className="text-left px-5 py-4 text-xs font-semibold text-stone-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-stone-50">
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900">
                            {appointment.user?.name || "Unknown"}
                          </p>

                          <p className="text-sm text-stone-500">
                            {appointment.user?.email || "-"}
                          </p>

                          {appointment.user?.phone && (
                            <p className="text-xs text-stone-400 mt-1">
                              {appointment.user.phone}
                            </p>
                          )}
                        </td>

                        {/* Service */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900">
                            {appointment.service?.name || "-"}
                          </p>

                          <p className="text-sm text-stone-500">
                            ₹{appointment.service?.price ?? "-"}
                          </p>
                        </td>

                        {/* Staff */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900">
                            {appointment.staff?.name || "-"}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900">
                            {formatDate(appointment.appointmentDate)}
                          </p>

                          <p className="text-sm text-stone-500">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                          </p>
                        </td>

                        {/* Payment */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              paymentStyles[appointment.paymentStatus] ||
                              "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {appointment.paymentStatus}
                          </span>

                          <p className="text-sm text-stone-600 mt-2">
                            ₹{getPaymentAmount(appointment) ?? "-"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <select
                            value={appointment.status}
                            disabled={updating && updatingId === appointment.id}
                            onChange={(event) =>
                              handleStatusChange(
                                appointment.id,
                                event.target.value,
                              )
                            }
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-0 outline-none cursor-pointer ${
                              statusStyles[appointment.status] ||
                              "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <div className="lg:hidden divide-y divide-stone-200">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-stone-900">
                          {appointment.service?.name || "Service"}
                        </p>

                        <p className="text-sm text-stone-500 mt-1">
                          Appointment #{appointment.id}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div>
                        <p className="text-xs text-stone-500">Customer</p>

                        <p className="text-sm font-medium text-stone-900 mt-1">
                          {appointment.user?.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">Staff</p>

                        <p className="text-sm font-medium text-stone-900 mt-1">
                          {appointment.staff?.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">Date</p>

                        <p className="text-sm font-medium text-stone-900 mt-1">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">Time</p>

                        <p className="text-sm font-medium text-stone-900 mt-1">
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">Payment</p>

                        <span
                          className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            paymentStyles[appointment.paymentStatus] ||
                            "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {appointment.paymentStatus}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">Amount</p>

                        <p className="text-sm font-medium text-stone-900 mt-1">
                          ₹{getPaymentAmount(appointment) ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="block text-xs text-stone-500 mb-2">
                        Update Status
                      </label>

                      <select
                        value={appointment.status}
                        disabled={updating && updatingId === appointment.id}
                        onChange={(event) =>
                          handleStatusChange(appointment.id, event.target.value)
                        }
                        className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium border-0 outline-none ${
                          statusStyles[appointment.status] ||
                          "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
