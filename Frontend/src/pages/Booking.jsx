import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import BookingSteps from "../components/booking/BookingSteps";

import useBookingStore from "../store/booking.store";
import useAuthStore from "../store/auth.store";

import { getStaff, getAvailableSlots } from "../api/staff.api";

export default function Booking() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const service = useBookingStore((state) => state.service);

  const staff = useBookingStore((state) => state.staff);

  const date = useBookingStore((state) => state.date);

  const time = useBookingStore((state) => state.time);

  const setStaff = useBookingStore((state) => state.setStaff);

  const setDate = useBookingStore((state) => state.setDate);

  const setTime = useBookingStore((state) => state.setTime);

  const [staffList, setStaffList] = useState([]);
  const [slots, setSlots] = useState([]);

  const [loadingStaff, setLoadingStaff] = useState(true);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaff = async () => {
      try {
        setLoadingStaff(true);

        const data = await getStaff();

        setStaffList(data.staff || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load staff");
      } finally {
        setLoadingStaff(false);
      }
    };

    loadStaff();
  }, []);

  useEffect(() => {
    if (!staff || !date) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");

        const data = await getAvailableSlots(staff.id, date);

        setSlots(data.slots || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load available slots",
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [staff, date]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const handleContinue = () => {
    if (!staff) {
      setError("Please select a staff member.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!time) {
      setError("Please select a time.");
      return;
    }

    navigate("/booking/summary");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <BookingSteps currentStep={2} />

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-stone-900">
              Book Appointment
            </h1>

            <div className="mt-3 rounded-xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">Selected Service</p>

              <div className="mt-1 flex justify-between">
                <span className="font-semibold">{service.name}</span>

                <span className="font-bold text-amber-600">
                  ₹{service.price}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Staff */}
            <div className="mt-8">
              <h2 className="text-xl font-bold">Select Staff</h2>

              {loadingStaff ? (
                <p className="mt-4 text-stone-500">Loading staff...</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {staffList.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setStaff(member);
                        setTime(null);
                      }}
                      className={`rounded-xl border p-5 text-left transition ${
                        staff?.id === member.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-xl text-white">
                        {member.name?.charAt(0)}
                      </div>

                      <h3 className="mt-3 font-bold">{member.name}</h3>

                      <p className="text-sm text-stone-500">
                        {member.specialization || "Professional Stylist"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            {staff && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">Select Date</h2>

                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date || ""}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime(null);
                  }}
                  className="mt-4 rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Slots */}
            {staff && date && (
              <div className="mt-10">
                <h2 className="text-xl font-bold">Select Time</h2>

                {loadingSlots ? (
                  <p className="mt-4 text-stone-500">
                    Loading available slots...
                  </p>
                ) : slots.length === 0 ? (
                  <p className="mt-4 text-stone-500">
                    No available slots for this date.
                  </p>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {slots.map((slot) => {
                      const slotValue =
                        typeof slot === "string" ? slot : slot.time;

                      return (
                        <button
                          key={slotValue}
                          onClick={() => setTime(slotValue)}
                          className={`rounded-xl border px-4 py-3 font-semibold ${
                            time === slotValue
                              ? "border-amber-500 bg-amber-500 text-stone-950"
                              : "border-stone-200 bg-white hover:border-stone-400"
                          }`}
                        >
                          {slotValue}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="mt-10 w-full rounded-xl bg-stone-900 py-4 font-semibold text-white transition hover:bg-stone-800"
            >
              Continue to Summary
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
