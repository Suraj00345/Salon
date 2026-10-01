import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import Loading from "../common/Loader";
import { getAppointmentById } from "../../api/appointment.api";
import useAppointmentStore from "../../store/appointment.store";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const cancel = useAppointmentStore((state) => state.cancel);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAppointmentById(id);
        setAppointment(data.appointment);
      } catch (error) {
        console.error("Appointment Details Error:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load appointment details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    try {
      setCancelLoading(true);
      setError("");

      await cancel(Number(id));

      setAppointment((current) => ({
        ...current,
        status: "cancelled",
      }));
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to cancel appointment.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Not available";
    const [hours, minutes] = time.slice(0, 5).split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
      return "Not available";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount));
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

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-700">
              Unable to load appointment
            </h2>

            <p className="mt-2 text-red-600">{error}</p>

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

  if (!appointment) {
    return null;
  }

  const service = appointment.service;
  const staff = appointment.staff;

  const isCancelled = appointment.status === "cancelled";

  const isCompleted = appointment.status === "completed";

  const canModify = !isCancelled && !isCompleted;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* BACK */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-sm font-semibold text-stone-600 hover:text-stone-900"
          >
            ← Back to Dashboard
          </button>

          {/* HEADER */}
          <div className="rounded-2xl bg-stone-900 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-stone-300">
                  Appointment #{appointment.id}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {service?.name || "Salon Appointment"}
                </h1>

                <p className="mt-2 text-stone-300">
                  {formatDate(appointment.appointmentDate)}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                  appointment.status,
                )}`}
              >
                {appointment.status}
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* APPOINTMENT INFORMATION */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* SERVICE */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">
                Service Details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-stone-400">Service</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {service?.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-400">Duration</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {service?.duration
                      ? `${service.duration} minutes`
                      : "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-400">Price</p>

                  <p className="mt-1 text-xl font-bold text-stone-900">
                    {formatCurrency(service?.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* STAFF */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">
                Stylist Details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-stone-400">Name</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {staff?.name || "Assigned Staff"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-400">Specialization</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {staff?.specialization || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-400">Experience</p>

                  <p className="mt-1 font-semibold text-stone-800">
                    {staff?.experience
                      ? `${staff.experience} years`
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">
                Appointment Schedule
              </h2>

              <div className="mt-5 space-y-4">
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

            {/* PAYMENT */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">
                Payment Details
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-stone-400">Payment Status</p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                      appointment.paymentStatus,
                    )}`}
                  >
                    {appointment.paymentStatus || "pending"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-stone-400">Amount</p>

                  <p className="mt-1 text-xl font-bold text-stone-900">
                    {formatCurrency(service?.price)}
                  </p>
                </div>

                {appointment.payments?.length > 0 && (
                  <div>
                    <p className="text-sm text-stone-400">Payment Method</p>

                    <p className="mt-1 font-semibold capitalize text-stone-800">
                      {
                        appointment.payments[appointment.payments.length - 1]
                          ?.gateway
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NOTES */}
          {appointment.notes && (
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900">Your Notes</h2>

              <p className="mt-3 whitespace-pre-wrap text-stone-600">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900">
              Manage Appointment
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {canModify && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/booking/${appointment.id}/reschedule`)
                    }
                    className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancelLoading ? "Cancelling..." : "Cancel Appointment"}
                  </button>
                </>
              )}

              {isCompleted && (
                <Link
                  to={`/appointments/${appointment.id}/review`}
                  className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  Leave a Review
                </Link>
              )}

              <Link
                to="/dashboard"
                className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
