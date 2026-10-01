import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../common/Navbar";
import Loading from "../common/Loader";

import {
  getAppointmentById,
  rescheduleAppointment,
} from "../../api/appointment.api";

import { getAvailableSlots } from "../../api/availability.api";

export default function RescheduleAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [slots, setSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAppointmentById(id);

        const fetchedAppointment = data.appointment;

        if (!fetchedAppointment) {
          setError("Appointment not found.");
          return;
        }

        if (["completed", "cancelled"].includes(fetchedAppointment.status)) {
          setError("This appointment cannot be rescheduled.");
          return;
        }

        setAppointment(fetchedAppointment);

        setDate(
          fetchedAppointment.appointmentDate
            ? fetchedAppointment.appointmentDate.slice(0, 10)
            : "",
        );
      } catch (error) {
        console.error("Fetch Appointment Error:", error);

        setError(
          error.response?.data?.message || "Failed to load appointment.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  useEffect(() => {
    if (!appointment || !date) {
      setSlots([]);
      setSelectedTime("");
      return;
    }

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setError("");
        setSuccess("");
        setSelectedTime("");

        const data = await getAvailableSlots(
          appointment.staffId,
          appointment.serviceId,
          date,
        );

        setSlots(data.slots || []);
      } catch (error) {
        console.error("Available Slots Error:", error);

        setSlots([]);

        setError(
          error.response?.data?.message || "Failed to load available slots.",
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [appointment, date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
    setSelectedTime("");
    setSlots([]);
    setError("");
    setSuccess("");
  };

  const handleReschedule = async () => {
    if (!appointment || !date || !selectedTime) {
      setError("Please select a date and an available time slot.");
      return;
    }

    const selectedSlot = slots.find((slot) => slot.startTime === selectedTime);

    if (!selectedSlot) {
      setError("Selected time slot is no longer available.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const bookingData = {
        appointmentDate: date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      };

      await rescheduleAppointment(appointment.id, bookingData);

      setSuccess("Appointment rescheduled successfully.");

      setTimeout(() => {
        navigate(`/booking/${appointment.id}`, { replace: true });
      }, 1200);
    } catch (error) {
      console.error("Reschedule Error:", error);

      setError(
        error.response?.data?.message || "Failed to reschedule appointment.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.slice(0, 5).split(":");

    const date = new Date();

    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="flex justify-center px-6 py-16">
          <Loading />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Unable to reschedule
            </h2>

            <p className="mt-2 text-red-600">
              {error || "Appointment not found."}
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-lg bg-stone-900 px-5 py-2.5 font-semibold text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* BACK */}
          <button
            onClick={() => navigate(`/booking/${appointment.id}`)}
            className="mb-6 text-sm font-semibold text-stone-600 hover:text-stone-900"
          >
            ← Back to Appointment
          </button>

          {/* HEADER */}
          <div className="rounded-2xl bg-stone-900 p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm text-stone-300">
              Reschedule Appointment #{appointment.id}
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {appointment.service?.name || "Salon Service"}
            </h1>

            <p className="mt-2 text-stone-300">
              Stylist: {appointment.staff?.name || "Assigned Staff"}
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* CURRENT APPOINTMENT */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              Current Appointment
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-stone-400">Date</p>

                <p className="mt-1 font-semibold text-stone-800">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-400">Time</p>

                <p className="mt-1 font-semibold text-stone-800">
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* SELECT DATE */}
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              Choose New Date
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Select a date to see available appointment times.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Appointment Date
              </label>

              <input
                type="date"
                value={date}
                min={today}
                onChange={handleDateChange}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-900 sm:max-w-sm"
              />
            </div>
          </div>

          {/* AVAILABLE SLOTS */}
          {date && (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Available Times
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    Choose one available time slot.
                  </p>
                </div>

                {slots.length > 0 && (
                  <span className="text-sm text-stone-500">
                    {slots.filter((slot) => slot.available).length} available
                  </span>
                )}
              </div>

              {slotsLoading ? (
                <div className="py-8 text-center text-stone-500">
                  Loading available times...
                </div>
              ) : slots.length === 0 ? (
                <div className="mt-5 rounded-xl bg-stone-100 p-6 text-center">
                  <p className="font-medium text-stone-700">
                    No appointment slots available
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    Please select another date.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((slot) => {
                    const isSelected = selectedTime === slot.startTime;

                    return (
                      <button
                        key={`${slot.startTime}-${slot.endTime}`}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.startTime)}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          !slot.available
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                            : isSelected
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-300 text-stone-700 hover:border-stone-900 hover:bg-stone-50"
                        }`}
                      >
                        {formatTime(slot.startTime)}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedTime && (
                <div className="mt-6 rounded-xl bg-stone-100 p-4">
                  <p className="text-sm text-stone-500">New appointment</p>

                  <p className="mt-1 font-bold text-stone-900">
                    {formatDate(date)}
                  </p>

                  <p className="mt-1 font-semibold text-stone-700">
                    {formatTime(selectedTime)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/booking/${appointment.id}`)}
              className="rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReschedule}
              disabled={saving || slotsLoading || !date || !selectedTime}
              className="rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
