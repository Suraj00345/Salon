import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useBookingStore from "../store/booking.store";
import useStaffStore from "../store/staff.store";

import { getAvailableSlots } from "../api/availability.api";

export default function Booking() {
  const navigate = useNavigate();

  const { service, staff, date, time, setStaff, setDate, setTime } =
    useBookingStore();

  const {
    staff: staffList,
    loading: staffLoading,
    fetchStaff,
  } = useStaffStore();

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load staff
  // --------------------------------------------------
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // --------------------------------------------------
  // Service must exist
  // --------------------------------------------------
  useEffect(() => {
    if (!service) {
      navigate("/services");
    }
  }, [service, navigate]);

  // --------------------------------------------------
  // Filter staff according to selected service
  // --------------------------------------------------
  const availableStaff = staffList.filter((member) => {
    if (!service) return false;

    return member.services?.some(
      (assignedService) => assignedService.id === service.id,
    );
  });

  // --------------------------------------------------
  // Fetch available slots
  // --------------------------------------------------
  useEffect(() => {
    if (!staff || !date || !service) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setError("");

        // Clear previously selected time
        setTime(null);

        const data = await getAvailableSlots(staff.id, service.id, date);

        setSlots(data.slots || []);
      } catch (error) {
        setSlots([]);

        setError(
          error.response?.data?.message || "Failed to load available slots",
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [staff, date, service, setTime]);

  // --------------------------------------------------
  // Select staff
  // --------------------------------------------------
  const handleStaffSelect = (member) => {
    setStaff(member);

    // Clear previous date/time
    setDate(null);
    setTime(null);
    setSlots([]);
    setError("");
  };

  // --------------------------------------------------
  // Select date
  // --------------------------------------------------
  const handleDateChange = (e) => {
    setDate(e.target.value);
    setTime(null);
    setSlots([]);
    setError("");
  };

  // --------------------------------------------------
  // Continue to summary
  // --------------------------------------------------
  const handleContinue = () => {
    if (!staff || !date || !time) {
      setError("Please select staff, date and time.");
      return;
    }

    navigate("/booking/summary");
  };

  // --------------------------------------------------
  // No service selected
  // --------------------------------------------------
  if (!service) {
    return null;
  }

  // --------------------------------------------------
  // Today's date
  // --------------------------------------------------
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div>
          <p className="font-semibold uppercase tracking-widest text-amber-600">
            Book Appointment
          </p>

          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            Choose your appointment
          </h1>

          <p className="mt-2 text-stone-500">
            Select your stylist, date and available time slot.
          </p>
        </div>

        {/* ------------------------------------------------
            Selected Service
        ------------------------------------------------ */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-stone-500">Selected Service</p>

          <div className="mt-2 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                {service.name}
              </h2>

              <p className="mt-1 text-stone-500">{service.duration} minutes</p>
            </div>

            <p className="text-xl font-bold text-amber-600">
              ₹{Number(service.price).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ------------------------------------------------
            Staff
        ------------------------------------------------ */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-stone-900">Choose a Stylist</h2>

          {staffLoading ? (
            <p className="mt-4 text-stone-500">Loading stylists...</p>
          ) : availableStaff.length === 0 ? (
            <div className="mt-5 rounded-lg bg-stone-50 p-5">
              <p className="font-semibold text-stone-700">
                No stylist available
              </p>

              <p className="mt-1 text-sm text-stone-500">
                No stylist is currently assigned to this service.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {availableStaff.map((member) => {
                const isSelected = staff?.id === member.id;

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleStaffSelect(member)}
                    className={`rounded-xl border p-5 text-left transition ${
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-stone-900">
                          {member.name}
                        </h3>

                        {member.specialization && (
                          <p className="mt-1 text-sm text-stone-500">
                            {member.specialization}
                          </p>
                        )}

                        {member.experience !== null &&
                          member.experience !== undefined && (
                            <p className="mt-2 text-xs text-stone-400">
                              {member.experience} years experience
                            </p>
                          )}
                      </div>

                      {isSelected && (
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-stone-950">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ------------------------------------------------
            Date
        ------------------------------------------------ */}
        {staff && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-stone-900">Choose Date</h2>

            <p className="mt-1 text-sm text-stone-500">
              Select a date to check the stylist's availability.
            </p>

            <input
              type="date"
              value={date || ""}
              min={today}
              onChange={handleDateChange}
              className="mt-5 rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        )}

        {/* ------------------------------------------------
            Available Slots
        ------------------------------------------------ */}
        {staff && date && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Available Time
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Choose an available appointment time.
                </p>
              </div>

              {slots.length > 0 && !slotsLoading && (
                <span className="text-sm text-stone-400">
                  {slots.filter((slot) => slot.available).length} available
                </span>
              )}
            </div>

            {slotsLoading ? (
              <div className="mt-5 rounded-lg bg-stone-50 p-5 text-center text-stone-500">
                Checking availability...
              </div>
            ) : slots.length === 0 ? (
              <div className="mt-5 rounded-lg bg-stone-50 p-5">
                <p className="font-medium text-stone-700">No slots available</p>

                <p className="mt-1 text-sm text-stone-500">
                  This stylist may be unavailable on the selected date. Try
                  another date.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected = time === slot.startTime;

                  return (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setTime(slot.startTime)}
                      className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                        !slot.available
                          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
                          : isSelected
                            ? "border-amber-500 bg-amber-500 text-stone-950"
                            : "border-stone-200 hover:border-amber-400 hover:bg-amber-50"
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------
            Continue
        ------------------------------------------------ */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!staff || !date || !time}
            className="rounded-xl bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to Summary
          </button>
        </div>
      </div>
    </div>
  );
}
