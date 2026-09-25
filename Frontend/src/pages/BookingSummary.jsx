import { Navigate, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";

import useBookingStore from "../store/booking.store";
import useAppointmentStore from "../store/appointment.store";
import useAuthStore from "../store/auth.store";

export default function BookingSummary() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const service = useBookingStore((state) => state.service);

  const staff = useBookingStore((state) => state.staff);

  const date = useBookingStore((state) => state.date);

  const time = useBookingStore((state) => state.time);

  const clearBooking = useBookingStore((state) => state.clearBooking);

  const bookAppointment = useAppointmentStore((state) => state.bookAppointment);

  const handleConfirm = async () => {
    try {
      const data = {
        serviceId: service.id,
        staffId: staff.id,
        date,
        time,
      };

      const response = await bookAppointment(data);

      clearBooking();

      navigate("/booking/success", {
        state: {
          appointment: response.appointment,
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!service || !staff || !date || !time) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h1 className="text-3xl font-bold">Booking Summary</h1>

            <div className="mt-8 divide-y divide-stone-200">
              <div className="flex justify-between py-4">
                <span className="text-stone-500">Service</span>

                <span className="font-semibold">{service.name}</span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-stone-500">Stylist</span>

                <span className="font-semibold">{staff.name}</span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-stone-500">Date</span>

                <span className="font-semibold">{date}</span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-stone-500">Time</span>

                <span className="font-semibold">{time}</span>
              </div>

              <div className="flex justify-between py-5">
                <span className="font-bold">Total</span>

                <span className="text-xl font-bold text-amber-600">
                  ₹{service.price}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-8 w-full rounded-xl bg-stone-900 py-4 font-semibold text-white hover:bg-stone-800"
            >
              Confirm Appointment
            </button>

            <button
              onClick={() => navigate("/booking")}
              className="mt-3 w-full rounded-xl border border-stone-300 py-4 font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
