import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";

import useBookingStore from "../store/booking.store";
import useStaffStore from "../store/staff.store";
import { getAvailableSlots } from "../api/availability.api";

export default function Booking() {
  const navigate = useNavigate();

  // ==========================================
  // BOOKING STORE
  // ==========================================

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

  // Support existing "time" and "slot" structure
  const selectedTime = time || slot;

  // ==========================================
  // STAFF STORE
  // ==========================================

  const {
    staff: staffList,
    loading: staffLoading,
    fetchStaff,
  } = useStaffStore();

  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // ==========================================
  // NORMALIZE IDS
  // ==========================================

  const serviceId = service?.id ?? service?._id;

  const selectedStaffId = staff?.id ?? staff?._id;

  // ==========================================
  // HYDRATION
  // ==========================================

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ==========================================
  // FETCH STAFF
  // ==========================================

  useEffect(() => {
    if (typeof fetchStaff === "function") {
      fetchStaff();
    }
  }, [fetchStaff]);

  // ==========================================
  // REDIRECT IF NO SERVICE
  // ==========================================

  useEffect(() => {
    if (isHydrated && !service) {
      navigate("/services", {
        replace: true,
      });
    }
  }, [isHydrated, service, navigate]);

  // ==========================================
  // FILTER STAFF BY SERVICE
  // ==========================================

  const availableStaff = useMemo(() => {
    if (!serviceId || !Array.isArray(staffList)) {
      return [];
    }

    return staffList.filter((member) => {
      if (!member) {
        return false;
      }

      // Don't show inactive staff
      if (member.isActive === false) {
        return false;
      }

      /*
       * Support both:
       *
       * services
       * Services
       *
       * depending on Sequelize include configuration.
       */

      const services = Array.isArray(member.services)
        ? member.services
        : Array.isArray(member.Services)
          ? member.Services
          : [];

      const serviceIds = Array.isArray(member.serviceIds)
        ? member.serviceIds
        : [];

      // Check populated service objects
      const hasServiceObject = services.some((assignedService) => {
        const assignedServiceId =
          typeof assignedService === "object"
            ? (assignedService?.id ?? assignedService?._id)
            : assignedService;

        return String(assignedServiceId) === String(serviceId);
      });

      // Check service IDs
      const hasServiceId = serviceIds.some(
        (id) => String(id) === String(serviceId),
      );

      return hasServiceObject || hasServiceId;
    });
  }, [staffList, serviceId]);

  // ==========================================
  // FETCH AVAILABLE SLOTS
  // ==========================================

  useEffect(() => {
    if (!selectedStaffId || !serviceId || !date) {
      setSlots([]);
      return;
    }

    let isMounted = true;

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setError("");

        // Reset previously selected time
        setTime(null);
        setSlot(null);

        const response = await getAvailableSlots(
          selectedStaffId,
          serviceId,
          date,
        );

        if (!isMounted) {
          return;
        }

        const availableSlots = Array.isArray(response?.slots)
          ? response.slots
          : [];

        setSlots(availableSlots);
      } catch (err) {
        console.error("Fetch slots error:", err);

        if (!isMounted) {
          return;
        }

        setSlots([]);

        setError(
          err.response?.data?.message || "Failed to load available time slots.",
        );
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
  }, [selectedStaffId, serviceId, date, setTime, setSlot]);

  // ==========================================
  // SELECT STAFF
  // ==========================================

  const handleStaffSelect = (member) => {
    setStaff(member);

    // Changing staff invalidates date/time selection
    setDate(null);
    setTime(null);
    setSlot(null);

    setSlots([]);
    setError("");
  };

  // ==========================================
  // SELECT DATE
  // ==========================================

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    setDate(selectedDate);

    // Changing date invalidates selected slot
    setTime(null);
    setSlot(null);

    setSlots([]);
    setError("");
  };

  // ==========================================
  // SELECT SLOT
  // ==========================================

  const handleSlotSelect = (selectedSlot) => {
    if (!selectedSlot?.available) {
      return;
    }

    /*
     * Store the COMPLETE selected slot.
     *
     * This is important because createAppointment()
     * requires both startTime and endTime.
     */

    setTime(selectedSlot.startTime);

    setSlot(selectedSlot);

    setError("");
  };

  // ==========================================
  // CONTINUE
  // ==========================================

  const handleContinue = () => {
    if (!staff) {
      setError("Please select a stylist.");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!selectedTime) {
      setError("Please select an available time slot.");
      return;
    }

    if (!slot?.endTime) {
      setError("Selected time slot is invalid. Please select another slot.");
      return;
    }

    /*
     * The selected service, staff, date and COMPLETE slot
     * are already stored in Zustand.
     *
     * Summary page can now create the appointment.
     */

    navigate("/booking/summary");
  };

  // ==========================================
  // TODAY
  // ==========================================

  /*
   * Don't use:
   *
   * new Date().toISOString()
   *
   * because it uses UTC and can produce the wrong
   * calendar date for Indian users.
   */

  const today = (() => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  })();

  // ==========================================
  // LOADING / REDIRECT
  // ==========================================

  if (!isHydrated || !service) {
    return null;
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-stone-100 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* ==========================================
              HEADER
          ========================================== */}

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

          {/* ==========================================
              SELECTED SERVICE
          ========================================== */}

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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
                ₹{Number(service.price || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ==========================================
              CHOOSE STYLIST
          ========================================== */}

          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Choose a Stylist
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Select a professional for your {service.name}.
                </p>
              </div>

              {!staffLoading && (
                <span className="text-sm text-stone-400">
                  {availableStaff.length} available
                </span>
              )}
            </div>

            {/* LOADING */}

            {staffLoading ? (
              <div className="mt-6 rounded-xl bg-stone-50 p-6 text-center">
                <p className="text-stone-500">Loading stylists...</p>
              </div>
            ) : availableStaff.length === 0 ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
                <p className="font-semibold text-stone-800">
                  No stylists available
                </p>

                <p className="mt-1 text-sm text-stone-600">
                  There are currently no active stylists assigned to this
                  service.
                </p>

                {/* DEBUG */}

                <div className="mt-4 rounded-lg bg-white p-3 text-xs text-stone-500">
                  <p>
                    Service ID: <strong>{String(serviceId)}</strong>
                  </p>

                  <p>
                    Staff fetched:{" "}
                    <strong>
                      {Array.isArray(staffList) ? staffList.length : 0}
                    </strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {availableStaff.map((member) => {
                  const memberId = member.id ?? member._id;

                  const isSelected =
                    String(selectedStaffId) === String(memberId);

                  const memberServices = Array.isArray(member.services)
                    ? member.services
                    : Array.isArray(member.Services)
                      ? member.Services
                      : [];

                  return (
                    <button
                      key={memberId}
                      type="button"
                      onClick={() => handleStaffSelect(member)}
                      className={`rounded-xl border p-5 text-left transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-50 shadow-sm"
                          : "border-stone-200 bg-white hover:border-amber-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-stone-900">
                            {member.name}
                          </h3>

                          {member.specialization && (
                            <p className="mt-1 text-sm text-stone-500">
                              {member.specialization}
                            </p>
                          )}

                          {member.experience !== null &&
                            member.experience !== undefined &&
                            member.experience !== "" && (
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

                      {/* SERVICES */}

                      {memberServices.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {memberServices.map((assignedService) => {
                            const id =
                              assignedService?.id ?? assignedService?._id;

                            const name =
                              assignedService?.name ?? `Service ${id}`;

                            return (
                              <span
                                key={id}
                                className={`rounded-full px-2.5 py-1 text-xs ${
                                  String(id) === String(serviceId)
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-stone-100 text-stone-500"
                                }`}
                              >
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==========================================
              CHOOSE DATE
          ========================================== */}

          {staff && (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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

          {/* ==========================================
              AVAILABLE TIME
          ========================================== */}

          {staff && date && (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
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

              {/* SLOT LOADING */}

              {slotsLoading ? (
                <div className="mt-5 rounded-xl bg-stone-50 p-6 text-center text-stone-500">
                  Checking availability...
                </div>
              ) : slots.length === 0 ? (
                <div className="mt-5 rounded-xl border border-stone-200 bg-stone-50 p-6">
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
                  {slots.map((currentSlot) => {
                    const isSelected = selectedTime === currentSlot.startTime;

                    return (
                      <button
                        key={`${currentSlot.startTime}-${currentSlot.endTime}`}
                        type="button"
                        disabled={!currentSlot.available}
                        onClick={() => handleSlotSelect(currentSlot)}
                        className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                          !currentSlot.available
                            ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 opacity-60"
                            : isSelected
                              ? "border-amber-500 bg-amber-500 text-stone-950 shadow-sm"
                              : "border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50"
                        }`}
                      >
                        {currentSlot.startTime}

                        {currentSlot.endTime && (
                          <span className="ml-1 text-xs opacity-70">
                            - {currentSlot.endTime}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              CONTINUE
          ========================================== */}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!staff || !date || !selectedTime || !slot?.endTime}
              className="rounded-xl bg-stone-900 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to Summary
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
