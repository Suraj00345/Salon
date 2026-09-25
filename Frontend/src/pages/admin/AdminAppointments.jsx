import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";

import {
  getAllAppointments,
  updateAdminAppointmentStatus,
} from "../../api/admin.api";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();

      setAppointments(data.appointments || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await updateAdminAppointmentStatus(id, status);

      loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update appointment");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">Manage Appointments</h1>

          <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
            {loading ? (
              <p className="p-8">Loading...</p>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="p-4">Customer</th>

                    <th className="p-4">Service</th>

                    <th className="p-4">Staff</th>

                    <th className="p-4">Date</th>

                    <th className="p-4">Time</th>

                    <th className="p-4">Status</th>

                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t">
                      <td className="p-4">
                        {appointment.user?.name || "Customer"}
                      </td>

                      <td className="p-4">
                        {appointment.service?.name || "-"}
                      </td>

                      <td className="p-4">{appointment.staff?.name || "-"}</td>

                      <td className="p-4">{appointment.date}</td>

                      <td className="p-4">{appointment.time}</td>

                      <td className="p-4">{appointment.status}</td>

                      <td className="p-4">
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            updateStatus(appointment.id, e.target.value)
                          }
                          className="rounded-lg border px-3 py-2"
                        >
                          <option value="pending">Pending</option>

                          <option value="confirmed">Confirmed</option>

                          <option value="completed">Completed</option>

                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
