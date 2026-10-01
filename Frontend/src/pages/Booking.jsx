// src/pages/Booking.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

import useBookingStore from "../store/booking.store";
import useStaffStore from "../store/staff.store";
import { getAvailableSlots } from "../api/availability.api";

export default function Booking() {
  const navigate = useNavigate();

  // Booking store
  const {
    service,
    staff,
    date,
    time,
    slot,
    setStaff,
    setDate,
    setTime,
    setSlot,
  } = useBookingStore();

  // Support either time or slot from store
  const selectedTime = time || slot;

  // Staff store
  const {
    staff: staffList = [],
    loading: staffLoading,
    fetchStaff,
  } = useStaffStore();

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Normalize IDs to handle SQL (id), Mongo (_id), or string/number types
  const serviceId = service?.id ?? service?._id;
  const staffId = staff?.id ?? staff?._id;

  // 1. Mark store as hydrated on mount to avoid premature redirect on page reload
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 2. Fetch staff list on component mount
  useEffect(() => {
    if (typeof fetchStaff === "function") {
      fetchStaff();
    }
  }, [fetchStaff]);

  // 3. Only redirect if hydration is complete and no service exists
  useEffect(() => {
    if (isHydrated && !service) {
      navigate("/services");
    }
  }, [isHydrated, service, navigate]);

  // 4. Robust filter for staff assigned to this service
  const availableStaff = staffList.filter((member) => {
    if (!serviceId) return false;

    // If staff has no services assigned, exclude them
    if (!Array.isArray(member.services) || member.services.length === 0) {
      return false;
    }

    return member.services.some((assignedService) => {
      // Handles member.services = [1, 2] or ["id1", "id2"]
      if (
        typeof assignedService === "string" ||
        typeof assignedService === "number"
      ) {
        return String(assignedService) === String(serviceId);
      }

      // Handles member.services = [{ id: 1 }, { _id: "..." }]
      const assignedId = assignedService?.id ?? assignedService?._id;
      return String(assignedId) === String(serviceId);
    });
  });

  // 5. Fetch available slots when staff, date, and service are all present
  useEffect(() => {
    if (!staffId || !date || !serviceId) {
      setSlots([]);
      return;
    }

    let isMounted = true;

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setError("");

        // Reset selected time when staff or date changes
        if (setTime) setTime(null);
        if (setSlot) setSlot(null);

        const data = await getAvailableSlots(staffId, serviceId, date);

        if (isMounted) {
          setSlots(data?.slots || []);
        }
      } catch (err) {
        if (isMounted) {
          setSlots([]);
          setError(
            err.response?.data?.message || "Failed to load available slots.",
          );
        }
      } finally {
        if (isMounted) {
          setSlotsLoading(false);
        }
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [staffId, date, serviceId, setTime, setSlot]);

  // Handler: Select stylist
  const handleStaffSelect = (member) => {
    setStaff(member);
    setDate(null);
    if (setTime) setTime(null);
    if (setSlot) setSlot(null);
    setSlots([]);
    setError("");
  };

  // Handler: Change date
  const handleDateChange = (e) => {
    setDate(e.target.value);
    if (setTime) setTime(null);
    if (setSlot) setSlot(null);
    setSlots([]);
    setError("");
  };

  // Handler: Select slot
  const handleSlotSelect = (selectedSlot) => {
    const timeValue = selectedSlot.startTime;
    if (setTime) setTime(timeValue);
    if (setSlot) setSlot(timeValue);
  };

  // Handler: Proceed
  const handleContinue = () => {
    if (!staff || !date || !selectedTime) {
      setError("Please select a stylist, date, and available time slot.");
      return;
    }

    navigate("/booking/summary");
  };

  // Prevent flicker during initial load/hydration
  if (!isHydrated || !service) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Navbar />
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
              Select your stylist, date, and available time slot.
            </p>
          </div>

          {/* Selected Service Information */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
            <p className="text-sm font-medium text-stone-500">
              Selected Service
            </p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {service.name}
                </h2>
                <p className="mt-1 text-stone-500">
                  {service.duration} minutes
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                ₹{Number(service.price).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 1. Choose Stylist */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900">
              Choose a Stylist
            </h2>

            {staffLoading ? (
              <p className="mt-4 text-stone-500">Loading stylists...</p>
            ) : availableStaff.length === 0 ? (
              <div className="mt-5 rounded-xl bg-stone-50 p-5 border border-stone-200">
                <p className="font-semibold text-stone-700">
                  No stylists available
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  No stylists are currently assigned to this service or
                  available.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {availableStaff.map((member) => {
                  const currentMemberId = member.id ?? member._id;
                  const isSelected =
                    String(staffId) === String(currentMemberId);

                  return (
                    <button
                      key={currentMemberId}
                      type="button"
                      onClick={() => handleStaffSelect(member)}
                      className={`rounded-xl border p-5 text-left transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/70"
                          : "border-stone-200 hover:border-amber-300 bg-white"
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

          {/* 2. Choose Date */}
          {staff && (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold text-stone-900">Choose Date</h2>
              <p className="mt-1 text-sm text-stone-500">
                Select a date to check available slots for {staff.name}.
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

          {/* 3. Choose Available Slots */}
          {staff && date && (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Available Time
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    Choose a suitable appointment slot.
                  </p>
                </div>

                {slots.length > 0 && !slotsLoading && (
                  <span className="text-sm font-medium text-stone-400">
                    {slots.filter((s) => s.available).length} available
                  </span>
                )}
              </div>

              {slotsLoading ? (
                <div className="mt-5 rounded-xl bg-stone-50 p-6 text-center text-stone-500">
                  Checking availability...
                </div>
              ) : slots.length === 0 ? (
                <div className="mt-5 rounded-xl bg-stone-50 p-6 border border-stone-200">
                  <p className="font-semibold text-stone-700">
                    No slots available
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    This stylist has no open time slots for the chosen date.
                    Please select another date.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((s) => {
                    const isSelected = selectedTime === s.startTime;

                    return (
                      <button
                        key={`${s.startTime}-${s.endTime}`}
                        type="button"
                        disabled={!s.available}
                        onClick={() => handleSlotSelect(s)}
                        className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                          !s.available
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 opacity-60"
                            : isSelected
                              ? "border-amber-500 bg-amber-500 text-stone-950 font-bold shadow-sm"
                              : "border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-800"
                        }`}
                      >
                        {s.startTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!staff || !date || !selectedTime}
              className="rounded-xl bg-stone-900 px-7 py-3.5 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
            >
              Continue to Summary
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
